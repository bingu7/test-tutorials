# Jenkins CI/CD 教程（软件测试人员专用）

> 本教程面向软件测试工程师，讲解如何使用 Jenkins 搭建持续集成流水线，自动化执行测试、生成报告、通知团队。

---

## 一、CI/CD 基础

### 1.1 什么是 CI/CD

| 概念 | 全称 | 含义 |
|------|------|------|
| **CI** | Continuous Integration（持续集成） | 频繁地将代码合入主干，自动构建+测试 |
| **CD** | Continuous Delivery（持续交付） | 代码自动部署到测试环境，随时可发布 |
| **CD** | Continuous Deployment（持续部署） | 代码自动部署到生产 |

### 1.2 测试人员为什么要学 CI/CD

| 场景 | 价值 |
|------|------|
| 自动化测试集成 | 代码提交自动跑测试 |
| 定时回归 | 每天/每周自动回归 |
| 测试报告分发 | 自动生成、自动发送 |
| 多环境部署 | 一键部署测试环境 |
| 质量门禁 | 测试不通过禁止发布 |

### 1.3 没有 CI/CD vs 有 CI/CD

**没有 CI/CD：**

```
开发提交 → 手工编译 → 手工部署 → 手工测试 → 手工通知 → 上线
（耗时长、易出错、难追溯）
```

**有 CI/CD：**

```
开发 git push → Jenkins 自动检测 → 自动编译 → 自动部署 → 自动测试 
→ 自动报告 → 自动通知（分钟级，全程记录）
```

### 1.4 主流 CI/CD 工具

| 工具 | 特点 |
|------|------|
| **Jenkins** | 老牌、开源、插件多 |
| **GitLab CI** | 与 GitLab 深度集成 |
| **GitHub Actions** | GitHub 内置 |
| **TeamCity** | JetBrains 出品 |
| **CircleCI** | 云端服务 |
| **阿里云效 / 腾讯蓝盾** | 国产 |
| **Travis CI** | 开源项目常用 |

> Jenkins 仍是企业内私有部署的事实标准。

---

## 二、Jenkins 简介与安装

### 2.1 Jenkins 是什么

- 开源持续集成工具
- Java 编写，跨平台
- 插件生态丰富（1800+ 插件）
- 支持各种构建工具、版本控制、通知

### 2.2 安装方式

**方式一：Docker（推荐，最简单）**

```bash
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts
```

**方式二：WAR 包**

1. 下载 jenkins.war（`https://www.jenkins.io/download/`）
2. 安装 JDK 17 或 21（Jenkins LTS 2.426+ 已不再支持 JDK 11）
3. 运行：

```bash
java -jar jenkins.war --httpPort=8080
```

**方式三：Linux 包管理**

```bash
# Ubuntu / Debian（apt-key 已弃用，改用 keyrings 目录）
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/" | \
  sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt update
sudo apt install fontconfig openjdk-17-jre jenkins

# CentOS / RHEL
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
sudo yum install fontconfig java-17-openjdk jenkins
```

启动服务：

```bash
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

### 2.3 首次启动

1. 浏览器访问：`http://localhost:8080`
2. 输入初始密码（位置在终端日志，或文件 `/var/jenkins_home/secrets/initialAdminPassword`）
3. 选择安装方式：
   - **Install suggested plugins**（推荐）
   - Select plugins to install（自选）
4. 等待插件安装
5. 创建管理员账号
6. 配置实例 URL
7. 完成

### 2.4 必装插件

进入 `Manage Jenkins` → `Plugins` → `Available plugins`，搜索安装：

| 插件 | 用途 |
|------|------|
| **Git plugin** | Git 集成（通常已装） |
| **Pipeline** | Pipeline 流水线（通常已装） |
| **Blue Ocean** | 可视化 Pipeline |
| **Allure Jenkins Plugin** | Allure 报告集成 |
| **HTML Publisher** | 发布 HTML 报告 |
| **Email Extension** | 邮件通知扩展 |
| **DingTalk** | 钉钉通知 |
| **Build Timestamp** | 构建时间戳 |
| **Timestamper** | 日志时间戳 |
| **Workspace Cleanup** | 清理工作空间 |
| **Role-based Authorization Strategy** | 角色权限 |
| **Parameterized Trigger** | 参数化触发 |

