---
description: JMeter 性能测试教程，脚本编写、参数化和分布式压测。
---
# JMeter 性能测试教程（软件测试人员专用）

> 本教程面向软件测试工程师，系统讲解 JMeter 性能测试，从基础概念、工具使用到完整压测方案落地。

---

## 前置要求

| 项目 | 要求 | 获取方式 |
|------|------|----------|
| HTTP 协议 | 了解请求方法、状态码、请求头与响应体 | [网络知识教程-软件测试版](../工具操作/网络知识教程-软件测试版.md) |
| 接口测试基础 | 了解接口测试流程、用例设计方法 | [接口测试完整教程-软件测试版](../专项测试/接口测试完整教程-软件测试版.md) |

---

## 新手导读

性能测试对新手最难的地方不是 JMeter 按钮，而是理解指标和场景。第一遍不要直接上大并发，先用小并发跑通一个接口。

建议学习顺序：

1. 理解响应时间、TPS、并发、错误率、P95。
2. 用 JMeter 创建一个最简单的 HTTP 请求。
3. 添加断言，确认响应是业务成功。
4. 用 5 到 10 个线程小规模运行。
5. 查看结果报告并写一句结论。

能解释结果，比单纯跑出报告更重要。

### 版本与维护说明

| 项目 | 说明 |
|------|------|
| 适用工具 | Apache JMeter 5.x、JMeter Plugins、JDK |
| 使用建议 | 图形界面适合调试，正式压测建议命令行运行 |
| 更新提醒 | JMeter、插件管理器和 JDK 兼容性会变化，安装前先核对官方要求 |

---
## 一、性能测试基础

### 1.1 什么是性能测试

**性能测试：** 验证系统在特定负载下的响应时间、吞吐量、资源利用率等指标是否达标。

### 1.2 性能测试类型

| 类型 | 目的 | 示例 |
|------|------|------|
| **基准测试** | 单用户单次性能基线 | 1 用户跑 1 分钟 |
| **负载测试** | 找性能拐点 | 逐步加压到性能下降 |
| **压力测试** | 找系统极限 | 加压至崩溃 |
| **并发测试** | 多用户同时操作的正确性 | 100 人同时秒杀 |
| **稳定性测试** | 长时间运行无问题 | 24 小时持续 |
| **峰值测试** | 瞬时高峰 | 双 11 0 点 |
| **容量测试** | 系统最大承载 | 找最大并发用户 |

### 1.3 关键指标

| 指标 | 全称 | 含义 |
|------|------|------|
| **RT** | Response Time | 响应时间（毫秒） |
| **TPS** | Transactions Per Second | 每秒事务数 |
| **QPS** | Queries Per Second | 每秒查询数 |
| **并发用户** | Concurrent Users | 同一时刻发起请求的用户数 |
| **错误率** | Error Rate | 失败请求 / 总请求 |
| **吞吐量** | Throughput | 单位时间处理量 |
| **CPU/内存** | Resource Usage | 服务器资源占用 |

**指标关系：**

```
TPS = 并发数 / 平均 RT（注意单位：RT 要换算成秒）

例：100 并发，平均 RT 200ms = 0.2s
TPS = 100 / 0.2 = 500（每秒处理 500 个请求）
```

> TPS（Transactions Per Second）= 每秒完成的请求数。QPS（Queries Per Second）含义类似，一般可通用。

### 1.4 性能要求确认

性能测试前必须明确：

```
1. 业务场景：登录？下单？查询？
2. 用户规模：DAU / 同时在线 / 峰值并发
3. 性能目标：RT < ?ms，TPS > ?，错误率 < ?%
4. 测试环境：服务器配置、网络
5. 测试数据：账号、商品、订单的量级
6. 监控范围：应用 / 数据库 / 中间件
```

### 1.5 性能测试 vs 功能测试

| 维度 | 功能测试 | 性能测试 |
|------|---------|---------|
| 目标 | 功能正确 | 性能达标 |
| 用户数 | 1 个 | 大量 |
| 关注 | 是否能用 | 多快、多稳 |
| 数据量 | 少量 | 大量真实数据 |
| 工具 | Postman 等 | JMeter / Locust |

---

## 二、JMeter 简介与安装

### 2.1 JMeter 是什么

Apache JMeter 是开源的性能测试工具，由 Java 开发，特点：

- **完全免费**、开源
- **协议支持广**：HTTP、HTTPS、FTP、JDBC、TCP、SOAP、WebSocket 等
- **图形界面 + 命令行**
- **插件生态丰富**
- **分布式压测**
- **Web 报告**

### 2.2 安装

**前置：** 需要 JDK 8+（JMeter 5.6 推荐使用 JDK 17）

```bash
# 验证 Java
java -version
```

**下载：**

1. 官网：`https://jmeter.apache.org/download_jmeter.cgi`
2. 下载 Binary 包（zip / tgz）
3. 解压到本地，如 `D:\tools\apache-jmeter-5.6.3`

**启动：**

- **Windows：** 双击 `bin/jmeter.bat`
- **Mac/Linux：** `./bin/jmeter`

**环境变量（推荐）：**

=== "Linux / Mac"

    ```bash
    export JMETER_HOME=/opt/apache-jmeter-5.6.3
    export PATH=$JMETER_HOME/bin:$PATH
    ```

=== "Windows"

    ```cmd
    set JMETER_HOME=D:\tools\apache-jmeter-5.6.3
    set PATH=%JMETER_HOME%\bin;%PATH%
    ```

    > 永久生效需在"系统属性 → 环境变量"中添加。

### 2.3 中文界面

JMeter 默认英文，临时切换：

`Options` → `Choose Language` → `Chinese (Simplified)`

**永久切换：** 修改 `bin/jmeter.properties`：

```properties
language=zh_CN
```

!!! tip "建议"
    用英文界面，因为多数教程、错误信息是英文，方便排错。

### 2.4 安装插件

JMeter 插件管理器（强烈推荐）：

1. 下载 `jmeter-plugins-manager.jar`：`https://jmeter-plugins.org/install/Install/`
2. 放到 `lib/ext/` 目录
3. 重启 JMeter
4. 菜单 `Options` 出现 `Plugins Manager`

**推荐插件：**

- 3 Basic Graphs：基础图表
- Custom Thread Groups：自定义线程组（阶梯加压）
- Throughput Shaping Timer：吞吐量整形

---

## 三、界面与核心组件

### 3.1 主界面结构

```
┌──────────────────────────────────────────┐
│ 菜单 / 工具栏                              │
├────────────┬─────────────────────────────┤
│            │                             │
│ 左侧测试树  │  右侧组件配置面板             │
│            │                             │
│ Test Plan  │                             │
│ └ ThreadGr │                             │
│   └ HTTP   │                             │
│   └ Listen │                             │
│            │                             │
└────────────┴─────────────────────────────┘
```

### 3.2 核心组件

**测试计划（Test Plan）：** 根节点，整个测试的容器

**线程组（Thread Group）：** 模拟用户

**取样器（Sampler）：** 发送请求（HTTP、JDBC 等）

**逻辑控制器（Logic Controller）：** 控制执行流程

**前置处理器（Pre Processor）：** 请求前执行

**后置处理器（Post Processor）：** 请求后执行（如提取响应数据）

**断言（Assertion）：** 校验响应

**定时器（Timer）：** 控制请求频率

**配置元件（Config Element）：** 默认配置、变量等

**监听器（Listener）：** 收集结果

### 3.3 组件作用域

JMeter 组件按 **树形结构** 生效：父节点对所有子节点有效。

```
Test Plan
├── HTTP Default Config（对整个测试有效）
├── Thread Group A
│   ├── HTTP Sampler 1
│   ├── HTTP Sampler 2
│   └── Listener（只对 A 有效）
└── Thread Group B
    └── HTTP Sampler 3
```

---

## 四、第一个性能测试

### 4.1 目标

测试 `https://httpbin.org/get` 接口在 10 并发下的性能。

### 4.2 步骤

**Step 1：添加线程组**

- 右键 `Test Plan` → `Add` → `Threads (Users)` → `Thread Group`
- 配置：
  - Number of Threads（线程数）：10
  - Ramp-up period（启动时间）：5（5 秒内启动 10 个）
  - Loop Count（循环次数）：10

**Step 2：添加 HTTP 请求**

- 右键 `Thread Group` → `Add` → `Sampler` → `HTTP Request`
- 配置：
  - Protocol：https
  - Server Name：httpbin.org
  - Method：GET
  - Path：/get

**Step 3：添加监听器**

- 右键 `Thread Group` → `Add` → `Listener` → `View Results Tree`（看每条结果）
- 再加 `Summary Report`（看汇总）

**Step 4：保存并运行**

- `Ctrl+S` 保存为 `first_test.jmx`
- 点击工具栏绿色 **▶** 启动
- 看右侧监听器结果

### 4.3 看结果

**Summary Report：**

| Label | # Samples | Average | Min | Max | Std. Dev. | Error % | Throughput | Received |
|-------|-----------|---------|-----|-----|-----------|---------|------------|----------|
| HTTP Request | 100 | 320 | 280 | 450 | 35 | 0.00% | 18.5/sec | 12 KB/sec |

- **Samples：** 总请求数
- **Average：** 平均响应时间（ms）
- **Min/Max：** 最小/最大
- **Error %：** 错误率
- **Throughput：** 吞吐量（请求/秒）

---

## 五、线程组详解

### 5.1 普通线程组参数

| 参数 | 含义 |
|------|------|
| Number of Threads | 模拟的用户数（并发） |
| Ramp-up period | 启动所有线程所需时间（秒） |
| Loop Count | 每个用户循环多少次 |
| Same user on each iteration | 同用户多次（影响 cookie） |
| Delay Thread creation until needed | 延迟创建（节省资源） |
| Scheduler | 调度器（按时间运行） |
| Duration | 持续时间（秒） |
| Startup Delay | 延迟启动 |

**举例：**

- 100 线程，Ramp-up 100 秒 → 每秒启 1 个
- 100 线程，Ramp-up 0 → 瞬时全启动
- Loop = Forever + Duration = 300 → 持续 5 分钟

### 5.2 setUp Thread Group / tearDown Thread Group

- **setUp：** 测试前执行（造数据、登录拿 token）
- **tearDown：** 测试后执行（清数据）

### 5.3 自定义线程组（插件）

需要插件支持。

**Stepping Thread Group（阶梯加压）：** 逐步增加并发数，帮你找到系统的"拐点"——在哪个压力下响应时间开始变长或出错。比直接拉满并发更科学。

```
0~30 秒：启动 100 线程
30~60 秒：每 10 秒加 50 线程，直到 500
500 线程持续 5 分钟
然后每 10 秒减 50，直到全部停止
```

**Ultimate Thread Group（终极版）：**

更灵活，可设置多段加压、保压、减压时间。

**适用场景：**

- 找拐点：阶梯加压
- 模拟峰值：瞬时大量并发
- 持续稳定性：长时间保压

### 5.4 并发模型对比

| 模型 | 适用场景 |
|------|---------|
| 固定并发 | 验证某个具体并发下的性能 |
| 阶梯加压 | 找性能拐点 |
| 峰值脉冲 | 模拟秒杀、限时活动 |
| 持续保压 | 稳定性测试 |

