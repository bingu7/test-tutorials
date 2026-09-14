---
description: Charles 抓包测验，检验 Map Local/Remote、Rewrite、弱网模拟与重放掌握程度。
---
# Charles 抓包测验

!!! abstract "测验说明"
    本测验用于检验 Charles 抓包教程的学习效果。共 12 道选择题，覆盖 Mock 与转发、请求改写、弱网模拟、重放和移动端抓包。

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

<div class="quiz-container" data-quiz-id="charles-basics">

<div class="quiz-item" data-correct="2">
<div class="quiz-question">在"弱网模拟"这件事上，Charles 相比 Fiddler 的优势是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q1" value="0"> Charles 可以直接修改服务器带宽</label>
<label class="quiz-option"><input type="radio" name="q1" value="1"> Charles 通过抓取网卡数据实现限速</label>
<label class="quiz-option"><input type="radio" name="q1" value="2"> Charles 内置 Throttle Settings，可按带宽和延迟直接配置</label>
<label class="quiz-option"><input type="radio" name="q1" value="3"> 两者弱网能力完全一致</label>
</div>
<div class="quiz-explanation">💡 这是两个工具最常被拿来比较的点：Charles 内置限速面板，配置直观；Fiddler 需要写脚本或装插件。移动端测试时 Charles 开箱更省事</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">想用本地的一个 JSON 文件替换服务器返回，应该用哪个功能？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q2" value="0"> Map Remote</label>
<label class="quiz-option"><input type="radio" name="q2" value="1"> Map Local</label>
<label class="quiz-option"><input type="radio" name="q2" value="2"> Rewrite</label>
<label class="quiz-option"><input type="radio" name="q2" value="3"> Repeat</label>
</div>
<div class="quiz-explanation">💡 Map Local 把请求"映射到本地文件"，响应直接由本地内容决定，是做 Mock 最常用的方式。Map Remote 则是把请求转发到另一个远程地址</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">开发在测试环境改了接口，但 App 里写死的是生产域名，想让请求打到测试环境，应该用？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q3" value="0"> Map Local</label>
<label class="quiz-option"><input type="radio" name="q3" value="1"> Throttle Settings</label>
<label class="quiz-option"><input type="radio" name="q3" value="2"> Recording Settings</label>
<label class="quiz-option"><input type="radio" name="q3" value="3"> Map Remote</label>
</div>
<div class="quiz-explanation">💡 Map Remote 把请求转发到另一个远程地址，可以在**不改客户端代码**的前提下把流量引到测试环境，是环境切换类问题的常用解法</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">Rewrite 功能的主要用途是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q4" value="0"> 按规则批量改写请求或响应内容，用于异常场景和容错验证</label>
<label class="quiz-option"><input type="radio" name="q4" value="1"> 重命名抓到的会话</label>
<label class="quiz-option"><input type="radio" name="q4" value="2"> 压缩响应体以节省流量</label>
<label class="quiz-option"><input type="radio" name="q4" value="3"> 把 HTTP 请求转换成 HTTPS</label>
</div>
<div class="quiz-explanation">💡 Rewrite 按规则自动改写请求头、请求体、响应状态码或字段值，可以批量构造异常数据（如把 `"code":0` 改成 `1`），比手工改更稳定可复现</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">想原样再发一次刚才抓到的请求，应该用？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q5" value="0"> Map Local</label>
<label class="quiz-option"><input type="radio" name="q5" value="1"> Rewrite</label>
<label class="quiz-option"><input type="radio" name="q5" value="2"> Throttle Settings</label>
<label class="quiz-option"><input type="radio" name="q5" value="3"> Repeat / Advanced Repeat</label>
</div>
<div class="quiz-explanation">💡 右键请求选 Repeat 即可重发；Advanced Repeat 可以指定次数和并发。做重放攻击或幂等性验证时都靠它</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">Charles 能看清 HTTPS 请求内容的前提是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q6" value="0"> 关闭浏览器的 HTTPS 支持</label>
<label class="quiz-option"><input type="radio" name="q6" value="1"> 安装并信任 Charles 根证书，同时在 SSL Proxying Settings 中启用并配置代理范围</label>
<label class="quiz-option"><input type="radio" name="q6" value="2"> 把接口改成 HTTP 再抓</label>
<label class="quiz-option"><input type="radio" name="q6" value="3"> 在服务器上关闭 TLS</label>
</div>
<div class="quiz-explanation">💡 两步缺一不可：安装并信任根证书（Help → SSL Proxying → Install Charles Root Certificate），再在 Proxy → SSL Proxying Settings 勾选 Enable SSL Proxying 并配置要解密的域名</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">用 Charles 抓手机 App 的包，正确配置是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q7" value="0"> 手机安装 Charles App 后直接抓包</label>
<label class="quiz-option"><input type="radio" name="q7" value="1"> 用数据线把手机连到电脑即可</label>
<label class="quiz-option"><input type="radio" name="q7" value="2"> 手机与电脑同一局域网，WiFi 代理设为电脑 IP 的 8888 端口，并安装手机端证书</label>
<label class="quiz-option"><input type="radio" name="q7" value="3"> 手机开启飞行模式后连接 WiFi</label>
</div>
<div class="quiz-explanation">💡 和 Fiddler 思路一致：同一局域网 → 手机 WiFi 代理指向电脑 IP:8888 → 手机浏览器访问 `chls.pro/ssl` 下载并信任证书。抓包时 Charles 会弹出确认框，需要点 Allow</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">Recording Settings 的作用是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q8" value="0"> 只记录指定域名或路径的请求，减少无关流量干扰</label>
<label class="quiz-option"><input type="radio" name="q8" value="1"> 把抓包记录导出成测试报告</label>
<label class="quiz-option"><input type="radio" name="q8" value="2"> 限制每秒最多抓多少条请求</label>
<label class="quiz-option"><input type="radio" name="q8" value="3"> 自动录制操作步骤生成自动化脚本</label>
</div>
<div class="quiz-explanation">💡 不加过滤时会抓到大量图片、埋点、CDN 请求。在 Recording Settings 里限定目标域名，列表会清爽很多，定位接口更快</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">Charles 的 Breakpoints 与 Rewrite 的区别是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q9" value="0"> 两者完全等价，只是入口不同</label>
<label class="quiz-option"><input type="radio" name="q9" value="1"> Breakpoints 是单次手动暂停修改，Rewrite 是按规则自动批量改写</label>
<label class="quiz-option"><input type="radio" name="q9" value="2"> Breakpoints 只能改响应，Rewrite 只能改请求</label>
<label class="quiz-option"><input type="radio" name="q9" value="3"> Rewrite 需要专业版才能使用</label>
</div>
<div class="quiz-explanation">💡 临时探一探用 Breakpoints（挂住请求手动改），要反复复现同一类异常就用 Rewrite（规则化、可复用）。**能选对工具是效率差异的关键**</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">Charles 默认监听的代理端口是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q10" value="0"> 8080</label>
<label class="quiz-option"><input type="radio" name="q10" value="1"> 8000</label>
<label class="quiz-option"><input type="radio" name="q10" value="2"> 443</label>
<label class="quiz-option"><input type="radio" name="q10" value="3"> 8888</label>
</div>
<div class="quiz-explanation">💡 Charles 和 Fiddler 的默认代理端口都是 8888（可在 Proxy → Proxy Settings 中修改）。手机配置代理时填的就是这个端口</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">做"重放攻击"测试，基本思路是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q11" value="0"> 用 Throttle 把网速降到最低再重试</label>
<label class="quiz-option"><input type="radio" name="q11" value="1"> 用 Map Local 把接口改成返回错误</label>
<label class="quiz-option"><input type="radio" name="q11" value="2"> 抓取一次支付或下单请求，用 Repeat 重复发送，验证服务端是否做了防重放/幂等</label>
<label class="quiz-option"><input type="radio" name="q11" value="3"> 用 Rewrite 修改响应状态码为 500</label>
</div>
<div class="quiz-explanation">💡 重放攻击验证的是"同一个请求被重复提交会怎样"。若服务端没做幂等或防重放校验，就可能重复下单、重复扣款——这是安全测试的高价值场景</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">要模拟"2G 弱网下 App 的表现"，正确入口是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q12" value="0"> Proxy → Throttle Settings，启用后选择预设或自定义带宽与延迟</label>
<label class="quiz-option"><input type="radio" name="q12" value="1"> Tools → Rewrite</label>
<label class="quiz-option"><input type="radio" name="q12" value="2"> Tools → Map Local</label>
<label class="quiz-option"><input type="radio" name="q12" value="3"> Help → SSL Proxying</label>
</div>
<div class="quiz-explanation">💡 Throttle Settings 可以选预设（如 3G、2G）或自定义带宽、延迟、丢包率。底部状态栏会出现 Throttle 状态标识，避免忘记关闭导致"环境莫名其妙变慢"</div>
</div>

<button class="quiz-submit">提交答案</button>
<div class="quiz-score"></div>

</div>

---

## 继续学习

完成测验后，建议继续学习：

- [Charles 抓包教程](Charles抓包教程-软件测试版.md) - 查看完整教程
- [Fiddler 抓包测验](Fiddler抓包测验.md) - 对比另一个抓包工具
- [接口抓包联调实战教程](接口抓包联调实战教程-软件测试版.md) - 把抓包用到真实联调