### 2.5 全局工具配置

`Manage Jenkins` → `Tools` 配置：

- JDK 路径
- Maven 路径
- Git 路径
- Allure 路径
- Python 路径

可让 Jenkins 自动安装，或指定本机已有路径。

---

## 三、Jenkins 基础概念

### 3.1 核心概念

| 概念 | 含义 |
|------|------|
| **Job / Project** | 一个构建任务 |
| **Build** | 一次构建执行 |
| **Workspace** | 构建的工作目录 |
| **Pipeline** | 流水线，用代码定义构建过程 |
| **Node / Agent** | 执行构建的机器 |
| **Master** | Jenkins 主节点 |
| **Executor** | 执行器（并发数） |
| **Trigger** | 触发器（如定时、Webhook） |
| **Build Step** | 构建步骤 |
| **Post-build Action** | 构建后动作（通知、归档） |

### 3.2 Job 类型

| 类型 | 用途 |
|------|------|
| **Freestyle project** | 自由风格（界面配置） |
| **Pipeline** | 脚本化流水线（推荐） |
| **Multibranch Pipeline** | 多分支流水线 |
| **Folder** | 文件夹（组织 Job） |
| **External Job** | 监控外部任务 |

### 3.3 主目录结构

`/var/jenkins_home/`（默认）：

```
JENKINS_HOME/
├── jobs/             # 所有 Job 数据
├── workspace/        # 工作空间
├── plugins/          # 插件
├── users/            # 用户
├── secrets/          # 密钥
├── nodes/            # 节点配置
└── config.xml        # 全局配置
```

---

## 四、第一个 Job

### 4.1 创建 Freestyle Job

**Step 1：新建任务**

- 首页点击 `New Item`
- 输入名称：`first-test-job`
- 选择 `Freestyle project`
- 点击 `OK`

**Step 2：配置 General**

- Description：任务描述
- 勾选 `Discard old builds`：保留构建记录数量（避免磁盘满）

**Step 3：配置源码管理**

选择 `Git`：

- Repository URL：`git@github.com:user/api-test.git`
- Credentials：添加凭证（SSH key 或用户名密码）
- Branch：`*/main`

**Step 4：配置构建触发器**

- `Build periodically`：定时构建（cron 格式）
- `Poll SCM`：定时检查代码变化
- `Build when a change is pushed to GitLab`：Webhook 触发

**Step 5：配置构建步骤**

`Add build step` → `Execute shell`（Linux）/ `Execute Windows batch command`（Win）：

```bash
# Linux/Mac
pip install -r requirements.txt
pytest --alluredir=./allure-results

# Windows
pip install -r requirements.txt
pytest --alluredir=./allure-results
```

**Step 6：配置构建后操作**

- Email Notification：失败邮件通知
- Allure Report：生成 Allure 报告

**Step 7：保存并构建**

点击 `Save` → 进入 Job 页 → 点击 `Build Now`

### 4.2 看构建结果

- 左下角出现构建编号 `#1`
- 点击进入查看：
  - **Console Output**：构建日志
  - **Status**：状态、耗时
  - **Changes**：本次代码变更
  - **Workspace**：工作目录

### 4.3 构建状态颜色

| 颜色 | 含义 |
|------|------|
| 🔵 蓝色 | 成功 |
| 🟡 黄色 | 不稳定（如测试有失败） |
| 🔴 红色 | 失败 |
| ⚫ 灰色 | 未构建/已禁用 |

---

## 五、Pipeline 流水线

### 5.1 为什么用 Pipeline

Freestyle 适合简单任务，复杂场景应使用 Pipeline：

