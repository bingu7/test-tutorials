---
description: Charles 抓包教程，HTTP/HTTPS 抓包、Mock、弱网、移动端抓包。
---
# Charles 抓包教程（软件测试人员专用）

> 本教程面向软件测试工程师，结合实际测试场景讲解 Charles 的使用方法。Charles 跨平台（Windows/macOS/Linux），是移动端抓包的首选工具之一。

---

## 前置要求

| 项目 | 要求 | 获取方式 |
|------|------|----------|
| 网络基础（HTTP 协议） | 了解请求方法、状态码、请求头与响应体 | [网络知识教程](网络知识教程-软件测试版.md) |

---

## 新手导读

抓包的核心不是"看到很多请求"，而是从请求里找到业务动作对应的接口。新手第一遍只需要学会看请求方法、URL、请求参数、响应结果和状态码。

建议练习路径：

1. 打开一个网页或 App 操作登录。
2. 在 Charles 里找到登录请求。
3. 查看请求参数里有没有账号、密码或 Token。
4. 查看响应里是否有业务 code、message、data。
5. 把这个请求右键 → Copy cURL Request，在终端或 Postman 里重新发送。

### Charles vs Fiddler 选型

| 对比项 | Charles | Fiddler Classic |
|--------|---------|-----------------|
| 平台 | Windows / macOS / Linux | 仅 Windows |
| 价格 | 付费（30 天试用） | 免费 |
| 界面 | Java GUI，简洁直观 | .NET，功能多但略杂乱 |
| 移动端抓包 | 原生支持，体验最好 | 需手动配置 |
| 弱网模拟 | 内置 Throttle Settings，按带宽/延迟配置 | 需编辑脚本 |
| 适合场景 | macOS 用户、移动端测试、跨平台团队 | Windows 专职 Web 测试、零成本场景 |

!!! tip "建议"
    macOS 用户直接用 Charles。Windows 用户如果团队有 Charles 许可证也推荐用 Charles（移动端体验更好）。没有许可证可用 Fiddler Classic 或 Charles 试用期。

---

## 一、Charles 简介

### 1.1 什么是 Charles

Charles 是一款跨平台 HTTP 代理/抓包工具，由 XK72 Ltd 开发。它工作在 **HTTP/HTTPS 协议层**，通过本地代理（默认端口 8888）拦截客户端与服务器之间的所有通信，支持请求查看、修改、Mock、限速等功能。

### 1.2 工作原理

```
正常请求：客户端 ──────────→ 服务器
                
使用 Charles：客户端 ──→ Charles(127.0.0.1:8888) ──→ 服务器
                           ↑
                        拦截、查看、修改
```

Charles 本质是一个 **中间人代理（Man-in-the-Middle Proxy）**，通过动态生成证书解密 HTTPS 流量。

### 1.3 测试人员为什么要学 Charles

| 应用场景 | 说明 |
|---------|------|
| 接口测试 | 查看接口请求/响应数据，验证字段是否符合预期 |
| Bug 定位 | 判断问题是前端展示问题还是后端数据问题 |
| 弱网测试 | 内置带宽/延迟/MTU 模拟，无需写脚本 |
| Mock 数据 | Map Remote / Map Local 功能，替换请求或本地文件 |
| 异常测试 | Rewrite 功能修改请求/响应参数，测试容错能力 |
| 移动端抓包 | 对 iOS/Android 支持最好，配置简单 |
| 安全测试 | 检测敏感信息是否明文传输 |

---

## 二、安装与基础配置

### 2.1 下载安装

1. 访问官网：`https://www.charlesproxy.com/download/`
2. 选择对应平台版本（Windows / macOS / Linux）
3. 安装后首次启动会提示 30 天试用

!!! info "许可证"
    Charles 是付费软件，试用期 30 天。试用期间每次启动需等待 10 秒，功能完整不限制。企业团队建议购买许可证。

### 2.2 首次启动配置

Charles 启动后会自动设置为系统代理（macOS 下需授权）。

**Step 1：确认代理端口**

`Proxy` → `Proxy Settings` → `Proxies` 标签：

- `HTTP Proxy` 端口：`8888`（默认）
- 勾选 `Enable transparent HTTP proxying`

**Step 2：开启 macOS 代理（macOS 用户）**

`Proxy` → `macOS Proxy`（勾选后 Charles 自动接管系统代理）

首次使用时 Charles 会请求网络权限，点击允许。

---

## 三、界面布局详解

