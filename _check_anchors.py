"""站内锚点链接检查（本地即可跑，无需先构建）。

用法: python _check_anchors.py
退出码: 0 = 全部有效, 1 = 有失效锚点

背景：
  页内锚点若写成 `](#某个标题)`，MkDocs 会用 toc 扩展把标题转成 id。
  但 **slugify 会丢弃标题里的中文** —— 例如标题「二、restful-booker：最推荐的接口练习靶场」
  生成的 id 只有 `restful-booker`。照抄标题原文写锚点必然失效。

  这类错误 CI 能通过 lychee --include-fragments 抓到，但本地原先没有任何对应检查，
  于是只能在推送后才发现（曾导致一次 CI 构建失败 + 部署阻断）。
  本脚本把这项检查提前到本地。

实现说明：
  用 Markdown 库按 **与 mkdocs.yml 相同的扩展配置** 渲染每个 md 文件，
  再从渲染结果里取标题 id。经实测，其产物与 MkDocs 构建出的标题 id 完全一致
  （见文件末尾的 --self-test），所以无需依赖 4 分钟的构建。

注意：
  扩展列表需与 mkdocs.yml 的 markdown_extensions 保持同步；若有改动，
  跑 `python _check_anchors.py --self-test` 可与构建产物比对确认。
"""
import io
import re
import sys
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

import markdown

ROOT = Path(__file__).resolve().parent
DOCS = ROOT / "docs"
SITE = ROOT / "site"

# 与 mkdocs.yml 的 markdown_extensions 对齐（只保留影响标题 id 的部分也够，
# 但全量引入更贴近真实渲染，避免围栏/内联内容被误判为标题）
MD_EXTENSIONS = [
    "abbr", "admonition", "attr_list", "def_list", "footnotes", "md_in_html",
    "tables", "toc", "pymdownx.arithmatex", "pymdownx.betterem", "pymdownx.caret",
    "pymdownx.details", "pymdownx.emoji", "pymdownx.highlight",
    "pymdownx.inlinehilite", "pymdownx.keys", "pymdownx.mark",
    "pymdownx.smartsymbols", "pymdownx.superfences", "pymdownx.tabbed",
    "pymdownx.tasklist", "pymdownx.tilde",
]
MD_CONFIG = {"toc": {"permalink": True}}

FRONTMATTER = re.compile(r"\A---\r?\n.*?\r?\n---\r?\n", re.S)
HEADING_ID = re.compile(r'<h[1-6][^>]*\bid="([^"]+)"')
# Markdown 链接中的片段：](#frag) 或 ](path.md#frag)
FRAG_LINK = re.compile(r"\]\(([^)\s]*?)#([^)\s]+)\)")
# HTML 锚点：<a href="#frag"> 或 <a href="path.md#frag">。
# 首页与章节练习页大量使用 HTML 形式的页内跳转，漏掉这种写法会留下检查盲区。
HTML_FRAG_LINK = re.compile(r'''href=["']([^"']*?)#([^"']+)["']''')


def strip_frontmatter(text: str) -> str:
    return FRONTMATTER.sub("", text, count=1)


FENCE = re.compile(r"^(\s*)(`{3,}|~{3,}).*?^\1\2\s*$", re.S | re.M)
INLINE_CODE = re.compile(r"`[^`\n]*`")


def strip_code(text: str) -> str:
    """去掉围栏代码块与行内代码。

    代码块里常出现“讲链接写法”的示例（如 `](#foo)`），
    它们在正文里不是真链接，必须排除，否则产生误报。
    """
    text = FENCE.sub("", text)
    return INLINE_CODE.sub("", text)


def page_key(md_path: Path) -> str:
    """把 docs 下的 md 路径转成站点目录形式（用于互相引用时的定位）。

    a/b.md      -> a/b
    a/index.md  -> a
    index.md    -> ''
    """
    rel = md_path.relative_to(DOCS).as_posix()
    if rel.endswith("/index.md"):
        rel = rel[: -len("/index.md")]
    elif rel == "index.md":
        rel = ""
    elif rel.endswith(".md"):
        rel = rel[:-3]
    return rel


def extract_ids(md_path: Path) -> set:
    """渲染单个 md，返回它包含的所有标题 id。"""
    text = strip_frontmatter(md_path.read_text(encoding="utf-8"))
    html = markdown.markdown(text, extensions=MD_EXTENSIONS,
                             extension_configs=MD_CONFIG)
    return set(HEADING_ID.findall(html))


