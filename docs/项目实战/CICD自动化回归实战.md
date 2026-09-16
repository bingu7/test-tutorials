---
description: CI/CD 自动化回归实战，流水线阶段、测试分层和质量门禁。
---
# CI/CD 自动化回归实战

!!! info “概述”
    本实战用于把接口自动化、Web 自动化、测试报告和部署流程接入 CI/CD。**前置依赖：请先学完 [Jenkins CI/CD](../持续集成/Jenkins-CICD教程-软件测试版.md)、[GitHub Actions](../持续集成/GitHub-Actions教程-软件测试版.md) 再跟做本实战。**，让测试从”本地手动跑”变成”代码变更后自动反馈质量风险”。

---

## 新手导读

| 项目 | 说明 |
|------|------|
| 适合人群 | 已有自动化用例，想让它们在 GitHub Actions 或 Jenkins 中自动运行的新手 |
| 前置知识 | Git、Pytest、依赖安装、环境变量、测试报告基础 |
| 最终产出 | 一条可手动触发的回归流水线、测试报告归档、失败诊断思路 |
| 跟练方式 | 先跑最小 `pytest` workflow，再逐步加入 Secret、报告、Web 浏览器依赖和通知 |
| 常见卡点 | Secret 写进代码；失败日志不会看；测试集太重；报告没有上传 |

流水线学习要从“能跑一次”开始。第一次成功后再加复杂能力，每加一个能力都确认失败时能看懂日志。

---

## 一、项目目标

本项目目标是搭建一条面向测试回归的流水线：

```text
代码提交
  ↓
安装依赖
  ↓
构建或启动测试环境
  ↓
执行接口自动化
  ↓
执行 Web 自动化冒烟
  ↓
生成测试报告
  ↓
归档日志和截图
  ↓
通知结果
```

第一版重点是稳定跑通核心回归，不追求把所有测试都塞进流水线。

如果你是新手，可以先把 CI/CD 理解成：

```text
CI：代码一变，就自动构建和测试。
CD：测试通过后，自动部署或准备发布。
```

测试人员参与 CI/CD，重点不是写部署脚本，而是把自动化测试放进流水线，让团队更早发现问题。

---

## 二、先从最小流水线开始

不要一开始就做复杂流水线。先完成最小版本：

```text
拉代码
  ↓
安装依赖
  ↓
运行 pytest
  ↓
上传测试报告
```

最小版本跑通后，再逐步加入 Web 自动化、Allure 报告、通知和质量门禁。

一个最小 GitHub Actions 示例：

```yaml
name: Minimal Tests

on:
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-python@v6
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: pytest
```

这个版本虽然简单，但已经完成了“手动点一下，自动跑测试”的第一步。

---

## 三、流水线阶段

| 阶段 | 说明 |
|------|------|
| Checkout | 拉取代码 |
| Setup | 安装 Python、Node、浏览器等依赖 |
| Build | 构建应用或文档 |
| API Test | 执行接口自动化 |
| Web Smoke | 执行 Web 冒烟自动化 |
| Report | 生成 Allure / HTML 报告 |
| Archive | 保存日志、截图、Trace、报告 |
| Notify | 通知团队结果 |

不同团队可以使用 Jenkins、GitHub Actions、GitLab CI 或其他平台。核心思想一致：让质量反馈自动化。

---

## 四、测试分层

不要把所有测试都放在一次流水线里。建议分层：

| 层级 | 触发时机 | 内容 |
|------|----------|------|
| 冒烟测试 | 每次提交或合并 | 登录、核心接口、核心页面 |
| 接口回归 | 每日定时或合并前 | P0/P1 接口 |
| Web 回归 | 每日定时 | 稳定主流程 |
| 性能基线 | 发版前或定期 | 核心接口性能对比 |
| 安全扫描 | 发版前 | 基础安全检查 |

流水线越频繁，测试集越要轻量稳定；耗时长的测试适合定时或发版前执行。

---

## 五、触发策略

常见触发方式：

| 触发方式 | 适用场景 |
|----------|----------|
| push | 每次提交后快速反馈 |
| pull request | 合并前质量检查 |
| schedule | 每日定时回归 |
| workflow_dispatch | 手动触发 |
| tag | 发版时触发 |

GitHub Actions 示例：

