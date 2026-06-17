# Postman 接口测试教程（软件测试人员专用）

> 本教程面向软件测试工程师，系统讲解 Postman 在接口测试中的应用，覆盖从基础请求到自动化测试、数据驱动、CI/CD 集成的完整链路。

---

## 前置要求

| 项目 | 要求 | 获取方式 |
|------|------|----------|
| HTTP 协议基础 | 了解 GET/POST 请求方法、状态码、JSON 响应格式 | [网络知识教程-软件测试版](../工具操作/网络知识教程-软件测试版.md) |

---

## 新手导读

Postman 是接口测试入门最重要的工具之一。新手第一遍不要急着写复杂脚本，先能手工调通接口。

建议学习顺序：

1. 会发送 GET 和 POST 请求。
2. 会填写 Header、Params、Body。
3. 会查看状态码和响应 JSON。
4. 会用环境变量保存 Base URL 和 Token。
5. 会写最基础的断言，例如判断业务 code 是否为 0。

当你能把登录接口、查询接口、创建订单接口串起来，再学习 Collection、数据驱动和 Newman。

### 版本与维护说明

| 项目 | 说明 |
|------|------|
| 适用工具 | Postman 桌面版 / Web 版、Newman 命令行 |
| 使用建议 | 菜单名称可能随版本变化，核心学习目标是请求、环境变量、断言和集合运行 |
| 更新提醒 | 使用前建议核对 Postman 官方文档，尤其是团队协作、云同步和 Newman 参数 |
| 术语提醒 | 新版界面可能把 `Tests` 归在 `Scripts / Post-response` 下；本文仍用“Tests”指请求返回后执行的断言脚本 |

---

## 最佳实践速查：推荐写法 vs 新手写法

| 场景 | 新手常见写法 | 推荐写法 | 原因 |
|------|--------------|----------|------|
| 环境地址 | 每个请求都写完整 URL | 使用 `{{base_url}}` 环境变量 | 切换环境方便，减少重复修改 |
| 登录 token | 手工复制 token 到 Header | 登录接口 Tests 自动保存 token | 避免 token 过期后整套接口失败 |
| 断言 | 只看 Status 200 | 同时断言 HTTP 状态码、业务码、关键字段 | 很多业务失败也会返回 200 |
| 密码和 token | 写在请求或脚本里并截图分享 | 使用 secret 变量，日志脱敏 | 避免敏感信息泄露 |
| Collection | 所有接口放在一个平铺列表 | 按模块建文件夹，命名清楚 | 便于维护和团队协作 |
| 数据驱动 | 手工改参数重复发送 | Runner / Newman + CSV / JSON | 提高覆盖率和可重复性 |
| 调试输出 | `console.log` 打完整响应和 token | 只打印必要字段并脱敏 | 日志更清晰，也更安全 |

示例：推荐的登录后保存 token 写法：

```javascript
const body = pm.response.json();

pm.test("登录成功并返回 token", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 201]);
    pm.expect(body.code).to.eql(0);
    pm.expect(body.data.token).to.be.a("string").that.is.not.empty;
});

if (body.code === 0 && body.data.token) {
    pm.environment.set("token", body.data.token);
    console.log("token 已保存：" + body.data.token.slice(0, 8) + "...");
}
```

新手记住一句话：Postman 不是“点 Send 的工具”，而是“组织接口、管理环境、自动断言、沉淀回归资产”的工具。

## 一、Postman 简介

### 1.1 什么是 Postman

Postman 是一款功能强大的 **API 开发与测试平台**，最初是 Chrome 浏览器扩展，现已发展为支持 Windows/Mac/Linux 的桌面应用和 Web 版应用。

### 1.2 Postman 能做什么

| 功能 | 说明 |
|------|------|
| 接口调试 | 发送 HTTP/HTTPS 请求，查看响应 |
| 接口测试 | 编写断言脚本，自动化验证接口 |
| 接口文档 | 自动生成接口文档并分享 |
| Mock 服务 | 模拟接口返回，前后端并行开发 |
| 接口监控 | 定时执行接口，监控可用性 |
| 团队协作 | Workspace 共享接口集合 |
| CI/CD 集成 | 通过 Newman 集成到流水线 |
| 性能测试 | 内置基础的性能测试能力 |

### 1.3 Postman vs Fiddler

| 维度 | Postman | Fiddler |
|------|---------|---------|
| 定位 | 主动构造请求 | 被动抓取请求 |
| 适用场景 | 接口测试、自动化 | 抓包分析、Mock |
| 协议层级 | HTTP/HTTPS 应用层 | HTTP/HTTPS 应用层 |
| 脚本能力 | 强（JavaScript） | 中（FiddlerScript） |
| 团队协作 | 强（云同步） | 弱（本地） |

