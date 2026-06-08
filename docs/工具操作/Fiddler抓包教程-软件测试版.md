# Fiddler 抓包教程（软件测试人员专用）

> 本教程面向软件测试工程师，结合实际测试场景讲解 Fiddler 的使用方法，覆盖从入门安装到高级技巧的全部内容。

---

## 一、Fiddler 简介

### 1.1 什么是 Fiddler

Fiddler 是一款免费 Web 调试代理工具，由 Eric Lawrence 创作（2003 年），2012 年被 Telerik 收购（Telerik 后并入 Progress Software）。它工作在 **HTTP/HTTPS 协议层**，通过本地代理（默认端口 8888）拦截客户端与服务器之间的所有通信。

> **版本说明：** 本文档介绍的是 Fiddler Classic（Windows 免费版，维护节奏放缓但仍有大量用户）。Telerik 同时提供 Fiddler Everywhere（跨平台付费版）和 FiddlerCap（抓包录制工具）。

### 1.2 工作原理

```
正常请求：客户端 ──────────→ 服务器
                
使用 Fiddler：客户端 ──→ Fiddler(127.0.0.1:8888) ──→ 服务器
                          ↑
                       拦截、查看、修改
```

Fiddler 本质是一个 **中间人代理（Man-in-the-Middle Proxy）**，所有经过的 HTTP/HTTPS 请求都会被记录并可被修改。

### 1.3 测试人员为什么要学 Fiddler

| 应用场景 | 说明 |
|---------|------|
| 接口测试 | 查看接口请求/响应数据，验证字段是否符合预期 |
| Bug 定位 | 判断问题是前端展示问题还是后端数据问题 |
| 弱网测试 | 模拟低带宽、延迟、丢包等网络环境 |
| Mock 数据 | 在后端未就绪时构造响应数据进行前端测试 |
| 异常测试 | 篡改请求参数、响应状态码，测试容错能力 |
| 性能分析 | 查看请求耗时、资源大小 |
| 安全测试 | 检测敏感信息是否明文传输 |

---

## 二、安装与基础配置

### 2.1 下载安装

1. 访问官网：`https://www.telerik.com/fiddler/fiddler-classic`
2. 选择 **Fiddler Classic**（经典版免费，推荐测试人员使用）
3. 填写表单（邮箱可以是真实邮箱）后下载安装包
4. 双击安装，全部默认配置即可

> **版本选择建议：** Fiddler Classic 免费且功能完整，Fiddler Everywhere 是付费跨平台版本。普通测试工作 Classic 版完全够用。

### 2.2 首次启动配置

打开 Fiddler 后，按以下步骤进行基础设置：

**Step 1：开启抓包**

主菜单 → `File` → 勾选 `Capture Traffic`（快捷键 F12）

底部状态栏显示 `Capturing` 表示已开启抓包。

**Step 2：基础参数配置**

`Tools` → `Options` → `General` 标签：

- 勾选 `Show a message when HTTPS-protected traffic is...`（HTTPS 警告提示）
- 勾选 `Check for updates on startup`（关闭可避免启动慢）

**Step 3：连接配置**

`Tools` → `Options` → `Connections` 标签：

- `Fiddler listens on port`: 8888（默认端口，可修改）
- 勾选 `Allow remote computers to connect`（允许远程设备连接，移动端抓包必选）
- 勾选 `Act as system proxy on startup`（启动时自动设为系统代理）

修改后需 **重启 Fiddler** 生效。

---

## 三、界面布局详解

```
┌──────────────────────────────────────────────────────────┐
│ 菜单栏 / 工具栏                                            │
├────────────────────────┬─────────────────────────────────┤
│                        │  右侧：请求/响应详情面板          │
│  左侧：会话列表         │  ┌────────────────────────────┐ │
│  （Session List）       │  │ Inspectors / AutoResponder │ │
│  显示所有抓到的请求      │  │ Composer / Statistics      │ │
│                        │  │ Filters / Timeline 等       │ │
│                        │  └────────────────────────────┘ │
│                        │                                 │
├────────────────────────┴─────────────────────────────────┤
│ 底部：QuickExec 命令行                                     │
└──────────────────────────────────────────────────────────┘
```

### 3.1 左侧会话列表字段说明

| 列名 | 含义 |
|------|------|
| `#` | 会话编号 |
| `Result` | HTTP 响应状态码（200/302/404/500 等） |
| `Protocol` | 协议（HTTP/HTTPS/FTP/Tunnel） |
| `Host` | 目标主机地址 |
| `URL` | 请求路径 |
| `Body` | 响应内容大小（字节） |
| `Caching` | 缓存策略 |
| `Content-Type` | 响应内容类型 |
| `Process` | 发起请求的进程名 |
| `Comments` | 自定义备注 |