```yaml
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  workflow_dispatch:
  schedule:
    - cron: "0 18 * * *"
```

定时任务使用 UTC 时间，配置时要换算成本地时间。

---

## 六、环境与密钥管理

流水线中不要硬编码敏感信息。

| 信息 | 推荐方式 |
|------|----------|
| 测试环境地址 | 环境变量或配置文件 |
| 登录账号 | CI Secret |
| 登录密码 | CI Secret |
| 数据库密码 | CI Secret |
| SSH 私钥 | CI Secret |
| Token | CI Secret 或运行时动态获取 |

GitHub Actions 中可以这样读取：

```yaml
env:
  BASE_URL: ${{ secrets.TEST_BASE_URL }}
  TEST_USER: ${{ secrets.TEST_USER }}
  TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
```

测试代码中再通过环境变量读取，不要写死在仓库里。

---

## 七、新手配置步骤

以 GitHub Actions 为例：

1. 在仓库中新建 `.github/workflows/test.yml`。
2. 写入最小 workflow。
3. 提交并推送到 GitHub。
4. 打开仓库的 Actions 页面。
5. 手动点击 `Run workflow`。
6. 查看运行日志。
7. 如果失败，先看失败步骤名称，再展开具体日志。

第一次成功后，再逐步加：

- 环境变量。
- 测试报告上传。
- Web 浏览器依赖。
- 定时触发。
- PR 检查。

---

## 八、自动化执行

### 8.1 接口自动化

```bash
pytest tests/api --alluredir=reports/allure-results
```

适合放入每次提交后的快速回归。

### 8.2 Web 冒烟自动化

```bash
pytest tests/web/smoke --alluredir=reports/allure-results
```

Web 自动化应控制数量，优先选择稳定主流程。页面频繁变化时，不要让大量 UI 用例阻塞每次提交。

### 8.3 失败策略

建议：

- 冒烟测试失败可以阻塞合并。
- 完整回归失败先通知团队，不一定立即阻塞所有开发。
- 环境不可用要和真实缺陷区分开。

---

## 九、报告归档

每次流水线至少保存：

| 产物 | 用途 |
|------|------|
| Allure 结果 | 查看用例执行详情 |
| HTML 报告 | 快速浏览结果 |
| 日志 | 定位接口、环境、脚本问题 |
| 截图 | 定位 UI 自动化失败 |
| Trace | 回放 Playwright 失败场景 |
| JUnit XML | 给 CI 平台展示测试结果 |

GitHub Actions 示例：

```yaml
- name: Upload artifacts
  uses: actions/upload-artifact@v4
  with:
    name: test-artifacts
    path: |
      reports/
      screenshots/
      traces/
```

---

## 十、失败诊断

流水线失败后，先判断失败类型：

| 类型 | 特征 | 处理方式 |
|------|------|----------|
| 代码缺陷 | 同一用例稳定失败，业务结果异常 | 提缺陷并关联提交 |
| 环境问题 | 服务不可达、数据库连接失败 | 通知环境负责人 |
| 测试数据问题 | 数据不存在、账号状态异常 | 修复数据准备流程 |
| 脚本问题 | 定位器失效、断言过强 | 修复自动化脚本 |
| 依赖问题 | 包安装失败、浏览器缺失 | 固定依赖和镜像 |

不要看到红色流水线就直接说“代码有 Bug”，先用日志和报告定位失败原因。

---

## 十一、流水线失败怎么看

新手可以按这个顺序排查：

```text
第一步：看哪个步骤失败
  Install dependencies 失败：多半是依赖安装问题。
  Run tests 失败：再看具体测试日志。
  Upload artifacts 失败：多半是路径不存在。

第二步：看错误信息第一行和最后一行
  第一行常提示失败类型。
  最后一行常提示退出码。

第三步：判断是环境、脚本还是业务问题
  环境问题：服务连不上、依赖装不上。
  脚本问题：定位器找不到、断言写错。
  业务问题：接口返回结果确实不符合预期。
```

排查时要保留日志链接和失败截图，不要只说“流水线红了”。

---

## 十二、通知机制

通知内容应简洁明确：

```text
项目：电商系统自动化回归
分支：main
提交：abc123
结果：失败
失败用例：3 / 120
主要失败模块：订单模块
报告地址：https://...
处理建议：优先查看订单创建接口失败日志
```

