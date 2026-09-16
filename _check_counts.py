"""校验首页 / README / CLAUDE.md 的计数口径与实际文件数一致。

用法: python _check_counts.py
退出码: 0 = 全部一致, 1 = 有偏差

背景：站点的"篇数"曾长期失真（首页标题 90+ 而明细表实为 117、
README 九个分区里五个停留在补测验之前）。此脚本把口径变成可自动校验的断言。

计数口径：
  正文档 = docs 下所有 .md，排除 404.md 与 CHANGELOG.md

分类来源：
  - 子目录页面按其目录名自动归类（基础理论 / 工具操作 / ...）
  - docs 根目录页面必须在下方的 ROOT_CATEGORY 中显式登记。
    新增根目录页面却忘记登记时，脚本会**明确报出该文件并失败**，
    而不是像以前那样让它静默掉出所有分类、只留一句含糊的「合计不符」。
"""
import re
import sys
import io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

ROOT = Path(__file__).resolve().parent
DOCS = ROOT / 'docs'

# 不参与「正文档」计数的元页面
META = {'404.md', 'CHANGELOG.md'}

# docs 根目录页面 → 首页明细表中的分类（新增根目录页面必须在此登记）
ROOT_CATEGORY = {
    'index.md': '首页',
    '学习中心.md': '学习中心',
    '学习路线.md': '学习路线',
    '工具选型指南.md': '学习辅助',
    '阶段学习检查清单.md': '学习辅助',
    '章节练习与参考答案.md': '学习辅助',
    '练习总览.md': '学习辅助',
    '学习验收与通关路径.md': '学习辅助',
}


def actual_counts():
    """返回 (总正文档数, {分类: 数量}, 未归类文件列表)"""
    total = 0
    per_dir = {}
    unclassified = []

    for p in sorted(DOCS.rglob('*.md')):
        if p.name in META:
            continue
        total += 1
        if p.parent == DOCS:
            # 根目录页面按显式登记归类
            cat = ROOT_CATEGORY.get(p.name)
            if cat is None:
                unclassified.append(p.name)
                continue
        else:
            cat = p.parent.name
        per_dir[cat] = per_dir.get(cat, 0) + 1

    # 学习中心目录的页面与根目录的「学习中心.md」合并为同一分类
    # （根目录那份已在 ROOT_CATEGORY 里登记为「学习中心」，此处天然合并）

    # 登记了但文件不存在 → 说明有人删了页面却没清理登记表
    missing_files = [f for f in ROOT_CATEGORY if not (DOCS / f).exists()]

    return total, per_dir, unclassified, missing_files


def parse_index_table():
    """从 docs/index.md 解析明细表 {分类: 数字}"""
    text = (DOCS / 'index.md').read_text(encoding='utf-8')
    out = {}
    for name, num in re.findall(r'^\s*\|\s*([^|*]+?)\s*\|\s*(\d+)\s*\|', text, re.M):
        name = name.strip()
        if name in ('分类', '合计'):
            continue
        out[name] = int(num)
    return out


