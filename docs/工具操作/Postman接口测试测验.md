---
description: Postman 接口测试测验，检验请求构造、变量作用域、Tests 断言与 Newman 掌握程度。
---
# Postman 接口测试测验

!!! abstract "测验说明"
    本测验用于检验 Postman 接口测试教程的学习效果。共 12 道选择题，覆盖请求构造、变量管理、Tests 断言、数据驱动与 Newman。

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

<div class="quiz-container" data-quiz-id="postman-basics">

<div class="quiz-item" data-correct="1">
<div class="quiz-question">Postman 和 Fiddler 最核心的区别是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q1" value="0"> 两者功能完全相同，只是界面风格不同</label>
<label class="quiz-option"><input type="radio" name="q1" value="1"> Postman 主动构造并发送请求，Fiddler 抓取已经发生的真实流量</label>
<label class="quiz-option"><input type="radio" name="q1" value="2"> Postman 只能抓包，Fiddler 只能发请求</label>
<label class="quiz-option"><input type="radio" name="q1" value="3"> Postman 不能发送 JSON 请求，Fiddler 可以</label>
</div>
<div class="quiz-explanation">💡 定位不同：Postman 是"主动发起"的接口调试工具，负责构造请求；Fiddler/Charles 是"被动拦截"的代理抓包工具，用于看清 App 或浏览器真实发出了什么请求。**实践里常配合使用**</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">Postman 变量作用域由低到高排列，正确的是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q2" value="0"> Local &lt; Data &lt; Environment &lt; Collection &lt; Global</label>
<label class="quiz-option"><input type="radio" name="q2" value="1"> Environment &lt; Global &lt; Collection &lt; Data &lt; Local</label>
<label class="quiz-option"><input type="radio" name="q2" value="2"> Global &lt; Collection &lt; Environment &lt; Data &lt; Local</label>
<label class="quiz-option"><input type="radio" name="q2" value="3"> 所有作用域优先级相同，随机取值</label>
</div>
<div class="quiz-explanation">💡 优先级由低到高是 Global &lt; Collection &lt; Environment &lt; Data &lt; Local。同名变量时高层级覆盖低层级——这正是"改了环境变量却不生效"这类问题的根因</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">同一个变量名既在环境（Environment）中定义，也在集合（Collection）中定义，请求里写 `{{baseUrl}}` 时取哪个值？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q3" value="0"> 环境变量的值，因为 Environment 优先级更高</label>
<label class="quiz-option"><input type="radio" name="q3" value="1"> 集合变量的值，因为 Collection 范围更大</label>
<label class="quiz-option"><input type="radio" name="q3" value="2"> 两个值会随机取一个</label>
<label class="quiz-option"><input type="radio" name="q3" value="3"> 请求会直接报错，提示变量冲突</label>
</div>
<div class="quiz-explanation">💡 Environment 高于 Collection，所以取环境变量的值。排查"变量没生效"时，第一步就是确认是不是有同名变量在高优先级作用域里覆盖了它</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">Postman 中 Tests 脚本的执行时机是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q4" value="0"> 在请求发送之前执行</label>
<label class="quiz-option"><input type="radio" name="q4" value="1"> 只在 Collection Runner 中执行</label>
<label class="quiz-option"><input type="radio" name="q4" value="2"> 需要手动点击才会执行</label>
<label class="quiz-option"><input type="radio" name="q4" value="3"> 请求返回后自动执行，用于验证响应是否符合预期</label>
</div>
<div class="quiz-explanation">💡 Tests 是断言脚本，收到响应后自动运行，是接口自动化的核心。发送前的准备工作则放在 Pre-request Script 中</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">断言"响应状态码为 200"，正确的写法是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q5" value="0"> assert pm.status == 200</label>
<label class="quiz-option"><input type="radio" name="q5" value="1"> pm.test("状态码为 200", function () { pm.response.to.have.status(200); })</label>
<label class="quiz-option"><input type="radio" name="q5" value="2"> console.log(pm.response.code = 200)</label>
<label class="quiz-option"><input type="radio" name="q5" value="3"> if (pm.response) { 200 }</label>
</div>
<div class="quiz-explanation">💡 Postman 用 `pm.test()` 包裹断言，`pm.response.to.have.status(200)` 做状态码校验。右侧 Snippets 面板可以直接点击插入这些模板，不需要背语法</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">登录接口返回 token，后续请求都要带它，正确做法是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q6" value="0"> 每次手工复制粘贴到请求头里</label>
<label class="quiz-option"><input type="radio" name="q6" value="1"> 在 Params 里直接写死 token</label>
<label class="quiz-option"><input type="radio" name="q6" value="2"> 在登录的 Tests 里把响应中的 token 写入环境变量，后续请求用 {{token}} 引用</label>
<label class="quiz-option"><input type="radio" name="q6" value="3"> 把 token 写进 Pre-request Script 的注释里</label>
</div>
<div class="quiz-explanation">💡 在 Tests 中用 `pm.environment.set("token", ...)` 提取并保存，后续请求通过 `{{token}}` 引用。这样才能在 Collection Runner 里连续跑通"登录 → 查订单"这类有依赖的流程</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">Pre-request Script 与 Tests 的执行时机有什么不同？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q7" value="0"> Pre-request Script 在请求发送前执行，Tests 在收到响应后执行</label>
<label class="quiz-option"><input type="radio" name="q7" value="1"> 两者都在响应返回后执行，只是顺序不同</label>
<label class="quiz-option"><input type="radio" name="q7" value="2"> Pre-request Script 只在第一次请求时执行</label>
<label class="quiz-option"><input type="radio" name="q7" value="3"> Tests 在请求发送前执行，用于准备数据</label>
</div>
<div class="quiz-explanation">💡 请求前用 Pre-request Script 准备动态参数（如签名、时间戳），请求后用 Tests 做断言和数据提取。两者时机不同，职责也不同</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">要用同一个登录接口批量验证 50 组账号密码，最合适的做法是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q8" value="0"> 复制 50 个请求，逐个手改参数</label>
<label class="quiz-option"><input type="radio" name="q8" value="1"> 写 50 个不同的 Collection</label>
<label class="quiz-option"><input type="radio" name="q8" value="2"> 用 Mock Server 自动生成 50 组结果</label>
<label class="quiz-option"><input type="radio" name="q8" value="3"> 用 CSV/JSON 数据文件配合 Collection Runner 做数据驱动测试</label>
</div>
<div class="quiz-explanation">💡 数据驱动：把账号密码放在 CSV/JSON 文件里，请求中用 `{{username}}` 这类变量引用，再由 Collection Runner 迭代执行，每次迭代生成一条独立结果</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">Newman 在接口测试流程中的作用是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q9" value="0"> 自动生成接口测试用例</label>
<label class="quiz-option"><input type="radio" name="q9" value="1"> 替代 Postman 图形界面，用来手工调试请求</label>
<label class="quiz-option"><input type="radio" name="q9" value="2"> 用命令行运行导出的 Collection，便于接入 CI/CD 持续执行</label>
<label class="quiz-option"><input type="radio" name="q9" value="3"> 把接口文档转换成测试报告</label>
</div>
<div class="quiz-explanation">💡 Newman 是 Postman 的命令行运行器。只有能在命令行跑，接口用例才能进流水线，这是"手工调试"走向"持续回归"的关键一步</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">后端接口还没开发完，但前端需要先联调，可以用 Postman 的哪个功能？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q10" value="0"> Newman</label>
<label class="quiz-option"><input type="radio" name="q10" value="1"> Mock Server</label>
<label class="quiz-option"><input type="radio" name="q10" value="2"> Pre-request Script</label>
<label class="quiz-option"><input type="radio" name="q10" value="3"> Cookies 管理</label>
</div>
<div class="quiz-explanation">💡 Mock Server 按约定的响应结构返回假数据，让前端和测试在后端就绪前就能开工。测试侧也可以用它模拟各种异常返回，验证容错</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">Collection Runner 相比单个请求点击 Send，主要优势是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q11" value="0"> 按顺序批量执行整个集合，并汇总所有断言结果</label>
<label class="quiz-option"><input type="radio" name="q11" value="1"> 可以绕过鉴权直接访问接口</label>
<label class="quiz-option"><input type="radio" name="q11" value="2"> 能自动生成接口文档</label>
<label class="quiz-option"><input type="radio" name="q11" value="3"> 可以提升接口的响应速度</label>
</div>
<div class="quiz-explanation">💡 Runner 让一组请求按顺序连续执行并统计通过率，是"接口回归测试"的雏形。有依赖的流程（先登录后查询）也靠它串起来</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">接口返回 401，最常见的原因是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q12" value="0"> 请求的 URL 拼写错误</label>
<label class="quiz-option"><input type="radio" name="q12" value="1"> 请求体不是合法的 JSON</label>
<label class="quiz-option"><input type="radio" name="q12" value="2"> 服务器内部异常</label>
<label class="quiz-option"><input type="radio" name="q12" value="3"> 未携带鉴权信息，或 Token 已过期、失效</label>
</div>
<div class="quiz-explanation">💡 401 是鉴权问题：Token 缺失、过期或格式不对。403 才是"已认证但没有权限"。URL 错误通常是 404，服务端异常是 5xx。**区分 401 和 403 是接口测试的基本功**</div>
</div>

<button class="quiz-submit">提交答案</button>
<div class="quiz-score"></div>

</div>

---

## 继续学习

完成测验后，建议继续学习：

- [Postman 接口测试教程](Postman接口测试教程-软件测试版.md) - 查看完整教程
- [接口测试基础测验](../专项测试/接口测试基础测验.md) - 检验接口测试方法论
- [章节练习与参考答案](../章节练习与参考答案.md) - 更多接口练习
