# 🧪 软件测试知识体系

> 面向软件测试工程师的系统化学习教程，18 篇文档覆盖从零基础入门到自动化进阶的完整技能栈。

**📖 在线阅读：[https://bingu7.github.io/test-tutorials/](https://bingu7.github.io/test-tutorials/)**

---

## 📍 学习路线

```
入门基础          工具实战              自动化进阶          体系能力
────────        ────────────────      ────────────────    ────────────
软件测试理论 ──→ SQL / Linux / Git ──→ Python 接口自动化 ──→ Jenkins CI/CD
                Fiddler / Postman ──→ Selenium Web 自动化 ──→ Docker 容器
                接口测试方法论 ──────→ Appium App 自动化 ──→ JMeter 性能测试
```

## 📚 教程目录

> 说明：站点发布以 `docs/` 目录为唯一文档源，根目录同名 Markdown 文件仅作为原稿/备份保留。

### 基础理论（2 篇）

| 教程 | 内容 |
|------|------|
| [软件测试理论基础](docs/基础理论/软件测试理论基础教程.md) | 测试分类、用例设计方法、缺陷管理、测试流程、职业发展 |
| [Python 基础](docs/基础理论/Python基础教程-软件测试版.md) | 语法、数据类型、函数、类、文件操作、异常处理、常用库 |

### 工具操作（8 篇）

| 教程 | 内容 |
|------|------|
| [数据库 SQL](docs/工具操作/数据库SQL教程-软件测试版.md) | MySQL 增删改查、多表查询、索引、事务、测试场景实战 |
| [Redis 与 MongoDB](docs/工具操作/Redis与MongoDB教程-软件测试版.md) | 缓存/NoSQL 查询、数据校验、清理、构造测试数据 |
| [Linux 实用](docs/工具操作/Linux实用教程-软件测试版.md) | 命令行操作、日志分析、进程管理、性能监控、Shell 脚本 |
| [Git 版本控制](docs/工具操作/Git版本控制教程-软件测试版.md) | 基础命令、分支管理、冲突解决、协作流程 |
| [Docker 容器](docs/工具操作/Docker容器教程-软件测试版.md) | 镜像操作、容器管理、Dockerfile、Compose、测试环境搭建 |
| [Fiddler 抓包](docs/工具操作/Fiddler抓包教程-软件测试版.md) | HTTP 抓包分析、HTTPS 解密、移动端代理、Mock、弱网模拟 |
| [Postman 接口](docs/工具操作/Postman接口测试教程-软件测试版.md) | 接口调试、断言脚本、环境变量、数据驱动、Newman 命令行 |
| [接口抓包联调实战](docs/工具操作/接口抓包联调实战教程-软件测试版.md) | Fiddler 抓包 → Postman 调试 → Python 自动化完整工作流 |

### 专项测试（3 篇）

| 教程 | 内容 |
|------|------|
| [接口测试方法论](docs/专项测试/接口测试完整教程-软件测试版.md) | 用例设计、安全测试、性能测试、Mock、自动化策略 |
| [JMeter 性能测试](docs/专项测试/JMeter性能测试教程-软件测试版.md) | 脚本编写、参数化、关联提取、分布式压测、结果分析 |
| [Web 安全测试](docs/专项测试/Web安全测试教程-软件测试版.md) | Burp Suite、SQL 注入、XSS、CSRF、越权、安全 Checklist |

### 自动化测试（4 篇）

| 教程 | 内容 |
|------|------|
| [Python 接口自动化](docs/自动化测试/Python+Requests+Allure接口自动化教程-软件测试版.md) | Requests + Pytest + Allure 框架搭建、数据驱动、CI 集成 |
| [Selenium Web 自动化](docs/自动化测试/Selenium-Web自动化教程-软件测试版.md) | 元素定位、Page Object 模式、框架设计、Grid 分布式 |
| [Playwright Web 自动化](docs/自动化测试/Playwright自动化测试教程-软件测试版.md) | 自动等待、网络拦截、Codegen 录制、Trace 回放、API 测试 |
| [Appium App 自动化](docs/自动化测试/Appium-App自动化教程-软件测试版.md) | 移动端自动化、Android/iOS 元素定位、框架设计 |

### 持续集成（1 篇）

| 教程 | 内容 |
|------|------|
| [Jenkins CI/CD](docs/持续集成/Jenkins-CICD教程-软件测试版.md) | Pipeline 流水线、自动化测试集成、Allure 报告、通知告警 |

---

## 🚀 快速开始

### 本地预览

```bash
# 克隆仓库
git clone https://github.com/bingu7/test-tutorials.git
cd test-tutorials

# 安装依赖
pip install mkdocs-material

# 启动本地服务
mkdocs serve

# 浏览器打开 http://127.0.0.1:8000
```

### 在线访问

直接访问：**[https://bingu7.github.io/test-tutorials/](https://bingu7.github.io/test-tutorials/)**

---

## 🛠️ 技术栈

- **文档引擎**：[MkDocs Material](https://squidfunk.github.io/mkdocs-material/)
- **托管平台**：[GitHub Pages](https://pages.github.com/)
- **自动部署**：GitHub Actions（push 到 main 自动构建）

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request：

1. Fork 本仓库
2. 创建分支：`git checkout -b feature/your-feature`
3. 提交修改：`git commit -m "add: xxx"`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 Pull Request

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源。

---

## 🙏 致谢

感谢以下开源项目和社区：

- [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) - 文档主题
- [TesterHome](https://testerhome.com/) - 测试社区
- [OWASP](https://owasp.org/) - 安全标准
- [Apache JMeter](https://jmeter.apache.org/) - 性能测试工具
- [Selenium](https://www.selenium.dev/) - Web 自动化
- [Appium](https://appium.io/) - 移动端自动化