```
┌──────────────────────────────────────────────────────────┐
│ 菜单栏 / 工具栏                                            │
├────────────────────────┬─────────────────────────────────┤
│                        │  右侧：请求/响应详情面板          │
│  左侧：Structure 树     │  ┌────────────────────────────┐ │
│  或 Sequence 列表       │  │ Overview / Request /        │ │
│  （两种视图切换）        │  │ Response / Summary          │ │
│                        │  └────────────────────────────┘ │
│                        │                                 │
├────────────────────────┴─────────────────────────────────┤
│ 底部：状态栏（连接数、流量、Throttle 状态）                  │
└──────────────────────────────────────────────────────────┘
```

### 3.1 左侧视图切换

Charles 提供两种视图模式（工具栏按钮切换）：

| 视图 | 说明 | 适合场景 |
|------|------|---------|
| **Structure** | 按域名/路径分层树状展示 | 浏览特定站点的所有请求 |
| **Sequence** | 按时间顺序平铺所有请求 | 按操作顺序排查问题 |

### 3.2 右侧详情面板

选中一个请求后，右侧显示：

| Tab | 用途 |
|-----|------|
| `Overview` | 请求概要（URL、方法、状态码、耗时、大小） |
| `Request` | 请求详情（Headers、Body、Query String） |
| `Response` | 响应详情（Headers、Body，支持 JSON/XML/HTML 格式化） |
| `Summary` | 耗时分解与大小汇总（DNS 解析、连接、SSL 握手、发送、等待、接收各阶段耗时） |
| `Chart` | 请求大小/时间的可视化图表 |
| `Notes` | 自定义备注 |

### 3.3 请求图标颜色

| 颜色 | 含义 |
|------|------|
| 蓝色 | 正常响应（200） |
| 绿色 | 已完成但有提示（如 301/302 重定向） |
| 灰色 | 请求被阻断或未完成 |
| 红色 | 错误响应（4xx/5xx） |

---

## 四、HTTPS 抓包配置

!!! warning "重要"
    默认 Charles 只能抓 HTTP，HTTPS 显示为乱码或空白。需要安装并信任 Charles 根证书。

### 4.1 安装 Charles 根证书

**Windows / macOS：**

1. `Help` → `SSL Proxying` → `Install Charles Root Certificate`
2. 系统会打开证书管理器：
   - **Windows**：导入到 `受信任的根证书颁发机构`
   - **macOS**：钥匙串中找到 `Charles Proxy CA`，双击 → 信任 → 始终信任

### 4.2 启用 SSL Proxying

`Proxy` → `SSL Proxying Settings`：

1. 勾选 `Enable SSL Proxying`
2. 点击 `Add` 添加要解密的域名：
   - Host：填写具体域名，支持通配符，如 `*.api.example.com`
   - Port：`443`
3. 点击 `OK`

!!! tip "建议"
    按需添加具体域名即可。想临时抓取所有 HTTPS，可以用 Host `*` + Port `443`，但会产生大量无关数据，日常测试不推荐。

### 4.3 验证证书安装

配置完成后访问任意 HTTPS 网站，Charles 中应能看到明文的请求和响应内容（而非乱码）。

---

## 五、移动端抓包配置

### 5.1 前置条件

- 手机和电脑必须在 **同一个 Wi-Fi 网络** 下
- Charles 已启用并监听 8888 端口

### 5.2 查看电脑 IP

在 Charles 菜单栏：`Help` → `Local IP Address` 查看电脑 IP。

或终端执行：

```bash
# macOS
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

记录 IPv4 地址，例如 `192.168.1.100`。

### 5.3 Android 端配置

**Step 1：配置 Wi-Fi 代理**

`设置` → `WLAN` → 长按当前 Wi-Fi → `修改网络` → 勾选 `显示高级选项`：

- 代理：`手动`
- 服务器主机名：`192.168.1.100`（你的电脑 IP）
- 服务器端口：`8888`

**Step 2：安装证书**

1. 手机浏览器访问：`http://chls.pro/ssl`（Charles 内置证书下载地址）
2. 下载并安装证书文件
3. 进入 `设置` → `安全` → `从存储设备安装证书`

!!! warning "Android 7.0+ 注意"
    系统默认不信任用户安装的 CA 证书。解决方案：
    - 应用配置 `network_security_config.xml` 信任用户证书（需开发协助）
    - 使用 root 设备 + Magisk 模块自动信任用户证书
    - 使用 Android 6.0 以下设备/模拟器测试

