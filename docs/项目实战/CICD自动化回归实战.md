# CI/CD 自动化回归实战

> 本实战用于把接口自动化、Web 自动化、测试报告和部署流程接入 CI/CD，让测试从“本地手动跑”变成“代码变更后自动反馈质量风险”。

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

### 6.1 接口自动化

```bash
pytest tests/api --alluredir=reports/allure-results
```

适合放入每次提交后的快速回归。

### 6.2 Web 冒烟自动化

```bash
pytest tests/web/smoke --alluredir=reports/allure-results
```

Web 自动化应控制数量，优先选择稳定主流程。页面频繁变化时，不要让大量 UI 用例阻塞每次提交。

### 6.3 失败策略

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