| 维度 | Freestyle | Pipeline |
|------|-----------|----------|
| 配置方式 | 界面点选 | 代码定义 |
| 版本控制 | 难 | 易（Jenkinsfile 入仓库） |
| 复用性 | 低 | 高 |
| 复杂逻辑 | 难 | 易 |
| 可视化 | 一般 | 强（Blue Ocean） |

### 5.2 Pipeline 类型

**Declarative Pipeline（声明式，推荐）：** 结构化、可读性强

**Scripted Pipeline（脚本式）：** Groovy 编程，灵活但复杂

### 5.3 第一个 Pipeline

新建 Job → 选 `Pipeline` 类型 → 在 `Pipeline` 节填脚本：

```groovy
pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                echo '拉取代码'
                git branch: 'main', url: 'git@github.com:user/api-test.git'
            }
        }
        
        stage('Install') {
            steps {
                echo '安装依赖'
                sh 'pip install -r requirements.txt'
            }
        }
        
        stage('Test') {
            steps {
                echo '执行测试'
                sh 'pytest --alluredir=./allure-results'
            }
        }
        
        stage('Report') {
            steps {
                echo '生成报告'
                allure includeProperties: false, results: [[path: 'allure-results']]
            }
        }
    }
    
    post {
        always {
            echo '清理工作空间'
            cleanWs()
        }
        success {
            echo '构建成功'
        }
        failure {
            echo '构建失败'
        }
    }
}
```

### 5.4 声明式 Pipeline 结构

```groovy
pipeline {
    agent any                    // 执行节点
    
    environment {                // 环境变量
        ENV_NAME = 'test'
    }
    
    parameters {                 // 参数
        string(name: 'BRANCH', defaultValue: 'main', description: '分支')
    }
    
    triggers {                   // 触发器
        cron('H 2 * * *')        // 每天凌晨 2 点
    }
    
    options {                    // 选项
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }
    
    stages {                     // 阶段
        stage('阶段名') {
            steps { ... }
        }
    }
    
    post {                       // 构建后
        always { ... }
        success { ... }
        failure { ... }
    }
}
```

### 5.5 常用 Steps

```groovy
// Shell 命令
sh 'pytest'
sh '''
    cd /opt/app
    ./startup.sh
'''

// Windows 命令
bat 'pytest'
powershell 'Get-Process'

// Git
git branch: 'main', url: 'xxx'
git credentialsId: 'my-key', url: 'xxx'

// 输出
echo 'Hello'

// 文件操作
writeFile file: 'test.txt', text: 'content'
readFile 'test.txt'

// 归档构建产物
archiveArtifacts artifacts: 'reports/**/*.html'

// 发送邮件
mail to: 'team@example.com',
     subject: 'Build Failed',
     body: 'Check Jenkins'

// 等待用户输入
input message: '确认部署到生产?', ok: '部署'

// 并行执行
parallel(
    'test_module_a': {
        sh 'pytest tests/module_a'
    },
    'test_module_b': {
        sh 'pytest tests/module_b'
    }
)

// 条件
when {
    branch 'main'
    expression { params.DEPLOY == 'true' }
}

// 凭据
withCredentials([usernamePassword(credentialsId: 'db', 
                                  usernameVariable: 'USER', 
                                  passwordVariable: 'PWD')]) {
    sh 'mysql -u $USER -p$PWD'
}
```

### 5.6 Jenkinsfile（推荐）

把 Pipeline 脚本放到代码仓库的 `Jenkinsfile` 文件中：

```
api-test/
├── Jenkinsfile           ← 流水线定义
├── requirements.txt
├── testcases/
└── ...
```

Jenkins Job 配置选择 `Pipeline script from SCM`：

- SCM：Git
- Repository URL：仓库地址
- Script Path：`Jenkinsfile`

**好处：** 流水线代码化、版本管理、与代码同步演进。

---

## 六、参数化构建

让一个 Job 可以按不同参数运行。

### 6.1 配置参数

Freestyle Job 勾选 `This project is parameterized`：

**常用参数类型：**