def collect_ids() -> dict:
    ids = {}
    for md in DOCS.rglob("*.md"):
        ids[page_key(md)] = extract_ids(md)
    return ids


def resolve_target(source: Path, target: str) -> str:
    """把链接目标解析成 page_key；空 target 表示指向本页。"""
    if target == "":
        return page_key(source)
    joined = (source.parent.relative_to(DOCS) / target).as_posix()
    # 复用同一套规范化：先补成 .md 再走 page_key
    return page_key(DOCS / (joined if joined.endswith(".md") else joined + ".md"))


def check() -> int:
    page_ids = collect_ids()
    broken = []
    checked = 0
    unresolved = []

    for md in sorted(DOCS.rglob("*.md")):
        raw = strip_frontmatter(md.read_text(encoding="utf-8"))
        body = strip_code(raw)

        # 两种链接写法都要覆盖：Markdown 的 ](...#frag) 与 HTML 的 href="...#frag"
        candidates = []
        for m in FRAG_LINK.finditer(body):
            candidates.append((m.group(1), m.group(2)))
        for m in HTML_FRAG_LINK.finditer(body):
            target, frag = m.group(1), m.group(2)
            # 纯页内跳转（href="#frag"）target 为空串
            candidates.append((target, frag))

        for target, frag in candidates:
            if target.startswith(("http://", "https://", "mailto:")):
                continue
            key = resolve_target(md, target)
            if key not in page_ids:
                unresolved.append((md, target, frag))
                continue
            checked += 1
            if frag not in page_ids[key]:
                broken.append((md, target, frag, key))

    print(f"扫描 {len(page_ids)} 个文档，核对 {checked} 处站内锚点")
    if unresolved:
        print(f"（另有 {len(unresolved)} 处未能定位目标页，交由断链检查处理）")
        for md, target, frag in unresolved[:5]:
            print(f"    {md.relative_to(ROOT)} → {target}#{frag}")

    if broken:
        print(f"\n发现 {len(broken)} 处失效锚点：\n")
        for md, target, frag, key in broken:
            print(f"  {md.relative_to(ROOT)}")
            print(f"    锚点  : {target}#{frag}")
            available = sorted(i for i in page_ids[key] if not i.isdigit())
            print(f"    目标页实际 id: {available[:12]}")
            print()
        print("修法：")
        print("  1) 锚点不要照抄标题原文——slugify 会丢弃中文，")
        print("     `## 二、restful-booker：…` 生成的 id 只有 `restful-booker`。")
        print("  2) 想自定义 id 就把属性写在标题**同一行**：`## 标题 { #my-id }`。")
        print("     写成标题的下一行会失效（attr_list 只认同行写法）。")
        return 1

    print("站内锚点全部有效")
    return 0


# 主题模板注入、而非源自 Markdown 标题的 id。
# 例如 overrides/partials/comments.html 会插入 <h2 id="__comments">评论</h2>，
# 它不在源码里，做自检比对时必须排除。
THEME_INJECTED_IDS = {"__comments"}


def self_test() -> int:
    """与 site/ 构建产物比对，确认提取结果与 MkDocs 一致。"""
    if not SITE.exists():
        print("site/ 不存在，跳过硬编码自检（先跑 mkdocs build）")
        return 0

    mismatch = 0
    compared = 0
    for md in sorted(DOCS.rglob("*.md")):
        rel = md.relative_to(DOCS)
        if rel.stem == "index":
            built = SITE / rel.parent / "index.html"
        else:
            built = SITE / rel.parent / rel.stem / "index.html"
        if not built.exists():
            continue
        compared += 1
        built_ids = set(HEADING_ID.findall(
            built.read_text(encoding="utf-8", errors="replace")))
        built_ids -= THEME_INJECTED_IDS
        src_ids = extract_ids(md)
        if src_ids != built_ids:
            mismatch += 1
            if mismatch <= 5:
                print(f"  不一致 {rel.as_posix()}")
                print(f"    仅源码有: {sorted(src_ids - built_ids)[:6]}")
                print(f"    仅构建有: {sorted(built_ids - src_ids)[:6]}")

    print(f"自检：比对 {compared} 个页面，{mismatch} 个不一致")
    if mismatch:
        print("→ 说明扩展配置与 mkdocs.yml 已漂移，或 site/ 过期，请更新 MD_EXTENSIONS")
        return 1
    print("提取结果与 MkDocs 构建产物一致")
    return 0


if __name__ == "__main__":
    if "--self-test" in sys.argv:
        sys.exit(self_test())
    sys.exit(check())