---

## 六、HTTP 取样器

### 6.1 HTTP Request 配置

**基础配置：**

| 字段 | 说明 |
|------|------|
| Protocol | http / https |
| Server Name or IP | 服务器地址 |
| Port | 端口 |
| Method | GET/POST/PUT/DELETE |
| Path | URL 路径 |
| Content encoding | UTF-8 |

**参数传递：**

- GET：在 `Parameters` 标签下加 key-value
- POST 表单：在 `Parameters` 标签
- POST JSON：在 `Body Data` 标签贴 JSON，并加 Header `Content-Type: application/json`

### 6.2 HTTP Header Manager（请求头管理）

`Thread Group` → 右键 → `Add` → `Config Element` → `HTTP Header Manager`

添加：

| Name | Value |
|------|-------|
| Content-Type | application/json |
| Authorization | Bearer ${token} |
| User-Agent | JMeter/5.6 |

### 6.3 HTTP Request Defaults（默认配置）

避免每个请求重复填 Server 等：

`Add` → `Config Element` → `HTTP Request Defaults`

填一次 Protocol、Server、Port，下面所有请求自动继承。

### 6.4 Cookie Manager（Cookie 管理）

自动管理 Cookie（登录后保持会话）：

`Add` → `Config Element` → `HTTP Cookie Manager`

勾选 `Clear cookies each iteration?`（每次迭代清理）。

### 6.5 上传文件

HTTP Request 的 `Files Upload` 标签：

| File Path | Parameter Name | MIME Type |
|-----------|----------------|-----------|
| D:/test.jpg | file | image/jpeg |

Method 自动变 multipart/form-data。

---

## 七、参数化与数据驱动

性能测试常需要每个用户用不同数据（如不同账号），避免击中缓存或重复登录。

### 7.1 用户参数（少量数据）

`Add` → `Config Element` → `User Defined Variables`

| Name | Value |
|------|-------|
| base_url | https://api-test.example.com |
| username | testuser |

引用：`${base_url}`

### 7.2 CSV 数据文件（大量数据，最常用）

**数据文件 `users.csv`：**

```csv
username,password
user001,123456
user002,123456
user003,123456
...
user100,123456
```

**配置 CSV Data Set Config：**

`Add` → `Config Element` → `CSV Data Set Config`

| 字段 | 值 |
|------|------|
| Filename | D:/test/users.csv |
| Variable Names | username,password |
| Delimiter | , |
| Recycle on EOF? | True/False |
| Stop thread on EOF? | True/False |
| Sharing mode | All threads（所有线程共享） |

**引用：**

HTTP Request Body：

```json
{
  "username": "${username}",
  "password": "${password}"
}
```

**Sharing mode 详解：**

- `All threads`：所有线程共享一份数据（多线程顺序读）
- `Current thread group`：当前线程组共享
- `Current thread`：每个线程独立读（每线程从头开始）

### 7.3 函数生成参数

JMeter 用 `${...}` 语法引用变量和函数，放在请求的任意字段（URL、Header、Body）中，运行时自动替换为实际值。函数以双下划线开头：`${__函数名(参数)}`。

**__Random 随机数：**

```
${__Random(1,100)}        随机 1~100
${__Random(1000,9999)}    4 位随机
```

**__time 时间戳：**

```
${__time(yyyy-MM-dd HH:mm:ss)}
${__time()}                毫秒时间戳
${__time(/1000)}           秒级时间戳
```

**__UUID：**

```
${__UUID()}    生成 UUID
```

**__counter 计数器：**

```
${__counter(TRUE,)}    每线程独立计数（第 2 参为变量名，可省略）
${__counter(FALSE,)}   全局计数
```

!!! tip "建议"
    规范写法：`${__counter(TRUE)}` 或 `${__counter(TRUE,myVar)}`，尾随逗号虽可工作但不推荐。

**__RandomString：**

```
${__RandomString(10,abcdefghijklmn)}    10 位随机字符
```

### 7.4 计数器（Counter）

`Add` → `Config Element` → `Counter`

| 字段 | 含义 |
|------|------|
| Starting Value | 起始 |
| Increment | 增量 |
| Maximum Value | 最大 |
| Reference Name | 变量名 |

引用：`${counter_var}`

---

## 八、关联与变量提取

性能测试中常见场景：登录返回 Token，后续请求要带 Token。需从响应中提取数据传给下一请求。

### 8.1 JSON Extractor（JSON 提取，最常用）

接口返回 JSON：

```json
{
  "code": 0,
  "data": {
    "token": "eyJhbGciOi...",
    "userId": 12345
  }
}
```

在登录请求下 `Add` → `Post Processors` → `JSON Extractor`：

| 字段 | 值 |
|------|------|
| Names of created variables | token |
| JSON Path expressions | $.data.token |
| Match No. | 1（第一个匹配） |
| Default Values | NOT_FOUND（未提取到时的默认值） |

后续请求引用：`${token}`

### 8.2 正则表达式提取器

对非 JSON 响应或复杂场景：

`Add` → `Post Processors` → `Regular Expression Extractor`

| 字段 | 值 |
|------|------|
| Field to check | Body |
| Reference Name | token |
| Regular Expression | "token":"(.+?)" |
| Template | $1$ |
| Match No. | 1 |

### 8.3 边界提取器（推荐用于简单场景）

`Add` → `Post Processors` → `Boundary Extractor`

| 字段 | 值 |
|------|------|
| Reference Name | token |
| Left Boundary | "token":" |
| Right Boundary | " |

比正则更简单。

### 8.4 调试变量

加 `Add` → `Sampler` → `Debug Sampler`，可在 View Results Tree 中看到所有变量值。

---

## 九、断言与检查点

接口响应正确才算成功，否则算失败。

### 9.1 响应断言（Response Assertion）

`Add` → `Assertions` → `Response Assertion`

| 字段 | 说明 |
|------|------|
| Apply to | Main sample only（默认） |
| Field to Test | Response Text / Code / Headers |
| Pattern Matching Rules | Contains / Matches / Equals |
| Patterns to Test | 期望包含的字符串 |

**示例：**

- 检查响应码：Test field 选 `Response Code`，Pattern 填 `200`
- 检查响应包含：Test field 选 `Response Text`，Pattern 填 `"code":0`

### 9.2 JSON 断言

`Add` → `Assertions` → `JSON Assertion`

| 字段 | 值 |
|------|------|
| Assert JSON Path | $.code |
| Additionally assert value | 勾选 |
| Expected Value | 0 |

### 9.3 持续时间断言

请求耗时不超过 N 毫秒：

`Add` → `Assertions` → `Duration Assertion`

| 字段 | 值 |
|------|------|
| Duration in milliseconds | 1000 |

!!! tip "建议"
    接口耗时 > 1 秒算失败。

### 9.4 大小断言

```
Add → Assertions → Size Assertion
Size in bytes: > 100
```

---

## 十、监听器与结果分析

### 10.1 监听器类型

| 监听器 | 用途 | 性能影响 |
|--------|------|---------|
| **View Results Tree** | 看每条详情 | 高 |
| **Summary Report** | 汇总统计 | 低 |
| **Aggregate Report** | 聚合报告（含 90%、95%） | 低 |
| **Backend Listener** | 推送到 InfluxDB → Grafana | 低 |
| **Graph Results** | 图表展示 | 中 |

!!! warning "重要"
    正式压测时关闭 `View Results Tree`，否则严重影响性能。

### 10.2 聚合报告字段

| 字段 | 含义 |
|------|------|
| Label | 请求名 |
| # Samples | 总请求数 |
| Average | 平均响应时间 |
| Median | 中位数（50%） |
| 90% Line | 90% 用户响应时间小于此 |
| 95% Line | 95% 用户响应时间小于此 |
| 99% Line | 99% 用户响应时间小于此 |
| Min/Max | 最小/最大 |
| Error % | 错误率 |
| Throughput | 吞吐量 |

**重点关注：**

- **平均值会被极端值拉偏**，看 90%、95% 更准
- **Throughput 等于 TPS**
- **Error % 应 < 0.5%**

### 10.3 HTML 报告（命令行模式生成）

JMeter 自带 HTML 报告生成：

```bash
jmeter -n -t test.jmx -l result.jtl -e -o report/
```

- `-n` 非 GUI 模式
- `-t` 测试脚本
- `-l` 结果日志
- `-e` 生成报告
- `-o` 报告输出目录

打开 `report/index.html` 查看，包含：

- Statistics（统计表）
- Errors（错误明细）
- Top 5 Errors by sampler
- Response Times Over Time（时间趋势）
- TPS Over Time
- 各 Percentile 分布图

### 10.4 实时监控（InfluxDB + Grafana）

JMeter 内置报告只能测试结束后看。如果想在压测过程中**实时**看 TPS、响应时间曲线，需要 InfluxDB + Grafana。

- **InfluxDB**：时序数据库，专门存时间序列指标数据
- **Grafana**：可视化仪表盘，从 InfluxDB 读数据画实时图表

**架构：**

```
JMeter → Backend Listener → InfluxDB → Grafana 仪表盘
                                    （实时展示 TPS、RT 曲线）
```

实时看 TPS、RT 曲线、错误率，是企业级标配。

**配置 Backend Listener：**

`Add` → `Listener` → `Backend Listener`

| 字段 | 值 |
|------|------|
| Backend Listener implementation | InfluxDB Backend Listener |
| influxdbUrl | http://192.168.1.100:8086/write?db=jmeter |
| application | my_test |

!!! info "InfluxDB 版本差异"
    - InfluxDB 1.x：`http://host:8086/write?db=jmeter`
    - InfluxDB 2.x：API 路径改为 `/api/v2/write?org=xxx&bucket=jmeter`，需用支持 2.x 的 Backend Listener 实现（或社区插件），并配置 Token。

---

## 十一、分布式压测

### 11.1 为什么需要分布式

单台 JMeter 机器有性能上限（通常 500~1000 并发），更大压力需多机配合。

### 11.2 架构

```
        Master（控制机）
            │
    ┌───────┼───────┐
    │       │       │
  Slave1  Slave2  Slave3   （压力机）
    │       │       │
    └───────┼───────┘
            ↓
       被测系统
```

### 11.3 配置步骤

**前置条件：**

- Master 和 Slave 在同一网络
- 所有机器 JMeter 版本一致
- 关闭防火墙或开放 1099 端口
- 时间同步

**Slave 配置：**

=== "Linux / Mac"

    ```bash
    cd $JMETER_HOME/bin
    ./jmeter-server -Djava.rmi.server.hostname=192.168.1.101
    ```

=== "Windows"

    ```cmd
    cd %JMETER_HOME%\bin
    jmeter-server.bat -Djava.rmi.server.hostname=192.168.1.101
    ```

    > `$JMETER_HOME`（Linux）和 `%JMETER_HOME%`（Windows）都是引用前面配置的 JMeter 安装路径环境变量。

**Master 配置：**

修改 `bin/jmeter.properties`：

```properties
remote_hosts=192.168.1.101:1099,192.168.1.102:1099
```

**启动分布式压测：**

```bash
# GUI 模式
菜单：Run → Remote Start All

# 命令行模式
jmeter -n -t test.jmx -R 192.168.1.101,192.168.1.102 -l result.jtl
```