!!! tip "测试人员建议"
    两者搭配使用。Fiddler 用于抓取已有请求 → 导出/复制 → 在 Postman 中重构、参数化、写断言。

---

## 二、安装与账号配置

### 2.1 下载安装

1. 访问官网：`https://www.postman.com/downloads/`
2. 选择对应操作系统的版本下载
3. 双击安装包，全程默认即可

!!! info "版本说明"
    Postman 也提供 Web 版（`https://web.postman.co`），但功能受限，桌面版功能更全。

### 2.2 注册登录

- 首次启动建议注册账号，可享受：
  - 云端同步 Collection、Environment
  - 多设备数据互通
  - 团队协作功能
- 也可点击底部 `Skip and go to the app` 离线使用（数据仅保存在本地）

### 2.3 基础设置

点击右上角齿轮图标 → `Settings`：

**General 标签：**

- `Request timeout in ms`：请求超时时间（默认 0 即无限制，建议设为 30000）
- `SSL certificate verification`：SSL 证书校验（测试自签名证书时建议关闭）
- `Send anonymous usage data to Postman`：匿名数据上报（按需关闭）
- `Working directory`：工作目录（用于上传文件，建议设置固定路径）
- `Allow reading files outside working directory`：允许读取工作目录外文件

**Themes：** 可切换深色/浅色主题

**Proxy：** 配置代理，如需经过 Fiddler 抓包：
- 勾选 `Use custom proxy configuration`
- Proxy server: `127.0.0.1:8888`

---

## 三、界面布局详解

```
┌─────────────────────────────────────────────────────────────┐
│ 顶部菜单栏 / Workspace 切换                                    │
├──────────────┬──────────────────────────────────────────────┤
│              │ ┌──────────────────────────────────────────┐ │
│ 左侧侧边栏     │ │  Tab 区：请求标签页                       │ │
│ Collections  │ ├──────────────────────────────────────────┤ │
│ Environments │ │  请求 URL 栏 + Method + Send 按钮          │ │
│ History      │ ├──────────────────────────────────────────┤ │
│ APIs         │ │  请求参数区                                │ │
│ Mock Servers │ │  Params / Headers / Body / Auth /         │ │
│              │ │  Pre-request Script / Tests              │ │
│              │ ├──────────────────────────────────────────┤ │
│              │ │  响应展示区                                │ │
│              │ │  Body / Cookies / Headers / Test Results │ │
│              │ └──────────────────────────────────────────┘ │
└──────────────┴──────────────────────────────────────────────┘
```

### 3.1 左侧侧边栏

| 模块 | 用途 |
|------|------|
| `Collections` | 接口集合（最核心，所有接口按项目组织在此） |
| `Environments` | 环境变量管理（开发/测试/生产） |
| `Mock Servers` | 模拟服务器 |
| `Monitors` | 接口监控任务 |
| `History` | 请求历史记录 |
| `APIs` | API 设计（OpenAPI/Swagger） |
| `Flows` | 可视化接口编排（新功能） |

### 3.2 中间核心区

- **请求方法下拉框**：GET / POST / PUT / PATCH / DELETE / HEAD / OPTIONS 等
- **URL 输入框**：支持变量 `{{base_url}}/api/login`
- **Send 按钮**：发送请求（也可下拉选择 `Send and Download` 下载响应）

### 3.3 响应区关键信息

- **Status**：HTTP 状态码
- **Time**：响应耗时
- **Size**：响应大小
- **Cookies**：响应 Cookie
- **Headers**：响应头数量

---

## 四、发送第一个请求

以一个开放 API 为例，演示基础流程。

### 4.1 准备工作

测试目标接口（公开测试 API）：

```
GET https://jsonplaceholder.typicode.com/users/1
```

### 4.2 操作步骤

1. 点击左上角 `+` 新建一个 Tab
2. 方法选择 `GET`
3. URL 输入：`https://jsonplaceholder.typicode.com/users/1`
4. 点击 `Send`

### 4.3 查看响应

响应区会显示：

- **Status：** `200 OK`
- **Time：** 如 `120 ms`
- **Body：** JSON 格式的用户数据

```json
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz"
}
```

切换 Body 显示模式：
- `Pretty`：格式化展示（推荐）
- `Raw`：原始字符串
- `Preview`：预览（HTML 渲染）
- `Visualize`：可视化图表（需脚本支持）