通知渠道可以是：

- 邮件。
- 企业微信。
- 钉钉。
- Slack。
- GitHub PR Check。

通知不是越多越好。只有清晰、可行动的通知才有价值。

---

## 十三、质量门禁

质量门禁用于决定是否允许合并或发布。

示例规则：

| 门禁 | 规则 |
|------|------|
| 构建 | 必须成功 |
| 冒烟测试 | P0 用例必须 100% 通过 |
| 接口回归 | 通过率不低于 98% |
| 严重缺陷 | 不允许存在 P0/P1 未关闭缺陷 |
| 性能基线 | 核心接口 P95 不超过基线 20% |

门禁要循序渐进，不要一开始设置过严，导致团队绕过流水线。

---

## 十四、练习任务

请完成下面练习：

1. 新建一个只运行 `pytest` 的 workflow。
2. 手动触发一次。
3. 故意写一个失败用例，观察 Actions 日志。
4. 修复失败用例，再触发一次。
5. 增加测试报告归档。
6. 写一段流水线执行说明。

完成标准：

- 能在 Actions 页面看到成功和失败记录。
- 能说清楚失败发生在哪个步骤。
- 能下载或查看测试报告。
- 能说明这条流水线适合放哪些测试，不适合放哪些测试。

---

## 十五、GitHub Actions 示例

```yaml
name: Regression Tests

on:
  workflow_dispatch:
  pull_request:
    branches:
      - main

jobs:
  regression:
    runs-on: ubuntu-latest
    env:
      BASE_URL: ${{ secrets.TEST_BASE_URL }}
      TEST_USER: ${{ secrets.TEST_USER }}
      TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}

    steps:
      - uses: actions/checkout@v6

      - uses: actions/setup-python@v6
        with:
          python-version: "3.12"

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Install browsers
        run: playwright install --with-deps

      - name: Run API tests
        run: pytest tests/api --alluredir=reports/allure-results

      - name: Run Web smoke tests
        run: pytest tests/web/smoke --alluredir=reports/allure-results

      - name: Upload artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: regression-artifacts
          path: |
            reports/
            screenshots/
            traces/
```

真实项目中可以把接口测试和 Web 测试拆成两个 job，提高可读性和定位效率。

---

## 十六、维护规范

| 问题 | 建议 |
|------|------|
| 流水线越来越慢 | 分层执行，保留快速冒烟集 |
| 误报过多 | 优化等待、测试数据和环境稳定性 |
| 报告没人看 | 通知中直接给出失败摘要和报告地址 |
| Secret 泄露风险 | 不在日志中打印密码、Token、私钥 |
| 用例没人维护 | 为每个模块指定维护负责人 |

CI/CD 自动化回归的目标不是“让机器跑一堆脚本”，而是让团队尽早知道核心功能是否被破坏，并且能快速定位原因。

---

## 动手任务：找出「流水线永远绿色」的原因并修复

> 这是本教程的收尾练习。请**独立完成**，不要先看参考答案。目标不是把流水线跑通，而是能识别「假绿」，并建立真正能拦住问题的质量门禁。

### 任务背景

团队上线后连续两次出现线上故障，但 CI 流水线最近 30 天**全绿**。复盘会上 CTO 问了一句：「你们的流水线到底在测什么？」没人答得上来。

你接到任务：审计这条流水线，找出它为什么拦不住问题，并给出修复后的配置。注意 —— 你的目标不是让流水线变红，而是让它在**真的有缺陷时**变红。

### 任务准备

现有流水线配置（GitHub Actions，脱敏，示例）：

```yaml
name: ci

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - name: Install deps
        run: pip install -r requirements.txt
      - name: Run tests
        run: pytest tests/ -q || true
      - name: Summary
        run: echo "All tests executed"
```

```text
补充事实（审计采集）：
1. 触发条件只有 push 到 main，PR 提交不触发。
2. 最近 30 天 47 次运行，全部 success，平均耗时 1m48s。
3. tests/ 目录只有 12 个用例，全部是 smoke 标记。
4. 历史失败记录：0 次。
5. 两次线上故障的根因：
   - 故障 A：优惠券门槛判断由 >= 改成 >，无任何用例覆盖
   - 故障 B：订单状态机漏了一个分支，只在手工回归时被发现
6. deploy.yml 与 ci.yml 无任何依赖关系，deploy 在 ci 之外独立触发。
7. requirements.txt 无版本锁定，某次因依赖升级导致本地行为变化，CI 未察觉。
```