`-R` 指定远程压力机。

### 11.4 数据文件分发

CSV 数据文件需手动复制到每台 Slave，或使用共享存储。

---

## 十二、命令行执行

### 12.1 为什么用命令行

- 节省资源（GUI 占用大）
- 可集成 CI/CD
- 服务器上跑（无图形界面）

### 12.2 基础命令

```bash
jmeter -n -t test.jmx -l result.jtl
```

| 参数 | 说明 |
|------|------|
| `-n` | 非 GUI 模式 |
| `-t` | 测试脚本（.jmx） |
| `-l` | 结果文件（.jtl） |
| `-e` | 测试结束后生成报告 |
| `-o` | 报告输出目录 |
| `-R` | 远程主机（分布式） |
| `-J` | 传递参数 |
| `-G` | 传递全局参数 |

### 12.3 完整命令示例

```bash
jmeter -n \
  -t login_test.jmx \
  -l result/login_$(date +%Y%m%d_%H%M%S).jtl \
  -e \
  -o report/login_$(date +%Y%m%d_%H%M%S) \
  -Jthreads=500 \
  -Jduration=300
```

脚本中可用 `${__P(threads,100)}` 引用参数（100 是默认值）。

### 12.4 后台执行

```bash
# Linux 后台执行
nohup jmeter -n -t test.jmx -l result.jtl > jmeter.log 2>&1 &

# 看进度
tail -f jmeter.log
```

---

## 十三、性能测试实战

### 13.1 案例一：登录接口压测

**目标：** 验证登录接口在 500 并发下 RT < 500ms。

**脚本结构：**

```
Test Plan
├── HTTP Request Defaults（默认配置 base_url）
├── HTTP Header Manager（Content-Type: application/json）
├── CSV Data Set Config（users.csv）
├── Thread Group（500 线程，Ramp-up 60s，Duration 300s）
│   ├── HTTP Request: POST /api/login
│   │   ├── Body: {"username":"${username}","password":"${password}"}
│   │   └── JSON Assertion: $.code = 0
│   └── Constant Throughput Timer（限制 TPS 上限，避免压垮）
└── Listeners
    ├── Summary Report
    └── Backend Listener（InfluxDB）
```

**用例数据：** 准备 500 个测试账号

**执行：**

```bash
jmeter -n -t login_perf.jmx -l result.jtl -e -o report/
```

**结果分析：**

- 平均 RT：280ms ✓
- 95% RT：450ms ✓
- TPS：1620 ✓
- 错误率：0.05% ✓

### 13.2 案例二：完整下单链路压测

**链路：** 登录 → 查商品 → 加购物车 → 创建订单 → 支付

**脚本：**

```
Test Plan
├── HTTP Defaults
├── CSV Data（users.csv）
├── Thread Group（200 线程）
│   ├── HTTP: POST /api/login
│   │   └── JSON Extractor: $.data.token → token
│   ├── HTTP Header: Authorization: Bearer ${token}
│   ├── HTTP: GET /api/products?page=1
│   │   └── JSON Extractor: $.data[0].id → productId
│   ├── HTTP: POST /api/cart/add
│   │   └── Body: {"productId":${productId},"quantity":1}
│   ├── HTTP: POST /api/order/create
│   │   └── JSON Extractor: $.data.orderId → orderId
│   └── HTTP: POST /api/order/pay
│       └── Body: {"orderId":${orderId}}
└── Listeners
```

**注意事项：**

- 链路有依赖，任一接口失败后续都失败
- 各接口单独看 RT/TPS
- 同一用户不应同时发起多个订单（用计数器或控制器隔离）

### 13.3 案例三：阶梯加压找拐点

**目标：** 找系统最大承载，定位拐点。

**用 Stepping Thread Group：**

```
0~60 秒：100 线程
60~120 秒：再加 100，达 200
120~180 秒：再加 100，达 300
...
依次加压到 1000
```

**观察：**

- 持续盯 TPS 曲线
- 当增加并发但 TPS 不增反降 → 拐点
- 此时 RT 急剧上升 → 系统过载

**报告示例：**

| 并发 | TPS | RT(ms) | Error% |
|------|-----|--------|--------|
| 100 | 800 | 125 | 0% |
| 200 | 1500 | 130 | 0% |
| 300 | 2100 | 140 | 0.1% |
| 400 | 2400 | 165 | 0.2% |
| 500 | 2500 | 200 | 0.5% |
| 600 | 2400 | 250 | 1.5% ← 拐点 |
| 700 | 2200 | 320 | 5% |
| 800 | 1800 | 450 | 12% ← 崩溃 |

结论：系统最佳承载 500 并发，最大 600。

### 13.4 案例四：稳定性测试

**目标：** 200 并发持续 4 小时，验证无内存泄漏、性能不下降。

**关注：**

- TPS 是否稳定（前 10 分钟 vs 中间 vs 末尾对比）
- RT 是否上升
- 错误率是否累积
- 内存使用是否持续增长（监控服务器 free 命令）
- GC 频率（Java 应用）

---

## 十四、性能瓶颈分析

### 14.1 分析思路

```
现象 → 监控 → 定位 → 验证
```

### 14.2 服务器监控指标

| 指标 | 命令 | 关注阈值 |
|------|------|---------|
| CPU 使用率 | `top` | < 70% |
| CPU 负载 | `uptime` | < CPU 核数 |
| 内存 | `free -h` | available > 20% |
| 磁盘 IO | `iostat -x 1` | %util < 80% |
| 网络 | `sar -n DEV 1` | 看带宽 |
| TCP 连接 | `netstat -ant` 再 `wc -l` 看连接数 | 看积压 |

### 14.3 常见瓶颈与定位

**CPU 飙高：**

- 应用计算密集
- GC 频繁（Java）
- 死循环

**内存爆掉：**

- 内存泄漏
- 大对象常驻
- 缓存无上限

**IO 等待高（%wa）：**

- 磁盘慢
- 数据库慢查询
- 大量日志输出

**网络瓶颈：**

- 带宽打满
- TCP 连接数耗尽
- 防火墙限制

**数据库瓶颈：**

- 慢查询（看慢日志）
- 锁等待
- 连接池满
- 缺索引

**应用层瓶颈：**

- 线程池满
- 线程死锁（jstack 看线程栈）
- 内存满（jstat 看 GC）

### 14.4 Java 应用性能分析工具

> `<pid>` 是进程 ID。用 `jps`（Java 自带）或 `ps -ef | grep java`（Linux）找到 Java 进程的 PID。

```bash
# 看 GC（每秒刷新，共 10 次）
jstat -gc <pid> 1000 10

# 看堆内存
jmap -heap <pid>

# 查看对象占用排名（前 20 条）
jmap -histo:live <pid> | head -20    # Linux / Mac（head 只取前 N 行）
jmap -histo:live <pid> | more        # Windows（more 逐页查看，按空格翻页）

# 看线程栈
jstack <pid>

# 推荐工具
# - Arthas（阿里开源，功能最全，推荐）
# - JProfiler（商业，图形化）
# - VisualVM（免费，JDK 自带）
```

### 14.5 优化建议

| 问题 | 优化方向 |
|------|---------|
| CPU 高 | 算法优化、缓存、异步化 |
| 内存高 | 排查泄漏、调整 JVM、限制对象 |
| IO 高 | 减少日志、SSD、批量操作 |
| 数据库慢 | 加索引、优化 SQL、读写分离 |
| 线程满 | 调线程池、异步、限流 |
| 网络瓶颈 | CDN、压缩、长连接 |

---

### 14.6 四层定位法：从现象到根因

上面 14.3 是"有哪些瓶颈"的清单，但真实压测中最难的不是记住清单，而是**知道该按什么顺序排查**。乱查一通会把时间浪费在错误的方向。

推荐按下面四层自上而下推进，**每层会用不同的工具**：

```text
第 1 层：压测机自身   →  先排除"压力根本没发出去"
第 2 层：应用层       →  线程、GC、接口耗时
第 3 层：数据库层     →  慢查询、锁、连接池
第 4 层：系统/中间件层 →  CPU、内存、IO、网络、缓存
```

!!! warning "为什么第 1 层必须最先查"
    最高频的误判就是："系统扛不住，TPS 上不去"。结果查了半天应用，最后发现是**压测机自己 CPU 打满、或者 JMeter 堆内存不足**，压力根本没发出去。

    **排查纪律：先用一台机器单独跑，确认压测机资源富余，再开始排查服务端。**

### 14.7 第 2 层：应用层定位

**关键动作：确认瓶颈接口**

先看聚合报告里哪个接口最慢，再看它的耗时构成：

```text
一个有经验的判断顺序：

1. 是所有接口都慢，还是单个接口慢？
   - 都慢        → 更可能是系统层/数据库层/中间件层
   - 单个接口慢  → 优先看该接口的逻辑与 SQL

2. 单个接口慢，是耗时随并发上升，还是恒定高？
   - 恒定高      → 该接口本身有慢逻辑（如 N+1 查询、循环调接口）
   - 随并发上升  → 资源竞争（锁、连接池、线程池、GC）

3. 错误率是否同时上升？
   - 错误率上升  → 看是超时、连接拒绝还是业务报错，指向不同层
```

**用"单接口递增并发"定位分界点：**

```text
分别用 1 / 10 / 50 / 100 并发压同一个接口，记录 RT：
  RT 基本不变           → 该接口不是瓶颈
  RT 在某个并发点陡增   → 该并发点就是该接口的容量边界
  每个并发下 RT 都高    → 接口自身实现问题（跟并发无关）
```

### 14.8 第 3 层：数据库层定位

数据库是**压测中最常见的瓶颈来源**，因为应用层可以横向扩容，数据库扩容成本高。

#### 开启并采集慢查询日志

```sql
-- MySQL：查看当前慢查询配置
SHOW VARIABLES LIKE 'slow_query%';
SHOW VARIABLES LIKE 'long_query_time';

-- 临时开启（重启失效；生产环境改配置文件）
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;          -- 超过 1 秒记录
SET GLOBAL log_queries_not_using_indexes = 'ON';  -- 记录未走索引的查询
```

!!! tip "压测时把 long_query_time 调小"
    压测环境和生产不一样：生产设 1 秒是合理的，但压测时你可能关注的是"哪些查询在并发下变慢"。
    压测期间可以临时调到 `0.1` 秒，跑完再改回来。**记得跑完要改回来**，否则日志会疯狂增长。

**采集后按耗时排序找 TOP 慢查询：**

```bash
# 统计慢日志里出现频率最高的 SQL（按耗时排序取前 20）
mysqldumpslow -s t -t 20 /var/log/mysql/slow.log

# 或用 pt-query-digest（Percona Toolkit，分析更细）
pt-query-digest /var/log/mysql/slow.log
```

#### 用 EXPLAIN 看执行计划

找到慢 SQL 后，用 `EXPLAIN` 判断它慢在哪里：

```sql
EXPLAIN SELECT o.id, o.amount, u.name
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.status = 1 AND o.created_at > '2025-01-01';
```

**重点关注这几列：**

