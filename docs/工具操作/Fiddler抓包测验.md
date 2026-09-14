---
description: Fiddler 抓包测验，检验代理原理、HTTPS 解密、Mock 与断点调试掌握程度。
---
# Fiddler 抓包测验

!!! abstract "测验说明"
    本测验用于检验 Fiddler 抓包教程的学习效果。共 12 道选择题，覆盖代理原理、HTTPS 解密、移动端抓包、Mock 与断点调试。

<div class="tutorial-meta">
    <span class="difficulty-badge difficulty-beginner">📗 入门难度</span>
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

<div class="quiz-container" data-quiz-id="fiddler-basics">

<div class="quiz-item" data-correct="1">
<div class="quiz-question">Fiddler 的工作原理是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q1" value="0"> 直接读取浏览器的缓存文件</label>
<label class="quiz-option"><input type="radio" name="q1" value="1"> 作为本地代理（默认端口 8888），位于客户端与服务器之间转发并记录通信</label>
<label class="quiz-option"><input type="radio" name="q1" value="2"> 抓取网卡的原始数据包并解析成 HTTP</label>
<label class="quiz-option"><input type="radio" name="q1" value="3"> 在服务器上安装探针来采集请求</label>
</div>
<div class="quiz-explanation">💡 Fiddler 是一个**中间人代理**：客户端把请求发给 Fiddler（127.0.0.1:8888），Fiddler 再转发给服务器，因此能完整看到并修改请求和响应</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">Fiddler 里 HTTPS 请求显示为 `Tunnel to xxx:443`，看不到具体内容，原因是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q2" value="0"> 未安装 Fiddler 根证书，HTTPS 未被解密</label>
<label class="quiz-option"><input type="radio" name="q2" value="1"> 这个请求被服务器拒绝了</label>
<label class="quiz-option"><input type="radio" name="q2" value="2"> 服务器返回的是 304 缓存</label>
<label class="quiz-option"><input type="radio" name="q2" value="3"> Fiddler 版本过低，不支持 HTTPS</label>
</div>
<div class="quiz-explanation">💡 默认情况下 Fiddler 只能看到 HTTPS 的加密隧道，要解密必须安装并信任 Fiddler 根证书。安装后在"受信任的根证书颁发机构"里能找到 `DO_NOT_TRUST_FiddlerRoot`</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">用 Fiddler 抓手机 App 的包，必要条件是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q3" value="0"> 手机必须开启开发者模式并 root</label>
<label class="quiz-option"><input type="radio" name="q3" value="1"> 手机和电脑必须用同一根数据线连接</label>
<label class="quiz-option"><input type="radio" name="q3" value="2"> 必须在手机上安装 Fiddler 客户端</label>
<label class="quiz-option"><input type="radio" name="q3" value="3"> 手机与电脑在同一局域网、手机 WiFi 代理指向电脑 IP:8888，并安装好证书</label>
</div>
<div class="quiz-explanation">💡 三步：同一局域网 → 手机 WiFi 设置手动代理为电脑 IP + 8888 端口 → 用手机浏览器访问 `http://电脑IP:8888` 下载并信任根证书</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">想让某个接口返回自定义的假数据，不依赖后端，应该用 Fiddler 的哪个功能？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q4" value="0"> Composer</label>
<label class="quiz-option"><input type="radio" name="q4" value="1"> Statistics</label>
<label class="quiz-option"><input type="radio" name="q4" value="2"> AutoResponder</label>
<label class="quiz-option"><input type="radio" name="q4" value="3"> QuickExec</label>
</div>
<div class="quiz-explanation">💡 AutoResponder 按规则拦截匹配的请求并直接返回你准备的内容（本地文件或手写响应），是 Fiddler 里做 Mock 的主力功能</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">想手工构造一个请求并发送出去（类似 Postman），应该用？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q5" value="0"> AutoResponder</label>
<label class="quiz-option"><input type="radio" name="q5" value="1"> Filters</label>
<label class="quiz-option"><input type="radio" name="q5" value="2"> Statistics</label>
<label class="quiz-option"><input type="radio" name="q5" value="3"> Composer</label>
</div>
<div class="quiz-explanation">💡 Composer 用来手动构造请求。它和 AutoResponder 的分工是：Composer 负责"主动发出去"，AutoResponder 负责"拦下来改成我要的返回"</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">会话列表里请求太多，只想看某个域名的请求，应该用？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q6" value="0"> Filters 过滤器</label>
<label class="quiz-option"><input type="radio" name="q6" value="1"> Composer</label>
<label class="quiz-option"><input type="radio" name="q6" value="2"> Breakpoints</label>
<label class="quiz-option"><input type="radio" name="q6" value="3"> AutoResponder</label>
</div>
<div class="quiz-explanation">💡 一个页面往往有几十个静态资源请求，Filters 按 Host、状态码、响应类型过滤后，剩下要分析的接口就一目了然了</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">Breakpoints（断点）的作用是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q7" value="0"> 记录请求的执行耗时</label>
<label class="quiz-option"><input type="radio" name="q7" value="1"> 在请求发出前或响应返回前暂停，允许手动修改后再放行</label>
<label class="quiz-option"><input type="radio" name="q7" value="2"> 中断服务器进程以模拟宕机</label>
<label class="quiz-option"><input type="radio" name="q7" value="3"> 自动重放失败的请求</label>
</div>
<div class="quiz-explanation">💡 打上断点后请求会被挂住，可以先改参数、改请求头、改响应体再继续。验证服务端校验是否可靠时，这是最直接的手段</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">相比 Charles 内置的限速功能，用 Fiddler 做弱网模拟通常需要？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q8" value="0"> 更换操作系统</label>
<label class="quiz-option"><input type="radio" name="q8" value="1"> 直接把电脑网线拔掉</label>
<label class="quiz-option"><input type="radio" name="q8" value="2"> 借助脚本或插件来配置带宽、延迟等参数</label>
<label class="quiz-option"><input type="radio" name="q8" value="3"> Fiddler 完全不支持弱网模拟</label>
</div>
<div class="quiz-explanation">💡 这是 Fiddler 和 Charles 的典型差异：Charles 内置 Throttle Settings 按带宽/延迟可视化配置，Fiddler 需要写脚本或装插件。选工具时可以据此权衡</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">Statistics 标签页主要提供什么信息？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q9" value="0"> 当前系统中所有进程的 CPU 占用</label>
<label class="quiz-option"><input type="radio" name="q9" value="1"> 选中请求的性能统计，如各阶段耗时</label>
<label class="quiz-option"><input type="radio" name="q9" value="2"> 历史抓包记录的数据库</label>
<label class="quiz-option"><input type="radio" name="q9" value="3"> 证书的有效期信息</label>
</div>
<div class="quiz-explanation">💡 Statistics 展示请求在 DNS、连接、TLS、等待、传输等各阶段的耗时，用来粗略判断"慢在哪一段"，是前端性能排查的常用入口</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">用 AutoResponder 模拟接口返回 500 错误，主要能验证什么？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q10" value="0"> 服务器的 CPU 承载能力</label>
<label class="quiz-option"><input type="radio" name="q10" value="1"> 数据库的索引是否合理</label>
<label class="quiz-option"><input type="radio" name="q10" value="2"> 网络带宽是否足够</label>
<label class="quiz-option"><input type="radio" name="q10" value="3"> 前端或调用方的容错处理是否正确</label>
</div>
<div class="quiz-explanation">💡 真实环境里很难稳定复现"后端报错"，用 Mock 可以随时构造 500、超时、空数据、超长文本等异常返回，专门验证客户端是否有友好提示、会不会白屏或崩溃</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">想验证服务端是否真的校验了参数，比如把订单金额改成负数，应该怎么做？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q11" value="0"> 用 Breakpoints 或 Composer 篡改参数后重发，观察服务端响应</label>
<label class="quiz-option"><input type="radio" name="q11" value="1"> 在页面上直接输入负数，看前端是否拦截</label>
<label class="quiz-option"><input type="radio" name="q11" value="2"> 用 Filters 过滤掉金额相关的请求</label>
<label class="quiz-option"><input type="radio" name="q11" value="3"> 用 Statistics 查看金额接口的耗时</label>
</div>
<div class="quiz-explanation">💡 前端校验绕不过抓包工具，**必须直接改请求验证服务端**。这是安全测试里"绕过前端校验"类问题的标准手法</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">Fiddler 里浏览器请求一条都抓不到，最可能的原因是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q12" value="0"> 电脑的磁盘空间不足</label>
<label class="quiz-option"><input type="radio" name="q12" value="1"> 浏览器版本太新</label>
<label class="quiz-option"><input type="radio" name="q12" value="2"> 流量没走 Fiddler 代理，比如系统代理未生效或被其他代理工具占用</label>
<label class="quiz-option"><input type="radio" name="q12" value="3"> 目标接口没有使用 HTTPS</label>
</div>
<div class="quiz-explanation">💡 抓不到包先查代理链路：Fiddler 是否在监听、系统的"局域网络代理"是否指向 127.0.0.1:8888、是否被 VPN 或其他抓包工具抢占了代理设置</div>
</div>

<button class="quiz-submit">提交答案</button>
<div class="quiz-score"></div>

</div>

---

## 继续学习

完成测验后，建议继续学习：

- [Fiddler 抓包教程](Fiddler抓包教程-软件测试版.md) - 查看完整教程
- [Charles 抓包测验](Charles抓包测验.md) - 对比另一个抓包工具
- [网络知识测验](网络知识测验.md) - 补 HTTP 协议与证书基础
