"""校验 Markdown 表格的两类结构问题。

一、表格单元格里的「裸 HTML 标签」
背景（真实事故）：
  教程表格里有一格写了未转义的 <script>，构建产物变成真实的 <script> 标签。
  HTML 解析器进入 script 状态后会一直吞到下一个 </script>，
  导致其后所有内容（含页脚、相关推荐）被塞进 <table>，
  表现为页脚浮在表格上、表格右侧列被截断。

二、表格行的「空首列」
背景（真实事故）：
  表格行写成 `|| A | B |` 或 `| | A | B |`，会多出一个空单元格，
  渲染后第一列全空、内容整体右移一列。

判定规则：
  - 表格行中出现形如 <tag> 的真实标签，且未被反引号或 &lt; 包裹 → 报错
  - 表格行的第一个单元格为空（`||` 或 `| |`）→ 报错
"""
import re
import sys
import io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

DOCS = Path('docs')

# 只关心这些「会破坏文档结构」的标签；<br> 是 Material 表格里合法的换行写法
DANGEROUS = {
    'script', 'style', 'div', 'table', 'thead', 'tbody', 'tr', 'td', 'th',
    'p', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'form', 'input', 'button', 'select', 'textarea', 'iframe', 'svg', 'img', 'a', 'span',
}

problems = []
scanned = 0

for p in sorted(DOCS.rglob('*.md')):
    lines = p.read_text(encoding='utf-8').splitlines()
    in_fence = False          # 是否处于 ``` 代码块内
    fence_marker = None

    for i, line in enumerate(lines, 1):
        # ---- 维护代码块状态 ----
        # 代码块内的 | 开头行不是表格（例如 ```text 里写 `|| true 的作用：...`）
        m_fence = re.match(r'^\s*(`{3,}|~{3,})', line)
        if m_fence:
            marker = m_fence.group(1)[0]
            if not in_fence:
                in_fence = True
                fence_marker = marker
            elif marker == fence_marker:
                in_fence = False
                fence_marker = None
            continue
        if in_fence:
            continue

        stripped_line = line.lstrip()
        if not stripped_line.startswith('|'):
            continue
        scanned += 1

        # ---- 拆出各单元格内容 ----
        # 去掉首尾竖线后按 | 切分（表格内没有转义竖线时够用）
        inner = stripped_line
        if inner.startswith('|'):
            inner = inner[1:]
        if inner.rstrip().endswith('|'):
            inner = inner.rstrip()[:-1]
        cells = [c.strip() for c in inner.split('|')]

        # ---- 检查一：空首列（但其他列有内容） ----
        # 全空行是模板里「留给填写」的合法写法，不报；
        # 首列为空、其余有内容才是真的错位 bug。
        is_separator_row = all(re.fullmatch(r':?-{2,}:?', c) for c in cells if c) and any(cells)
        if len(cells) >= 2 and not is_separator_row:
            others_have_content = any(c for c in cells[1:])
            if cells[0] == '' and others_have_content:
                problems.append((p, i, '空首列（内容整体右移一列）', '', line.strip()))

        # ---- 检查二：裸 HTML 标签 ----
        stripped = re.sub(r'`[^`]*`', '', line)          # 去掉行内代码
        stripped = stripped.replace('&lt;', '').replace('&gt;', '')  # 去掉已转义
        for m in re.finditer(r'<\s*(/?)\s*([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>', stripped):
            _closing, tag = m.group(1), m.group(2).lower()
            if tag not in DANGEROUS or tag == 'br':
                continue
            problems.append((p, i, f'裸 HTML 标签 {m.group(0)}', m.group(0), line.strip()))
            break  # 一行只报一次

print(f'扫描 {scanned} 行表格内容（已跳过代码块）\n')
if problems:
    print(f'发现 {len(problems)} 处表格结构问题:\n')
    for p, i, kind, raw, line in problems:
        print(f'  {p.relative_to(DOCS)}:{i}')
        print(f'    问题: {kind}')
        print(f'    行: {line[:90]}')
    print('\n修法：')
    print('  - 裸标签 → 用反引号包裹（`<script>`）或转义为 &lt;script&gt;')
    print('  - 空首列 → 去掉多余的竖线（把 `|| A |` 改成 `| A |`）')
    sys.exit(1)

print('全部表格结构正常：无裸 HTML 标签、无空首列错位')