| 列 | 看什么 | 危险信号 |
|----|--------|----------|
| `type` | 访问类型 | `ALL`（全表扫描）、`index`（全索引扫描） |
| `key` | 实际用的索引 | `NULL` 表示没走索引 |
| `rows` | 预估扫描行数 | 远大于实际返回行数 |
| `filtered` | 过滤后剩余百分比 | 很低说明扫描了大量无用数据 |
| `Extra` | 额外信息 | `Using filesort`、`Using temporary` |

!!! warning "type 列的优先级（从好到坏）"
    ```text
    system > const > eq_ref > ref > range > index > ALL

    看到 ALL 基本可以确定：这里就是瓶颈。
    看到 Using filesort / Using temporary：说明排序或分组没能利用索引，
    数据量大时非常慢。
    ```

#### 索引失效的常见原因

慢查询往往不是"没建索引"，而是**建了索引但没走上**：

| 场景 | 失效写法 | 优化写法 |
|------|----------|----------|
| 对字段做运算 | `WHERE YEAR(created_at) = 2025` | `WHERE created_at >= '2025-01-01' AND created_at < '2026-01-01'` |
| 隐式类型转换 | `WHERE user_id = '123'`（字段是 int） | `WHERE user_id = 123` |
| 前导模糊匹配 | `WHERE name LIKE '%张%'` | 尽量用 `LIKE '张%'`，或上全文索引 |
| 联合索引未用最左列 | 索引 `(a,b,c)`，查询只用 `b` | 查询条件带上 `a` |
| 使用 `OR` 连接不同字段 | `WHERE a = 1 OR b = 2` | 拆成两条 `UNION` |
| 索引列使用函数 | `WHERE UPPER(code) = 'ABC'` | 存储时统一大小写 |

#### 锁等待与连接池

```sql
-- 查看当前正在执行的查询（含锁等待）
SHOW PROCESSLIST;

-- 查看 InnoDB 引擎状态（含锁等待、事务信息）
SHOW ENGINE INNODB STATUS;

-- 查看连接数使用情况
SHOW STATUS LIKE 'Threads_connected';
SHOW VARIABLES LIKE 'max_connections';
```

!!! danger "连接池满的典型表现"
    ```
    现象：并发上来后，RT 陡增，日志里出现大量
          "Could not get JDBC Connection" 或
          "connection is not available, request timed out"

    原因：应用线程都在等连接池里的空闲连接

    排查：对比"并发线程数"和"连接池最大连接数"
          - 并发 200，连接池只有 20  → 必然排队
          - 连接池够但 SQL 慢导致连接不释放 → 回到慢查询
    ```

    **要点**：连接池不是越大越好，但如果并发数远大于池大小，一定是瓶颈。

### 14.9 JVM 层定位（Java 应用）

Java 应用的性能问题，很大一部分出在**垃圾回收**和**线程阻塞**上。

#### 第一步：看 GC 状况

```bash
# 每 1 秒输出一次 GC 统计，共 10 次
jstat -gcutil <pid> 1000 10
```

**关键列解读：**

| 列 | 含义 | 警戒值 |
|----|------|--------|
| `O` | 老年代使用率 | 持续 > 90% 危险 |
| `FGC` | Full GC 次数 | **持续增长**说明内存回收不过来 |
| `FGCT` | Full GC 总耗时 | 占压测时间比例 > 10% 即有影响 |
| `YGC`/`YGCT` | 新生代 GC 次数与耗时 | YGC 极频繁说明对象创建过快 |

!!! warning "怎么判断 GC 是不是瓶颈"
    ```
    方法：压测前后各记一次 FGC/FGCT，算差值。

    例：压测 10 分钟，FGC 从 20 涨到 120（增加 100 次），
        FGCT 从 3s 涨到 45s（增加 42s）
        → Full GC 占用了 42/600 = 7% 的时间，且频繁 STW

    结论：GC 是重要瓶颈。表现为 RT 出现规律的尖刺
         （每次 Full GC 期间所有线程停顿）。
    ```

#### 第二步：线程 dump 分析

GC 正常但 RT 高、TPS 上不去，通常是**线程都在等待**。

```bash
# 连续抓 3 次线程栈，间隔 5 秒（单次快照可能是巧合）
jstack <pid> > thread1.txt
sleep 5
jstack <pid> > thread2.txt
sleep 5
jstack <pid> > thread3.txt
```

**分析三个方向：**

**方向一：找死锁（jstack 会直接告诉你）**

```text
搜索关键词：Found one Java-level deadlock
jstack 输出的末尾通常会有：
  "Found 1 deadlock."
  "Thread-1" ... waiting to lock ...
  "Thread-2" ... waiting to lock ...
→ 这种就是死锁，必须修代码
```

**方向二：找"都在等同一个锁"**

```text
搜索关键词：BLOCKED
如果连续三次抓取，大量线程都处于 BLOCKED 且等待同一个锁地址
→ 说明存在锁竞争（synchronized 或 Lock 粒度过大）
→ 表现：并发上不去，但 CPU 不高
```

**方向三：找"都在等资源"（最常见）**

```text
搜索关键词：WAITING / TIMED_WAITING

如果是业务线程（非 GC、非 JMX 线程）大量处于：
  - waiting on condition  → 可能在等连接池、等下游接口
  - TIMED_WAITING (sleeping) → 可能在重试逻辑里 sleep
→ 说明瓶颈不在 CPU，而在等外部资源
```

!!! tip "判读线程栈的实用技巧"
    把线程名和堆栈的**前几层**拿出来归类统计：

    ```bash
    # 统计各状态线程数量（Linux/Mac）
    grep -c "java.lang.Thread.State: BLOCKED" thread1.txt
    grep -c "java.lang.Thread.State: WAITING" thread1.txt
    grep -c "java.lang.Thread.State: RUNNABLE" thread1.txt
    ```

    **RUNNABLE 很多且持续** → CPU 密集型，看算法
    **BLOCKED 很多** → 锁竞争
    **WAITING 很多** → 等资源（连接池/下游/IO）

#### 第三步：堆内存分析（怀疑内存泄漏时）

```bash
# 生成堆转储快照（文件可能很大，注意磁盘空间）
jmap -dump:live,format=b,file=heap.hprof <pid>

# 先看对象占用排名，快速定位大户
jmap -histo:live <pid> | head -20
```

`jmap -histo` 输出解读：

```text
 num     #instances         #bytes  class name
   1:       1250000      120000000  [C              ← char 数组，通常是字符串
   2:        300000       48000000  com.example.OrderDTO   ← 某个业务对象异常多
   3:        150000       24000000  java.util.HashMap$Node
```

!!! warning "怎么区分'正常多'和'内存泄漏'"
    ```
    关键：**间隔一段时间抓两次，看增量**

    正常：对象数量上下波动，会被 GC 回收
    泄漏：某个业务对象（如 OrderDTO）数量**只增不减**

    堆转储文件（.hprof）需要用工具打开分析：
      - MAT（Eclipse Memory Analyzer）— 免费，能自动分析泄漏嫌疑
      - JProfiler / VisualVM — 可视化好，VisualVM 免费
    重点关注"支配树（Dominator Tree）"和"最大的对象保留集"
    ```

### 14.10 用 Arthas 做在线诊断

Arthas 是阿里开源的 Java 诊断工具，**无需重启、无需改代码**就能在线看方法耗时，是压测定位最实用的工具。

```bash
# 启动（下载 arthas-boot.jar 后执行）
java -jar arthas-boot.jar
# 然后选择要诊断的 Java 进程编号
```

**压测中最常用的四条命令：**

```bash
# 1. dashboard —— 实时总览（线程、内存、GC）
dashboard
#   - 看线程各状态数量
#   - 看堆内存和 GC 情况
#   - 按 CPU 使用率排序的线程列表

# 2. thread —— 找出最忙的线程
thread -n 3              # 列出 CPU 占用最高的 3 个线程及其堆栈
thread -b                # 找出阻塞其他线程的"罪魁"（直接给结论）
thread --state BLOCKED   # 列出所有阻塞线程

# 3. trace —— 追踪一个方法的内部耗时分布（定位最耗时的那一步）
trace com.example.service.OrderService createOrder '#cost > 100'

# 4. profiler —— 生成火焰图，看 CPU 时间花在哪
profiler start
# ... 压测运行一段时间 ...
profiler stop --format html
```

!!! abstract "Arthas 最大的价值：把"接口慢"变成"哪一行慢""
    ```bash
    # 场景：createOrder 接口耗时 800ms，但不知道慢在哪
    trace com.example.service.OrderService createOrder

    输出会显示方法内部每个调用的耗时占比，例如：
      `---[72.5%]--- com.example.service.StockService:checkStock()
      `---[20.1%]--- com.example.service.PayService:prePay()
      `---[ 5.2%]--- com.example.service.OrderDao:insert()

    → 立刻定位：瓶颈在 checkStock，去查它的 SQL
    ```

    **这是"能定位"和"只能猜测"的分界线。** 面试时能讲出用 trace 定位到具体方法的经历，比背工具名有说服力得多。

### 14.11 中间件层定位

#### Redis

```bash
# 查看 Redis 慢查询（记录超过指定耗时的命令）
redis-cli config set slowlog-log-slower-than 10000   # 10ms 以上记录
redis-cli slowlog get 20                             # 取最近 20 条

# 实时监控命令（压测时看是否有异常高频命令）
redis-cli monitor

# 查看延迟统计
redis-cli --latency
redis-cli --latency-history

# 看基础状态（连接数、内存、命中率）
redis-cli info stats
redis-cli info memory
```

**重点关注：**

| 指标 | 说明 | 问题信号 |
|------|------|----------|
| 命中率 | `keyspace_hits / (hits + misses)` | 低命中率说明缓存没起作用 |
| 大 key | 单个 key 数据量过大 | 操作会阻塞（Redis 单线程） |
| 连接数 | `connected_clients` | 接近上限会拒绝连接 |
| 内存 | `used_memory` | 接近 maxmemory 会触发淘汰 |

!!! danger "Redis 最大的性能陷阱：大 key 与热 key"
    ```text
    大 key（BigKey）：
      - 一个 key 存了几十万条数据的 Hash / List
      - 读取时会阻塞 Redis（单线程模型）→ 其他请求全部排队
      - 排查：redis-cli --bigkeys

    热 key（HotKey）：
      - 某个 key 被极高频率访问（如首页商品列表）
      - 单个 Redis 实例的 CPU 打满
      - 排查：redis-cli monitor 观察，或看业务逻辑判断

    测试方法：压测时观察 Redis 的 CPU 和 `instantaneous_ops_per_sec`，
             如单个实例 QPS 异常高，怀疑热 key。
    ```

#### 消息队列（MQ）

```text
压测时关注：
1. 消息堆积量（Lag / Pending）——消费者处理不过来会持续增长
2. 生产速率 vs 消费速率 —— 消费速率 < 生产速率必然堆积
3. 消费者数量与分区数 —— 消费者多于分区数时，多出的消费者是空闲的

典型现象：
  接口 RT 高但 CPU/DB 都正常 → 可能是在等 MQ 的响应
  （同步调用 MQ 或等消费结果）
```

#### Nginx / 网关

```bash
# 查看 Nginx 请求与连接状态
tail -f /var/log/nginx/access.log     # 看请求量和耗时
nginx -T                              # 查看当前生效配置