### 5.4 iOS 端配置

**Step 1：配置代理**

`设置` → `Wi-Fi` → 点击当前 Wi-Fi 右侧 `i` 图标 → 下滑找到 `配置代理`：

- 选择 `手动`
- 服务器：`192.168.1.100`
- 端口：`8888`

**Step 2：安装描述文件**

1. Safari 访问：`http://chls.pro/ssl`
2. 系统提示安装描述文件 → 允许
3. 进入 `设置` → `通用` → `VPN与设备管理` → 安装描述文件

**Step 3：信任证书**

1. 进入 `设置` → `通用` → `关于本机` → `证书信任设置`
2. 开启对 `Charles Proxy CA` 的信任开关

!!! warning "iOS 10.3+ 注意"
    必须手动到"证书信任设置"开启信任开关，否则 HTTPS 仍然无法解密。

### 5.5 Charles 弹窗确认

手机配置代理后，Charles 会弹窗提示有新设备连接，点击 `Allow` 允许。

!!! tip "提示"
    测试完成后记得关闭手机代理，否则手机断开 Charles 后将无法上网。

---

## 六、核心功能详解

### 6.1 Map Local（本地 Mock）

**测试场景：** 后端接口未就绪 / 模拟固定返回值

**操作步骤：**

1. 在左侧找到目标请求，右键 → `Map Local`
2. 或通过菜单：`Tools` → `Map Local`
3. 配置规则：
   - `Map From`：填写要匹配的协议、主机、端口、路径
   - `Map To`：指定本地文件路径（如 `D:\mock\user_info.json`）
4. 点击 `OK`，之后该请求都会返回本地文件内容