```text
仓库测试资产现状：
  tests/smoke/        12 个用例（登录、下单主流程）
  tests/regression/   87 个用例（未接入 CI）
  tests/perf/         0 个（压测脚本在 JMeter 目录，未接入）
  覆盖率：未采集
  Allure/JUnit 报告：本地生成，未归档到 CI
```

### 任务要求

请依次完成，并**保留每条命令和输出**：

1. **逐项定位「假绿」原因**：把上面 7 条事实逐条映射为「具体配置缺陷 → 导致的漏拦截场景」，输出表格：事实 / 缺陷类型 / 会漏掉什么类别的缺陷。至少要有 5 类不同缺陷类型（触发时机、退出码、覆盖范围、依赖关系、可观测性）。

2. **写出可拦截故障 A / B 的最小验证**：分别说明需要新增什么用例、用什么断言，并写出这两个用例的代码骨架（Pytest）。要求：故障 A 必须能通过边界值（299.99 / 300.00 / 300.01）来区分 `>` 与 `>=`。

3. **重写流水线配置**：给出修复后的 `ci.yml`，必须包含：正确的触发条件、真实退出码、分层执行（冒烟 + 回归）、依赖锁定校验、失败报告归档、部署门禁依赖。要求配置可直接替换使用。

4. **交付门禁清单 + 验收脚本**：输出质量门禁清单（表格：门禁项 / 阈值 / 失败时行为 / 负责人），并写一段脚本，能自动校验「流水线配置是否仍存在 `|| true` 之类的吞错写法」和「deploy 是否依赖 test」——即给流水线上线一把「防止回退」的锁。

### 提交物

| 产出 | 要求 |
|------|------|
| 假绿原因表 | 7 条事实全覆盖，≥ 5 类缺陷类型 |
| 故障复现用例 | 故障 A / B 各 ≥ 1 个用例，含断言 |
| 修复后 ci.yml | 可直接替换，能拦截上述两类故障 |
| 门禁清单 | 表格，含阈值与负责人 |
| 校验脚本 | 可运行，能检测吞错与依赖缺失 |

### 完成标准

- [ ] 能说清 `|| true` 为什么会让流水线永远成功
- [ ] 能解释「PR 不触发只 push 触发」导致的拦截时机滞后
- [ ] 能说明「只有 12 条 smoke」为什么不足以守住核心业务
- [ ] 能给出「测试通过才允许部署」的依赖关系写法
- [ ] 校验脚本能真正检出配置回退，而不是只做字符串匹配