| 类型 | 用途 |
|------|------|
| String Parameter | 字符串输入 |
| Choice Parameter | 下拉选择 |
| Boolean Parameter | 复选框 |
| Multi-line String | 多行文本 |
| Password | 密码（脱敏） |
| File | 上传文件 |
| Git Parameter | 选择分支/Tag |

**示例：**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| BRANCH | String | main | Git 分支 |
| ENV | Choice | test\|dev\|prod | 测试环境 |
| TEST_TYPE | Choice | smoke\|regression\|all | 测试范围 |
| PARALLEL | Boolean | true | 并发执行 |

### 6.2 Pipeline 参数

```groovy
pipeline {
    agent any
    
    parameters {
        string(name: 'BRANCH', defaultValue: 'main', description: 'Git 分支')
        choice(name: 'ENV', choices: ['test', 'dev', 'prod'], description: '环境')
        booleanParam(name: 'PARALLEL', defaultValue: true, description: '并发')
        password(name: 'API_KEY', defaultValue: '', description: 'API 密钥')
    }
    
    stages {
        stage('Run') {
            steps {
                echo "分支：${params.BRANCH}"
                echo "环境：${params.ENV}"
                sh "TEST_ENV=${params.ENV} pytest"
            }
        }
    }
}
```

### 6.3 触发参数化构建

- 在 Job 页点 `Build with Parameters`
- 填写参数
- 点击 `Build`

---

## 七、集成自动化测试

### 7.1 Python 接口自动化（Pytest）

**前置：** Jenkins 服务器装好 Python 和 pip

**Pipeline 示例：**

```groovy
pipeline {
    agent any
    
    environment {
        PYTHONIOENCODING = 'utf-8'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', credentialsId: 'gitlab-key',
                    url: 'git@gitlab.com:test/api-automation.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh '''
                    python3 -m venv venv
                    . venv/bin/activate
                    pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
                '''
            }
        }
        
        stage('Run Tests') {
            steps {
                sh '''
                    . venv/bin/activate
                    pytest --alluredir=./allure-results -v
                '''
            }
        }
    }
    
    post {
        always {
            // 生成 Allure 报告
            allure includeProperties: false, results: [[path: 'allure-results']]
        }
    }
}
```

> `pytest` 失败会导致 sh 返回非 0，构建被标记失败。如希望即便测试失败也继续生成报告，可加 `|| true`。

### 7.2 Java 自动化（Maven + TestNG）

```groovy
pipeline {
    agent any
    
    tools {
        jdk 'JDK17'
        maven 'Maven3'
    }
    
    stages {
        stage('Test') {
            steps {
                sh 'mvn clean test'
            }
        }
    }
    
    post {
        always {
            junit 'target/surefire-reports/*.xml'
        }
    }
}
```

### 7.3 JMeter 性能测试

```groovy
pipeline {
    agent any
    
    parameters {
        string(name: 'THREADS', defaultValue: '100')
        string(name: 'DURATION', defaultValue: '300')
    }
    
    stages {
        stage('Run JMeter') {
            steps {
                sh '''
                    jmeter -n \
                      -t test.jmx \
                      -l result.jtl \
                      -e -o report \
                      -Jthreads=${THREADS} \
                      -Jduration=${DURATION}
                '''
            }
        }
    }
    
    post {
        always {
            publishHTML([
                reportDir: 'report',
                reportFiles: 'index.html',
                reportName: 'JMeter Report'
            ])
        }
    }
}
```

### 7.4 Web UI 自动化（Selenium）

需要在 Jenkins 节点装浏览器和驱动，或用 Docker + Selenium Grid。

```groovy
pipeline {
    agent any
    
    stages {
        stage('UI Test') {
            steps {
                sh '''
                    export DISPLAY=:99
                    Xvfb :99 -ac &
                    pytest tests/ui --alluredir=./allure-results
                '''
            }
        }
    }
}
```

---

## 八、集成 Allure 报告

### 8.1 安装 Allure 插件

`Manage Jenkins` → `Plugins` → 搜索 `Allure Jenkins Plugin` → 安装。

### 8.2 配置 Allure 命令行

`Manage Jenkins` → `Tools` → `Allure Commandline installations`：