**准备 Mock 文件：**

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "username": "test_user",
    "role": "admin"
  }
}
```

### 6.2 Map Remote（远程转发）

**测试场景：** 将生产环境请求转发到测试环境

**操作步骤：**

1. `Tools` → `Map Remote`
2. `Map From`：填写原始域名（如 `api.prod.example.com`）
3. `Map To`：填写目标域名（如 `api.test.example.com`）
4. 保持端口和路径不变
5. 点击 `OK`

之后所有访问 `api.prod.example.com` 的请求都会被转发到测试环境。

### 6.3 Rewrite（请求/响应改写）

**测试场景：** 修改请求参数或响应内容，测试边界/异常情况

**操作步骤：**

1. `Tools` → `Rewrite`
2. 勾选 `Enable Rewrite`
3. 点击 `Add` 添加规则
4. 配置 `Locations`：指定匹配的域名和路径
5. 配置 `Type` 和 `Where`：
   - 修改请求头 / 响应头 / 请求体 / 响应体
   - 可选操作：`Add`、`Remove`、`Modify`、`Replace`

**常用场景：**

| Rewrite 类型 | 示例 |
|-------------|------|
| 修改请求参数 | `amount=100` → `amount=0.01` |
| 删除请求头 | 移除 `Authorization` 测试未鉴权 |
| 修改响应状态码 | 将 200 改为 500 测试错误处理 |
| 修改响应体 | 替换 JSON 字段值 |

### 6.4 Breakpoints（断点）

断点用于在请求/响应到达目标前暂停，进行实时修改。

**设置方式：**

选中目标请求 → 右键 → `Breakpoints`

或 `Proxy` → `Breakpoint Settings` 手动添加。

**断点触发后：**

- `Edit Request`：修改请求参数
- `Execute`：放行请求
- `Abort`：中止请求
- 响应回来后同样可编辑再放行

!!! tip "快捷操作"
    在 Structure 视图中右键请求 → `Breakpoints`，之后该 URL 的所有请求都会被断点拦截。取消同样右键 → `Breakpoints`（取消勾选）。

### 6.5 Throttle Settings（弱网模拟）

**测试场景：** 模拟 2G/3G/4G/Wi-Fi 等网络环境

**操作步骤：**

1. `Proxy` → `Throttle Settings`
2. 勾选 `Enable Throttling`
3. 选择预设或自定义：
   - 预设：`56 Kbps`、`256 Kbps`、`DSL`、`3G`、`4G` 等
   - 自定义：设置带宽（Bandwidth）、利用率（Utilization）、延迟（Latency）、MTU
4. `Only for selected hosts`：只对特定域名限速（推荐）

**参数说明：**

| 参数 | 含义 |
|------|------|
| Bandwidth | 带宽（Kbps） |
| Utilization | 利用率（0-100%） |
| Latency | 延迟（ms） |
| MTU | 最大传输单元（字节） |
| Reliability | 可靠性（丢包率） |
| Stability | 稳定性（网速波动范围） |

### 6.6 Recording Settings（录制过滤）

抓包时干扰请求太多，可通过 Recording Settings 精确筛选：

`Recording Settings` → `Include` 标签：

1. 点击 `Add` 添加规则
2. 填写 Protocol、Host、Port、Path
3. 支持通配符 `*`

示例：只抓 `api.example.com` 的请求：

| 字段 | 值 |
|------|-----|
| Protocol | `https` |
| Host | `api.example.com` |
| Port | |
| Path | `*` |

### 6.7 Repeat / Advanced Repeat（重放）

**操作步骤：**

1. 选中目标请求
2. 右键 → `Repeat`（立即重放一次）
3. 右键 → `Advanced Repeat`：
   - `Iterations`：重复次数
   - `Concurrency`：并发数
   - `Repeat Delay`：每次间隔（毫秒）

适合简单压力测试和接口幂等性验证。

---

## 七、测试场景实战

### 7.1 场景一：接口数据验证

**需求：** 验证用户登录接口返回数据是否正确

**步骤：**

1. 在被测应用执行登录操作
2. 在 Charles 中找到 `/api/login` 请求（Sequence 视图按时间找）
3. 查看 `Request` → `Body`：核对账号密码是否正确传输
4. 查看 `Response` → `Body`：核对返回结构
5. 对比接口文档：字段名、字段类型、必填项、token 格式

### 7.2 场景二：Mock 异常响应

**需求：** 测试当服务端返回 500 错误时，前端是否友好提示

**步骤：**

1. 准备本地文件 `error_500.json`：

```json
{
  "code": 500,
  "msg": "服务器内部错误",
  "data": null
}
```

2. `Tools` → `Map Local` → `Add`
3. Host：`api.example.com`，Path：`/user/info`
4. Local path：指向 `error_500.json`
5. 配合 Rewrite 将响应状态码改为 500
6. 在应用中触发该接口，观察前端表现

### 7.3 场景三：篡改请求参数

**需求：** 测试金额参数被篡改后的服务端校验

**步骤：**

1. 选中支付相关请求 → 右键 → `Breakpoints`
2. 在被测应用发起支付请求
3. Charles 拦截后，编辑 Request Body
4. 修改金额字段：`amount=100` → `amount=0.01`
5. 点击 `Execute` 放行
6. 观察服务端是否做了金额校验

!!! example "安全测试要点"
    重点验证服务端对客户端传参的二次校验，不能仅依赖前端校验。

### 7.4 场景四：弱网模拟

**需求：** 模拟 3G 网络环境下 App 的加载体验

**步骤：**

1. `Proxy` → `Throttle Settings`
2. 勾选 `Enable Throttling`
3. 选择预设 `3G`（或自定义：带宽 780 Kbps，延迟 100ms）
4. 勾选 `Only for selected hosts` → `Add` 添加被测 App 的域名
5. 操作 App，观察加载速度、超时提示、骨架屏表现
6. 测试完毕后取消 `Enable Throttling`

### 7.5 场景五：接口转发到测试环境

**需求：** 将 App 请求从生产环境转发到测试环境

**步骤：**

1. `Tools` → `Map Remote` → `Add`
2. Map From：Host `api.prod.example.com`
3. Map To：Host `api.test.example.com`
4. App 无需任何改动，所有请求自动转发
5. 测试完毕后删除规则

!!! tip "实用场景"
    测试环境数据更可控，不会污染生产数据。Map Remote 是做环境切换最干净的方式。

### 7.6 场景六：重放攻击测试

**需求：** 验证幂等性接口是否做防重处理

**步骤：**

1. 抓取一次"提交订单"请求
2. 右键 → `Advanced Repeat`
3. Iterations：`10`，Concurrency：`1`，Delay：`100`ms
4. 检查服务端是否：
   - 创建了多个订单（未防重，存在 Bug）
   - 仅创建一个订单，其余返回"重复请求"提示（正确）

---

## 八、常用快捷键

!!! warning "说明"
    Charles 官方未发布快捷键清单，且不同版本、不同平台可能存在差异。以下条目经第三方资料交叉核对；最可靠的做法是直接查看 Charles 菜单栏——菜单项右侧标注的快捷键以你本机安装的版本为准。

| 快捷键 | 功能 |
|--------|------|
| `Cmd/Ctrl + F` | 搜索（Edit → Find） |
| `Cmd/Ctrl + T` | 启用/停用弱网限速（Proxy → Throttling） |
| `Cmd/Ctrl + Shift + M` | 打开 Map Local（Tools → Map Local） |
| `Cmd/Ctrl + Shift + E` | 打开 Rewrite 设置（Tools → Rewrite） |
| `Cmd/Ctrl + Shift + B` | 打开 Breakpoints 设置（Tools → Breakpoints） |
| `Cmd/Ctrl + Shift + T` | 高级重放（Tools → Advanced Repeat） |

!!! tip "无快捷键的常用操作"
    清空会话、删除选中请求、单条重放等操作在 Charles 中主要通过右键上下文菜单完成：选中请求后右键，选择 `Repeat`、`Clear Session` 等。部分版本支持选中请求后按 `Delete` 删除。

---

## 九、常见问题排查

### 9.1 Charles 抓不到包

**排查清单：**

1. Charles 是否正在运行且未暂停录制（工具栏红色圆点）
2. 系统代理是否指向 Charles（`Proxy` → `macOS Proxy` / Windows 检查系统代理设置）
3. 浏览器是否使用了其他代理插件（如 SwitchyOmega）
4. 应用是否走了 QUIC/HTTP3（Charles 不支持 UDP 协议，需在浏览器禁用 QUIC）

### 9.2 HTTPS 显示乱码或 SSL handshake failure

**原因：** 证书未安装或未信任

**解决：**

1. 重新安装 Charles 根证书
2. macOS：钥匙串中找到 `Charles Proxy CA` → 双击 → 信任 → 始终信任
3. `Proxy` → `SSL Proxying Settings` → 确认目标域名已添加
4. 重启 Charles

### 9.3 手机配置代理后无法上网

**排查清单：**

1. 电脑和手机是否在同一 Wi-Fi
2. Charles 是否弹窗并 Allow 了该设备连接
3. 电脑防火墙是否拦截了 8888 端口
4. IP 是否配错（通过 `Help` → `Local IP Address` 确认）
5. 公司网络是否有 AP 隔离（无线设备相互隔离）

### 9.4 抓不到某些 App 的请求

**可能原因：**

- App 启用了 **证书锁定（SSL Pinning）**：客户端只信任内置证书
- 解决方案：
  - 联系开发关闭测试包的 SSL Pinning
  - 使用 Frida + 反 Pinning 脚本（需 root/越狱设备）
  - 使用 SSL Kill Switch（越狱 iOS）/ TrustMeAlready（root Android）

### 9.5 Charles 试用期弹窗

每次启动有 10 秒等待，功能不受限。企业使用建议购买许可证：`https://www.charlesproxy.com/buy/`