??? tip "参考答案与思路（先自己做完再看）"

    **第 1 题：假绿原因表**

    | 事实 | 缺陷类型 | 会漏掉什么缺陷 |
    |------|----------|----------------|
    | 1. 只 push 到 main 触发 | 触发时机 | 问题在 push 后才暴露，PR 阶段无人拦截；且故障已进主干 |
    | 2. 47 次全 success | 可观测性（结果造假） | 无法区分「真的没问题」和「根本没测」 |
    | 3. 只有 12 条 smoke | 覆盖范围 | 优惠券门槛、订单状态机、边界值全部无覆盖 |
    | 4. 失败记录 0 次 | 退出码掩盖 | 与事实 30 天全绿互相印证，说明测试从未真正生效 |
    | 5.（参见下一题） | 断言缺失 | 业务规则变更无边界用例 |
    | 6. deploy 与 ci 无依赖 | 依赖关系 | 测试失败仍可部署，门禁形同虚设 |
    | 7. 依赖未锁定 | 环境一致性 | 依赖升级引起的回归在 CI 不可见 |

    核心一条：`pytest tests/ -q || true`

    ```text
    || true 的作用：无论 pytest 退出码是 0 还是 1，
                   整个 step 的退出码都被强制改为 0。
    → 测试失败时 step 仍 success，job 仍 success，流水线仍绿。
    → 这是「假绿」的第一原因，也是最先要删掉的东西。
    ```

    第二条同样致命：`deploy.yml` 与 `ci.yml` 无依赖，等于**测试与部署完全解耦**，即使把 `|| true` 删掉，部署也不会被拦住。要修就得引入 workflow 间依赖或把 deploy 作为同一 workflow 的后置 job。

    **第 2 题：故障 A / B 的最小验证**

    故障 A（优惠券门槛 `>=` 被写成 `>`）：核心是构造**恰好等于门槛**的订单，并断言折扣命中。

    ```python
    # tests/regression/test_coupon_threshold.py
    import pytest
    from decimal import Decimal

    @pytest.mark.parametrize("unit_price, qty, expect_discount", [
        ("149.99", 2, "0.00"),    # 299.98  门槛下 → 不打折
        ("150.00", 2, "50.00"),   # 300.00  恰好门槛 → 必须打折（区分 > 与 >=）
        ("150.01", 2, "50.00"),   # 300.02  门槛上 → 打折
    ])
    def test_coupon_threshold_boundary(api, coupon_300_minus_50, unit_price, qty, expect_discount):
        order = api.create_order(unit_price=unit_price, quantity=qty,
                                 coupon_id=coupon_300_minus_50.id)
        assert order["data"]["discount_amount"] == expect_discount, (
            f"商品应付 {Decimal(unit_price) * qty}，门槛 300："
            f"期望 discount={expect_discount}，实际 {order['data']['discount_amount']}"
        )
        # 同时用 SQL 校验落库金额，避免只测了响应体
        assert order["data"]["pay_amount"] == str(
            Decimal(unit_price) * qty - Decimal(expect_discount)
        )
    ```

    这个用例之所以能拦住故障 A：`>` 实现下，300.00 会得到 `discount=0.00`，第 2 组参数直接失败。**只写「买 500 元打折」这类用例是拦不住 `>` 和 `>=` 的区别的**，这是本题的关键。

    故障 B（订单状态机漏分支）：核心是把状态迁移做成**表驱动**，覆盖每一条合法/非法迁移。

    ```python
    # tests/regression/test_order_state_machine.py
    import pytest

    LEGAL = [
        ("CREATED",   "PAID"),
        ("PAID",      "SHIPPED"),
        ("SHIPPED",   "COMPLETED"),
        ("CREATED",   "CANCELLED"),
        ("PAID",      "REFUNDING"),
        ("REFUNDING", "REFUNDED"),
    ]
    ILLEGAL = [("COMPLETED", "CANCELLED"), ("REFUNDED", "PAID"), ("SHIPPED", "CREATED")]

    @pytest.mark.parametrize("src,dst", LEGAL)
    def test_legal_transition(api, order_in_state, src, dst):
        order = order_in_state(src)
        resp = api.transition(order.id, dst)
        assert resp.status_code == 200 and resp.json()["data"]["status"] == dst

    @pytest.mark.parametrize("src,dst", ILLEGAL)
    def test_illegal_transition_rejected(api, order_in_state, src, dst):
        order = order_in_state(src)
        resp = api.transition(order.id, dst)
        assert resp.status_code == 400, f"{src}→{dst} 应被拒绝，实际 {resp.status_code}"
    ```

    要点：`ILLEGAL` 列表就是**漏分支探测器**。研发漏了一个分支，往往表现为「非法迁移返回 200」，这条用例直接把状态机的完整性钉住了。

    **第 3 题：修复后的 ci.yml**

    ```yaml
    name: ci

    on:
      pull_request:
        branches: [main]
      push:
        branches: [main]

    concurrency:
      group: ci-${{ github.ref }}
      cancel-in-progress: true

    jobs:
      smoke:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - uses: actions/setup-python@v5
            with:
              python-version: "3.11"
              cache: pip
          - name: 依赖锁定校验
            run: |
              pip install -r requirements.txt
              pip freeze > /tmp/frozen.txt
              # 关键包必须精确锁定，防止依赖漂移引起的假绿
              grep -E '^(requests|pytest|allure-pytest)==' /tmp/frozen.txt
          - name: 冒烟集（快速反馈）
            run: pytest tests/smoke -q --maxfail=1 --junitxml=reports/smoke.xml
          - name: 归档报告
            if: always()
            uses: actions/upload-artifact@v4
            with:
              name: smoke-report
              path: reports/

      regression:
        needs: [smoke]
        if: github.event_name == 'pull_request' || github.ref == 'refs/heads/main'
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - uses: actions/setup-python@v5
            with:
              python-version: "3.11"
              cache: pip
          - run: pip install -r requirements.txt
          - name: 回归集（含边界值 + 状态机）
            run: pytest tests/regression -q --junitxml=reports/regression.xml
          - name: 覆盖率门禁
            run: |
              pytest tests/ --cov=src --cov-fail-under=70 -q
          - name: 归档报告
            if: always()
            uses: actions/upload-artifact@v4
            with:
              name: regression-report
              path: reports/
    ```

    关键修复点对照：

    ```text
    1. 删除所有 "|| true"                → 让退出码真实生效
    2. 增加 pull_request 触发             → 拦截时机前移到评审
    3. smoke → regression 分层 + needs    → 快速反馈优先
    4. if: always() 归档报告              → 失败时也有证据
    5. 覆盖率高门槛 + 依赖锁定校验        → 守住覆盖范围与环境一致性
    6. junitxml 产物                     → 可观测性
    ```

    **第 4 题：门禁清单与校验脚本**

    质量门禁清单：

    | 门禁项 | 阈值 | 失败时行为 | 负责人 |
    |--------|------|------------|--------|
    | 冒烟集通过率 | 100% | 阻断，不进入回归 | 测试 |
    | 回归集通过率 | 100% | 阻断合并/部署 | 测试 |
    | 行覆盖率 | ≥ 70% | 阻断合并 | 测试 |
    | 关键模块覆盖率（优惠券/订单） | ≥ 90% | 阻断合并 | 测试 + 研发 |
    | 依赖锁定校验 | 关键包版本精确匹配 | 阻断 | 研发 |
    | 单次流水线耗时 | ≤ 15 min | 告警，不阻断 | 测试 |
    | 部署前置依赖 | needs: [smoke, regression] | 阻断部署 | 运维 |

    防止配置回退的校验脚本：

    ```python
    # scripts/check_pipeline_policy.py
    """校验流水线配置是否存在吞错写法与门禁缺失。退出码非 0 即失败。"""
    import re, sys, pathlib

    WF = pathlib.Path('.github/workflows')
    errors = []

    for f in WF.glob('*.yml'):
        text = f.read_text(encoding='utf-8')

        # 1) 吞错写法：|| true / || echo / set +e 之后的 pytest
        for m in re.finditer(r'^\s*run:\s*.*\|\|\s*(true|echo.*)$', text, re.M):
            errors.append(f'{f.name}: 检测到吞错写法 → {m.group(0).strip()}')

        # 2) 测试步骤是否缺少真实退出码（pytest 未带任何包装即为正常）
        if 'pytest' in text and re.search(r'pytest.*\|\|\s*true', text):
            errors.append(f'{f.name}: pytest 失败被 || true 吞掉')

        # 3) 部署必须依赖测试 job
        if 'deploy' in f.name or re.search(r'^\s*(deploy|release):', text, re.M):
            if not re.search(r'needs:\s*\[[^\]]*(smoke|test|regression)[^\]]*\]', text):
                errors.append(f'{f.name}: deploy 未声明 needs 依赖测试 job')

        # 4) 必须归档测试报告，保证失败可观测
        if 'pytest' in text and 'upload-artifact' not in text:
            errors.append(f'{f.name}: 未归档测试报告，失败不可观测')

    if errors:
        print('流水线策略校验失败：')
        for e in errors:
            print(' -', e)
        sys.exit(1)
    print('流水线策略校验通过')
    ```

    这个脚本比单纯的 grep 强的地方在于：它按**语义规则**检查（run 行的吞错模式、deploy 的 needs 依赖、报告归档），能防止「今天修好、明天又被改回去」的回退。

    另外别忘了 `concurrency` 段：不加的话，同分支连续推送会并发跑多个流水线，既浪费资源，也可能出现「旧 commit 的成功结果覆盖新 commit 的失败结果」——这本身就是另一种形式的假绿。

---

### 阶段测验

完成教程后，建议做 [CI/CD 自动化回归测验](CICD自动化回归测验.md) 检验学习效果。

### 通关检查

完成本阶段后，使用 [第5阶段-项目面试通关](../学习中心/第5阶段-项目面试通关.md) 检查是否可以进入下一阶段。
