---
description: GitHub Actions 教程，矩阵测试、缓存和 Artifacts 管理。
---
# GitHub Actions CI/CD 教程（软件测试人员专用）

> 本教程面向软件测试工程师，讲解如何使用 GitHub Actions 搭建持续集成流水线，自动化执行测试、生成报告、通知团队。

<div class="tutorial-meta">
    <span class="difficulty-badge difficulty-advanced">📕 高级难度</span>
    <span class="meta-item">⏱ 约 1.5 天</span>
    <span class="meta-item">📋 前置：Git 基础、自动化测试基础</span>
    <span class="meta-item">🎯 目标：使用 GitHub Actions 搭建自动化测试流水线</span>
</div>

| 项目 | 要求 | 获取方式 |
|------|------|----------|
| Git 基础 | 熟悉 clone、pull、push、分支管理 | [Git版本控制教程-软件测试版](../工具操作/Git版本控制教程-软件测试版.md) |
| GitHub 账号 | 有 GitHub 账号并了解基本操作 | [github.com](https://github.com) |
| 自动化测试基础 | 了解至少一种自动化测试框架（Pytest/Selenium/Playwright） | [Selenium-Web自动化教程](../自动化测试/Selenium-Web自动化教程-软件测试版.md) 或 [Playwright自动化测试教程](../自动化测试/Playwright自动化测试教程-软件测试版.md) |

---

## 新手导读

GitHub Actions 是 GitHub 内置的 CI/CD 工具，无需额外安装服务器，直接在 GitHub 仓库中配置即可使用。

第一遍建议只完成一个最小流水线：

1. 创建一个简单的测试脚本。
2. 编写 GitHub Actions 配置文件。
3. 推送代码触发流水线。
4. 查看执行结果和日志。

先跑通最小闭环，再学习矩阵测试、缓存、Artifacts、Secrets 和多环境部署。

### 版本与维护说明

| 项目 | 说明 |
|------|------|
| 适用平台 | GitHub.com、GitHub Enterprise Cloud |
| 使用建议 | 公开仓库免费使用，私有仓库有免费额度 |
| 更新提醒 | GitHub Actions 持续更新，关注 [GitHub Blog](https://github.blog/changelog/) 获取最新功能 |

---

## 一、GitHub Actions 基础

### 1.1 什么是 GitHub Actions

GitHub Actions 是 GitHub 内置的 CI/CD 平台，允许你直接在仓库中自动化构建、测试和部署流程。

**核心优势：**

| 优势 | 说明 |
|------|------|
| **零配置** | 无需搭建服务器，GitHub 内置 |
| **免费额度** | 公开仓库完全免费，私有仓库每月 2000 分钟 |
| **丰富的市场** | [Marketplace](https://github.com/marketplace?type=actions) 有 10,000+ 现成的 Actions |
| **深度集成** | 与 GitHub Issues、PR、Packages 深度集成 |
| **矩阵构建** | 一次配置，多环境并行测试 |

### 1.2 核心概念

| 概念 | 说明 |
|------|------|
| **Workflow** | 自动化流程，定义在 `.github/workflows/` 目录下的 YAML 文件 |
| **Event** | 触发 Workflow 的事件（如 push、pull_request、schedule） |
| **Job** | Workflow 中的一个任务，包含多个步骤 |
| **Step** | Job 中的一个步骤，可以运行命令或使用 Action |
| **Action** | 可复用的步骤单元，可以是官方的或社区的 |
| **Runner** | 执行 Job 的服务器（GitHub 提供或自托管） |

### 1.3 Workflow 文件结构

```yaml
name: CI                    # Workflow 名称
on:                         # 触发条件
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:                       # 任务列表
  test:                     # 任务名称
    runs-on: ubuntu-latest  # 运行环境
    steps:                  # 步骤列表
      - uses: actions/checkout@v4  # 检出代码
      - name: Run tests           # 步骤名称
        run: pytest                # 执行命令
```

---

## 二、快速入门：第一个 Workflow

### 2.1 创建 Workflow 文件

在仓库根目录创建 `.github/workflows/test.yml`：

```yaml
name: Python Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Set up Python
      uses: actions/setup-python@v5
      with:
        python-version: '3.11'
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    
    - name: Run tests
      run: |
        pytest tests/ -v --tb=short
```

### 2.2 推送触发

```bash
git add .github/workflows/test.yml
git commit -m "Add GitHub Actions CI"
git push origin main
```

### 2.3 查看执行结果

1. 打开 GitHub 仓库页面
2. 点击 **Actions** 标签
3. 查看 Workflow 执行状态和日志

---

## 三、常用配置详解

### 3.1 触发条件（Events）

```yaml
on:
  # 推送到 main 分支时触发
  push:
    branches: [ main ]
    paths:
      - 'src/**'
      - 'tests/**'
  
  # PR 到 main 分支时触发
  pull_request:
    branches: [ main ]
  
  # 定时触发（每天 UTC 00:00）
  schedule:
    - cron: '0 0 * * *'
  
  # 手动触发
  workflow_dispatch:
    inputs:
      environment:
        description: '部署环境'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production
```

### 3.2 矩阵测试（Matrix）

一次配置，多环境并行测试：

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        python-version: ['3.9', '3.10', '3.11', '3.12']
      fail-fast: false  # 某个失败不影响其他
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Python ${{ matrix.python-version }}
      uses: actions/setup-python@v5
      with:
        python-version: ${{ matrix.python-version }}
    
    - name: Install dependencies
      run: pip install -r requirements.txt
    
    - name: Run tests
      run: pytest tests/ -v
```

### 3.3 缓存依赖

加速 Workflow 执行：

```yaml
steps:
- uses: actions/checkout@v4

- name: Set up Python
  uses: actions/setup-python@v5
  with:
    python-version: '3.11'
    cache: 'pip'  # 自动缓存 pip 依赖

- name: Install dependencies
  run: pip install -r requirements.txt
```

或者手动缓存：

```yaml
steps:
- uses: actions/checkout@v4

- name: Cache pip
  uses: actions/cache@v4
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('requirements.txt') }}
    restore-keys: |
      ${{ runner.os }}-pip-

- name: Install dependencies
  run: pip install -r requirements.txt
```

### 3.4 上传测试报告（Artifacts）

```yaml
steps:
- uses: actions/checkout@v4

- name: Run tests with coverage
  run: |
    pytest tests/ -v --cov=src --cov-report=html --cov-report=xml

- name: Upload coverage report
  uses: actions/upload-artifact@v4
  with:
    name: coverage-report
    path: htmlcov/
    retention-days: 30

- name: Upload test results
  uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: |
      pytest-results.xml
      coverage.xml
```

### 3.5 使用 Secrets

存储敏感信息（如 API 密钥、密码）：

1. 在仓库设置中添加 Secret：
   - **Settings** → **Secrets and variables** → **Actions**
   - 点击 **New repository secret**
   - 输入名称和值

2. 在 Workflow 中使用：

```yaml
steps:
- name: Deploy to staging
  env:
    API_KEY: ${{ secrets.API_KEY }}
    DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
  run: |
    echo "Deploying with API key..."
    # 使用环境变量进行部署
```

---

## 四、测试场景实战

### 4.1 Pytest + Allure 报告

```yaml
name: Pytest with Allure

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Python
      uses: actions/setup-python@v5
      with:
        python-version: '3.11'
    
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install allure-pytest
    
    - name: Run tests with Allure
      run: |
        pytest tests/ -v --alluredir=allure-results
    
    - name: Upload Allure results
      uses: actions/upload-artifact@v4
      with:
        name: allure-results
        path: allure-results/
    
    - name: Generate Allure report
      uses: simple-elf/allure-report-action@v1
      if: always()
      with:
        allure_results: allure-results
    
    - name: Deploy report to GitHub Pages
      uses: peaceiris/actions-gh-pages@v4
      if: always()
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: allure-history
```

### 4.2 Selenium UI 自动化测试

```yaml
name: Selenium UI Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  ui-test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Python
      uses: actions/setup-python@v5
      with:
        python-version: '3.11'
    
    - name: Install Chrome
      uses: browser-actions/setup-chrome@v1
      with:
        chrome-version: stable
    
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install selenium webdriver-manager
    
    - name: Run Selenium tests
      run: |
        pytest tests/ui/ -v --tb=short
      env:
        DISPLAY: ':99'
    
    - name: Upload screenshots on failure
      uses: actions/upload-artifact@v4
      if: failure()
      with:
        name: screenshots
        path: tests/ui/screenshots/
```

### 4.3 Playwright 测试

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright browsers
      run: npx playwright install --with-deps
    
    - name: Run Playwright tests
      run: npx playwright test
    
    - name: Upload Playwright report
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### 4.4 API 接口自动化测试

```yaml
name: API Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  api-test:
    runs-on: ubuntu-latest
    
    services:
      # 启动测试数据库
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: testdb
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Python
      uses: actions/setup-python@v5
      with:
        python-version: '3.11'
    
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install pytest-html requests
    
    - name: Run API tests
      run: |
        pytest tests/api/ -v --html=api-test-report.html --self-contained-html
      env:
        DATABASE_URL: postgresql://test:test@localhost:5432/testdb
    
    - name: Upload API test report
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: api-test-report
        path: api-test-report.html
```

---

## 五、高级功能

### 5.1 多环境部署

```yaml
name: Deploy

on:
  push:
    branches: [ main ]
  workflow_dispatch:
    inputs:
      environment:
        description: '部署环境'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Run tests
      run: pytest tests/ -v

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' || github.event.inputs.environment == 'staging'
    environment: staging
    steps:
    - name: Deploy to staging
      run: |
        echo "Deploying to staging..."
        # 实际部署命令

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    if: github.event.inputs.environment == 'production'
    environment: production
    steps:
    - name: Deploy to production
      run: |
        echo "Deploying to production..."
        # 实际部署命令
```

### 5.2 复合 Action（可复用步骤）

创建 `.github/actions/setup-test/action.yml`：

```yaml
name: 'Setup Test Environment'
description: 'Setup Python test environment'

inputs:
  python-version:
    description: 'Python version'
    required: false
    default: '3.11'

runs:
  using: 'composite'
  steps:
    - name: Set up Python
      uses: actions/setup-python@v5
      with:
        python-version: ${{ inputs.python-version }}
        cache: 'pip'
    
    - name: Install dependencies
      shell: bash
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
```

在 Workflow 中使用：

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup test environment
      uses: ./.github/actions/setup-test
      with:
        python-version: '3.11'
    
    - name: Run tests
      run: pytest tests/ -v
```

### 5.3 条件执行

```yaml
steps:
- name: Run unit tests
  run: pytest tests/unit/ -v

- name: Run integration tests
  if: github.ref == 'refs/heads/main'
  run: pytest tests/integration/ -v

- name: Run performance tests
  if: github.event_name == 'schedule'
  run: pytest tests/performance/ -v

- name: Notify on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Workflow failed: ${{ github.workflow }}"
      }
```

### 5.4 并行测试

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Python
      uses: actions/setup-python@v5
      with:
        python-version: '3.11'
    
    - name: Install dependencies
      run: pip install -r requirements.txt
    
    - name: Run tests (shard ${{ matrix.shard }})
      run: |
        pytest tests/ -v --shard=${{ matrix.shard }}/4
```

---

## 六、最佳实践

### 6.1 Workflow 文件组织

```
.github/
├── workflows/
│   ├── ci.yml              # 主 CI 流程
│   ├── deploy.yml          # 部署流程
│   ├── release.yml         # 发布流程
│   └── scheduled.yml       # 定时任务
├── actions/
│   └── setup-test/         # 自定义复合 Action
│       └── action.yml
└── CODEOWNERS              # 代码所有者
```

### 6.2 安全最佳实践

| 实践 | 说明 |
|------|------|
| **最小权限** | 使用 `permissions` 限制 GITHUB_TOKEN 权限 |
| **固定版本** | 使用 Action 的完整 SHA 而非标签 |
| **审核第三方 Actions** | 使用知名组织的 Actions |
| **保护 Secrets** | 不要在日志中打印 Secrets |

```yaml
permissions:
  contents: read
  pull-requests: write

steps:
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11  # v4.1.1
```

### 6.3 性能优化

| 优化 | 方法 |
|------|------|
| **缓存依赖** | 使用 `actions/cache` 或内置缓存 |
| **并行执行** | 使用矩阵策略并行测试 |
| **条件跳过** | 使用 `paths` 过滤不需要的触发 |
| **自托管 Runner** | 大量构建使用自托管 Runner |

### 6.4 调试技巧

```yaml
- name: Debug with tmate
  if: failure()
  uses: mxschmitt/action-tmate@v3
  timeout-minutes: 60

- name: Enable debug logging
  run: |
    echo "ACTIONS_STEP_DEBUG=true" >> $GITHUB_ENV
    echo "ACTIONS_RUNNER_DEBUG=true" >> $GITHUB_ENV
```

---

## 七、常见问题

### 7.1 Workflow 不触发

**可能原因：**

| 原因 | 解决方案 |
|------|----------|
| 分支名错误 | 检查 `branches` 配置 |
| 文件路径错误 | 确保文件在 `.github/workflows/` 目录 |
| 仓库设置 | 检查仓库的 Actions 设置是否启用 |

### 7.2 测试超时

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30  # 设置超时时间
    
    steps:
    - name: Run tests
      run: pytest tests/ -v --timeout=300  # 每个测试用例超时
```

### 7.3 依赖安装失败

```yaml
- name: Install dependencies
  run: |
    python -m pip install --upgrade pip
    pip install -r requirements.txt
  continue-on-error: false
  retries: 3
```

### 7.4 环境变量传递

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version.outputs.version }}
    steps:
    - id: version
      run: echo "version=1.0.0" >> $GITHUB_OUTPUT
  
  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
    - name: Get version
      run: echo "Version is ${{ needs.build.outputs.version }}"