### 3.2 会话图标颜色含义

| 图标/颜色 | 含义 |
|----------|------|
| 蓝色实心 | HTML 文档响应 |
| 绿色 | 包含 JS 脚本的响应 |
| 紫色 | CSS 样式响应 |
| 红色 | 错误请求（4xx/5xx） |
| 灰色 | 重定向（3xx）或缓存（304） |
| 锁形图标 | HTTPS 请求 |

### 3.3 右侧核心功能区

最常用的几个 Tab：

- **Inspectors**：查看请求/响应详情（重点）
- **AutoResponder**：自动响应器，用于 Mock 数据
- **Composer**：手动构造请求（类似 Postman）
- **Filters**：过滤会话
- **Statistics**：性能统计

---

## 四、HTTPS 抓包配置

> **重要：** 默认情况下 Fiddler 只能抓 HTTP 请求，对 HTTPS 显示为 `Tunnel to xxx:443`，看不到具体内容。需要安装证书才能解密 HTTPS。
>
> **HTTP/3（QUIC）注意：** Chrome 等浏览器默认启用 HTTP/3 over QUIC（基于 UDP），Fiddler Classic 作为 TCP 代理完全无法抓到这类请求。排查时需在浏览器中禁用 QUIC：
> - Chrome：访问 `chrome://flags/#enable-quic`，设为 `Disabled`
> - 或启动 Chrome 时加参数 `--disable-quic`

### 4.1 启用 HTTPS 解密

`Tools` → `Options` → `HTTPS` 标签：

1. 勾选 `Capture HTTPS CONNECTs`
2. 勾选 `Decrypt HTTPS traffic`
3. 下拉框选择 `...from all processes`（抓取所有进程的 HTTPS）
4. 弹出证书安装提示，点击 `Yes` → `Yes` 安装根证书
5. 勾选 `Ignore server certificate errors (unsafe)`（忽略证书错误，方便测试自签名证书的环境）

### 4.2 验证证书安装

Windows 系统下：
- `Win + R` 输入 `certmgr.msc`
- 进入 `受信任的根证书颁发机构` → `证书`
- 查找名为 `DO_NOT_TRUST_FiddlerRoot` 的证书

存在即表示安装成功。

### 4.3 配置 Filters（可选）

抓包时往往只关心特定域名，可在 `Filters` Tab 配置：

1. 勾选 `Use Filters`
2. `Hosts` 区域选择 `Show only the following Hosts`
3. 输入要监控的域名，多个用分号分隔，例如：
   ```
   *.test.example.com; api.example.com
   ```

---

## 五、移动端抓包配置

### 5.1 前置条件

- 手机和电脑必须在 **同一个 Wi-Fi 网络** 下
- Fiddler 已勾选 `Allow remote computers to connect`
- Windows 防火墙允许 Fiddler 通过（首次配置时会弹窗）

### 5.2 查看电脑 IP

打开 CMD 执行：

```bash
ipconfig
```

记录 `IPv4 地址`，例如 `192.168.1.100`。

或鼠标悬停在 Fiddler 右上角 `Online` 图标上查看 IP。

### 5.3 Android 端配置

**Step 1：配置代理**

`设置` → `WLAN` → 长按当前 Wi-Fi → `修改网络` → 勾选 `显示高级选项`：

- 代理：`手动`
- 服务器主机名：`192.168.1.100`（你的电脑 IP）
- 服务器端口：`8888`

**Step 2：安装证书**

1. 手机浏览器访问：`http://192.168.1.100:8888`
2. 点击页面右上角 `FiddlerRoot certificate` 下载证书
3. 进入 `设置` → `安全` → `从存储设备安装证书`
4. 选中下载的证书文件，命名后安装

> **Android 7.0+ 注意：** 系统默认不信任用户安装的 CA 证书。需要：
> - 应用配置 `network_security_config.xml` 信任用户证书（开发协助），或
> - 使用 root 设备将证书安装到系统目录，或
> - **Magisk + MagiskTrustUserCerts 模块**：免手动复制证书，自动信任用户证书（root 用户推荐），或
> - 使用 Android 6.0 以下设备/模拟器测试

### 5.4 iOS 端配置

**Step 1：配置代理**

`设置` → `Wi-Fi` → 点击当前 Wi-Fi 右侧 `i` 图标 → 下滑找到 `配置代理`：

