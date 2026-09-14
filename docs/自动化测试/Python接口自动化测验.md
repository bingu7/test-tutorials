---
description: Python 接口自动化测验，检验 Requests、Pytest、分层设计与 Allure 报告掌握程度。
---
# Python 接口自动化测验

!!! abstract "测验说明"
    本测验用于检验 Python + Requests + Allure 接口自动化教程的学习效果。共 12 道选择题，覆盖请求发送、Pytest 框架、分层设计、配置管理和报告生成。

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

<div class="quiz-container" data-quiz-id="python-api">

<div class="quiz-item" data-correct="1">
<div class="quiz-question">用 requests 发送带查询参数的 GET 请求，推荐写法是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q1" value="0"> requests.get(url + '?' + str(data))</label>
<label class="quiz-option"><input type="radio" name="q1" value="1"> requests.get(url, params={"page": 1})</label>
<label class="quiz-option"><input type="radio" name="q1" value="2"> requests.get(url, json={"page": 1})</label>
<label class="quiz-option"><input type="radio" name="q1" value="3"> requests.get(url, data={"page": 1})</label>
</div>
<div class="quiz-explanation">💡 查询参数用 `params=`，requests 会负责 URL 编码和拼接。手工拼字符串容易漏掉转义，`json=`/`data=` 是请求体参数，不是查询参数</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">提交 JSON 格式的请求体，应该用哪个参数？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q2" value="0"> data=</label>
<label class="quiz-option"><input type="radio" name="q2" value="1"> params=</label>
<label class="quiz-option"><input type="radio" name="q2" value="2"> json=</label>
<label class="quiz-option"><input type="radio" name="q2" value="3"> files=</label>
</div>
<div class="quiz-explanation">💡 `json=` 会自动序列化并设置 `Content-Type: application/json`；`data=` 默认按表单编码提交，接口要求 JSON 时用错会导致 400 或参数解析不到</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">一个测试类里有 10 个接口用例，都需要登录后的 Cookie，最合适的做法是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q3" value="0"> 用 requests.Session() 复用同一个会话对象</label>
<label class="quiz-option"><input type="radio" name="q3" value="1"> 每个用例里手工拼 Cookie 请求头</label>
<label class="quiz-option"><input type="radio" name="q3" value="2"> 把 stream 参数设为 True</label>
<label class="quiz-option"><input type="radio" name="q3" value="3"> 把超时时间调大</label>
</div>
<div class="quiz-explanation">💡 `Session` 会自动保持并复用 Cookie，登录一次即可贯穿后续请求。手工拼 Cookie 既容易写错，也无法应对 Cookie 自动更新的场景</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">Pytest 中 `conftest.py` 的特殊之处在于？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q4" value="0"> 它只能存放测试数据文件</label>
<label class="quiz-option"><input type="radio" name="q4" value="1"> 它必须和测试用例放在同一个文件里</label>
<label class="quiz-option"><input type="radio" name="q4" value="2"> 它定义的函数会自动变成测试用例</label>
<label class="quiz-option"><input type="radio" name="q4" value="3"> 它定义的 Fixture 不需要 import，即可被同目录及子目录的用例使用</label>
</div>
<div class="quiz-explanation">💡 `conftest.py` 是 pytest 的共享 Fixture 入口：放在项目根目录就能被所有用例使用，无需 import。这是消除重复登录、重复初始化代码的关键机制</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">`@pytest.mark.parametrize` 的作用是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q5" value="0"> 把用例标记为跳过</label>
<label class="quiz-option"><input type="radio" name="q5" value="1"> 用多组数据驱动同一个用例，每组数据生成一条独立结果</label>
<label class="quiz-option"><input type="radio" name="q5" value="2"> 让用例按顺序串行执行</label>
<label class="quiz-option"><input type="radio" name="q5" value="3"> 在报告中给用例分组</label>
</div>
<div class="quiz-explanation">💡 参数化是接口测试最常用的能力：一份用例逻辑配多组账号、参数和预期结果，覆盖正常、异常、边界数据，而不用复制十份用例代码</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">Fixture 中使用 `yield` 时，`yield` 之后的代码什么时候执行？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q6" value="0"> 在 Fixture 第一次被调用时立即执行</label>
<label class="quiz-option"><input type="radio" name="q6" value="1"> 永远不会执行</label>
<label class="quiz-option"><input type="radio" name="q6" value="2"> 在用例执行结束后执行，用于清理资源</label>
<label class="quiz-option"><input type="radio" name="q6" value="3"> 在每个 assert 断言之前执行</label>
</div>
<div class="quiz-explanation">💡 `yield` 之前是前置准备，之后是后置清理（关闭连接、删除测试数据、退出浏览器）。这样即使用例失败，清理逻辑也仍然会执行</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">希望整个测试会话只登录一次，登录 Fixture 的 scope 应该设为？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q7" value="0"> scope="session"</label>
<label class="quiz-option"><input type="radio" name="q7" value="1"> scope="function"</label>
<label class="quiz-option"><input type="radio" name="q7" value="2"> scope="module"</label>
<label class="quiz-option"><input type="radio" name="q7" value="3"> scope="class"</label>
</div>
<div class="quiz-explanation">💡 scope 决定 Fixture 的复用范围：`function`（默认，每个用例一次）、`class`、`module`、`session`（整个会话一次）。登录这类昂贵操作放在 `session` 能显著提速</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">`@allure.title()` 的作用是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q8" value="0"> 让用例执行失败时自动重试</label>
<label class="quiz-option"><input type="radio" name="q8" value="1"> 决定用例的执行顺序</label>
<label class="quiz-option"><input type="radio" name="q8" value="2"> 把用例标记为最高优先级</label>
<label class="quiz-option"><input type="radio" name="q8" value="3"> 在 Allure 报告中显示可读的用例标题</label>
</div>
<div class="quiz-explanation">💡 不加 title 时报告里显示的是 `test_login_success` 这类函数名；加上 `@allure.title("正常账号密码登录成功")` 后，报告可读性会好很多</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">分层设计中，`apis/login_api.py` 这类接口封装层的职责是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q9" value="0"> 既发请求又写断言，一个文件搞定所有事</label>
<label class="quiz-option"><input type="radio" name="q9" value="1"> 封装接口的请求发送与响应返回，断言交给用例层</label>
<label class="quiz-option"><input type="radio" name="q9" value="2"> 只负责读取 YAML 配置文件</label>
<label class="quiz-option"><input type="radio" name="q9" value="3"> 负责生成 Allure 测试报告</label>
</div>
<div class="quiz-explanation">💡 分层的好处是职责单一：接口层只管"怎么调"，用例层管"期望什么结果"。接口参数变了只改接口层，不会牵动几十条用例</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">base_url、测试账号这类配置，最合适的存放位置是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q10" value="0"> 直接硬编码在每条用例里</label>
<label class="quiz-option"><input type="radio" name="q10" value="1"> 写在 Allure 报告配置里</label>
<label class="quiz-option"><input type="radio" name="q10" value="2"> YAML 配置文件或环境变量，按环境切换</label>
<label class="quiz-option"><input type="radio" name="q10" value="3"> 放在 conftest.py 的注释里</label>
</div>
<div class="quiz-explanation">💡 配置外置后才能一键切换测试/预发/生产环境，也不用因为改一个域名而全局搜索替换。硬编码在用例里是最难维护的做法</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">接口用例的断言应该怎么做才更有效？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q11" value="0"> 既校验 HTTP 状态码，也校验业务 code 和关键字段</label>
<label class="quiz-option"><input type="radio" name="q11" value="1"> 只校验请求没有抛异常</label>
<label class="quiz-option"><input type="radio" name="q11" value="2"> 只校验状态码是 200 就够了</label>
<label class="quiz-option"><input type="radio" name="q11" value="3"> 只打印响应内容，人工肉眼确认</label>
</div>
<div class="quiz-explanation">💡 很多系统出错时仍返回 HTTP 200，真正的错误藏在响应体的 `code` 里。只断言状态码会漏掉大量缺陷，所以要同时校验业务码和关键业务字段</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">生成 Allure 报告的完整流程是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q12" value="0"> 直接运行 pytest 就会自动生成 HTML 报告</label>
<label class="quiz-option"><input type="radio" name="q12" value="1"> 先 allure generate，再 pytest --alluredir</label>
<label class="quiz-option"><input type="radio" name="q12" value="2"> 只需要安装 allure-pytest 插件即可</label>
<label class="quiz-option"><input type="radio" name="q12" value="3"> 先 pytest --alluredir 产出结果文件，再用 allure generate/serve 生成报告</label>
</div>
<div class="quiz-explanation">💡 两步走：`pytest --alluredir=./reports/allure-results` 产出中间结果，再 `allure serve`（本地预览）或 `allure generate ... --clean`（生成静态 HTML）。顺序颠倒就没有数据可渲染</div>
</div>

<button class="quiz-submit">提交答案</button>
<div class="quiz-score"></div>

</div>

---

## 继续学习

完成测验后，建议继续学习：

- [Python 接口自动化教程](Python+Requests+Allure接口自动化教程-软件测试版.md) - 查看完整教程
- [接口测试进阶测验](../专项测试/接口测试进阶测验.md) - 回看接口测试方法论
- [接口自动化项目实战](../项目实战/接口自动化项目实战.md) - 把 Requests、Pytest、Allure 串成项目
