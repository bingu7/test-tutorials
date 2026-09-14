---
description: Web 安全测试测验，检验 OWASP Top 10、注入、XSS、CSRF 和越权掌握程度。
---
# Web 安全测试测验

!!! abstract "测验说明"
    本测验用于检验 Web 安全测试教程的学习效果。共 12 道选择题，覆盖 OWASP Top 10、SQL 注入、XSS、CSRF、越权与敏感信息泄露。

<div class="tutorial-meta">
    <span class="difficulty-badge difficulty-intermediate">📙 中级难度</span>
    <span class="meta-item">⏱ 约 20 分钟</span>
    <span class="meta-item">📝 12 道选择题</span>
</div>

!!! tip "测验反馈"
    提交答案后，系统会显示：

    - 得分和正确率
    - 错题分析和薄弱知识点
    - 复习建议和推荐教程
    - 下一步学习建议

---

## 选择题

<div class="quiz-container" data-quiz-id="security-basics">

<div class="quiz-item" data-correct="2">
<div class="quiz-question">OWASP Top 10（2021）排在第一位的是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q1" value="0"> A03 注入</label>
<label class="quiz-option"><input type="radio" name="q1" value="1"> A07 身份验证失败</label>
<label class="quiz-option"><input type="radio" name="q1" value="2"> A01 失效的访问控制</label>
<label class="quiz-option"><input type="radio" name="q1" value="3"> A10 服务端请求伪造（SSRF）</label>
</div>
<div class="quiz-explanation">💡 2021 版把"失效的访问控制"提到首位，越权和 IDOR 就属于这一类。注入（A03）仍然高危，但不再是第一</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">把订单详情 URL 中的订单 ID 改成别人的 ID，结果成功看到了他人的订单，这属于？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q2" value="0"> 水平越权（IDOR）</label>
<label class="quiz-option"><input type="radio" name="q2" value="1"> 垂直越权</label>
<label class="quiz-option"><input type="radio" name="q2" value="2"> 存储型 XSS</label>
<label class="quiz-option"><input type="radio" name="q2" value="3"> 服务端请求伪造（SSRF）</label>
</div>
<div class="quiz-explanation">💡 水平越权是**同级别用户之间**的数据越界访问，典型表现就是改 ID 拿到别人的数据。垂直越权是低权限用户拿到了高权限功能</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">普通用户账号能够成功调用管理员专属的后台接口，这属于？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q3" value="0"> 水平越权（IDOR）</label>
<label class="quiz-option"><input type="radio" name="q3" value="1"> 垂直越权</label>
<label class="quiz-option"><input type="radio" name="q3" value="2"> CSRF 跨站请求伪造</label>
<label class="quiz-option"><input type="radio" name="q3" value="3"> 不安全设计</label>
</div>
<div class="quiz-explanation">💡 垂直越权是**权限层级**被打破：低权限角色访问了高权限角色才有的接口或功能。测试时要点是拿低权限账号直接请求高权限接口，而不是只看前端菜单是否隐藏</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">XSS 的三种类型中，危害最大的是哪一种？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q4" value="0"> 反射型</label>
<label class="quiz-option"><input type="radio" name="q4" value="1"> DOM 型</label>
<label class="quiz-option"><input type="radio" name="q4" value="2"> 三种危害完全相同</label>
<label class="quiz-option"><input type="radio" name="q4" value="3"> 存储型</label>
</div>
<div class="quiz-explanation">💡 存储型 XSS 的恶意脚本被存进数据库，任何访问该页面的用户都会触发，影响面最广、最危险。反射型需要诱导点击，DOM 型由前端 JS 处理不当引起</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">下面哪个 payload 是用来探测 SQL 注入的？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q5" value="0"> &lt;script&gt;alert(1)&lt;/script&gt;</label>
<label class="quiz-option"><input type="radio" name="q5" value="1"> ' OR '1'='1</label>
<label class="quiz-option"><input type="radio" name="q5" value="2"> ../../etc/passwd</label>
<label class="quiz-option"><input type="radio" name="q5" value="3"> &lt;img src=x onerror=alert(1)&gt;</label>
</div>
<div class="quiz-explanation">💡 `' OR '1'='1` 通过闭合 SQL 语句并构造恒真条件来探测注入；第 1、4 个是 XSS payload，第 3 个是路径穿越。**能区分 payload 类型是安全测试的基本功**</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">防御 CSRF 最核心的手段是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q6" value="0"> 对响应内容做 HTML 转义</label>
<label class="quiz-option"><input type="radio" name="q6" value="1"> 使用参数化查询</label>
<label class="quiz-option"><input type="radio" name="q6" value="2"> 校验 CSRF Token，配合 Referer/Origin 校验与 SameSite Cookie</label>
<label class="quiz-option"><input type="radio" name="q6" value="3"> 给密码加盐哈希存储</label>
</div>
<div class="quiz-explanation">💡 CSRF 的本质是"浏览器自动带上 Cookie"，所以要证明请求来自本站页面：CSRF Token + Referer/Origin 校验 + SameSite 属性。HTML 转义防 XSS、参数化查询防 SQL 注入、加盐哈希防密码泄露</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">Burp Suite 的 Repeater 模块主要用来做什么？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q7" value="0"> 全自动扫描整个站点的漏洞</label>
<label class="quiz-option"><input type="radio" name="q7" value="1"> 对单个请求反复修改并重放，逐个验证漏洞</label>
<label class="quiz-option"><input type="radio" name="q7" value="2"> 生成性能测试报告</label>
<label class="quiz-option"><input type="radio" name="q7" value="3"> 替代浏览器正常浏览页面</label>
</div>
<div class="quiz-explanation">💡 Repeater 是手工验证的主战场：拦截请求后改参数、改 Cookie、去掉 Token 再重放，观察响应差异。例如去掉 Referer/Token 头来验证 CSRF 防护是否真的生效</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">服务端请求伪造（SSRF）在 OWASP Top 10（2021）中对应哪一项？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q8" value="0"> A02 加密失败</label>
<label class="quiz-option"><input type="radio" name="q8" value="1"> A05 安全配置错误</label>
<label class="quiz-option"><input type="radio" name="q8" value="2"> A09 日志和监控不足</label>
<label class="quiz-option"><input type="radio" name="q8" value="3"> A10 服务端请求伪造（SSRF）</label>
</div>
<div class="quiz-explanation">💡 SSRF 是 2021 版新增的类别，指攻击者诱导服务端去请求内网地址。测试关注点是所有"由服务端代发请求"的参数，比如图片加载、Webhook、URL 导入</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">检查"敏感信息泄露"时，下面哪一项最应该在检查清单里？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q9" value="0"> 接口响应和日志中是否包含明文手机号、身份证、密码等</label>
<label class="quiz-option"><input type="radio" name="q9" value="1"> 页面按钮的圆角样式是否统一</label>
<label class="quiz-option"><input type="radio" name="q9" value="2"> 静态资源的加载是否走了 CDN</label>
<label class="quiz-option"><input type="radio" name="q9" value="3"> 接口响应时间是否低于 200ms</label>
</div>
<div class="quiz-explanation">💡 敏感信息泄露的常见位置是接口响应体、报错堆栈、URL 参数和日志。返回全量字段（如把用户表整行返回）是最典型的问题</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">测试文件上传功能的安全性，下面哪一项是必须覆盖的？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q10" value="0"> 上传文件的体积是否超过 10MB</label>
<label class="quiz-option"><input type="radio" name="q10" value="1"> 上传后的文件名是否保持原样</label>
<label class="quiz-option"><input type="radio" name="q10" value="2"> 校验后缀、MIME 类型和文件内容，并确认上传后能否被解析执行</label>
<label class="quiz-option"><input type="radio" name="q10" value="3"> 上传进度条显示是否流畅</label>
</div>
<div class="quiz-explanation">💡 只校验前端后缀是最容易被绕过的防护。要同时验证服务端对后缀、MIME 和真实文件内容的校验，以及上传后的文件是否被放到了可解析执行的目录</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">测试人员开展安全测试，合理的定位是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q11" value="0"> 完全替代专业渗透测试团队，覆盖所有攻击面</label>
<label class="quiz-option"><input type="radio" name="q11" value="1"> 覆盖常见漏洞场景并推动修复，不替代专业渗透测试</label>
<label class="quiz-option"><input type="radio" name="q11" value="2"> 只做扫描器扫描，人工验证交给开发</label>
<label class="quiz-option"><input type="radio" name="q11" value="3"> 只要系统没有报错就算安全</label>
</div>
<div class="quiz-explanation">💡 功能测试人员做安全测试的价值在于：把越权、注入、敏感信息、鉴权这些高频场景纳入日常测试，尽早发现明显问题，而不是等上线前做一次渗透</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">开发说"SQL 注入已经修好了"，怎么验证修复真的生效？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q12" value="0"> 开发确认过即可，不需要复验</label>
<label class="quiz-option"><input type="radio" name="q12" value="1"> 只验证正常输入能正常返回结果</label>
<label class="quiz-option"><input type="radio" name="q12" value="2"> 确认线上开了 WAF 就算修复完成</label>
<label class="quiz-option"><input type="radio" name="q12" value="3"> 重新提交原始注入 payload，确认已被拦截或已参数化处理</label>
</div>
<div class="quiz-explanation">💡 这就是**防御验证**：用原来的攻击载荷再打一遍，确认不再生效，并确认修复方式不是靠过滤个别关键字。只验证正常输入无法证明漏洞已修复</div>
</div>

<button class="quiz-submit">提交答案</button>
<div class="quiz-score"></div>

</div>

---

## 继续学习

完成测验后，建议继续学习：

- [Web 安全测试教程](Web安全测试教程-软件测试版.md) - 查看完整教程
- [安全测试案例](../案例库/安全测试案例-软件测试版.md) - 案例库中的安全测试案例
- [安全测试面试题](../面试专题/安全测试面试题.md) - 检验面试表达