### 4.4 保存请求

请求只有保存到 Collection 才能持久化：

1. 点击右上角 `Save` 按钮
2. 输入请求名称：`查询用户详情`
3. 选择或新建 Collection（如 `用户中心接口`）
4. 点击 `Save`

---

## 五、请求详解

### 5.1 Params（查询参数）

URL 中 `?` 后面的部分，如 `?page=1&size=10`。

**两种填写方式：**

- 方式 A：直接在 URL 中拼接
- 方式 B：在 `Params` 标签下以 Key-Value 形式填写（推荐，可勾选启用/禁用）

| Key | Value | Description |
|-----|-------|-------------|
| page | 1 | 页码 |
| size | 10 | 每页数量 |
| keyword | postman | 搜索词 |

### 5.2 Headers（请求头）

常见 Header：

| Header | 含义 | 示例 |
|--------|------|------|
| `Content-Type` | 请求体类型 | `application/json` |
| `Authorization` | 鉴权信息 | `Bearer eyJhbGc...` |
| `User-Agent` | 客户端标识 | `PostmanRuntime/7.x` |
| `Accept` | 接受的响应类型 | `application/json` |
| `Cookie` | 会话 Cookie | `sessionId=abc123` |

!!! tip "提示"
    Postman 会自动添加一些 Header（如 `Postman-Token`、`Host`），可点击 `hidden` 查看。

### 5.3 Body（请求体）

POST/PUT 等请求需要携带 Body，Postman 支持 6 种类型：

#### 5.3.1 none
无请求体

#### 5.3.2 form-data
表单格式，支持文件上传，常用于文件接口：

| Key | Value | Type |
|-----|-------|------|
| username | testuser | Text |
| avatar | (选择文件) | File |

请求 Content-Type 自动为 `multipart/form-data`

#### 5.3.3 x-www-form-urlencoded
URL 编码格式，传统表单提交：

```
username=testuser&password=123456
```

Content-Type 自动为 `application/x-www-form-urlencoded`

#### 5.3.4 raw
原始数据，可选子类型：JSON / XML / HTML / Text / JavaScript

**最常用：raw + JSON**

```json
{
  "username": "testuser",
  "password": "123456",
  "remember": true
}
```

#### 5.3.5 binary
二进制文件，用于上传单个文件

#### 5.3.6 GraphQL
GraphQL 查询专用格式

### 5.4 Authorization（鉴权）

Postman 内置多种鉴权方式，选中后自动添加对应 Header：

| 类型 | 说明 |
|------|------|
| `No Auth` | 无鉴权 |
| `Basic Auth` | 用户名+密码 Base64 |
| `Bearer Token` | Token 鉴权（最常见） |
| `OAuth 1.0` | OAuth 1.0 协议 |
| `OAuth 2.0` | OAuth 2.0 协议 |
| `API Key` | API Key 鉴权 |
| `Digest Auth` | 摘要鉴权 |
| `AWS Signature` | AWS 签名 |

**Bearer Token 示例：**

- Type 选择 `Bearer Token`
- Token 输入：`eyJhbGciOiJIUzI1NiIs...`
- 请求会自动添加 Header：`Authorization: Bearer eyJhbGciOiJIUzI1NiIs...`

### 5.5 Cookies 管理

点击 URL 栏右侧 `Cookies` 链接，进入 Cookie 管理器：

- 按域名查看/编辑/删除 Cookie
- 手动添加 Cookie 进行测试
- 测试 Session 时常用

---

## 六、环境与变量管理

### 6.1 为什么需要变量

接口测试中，同一组接口需要在 **不同环境（开发/测试/预发布/生产）** 执行，URL、Token、用户账号都不一样。变量可避免重复修改。

### 6.2 变量作用域（由低到高）

```
Global（全局） < Collection（集合） < Environment（环境） < Data（数据） < Local（本地）
```

层级越高优先级越高，同名变量高层级覆盖低层级。

!!! info "Data vs Local 说明"
    - **Data（数据变量）**：从外部 CSV/JSON 文件加载，在 Collection Runner 数据驱动迭代期间有效
    - **Local（本地变量）**：通过 `pm.variables.set("key", "val")` 在脚本中设置，仅当前请求生效
    - 优先级 Local > Data，但 Data 在整个迭代周期内持久，Local 仅单次请求。两者都高于 Environment。

### 6.3 创建环境变量

**Step 1：新建环境**

1. 左侧 `Environments` → `+` → 命名为 `测试环境`
2. 添加变量：

