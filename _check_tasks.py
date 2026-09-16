"""检查所有「动手任务」章节的结构完整性与代码围栏配平。

目的：动手任务里大量使用嵌套在 admonition 内的 ``` 代码块，
      围栏未配平会导致后续整段内容被吞进代码块（渲染事故）。
"""
import re
import sys
import io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
DOCS = Path('docs')

problems = []
files_with_task = []

for p in sorted(DOCS.rglob('*.md')):
    text = p.read_text(encoding='utf-8')
    if not re.search(r'^##\s*动手任务', text, re.M):
        continue
    files_with_task.append(p)

    # 1) 围栏配平：统计行首(可缩进)的 ``` 数量，必须为偶数
    fences = re.findall(r'^\s*```', text, re.M)
    balanced = len(fences) % 2 == 0

    # 2) 必备小节是否齐全
    required = ['### 任务背景', '### 任务要求', '### 提交物', '### 完成标准']
    missing = [r for r in required if r not in text]
    has_answer = '??? tip "参考答案与思路' in text

    status = 'OK'
    issues = []
    if not balanced:
        issues.append(f'代码围栏数 {len(fences)} 为奇数（未配平）')
    if missing:
        issues.append('缺小节: ' + ', '.join(missing))
    if not has_answer:
        issues.append('缺折叠式参考答案')

    if issues:
        status = 'FAIL'
        problems.append((p, issues))

    print(f'  {status:4} {p.name}')
    for i in issues:
        print(f'         - {i}')

print(f'\n共 {len(files_with_task)} 篇含动手任务')
if problems:
    print(f'发现问题 {len(problems)} 篇')
    sys.exit(1)
print('全部结构完整、围栏配平')
