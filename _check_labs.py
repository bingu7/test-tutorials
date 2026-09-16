"""校验所有在线练习（code-lab）的题面 JSON 合法性与结构完整性。

用法: python _check_labs.py
退出码: 0 = 全部合法, 1 = 有问题

检查项：
  1. 每个 <script class="code-lab-spec"> 都是合法 JSON
  2. 必备字段齐全（title / starterCode / tests），tests 非空且每项含 name / code
  3. prelude（可选的预置数据）语法正确
  4. 每个 .code-lab 容器都有对应的 spec（数量匹配，避免渲染空白框）
  5. 每个容器都有 data-lab-id（结果要按 id 写入学习进度，缺 id 会记不上）
  6. lab-id 不重复
  7. learning-progress.js 里引用的 lab id 必须真实存在（否则进度面板永远显示未完成）
"""
import json
import re
import sys
import io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

DOCS = Path('docs')
PROGRESS_JS = DOCS / 'javascripts' / 'learning-progress.js'

# 属于「阶段教程」的页面 → 阶段，用于检查练习是否注册进该阶段。
# 只登记确属某阶段的教程页；练习场、总览等辅助页不计入阶段进度，故不在此列。
PAGE_PHASE = {
    'Python基础教程-软件测试版.md': 'phase4',
    '正则表达式教程-软件测试版.md': 'phase2',
    'JMeter性能测试教程-软件测试版.md': 'phase3',
}

found = 0
problems = []
seen_ids = {}


def collect():
    """返回 {lab_id: 文件}"""
    ids = {}
    for p in sorted(DOCS.rglob('*.md')):
        text = p.read_text(encoding='utf-8')
        for m in re.finditer(r'<div class="code-lab"\s+data-lab-id="([^"]+)"', text):
            ids.setdefault(m.group(1), []).append(p.name)
    return ids


for p in sorted(DOCS.rglob('*.md')):
    text = p.read_text(encoding='utf-8')

    specs = re.findall(
        r'<script type="application/json" class="code-lab-spec">\s*(.*?)\s*</script>',
        text, re.S)
    containers = re.findall(r'<div class="code-lab"([^>]*)>', text)

    if len(containers) != len(specs):
        problems.append(f'{p.name} 容器数 {len(containers)} != 题面数 {len(specs)}')
        print(f'  FAIL {p.name}: 容器与题面数量不匹配（{len(containers)} vs {len(specs)}）')

    for i, raw in enumerate(specs):
        found += 1
        try:
            spec = json.loads(raw)
        except Exception as e:
            problems.append(f'{p.name} spec#{i + 1} JSON 非法: {e}')
            print(f'  FAIL {p.name} spec#{i + 1}: JSON 非法 -> {e}')
            continue

        bad = []
        for key in ('title', 'starterCode', 'tests'):
            if key not in spec:
                bad.append(f'缺字段 {key}')
        tests = spec.get('tests')
        if not isinstance(tests, list) or not tests:
            bad.append('tests 为空')
        else:
            for j, t in enumerate(tests):
                if 'name' not in t or 'code' not in t:
                    bad.append(f'test#{j + 1} 缺 name/code')

        if spec.get('prelude'):
            try:
                compile(spec['prelude'], '<prelude>', 'exec')
            except SyntaxError as e:
                bad.append(f'prelude 语法错误: {e}')

        # 容器必须有 data-lab-id
        if i < len(containers):
            attrs = containers[i]
            m = re.search(r'data-lab-id="([^"]+)"', attrs)
            if not m:
                bad.append('容器缺 data-lab-id（进度无法记录）')
            else:
                lid = m.group(1)
                if lid in seen_ids:
                    bad.append(f'lab-id「{lid}」重复（已出现在 {seen_ids[lid]}）')
                else:
                    seen_ids[lid] = p.name

        if bad:
            problems.append(f'{p.name} spec#{i + 1}: ' + '; '.join(bad))
            print(f'  FAIL {p.name} spec#{i + 1}: ' + '; '.join(bad))
        else:
            extra = ', 含 prelude' if spec.get('prelude') else ''
            print(f'  OK   {p.name}: {spec["title"]} '
                  f'({len(spec["tests"])} 项检查{extra})')

print()

# ---- 校验 learning-progress.js 里的 lab 注册 ----
# 只从每个阶段的 labs: [...] 数组里取（不要用「按 id 前缀猜」的方式——
# 那样新增一个前缀不同的 lab 就会被静默跳过，等于没检查）。
if PROGRESS_JS.exists():
    js = PROGRESS_JS.read_text(encoding='utf-8')

    refs = re.findall(r"labs:\s*\[(.*?)\]", js, re.S)
    lab_ids = []
    for block in refs:
        lab_ids.extend(re.findall(r"id:\s*'([^']+)'", block))

    dangling = [r for r in lab_ids if r not in seen_ids]
    if dangling:
        for d in dangling:
            problems.append(f'learning-progress.js 引用了不存在的 lab id「{d}」')
            print(f'  FAIL learning-progress.js: lab id「{d}」在页面中不存在')
    else:
        print(f'  OK   learning-progress.js: 注册的 {len(lab_ids)} 个 lab id 均存在')

    # 反向检查：位于「阶段教程」页面上的练习必须注册，否则不计入阶段进度
    # 注意 seen_ids[lid] 存的是字符串（首次出现该 id 的页面名），不是列表
    if PAGE_PHASE:
        unregistered = []
        for lid, first_page in seen_ids.items():
            phase = PAGE_PHASE.get(first_page)
            if phase and lid not in lab_ids:
                unregistered.append((lid, first_page, phase))
        if unregistered:
            for lid, name, phase in unregistered:
                problems.append(f'「{name}」上的练习「{lid}」未注册到 {phase} 的 labs')
                print(f'  FAIL {name}: 练习「{lid}」未注册到 {phase}，不会计入阶段进度')
        elif lab_ids:
            print(f'  OK   阶段教程页面上的练习均已注册到对应阶段')

print()
if problems:
    print(f'发现 {len(problems)} 处问题（共 {found} 个练习）')
    sys.exit(1)
print(f'全部 {found} 个练习的题面 JSON 合法、结构完整、lab-id 唯一且与进度配置一致')