- Name：`Allure`
- 勾选 `Install automatically` 选最新版本

或指向已安装路径：

- Name：`Allure`
- ALLURE_HOME：`/opt/allure`

### 8.3 在 Pipeline 中使用

```groovy
post {
    always {
        allure([
            includeProperties: false,
            properties: [],
            reportBuildPolicy: 'ALWAYS',
            results: [[path: 'allure-results']]
        ])
    }
}
```

> 新版 Allure 插件中 `jdk: ''` 参数已废弃，省略即可。

构建完成后，Job 页面出现 `Allure Report` 链接。

### 8.4 Freestyle 中使用

构建后操作 → `Allure Report`：

- Results：`allure-results`
- Path：（项目根目录）

### 8.5 历史趋势保留

Allure 插件自动保留每次构建的历史，可在报告中看到：

- 构建趋势
- 用例通过率变化
- 持续时间变化

---

## 九、通知与告警

### 9.1 邮件通知

**前置：配置 SMTP**

`Manage Jenkins` → `System` → `E-mail Notification`：

- SMTP server：`smtp.example.com`
- User Name：`jenkins@example.com`
- Password：`****`
- Use SSL：勾选
- SMTP Port：`465`

测试发送邮件。

**Freestyle 中使用：**

构建后操作 → `E-mail Notification`：

- Recipients：`team@example.com`

**Pipeline 中：**

```groovy
post {
    failure {
        mail to: 'team@example.com',
             subject: "构建失败: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
             body: """
                构建失败，请查看：${env.BUILD_URL}
                
                Job: ${env.JOB_NAME}
                Build: ${env.BUILD_NUMBER}
             """
    }
    success {
        mail to: 'team@example.com',
             subject: "构建成功: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
             body: "查看：${env.BUILD_URL}"
    }
}
```

### 9.2 Email Extension（增强邮件）

支持 HTML、附件、模板。

```groovy
post {
    always {
        emailext(
            subject: "构建报告: ${env.JOB_NAME} #${env.BUILD_NUMBER} - ${currentBuild.currentResult}",
            body: '''
                <h2>构建报告</h2>
                <p>项目: ${JOB_NAME}</p>
                <p>构建号: ${BUILD_NUMBER}</p>
                <p>结果: ${BUILD_STATUS}</p>
                <p>报告: <a href="${BUILD_URL}allure">Allure Report</a></p>
            ''',
            to: 'team@example.com',
            mimeType: 'text/html'
        )
    }
}
```

### 9.3 钉钉通知

**安装 DingTalk 插件**

**创建钉钉机器人：**
- 钉钉群 → 设置 → 智能群助手 → 添加机器人 → 自定义
- 获取 Webhook URL

**配置 Jenkins：**

`Manage Jenkins` → `System` → `DingTalk` → 添加机器人：

- 名称：测试通知
- Webhook：`https://oapi.dingtalk.com/robot/send?access_token=xxx`
- 关键词或加签

**Pipeline 使用：**

```groovy
post {
    always {
        dingtalk(
            robot: 'test-robot',
            type: 'MARKDOWN',
            title: "构建通知",
            text: [
                "## ${env.JOB_NAME}",
                "- 构建号: #${env.BUILD_NUMBER}",
                "- 结果: ${currentBuild.currentResult}",
                "- 耗时: ${currentBuild.durationString}",
                "- [查看详情](${env.BUILD_URL})"
            ]
        )
    }
}
```

### 9.4 企业微信通知

类似钉钉，通过 Webhook：

```groovy
def sendWeChat(msg) {
    def webhook = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx"
    def payload = """
    {
        "msgtype": "markdown",
        "markdown": {"content": "${msg}"}
    }
    """
    sh """
        curl -X POST -H "Content-Type: application/json" \
             -d '${payload}' ${webhook}
    """
}

post {
    failure {
        script {
            sendWeChat("构建失败 ${env.JOB_NAME} #${env.BUILD_NUMBER}")
        }
    }
}
```

---

## 十、定时构建与触发器

