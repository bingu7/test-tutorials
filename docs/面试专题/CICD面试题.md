---
description: CI/CD 面试题，持续集成、持续交付、Jenkins、GitHub Actions 和流水线设计。
---
# CI/CD 面试题

CI/CD 面试重点包括概念理解、工具使用、流水线设计和质量门禁。

## CI 和 CD 有什么区别？

```text
CI（Continuous Integration）持续集成：
- 开发人员频繁合并代码到主分支
- 每次合并自动触发构建和测试
- 目的：尽早发现集成问题

CD 有两个含义：

1. Continuous Delivery（持续交付）
   - 代码随时可以部署到生产环境
   - 部署到生产需要手动确认

2. Continuous Deployment（持续部署）
   - 代码通过测试后自动部署到生产
   - 完全自动化，无需人工干预

关系：CI → 持续交付 → 持续部署（自动化程度递增）
```

## Jenkins Pipeline 怎么写？

```text
Pipeline 有两种写法：

1. 声明式（推荐）
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'pip install -r requirements.txt'
            }
        }
        stage('Test') {
            steps {
                sh 'pytest --alluredir=allure-results'
            }
        }
        stage('Deploy') {
            steps {
                sh './deploy.sh'
            }
        }
    }
    post {
        always {
            allure includeProperties: false, results: [[path: 'allure-results']]
        }
    }
}

2. 脚本式
node {
    stage('Build') { sh 'pip install -r requirements.txt' }
    stage('Test') { sh 'pytest' }
}
```

## GitHub Actions 和 Jenkins 有什么区别？

```text
Jenkins：
- 自托管，需要自己维护服务器
- 配置复杂但功能强大
- 插件生态最丰富
- 适合企业内部使用

GitHub Actions：
- 托管在 GitHub，无需维护
- 配置简单（YAML 文件）
- 和 GitHub 深度集成
- 适合开源项目和 GitHub 用户

GitLab CI：
- 和 GitLab 深度集成
- 配置简单（.gitlab-ci.yml）
- 支持自托管 Runner
- 适合使用 GitLab 的团队
```

## 流水线中怎么设置质量门禁？

```text
质量门禁 = 流水线中设置的通过条件，不满足则阻断部署

常见门禁：

1. 测试通过率
   - 所有用例必须通过
   - 或失败用例数不超过阈值

2. 代码覆盖率
   - 覆盖率不低于 70%
   - 新增代码覆盖率不低于 80%

3. 静态代码分析
   - SonarQube 质量门通过
   - 无严重 Bug 和安全漏洞

4. 依赖安全检查
   - 无已知高危漏洞
   - pip-audit、npm audit 通过

5. 构建成功
   - 编译无错误
   - 镜像构建成功
```

## 测试失败时怎么通知团队？

```text
通知方式：

1. 邮件通知
   - Jenkins Email Extension Plugin
   - GitHub Actions 邮件 Action

2. 即时通讯
   - 钉钉/企业微信 Webhook
   - Slack Notification
   - Telegram Bot

3. 看板/仪表盘
   - Allure 报告
   - Grafana 仪表盘

最佳实践：
- 失败时立即通知
- 成功时不打扰（或每天汇总）
- 通知包含失败原因和日志链接
```

## Docker 在 CI/CD 中怎么用？

```text
用途：

1. 构建环境一致性
   - 用 Docker 镜像作为构建环境
   - 保证本地和 CI 环境一致

2. 应用容器化
   - 把应用打包成 Docker 镜像
   - 镜像推送到镜像仓库

3. 测试环境隔离
   - 每次测试用独立的容器
   - 测试完自动销毁

示例流水线：
代码提交 → 构建 Docker 镜像 → 推送镜像仓库 → 部署到测试环境 → 运行测试 → 部署到生产
```

## 什么是蓝绿部署和金丝雀发布？

```text
蓝绿部署：
- 同时运行两套环境（蓝和绿）
- 蓝是当前版本，绿是新版本
- 测试通过后，流量切到绿
- 回滚：流量切回蓝

金丝雀发布：
- 先把少量流量切到新版本（如 5%）
- 观察监控数据，没有问题逐步增加
- 有问题立即回滚
- 比蓝绿部署更安全

滚动更新：
- 逐个替换旧版本实例
- K8s 默认策略
- 零停机
```

## 面试评分参考

| 维度 | 初级（1-2年） | 中级（3-5年） |
|------|-------------|-------------|
| 概念理解 | 知道 CI/CD 是什么 | 能解释 CI/CD 的价值和实践 |
| 工具使用 | 会用 Jenkins 跑流水线 | 能设计完整的流水线 |
| 质量门禁 | 知道要加测试 | 能配置覆盖率、安全检查等门禁 |
| 部署策略 | 知道自动化部署 | 能设计蓝绿/金丝雀发布方案 |