# 关键配置项（瓶颈常在这里）
worker_connections      # 单 worker 最大连接数
worker_processes        # 通常设为 CPU 核数
keepalive_timeout       # 长连接保持时间
proxy_read_timeout      # 反向代理读超时（配置过小会大量 504）
```

!!! tip "Nginx 层的典型瓶颈"
    ```text
    现象：压测到一定并发后大量 502/504，但后端日志没有对应请求

    排查：
      - 502 → 后端不可达或崩溃，检查后端进程与端口
      - 504 → 超时，检查 proxy_read_timeout、后端 RT
      - 连接被拒 → worker_connections 达上限
              （计算公式：max_conn = worker_processes × worker_connections）
    ```

### 14.12 完整案例：一次"TPS 上不去"的排查全过程

把上面所有工具串起来，走一遍完整流程。

**现象：**

```text
压测目标：创建订单接口，目标 TPS ≥ 200
实际情况：并发从 50 加到 200，TPS 卡在 120 不再上升，
         RT 从 150ms 涨到 900ms，错误率 0.3%
```

**第 1 步：排除压测机问题**

```bash
# 在压测机上执行，确认压测机资源富余
top        # CPU 使用率 35%，正常
free -h    # 内存充足
```

结论：压测机不是瓶颈，继续查服务端。

**第 2 步：看是哪个接口慢**

```text
聚合报告显示：只有"创建订单"慢，商品查询、登录都正常（RT < 100ms）
→ 问题锁定在创建订单这个接口
```

**第 3 步：看 GC 是否正常**

```bash
jstat -gcutil <pid> 1000 10
```

```text
  S0     S1     E      O      M     CCS    YGC     YGCT    FGC    FGCT     GCT
  0.00  45.20  62.10  78.30  94.10  90.20   156    2.340     6    0.420    2.760
```

结论：老年代 78%、Full GC 只有 6 次，**GC 正常，不是瓶颈**。

**第 4 步：看线程都在干什么**

```bash
jstack <pid> | grep -c "java.lang.Thread.State: WAITING"
jstack <pid> | grep -A 5 "waiting on condition" | head -40
```

发现大量业务线程处于 `WAITING (parking)`，堆栈里有 `DruidDataSource.getConnection`。

结论：**线程在等数据库连接**。

**第 5 步：确认连接池配置**

```text
对比：并发 200 个线程 vs 连接池 maxActive = 20
→ 必然排队，这是直接原因
```

但**不能只改连接池**——要问"为什么连接不被及时归还"，否则加大池子只是把压力传递给数据库。

**第 6 步：查慢查询**

```sql
SHOW VARIABLES LIKE 'slow_query%';   -- 确认慢日志已开
```

```bash
mysqldumpslow -s t -t 10 /var/log/mysql/slow.log
```

```text
Count: 4821  Time=0.89s (4292s)  Lock=0.00s
SELECT * FROM orders WHERE user_id = 1 AND status = 0 ORDER BY created_at DESC
```

**第 7 步：EXPLAIN 定位**

```sql
EXPLAIN SELECT * FROM orders WHERE user_id = 1 AND status = 0 ORDER BY created_at DESC;
```

```text
type: ALL       ← 全表扫描
key: NULL       ← 没走索引
rows: 1250000   ← 扫描 125 万行
Extra: Using where; Using filesort
```

根因清晰：**`orders` 表没有合适的索引，每次创建订单前的"查重/查历史订单"都在全表扫描，单次 0.89 秒；并发下连接被长时间占用，连接池耗尽，其他线程排队等待。**

**第 8 步：验证优化效果**

```sql
-- 添加联合索引（user_id 在前，符合最左前缀；status 和 created_at 用于过滤排序）
ALTER TABLE orders ADD INDEX idx_user_status_created (user_id, status, created_at);
```

重新压测：

| 指标 | 优化前 | 优化后 |
|------|--------|--------|
| TPS | 120 | 340 |
| RT (P95) | 900ms | 180ms |
| 错误率 | 0.3% | 0% |
| 慢查询数 | 4821 | 3 |

**完整结论（可直接写进测试报告）：**

```text
瓶颈层：数据库层
根因：orders 表缺少 (user_id, status, created_at) 联合索引，
     导致创建订单前的订单查询全表扫描（扫描 125 万行，单次 0.89s）
传导链：慢查询 → 数据库连接长时间不释放 → 连接池（20）耗尽
       → 应用线程排队 → RT 上升、TPS 无法提升
优化：添加联合索引后，扫描行数从 125 万降至 12，
     TPS 从 120 提升至 340，P95 RT 从 900ms 降至 180ms
遗留风险：连接池 maxActive=20 相对 200 并发仍偏小，
         本次优化掩盖了该配置问题，建议评估调整并做持续观察
```

!!! abstract "这个案例的示范价值"
    注意排查顺序：**先排除压测机 → 锁定单接口 → 排除 GC → 看线程状态 → 定位到连接池 → 追到慢查询 → EXPLAIN 找根因 → 加索引验证**。

    每一步都用数据说话，每一步都排除一个可能。**这才是"性能瓶颈分析"，而不是"看到 CPU 高就说 CPU 是瓶颈"。**

    另外注意最后一条"遗留风险"——主动指出优化掩盖了配置问题。这种判断力是性能测试工程师和"只会跑压测的人"的区别。

### 14.13 瓶颈定位工具速查

| 层 | 工具/命令 | 主要用途 |
|----|-----------|----------|
| 压测机 | `top`、`free -h` | 排除压力机自身瓶颈 |
| 应用 | Arthas `trace` | 定位方法内部哪一步最耗时 |
| 应用 | Arthas `thread -n 3` / `thread -b` | 找最忙线程 / 找阻塞源 |
| 应用 | `jstack` | 线程 dump，看死锁与等待 |
| JVM | `jstat -gcutil` | GC 频率与耗时 |
| JVM | `jmap -histo` / `-dump` | 对象占用排名 / 堆转储 |
| JVM | MAT、VisualVM | 分析堆转储找内存泄漏 |
| 数据库 | `mysqldumpslow`、`pt-query-digest` | 找 TOP 慢查询 |
| 数据库 | `EXPLAIN` | 执行计划，判断是否走索引 |
| 数据库 | `SHOW PROCESSLIST` | 当前查询与锁等待 |
| 数据库 | `SHOW ENGINE INNODB STATUS` | 锁与事务详情 |
| 数据库 | `SHOW STATUS LIKE 'Threads_connected'` | 连接数使用 |
| 缓存 | `redis-cli slowlog get` | Redis 慢查询 |
| 缓存 | `redis-cli --bigkeys` | 大 key 排查 |
| 缓存 | `redis-cli --latency` | 延迟统计 |
| 系统 | `nmon` | 一站式监控 CPU/内存/磁盘/网络 |
| 系统 | `iostat -x 1` | 磁盘 IO 利用率 |
| 系统 | `sar -n DEV 1` | 网络吞吐 |
| 系统 | `netstat` / `ss` | 连接数与端口占用 |
| 网关 | Nginx `access.log`、`proxy_read_timeout` | 502/504 排查 |

---

## 十五、常见问题排查

### 15.1 OutOfMemoryError

JMeter 自身内存不够：

修改 `bin/jmeter.bat`（Windows）或 `bin/jmeter`（Linux/Mac）：

```bash
HEAP="-Xms1g -Xmx4g"     # 改大
```

### 15.2 GUI 模式压测变形

GUI 占用资源大，导致结果不准。**正式压测必须用命令行**。

### 15.3 监听器影响性能

正式压测关闭：

- View Results Tree
- View Results in Table
- Graph Results

只保留 Summary Report 或 Backend Listener。

### 15.4 CSV 数据用完

```
报错：CSV exhausted...
```

设置 `Recycle on EOF? = True` 或准备足够数据。

### 15.5 SSL 握手失败

HTTPS 接口：

```
Add → Config → HTTP Request Defaults
Implementation: Java
```

或忽略证书：在 `bin/jmeter.properties`：

```properties
https.use.cached.ssl.context=false
```

### 15.6 压力机本身成瓶颈

**判断：**

- 看 JMeter 机器 CPU、内存、网络
- 看请求是否真的发出去了（用抓包工具）

**优化：**

- 减少线程数
- 增加压力机（分布式）
- 关掉 GUI 模式

### 15.7 结果不稳定

**排查：**

- 测试环境是否被其他人占用
- 网络是否有波动
- 数据库是否预热（首次跑慢）
- GC 是否影响
- 多次跑取均值

### 15.8 中文乱码

请求 Body 中文乱码：HTTP Request 的 Content encoding 填 `UTF-8`。

响应中文乱码：在 `bin/jmeter.properties`：

```properties
sampleresult.default.encoding=UTF-8
```

---

## 十六、最佳实践

### 16.1 性能测试流程

```
1. 需求分析（明确目标）
2. 环境准备（独立环境、监控）
3. 脚本设计（参数化、关联）
4. 脚本调试（少量并发先跑通）
5. 基准测试（单用户基线）
6. 正式压测（按计划加压）
7. 监控分析（服务器+应用+数据库）
8. 报告输出（结果+瓶颈+建议）
9. 性能调优（开发协作）
10. 回归验证
```

### 16.2 测试脚本规范

- 用 HTTP Request Defaults 减少重复
- 用 Header Manager 统一 Header
- 数据参数化（不硬编码）
- 添加合理断言（不能只看请求成功）
- 思考用 Constant Throughput Timer 控制 TPS

### 16.3 压测纪律

- ⚠️ **禁止在生产环境直接压测**（除非授权且做好预案）
- ⚠️ **提前通知相关团队**（运维、开发）
- ⚠️ **准备熔断方案**（中止条件、应急联系人）
- ⚠️ **测试数据隔离**（不影响业务数据）
- ⚠️ **报告必须含瓶颈分析**（光给数据不解读 = 无价值）

### 16.4 性能测试报告模板

```markdown
# 登录接口性能测试报告

## 1. 测试目的
验证登录接口在 500 并发下 RT、TPS 是否满足业务要求。

## 2. 测试环境
- 应用服务器：4C8G * 2 台
- 数据库：MySQL 8.0，4C16G
- JMeter：5.6.3
- 压力机：4C8G * 2

## 3. 测试场景
- 接口：POST /api/login
- 并发：500
- Ramp-up：60s
- 持续时间：10 分钟
- 测试数据：500 个真实账号

## 4. 测试结果
| 指标 | 实际 | 期望 | 是否达标 |
|------|------|------|---------|
| 平均 RT | 280ms | <500ms | ✓ |
| 95% RT | 450ms | <800ms | ✓ |
| TPS | 1620 | >1500 | ✓ |
| 错误率 | 0.05% | <0.5% | ✓ |

## 5. 资源监控
- CPU：65%（应用），50%（DB）
- 内存：72%（应用），60%（DB）
- 磁盘 IO：%util 35%
- 数据库连接池：80/100 使用

## 6. 瓶颈分析
- 数据库连接池接近上限，建议扩容到 200
- 应用 GC 频率偏高，建议调整 JVM 参数

## 7. 结论与建议
满足业务要求。建议下次发布前回归一次。