def main():
    total, per_dir, unclassified, missing_files = actual_counts()
    problems = []

    print(f'实际正文档总数（排除 404/CHANGELOG）: {total}\n')

    # --- 0. 根目录页面必须全部登记 ---
    if unclassified:
        print('根目录页面登记核对:')
        for f in unclassified:
            problems.append(f'根目录页面「{f}」未在 ROOT_CATEGORY 中登记分类')
            print(f'  FAIL {f}: 未登记分类（会从所有分类里静默消失）')
        print()
    if missing_files:
        print('登记表完整性核对:')
        for f in missing_files:
            problems.append(f'ROOT_CATEGORY 登记了「{f}」，但该文件不存在')
            print(f'  FAIL {f}: 已登记但文件不存在（请清理登记表）')
        print()

    # --- 1. 首页明细表 ---
    table = parse_index_table()
    print('首页明细表核对:')
    for name, actual in sorted(per_dir.items()):
        claim = table.get(name)
        if claim is None:
            problems.append(f'首页明细表缺少分类「{name}」（实际 {actual} 篇）')
            print(f'  FAIL {name}: 表内未列出，实际 {actual}')
        elif claim != actual:
            problems.append(f'首页明细表「{name}」= {claim}，实际 {actual}')
            print(f'  FAIL {name}: 表内 {claim} / 实际 {actual}')
        else:
            print(f'  OK   {name}: {actual}')
    for name in table:
        if name not in per_dir:
            problems.append(f'首页明细表多出未识别分类「{name}」')
            print(f'  FAIL 表内多出未识别分类「{name}」')

    tsum = sum(table.values())
    classified = sum(per_dir.values())
    print(f'\n  表内合计 = {tsum} / 已归类 = {classified} / 实际总数 = {total}')
    if classified != total:
        problems.append(f'有 {total - classified} 个文件未归入任何分类')
        print(f'  FAIL 未归类文件数 = {total - classified}')
    elif tsum != total:
        problems.append(f'首页明细表合计 {tsum}，实际 {total}')
        print('  FAIL 合计不符')
    else:
        print('  OK   合计一致')

    # --- 2. README 分区标题 ---
    readme = (ROOT / 'README.md').read_text(encoding='utf-8')
    print('\nREADME 分区标题核对:')
    for name, claim in re.findall(r'^### (.+?)（(\d+) 篇）', readme, re.M):
        name = name.strip()
        actual = per_dir.get(name)
        if actual is None:
            problems.append(f'README 出现未识别分区「{name}」（表内 {claim}）')
            print(f'  FAIL 未识别的分区「{name}」（表内 {claim}）')
            continue
        if int(claim) != actual:
            problems.append(f'README「{name}」= {claim}，实际 {actual}')
            print(f'  FAIL {name}: README {claim} / 实际 {actual}')
        else:
            print(f'  OK   {name}: {claim}')

    # --- 3. 标题必须与总数精确相等 ---
    # 口径已从模糊的「N+」收紧为精确值：任何加减页都必须同步改标题，
    # 否则门禁拦住——避免再次出现「标题写 90+、明细表却是 117」这种自相矛盾。
    print('\n标题口径核对（要求精确相等）:')
    index_text = (DOCS / 'index.md').read_text(encoding='utf-8')

    m = re.search(r'^description:\s*(\d+)\s*篇', index_text, re.M)
    if not m:
        problems.append('首页 description 未使用「N 篇」精确口径')
        print('  FAIL 首页 description 未找到精确篇数')
    elif int(m.group(1)) != total:
        problems.append(f'首页 description = {m.group(1)} 篇，实际 {total}')
        print(f'  FAIL 首页 description: {m.group(1)} / 实际 {total}')
    else:
        print(f'  OK   首页 description: {total} 篇')

    m = re.search(r'<strong>(\d+)</strong><span>篇系统教程', index_text)
    if not m:
        problems.append('首页统计卡片未使用精确篇数')
        print('  FAIL 首页统计卡片未找到精确篇数')
    elif int(m.group(1)) != total:
        problems.append(f'首页统计卡片 = {m.group(1)}，实际 {total}')
        print(f'  FAIL 首页统计卡片: {m.group(1)} / 实际 {total}')
    else:
        print(f'  OK   首页统计卡片: {total}')

    m = re.search(r'\| \*\*合计\*\* \| \*\*(\d+)\*\*', index_text)
    if not m:
        problems.append('首页明细表缺少「合计」行')
        print('  FAIL 首页明细表无合计行')
    elif int(m.group(1)) != total:
        problems.append(f'首页明细表合计行 = {m.group(1)}，实际 {total}')
        print(f'  FAIL 首页明细表合计行: {m.group(1)} / 实际 {total}')
    else:
        print(f'  OK   首页明细表合计行: {total}')

    m = re.search(r'(\d+)\s*篇文档', readme)
    if not m:
        problems.append('README 标题未使用精确口径')
        print('  FAIL README 标题未找到精确篇数')
    elif int(m.group(1)) != total:
        problems.append(f'README 标题 = {m.group(1)} 篇，实际 {total}')
        print(f'  FAIL README 标题: {m.group(1)} / 实际 {total}')
    else:
        print(f'  OK   README 标题: {total} 篇')

    print()
    if problems:
        print(f'发现 {len(problems)} 处计数偏差:')
        for p in problems:
            print(f'  - {p}')
        sys.exit(1)
    print(f'全部计数口径精确一致（共 {total} 篇）')


if __name__ == '__main__':
    main()
