---
description: GitLab CI/CD 教程，DAG 流水线、并行测试和环境管理。
---
# GitLab CI/CD 教程（软件测试人员专用）

> 本教程面向软件测试工程师，讲解如何使用 GitLab CI/CD 搭建持续集成流水线，自动化执行测试、生成报告、通知团队。

<div class="tutorial-meta">
    <span class="difficulty-badge difficulty-advanced">📕 高级难度</span>
    <span class="meta-item">⏱ 约 1.5 天</span>
    <span class="meta-item">📋 前置：Git 基础、自动化测试基础</span>
    <span class="meta-item">🎯 目标：使用 GitLab CI/CD 搭建自动化测试流水线</span>
</div>

| 项目 | 要求 | 获取方式 |
|------|------|----------|
| Git 基础 | 熟悉 clone、pull、push、分支管理 | [Git版本控制教程-软件测试版](../工具操作/Git版本控制教程-软件测试版.md) |
| GitLab 账号 | 有 GitLab.com 账号或私有 GitLab 实例 | [gitlab.com](https://gitlab.com) |
| 自动化测试基础 | 了解至少一种自动化测试框架（Pytest/Selenium/Playwright） | [Selenium-Web自动化教程](../自动化测试/Selenium-Web自动化教程-软件测试版.md) 或 [Playwright自动化测试教程](../自动化测试/Playwright自动化测试教程-软件测试版.md) |

---

## 新手导读

GitLab CI/CD 是 GitLab 内置的 CI/CD 工具，与 GitLab 代码仓库深度集成，无需额外配置即可使用。

第一遍建议只完成一个最小流水线：

1. 创建一个简单的测试脚本。
2. 编写 `.gitlab-ci.yml` 配置文件。
3. 推送代码触发流水线。
4. 查看执行结果和日志。

先跑通最小闭环，再学习缓存、Artifacts、Variables、多环境部署和 DAG 流水线。

### 版本与维护说明

| 项目 | 说明 |
|------|------|
| 适用平台 | GitLab.com、自托管 GitLab 实例 |
| 使用建议 | GitLab.com 免费版有 400 分钟/月额度，自托管无限制 |
| 更新提醒 | GitLab CI/CD 持续更新，关注 [GitLab Blog](https://about.gitlab.com/blog/) 获取最新功能 |

---

## 一、GitLab CI/CD 基础

### 1.1 什么是 GitLab CI/CD

GitLab CI/CD 是 GitLab 内置的持续集成、持续交付和持续部署平台，直接集成在 GitLab 代码仓库中。

**核心优势：**

| 优势 | 说明 |
|------|------|
| **深度集成** | 与 GitLab 代码仓库、Issues、Registry 深度集成 |
| **零配置** | 无需额外服务器，GitLab 内置 |
| **Auto DevOps** | 自动检测项目类型并配置流水线 |
| **强大的 Runner** | 支持共享 Runner、项目 Runner、群组 Runner |
| **DAG 流水线** | 支持有向无环图定义复杂依赖关系 |

### 1.2 核心概念

| 概念 | 说明 |
|------|------|
| **Pipeline** | 流水线，包含多个 Stage |
| **Stage** | 流水线阶段，如 build、test、deploy |
| **Job** | 阶段中的任务，包含具体执行步骤 |
| **Runner** | 执行 Job 的代理（GitLab 提供或自托管） |
| **Artifact** | Job 产生的文件，可在 Job 间传递 |
| **Cache** | 跨 Pipeline 保留的依赖文件 |
| **Variable** | 环境变量，用于配置和传递参数 |

### 1.3 `.gitlab-ci.yml` 文件结构

```yaml
stages:          # 定义阶段
  - build
  - test
  - deploy

variables:       # 全局变量
  PYTHON_VERSION: "3.11"

build:           # Job 名称
  stage: build   # 所属阶段
  script:        # 执行脚本
    - echo "Building..."
  
test:
  stage: test
  script:
    - echo "Testing..."

deploy:
  stage: deploy
  script:
    - echo "Deploying..."
  only:          # 触发条件
    - main
```

---

## 二、快速入门：第一个 Pipeline

### 2.1 创建 `.gitlab-ci.yml`

在仓库根目录创建 `.gitlab-ci.yml`：

```yaml
stages:
  - test

variables:
  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"

cache:
  paths:
    - .cache/pip/
    - venv/

test:
  stage: test
  image: python:3.11
  before_script:
    - python -m pip install --upgrade pip
    - pip install -r requirements.txt
  script:
    - pytest tests/ -v --tb=short
  artifacts:
    when: always
    reports:
      junit: pytest-results.xml
    paths:
      - htmlcov/
    expire_in: 30 days
```

### 2.2 推送触发

```bash
git add .gitlab-ci.yml
git commit -m "Add GitLab CI/CD"
git push origin main
```

### 2.3 查看执行结果

1. 打开 GitLab 仓库页面
2. 点击 **CI/CD** → **Pipelines**
3. 查看 Pipeline 执行状态和日志

---

## 三、常用配置详解

### 3.1 触发条件（Rules）

```yaml
test:
  stage: test
  script:
    - pytest tests/ -v
  rules:
    # 推送到 main 分支时执行
    - if: $CI_COMMIT_BRANCH == "main"
    # PR 时执行
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    # 定时执行
    - if: $CI_PIPELINE_SOURCE == "schedule"
    # 手动执行
    - if: $CI_PIPELINE_SOURCE == "web"
    # 标签时执行
    - if: $CI_COMMIT_TAG
```

### 3.2 阶段（Stages）

```yaml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - echo "Building..."
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

test:
  stage: test
  script:
    - pytest tests/ -v

deploy:
  stage: deploy
  script:
    - echo "Deploying..."
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual  # 手动触发
```

### 3.3 并行测试

```yaml
test:
  stage: test
  parallel: 4  # 并行 4 个 Job
  script:
    - pytest tests/ -v --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL
```

### 3.4 矩阵测试

```yaml
test:
  stage: test
  parallel:
    matrix:
      - PYTHON_VERSION: ["3.9", "3.10", "3.11", "3.12"]
        OS: ["ubuntu-latest", "windows-latest"]
  image: python:$PYTHON_VERSION
  script:
    - pytest tests/ -v
```

### 3.5 缓存（Cache）

```yaml
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - .cache/pip/
    - venv/
    - node_modules/

test:
  stage: test
  script:
    - pip install -r requirements.txt
    - pytest tests/ -v
```

### 3.6 Artifacts

```yaml
test:
  stage: test
  script:
    - pytest tests/ -v --junitxml=report.xml --cov=src --cov-report=html
  artifacts:
    when: always
    reports:
      junit: report.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml
    paths:
      - htmlcov/
    expire_in: 30 days

deploy:
  stage: deploy
  needs:
    - test  # 依赖 test Job 的 Artifacts
  script:
    - echo "Deploying..."
```

### 3.7 Variables

```yaml
variables:
  # 全局变量
  PYTHON_VERSION: "3.11"
  DATABASE_URL: "postgresql://user:pass@localhost/db"

test:
  stage: test
  variables:
    # Job 级别变量
    TEST_ENV: "ci"
  script:
    - echo "Python version: $PYTHON_VERSION"
    - echo "Database: $DATABASE_URL"
    - pytest tests/ -v
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      variables:
        # 条件变量
        DEPLOY_ENV: "production"
```

**预定义变量：**

| 变量 | 说明 |
|------|------|
| `CI_COMMIT_BRANCH` | 当前分支名 |
| `CI_COMMIT_TAG` | 当前标签 |
| `CI_PIPELINE_SOURCE` | 流水线触发源 |
| `CI_PROJECT_DIR` | 项目目录 |
| `CI_NODE_INDEX` | 并行 Job 索引 |
| `CI_NODE_TOTAL` | 并行 Job 总数 |
| `CI_REGISTRY_IMAGE` | 镜像地址 |

---

## 四、测试场景实战

### 4.1 Pytest + Allure 报告

```yaml
stages:
  - test
  - report

variables:
  ALLURE_RESULTS: "allure-results"

test:
  stage: test
  image: python:3.11
  before_script:
    - pip install -r requirements.txt
    - pip install allure-pytest
  script:
    - pytest tests/ -v --alluredir=$ALLURE_RESULTS
  artifacts:
    paths:
      - $ALLURE_RESULTS
    expire_in: 30 days

generate-report:
  stage: report
  image: frankescobar/allure-docker-service
  needs:
    - test
  script:
    - allure generate $ALLURE_RESULTS -o allure-report --clean
  artifacts:
    paths:
      - allure-report
    expire_in: 30 days
```

### 4.2 Selenium UI 自动化测试

```yaml
stages:
  - test

variables:
  DISPLAY: ":99"

test:
  stage: test
  image: python:3.11
  services:
    - name: selenium/standalone-chrome:latest
      alias: selenium
  before_script:
    - apt-get update && apt-get install -y wget unzip
    - wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -
    - echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list
    - apt-get update && apt-get install -y google-chrome-stable
    - pip install -r requirements.txt
    - pip install selenium webdriver-manager
  script:
    - pytest tests/ui/ -v --tb=short
  artifacts:
    when: failure
    paths:
      - tests/ui/screenshots/
    expire_in: 7 days
```

### 4.3 Playwright 测试

```yaml
stages:
  - test

test:
  stage: test
  image: mcr.microsoft.com/playwright:v1.40.0-jammy
  before_script:
    - cd frontend
    - npm ci
  script:
    - npx playwright test
  artifacts:
    when: always
    paths:
      - frontend/playwright-report/
      - frontend/test-results/
    expire_in: 30 days
```

### 4.4 API 接口自动化测试

```yaml
stages:
  - test

services:
  - name: postgres:15
    alias: db
    variables:
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
      POSTGRES_DB: testdb

variables:
  DATABASE_URL: "postgresql://test:test@db:5432/testdb"

test:
  stage: test
  image: python:3.11
  before_script:
    - pip install -r requirements.txt
    - pip install pytest-html requests
  script:
    - pytest tests/api/ -v --html=api-report.html --self-contained-html
  artifacts:
    when: always
    paths:
      - api-report.html
    expire_in: 30 days
```

### 4.5 Docker 镜像构建与测试

```yaml
stages:
  - build
  - test
  - deploy

variables:
  IMAGE_TAG: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA

build:
  stage: build
  image: docker:24.0
  services:
    - docker:24.0-dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $IMAGE_TAG .
    - docker push $IMAGE_TAG
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

test:
  stage: test
  image: $IMAGE_TAG
  needs:
    - build
  script:
    - pytest tests/ -v
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

deploy:
  stage: deploy
  image: bitnami/kubectl:latest
  needs:
    - test
  script:
    - kubectl set image deployment/myapp myapp=$IMAGE_TAG
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual
```

---

## 五、高级功能

### 5.1 DAG 流水线（有向无环图）

```yaml
stages:
  - build
  - test
  - deploy

build-frontend:
  stage: build
  script:
    - echo "Building frontend..."
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

build-backend:
  stage: build
  script:
    - echo "Building backend..."
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

test-frontend:
  stage: test
  needs:
    - build-frontend  # 只依赖 build-frontend
  script:
    - echo "Testing frontend..."

test-backend:
  stage: test
  needs:
    - build-backend  # 只依赖 build-backend
  script:
    - echo "Testing backend..."

deploy:
  stage: deploy
  needs:
    - test-frontend
    - test-backend
  script:
    - echo "Deploying..."
```

### 5.2 环境（Environments）

```yaml
deploy-staging:
  stage: deploy
  environment:
    name: staging
    url: https://staging.example.com
  script:
    - echo "Deploying to staging..."
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

deploy-production:
  stage: deploy
  environment:
    name: production
    url: https://example.com
  script:
    - echo "Deploying to production..."
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual
```

### 5.3 动态子流水线

```yaml
generate-child:
  stage: build
  script:
    - |
      cat > child-pipeline.yml << EOF
      test:
        stage: test
        script:
          - echo "Running child pipeline tests"
      EOF
  artifacts:
    paths:
      - child-pipeline.yml

run-child:
  stage: test
  trigger:
    include:
      - artifact: child-pipeline.yml
        job: generate-child
  needs:
    - generate-child
```

### 5.4 定时流水线

在 GitLab 项目设置中配置：

1. 进入项目 → **Settings** → **CI/CD**
2. 展开 **Pipeline schedules**
3. 点击 **Add schedule**
4. 配置描述、间隔和目标分支

在 `.gitlab-ci.yml` 中使用：

```yaml
nightly-tests:
  stage: test
  script:
    - pytest tests/ -v --slow
  rules:
    - if: $CI_PIPELINE_SOURCE == "schedule"
```

### 5.5 Secret 管理

**使用 CI/CD Variables：**

1. 进入项目 → **Settings** → **CI/CD**
2. 展开 **Variables**
3. 点击 **Add variable**
4. 输入 Key、Value，选择保护和掩码选项

**在 `.gitlab-ci.yml` 中使用：**

```yaml
deploy:
  stage: deploy
  script:
    - echo "Deploying with token $DEPLOY_TOKEN"
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

**使用 Vault：**

```yaml
deploy:
  stage: deploy
  id_tokens:
    VAULT_ID_TOKEN:
      aud: https://vault.example.com
  script:
    - export VAULT_TOKEN=$(vault write -field=token auth/jwt/login role=myapp jwt=$VAULT_ID_TOKEN)
    - export SECRET=$(vault kv get -field=value secret/myapp/secret)
```

---

## 六、最佳实践

### 6.1 文件组织

```
.gitlab/
├── ci/
│   ├── test.yml        # 测试相关 Job
│   ├── deploy.yml      # 部署相关 Job
│   └── templates/      # 模板
│       └── .test-template.yml
.gitlab-ci.yml          # 主配置文件
```

**使用 include：**

```yaml
include:
  - local: '.gitlab/ci/test.yml'
  - local: '.gitlab/ci/deploy.yml'
  - template: Security/SAST.gitlab-ci.yml

stages:
  - build
  - test
  - deploy
```

### 6.2 安全最佳实践

| 实践 | 说明 |
|------|------|
| **保护变量** | 标记为 "Protect variable" 只在保护分支使用 |
| **掩码变量** | 标记为 "Mask variable" 在日志中隐藏 |
| **审计日志** | 启用 CI/CD 审计日志 |
| **镜像扫描** | 使用 Container Scanning 扫描镜像漏洞 |

### 6.3 性能优化

| 优化 | 方法 |
|------|------|
| **缓存依赖** | 使用 `cache` 缓存 pip、npm 等依赖 |
| **并行执行** | 使用 `parallel` 并行测试 |
| **DAG 流水线** | 使用 `needs` 定义依赖关系 |
| **镜像选择** | 使用轻量级镜像 |
| **自托管 Runner** | 大量构建使用自托管 Runner |

### 6.4 调试技巧

```yaml
test:
  stage: test
  script:
    - echo "CI_COMMIT_BRANCH: $CI_COMMIT_BRANCH"
    - echo "CI_PIPELINE_SOURCE: $CI_PIPELINE_SOURCE"
    - echo "CI_PROJECT_DIR: $CI_PROJECT_DIR"
    - env | grep CI_
    - pytest tests/ -v
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

**使用 CI_DEBUG_TRACE：**

```yaml
variables:
  CI_DEBUG_TRACE: "true"
```

---

## 七、常见问题

### 7.1 Pipeline 不触发

**可能原因：**

| 原因 | 解决方案 |
|------|----------|
| `.gitlab-ci.yml` 语法错误 | 使用 CI Lint 工具验证 |
| Runner 未配置 | 检查项目 Runner 设置 |
| 分支保护 | 检查分支保护规则 |
| CI/CD 未启用 | 检查项目设置中的 CI/CD |

### 7.2 Job 超时

```yaml
test:
  stage: test
  timeout: 30 minutes
  script:
    - pytest tests/ -v
```

### 7.3 依赖安装失败

```yaml
test:
  stage: test
  retry:
    max: 2
    when:
      - runner_system_failure
      - stuck_or_timeout_failure
  script:
    - pip install -r requirements.txt
    - pytest tests/ -v
```

### 7.4 Artifacts 传递

```yaml
build:
  stage: build
  script:
    - echo "Building..."
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

test:
  stage: test
  needs:
    - build  # 使用 build 的 Artifacts
  script:
    - ls dist/
    - pytest tests/ -v
```

---

## 八、与 GitHub Actions 对比

| 特性 | GitLab CI/CD | GitHub Actions |
|------|--------------|----------------|
| **配置文件** | `.gitlab-ci.yml` | `.github/workflows/*.yml` |
| **触发条件** | `rules` / `only/except` | `on` |
| **并行测试** | `parallel` | `strategy.matrix` |
| **缓存** | `cache` | `actions/cache` |
| **Artifacts** | `artifacts` | `actions/upload-artifact` |
| **环境** | `environment` | `environment` |
| **子流水线** | `trigger` | `workflow_dispatch` |
| **学习曲线** | 中等 | 较低 |

**选择建议：**

- **使用 GitLab CI/CD**：代码在 GitLab、企业内网、需要私有部署、复杂流水线
- **使用 GitHub Actions**：代码在 GitHub、开源项目、快速上手

---

## 九、练习题

### 练习 1：基础 Pipeline

创建一个 GitLab CI/CD Pipeline，实现：

1. 当推送到 `main` 分支时触发
2. 运行 Python 测试
3. 上传测试报告作为 Artifact

### 练习 2：多阶段 Pipeline

创建一个 Pipeline，实现：

1. build 阶段：构建 Docker 镜像
2. test 阶段：运行测试
3. deploy 阶段：手动触发部署

### 练习 3：DAG 流水线

创建一个 DAG 流水线，实现：

1. 前端和后端并行构建
2. 前端和后端并行测试
3. 测试通过后部署

---

## 十、参考资源

| 资源 | 链接 |
|------|------|
| **官方文档** | [docs.gitlab.com/ee/ci](https://docs.gitlab.com/ee/ci/) |
| **CI Lint** | `https://gitlab.com/<project>/-/ci/lint` |
| **模板库** | [gitlab.com/gitlab-org/gitlab/-/tree/master/lib/gitlab/ci/templates](https://gitlab.com/gitlab-org/gitlab/-/tree/master/lib/gitlab/ci/templates) |
| **Auto DevOps** | [docs.gitlab.com/ee/topics/autodevops](https://docs.gitlab.com/ee/topics/autodevops/) |
| **GitLab Blog** | [about.gitlab.com/blog/](https://about.gitlab.com/blog/) |

---

## 总结

GitLab CI/CD 是 GitLab 内置的 CI/CD 工具，核心优势是深度集成、零配置、强大的 Runner 和 DAG 流水线。

测试人员使用 GitLab CI/CD 的核心流程：

1. **创建 `.gitlab-ci.yml`**：定义 stages、jobs、script
2. **配置触发条件**：使用 `rules` 或 `only/except`
3. **配置测试步骤**：安装依赖、运行测试、上传报告
4. **使用高级功能**：缓存、Artifacts、Variables、DAG
5. **优化和调试**：并行执行、重试、调试技巧

建议从最小 Pipeline 开始，逐步添加功能。

### 推荐下一步

根据你的学习进度，选择下一步：

1. **如果你想学其他 CI 工具**：学习 [GitHub Actions](GitHub-Actions教程-软件测试版.md) 或 [Jenkins CI/CD](Jenkins-CICD教程-软件测试版.md)
2. **如果你想做 CI/CD 实战**：进入 [CI/CD 自动化回归实战](../项目实战/CICD自动化回归实战.md)，搭建完整流水线
3. **如果你想准备面试**：进入 [面试专题](../面试专题/index.md)，准备项目经验表达

### 通关检查

完成本阶段后，使用 [第5阶段-项目面试通关](../学习中心/第5阶段-项目面试通关.md) 检查是否可以进入下一阶段。