---

## 十、进阶建议

测试人员掌握 Charles 后，建议进一步学习：

- **mitmproxy**：命令行工具，支持 Python 脚本扩展，适合自动化抓包场景
- **Wireshark**：工作在更底层（TCP/IP 层），适合协议层问题排查
- **Postman**：专注于接口调试和接口自动化测试
- **Fiddler**：Windows 免费方案，功能丰富

---

## 附录：参考资料

- Charles 官方文档：[https://www.charlesproxy.com/documentation/](https://www.charlesproxy.com/documentation/)
- Charles 证书下载：[http://chls.pro/ssl](http://chls.pro/ssl)
- HTTP 状态码参考：[MDN Web Docs](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)

---

!!! info "文档说明"
    本教程基于 Charles 4.x 版本编写，适用于 Windows / macOS / Linux 平台。

!!! warning "测试纪律"
    抓包测试涉及用户数据，请严格在测试环境进行，禁止抓取生产环境用户数据，禁止用于非授权的安全测试。

### 推荐下一步

根据你的学习进度，选择下一步：

1. **如果你想学接口调试**：学习 [Postman 接口测试](Postman接口测试教程-软件测试版.md)，掌握接口调试和断言
2. **如果你想看完整工作流**：学习 [接口抓包联调实战](接口抓包联调实战教程-软件测试版.md)，把 Charles + Postman + Python 串起来
3. **如果你想进入下一阶段**：学习 [接口测试方法论](../专项测试/接口测试完整教程-软件测试版.md)，掌握用例设计

### 通关检查

完成本阶段后，使用 [第2阶段-工具实战通关](../学习中心/第2阶段-工具实战通关.md) 检查是否可以进入下一阶段。