### 10.1 定时构建（Cron）

Jenkins 用 5 个字段的 cron 表达式：

```
分钟  小时  日  月  星期
*    *    *   *   *
```

**示例：**

```
H 2 * * *           每天凌晨 2 点
H/15 * * * *        每 15 分钟
H 9 * * 1-5         工作日 9 点
0 0 1 * *           每月 1 号 0 点
```

> Jenkins 推荐用 `H`（Hash）替代固定值，避免多 Job 集中触发。`H 2 * * *` 意为 2 点-2:59 之间随机一分钟。

### 10.2 SCM 轮询

定时检查代码是否变化，有变化才构建：

```
H/5 * * * *    每 5 分钟检查
```

> 不推荐，建议用 Webhook 推送。

### 10.3 Webhook 触发

代码提交时由 Git 平台主动通知 Jenkins。

**GitLab Webhook 配置：**

1. Jenkins Job 勾选 `Build when a change is pushed to GitLab`
2. 复制 GitLab Webhook URL
3. GitLab 项目 → Settings → Webhooks → 粘贴 URL
4. 选择触发事件（Push、Merge Request）

**GitHub 类似。**

### 10.4 上游触发

A Job 完成后自动触发 B Job：

```
Build Triggers → Build after other projects are built
Projects to watch: jobA
```

### 10.5 手动触发

不配触发器，只能手动 `Build Now`。适合按需运行。

---

## 十一、用户与权限管理

### 11.1 全局安全配置

`Manage Jenkins` → `Security` → `Configure Global Security`：

**Authentication（认证）：**

- Jenkins' own user database（推荐起步）
- LDAP（企业 AD）
- GitHub / GitLab OAuth

**Authorization（授权）：**

- Logged-in users can do anything（开发期简单）
- Matrix-based security（矩阵权限）
- **Role-Based Strategy**（推荐，需装插件）

### 11.2 基于角色的权限（推荐）

**安装 Role-based Authorization Strategy 插件**

**Step 1：创建角色**

`Manage Jenkins` → `Manage and Assign Roles` → `Manage Roles`：

| Role | 权限 |
|------|------|
| admin | 所有权限 |
| developer | 创建/构建/查看 |
| tester | 构建/查看 |
| viewer | 只看 |

**Step 2：创建用户**

`Manage Jenkins` → `Users` → 新建。

**Step 3：分配角色**

`Manage Jenkins` → `Manage and Assign Roles` → `Assign Roles`：

| User | admin | developer | tester | viewer |
|------|-------|-----------|--------|--------|
| admin | ✓ | | | |
| zhangsan | | ✓ | | |
| lisi | | | ✓ | |

### 11.3 项目权限

可针对特定 Job/Folder 给特定用户权限，避免一人乱动他人 Job。

---

## 十二、实战案例

### 12.1 案例一：接口自动化每日回归

**目标：** 每天凌晨自动回归所有接口测试，生成 Allure 报告，钉钉通知。

```groovy
pipeline {
    agent any
    
    triggers {
        cron('H 2 * * *')
    }
    
    options {
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '30'))
    }
    
    environment {
        TEST_ENV = 'test'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', credentialsId: 'git-key',
                    url: 'git@gitlab.com:test/api-automation.git'
            }
        }
        
        stage('Setup') {
            steps {
                sh '''
                    python3 -m venv venv
                    . venv/bin/activate
                    pip install -r requirements.txt
                '''
            }
        }
        
        stage('Test') {
            steps {
                sh '''
                    . venv/bin/activate
                    pytest --alluredir=./allure-results -v
                ''' 
            }
        }
    }
    
    post {
        always {
            allure results: [[path: 'allure-results']]
            cleanWs(patterns: [[pattern: 'venv/**', type: 'INCLUDE']])
        }
        success {
            dingtalk(
                robot: 'test-robot',
                type: 'MARKDOWN',
                title: '回归通过',
                text: ["## ✅ ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                       "- 状态: 通过",
                       "- 报告: [查看](${env.BUILD_URL}allure)"]
            )
        }
        failure {
            dingtalk(
                robot: 'test-robot',
                type: 'MARKDOWN',
                title: '回归失败',
                text: ["## ❌ ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                       "- 状态: 失败",
                       "- 报告: [查看](${env.BUILD_URL}allure)",
                       "- @负责人"]
            )
        }
    }
}
```