| Variable | Type | Initial Value | Current Value |
|----------|------|---------------|---------------|
| base_url | default | https://api-test.example.com | https://api-test.example.com |
| username | default | testuser | testuser |
| password | secret | 123456 | 123456 |
| token | default | (空) | (空) |

!!! tip "Type 选择 secret"
    可隐藏敏感字段（密码、Token），团队共享时不暴露明文。

!!! info "Initial Value 与 Current Value 区别"
    Initial 是分享时的默认值；Current 是本地实际生效值。

3. 点击 `Save` 保存

**Step 2：激活环境**

右上角环境下拉框选择 `测试环境`。

**Step 3：使用变量**

在 URL、Headers、Body 中使用 `{{变量名}}` 语法：

```
URL:  {{base_url}}/api/login
Body: {"username":"{{username}}","password":"{{password}}"}
```

变量值会在发送请求时自动替换。

### 6.4 全局变量

`Environments` → `Globals` → 添加变量，所有环境都能访问。

适合放：
- 工具类变量（如 UUID 生成函数对应的值）
- 不区分环境的固定值

### 6.5 变量赋值的几种方式

**方式 1：界面手动设置**（如上述）

**方式 2：在脚本中动态设置**

```javascript
// 设置环境变量
pm.environment.set("token", "eyJhbGci...");

// 设置全局变量
pm.globals.set("requestId", "12345");

// 设置 Collection 变量
pm.collectionVariables.set("nodeId", "abc");

// 设置局部变量（仅当前请求生效）
pm.variables.set("temp", "value");
```

**方式 3：从响应中提取**

```javascript
// 解析 JSON 响应
const responseJson = pm.response.json();
// 提取 token 并保存
pm.environment.set("token", responseJson.data.token);
```

---

## 七、Collection 集合管理

### 7.1 Collection 是什么

Collection 是接口的逻辑分组容器，类似文件夹。一个项目通常对应一个 Collection。

### 7.2 创建 Collection

1. 左侧 `Collections` → `+ Create Collection`
2. 命名：如 `电商系统-接口测试`
3. 可选配置：
   - **Authorization**：集合级鉴权，所有子请求继承
   - **Pre-request Scripts**：集合级前置脚本（每个请求执行前都运行）
   - **Tests**：集合级测试脚本
   - **Variables**：集合级变量

### 7.3 文件夹组织

在 Collection 下创建子文件夹按模块分类：

```
电商系统-接口测试/
├── 01_用户模块/
│   ├── 注册
│   ├── 登录
│   └── 查询用户信息
├── 02_商品模块/
│   ├── 商品列表
│   └── 商品详情
├── 03_订单模块/
│   ├── 创建订单
│   ├── 支付订单
│   └── 取消订单
```

### 7.4 Collection Runner（集合运行器）

批量执行整个 Collection 或文件夹的所有请求：

1. 点击 Collection 右侧 `...` → `Run collection`
2. 配置运行参数：
   - **Iterations**：迭代次数
   - **Delay**：请求间隔（ms）
   - **Data**：数据文件（CSV/JSON，数据驱动用）
   - **Environment**：运行环境
   - **Keep variable values**：保留变量修改
3. 点击 `Run`

### 7.5 接口顺序与依赖

测试场景中接口往往有依赖（如先登录拿 Token 才能调其他接口）。Collection Runner 按文件夹中接口顺序执行，可通过：

- 上下拖动调整顺序
- 在 Tests 脚本中使用 `postman.setNextRequest("请求名")` 动态跳转

---

## 八、Tests 断言脚本

!!! abstract "核心概念"
    Tests 是接口自动化测试的核心。每个请求执行后，Tests 中的脚本会自动运行，验证响应是否符合预期。

### 8.1 编写位置

请求 Tab → `Tests` 标签下，使用 JavaScript 编写。

### 8.2 常用断言模板

Postman 右侧提供 `Snippets` 代码片段，点击即可插入。

#### 8.2.1 状态码断言

```javascript
pm.test("状态码为 200", function () {
    pm.response.to.have.status(200);
});
```

#### 8.2.2 响应时间断言

```javascript
pm.test("响应时间小于 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});
```

#### 8.2.3 响应体包含特定字符串

```javascript
pm.test("响应体包含 success", function () {
    pm.expect(pm.response.text()).to.include("success");
});
```

#### 8.2.4 JSON 字段断言

```javascript
pm.test("返回 code 为 0", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.code).to.eql(0);
});

pm.test("data.userId 是数字类型", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.userId).to.be.a("number");
});

pm.test("data.list 数组长度为 10", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.list).to.have.lengthOf(10);
});
```