- 选择 `手动`
- 服务器：`192.168.1.100`
- 端口：`8888`

**Step 2：安装证书**

1. Safari 访问：`http://192.168.1.100:8888`
2. 点击 `FiddlerRoot certificate` 下载描述文件
3. 进入 `设置` → `通用` → `VPN与设备管理` → 安装下载的描述文件
4. 进入 `设置` → `通用` → `关于本机` → `证书信任设置`
5. 开启对 `DO_NOT_TRUST_FiddlerRoot` 的信任开关

### 5.5 验证抓包

配置完成后，在手机上打开任意 App 或浏览器访问网页，Fiddler 会话列表应出现对应请求。

> **测试完成后记得关闭手机代理**，否则手机断开 Fiddler 后将无法上网。

---

## 六、核心功能详解

### 6.1 Inspectors（请求/响应查看器）

选中一个会话后，右侧 `Inspectors` 提供多种查看方式：

**请求查看（上半部分）：**

| Tab | 用途 |
|-----|------|
| `Headers` | 查看请求头 |
| `TextView` | 文本形式查看请求体 |
| `WebForms` | 表单数据可视化 |
| `JSON` | JSON 格式化查看 |
| `Raw` | 完整原始请求 |

**响应查看（下半部分）：**

| Tab | 用途 |
|-----|------|
| `Headers` | 响应头 |
| `JSON` | JSON 树形展示（最常用） |
| `ImageView` | 图片响应预览 |
| `WebView` | HTML 渲染预览 |
| `Cookies` | Cookie 解析 |
| `Raw` | 完整原始响应 |

### 6.2 AutoResponder（Mock 数据神器）

**测试场景：** 后端接口未就绪 / 模拟异常响应 / 固定返回值测试

**操作步骤：**

1. 切换到 `AutoResponder` Tab
2. 勾选 `Enable rules` 和 `Unmatched requests passthrough`
3. 从左侧拖入要 Mock 的请求，或点击 `Add Rule`
4. 在底部规则栏：
   - 匹配条件：`EXACT:https://api.example.com/user/info` 或 `regex:.*api\.example\.com/user.*`
   - 响应内容：选择 `Find a file` 指定本地 JSON 文件，或选择内置响应（如 `404_Plain.dat`）
5. 点击 `Save`

**常用匹配语法：**

```
EXACT:URL          完全匹配
NOT:URL            不匹配
regex:正则表达式    正则匹配
```

### 6.3 Composer（请求构造器）

类似 Postman 的接口调试工具，支持手动发起请求。

**操作步骤：**

1. 切换到 `Composer` Tab
2. 选择请求方法（GET/POST/PUT/DELETE）
3. 填写 URL
4. 填写 Request Headers
5. POST 请求填写 Request Body
6. 点击 `Execute` 发送

**实用技巧：** 在左侧会话列表中右键任意请求 → `Replay` → `Reissue Sequentially`，可重放该请求。或直接拖动会话到 Composer Tab，自动填充参数。

### 6.4 Filters（过滤器）

抓包时干扰请求太多，可通过 Filters 精确筛选：

| 配置项 | 作用 |
|--------|------|
| `Hosts` 区 | 按域名过滤（最常用） |
| `Client Process` | 按进程过滤（如只抓 Chrome） |
| `Request Headers` | 按特定请求头过滤 |
| `Response Status Code` | 按响应状态码过滤（只看 404 / 500） |
| `Response Type and Size` | 按响应类型/大小过滤 |
| `Breakpoints` | 自动断点设置 |

> 修改 Filters 后需点击右上角 `Actions` → `Run Filterset now` 立即生效。

### 6.5 Breakpoints（断点）

断点用于在请求/响应到达目标前暂停，进行参数修改。

**设置断点的两种方式：**

**方式一：菜单设置（全局断点）**

- `Rules` → `Automatic Breakpoints` → `Before Requests`（请求前断点）
- `Rules` → `Automatic Breakpoints` → `After Responses`（响应后断点）
- 取消：选择 `Disabled` 或按 F11 切换

**方式二：命令行设置（针对特定 URL）**

底部 QuickExec 命令行输入：

```
bpu https://api.example.com/login    # 请求断点
bpafter https://api.example.com/list  # 响应断点
bpu                                   # 清除请求断点
```

**断点触发后操作：**

- `Break on Response` 按钮：让请求继续走，但在响应回来时再次中断
- `Run to Completion` 按钮：放行请求继续执行
- 修改 Inspectors 中的内容后再点 `Run to Completion`

