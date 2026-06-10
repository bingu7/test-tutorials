# JMeter 性能测试教程（软件测试人员专用）

> 本教程面向软件测试工程师，系统讲解 JMeter 性能测试，从基础概念、工具使用到完整压测方案落地。

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
TPS = 并发数 / 平均 RT

例：100 并发，平均 RT 200ms（0.2s）
TPS = 100 / 0.2 = 500
```

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

```bash
# 添加到 PATH，方便命令行使用
export JMETER_HOME=/opt/apache-jmeter-5.6.3
export PATH=$JMETER_HOME/bin:$PATH
```

### 2.3 中文界面

JMeter 默认英文，临时切换：

`Options` → `Choose Language` → `Chinese (Simplified)`

**永久切换：** 修改 `bin/jmeter.properties`：

```properties
language=zh_CN
```

> **建议：** 用英文界面，因为多数教程、错误信息是英文，方便排错。

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

**Stepping Thread Group（阶梯加压）：**

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

> 规范写法：`${__counter(TRUE)}` 或 `${__counter(TRUE,myVar)}`，尾随逗号虽可工作但不推荐。

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

> 接口耗时 > 1 秒算失败。

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

> **重要：** 正式压测时关闭 `View Results Tree`，否则严重影响性能。

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

**架构：**

```
JMeter → Backend Listener → InfluxDB → Grafana 仪表盘
```

实时看 TPS、RT 曲线、错误率，是企业级标配。

**配置 Backend Listener：**

`Add` → `Listener` → `Backend Listener`

| 字段 | 值 |
|------|------|
| Backend Listener implementation | InfluxDB Backend Listener |
| influxdbUrl | http://192.168.1.100:8086/write?db=jmeter |
| application | my_test |

> **InfluxDB 版本差异：**
> - InfluxDB 1.x：`http://host:8086/write?db=jmeter`
> - InfluxDB 2.x：API 路径改为 `/api/v2/write?org=xxx&bucket=jmeter`，需用支持 2.x 的 Backend Listener 实现（或社区插件），并配置 Token。

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

```bash
# Linux Slave
cd $JMETER_HOME/bin
./jmeter-server -Djava.rmi.server.hostname=192.168.1.101
```

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

```bash
# 看 GC
jstat -gc <pid> 1000 10

# 看堆内存
jmap -heap <pid>
jmap -histo:live <pid> | head -20

# 看线程
jstack <pid>

# 推荐工具
# - Arthas（阿里开源，强大）
# - JProfiler（商业）
# - VisualVM（免费）
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

> **测试纪律：** 性能测试是高风险测试，必须在独立测试环境进行，禁止未授权对生产系统压测。压测前通知运维、开发，准备应急预案。测试后及时清理数据，恢复环境。