## 8. 附件
- jmx 脚本
- jtl 结果
- HTML 报告
- 服务器监控截图
```

---

## 附录：推荐学习资源

- 官方文档：`https://jmeter.apache.org/usermanual/`
- JMeter 插件：`https://jmeter-plugins.org/`
- B 站搜"JMeter 实战"教程
- 书籍：《全栈性能测试修炼宝典：JMeter 实战》

---

!!! info "测试纪律"
    性能测试是高风险测试，必须在独立测试环境进行，禁止未授权对生产系统压测。压测前通知运维、开发，准备应急预案。测试后及时清理数据，恢复环境。

### 推荐下一步

## 十三、分布式压测

### 13.1 为什么需要分布式

单台机器压测存在瓶颈：

| 瓶颈 | 表现 | 解决方案 |
|------|------|----------|
| CPU 不足 | JMeter 本身 CPU 占满，生成不了更多线程 | 多台 Slave 分摊 |
| 内存不足 | 大量线程导致 OOM | 分布式后每台机器线程数减少 |
| 网络带宽 | 单机网卡打满 | 多 Slave 分散网络流量 |
| 单 IP 限制 | 服务器对单 IP 限流 | 多 Slave 不同 IP |

### 13.2 JMeter 分布式架构

```text
┌─────────────────┐
│   Master (控制)  │  ← 发送测试计划、收集结果
│   jmeter -n -r  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│Slave 1│ │Slave 2│  ← 执行压测，发送请求
│100线程│ │100线程│
└───────┘ └───────┘
```

```text
Master：负责发送测试计划、汇总结果、生成报告。
Slave：负责执行测试、向目标服务器发请求。
目标服务器：被测系统。
```

### 13.3 分布式配置步骤

**Step 1：所有机器安装相同版本 JMeter**

```bash
# 确认版本一致
jmeter --version
```

**Step 2：配置 Slave 节点**

```bash
# 编辑 Slave 的 jmeter.properties
# 修改以下配置：

# 监听端口（默认 1099）
server.rmi.ssl.disable=true    # 关闭 SSL（测试环境）
server_port=1099
```

```bash
# 启动 Slave
jmeter-server
# 输出：Created remote object: UnicastServerRef2 [stub: ...]
```

**Step 3：配置 Master 节点**

```bash
# 编辑 Master 的 jmeter.properties
# 添加 Slave IP 列表
remote_hosts=192.168.1.101,192.168.1.102,192.168.1.103
server.rmi.ssl.disable=true
```

**Step 4：Master 发起分布式压测**

```bash
# 远程启动所有 Slave（-r = --remotestart）
jmeter -n -t test.jmx -r -l result.jtl -e -o report

# 远程启动指定 Slave（逗号分隔）
jmeter -n -t test.jmx -R 192.168.1.101,192.168.1.102 -l result.jtl
```

### 13.4 注意事项

| 事项 | 说明 |
|------|------|
| 防火墙 | 确保 Master 能访问 Slave 的 1099 端口 |
| 时间同步 | 所有机器做 NTP 时间同步（`ntpdate`），否则时间戳混乱 |
| 数据隔离 | 使用 `__machineName` 函数区分不同 Slave 的数据 |
| CSV 参数化 | 每台 Slave 需要独立的 CSV 文件，不能共享 |
| 结果收集 | `-l result.jtl` 只收集 Master 端，Slave 端需单独配置 |
| 网络 | Slave 和目标服务器最好在同一内网 |

---

## 十四、压测报告分析

### 14.1 聚合报告关键指标

| 指标 | 含义 | 健康标准 |
|------|------|----------|
| **Samples** | 总请求数 | — |
| **Average** | 平均响应时间 | < 500ms（接口） |
| **Median (P50)** | 50% 请求的响应时间 | < 300ms |
| **P95** | 95% 请求的响应时间 | < 1s |
| **P99** | 99% 请求的响应时间 | < 2s |
| **Min / Max** | 最小 / 最大响应时间 | Max 不应是 Average 的 10 倍+ |
| **Error %** | 错误率 | < 0.1% |
| **Throughput** | TPS（每秒事务数） | 达到目标 TPS |

### 14.2 性能拐点识别

```text
压测加压过程：

并发数 ↑  →  TPS ↑  →  RT ↑
                ↓
        达到拐点后：
并发数 ↑  →  TPS 不变或下降  →  RT 急剧上升  →  错误率飙升

拐点 = 最佳并发数（系统最大承载能力）
```

```text
拐点识别方法：
1. 逐步增加并发（如 50→100→150→200→250）
2. 观察 TPS 和 RT 的变化趋势
3. 当 RT 增长率 > TPS 增长率时，就是拐点
```

### 14.3 瓶颈定位思路

| 现象 | 可能原因 | 排查方向 |
|------|----------|----------|
| CPU 高 | 死循环、大量计算、GC 频繁 | `top`、`jstack`、GC 日志 |
| 内存高 | 内存泄漏、缓存未清理 | `jmap`、堆分析 |
| IO 高 | 慢 SQL、大量读写 | `iostat`、慢查询日志 |
| 网络高 | 大响应体、带宽不足 | `iftop`、抓包 |
| 连接数高 | 连接池泄漏、未释放 | `ss`、连接池监控 |
| TPS 低但 CPU/IO 正常 | 锁竞争、线程阻塞 | `jstack` 分析线程状态 |

### 14.4 压测报告模板

```markdown
## 性能测试报告

### 测试概要
- 测试日期：2026-06-22
- 测试环境：UAT 环境，4C8G × 3 台
- 测试工具：JMeter 5.6.3 + 分布式（3 Slave）
- 测试时长：30 分钟

### 测试场景
| 场景 | 并发数 | 持续时间 | 目标 TPS |
|------|--------|----------|----------|
| 基准测试 | 50 | 5min | ≥100 |
| 负载测试 | 200 | 30min | ≥500 |
| 压力测试 | 500 | 10min | 观察拐点 |

### 测试结果
| 接口 | 目标 TPS | 实际 TPS | P95 | 错误率 | 是否达标 |
|------|----------|----------|-----|--------|----------|
| /api/login | 500 | 620 | 180ms | 0.01% | ✅ |
| /api/order | 300 | 280 | 850ms | 0.05% | ❌ |

### 瓶颈分析
- 订单接口 TPS 未达标，瓶颈在数据库慢查询
- 慢 SQL：`SELECT * FROM orders WHERE user_id=? ORDER BY create_time`
- 建议：添加索引 `(user_id, create_time)`

### 风险与建议
- 当前系统承载 500 并发，大促预计 1000 并发，需扩容
- 建议添加 Redis 缓存热点商品数据
```

---

## 十五、全链路压测概念

### 15.1 什么是全链路压测

```text
单接口压测：只测一个接口（如登录接口）
全链路压测：模拟真实用户行为链路（浏览→加购→下单→支付）

区别：
- 单接口压测无法发现跨服务瓶颈（如数据库连接池被下游服务打满）
- 全链路压测能看到整个系统的实际承载能力
```

### 15.2 流量录制与回放

```text
GoReplay 流量录制原理：

生产环境流量 → GoReplay 录制 → 流量文件 → 测试环境回放（可放大 N 倍）
```

```bash
# GoReplay 录制
sudo gor --input-raw :8080 --output-file requests.gor

# 流量回放（2 倍速）
gor --input-file requests.gor --output-http "http://test-server:8080" --stats --multiplier 2
```

### 15.3 压测数据隔离

```text
核心问题：压测数据不能污染真实数据。

方案：
1. 影子库：压测数据写入独立的"影子库"，不影响真实库
2. 影子表：同一库中，压测数据写入带 _shadow 后缀的表
3. 流量标记：压测请求带特殊 Header（如 X-Test-Flag: true）
4. 中间件拦截：根据标记将压测流量路由到影子库
```

```text
流量标记示例（JMeter HTTP Header Manager）：
X-Test-Flag: true
X-Test-Timestamp: ${__time(,)}
```

### 15.4 压测环境管理

| 事项 | 建议 |
|------|------|
| 环境隔离 | 压测环境独立于开发/测试环境 |
| 数据准备 | 提前准备足量测试数据（10 万+用户、100 万+订单） |
| 监控就绪 | 压测前确认 Grafana/监控大盘正常 |
| 通知机制 | 压测前通知运维、DBA、开发 |
| 回滚方案 | 准备紧急停止脚本和数据清理脚本 |

---

## 十六、性能基准管理

### 16.1 性能基线建立

```text
每次版本发布前，对核心接口跑一次基准测试，记录基线数据。

基线数据：
- 接口：/api/login
- TPS 基线：620
- P95 基线：180ms
- 错误率基线：0.01%
```

### 16.2 版本间性能对比

```text
对比方法：
1. 用相同测试脚本、相同并发数、相同环境
2. 分别跑旧版本和新版本
3. 对比 TPS、P95、错误率

性能退化判定：
- TPS 下降 > 10% → 性能退化，需排查
- P95 上升 > 20% → 性能退化，需排查
- 错误率上升 > 0.1% → 需排查
```

### 16.3 CI/CD 中集成性能基准

```yaml
# GitLab CI 示例
performance-baseline:
  stage: test
  script:
    - jmeter -n -t test.jmx -l result.jtl -e -o report
    - python check_performance.py --baseline baseline.json --result result.jtl
  artifacts:
    paths:
      - report/
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

```python
# check_performance.py 简化版
import json, sys

with open("baseline.json") as f:
    baseline = json.load(f)

# 解析 result.jtl，对比 baseline
# 如果 TPS 下降 > 10% 或 P95 上升 > 20%，exit 1 失败
current_tps = parse_tps("result.jtl")
if current_tps < baseline["tps"] * 0.9:
    print(f"❌ TPS 退化：{current_tps} < {baseline['tps'] * 0.9}")
    sys.exit(1)

print("✅ 性能基线达标")
```

### 16.4 性能退化告警

```text
在 CI/CD 中设置性能门禁：

绿灯（通过）：TPS ≥ 基线 × 90%，P95 ≤ 基线 × 120%
黄灯（警告）：TPS 在基线 80%-90%，或 P95 超基线 120%-150%
红灯（失败）：TPS < 基线 × 80%，或 P95 > 基线 × 150%