```

---

## 八、与 Jenkins 对比

| 特性 | GitHub Actions | Jenkins |
|------|----------------|---------|
| **部署方式** | 云托管（GitHub） | 自托管 |
| **配置方式** | YAML 文件 | Groovy 脚本/界面 |
| **免费额度** | 公开仓库免费 | 完全免费（自托管） |
| **插件生态** | Marketplace（10,000+） | Plugins（1,800+） |
| **学习曲线** | 较低 | 较高 |
| **适用场景** | GitHub 项目、开源项目 | 企业内网、复杂流水线 |

**选择建议：**

- **使用 GitHub Actions**：代码在 GitHub、开源项目、小团队、快速上手
- **使用 Jenkins**：企业内网、复杂流水线、需要高度定制、已有 Jenkins 环境

---

## 九、练习题

### 练习 1：基础 Workflow

创建一个 GitHub Actions Workflow，实现：

1. 当推送到 `main` 分支时触发
2. 运行 Python 测试
3. 上传测试报告作为 Artifact

### 练习 2：矩阵测试

创建一个 Workflow，实现：

1. 在 Ubuntu 和 Windows 上测试
2. 测试 Python 3.9、3.10、3.11 三个版本
3. 生成测试覆盖率报告

### 练习 3：多环境部署

创建一个 Workflow，实现：

1. 测试通过后自动部署到 staging 环境
2. 手动触发部署到 production 环境
3. 部署失败时发送通知

---

## 十、参考资源

| 资源 | 链接 |
|------|------|
| **官方文档** | [docs.github.com/actions](https://docs.github.com/actions) |
| **Marketplace** | [github.com/marketplace?type=actions](https://github.com/marketplace?type=actions) |
| **官方示例** | [github.com/actions/starter-workflows](https://github.com/actions/starter-workflows) |
| **社区讨论** | [github.community/c/actions](https://github.community/c/actions) |
| **GitHub Blog** | [github.blog/changelog/](https://github.blog/changelog/) |

---

## 总结

GitHub Actions 是 GitHub 内置的 CI/CD 工具，核心优势是零配置、免费额度、丰富的市场和深度集成。

测试人员使用 GitHub Actions 的核心流程：

1. **创建 Workflow 文件**：`.github/workflows/*.yml`
2. **定义触发条件**：push、pull_request、schedule
3. **配置测试步骤**：安装依赖、运行测试、上传报告
4. **使用高级功能**：矩阵测试、缓存、Artifacts、Secrets
5. **优化和调试**：并行执行、条件执行、调试技巧

建议从最小 Workflow 开始，逐步添加功能。

---

## 动手任务：修好一份「假绿」的 GitHub Actions Workflow

> 这是本教程的收尾练习。请**独立完成**，不要先看参考答案。目标不是"让 workflow 跑成绿色"，而是**让它真的能拦住问题**。

### 任务背景

团队把项目的接口自动化测试接到了 GitHub Actions 上，配置见下。workflow 每天都在跑，徽章一直是绿色的，但版本上线后接口仍然频繁出问题。负责人于是说了一句："CI 都绿了，肯定是环境问题。"

你的任务是：**找出这份 workflow 为什么拦不住问题，并把它重写成一份靠谱的流水线。**

### 任务准备

下面是 `.github/workflows/test.yml`（为便于练习做了收敛，缺陷保留）：

```yaml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Run API tests
        run: pytest tests/api/ -v || true

      - name: Deploy to staging
        run: |
          echo "deploying..."
          curl -H "Authorization: Bearer sk-live-9f2c1a7b3d4e5f60a1b2c3d4e5f60718" \
            https://staging.example.com/api/deploy

  notify:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Notify
        run: echo "done"
```

补充信息：

1. 这个仓库是团队共用仓库，`main` 上每天有多次合并。
2. 团队已把部署令牌存进了仓库 Secret，名字是 `DEPLOY_TOKEN`。
3. 项目根目录有 `requirements.txt`。
4. 测试脚本输出 JUnit XML 到 `reports/junit.xml`（pytest 参数里已配置好）。

### 任务要求

请依次完成：

1. **列出全部缺陷**：逐条指出上面这份 workflow 的问题（至少 5 处），并对每一处说明**它会造成什么后果**。至少覆盖：测试失败是否真正阻断、依赖缓存、凭据硬编码、并发控制、触发范围。
2. **排序并解释**：这些缺陷里，哪一个**最容易让流水线变成"假绿"**？哪一个**风险最高（可能直接造成事故）**？为什么这两者不一定是同一个？
3. **重写 workflow**：写出一份修好后的 workflow，要求 —— 测试失败必须让 job 失败、使用 `actions/cache` 或 `setup-python` 的 `cache: 'pip'` 缓存依赖、令牌改用 `${{ secrets.DEPLOY_TOKEN }}`、加入 `concurrency` 并发控制、部署只在 `main` 上执行。
4. **解释一个反直觉的点**：为什么给 `pytest` 加上重试，反而可能让问题更难被发现？（结合"失败被 `|| true` 吞掉"这一点说明）
5. **加一道防线**：写一段配置，让流水线能把测试报告留成可下载的证据（Artifacts），并说明它为什么对排查问题有价值。

### 提交物

| 产出 | 要求 |
|------|------|
| 问题清单 | 每条含：位置、后果、严重程度 |
| 重写后的 workflow | 完整 YAML，关键处带注释，能被 `yaml.safe_load` 解析 |
| 顺序说明 | 第 2 题的判断及理由 |
| 结论 | 用 3-5 句话说明：这份流水线为什么会长期"假绿"，怎么根治 |

### 完成标准

- [ ] 能指出 `|| true` 会**吞掉测试失败**，是"假绿"的根本原因
- [ ] 重写后的 workflow 里，测试失败**真的**会让 job 失败（而不是再写个 `|| true` 或 `continue-on-error: true`）
- [ ] 能正确使用 `${{ secrets.XXX }}` 引用令牌，且说明为什么不能把密钥写进 YAML
- [ ] 能正确写出 `concurrency` 与 `needs`，并解释它们各自解决什么问题
- [ ] 用 Artifacts 留证，而不是只在日志里找结果

??? tip "参考答案与思路（先自己做完再看）"

    **第 1 题：缺陷清单**

    | # | 位置 | 问题 | 后果 |
    |---|------|------|------|
    | 1 | `pytest tests/api/ -v \|\| true` | **失败被吞掉**，命令永远返回 0 | 测试形同虚设，这是"假绿"的**根本原因** |
    | 2 | `curl -H "Authorization: Bearer sk-live-..."` | **令牌硬编码**在 YAML 里 | 密钥进版本库、进日志，等于公开泄露 |
    | 3 | `Install dependencies` 无缓存 | 每次重装依赖 | 浪费时间与额度，流水线变慢 |
    | 4 | 无 `concurrency` | 同一分支连续推送会同时跑多个 workflow | 后一次部署可能被前一次覆盖（竞态），部署结果不确定 |
    | 5 | 无 `if:` 限制部署 | `Deploy to staging` 在**任意触发条件下**都会执行 | PR 分支也会尝试部署，风险高 |
    | 6 | `pull_request:` 未限定 `branches` | PR 触发范围过宽 | 无关 PR 也触发，浪费额度 |
    | 7 | 无 Artifacts 上传 | 测试报告只留在日志里 | 失败后没有可下载的证据（`reports/junit.xml` 未归档） |
    | 8 | 无 `permissions` | 默认可能拿到过宽的 token 权限 | 不符合最小权限原则，有安全隐患 |

    **第 2 题：谁最容易导致"假绿"，谁风险最高**

    - **最容易导致"假绿"**：`|| true`（第 1 条）。它让所有测试结果失去意义——测试删光了流水线也照样是绿的。
    - **风险最高**：硬编码令牌 + 无条件部署（第 2、5 条）。这两条组合起来，可能直接造成**线上事故或密钥泄露**。

    两者不一定是同一个原因，是因为它们**属于两类问题**：`|| true` 属于"**会漏过缺陷**"，它让问题悄悄流到下游；硬编码/无条件部署属于"**会直接造成事故**"。只修其中一类都不算修好：修了 `|| true` 但留着硬编码令牌，测试是准了，密钥还是泄露的。

    **第 3 题：重写后的 workflow**

    ```yaml
    name: Tests

    on:
      push:
        branches: [ main, develop ]
      pull_request:
        branches: [ main ]          # 限定 PR 目标分支，避免范围过宽
      workflow_dispatch:

    # 同一分支只保留最新一次运行，取消排队中的旧运行，避免部署竞态
    concurrency:
      group: ci-${{ github.ref }}
      cancel-in-progress: true

    # 最小权限：默认只读，需要的权限显式声明
    permissions:
      contents: read

    jobs:
      test:
        runs-on: ubuntu-latest
        timeout-minutes: 30

        steps:
          - name: Checkout code
            uses: actions/checkout@v4

          - name: Set up Python
            uses: actions/setup-python@v5
            with:
              python-version: '3.11'
              cache: 'pip'          # 内置 pip 缓存，按 requirements.txt 命中

          - name: Install dependencies
            run: |
              python -m pip install --upgrade pip
              pip install -r requirements.txt

          # 注意：这里没有任何 || true / continue-on-error，
          # pytest 返回非 0 会让本步骤失败、进而让 job 失败
          - name: Run API tests
            run: pytest tests/api/ -v --junitxml=reports/junit.xml

          - name: Upload test results
            if: always()            # 无论成功失败都留证
            uses: actions/upload-artifact@v4
            with:
              name: junit-results
              path: reports/junit.xml
              retention-days: 30

      deploy:
        # 只有 test 成功后才可能进入 deploy
        needs: test
        # 只在 main 分支的 push 上部署（PR 不部署）
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        runs-on: ubuntu-latest
        environment: staging
        steps:
          - name: Deploy to staging
            env:
              # 令牌来自仓库 Secret，不落在 YAML 里
              DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
            run: |
              echo "deploying..."
              curl -H "Authorization: Bearer $DEPLOY_TOKEN" \
                https://staging.example.com/api/deploy
    ```

    改动要点：

    - **删掉 `|| true`** —— 这是让流水线重新"能拦住问题"的关键一步；不要用 `continue-on-error` 替代它。
    - **令牌改用 `${{ secrets.DEPLOY_TOKEN }}`**，并通过 `env:` 注入给步骤。
    - **缓存**：`setup-python` 的 `cache: 'pip'` 即可按 `requirements.txt` 做缓存；需要更细粒度时再手写 `actions/cache`：

      ```yaml
      - name: Cache pip
        uses: actions/cache@v4
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-${{ hashFiles('requirements.txt') }}
          restore-keys: |
            ${{ runner.os }}-pip-
      ```

    - **并发控制**：`concurrency.group` 用 `github.ref` 分组，`cancel-in-progress: true` 取消旧运行。
    - **部署前置条件**：`needs: test` 保证测试通过，`if:` 保证只从 `main` 的 push 部署。

    **第 4 题：为什么加重试反而更糟**

    `|| true` 的效果是"无论测试结果如何，这一步都成功"。如果在这个基础上再给 `pytest` 加 `--reruns 2`（或在 workflow 里包一层重试），会出现双重掩盖：

    1. 第一层：失败后重试通过 → 报告显示"最终通过"，于是**偶发失败**被当成"正常的抖动"；
    2. 第二层：即使**重试也全部失败**，`|| true` 仍然把这一步变成成功。

    结果是**任何测试结果都不会影响流水线颜色**。"加重试"本意是提高稳定性，但在**没有先把 `|| true` 去掉**的前提下，它只是把"必现失败"也变成看不见。正确顺序是：**先让失败真的失败（去掉 `|| true`），再讨论是否用重试处理已知的环境抖动**——而且重试应当被显式记录和监控，不能当成"过了就算"。

    **第 5 题：Artifacts 这道防线**

    ```yaml
          - name: Upload test results
            if: always()
            uses: actions/upload-artifact@v4
            with:
              name: junit-results
              path: reports/junit.xml
              retention-days: 30
    ```

    价值在于：`if: always()` 保证**成功失败都归档**，于是失败时团队拿到的是**可直接下载、可解析的报告**（JUnit XML 能被 CI 看板、IDE 或测试管理工具消费），而不是到几百行日志里翻。日志会随运行滚动、超期清理，而 Artifacts 是有保留期（`retention-days`）的结构化证据——这是把"一次失败"从"一次事故"变成"一条可追踪数据"的关键。

    > 一句话总结：**绿色徽章不等于质量。** 判断一条流水线是否可信，只要问一句：**它坏了的时候会不会变红？** 如果答案是否，那它拦住的只有"心情"。

### 推荐下一步


根据你的学习进度，选择下一步：

1. **如果你想学其他 CI 工具**：学习 [GitLab CI/CD](GitLab-CICD教程-软件测试版.md) 或 [Jenkins CI/CD](Jenkins-CICD教程-软件测试版.md)
2. **如果你想做 CI/CD 实战**：进入 [CI/CD 自动化回归实战](../项目实战/CICD自动化回归实战.md)，搭建完整流水线
3. **如果你想准备面试**：进入 [面试专题](../面试专题/index.md)，准备项目经验表达

### 阶段测验

完成教程后，建议做 [持续集成测验](持续集成测验.md) 检验学习效果。

### 通关检查

完成本阶段后，使用 [第5阶段-项目面试通关](../学习中心/第5阶段-项目面试通关.md) 检查是否可以进入下一阶段。
