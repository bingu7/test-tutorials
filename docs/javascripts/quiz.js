// ==================== 测验系统 ====================
// 依赖：common.js（__resolveUrl）

(function() {
    'use strict';

    // 通过线：正确率 ≥ 80% 记为通过，与学习路线/通关检查中的"80 分"口径保持一致
    var PASS_THRESHOLD = 80;
    // 中间档：≥ 60% 给出"基础掌握不错"的反馈
    var OK_THRESHOLD = 60;

    // 测验 ID → 复习建议/下一步映射
    var QUIZ_REVIEW_MAP = {
        'python-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/基础理论/Python基础教程-软件测试版/', text: 'Python 基础教程' }],
            reviewFocus: '重点关注：函数定义、数据类型、异常处理、模块导入',
            passLinks: [
                { url: '/工具操作/数据库SQL教程-软件测试版/', text: '数据库 SQL 教程' },
                { url: '/工具操作/Linux实用教程-软件测试版/', text: 'Linux 实用教程' }
            ],
            passText: 'Python 基础已掌握，建议继续学习：',
            failText: '建议先巩固 Python 基础，再继续学习其他内容。'
        },
        'sql-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/工具操作/数据库SQL教程-软件测试版/', text: '数据库 SQL 教程' }],
            reviewFocus: '重点关注：JOIN 多表查询、GROUP BY 分组、NULL 值处理、LIMIT 分页',
            passLinks: [
                { url: '/工具操作/Postman接口测试教程-软件测试版/', text: 'Postman 接口测试' },
                { url: '/工具操作/Fiddler抓包教程-软件测试版/', text: 'Fiddler 抓包教程' }
            ],
            passText: 'SQL 基础已掌握，建议继续学习：',
            failText: '建议先巩固 SQL 基础，再继续学习其他内容。'
        },
        'api-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/专项测试/接口测试完整教程-软件测试版/', text: '接口测试方法论' }],
            reviewFocus: '重点关注：HTTP 方法、状态码、接口用例设计、断言策略',
            passLinks: [
                { url: '/专项测试/接口测试进阶测验/', text: '接口测试进阶测验' },
                { url: '/自动化测试/Python+Requests+Allure接口自动化教程-软件测试版/', text: 'Python 接口自动化' }
            ],
            passText: '接口测试基础已掌握，建议继续学习：',
            failText: '建议先巩固接口测试基础，再继续学习其他内容。'
        },
        'api-advanced': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [
                { url: '/专项测试/接口测试完整教程-软件测试版/', text: '接口测试方法论' },
                { url: '/基础理论/测试用例设计方法论教程-软件测试版/', text: '测试用例设计方法论' }
            ],
            reviewFocus: '重点关注：等价类与边界值、RESTful 规范、数据驱动与参数化、Mock 服务、幂等性与安全测试',
            passLinks: [
                { url: '/自动化测试/Python+Requests+Allure接口自动化教程-软件测试版/', text: 'Python 接口自动化' },
                { url: '/项目实战/接口自动化项目实战/', text: '接口自动化项目实战' }
            ],
            passText: '接口测试进阶已掌握，建议继续学习：',
            failText: '建议先回看接口测试方法论与用例设计方法论，再重新测验。'
        },
        'playwright-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/自动化测试/Playwright自动化测试教程-软件测试版/', text: 'Playwright 自动化测试教程' }],
            reviewFocus: '重点关注：语义化定位器、自动等待机制、expect 断言、Page Object 模式、Trace 回放',
            passLinks: [
                { url: '/项目实战/Web自动化项目实战/', text: 'Web 自动化项目实战' },
                { url: '/自动化测试/Selenium-Web自动化教程-软件测试版/', text: 'Selenium Web 自动化' }
            ],
            passText: 'Playwright 基础已掌握，建议继续学习：',
            failText: '建议先巩固 Playwright 基础，再继续学习其他内容。'
        },
        'testing-theory': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [
                { url: '/基础理论/软件测试理论基础教程/', text: '软件测试理论基础教程' },
                { url: '/基础理论/ISTQB软件测试术语速查/', text: 'ISTQB 术语速查' }
            ],
            reviewFocus: '重点关注：测试原则、测试级别与类型、用例设计、缺陷严重程度与优先级',
            passLinks: [
                { url: '/工具操作/数据库SQL教程-软件测试版/', text: '数据库 SQL 教程' },
                { url: '/工具操作/Postman接口测试教程-软件测试版/', text: 'Postman 接口测试' }
            ],
            passText: '测试理论已掌握，建议继续学习：',
            failText: '建议先巩固软件测试理论基础，再继续学习其他内容。'
        },
        'linux-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/工具操作/Linux实用教程-软件测试版/', text: 'Linux 实用教程' }],
            reviewFocus: '重点关注：常用命令、日志排查、进程与端口、权限与磁盘',
            passLinks: [
                { url: '/工具操作/Git版本控制教程-软件测试版/', text: 'Git 版本控制' },
                { url: '/工具操作/Docker容器教程-软件测试版/', text: 'Docker 容器' }
            ],
            passText: 'Linux 基础已掌握，建议继续学习：',
            failText: '建议先巩固 Linux 基础，再继续学习其他内容。'
        },
        'network-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/工具操作/网络知识教程-软件测试版/', text: '网络知识教程' }],
            reviewFocus: '重点关注：TCP 三次握手与四次挥手、HTTP 状态码、Cookie/Session/Token、DNS 解析、HTTPS 抓包证书',
            passLinks: [
                { url: '/工具操作/Fiddler抓包教程-软件测试版/', text: 'Fiddler 抓包教程' },
                { url: '/工具操作/Charles抓包教程-软件测试版/', text: 'Charles 抓包教程' }
            ],
            passText: '网络知识已掌握，建议继续学习：',
            failText: '建议先回看网络知识教程，重点补状态码与抓包证书部分。'
        },
        'ci-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/持续集成/Jenkins-CICD教程-软件测试版/', text: 'Jenkins CI/CD 教程' }],
            reviewFocus: '重点关注：CI/CD 概念、声明式 Pipeline 语法、Webhook 触发、Docker 环境一致性、质量门禁',
            passLinks: [
                { url: '/持续集成/GitHub-Actions教程-软件测试版/', text: 'GitHub Actions 教程' },
                { url: '/项目实战/CICD自动化回归实战/', text: 'CI/CD 自动化回归实战' }
            ],
            passText: '持续集成已掌握，建议继续学习：',
            failText: '建议先回看 Jenkins CI/CD 教程，重点补 Pipeline 语法与触发机制。'
        },
        'git-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/工具操作/Git版本控制教程-软件测试版/', text: 'Git 版本控制教程' }],
            reviewFocus: '重点关注：工作区/暂存区/版本库、分支与合并、冲突解决步骤、reset 与 revert 的区别、stash 与 reflog',
            passLinks: [
                { url: '/工具操作/Docker容器教程-软件测试版/', text: 'Docker 容器教程' },
                { url: '/持续集成/Jenkins-CICD教程-软件测试版/', text: 'Jenkins CI/CD' }
            ],
            passText: 'Git 基础已掌握，建议继续学习：',
            failText: '建议先回看 Git 版本控制教程，重点补暂存区概念与冲突解决流程。'
        },
        'docker-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/工具操作/Docker容器教程-软件测试版/', text: 'Docker 容器教程' }],
            reviewFocus: '重点关注：镜像与容器的关系、docker run 与端口映射、容器日志与排障、Dockerfile 常用指令、数据卷与 Compose',
            passLinks: [
                { url: '/持续集成/持续集成测验/', text: '持续集成测验' },
                { url: '/持续集成/Jenkins-CICD教程-软件测试版/', text: 'Jenkins CI/CD' }
            ],
            passText: 'Docker 基础已掌握，建议继续学习：',
            failText: '建议先回看 Docker 容器教程，重点补端口映射、容器排障与数据卷。'
        },
        'jmeter-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/专项测试/JMeter性能测试教程-软件测试版/', text: 'JMeter 性能测试教程' }],
            reviewFocus: '重点关注：TPS/RT/错误率口径与换算、线程组与 Ramp-up、参数化与 CSV、JSON Extractor 关联、聚合报告与拐点分析',
            passLinks: [
                { url: '/项目实战/性能测试项目实战/', text: '性能测试项目实战' },
                { url: '/面试专题/性能测试面试题/', text: '性能测试面试题' }
            ],
            passText: 'JMeter 性能测试已掌握，建议继续学习：',
            failText: '建议先回看 JMeter 性能测试教程，重点补指标换算、关联与结果分析。'
        },
        'security-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [
                { url: '/专项测试/Web安全测试教程-软件测试版/', text: 'Web 安全测试教程' },
                { url: '/专项测试/接口测试完整教程-软件测试版/', text: '接口测试方法论' }
            ],
            reviewFocus: '重点关注：OWASP Top 10 分类、SQL 注入与 XSS 的 payload 区别、CSRF 防御手段、水平/垂直越权、敏感信息泄露与文件上传',
            passLinks: [
                { url: '/案例库/安全测试案例-软件测试版/', text: '安全测试案例' },
                { url: '/面试专题/安全测试面试题/', text: '安全测试面试题' }
            ],
            passText: 'Web 安全测试已掌握，建议继续学习：',
            failText: '建议先回看 Web 安全测试教程，重点补越权、注入的测试方法与防御验证。'
        },
        'python-api': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [
                { url: '/自动化测试/Python+Requests+Allure接口自动化教程-软件测试版/', text: 'Python 接口自动化教程' },
                { url: '/基础理论/Python基础教程-软件测试版/', text: 'Python 基础教程' }
            ],
            reviewFocus: '重点关注：requests 的 params/data/json 区别、Session 会话保持、pytest fixture 与 scope、参数化、分层设计、Allure 报告生成流程',
            passLinks: [
                { url: '/项目实战/接口自动化项目实战/', text: '接口自动化项目实战' },
                { url: '/面试专题/自动化测试面试题/', text: '自动化测试面试题' }
            ],
            passText: 'Python 接口自动化已掌握，建议继续学习：',
            failText: '建议先回看 Python 接口自动化教程，重点补 pytest fixture 与分层设计。'
        },
        'selenium-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [
                { url: '/自动化测试/Selenium-Web自动化教程-软件测试版/', text: 'Selenium Web 自动化教程' },
                { url: '/基础理论/前端基础教程-软件测试版/', text: '前端基础教程' }
            ],
            reviewFocus: '重点关注：定位策略与 data-testid、显式等待与 expected_conditions、iframe 与多窗口切换、Page Object 模式、失败截图',
            passLinks: [
                { url: '/项目实战/Web自动化项目实战/', text: 'Web 自动化项目实战' },
                { url: '/自动化测试/Playwright基础测验/', text: 'Playwright 基础测验' }
            ],
            passText: 'Selenium 基础已掌握，建议继续学习：',
            failText: '建议先回看 Selenium 教程，重点补等待机制与 Page Object。'
        },
        'postman-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/工具操作/Postman接口测试教程-软件测试版/', text: 'Postman 接口测试教程' }],
            reviewFocus: '重点关注：请求方法与参数位置（params/body/header）、环境变量与变量作用域、断言脚本、Collection 与 Runner、Mock 与鉴权配置',
            passLinks: [
                { url: '/专项测试/接口测试基础测验/', text: '接口测试基础测验' },
                { url: '/工具操作/Fiddler抓包教程-软件测试版/', text: 'Fiddler 抓包教程' }
            ],
            passText: 'Postman 已掌握，建议继续学习：',
            failText: '建议先回看 Postman 接口测试教程，重点补变量作用域与断言编写。'
        },
        'fiddler-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/工具操作/Fiddler抓包教程-软件测试版/', text: 'Fiddler 抓包教程' }],
            reviewFocus: '重点关注：HTTPS 解密证书配置、Filters 过滤、断点改包（Breakpoints）、AutoResponder 打桩、Composer 重放、移动端代理抓包',
            passLinks: [
                { url: '/工具操作/Charles抓包测验/', text: 'Charles 抓包测验' },
                { url: '/工具操作/接口抓包联调实战教程-软件测试版/', text: '接口抓包联调实战' }
            ],
            passText: 'Fiddler 抓包已掌握，建议继续学习：',
            failText: '建议先回看 Fiddler 抓包教程，重点补 HTTPS 解密与断点改包。'
        },
        'charles-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/工具操作/Charles抓包教程-软件测试版/', text: 'Charles 抓包教程' }],
            reviewFocus: '重点关注：SSL Proxying 设置、Map Local/Map Remote 映射、Rewrite 重写、断点编辑、手机端证书安装、弱网模拟',
            passLinks: [
                { url: '/工具操作/接口抓包联调实战教程-软件测试版/', text: '接口抓包联调实战' },
                { url: '/专项测试/接口测试基础测验/', text: '接口测试基础测验' }
            ],
            passText: 'Charles 抓包已掌握，建议继续学习：',
            failText: '建议先回看 Charles 抓包教程，重点补 SSL Proxying 与 Map/Rewrite 的区别。'
        },
        'javascript-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/基础理论/JavaScript基础教程-软件测试版/', text: 'JavaScript 基础教程' }],
            reviewFocus: '重点关注：var/let/const 区别、== 与 ===、数组与对象常用方法、异步（Promise/async-await）、DOM 操作与前端报错定位',
            passLinks: [
                { url: '/基础理论/TypeScript基础测验/', text: 'TypeScript 基础测验' },
                { url: '/自动化测试/Playwright基础测验/', text: 'Playwright 基础测验' }
            ],
            passText: 'JavaScript 基础已掌握，建议继续学习：',
            failText: '建议先回看 JavaScript 基础教程，重点补作用域与异步处理。'
        },
        'typescript-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/基础理论/TypeScript基础教程-软件测试版/', text: 'TypeScript 基础教程' }],
            reviewFocus: '重点关注：类型注解与类型推断、interface 与 type 的区别、联合/交叉类型、泛型、编译配置与 tsc 流程',
            passLinks: [
                { url: '/自动化测试/Playwright基础测验/', text: 'Playwright 基础测验' },
                { url: '/自动化测试/Selenium-Web自动化教程-软件测试版/', text: 'Selenium Web 自动化教程' }
            ],
            passText: 'TypeScript 基础已掌握，建议继续学习：',
            failText: '建议先回看 TypeScript 基础教程，重点补类型系统与泛型。'
        },
        'istqb-terms': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [
                { url: '/基础理论/ISTQB软件测试术语速查/', text: 'ISTQB 术语速查' },
                { url: '/基础理论/软件测试理论基础教程/', text: '软件测试理论基础教程' }
            ],
            reviewFocus: '重点关注：错误/缺陷/故障的因果链、测试级别与测试类型的区别、黑盒与白盒技术归类、严重程度与优先级、进入与退出准则',
            passLinks: [
                { url: '/基础理论/测试金字塔测验/', text: '测试金字塔测验' },
                { url: '/基础理论/测试用例设计测验/', text: '测试用例设计测验' }
            ],
            passText: 'ISTQB 术语已掌握，建议继续学习：',
            failText: '建议先回看 ISTQB 术语速查，重点区分级别与类型、严重程度与优先级。'
        },
        'test-pyramid': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/基础理论/测试金字塔与自动化分层策略/', text: '测试金字塔与自动化分层策略' }],
            reviewFocus: '重点关注：金字塔三层职责划分、UI 自动化的成本来源、手工与探索式测试的定位、CI/CD 中的分层运行策略、冰淇淋甜筒反模式',
            passLinks: [
                { url: '/基础理论/测试用例设计测验/', text: '测试用例设计测验' },
                { url: '/持续集成/持续集成测验/', text: '持续集成测验' }
            ],
            passText: '测试分层策略已掌握，建议继续学习：',
            failText: '建议先回看测试金字塔教程，重点补各层职责与分层决策依据。'
        },
        'testcase-design': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/基础理论/测试用例设计方法论教程-软件测试版/', text: '测试用例设计方法论教程' }],
            reviewFocus: '重点关注：等价类的划分与合并、边界值取值规则、判定表适用条件、状态迁移覆盖准则、Pairwise 的原理与适用场景、场景法中的基本流与备选流',
            passLinks: [
                { url: '/章节练习与参考答案/', text: '章节练习与参考答案' },
                { url: '/案例库/登录功能测试案例/', text: '登录功能测试案例' }
            ],
            passText: '用例设计方法已掌握，建议继续学习：',
            failText: '建议先回看测试用例设计方法论教程，重点补等价类与边界值的组合运用。'
        },
        'frontend-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/基础理论/前端基础教程-软件测试版/', text: '前端基础教程' }],
            reviewFocus: '重点关注：CSS 选择器与 id/class 区别、iframe 与 Shadow DOM 对定位的影响、浏览器存储差异、Network 面板判断前后端问题、Elements 改页面不落库',
            passLinks: [
                { url: '/自动化测试/Selenium基础测验/', text: 'Selenium 基础测验' },
                { url: '/自动化测试/Playwright基础测验/', text: 'Playwright 基础测验' }
            ],
            passText: '前端基础已掌握，建议继续学习：',
            failText: '建议先回看前端基础教程，重点补选择器、iframe 与开发者工具面板的使用。'
        },
        'regex-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/工具操作/正则表达式教程-软件测试版/', text: '正则表达式教程' }],
            reviewFocus: '重点关注：元字符转义、量词与贪婪/非贪婪、零宽断言方向、捕获组编号与非捕获组、Python re 的 match/search/fullmatch 区别、raw string',
            passLinks: [
                { url: '/自动化测试/Python接口自动化测验/', text: 'Python 接口自动化测验' },
                { url: '/专项测试/JMeter性能测试教程-软件测试版/', text: 'JMeter 性能测试教程' }
            ],
            passText: '正则表达式已掌握，建议继续学习：',
            failText: '建议先回看正则表达式教程，重点补贪婪匹配与断言方向。'
        },
        'redis-mongodb': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/工具操作/Redis与MongoDB教程-软件测试版/', text: 'Redis 与 MongoDB 教程' }],
            reviewFocus: '重点关注：TTL 返回值含义与库编号、Hash/List/Set 命令区别、验证码与限流的造数与清理、MongoDB 查询操作符、接口与库中数据的一致性校验',
            passLinks: [
                { url: '/工具操作/SQL基础测验/', text: 'SQL 基础测验' },
                { url: '/工具操作/接口抓包联调测验/', text: '接口抓包联调测验' }
            ],
            passText: 'Redis 与 MongoDB 已掌握，建议继续学习：',
            failText: '建议先回看 Redis 与 MongoDB 教程，重点补缓存类场景的验证与数据清理。'
        },
        'packet-debug-workflow': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [
                { url: '/工具操作/接口抓包联调实战教程-软件测试版/', text: '接口抓包联调实战教程' },
                { url: '/工具操作/Fiddler抓包教程-软件测试版/', text: 'Fiddler 抓包教程' }
            ],
            reviewFocus: '重点关注：抓包到调试再到自动化的三阶段顺序、导出请求后的参数化、链式请求的变量传递、断言状态码与业务字段、Postman 到 Python 的映射、Token 与偶发失败处理',
            passLinks: [
                { url: '/自动化测试/Python接口自动化测验/', text: 'Python 接口自动化测验' },
                { url: '/专项测试/接口测试基础测验/', text: '接口测试基础测验' }
            ],
            passText: '接口抓包联调流程已掌握，建议继续学习：',
            failText: '建议先回看接口抓包联调实战教程，重点补链式请求与断言设计。'
        },
        'ai-testing': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/专项测试/AI辅助测试教程-软件测试版/', text: 'AI 辅助测试教程' }],
            reviewFocus: '重点关注：AI 输出必须人工审查、幻觉与隐私风险、提示词要素与 Few-shot/CoT 用法、视觉回归的优势、Red Teaming、Agent 的错误与超时处理、自愈测试的复核要求',
            passLinks: [
                { url: '/自动化测试/Playwright基础测验/', text: 'Playwright 基础测验' },
                { url: '/面试专题/自动化测试面试题/', text: '自动化测试面试题' }
            ],
            passText: 'AI 辅助测试已掌握，建议继续学习：',
            failText: '建议先回看 AI 辅助测试教程，重点补风险边界与提示词写法。'
        },
        'shift-left-right': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [
                { url: '/专项测试/测试左右移教程-软件测试版/', text: '测试左移与右移教程' },
                { url: '/持续集成/Jenkins-CICD教程-软件测试版/', text: 'Jenkins CI/CD 教程' }
            ],
            reviewFocus: '重点关注：左移与右移的边界、AAA 模式、覆盖率的局限、静态分析与契约测试的定位、质量门禁配置、可观测性三支柱、混沌工程与渐进式发布',
            passLinks: [
                { url: '/持续集成/持续集成测验/', text: '持续集成测验' },
                { url: '/项目实战/CICD自动化回归实战/', text: 'CI/CD 自动化回归实战' }
            ],
            passText: '测试左右移已掌握，建议继续学习：',
            failText: '建议先回看测试左右移教程，重点补质量门禁与右移手段。'
        },
        'mobile-testing': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [
                { url: '/专项测试/移动端专项测试教程-软件测试版/', text: '移动端专项测试教程' },
                { url: '/工具操作/Charles抓包教程-软件测试版/', text: 'Charles 抓包教程' }
            ],
            reviewFocus: '重点关注：弱网参数与典型缺陷、兼容性矩阵设计思路、ANR 与 OOM 的区别、后台流量预期、覆盖升级的数据兼容、推送与系统权限的状态组合',
            passLinks: [
                { url: '/自动化测试/Appium基础测验/', text: 'Appium 基础测验' },
                { url: '/工具操作/Charles抓包测验/', text: 'Charles 抓包测验' }
            ],
            passText: '移动端专项测试已掌握，建议继续学习：',
            failText: '建议先回看移动端专项测试教程，重点补弱网、崩溃与权限场景。'
        },
        'appium-basics': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [
                { url: '/自动化测试/Appium-App自动化教程-软件测试版/', text: 'Appium App 自动化教程' },
                { url: '/专项测试/移动端专项测试教程-软件测试版/', text: '移动端专项测试教程' }
            ],
            reviewFocus: '重点关注：appPackage/appActivity 获取方式、定位方式优先级、UiAutomator 与 XPath 差异、WebView 上下文切换、显式等待、Appium 2.x 的 mobile 命令、Page Object 结构',
            passLinks: [
                { url: '/项目实战/Web自动化项目实战/', text: 'Web 自动化项目实战' },
                { url: '/专项测试/移动端专项测试测验/', text: '移动端专项测试测验' }
            ],
            passText: 'Appium 基础已掌握，建议继续学习：',
            failText: '建议先回看 Appium 教程，重点补定位策略、等待机制与上下文切换。'
        },
        'exploratory-testing': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [{ url: '/基础理论/探索式测试教程-软件测试版/', text: '探索式测试教程' }],
            reviewFocus: '重点关注：Charter 的写法与边界、时间盒的作用、Session 记录要素、CRUD/数据/状态/权限/时间五类启发法、疑问与新增用例的回流',
            passLinks: [
                { url: '/基础理论/测试用例设计测验/', text: '测试用例设计测验' },
                { url: '/章节练习与参考答案/', text: '章节练习与参考答案' }
            ],
            passText: '探索式测试已掌握，建议继续学习：',
            failText: '建议先回看探索式测试教程，重点补 Charter 与启发法的实际运用。'
        },
        'agile-testing': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [
                { url: '/基础理论/敏捷测试教程-软件测试版/', text: '敏捷测试教程' },
                { url: '/基础理论/测试金字塔与自动化分层策略/', text: '测试金字塔与分层策略' }
            ],
            reviewFocus: '重点关注：Scrum 角色与事件、测试人员在迭代中的职责、用户故事与 Given-When-Then、三 Amigos、冒烟与回归的定位、质量门禁与 DoD',
            passLinks: [
                { url: '/持续集成/持续集成测验/', text: '持续集成测验' },
                { url: '/基础理论/测试金字塔测验/', text: '测试金字塔测验' }
            ],
            passText: '敏捷测试已掌握，建议继续学习：',
            failText: '建议先回看敏捷测试教程，重点补验收标准写法与迭代内测试策略。'
        },
        'ecommerce-project': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [
                { url: '/项目实战/电商系统测试实战/', text: '电商系统测试实战' },
                { url: '/基础理论/测试用例设计方法论教程-软件测试版/', text: '测试用例设计方法论' }
            ],
            reviewFocus: '重点关注：需求到测试点的拆解、用例七要素、库存与订单状态场景、接口断言重点、操作前后各查一次数据库、越权与幂等风险',
            passLinks: [
                { url: '/项目实战/接口自动化项目实战/', text: '接口自动化项目实战' },
                { url: '/项目实战/性能测试项目实战/', text: '性能测试项目实战' }
            ],
            passText: '电商系统测试实战已完成，建议继续学习：',
            failText: '建议先回看电商系统测试实战，重点补测试点拆解与数据库校验。'
        },
        'api-auto-project': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [
                { url: '/项目实战/接口自动化项目实战/', text: '接口自动化项目实战' },
                { url: '/自动化测试/Python+Requests+Allure接口自动化教程-软件测试版/', text: 'Python 接口自动化教程' }
            ],
            reviewFocus: '重点关注：请求封装与 Session 复用、目录职责划分、数据驱动适用场景、协议/业务/数据/安全四层断言、动态获取 Token、敏感信息走环境变量、Allure 两步命令',
            passLinks: [
                { url: '/项目实战/CICD自动化回归实战/', text: 'CI/CD 自动化回归实战' },
                { url: '/持续集成/持续集成测验/', text: '持续集成测验' }
            ],
            passText: '接口自动化项目实战已完成，建议继续学习：',
            failText: '建议先回看接口自动化项目实战，重点补请求封装与断言分层。'
        },
        'web-auto-project': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [
                { url: '/项目实战/Web自动化项目实战/', text: 'Web 自动化项目实战' },
                { url: '/自动化测试/Playwright自动化测试教程-软件测试版/', text: 'Playwright 自动化测试教程' }
            ],
            reviewFocus: '重点关注：手工先行再写脚本、自动化范围取舍、data-testid 定位优先级、页面对象职责划分、显式等待替代固定 sleep、失败产物清单、报告要看维度而非通过率',
            passLinks: [
                { url: '/项目实战/CICD自动化回归实战/', text: 'CI/CD 自动化回归实战' },
                { url: '/自动化测试/Playwright基础测验/', text: 'Playwright 基础测验' }
            ],
            passText: 'Web 自动化项目实战已完成，建议继续学习：',
            failText: '建议先回看 Web 自动化项目实战，重点补定位策略与等待机制。'
        },
        'perf-project': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [
                { url: '/项目实战/性能测试项目实战/', text: '性能测试项目实战' },
                { url: '/专项测试/JMeter性能测试教程-软件测试版/', text: 'JMeter 性能测试教程' }
            ],
            reviewFocus: '重点关注：基准/阶梯/混合三类场景的分工、P95 与 TPS 的读法、压测数据准备与隔离、命令行执行与监听器开销、瓶颈定位对照表、把数字翻译成结论',
            passLinks: [
                { url: '/专项测试/JMeter性能测试测验/', text: 'JMeter 性能测试测验' },
                { url: '/项目实战/CICD自动化回归实战/', text: 'CI/CD 自动化回归实战' }
            ],
            passText: '性能测试项目实战已完成，建议继续学习：',
            failText: '建议先回看性能测试项目实战，重点补结果分析与瓶颈定位。'
        },
        'cicd-project': {
            reviewText: '建议回看以下内容：',
            reviewLinks: [
                { url: '/项目实战/CICD自动化回归实战/', text: 'CI/CD 自动化回归实战' },
                { url: '/持续集成/GitHub-Actions教程-软件测试版/', text: 'GitHub Actions 教程' }
            ],
            reviewFocus: '重点关注：从最小流水线起步、测试分层与触发策略、CI Secret 管理、报告归档清单、失败分类与排查顺序、质量门禁的渐进设置',
            passLinks: [
                { url: '/学习中心/第5阶段-项目面试通关/', text: '第 5 阶段项目与面试通关检查' },
                { url: '/项目实战/', text: '项目实战总览' }
            ],
            passText: 'CI/CD 自动化回归实战已完成，建议继续学习：',
            failText: '建议先回看 CI/CD 自动化回归实战，重点补失败诊断与质量门禁。'
        },
    };

    // HTML 转义：题目文本来自页面 DOM（textContent 已解码实体），
    // 拼进 innerHTML 前必须转义，否则含 < > & 的题目会破坏反馈区渲染
    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function(c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    // 初始化测验
    window.initQuizzes = function() {
        document.querySelectorAll('.quiz-container').forEach(function(quiz, quizIndex) {
            if (quiz.dataset.initialized) return;
            quiz.dataset.initialized = 'true';

            // 回退 ID 必须稳定（页面路径 + 序号），随机 ID 会导致刷新后无法恢复答案
            var getPath = window.__getPath || function() { return window.location.pathname; };
            var quizId = quiz.dataset.quizId || ('quiz-' + getPath() + '-' + quizIndex);
            quiz.dataset.quizId = quizId;

            var submitBtn = quiz.querySelector('.quiz-submit');
            if (submitBtn) {
                submitBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    checkQuizAnswers(quiz);
                });
            }

            var saved = localStorage.getItem('quiz-' + quizId);
            if (saved) {
                try {
                    var answers = JSON.parse(saved);
                    var items = quiz.querySelectorAll('.quiz-item');
                    answers.forEach(function(answer, index) {
                        if (index < items.length && answer >= 0) {
                            var options = items[index].querySelectorAll('input[type="radio"]');
                            if (options[answer]) options[answer].checked = true;
                        }
                    });
                } catch(e) {
                    console.warn('Failed to restore quiz answers:', e);
                }
            }
        });
    };

    function checkQuizAnswers(quiz) {
        var resolveUrl = window.__resolveUrl || function(u) { return u; };
        var items = quiz.querySelectorAll('.quiz-item');
        var correct = 0;
        var total = items.length;
        var wrongQuestions = [];

        items.forEach(function(item, index) {
            var options = item.querySelectorAll('.quiz-option');
            var correctIndex = parseInt(item.dataset.correct);
            var selected = item.querySelector('input[type="radio"]:checked');
            var explanation = item.querySelector('.quiz-explanation');
            var questionText = item.querySelector('.quiz-question').textContent;

            options.forEach(function(opt, i) {
                opt.classList.remove('correct', 'incorrect');
                if (i === correctIndex) opt.classList.add('correct');
            });

            if (selected) {
                var selectedIndex = Array.from(options).indexOf(selected.parentElement);
                if (selectedIndex !== correctIndex) {
                    selected.parentElement.classList.add('incorrect');
                    wrongQuestions.push({
                        index: index + 1,
                        question: questionText,
                        answered: true
                    });
                } else {
                    correct++;
                }
            } else {
                // 未作答的题也计入错题，但单独标记，便于反馈区区分
                wrongQuestions.push({
                    index: index + 1,
                    question: questionText,
                    answered: false
                });
            }
            if (explanation) explanation.classList.add('show');
        });

        var quizId = quiz.dataset.quizId;
        var answers = [];
        items.forEach(function(q) {
            var s = q.querySelector('input[type="radio"]:checked');
            answers.push(s ? Array.from(q.querySelectorAll('input[type="radio"]')).indexOf(s) : -1);
        });
        localStorage.setItem('quiz-' + quizId, JSON.stringify(answers));

        // 保存测验结果到学习进度系统
        if (typeof window.saveQuizResult === 'function') {
            window.saveQuizResult(quizId, correct, total);
        }

        var scoreDiv = quiz.querySelector('.quiz-score');
        if (!scoreDiv) {
            scoreDiv = document.createElement('div');
            scoreDiv.className = 'quiz-score';
            quiz.appendChild(scoreDiv);
        }

        var percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
        var emoji = percentage >= PASS_THRESHOLD ? '🎉' : percentage >= OK_THRESHOLD ? '👍' : '💪';

        // 构建反馈内容
        var feedbackHtml = '<div class="quiz-feedback">';
        feedbackHtml += '<div class="quiz-score-main">' + emoji + ' 得分：<strong>' + correct + '/' + total + '</strong> (' + percentage + '%)</div>';
        feedbackHtml += '<div class="quiz-pass-line">通过线：正确率 ' + PASS_THRESHOLD + '%（即答对 ' +
            Math.ceil(total * PASS_THRESHOLD / 100) + '/' + total + ' 题）</div>';

        // 根据分数给出建议
        feedbackHtml += '<div class="quiz-advice">';
        if (percentage >= PASS_THRESHOLD) {
            feedbackHtml += '<p class="advice-good">✅ 恭喜！你已经掌握了这部分知识，可以继续学习下一阶段。</p>';
        } else if (percentage >= OK_THRESHOLD) {
            feedbackHtml += '<p class="advice-ok">👍 基础掌握不错，但还有提升空间。建议复习错题相关知识点。</p>';
        } else {
            feedbackHtml += '<p class="advice-need-work">💪 建议回看基础教程，巩固薄弱知识点后再继续。</p>';
        }
        feedbackHtml += '</div>';

        // 显示错题分析
        var quizConfig = QUIZ_REVIEW_MAP[quizId];
        if (wrongQuestions.length > 0) {
            feedbackHtml += '<div class="quiz-wrong-analysis">';
            feedbackHtml += '<h4>📝 错题分析</h4>';
            feedbackHtml += '<p>共有 ' + wrongQuestions.length + ' 道题未通过（未作答的题已单独标注）：</p>';
            feedbackHtml += '<ul>';
            wrongQuestions.forEach(function(q) {
                feedbackHtml += '<li><strong>第 ' + q.index + ' 题：</strong>' + escapeHtml(q.question) +
                    (q.answered ? '' : '（未作答）') + '</li>';
            });
            feedbackHtml += '</ul>';

            // 根据测验类型给出复习建议
            if (quizConfig) {
                feedbackHtml += '<div class="quiz-review-suggestion">';
                feedbackHtml += '<h4>📚 复习建议</h4>';
                feedbackHtml += '<p>' + quizConfig.reviewText + '</p>';
                feedbackHtml += '<ul>';
                quizConfig.reviewLinks.forEach(function(link) {
                    feedbackHtml += '<li><a href="' + resolveUrl(link.url) + '">' + link.text + '</a></li>';
                });
                feedbackHtml += '<li>' + quizConfig.reviewFocus + '</li>';
                feedbackHtml += '</ul>';
                feedbackHtml += '</div>';
            }
            feedbackHtml += '</div>';
        }

        // 下一步建议
        feedbackHtml += '<div class="quiz-next-step">';
        feedbackHtml += '<h4>🎯 下一步建议</h4>';
        if (quizConfig) {
            if (percentage >= PASS_THRESHOLD) {
                feedbackHtml += '<p>' + quizConfig.passText + '</p>';
                feedbackHtml += '<ul>';
                quizConfig.passLinks.forEach(function(link) {
                    feedbackHtml += '<li><a href="' + resolveUrl(link.url) + '">' + link.text + '</a></li>';
                });
                feedbackHtml += '</ul>';
            } else {
                feedbackHtml += '<p>' + quizConfig.failText + '</p>';
            }
        } else {
            // 通用 fallback
            if (percentage >= PASS_THRESHOLD) {
                feedbackHtml += '<p>测验通过！可以继续学习下一阶段内容。</p>';
            } else {
                feedbackHtml += '<p>建议巩固当前知识点后再继续学习。</p>';
            }
        }
        feedbackHtml += '</div>';

        feedbackHtml += '</div>';

        scoreDiv.innerHTML = feedbackHtml;
        scoreDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
})();
