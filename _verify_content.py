"""一次性跑完所有内容完整性校验。

用法: python _verify_content.py
退出码: 0 = 全部通过, 1 = 有问题

检查项：
  1. 标题不丢失：改动文档相对 git HEAD 未少任何 ## 级标题
     （edit 工具曾多次静默吞掉相邻标题行，此检查用于兜住这类回归）
  2. 计数一致：见 _check_counts.py
"""
import re
import subprocess
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

ROOT = None
import pathlib
ROOT = pathlib.Path(__file__).resolve().parent


def run(args, cwd=None):
    r = subprocess.run(args, capture_output=True, encoding='utf-8',
                       errors='replace', cwd=cwd)
    return r.stdout


def check_headings():
    # -z: NUL 分隔且不对非 ASCII 路径做八进制转义
    raw = run(['git', 'diff', '--name-only', '-z'], cwd=ROOT)
    files = [p for p in raw.split('\0') if p.strip().lower().endswith('.md')]
    intentional = {'README.md'}   # 计数标题变化是刻意的
    bad = []
    print('--- 标题完整性 ---')
    if not files:
        print('  (无改动 .md 文件)')
        return bad
    for path in files:
        old = run(['git', 'show', f'HEAD:{path}'], cwd=ROOT)
        if not old.strip():
            print(f'  SKIP(新文件) {path}')
            continue
        try:
            new = (ROOT / path).read_text(encoding='utf-8')
        except OSError:
            print(f'  SKIP(读取失败) {path}')
            continue
        old_h = [m.strip() for m in re.findall(r'^#{2,} .*$', old, re.M)]
        new_h = [m.strip() for m in re.findall(r'^#{2,} .*$', new, re.M)]
        lost = [h for h in old_h if h not in new_h]
        if lost and path in intentional:
            real = [h for h in lost if not re.match(r'^#{2,4} .+[（(]\s*\d+\s*篇\s*[)）]$', h)]
            if not real:
                print(f'  OK(计数调整) {path}')
                continue
            lost = real
        if lost:
            bad.append(path)
            print(f'  FAIL {path}')
            for h in lost:
                print(f'        丢失标题: {h}')
        else:
            print(f'  OK   {path}')
    return bad


def check_counts():
    print('\n--- 计数一致性 ---')
    r = subprocess.run([sys.executable, str(ROOT / '_check_counts.py')],
                       capture_output=True, encoding='utf-8', errors='replace',
                       cwd=ROOT)
    tail = [l for l in r.stdout.splitlines() if l.strip()][-6:]
    for l in tail:
        print('  ' + l)
    return r.returncode


if __name__ == '__main__':
    bad_h = check_headings()
    rc = check_counts()
    print()
    if bad_h or rc != 0:
        print('校验失败')
        sys.exit(1)
    print('全部内容完整性校验通过')
