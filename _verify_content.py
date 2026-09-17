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

# 已声明的「刻意改名」：{文件路径: {旧标题, ...}}
# 只有写在这里的旧标题才允许消失；其余一律按「丢失」报错。
# 之所以默认严格：本门禁的存在意义就是抓住「编辑器误吞相邻标题行」，
# 而误报的代价（多写一行声明）远小于漏报的代价（内容静默丢失）。
RENAMES = {
    'docs/专项测试/AI辅助测试教程-软件测试版.md': {
        '### 1.1 2025 年行业趋势',                # → 1.1 行业现状
        '### 10.3 Red Teaming（对抗性测试）',     # → 10.4（因新增 10.3 OWASP 小节而顺延）
        '### 10.4 LLM 输出一致性测试',            # → 10.5
        '## 十二、自愈测试（Self-Healing Tests）', # → 十二、自愈测试与官方测试 Agent
        '### 12.2 Playwright 的 AI 定位',         # → 12.2 定位策略的稳定度排序
        '### 12.3 自愈测试实践建议',              # → 12.4
    },
    'docs/学习中心/第5阶段-项目面试通关.md': {
        # 新增「四、求职落地」章节后，原第四至第八节编号顺延一位
        '## 四、测验入口',                        # → 五、测验入口
        '## 五、作品集模板',                      # → 六、作品集模板
        '## 六、面试表达模板',                    # → 七、面试表达模板
        '## 七、通关判断',                        # → 八、通关判断
        '## 八、下一步',                          # → 九、下一步
    },
}


def run(args, cwd=None):
    r = subprocess.run(args, capture_output=True, encoding='utf-8',
                       errors='replace', cwd=cwd)
    return r.stdout


def check_headings():
    # -z: NUL 分隔且不对非 ASCII 路径做八进制转义
    raw = run(['git', 'diff', '--name-only', '-z'], cwd=ROOT)
    files = [p for p in raw.split('\0') if p.strip().lower().endswith('.md')]
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
        if not lost:
            print(f'  OK   {path}')
            continue

        # 「改名」与「丢失」无法从标题文本自动区分（两者都是"原文不见了"）。
        # 因此采用**严格默认 + 显式放行**：
        #   默认按丢失处理（宁可误报，也不能漏报——本门禁的存在意义就是
        #   抓住编辑器误吞标题行这类事故）；
        #   确实是刻意改名的，写进 RENAMES 显式声明。
        allowed = RENAMES.get(path, set())
        real_lost = [h for h in lost if h not in allowed]
        renamed = [h for h in lost if h in allowed]

        if renamed:
            print(f'  （已声明改名 {len(renamed)} 处）')

        if real_lost:
            bad.append(path)
            print(f'  FAIL {path}')
            for h in real_lost:
                print(f'        丢失标题: {h}')
            print(f'        → 若是刻意改名，请把旧标题加入 _verify_content.py 的 RENAMES')
        else:
            print(f'  OK(改名 {len(renamed)} 处) {path}')

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