#### 8.2.5 响应头断言

```javascript
pm.test("Content-Type 为 JSON", function () {
    pm.response.to.have.header("Content-Type", "application/json; charset=utf-8");
});
```

#### 8.2.6 JSON Schema 校验

```javascript
const schema = {
    "type": "object",
    "required": ["code", "msg", "data"],
    "properties": {
        "code": {"type": "number"},
        "msg": {"type": "string"},
        "data": {
            "type": "object",
            "required": ["userId", "username"],
            "properties": {
                "userId": {"type": "number"},
                "username": {"type": "string"}
            }
        }
    }
};

pm.test("响应结构符合 Schema", function () {
    pm.response.to.have.jsonSchema(schema);
});
```

### 8.3 提取数据传递给下一个请求

```javascript
// 提取登录返回的 token，保存到环境变量
const jsonData = pm.response.json();
if (jsonData.code === 0) {
    pm.environment.set("token", jsonData.data.token);
    pm.environment.set("userId", jsonData.data.userId);
    console.log("Token 已保存：" + jsonData.data.token.slice(0, 8) + "...");
}
```

真实项目不要在 Console 或 CI 日志中打印完整 Token、密码、Cookie、私钥。需要排查时只打印前后几位，或打印“已获取/未获取”的状态。

后续接口使用：

```
Headers: Authorization = Bearer {{token}}
```

### 8.4 控制流程

```javascript
// 跳转到指定请求（按名称）
postman.setNextRequest("创建订单");

// 停止后续请求执行
postman.setNextRequest(null);

// 循环：根据条件回到自己
if (pm.environment.get("retry") < 3) {
    pm.environment.set("retry", pm.environment.get("retry") + 1);
    postman.setNextRequest(pm.info.requestName);
}
```

### 8.5 输出调试信息

```javascript
const token = pm.environment.get("token");
console.log("当前 token：", token ? token.slice(0, 8) + "..." : "未获取");
console.log("响应体：", pm.response.json());
```

通过 `View` → `Show Postman Console`（快捷键 `Ctrl + Alt + C`）查看输出。

---

## 九、Pre-request Scripts 前置脚本

### 9.1 执行时机

每个请求 **发送前** 自动运行，常用于：

- 生成动态参数（时间戳、签名、UUID）
- 数据准备（先调用其他接口获取数据）
- 修改请求参数

### 9.2 常用示例

#### 9.2.1 生成时间戳

```javascript
const timestamp = new Date().getTime();
pm.environment.set("timestamp", timestamp);
```

请求 Body 中使用：`{"time": "{{timestamp}}"}`

#### 9.2.2 生成 UUID

```javascript
const uuid = require('uuid').v4();
pm.environment.set("requestId", uuid);
```

#### 9.2.3 计算 MD5 签名

```javascript
const CryptoJS = require("crypto-js");
const params = "timestamp=" + new Date().getTime() + "&key=mySecretKey";
const sign = CryptoJS.MD5(params).toString();
pm.environment.set("sign", sign);
```

#### 9.2.4 调用其他接口获取 Token

```javascript
pm.sendRequest({
    url: pm.environment.get("base_url") + "/api/login",
    method: 'POST',
    header: { 'Content-Type': 'application/json' },
    body: {
        mode: 'raw',
        raw: JSON.stringify({
            username: pm.environment.get("username"),
            password: pm.environment.get("password")
        })
    }
}, function (err, res) {
    if (!err && res.code === 200) {
        const token = res.json().data.token;
        pm.environment.set("token", token);
    }
});
```

---

## 十、数据驱动测试

### 10.1 应用场景

同一个接口需用 **多组不同的测试数据** 执行，验证不同场景（如登录的正常账号、错误密码、空账号、SQL 注入等）。

### 10.2 准备数据文件

**方式 1：CSV 文件（推荐）**

`login_test_data.csv`:

```csv
case_name,username,password,expected_code,expected_msg
正常登录,testuser,123456,0,成功
密码错误,testuser,wrong,1001,密码错误
账号不存在,nouser,123456,1002,账号不存在
账号为空,,123456,1003,账号不能为空
SQL注入测试,admin' OR '1'='1,123456,1001,密码错误
```

**方式 2：JSON 文件**

```json
[
  {
    "case_name": "正常登录",
    "username": "testuser",
    "password": "123456",
    "expected_code": 0
  },
  {
    "case_name": "密码错误",
    "username": "testuser",
    "password": "wrong",
    "expected_code": 1001
  }
]
```