黄灯：允许合并但标记风险
红灯：阻止合并，必须修复
```

根据你的学习进度，选择下一步：

---

## 动手任务：判断「商品详情接口」在 200 并发下是否达标，并定位瓶颈层

> 这是本教程的收尾练习。请**独立完成**，不要先看参考答案。目标不是"把工具跑起来"，而是**用数据得出结论**。

### 任务背景

版本上线前，产品给出的性能要求是：商品详情接口在 **200 并发**下 **P95 < 500ms、错误率 < 0.1%、TPS ≥ 2000**。
开发已经自己跑过一次，说"TPS 有 2100 多，肯定没问题"。你要做的是：**自己跑一遍、把指标拆开看**，判断这个"没问题"是否成立，并说清瓶颈落在哪一层。

### 任务准备

**被测接口：** `POST /api/product/detail`（Body：`{"productId": 10001}`）。压测必须在独立测试环境进行，禁止对生产环境压测。

**性能目标（写进报告，用来判定达标）：**

| 指标 | 目标 |
|------|------|
| P95 | < 500ms |
| 错误率 | < 0.1% |
| TPS | ≥ 2000 |
| 并发 | 200 线程，持续 5 分钟 |

**JMeter 脚本结构（`product_detail.jmx`）：**

```text
Test Plan
├── HTTP Request Defaults（Protocol=https，Server=api-uat.example.com，Port=443）
├── HTTP Header Manager（Content-Type: application/json，Authorization: Bearer ${token}）
├── setUp Thread Group（1 线程：调登录接口，JSON Extractor 提取 $.data.token → token）
├── Thread Group（200 线程，Ramp-up 5s，勾选 Scheduler + Duration 305s，Loop Count = Forever）
│   ├── HTTP Request：POST /api/product/detail
│   │   ├── Body Data：{"productId": ${__Random(10001,12000)}}
│   │   └── JSON Assertion：Assert JSON Path = $.code，Expected Value = 0
│   └── Constant Throughput Timer（本轮不加，先测系统真实上限）
└── Listeners
    ├── Aggregate Report（聚合报告，正式压测只留这个）
    └── Backend Listener（InfluxDB，用于压测过程中实时看曲线）