### 12.2 案例二：多环境部署+测试

**场景：** 一键部署到测试/预发布/生产 + 测试。

```groovy
pipeline {
    agent any
    
    parameters {
        choice(name: 'ENV', choices: ['test', 'staging', 'prod'])
        choice(name: 'TEST_LEVEL', choices: ['smoke', 'full', 'none'])
    }
    
    stages {
        stage('Confirm') {
            when { expression { params.ENV == 'prod' } }
            steps {
                input message: '确认部署到生产？', ok: '确认'
            }
        }
        
        stage('Build') {
            steps {
                sh 'mvn package -DskipTests'
            }
        }
        
        stage('Deploy') {
            steps {
                sh "./deploy.sh ${params.ENV}"
            }
        }
        
        stage('Smoke Test') {
            when { expression { params.TEST_LEVEL != 'none' } }
            steps {
                sh "pytest tests/smoke --env=${params.ENV}"
            }
        }
        
        stage('Full Test') {
            when { expression { params.TEST_LEVEL == 'full' } }
            steps {
                sh "pytest tests/ --env=${params.ENV}"
            }
        }
    }
}
```

### 12.3 案例三：并行多模块测试

```groovy
pipeline {
    agent any
    
    stages {
        stage('Parallel Tests') {
            parallel {
                stage('User Module') {
                    steps {
                        sh 'pytest tests/user --alluredir=./allure-results/user'
                    }
                }
                stage('Order Module') {
                    steps {
                        sh 'pytest tests/order --alluredir=./allure-results/order'
                    }
                }
                stage('Payment Module') {
                    steps {
                        sh 'pytest tests/payment --alluredir=./allure-results/payment'
                    }
                }
            }
        }
        
        stage('Merge Reports') {
            steps {
                sh 'mkdir -p allure-results-merged'
                sh 'cp -r allure-results/* allure-results-merged/'
            }
        }
    }
    
    post {
        always {
            allure results: [[path: 'allure-results-merged']]
        }
    }
}
```

### 12.4 案例四：性能测试流水线

```groovy
pipeline {
    agent any
    
    parameters {
        string(name: 'THREADS', defaultValue: '500')
        string(name: 'DURATION', defaultValue: '600')
    }
    
    stages {
        stage('Prepare Env') {
            steps {
                sh './setup-perf-env.sh'
            }
        }
        
        stage('Warmup') {
            steps {
                sh 'jmeter -n -t warmup.jmx -l warmup.jtl'
            }
        }
        
        stage('Load Test') {
            steps {
                sh """
                    jmeter -n -t load.jmx \
                      -l result.jtl \
                      -e -o report \
                      -Jthreads=${params.THREADS} \
                      -Jduration=${params.DURATION}
                """
            }
        }
        
        stage('Analyze') {
            steps {
                sh 'python analyze.py result.jtl > analysis.txt'
            }
        }
    }
    
    post {
        always {
            publishHTML([
                reportDir: 'report',
                reportFiles: 'index.html',
                reportName: 'JMeter Report'
            ])
            archiveArtifacts artifacts: 'result.jtl,analysis.txt'
        }
    }
}
```

---

## 十三、常见问题排查

### 13.1 Jenkins 启动失败

```bash
# 看日志
journalctl -u jenkins -f
# 或
tail -f /var/log/jenkins/jenkins.log
```

常见原因：
- JDK 版本不对（Jenkins LTS 2.426+ 需要 JDK 17 或 21）
- 端口被占用
- 内存不足

### 13.2 构建一直挂起

- 看是否有 Executor 可用
- 看节点是否在线
- 看 Job 配置是否有 `disableConcurrentBuilds`

### 13.3 Git clone 失败