### 6.6 Statistics（性能统计）

选中单个或多个会话，切换到 `Statistics` Tab，可查看：

- DNS 查询耗时
- TCP 连接耗时
- HTTPS 握手耗时
- 请求/响应传输耗时
- 总耗时

适用于 **性能问题初步定位**，判断慢在网络层还是服务器处理。

---

## 七、测试场景实战

### 7.1 场景一：接口数据验证

**需求：** 验证用户登录接口返回数据是否正确

**步骤：**

1. 在被测应用执行登录操作
2. 在 Fiddler 中找到 `/api/login` 请求
3. `Inspectors` → 上方 `WebForms` 查看入参（账号密码是否正确传输）
4. `Inspectors` → 下方 `JSON` 查看返回结构
5. 核对字段名、字段类型、必填项、token 格式等是否符合接口文档

### 7.2 场景二：Mock 异常响应

**需求：** 测试当服务端返回 500 错误时，前端是否友好提示

**步骤：**

1. 准备本地 JSON 文件 `error_500.json`：

```json
{
  "code": 500,
  "msg": "服务器内部错误",
  "data": null
}
```

2. `AutoResponder` → `Add Rule`
3. 匹配规则：`regex:.*api\.example\.com/user/info.*`
4. 响应：选择 `Find a file...` 指向 `error_500.json`
5. 修改返回的 HTTP 状态码：在规则上右键 → `Edit Response Headers` → 修改 `HTTP/1.1 500 Internal Server Error`
6. 在应用中触发该接口，观察前端表现

### 7.3 场景三：篡改请求参数

**需求：** 测试金额参数被篡改后的服务端校验

**步骤：**

1. `Rules` → `Automatic Breakpoints` → `Before Requests`
2. 在被测应用发起支付请求
3. Fiddler 拦截后，进入 `Inspectors` → `WebForms` 或 `TextView`
4. 修改金额字段，如将 `amount=100` 改为 `amount=0.01`
5. 点击 `Run to Completion` 放行
6. 观察服务端是否做了金额校验

> **安全测试要点：** 重点验证服务端对客户端传参的二次校验，不能仅依赖前端校验。

### 7.4 场景四：弱网模拟

**需求：** 模拟 2G 网络环境下页面加载体验

**步骤：**

1. `Rules` → `Performance` → 勾选 `Simulate Modem Speeds`
2. 此时 Fiddler 会模拟约 56K 调制解调器的速度
3. 自定义弱网参数：`Rules` → `Customize Rules` 打开脚本编辑器
4. 找到 `m_SimulateModem` 块，修改延迟值：

```javascript
if (m_SimulateModem) {
    // 上行延迟（毫秒/字节，即每发送 1 字节等待该毫秒数）
    oSession["request-trickle-delay"] = "300"; 
    // 下行延迟（毫秒/字节，即每接收 1 字节等待该毫秒数）
    oSession["response-trickle-delay"] = "150";
}
```

> Fiddler Classic 使用 **JScript.NET**（类 C# 语法，非 JavaScript），但代码结构相似，不影响理解。`request-trickle-delay` / `response-trickle-delay` 单位是**毫秒/字节**（每传输 1 字节延迟多少毫秒），不是毫秒/KB。

5. 保存文件，立即生效

### 7.5 场景五：Cookie/Token 测试

**需求：** 验证 Token 过期后的处理逻辑

**步骤：**

1. 正常登录后抓取一个需要鉴权的接口
2. 在 `Composer` 中拖入该请求
3. 修改 Header 中的 `Authorization` 或 `Cookie` 字段
   - 测试 1：删除 Token → 应返回 401
   - 测试 2：Token 改为非法字符串 → 应返回 401
   - 测试 3：使用过期 Token → 应返回 401 或 403
4. 点击 `Execute` 发送，观察响应

### 7.6 场景六：重放攻击测试

**需求：** 验证幂等性接口是否做防重处理

**步骤：**

1. 抓取一次"提交订单"请求
2. 右键 → `Replay` → `Reissue and Edit`（或 R 键快速重放）
3. 重复多次相同请求
4. 检查服务端是否：
   - 创建了多个订单（未防重，存在 Bug）
   - 仅创建一个订单，其余返回"重复请求"提示（正确）

---

## 八、常用快捷键与命令

### 8.1 快捷键