### 10.3 在请求中引用

Body 中：

```json
{
  "username": "{{username}}",
  "password": "{{password}}"
}
```

Tests 中：

```javascript
pm.test(`[${pm.iterationData.get("case_name")}] code 符合预期`, function () {
    const jsonData = pm.response.json();
    const expectedCode = parseInt(pm.iterationData.get("expected_code"));
    pm.expect(jsonData.code).to.eql(expectedCode);
});
```

### 10.4 执行数据驱动测试

1. Collection Runner 中：
2. `Data` 区域选择 CSV/JSON 文件
3. `Iterations` 自动填充为数据行数
4. 点击 `Preview` 预览数据加载情况
5. `Run`

每一行数据会执行一次完整流程，所有结果汇总展示。

---

## 十一、Mock Server 模拟服务

### 11.1 应用场景

- 后端接口未开发完成，前端/测试需要先行进行
- 复现某些难以触发的响应（如服务器超时、5xx 错误）
- 减少对真实环境的依赖

### 11.2 创建 Mock Server

**Step 1：准备示例响应**

在 Collection 中创建请求 → 点击 `Save Response` → `Save as example`

为每个请求添加多个 Example：
- 状态码 200 的成功响应
- 状态码 400 的参数错误响应
- 状态码 500 的服务器错误响应

**Step 2：创建 Mock**

1. 左侧 `Mock Servers` → `+`
2. 选择对应的 Collection 和 Environment
3. 命名 Mock 服务
4. 创建后会生成 Mock URL，例如：
   ```
   https://abc123.mock.pstmn.io
   ```

**Step 3：调用 Mock 接口**

将原本调用 `https://api.example.com/users/1` 改为：

```
https://abc123.mock.pstmn.io/users/1
```

Mock 服务会按 Example 配置返回响应。

### 11.3 智能匹配

Postman Mock 会根据请求的 Method、URL、Query 参数、Header 智能匹配最合适的 Example。可在 Example 上设置 `x-mock-response-name` Header 强制指定返回某个 Example。

---

## 十二、Newman 命令行执行

### 12.1 Newman 是什么

Newman 是 Postman 官方提供的命令行工具，用于在 **终端 / CI/CD 流水线** 中执行 Postman Collection。

### 12.2 安装 Newman

需先安装 Node.js（Newman 当前版本要求 Node.js 16+；CI 中建议使用 Node 20 LTS 或更新的 LTS 版本），然后：

```bash
npm install -g newman

# 验证安装
newman --version
```

如需 HTML 报告，额外安装：

```bash
npm install -g newman-reporter-htmlextra
```

### 12.3 导出 Collection

Postman 中：右键 Collection → `Export` → 选择 `Collection v2.1` → 保存为 `collection.json`

同样导出环境：`Environments` → 右键 → `Export` → `environment.json`

### 12.4 执行命令

**基础执行：**

```bash
newman run collection.json
```

**指定环境：**

```bash
newman run collection.json -e environment.json
```

**指定数据文件（数据驱动）：**

```bash
newman run collection.json -e environment.json -d test_data.csv
```

**生成 HTML 报告：**

```bash
newman run collection.json \
  -e environment.json \
  -r htmlextra \
  --reporter-htmlextra-export report.html
```

**完整示例：**

```bash
newman run collection.json \
  -e environment.json \
  -d test_data.csv \
  -n 2 \
  --delay-request 500 \
  --timeout-request 10000 \
  -r cli,htmlextra,json \
  --reporter-htmlextra-export report.html \
  --reporter-json-export report.json
```

参数说明：

| 参数 | 含义 |
|------|------|
| `-n` | 迭代次数 |
| `--delay-request` | 请求间隔（ms） |
| `--timeout-request` | 请求超时（ms） |
| `-r` | 报告类型，多个用逗号 |
| `--bail` | 遇到失败立即停止 |
| `-k` | 跳过 SSL 校验 |

### 12.5 CI/CD 集成示例（GitHub Actions）

```yaml
name: API Test
on: [push]
jobs:
  api-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Newman
        run: |
          npm install -g newman
          npm install -g newman-reporter-htmlextra
      - name: Run API Tests
        run: |
          newman run ./postman/collection.json \
            -e ./postman/environment.json \
            -r cli,htmlextra \
            --reporter-htmlextra-export ./report.html
      - name: Upload Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-report
          path: ./report.html
```

---

## 十三、接口测试实战案例

### 13.1 案例一：登录 → 提取 Token → 查询用户信息

**接口 1：登录**