**HTTPS 仓库：** 配置用户名密码凭证

**SSH 仓库：**
- Jenkins 用户的 `~/.ssh/id_rsa` 是否正确
- known_hosts 是否含目标主机
- 凭证 ID 是否对

```bash
sudo -u jenkins ssh -T git@gitlab.com
```

### 13.4 Python 环境问题

- Jenkins 默认 PATH 可能不含用户安装的 Python
- 配置全局变量：`Manage Jenkins` → `System` → `Global properties` → `Environment variables`
- 或在 Pipeline 中指定绝对路径：`/usr/local/bin/python3`

### 13.5 中文乱码

```groovy
environment {
    LANG = 'en_US.UTF-8'
    LC_ALL = 'en_US.UTF-8'
    PYTHONIOENCODING = 'utf-8'
}
```

或修改 Jenkins 启动参数：

```
JAVA_OPTS="-Dfile.encoding=UTF-8"
```

### 13.6 Allure 报告打不开

- 是否装了 Allure 插件
- 是否配了 Allure Commandline
- `allure-results` 路径是否对
- Java 是否安装

### 13.7 磁盘满

```bash
# 看磁盘
df -h

# 看 Jenkins 占用
du -sh /var/jenkins_home/*

# 通常 jobs 占大头，清理老构建
# Job 配置 → Discard old builds → 限制保留数量
```

### 13.8 构建慢

- 检查网络（下载依赖慢？）
- 用国内 pip 源
- 缓存依赖（如 `~/.m2`、`venv`）
- 并行执行
- 增加 Executor

### 13.9 凭证管理

`Manage Jenkins` → `Credentials` → `System` → `Global` → 添加：

| 类型 | 用途 |
|------|------|
| Username with password | HTTPS Git、数据库 |
| SSH Username with private key | SSH Git |
| Secret text | Token、API Key |
| Secret file | 密钥文件 |

Pipeline 使用：

```groovy
withCredentials([string(credentialsId: 'api-token', variable: 'TOKEN')]) {
    sh 'curl -H "Authorization: $TOKEN" http://api.example.com'
}
```

> 凭据不会在日志中明文显示，自动脱敏。

---

## 十四、最佳实践

### 14.1 Pipeline 设计原则

- **代码化**：Jenkinsfile 入仓库
- **模块化**：复杂逻辑用 Shared Library
- **快速失败**：尽早暴露问题
- **可重复**：每次构建独立、无副作用
- **可观测**：充足日志、清晰阶段
- **可回滚**：保留历史构建

### 14.2 性能优化

- 用 Master 触发，Agent 执行（不让 Master 干活）
- 并行执行独立任务
- 缓存依赖（Maven、pip、npm）
- 增加 Executor
- 定期清理工作空间

### 14.3 安全建议

- 使用 HTTPS 访问 Jenkins
- 启用用户认证
- 最小权限原则
- 凭据用 Jenkins 内置管理，不写代码里
- 定期升级 Jenkins 和插件
- 备份 `JENKINS_HOME`

### 14.4 维护建议

- 限制构建保留数：避免磁盘满
- 定期清理无用 Job
- 监控 Jenkins 自身（CPU、内存、磁盘）
- 关键 Job 加监控告警
- 文档化（Job 说明、负责人）

---

## 附录：常用环境变量

| 变量 | 含义 |
|------|------|
| `BUILD_NUMBER` | 构建编号 |
| `BUILD_ID` | 构建 ID |
| `BUILD_URL` | 构建 URL |
| `JOB_NAME` | Job 名 |
| `WORKSPACE` | 工作目录 |
| `JENKINS_URL` | Jenkins URL |
| `BUILD_TAG` | jenkins-${JOB_NAME}-${BUILD_NUMBER} |
| `GIT_COMMIT` | Git 提交 hash |
| `GIT_BRANCH` | Git 分支 |

---

> **测试纪律：** Jenkins 是高权限工具，配置好用户权限。生产环境部署 Job 要加 input 确认，避免误操作。凭据妥善管理，不出现在日志或代码中。