| 快捷键 | 功能 |
|--------|------|
| `F12` | 暂停/开始抓包 |
| `F11` | 切换请求断点 |
| `Ctrl + X` | 清空会话列表 |
| `Ctrl + A` | 全选会话 |
| `Ctrl + I` | 反选 |
| `R` | 重放选中请求 |
| `Shift + R` | 多次重放（弹窗输入次数） |
| `Delete` | 删除选中会话 |
| `Ctrl + Delete` | 删除除选中外所有会话 |

### 8.2 QuickExec 命令行（底部黑色输入框）

| 命令 | 功能 |
|------|------|
| `?text` | 高亮 URL 包含 text 的会话 |
| `>500` | 高亮响应体大于 500 字节的会话 |
| `=200` | 高亮状态码 200 的会话 |
| `@host` | 高亮指定 host 的会话 |
| `select html` | 选中所有 HTML 响应 |
| `select json` | 选中所有 JSON 响应 |
| `cls` | 清空会话列表 |
| `bpu URL` | 对该 URL 设请求断点 |
| `bpafter URL` | 对该 URL 设响应断点 |
| `bpv` 或 `bpm POST` | 对指定 HTTP 方法设断点 |
| `g` 或 `go` | 放行当前断点 |
| `help` | 查看所有命令 |

---

## 九、常见问题排查

### 9.1 Fiddler 抓不到包

**排查清单：**

1. 是否已勾选 `File` → `Capture Traffic`
2. 浏览器是否使用了其他代理（如 SwitchyOmega）
3. Chrome 是否启用了 QUIC（地址栏访问 `chrome://flags/` 搜索 `quic` 并禁用）
4. 应用是否走了 SPDY/HTTP2 但未配置抓取（`Tools` → `Options` → `HTTPS` 取消勾选 `Skip decryption for the following hosts`）

### 9.2 HTTPS 显示 Tunnel to xxx:443

**原因：** 未启用 HTTPS 解密或证书未正确安装

**解决：**

1. `Tools` → `Options` → `HTTPS` → 勾选 `Decrypt HTTPS traffic`
2. 重新生成证书：`Actions` → `Reset All Certificates`
3. 重启 Fiddler

### 9.3 手机配置代理后无法上网

**排查清单：**

1. 电脑和手机是否在同一 Wi-Fi
2. Fiddler 是否勾选了 `Allow remote computers to connect`
3. 电脑防火墙是否拦截了 8888 端口（临时关闭防火墙测试）
4. IP 是否配错（重新执行 `ipconfig` 确认）
5. 公司网络是否有 AP 隔离（无线设备相互隔离）

### 9.4 抓不到某些 App 的请求

**可能原因：**

- App 启用了 **证书锁定（SSL Pinning）**：客户端只信任内置证书，对中间人代理免疫
- 解决方案：
  - 联系开发关闭测试包的 SSL Pinning
  - 使用 Frida + 反 Pinning 脚本（需要 root/越狱设备）
  - 使用专门的工具如 HttpCanary、Charles + SSL Kill Switch

### 9.5 抓包时电脑卡顿

**优化建议：**

1. 定期 `Ctrl + X` 清空会话列表
2. 设置过滤器只抓关心的域名
3. `Tools` → `Options` → `General` 取消勾选 `Decode Compressed Content`（用时再手动解码）
4. 关闭不需要的进程，减少干扰会话

### 9.6 Fiddler 关闭后浏览器无法上网

**原因：** Fiddler 异常退出，系统代理未自动还原

**解决：**

- Windows：`设置` → `网络和 Internet` → `代理` → 关闭 `使用代理服务器`
- 或重新打开 Fiddler 后正常退出（会自动还原）

---

## 十、进阶建议

测试人员掌握 Fiddler 后，建议进一步学习：

- **Charles**：Mac 平台的同类工具，界面更友好
- **Wireshark**：工作在更底层（TCP/IP 层），适合协议层问题排查
- **mitmproxy**：命令行工具，支持 Python 脚本扩展，适合自动化场景
- **Postman**：专注于接口调试和接口自动化测试
- **JMeter**：性能测试工具，可与 Fiddler 配合录制脚本

---

## 附录：参考资料

- Fiddler 官方文档：`https://docs.telerik.com/fiddler/`
- HTTP 状态码参考：MDN Web Docs
- FiddlerScript 自定义脚本开发指南（高级）

---

> **文档说明：** 本教程基于 Fiddler Classic 5.x 版本编写，适用于 Windows 10/11 平台。如使用 Mac 系统，建议改用 Fiddler Everywhere 或 Charles。
> 
> **测试纪律：** 抓包测试涉及用户数据，请严格在测试环境进行，禁止抓取生产环境用户数据，禁止用于非授权的安全测试。