```
POST {{base_url}}/api/login
Body (raw JSON):
{
    "username": "{{username}}",
    "password": "{{password}}"
}

Tests:
pm.test("登录成功", function () {
    pm.response.to.have.status(200);
    const json = pm.response.json();
    pm.expect(json.code).to.eql(0);
    pm.environment.set("token", json.data.token);
    pm.environment.set("userId", json.data.userId);
});
```

**接口 2：查询用户信息**

```
GET {{base_url}}/api/user/{{userId}}
Headers:
    Authorization: Bearer {{token}}

Tests:
pm.test("查询成功", function () {
    pm.response.to.have.status(200);
    const json = pm.response.json();
    pm.expect(json.data.userId).to.eql(parseInt(pm.environment.get("userId")));
});
```

### 13.2 案例二：参数化登录测试（数据驱动）

数据文件 `login_cases.csv`：

```csv
case_name,username,password,expected_code
正常登录,testuser,123456,0
账号不存在,nouser,123456,1002
密码错误,testuser,wrong,1001
账号为空,,123456,1003
```

登录请求 Tests：

```javascript
pm.test(`[${pm.iterationData.get("case_name")}]`, function () {
    const json = pm.response.json();
    const expected = parseInt(pm.iterationData.get("expected_code"));
    pm.expect(json.code).to.eql(expected);
});
```

Collection Runner 选择该 CSV → 运行 → 4 条用例自动执行并产出结果。

### 13.3 案例三：完整下单流程

业务链路：登录 → 查询商品 → 加入购物车 → 创建订单 → 查询订单

将 5 个接口放入同一文件夹，通过 Tests 串联：

```javascript
// 接口 1：登录
pm.environment.set("token", pm.response.json().data.token);

// 接口 2：查询商品
pm.environment.set("productId", pm.response.json().data.list[0].id);

// 接口 3：加入购物车
pm.environment.set("cartId", pm.response.json().data.cartId);

// 接口 4：创建订单
pm.environment.set("orderId", pm.response.json().data.orderId);
pm.test("订单创建成功", function() {
    pm.expect(pm.response.json().data.orderId).to.be.a("number");
});

// 接口 5：查询订单
pm.test("订单状态正确", function() {
    pm.expect(pm.response.json().data.status).to.eql("WAIT_PAY");
});
```

Collection Runner 按顺序执行，可验证整条业务链路。

### 13.4 案例四：异常场景测试

针对同一接口构造异常场景：

| 用例 | 修改点 | 预期结果 |
|------|--------|---------|
| 缺失必填参数 | 删除 Body 中某字段 | 返回 4xx，错误码提示字段缺失 |
| 参数类型错误 | 数字字段传字符串 | 返回 4xx |
| 参数边界值 | 长度上限 +1 | 返回 4xx |
| 无 Token | 删除 Authorization | 返回 401 |
| 过期 Token | 使用过期 Token | 返回 401 |
| 无权限 | 用普通用户访问管理接口 | 返回 403 |
| 重复提交 | 短时间内发送 2 次相同请求 | 第 2 次应被拦截 |
| SQL 注入 | 输入 `' OR '1'='1` | 应被拦截或转义 |
| XSS 攻击 | 输入 `<script>alert(1)</script>` | 应被过滤 |

每个用例独立保存为请求，配合数据驱动，可一次性运行所有异常场景。

---

## 十四、团队协作

### 14.1 Workspace 工作空间

- **Personal Workspace**：个人工作空间，仅自己可见
- **Team Workspace**：团队共享空间，成员可同时编辑（免费版有人数限制）

### 14.2 同步与分享

- 登录账号后，所有变更自动云同步
- 右键 Collection → `Share` → 生成分享链接 / 邀请成员
- 团队可对 Collection 进行权限管理（View / Edit）

### 14.3 版本控制

Postman 提供 fork/merge 功能：

- 个人 fork 团队 Collection 进行本地修改
- 修改完成后发起 Pull Request
- 团队 Owner 审核合并

### 14.4 导出与备份

定期导出 Collection 和 Environment 为 JSON，备份到 Git 仓库，避免账号问题导致数据丢失。

---

## 十五、常见问题排查

### 15.1 接口返回 401 / 403

- 检查 Token 是否正确（特别注意 `Bearer ` 前缀和空格）
- 检查 Token 是否过期
- 检查用户角色权限
- 通过 Console 查看实际发送的 Header

### 15.2 接口返回 404