```

关键配置与理由：

| 元件 / 参数 | 配置 | 为什么这么配 |
|-------------|------|--------------|
| Number of Threads | 200 | 对应需求里的 200 并发 |
| Ramp-up period | 5 秒 | 快速到量，减少加压过程对结果的干扰 |
| Scheduler + Duration | 勾选，305 秒 | Loop Count 设为 Forever 时才会按 Duration 停止 |
| JSON Assertion | `$.code` 等于 `0` | 只看 HTTP 200 会漏掉业务失败 |
| Constant Throughput Timer | 本轮不加 | 先测系统真实承载，限流是后一步的事 |
| 监听器 | 只保留 Aggregate Report | View Results Tree、Graph Results 开销大，会污染压测结果 |

**执行命令（正式压测必须走命令行）：**

```bash
jmeter -n -t product_detail.jmx -l result/product_detail.jtl -e -o report/product_detail
```

- `-n` 非 GUI 模式，`-t` 脚本，`-l` 结果文件（jtl），`-e` 测试结束后生成 HTML 报告，`-o` 报告输出目录。
- `-o` 指定的目录**必须为空**，否则 JMeter 直接报错退出（最常见的踩坑点）。
- 想从命令行改并发，可把脚本里写成 `${__P(threads,200)}`，再用 `-Jthreads=200` 传入。

**任务数据：** 完整 `result.jtl` 共 652,000 行，无法贴出。下面是截取自真实结果的**原始片段**，用来确认字段格式（`timeStamp` 为毫秒时间戳，对应 2026-09-14 10:00:00 +08:00 起算）：

```text
timeStamp,elapsed,label,responseCode,responseMessage,threadName,dataType,success,failureMessage,bytes,sentBytes,grpThreads,allThreads,Latency,IdleTime,Connect
1789351201040,32,商品详情,200,OK,线程组 1-7,text,true,,1180,412,200,200,30,0,31
1789351201310,38,商品详情,200,OK,线程组 1-26,text,true,,1180,412,200,200,35,0,31
1789351201880,41,商品详情,200,OK,线程组 1-58,text,true,,1180,412,200,200,38,0,31
1789351202420,35,商品详情,200,OK,线程组 1-91,text,true,,1180,412,200,200,33,0,31
1789351203050,44,商品详情,200,OK,线程组 1-137,text,true,,1180,412,200,200,40,0,31
1789351203770,36,商品详情,200,OK,线程组 1-164,text,true,,1180,412,200,200,34,0,31
1789351450120,336,商品详情,200,OK,线程组 1-12,text,false,Test failed: code expected to equal /0/,1180,412,200,200,318,0,31
1789351455600,412,商品详情,200,OK,线程组 1-44,text,false,Test failed: code expected to equal /0/,1180,412,200,200,395,0,31
1789351462350,780,商品详情,200,OK,线程组 1-73,text,false,Test failed: code expected to equal /0/,1180,412,200,200,742,0,31
1789351468900,508,商品详情,200,OK,线程组 1-106,text,false,Test failed: code expected to equal /0/,1180,412,200,200,486,0,31
1789351475440,906,商品详情,200,OK,线程组 1-151,text,false,Test failed: code expected to equal /0/,1180,412,200,200,861,0,31
1789351489710,1180,商品详情,200,OK,线程组 1-188,text,false,Test failed: code expected to equal /0/,1180,412,200,200,1124,0,31
1789351501200,1520,商品详情,500,Internal Server Error,线程组 1-23,text,false,Test failed: code expected to equal /0/,240,412,200,200,1497,0,31
1789351502850,2104,商品详情,500,Internal Server Error,线程组 1-61,text,false,Test failed: code expected to equal /0/,240,412,200,200,2076,0,31
1789351504100,2680,商品详情,500,Internal Server Error,线程组 1-120,text,false,Test failed: code expected to equal /0/,240,412,200,200,2641,0,31
1789351504900,1980,商品详情,500,Internal Server Error,线程组 1-199,text,false,Test failed: code expected to equal /0/,240,412,200,200,1952,0,31
```

> 注意看最后 8 行：前 6 行 `responseCode=200` 但 `success=false`，是 JSON 断言失败（业务返回了非 0 的 `code`）；最后 2 行才是真正的 HTTP 500。它们的 `failureMessage` 长得几乎一样（都来自同一条 JSON 断言），只有 `responseCode` 能区分——这正是"错误率里必须拆错误类型"的原因。

### 任务要求

请依次完成，并**保留每个数据与截图**：

1. **跑出基准数据**：先用 1 线程跑 1 分钟，记录 Average、P95、TPS、错误率，作为单用户基线；再按上面的参数跑正式的 200 并发压测，用 `-e -o` 生成 HTML 报告，整理成"基准 vs 正式"对比表。
2. **从数据里发现异常**：不要只看全局数字。写一段脚本（awk、Python 或 JMeter 的 Backend Listener 导出都行）把 jtl 按 **每 60 秒一个区间** 分桶，统计每个区间的请求数、TPS、平均 RT、错误数、错误率，找出**错误率从哪一个区间开始失控**，并说明对应的时间点。
3. **判断瓶颈在哪一层**：结合下面的服务器监控数据，判断瓶颈在 压力机 / 应用服务器 / 数据库 / 网络 中的哪一层，并用**至少一条数据**排除掉压力机自身成为瓶颈的可能。
4. **给出可复用的产出**：写一份 3-5 句的结论（是否达标、瓶颈在哪、建议怎么改），并给出**下一步的验证方案**——改完之后用什么脚本、什么参数、看哪个指标来证明它真的改好了。

**服务器监控数据（压测期间，由运维同时采集）：**

| 监控项 | 数值 | 判断 |
|--------|------|------|
| 压力机 CPU | 38% | 正常，压力机没打满 |
| 压力机网络出口带宽 | 62 Mbps / 1 Gbps | 正常 |
| 应用服务器 CPU（2 台均值） | 62% | 正常 |
| 应用服务器内存 | 71% | 正常 |
| 应用服务器 GC 次数 | 平均 2 次/分钟 | 正常，无明显 GC 压力 |
| 数据库 CPU | 78% | 偏高 |
| 数据库连接池使用 | 92 / 100 | 接近上限 |
| 数据库慢查询（> 1s） | 1,240 条 | 异常 |
| 数据库磁盘 %util | 41% | 正常，不是磁盘打满 |

### 提交物

| 产出 | 要求 |
|------|------|
| 基准数据 | 1 线程 / 60 秒的聚合报告截图（Average、P95、TPS、错误率） |
| 正式压测报告 | `report/product_detail/index.html` 的 Statistics 页截图，以及聚合报告全字段贴图 |
| 分桶统计 | 每 60 秒一行的表格（区间、请求数、TPS、平均 RT、错误数、错误率）+ 生成它的脚本 |
| 瓶颈判断 | 一张表：监控项 → 数值 → 指向哪一层，并写明排除压力机瓶颈的依据 |
| 结论 | 用 3-5 句话说明：是否达标、瓶颈在哪、建议怎么改、下一步怎么验证 |

### 在线自测：指标计算那一关

性能结论能不能站住，先看数字算得对不对。下面用压测报告里的真实数据（Samples 652,000、时长 305 秒、错误数 782、P95 380ms），让你实现一个指标换算函数。点「运行并判分」会自动检查。

<div class="code-lab" data-lab-id="perf-metrics"></div>

<script type="application/json" class="code-lab-spec">
{
  "title": "从压测报告算出结论所需的派生指标",
  "prelude": "DATA = {\n    'total_requests': 652000,\n    'duration_sec': 305,\n    'error_count': 782,\n    'p50': 85,\n    'p90': 260,\n    'p95': 380,\n    'p99': 600,\n    'maximum': 2680,\n}",
  "starterCode": "# DATA 已提供，就是压测报告里的真实数字\n\ndef analyze(metrics):\n    \"\"\"根据压测指标计算派生结果，返回 dict：\n\n      tps           —— 吞吐量（每秒请求数，保留 2 位小数）\n      error_rate    —— 错误率（百分数，保留 2 位小数）\n      success_count —— 成功请求数\n      p95_ok        —— P95 是否达标（阈值 500ms，返回 bool）\n\n    注意：错误率要转成百分数；p95_ok 要真按阈值判断，\n    不能对当前这条数据写死。\n    \"\"\"\n    # TODO: 在这里实现\n    pass\n",
  "tests": [
    {
      "name": "TPS 计算正确（总数 ÷ 时长）",
      "code": "r = analyze(DATA)\nassert r['tps'] == 2137.70, f'TPS 应为 2137.70（652000/305），实际 {r[\"tps\"]}'",
      "hint": "total_requests / duration_sec，round(x, 2)"
    },
    {
      "name": "错误率按百分数计算且保留 2 位",
      "code": "r = analyze(DATA)\nassert r['error_rate'] == 0.12, f'错误率应为 0.12（782/652000×100），实际 {r[\"error_rate\"]}'",
      "hint": "别忘了 ×100；写成 0.0012 说明算的是小数不是百分数"
    },
    {
      "name": "成功数 = 总数 − 错误数",
      "code": "r = analyze(DATA)\nassert r['success_count'] == 651218, f'成功数应为 651218，实际 {r[\"success_count\"]}'",
      "hint": "652000 − 782"
    },
    {
      "name": "P95 达标判断（阈值 500ms）",
      "code": "r = analyze(DATA)\nassert r['p95_ok'] is True, '本例 P95=380ms，应判定为达标'",
      "hint": "p95 <= 500 返回 True"
    },
    {
      "name": "换一组数据仍能正确判断不达标",
      "code": "r = analyze({'total_requests':100,'duration_sec':10,'error_count':0,'p50':1,'p90':1,'p95':900,'p99':1,'maximum':1})\nassert r['p95_ok'] is False, 'P95=900ms 应判定为不达标'",
      "hint": "这条是防作弊的：写死 True 会在这里失败"
    }
  ]
}
</script>

!!! tip "为什么单独练这一步"
    性能测试最容易出的问题不是脚本写错，而是**把数字读错、把结论下反**。例如把错误率 0.12% 当成 0.0012、或者只看 TPS 达标就宣布通过——本题第 5 条断言就是专门用来防止「对当前数据写死答案」的。

### 完成标准

- [ ] 能独立写出可命令行执行的压测脚本，正确使用 `-n -t -l -e -o`，并知道 `-o` 目录必须为空
- [ ] 能生成 HTML 报告，并读懂 Statistics 页里的 Samples、Average、P95、Error %、Throughput
- [ ] 结论有具体数字支撑（P95 / TPS / 错误率），不是"感觉有点慢"
- [ ] **能指出"TPS 达标但错误率不达标"这种结论**，而不是用一个"TPS 合格"掩盖整体不达标
- [ ] 瓶颈判断给出了排除性证据（例如用压力机 CPU 与带宽数据排除压力机瓶颈）
- [ ] 产出的结论与验证方案可直接复用：换成任意接口，套同一套流程就能得出可判定结论

??? tip "参考答案与思路（先自己做完再看）"

    **第 1 题：基准数据与正式压测对比**

    基准测试（1 线程 / 60 秒）聚合报告：

    | Label | # Samples | Average | P95 | Error % | Throughput |
    |-------|-----------|---------|-----|---------|------------|
    | 商品详情 | 1,300 | 46ms | 62ms | 0.00% | 21.7/sec |

    正式压测（200 线程 / Ramp-up 5s / Duration 305s）聚合报告：

    | 指标 | 值 | 目标 | 是否达标 |
    |------|-----|------|----------|
    | # Samples | 652,000 | — | — |
    | Average | 138ms | — | — |
    | Median (P50) | 85ms | — | — |
    | 90% Line | 260ms | — | — |
    | 95% Line | 380ms | < 500ms | ✅ |
    | 99% Line | 600ms | — | — |
    | Min | 12ms | — | — |
    | Max | 2,680ms | — | — |
    | Error % | 0.12% | < 0.1% | ❌ |
    | Throughput | 2,137.7/sec | ≥ 2,000 | ✅ |

    对比结论：并发从 1 提到 200 后，Average 从 46ms 涨到 138ms（约 3 倍），P95 从 62ms 涨到 380ms（约 6 倍），说明**响应时间随并发非线性恶化**，系统已经不在舒适区。

    三个数字怎么核对（这一步必须自己做一遍，否则可能拿到的是假数据）：

    ```text
    ① 总请求数 = 全程 Throughput × 时长
       2,137.7 × 305s ≈ 652,000（与 # Samples 一致，说明没有丢样本）

    ② 错误数 = 总请求数 × 错误率
       652,000 × 0.12% = 782.4 → 782 条失败

    ③ 百分位必须单调：P50(85) ≤ P90(260) ≤ P95(380) ≤ P99(600) ≤ Max(2,680) ✅
       且 Average(138) 大于 P50(85)，说明分布右偏——典型的长尾，不能用平均值讲故事
    ```

    **第 2 题：按 60 秒分桶找出失控点**

    分桶脚本（对 jtl 的 `timeStamp` 与 `elapsed` 字段做聚合）：

    ```bash
    # 第 1 列=timeStamp(ms)，第 2 列=elapsed(ms)，第 8 列=success
    # 以首个请求时间为基准，每 60 秒一个桶
    awk -F, 'NR>1{
        if(base=="") base=$1
        b=int(($1-base)/60000)
        n[b]++; sum[b]+=$2; if($2>max[b]) max[b]=$2
        if($8=="false") e[b]++
    }
    END{
        for(i in n)
            printf "%d-%ds  请求=%d  平均RT=%.0fms  Max=%.0fms  错误=%d  错误率=%.3f%%
",
                   i*60, (i+1)*60, n[i], sum[i]/n[i], max[i], e[i], e[i]*100/n[i]
    }' result/product_detail.jtl | sort -t- -k1 -n
    ```

    分桶结果：

    | 区间 | 请求数 | TPS | 平均 RT | 错误数 | 错误率 | 主要错误类型 |
    |------|--------|-----|---------|--------|--------|--------------|
    | 0–60s | 128,262 | 2,137.7 | 84ms | 8 | 0.006% | JSON 断言失败 |
    | 60–120s | 128,262 | 2,137.7 | 86ms | 21 | 0.016% | JSON 断言失败 |
    | 120–180s | 128,262 | 2,137.7 | 90ms | 47 | 0.037% | JSON 断言失败 |
    | 180–240s | 128,262 | 2,137.7 | 112ms | 106 | 0.083% | JSON 断言失败 |
    | 240–300s | 128,262 | 2,137.7 | 235ms | 300 | 0.234% | HTTP 500 |
    | 300–305s | 10,690 | 2,138.0 | 1,150ms | 300 | 2.81% | HTTP 500 |

    分桶数字的自洽性验算：

    ```text
    ① 请求数合计：128,262 × 5 + 10,690 = 652,000 ✅ 与总 # Samples 一致
    ② 错误数合计：8 + 21 + 47 + 106 + 300 + 300 = 782 ✅ 与 0.12% × 652,000 一致
    ③ 错误类型拆分：前 4 桶 8+21+47+106 = 182 条全部是 JSON 断言失败；
       后 2 桶 300+300 = 600 条全部是 HTTP 500。182 + 600 = 782 ✅
    ④ 平均 RT 的加权平均：
       (84+86+90+112+235)×128,262 + 1,150×10,690
       = 90,148,534 ÷ 652,000 = 138.3ms ≈ 全局 Average 138ms ✅
    ```

    关键发现：**错误率在 180–240 秒区间开始抬头（0.083%），在 240 秒之后失控（0.234% → 2.81%）**，并且**错误类型从"业务断言失败"切换成了"HTTP 500"**。这是典型的资源耗尽过程：先是数据库变慢导致部分请求业务降级，随后连接被占满、连接池打满，接口直接抛 500。

    注意一个反直觉现象：**最后两个区间的 TPS 几乎没降（2,137.7 → 2,138.0）**。因为失败的请求返回得很快，把吞吐量"撑"住了。如果只看 TPS，会得出"性能没问题"的错误结论——**这就是本题要考的点**。

    **第 3 题：瓶颈定位**

    | 监控项 | 数值 | 指向 |
    |--------|------|------|
    | 压力机 CPU | 38% | 排除压力机 |
    | 压力机出口带宽 | 62 Mbps / 1 Gbps | 排除压力机 |
    | 应用 CPU / 内存 / GC | 62% / 71% / 2 次每分钟 | 应用层无明显瓶颈 |
    | 磁盘 %util | 41% | 排除磁盘 IO 打满 |
    | 数据库连接池 | 92 / 100 | ⚠️ 接近上限，是主瓶颈 |
    | 数据库慢查询 | 1,240 条（> 1s） | ⚠️ 是错误率上升的直接来源 |
    | 数据库 CPU | 78% | 偏高，是慢查询的后果 |

    判定：**瓶颈在数据库层**——慢查询把连接占用时间拉长，连接池（100）被耗尽，后续请求拿不到连接直接 500。

    如何排除"压力机自身是瓶颈"（JMeter 自身成为瓶颈时的典型表现是：并发加不上去、TPS 被压住、RT 却不涨）。本题的证据是：

    ```text
    ① 压力机 CPU 只有 38%，远未打满（JMeter 是 CPU 密集型，瓶颈时通常 > 90%）
    ② 压力机出口带宽 62/1000 Mbps，不存在网络出口瓶颈
    ③ 实测 TPS 2,137.7 与"压力机稳态理论上限"接近：
       稳态段 RT ≈ 88ms（前 3 个桶），200 / 0.088 ≈ 2,273 TPS
       2,137.7 ÷ 2,273 = 94%，差值来自 Ramp-up 的 5 秒和迭代内提取器/断言开销
       → 压力机把 200 并发完整地发了出来，不是它拖住了系统
    ```

    > 坑点提醒：**不要拿全局 Average 138ms 去套 `TPS = 并发 / RT`**。全局 Average 已经被最后 65 秒的恶化数据拉高了，代进去会算出 200 / 0.138 ≈ 1,449 TPS，比实测值还低，得出"不可能"的结论。这个公式只在**同一稳定区间**内才有意义——这正是"指标必须分段看"的原因。

    可选的加强实验：给接口请求加一个 `Duration Assertion = 3000ms`，重新跑一次。因为本次 Max 只有 2,680ms，这个断言不会新增失败，可以确认"没有请求卡到 3 秒以上"；但它对你定位 500 没有任何帮助——说明**断言要和排查目标对齐，不是加得越多越好**。

    **第 4 题：结论与验证方案**

    结论（可直接放进报告）：

    ```text
    本次压测在 200 并发、持续 305 秒下进行，共产生 652,000 个请求。
    P95 = 380ms、TPS = 2,137.7，均满足目标；但错误率 0.12%，超过 0.1% 的门槛，整体判定为不达标。
    错误集中在最后 65 秒：错误类型由 JSON 断言失败转为 HTTP 500，错误率从 0.234% 飙到 2.81%。
    结合监控，瓶颈在数据库：慢查询 1,240 条导致连接占用时间变长，连接池（100）被打满，
    后续请求拿不到连接直接返回 500。压力机 CPU 仅 38%，可排除压力机瓶颈。
    建议：① 为商品详情查询补索引，消除慢查询；② 连接池上限由 100 调到 200，并加上获取连接超时（如 3s）；
    ③ 应用层增加降级/限流，避免 DB 抖动直接放大成 500。
    ```

    下一步验证方案（可复用的回归压测）：

    ```bash
    # 用完全相同的脚本与参数重跑，只在报告目录上区分版本
    jmeter -n -t product_detail.jmx -l result/product_detail_opt.jtl -e -o report/product_detail_opt
    ```

    对比方式（改前 vs 改后，四个指标一起看）：

    | 验证点 | 改前 | 期望的改后 | 说明 |
    |--------|------|-----------|------|
    | 错误率 | 0.12% | < 0.1% | 主判定指标 |
    | P95 | 380ms | 不劣化（≤ 380ms） | 防止"靠降级换错误率" |
    | TPS | 2,137.7 | 不低于 2,000 | 确认没有牺牲吞吐 |
    | 连接池使用 | 92 / 100 | < 70 / 200 | 确认根因被消除 |
    | 慢查询数 | 1,240 条 | 明显下降 | 确认索引真的生效 |

    > 纪律提醒：改后必须用**相同脚本、相同并发、相同数据量**重跑，否则对比没有意义；同时压测前后要通知开发与 DBA，并确认数据可清理。

1. **如果你想学安全测试**：学习 [Web 安全测试](Web安全测试教程-软件测试版.md)，掌握常见漏洞验证
2. **如果你想做性能实战**：进入 [性能测试项目实战](../项目实战/性能测试项目实战.md)，完成完整压测方案
3. **如果你想进入自动化**：学习 [Python 接口自动化](../自动化测试/Python+Requests+Allure接口自动化教程-软件测试版.md)，用代码做接口测试

### 阶段测验

完成教程后，建议做 [JMeter 性能测试测验](JMeter性能测试测验.md) 检验学习效果。

### 通关检查

完成本阶段后，使用 [第3阶段-专项测试通关](../学习中心/第3阶段-专项测试通关.md) 检查是否可以进入下一阶段。
