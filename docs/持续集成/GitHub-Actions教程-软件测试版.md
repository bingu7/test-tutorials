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