- 检查 URL 拼写
- 检查请求方法（GET/POST 不能混用）
- 检查环境变量是否生效（鼠标悬停 `{{base_url}}` 查看实际值）
- 检查接口是否已发布到对应环境

### 15.3 变量没有生效

排查清单：
- 是否已选中环境（右上角）
- 变量名称是否拼写一致（区分大小写）
- `Current Value` 是否有值（不是只填了 `Initial Value`）
- 变量作用域是否被覆盖（同名变量高层级优先）

!!! tip "诊断方法"
    在 Tests 中打印脱敏后的 token，例如 `token.slice(0, 8) + "..."`，从 Console 判断是否成功提取。不要打印完整 token。

### 15.4 SSL 证书错误

测试环境常用自签名证书：

- `Settings` → `General` → 关闭 `SSL certificate verification`
- Newman 命令行：添加 `-k` 参数

### 15.5 文件上传失败

- 检查 Body 类型是否选 `form-data`
- 检查 Type 列是否选 `File`
- Postman 设置 → `Allow reading files outside working directory` 是否开启
- 文件路径是否包含中文/特殊字符

### 15.6 Collection Runner 卡住不动

- 检查 `Delay` 是否设置过大
- 检查是否有死循环 `setNextRequest`
- 通过 Console 查看是否有未捕获异常

### 15.7 中文乱码

- 响应区右上角切换 `UTF-8` 编码
- 请求 Body Header 添加 `Content-Type: application/json; charset=utf-8`

### 15.8 Postman 不能访问内网接口

桌面版需配置代理或在内网机器上运行。或将代理指向公司 VPN 代理。

---

## 十六、进阶建议

### 16.1 学习路径

```
基础请求 → 变量与环境 → Tests 断言 → 数据驱动 
→ Pre-request 脚本 → Mock Server → Newman → CI/CD 集成
```

### 16.2 配套工具推荐

- **Fiddler / Charles**：抓包工具，与 Postman 互补
- **Swagger / OpenAPI**：接口文档，可直接导入 Postman
- **JMeter**：性能压测
- **Allure**：测试报告美化
- **Jenkins / GitLab CI**：流水线集成
- **YApi / Apifox**：国产替代方案（功能更全，免费）

### 16.3 最佳实践

1. **接口分层管理**：按业务模块用文件夹组织 Collection
2. **环境变量先行**：所有可变内容都用变量，禁止硬编码
3. **每个接口至少 3 个断言**：状态码 / 关键字段 / 响应时间
4. **善用 Pre-request 链路**：自动处理 Token、签名等通用逻辑
5. **数据驱动覆盖异常场景**：CSV 中至少包含正常、异常、边界三类用例
6. **定期备份导出**：导出 JSON 到 Git 版本管理
7. **CI/CD 集成**：每次代码提交触发回归测试

---

## 附录：参考资料

- Postman 官方文档：`https://learning.postman.com/`
- Postman Public API Network：`https://www.postman.com/explore`
- Newman 文档：`https://github.com/postmanlabs/newman`
- Chai 断言库文档（Tests 脚本使用）：`https://www.chaijs.com/api/bdd/`

---

!!! info "文档说明"
    本教程基于 Postman 桌面版 10.x 编写，适用于 Windows/Mac/Linux。

!!! warning "测试纪律"
    接口测试请在测试环境进行，禁止用真实用户数据测试，禁止在生产环境执行批量请求。涉及第三方接口需注意调用频率限制。

---

## 下一步建议

<div class="tutorial-next-steps">

### 完成检查

学完本教程后，检查自己是否能做到：

- [ ] 能创建和发送 GET、POST、PUT、DELETE 请求
- [ ] 能设置请求头、请求体、查询参数
- [ ] 能使用环境变量管理不同环境
- [ ] 能使用 Pre-request Script 提取 Token
- [ ] 能使用 Tests 编写断言
- [ ] 能使用 Collection Runner 批量执行

### 推荐下一步

根据你的学习进度，选择下一步：

1. **如果你想学抓包**：学习 [Fiddler 抓包教程](Fiddler抓包教程-软件测试版.md)，掌握请求分析
2. **如果你想学接口测试**：学习 [接口测试方法论](../专项测试/接口测试完整教程-软件测试版.md)，掌握用例设计
3. **如果你想进入自动化**：学习 [Python 接口自动化](../自动化测试/Python+Requests+Allure接口自动化教程-软件测试版.md)，掌握代码化测试

### 通关检查

完成本阶段后，使用 [第2阶段-工具实战通关](../学习中心/第2阶段-工具实战通关.md) 检查是否可以进入下一阶段。

</div>
