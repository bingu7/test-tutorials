---
description: Selenium 基础测验，检验元素定位、等待机制和 Page Object 掌握程度。
---
# Selenium 基础测验

!!! abstract "测验说明"
    本测验用于检验 Selenium Web 自动化教程的学习效果。共 12 道选择题，覆盖元素定位、等待机制、窗口与 iframe、Page Object 和框架设计。

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

<div class="quiz-container" data-quiz-id="selenium-basics">

<div class="quiz-item" data-correct="1">
<div class="quiz-question">相比写成 `/html/body/div/form/input[1]` 的绝对 XPath，推荐用 `[data-testid='login-submit']` 这类定位方式，主要原因是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q1" value="0"> 绝对 XPath 语法更复杂，容易写错</label>
<label class="quiz-option"><input type="radio" name="q1" value="1"> 不依赖 DOM 层级，页面结构调整时不会失效</label>
<label class="quiz-option"><input type="radio" name="q1" value="2"> 绝对 XPath 只能定位第一个匹配元素</label>
<label class="quiz-option"><input type="radio" name="q1" value="3"> CSS 选择器执行速度比 XPath 慢</label>
</div>
<div class="quiz-explanation">💡 绝对 XPath 把整条 DOM 路径写死，页面多一层 div 就失效。`data-testid` 是前端专门为测试预留的属性，重构时不会被改掉，稳定性最好</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">三种等待方式中，教程推荐日常使用哪一种？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q2" value="0"> 强制等待 time.sleep()</label>
<label class="quiz-option"><input type="radio" name="q2" value="1"> 隐式等待 implicitly_wait()</label>
<label class="quiz-option"><input type="radio" name="q2" value="2"> 显式等待 WebDriverWait + expected_conditions</label>
<label class="quiz-option"><input type="radio" name="q2" value="3"> 三种混用，覆盖面最广</label>
</div>
<div class="quiz-explanation">💡 `time.sleep()` 是固定死等，快了慢了他都不知道；隐式等待只能等"元素存在"。显式等待可以等具体条件（可见、可点击、文本出现），条件满足就立刻继续，推荐只用显式等待</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">`WebDriverWait(driver, 10).until(...)` 中的 10 表示？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q3" value="0"> 最长等待 10 秒，条件一旦满足立即继续</label>
<label class="quiz-option"><input type="radio" name="q3" value="1"> 必须等待满 10 秒才继续执行</label>
<label class="quiz-option"><input type="radio" name="q3" value="2"> 每 10 秒检查一次条件</label>
<label class="quiz-option"><input type="radio" name="q3" value="3"> 超时后自动重试整个用例 10 次</label>
</div>
<div class="quiz-explanation">💡 10 秒是**超时上限**，内部按约 500ms 轮询。元素提前出现就提前返回，只在超时仍不满足时才抛异常，所以比 `sleep` 又快又稳</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">关于隐式等待与显式等待混用，正确的说法是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q4" value="0"> 混用可以叠加，等待时间变成两者之和，效果最好</label>
<label class="quiz-option"><input type="radio" name="q4" value="1"> 混用会让隐式等待完全失效</label>
<label class="quiz-option"><input type="radio" name="q4" value="2"> 混用没有影响，可以随意搭配</label>
<label class="quiz-option"><input type="radio" name="q4" value="3"> 两者可能冲突导致等待行为不可预期，推荐只用显式等待</label>
</div>
<div class="quiz-explanation">💡 隐式等待是全局的，会作用到每次元素查找上，和显式等待叠加后实际等待时长难以推算。教程建议**只用显式等待**，行为更可预期</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">元素在 iframe 内部，直接查找会报错，应该先怎么做？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q5" value="0"> driver.switch_to.frame(...) 切进该 iframe</label>
<label class="quiz-option"><input type="radio" name="q5" value="1"> driver.switch_to.window(...) 切到新窗口</label>
<label class="quiz-option"><input type="radio" name="q5" value="2"> driver.refresh() 刷新页面</label>
<label class="quiz-option"><input type="radio" name="q5" value="3"> 加大隐式等待时间</label>
</div>
<div class="quiz-explanation">💡 WebDriver 默认只在最外层文档查找元素，iframe 内的元素必须先 `switch_to.frame()` 切入，处理完再用 `switch_to.default_content()` 切回主文档</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">点击链接后页面在新标签页打开，要操作新页面应该？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q6" value="0"> 重新实例化一个 driver</label>
<label class="quiz-option"><input type="radio" name="q6" value="1"> 用 driver.refresh() 刷新即可切换</label>
<label class="quiz-option"><input type="radio" name="q6" value="2"> 用 driver.switch_to.window(handle) 切换到新窗口句柄</label>
<label class="quiz-option"><input type="radio" name="q6" value="3"> 不需要切换，WebDriver 会自动跟随</label>
</div>
<div class="quiz-explanation">💡 点击前先记录 `driver.window_handles`，点击后用 `switch_to.window()` 切到新句柄。WebDriver 不会自动跟随新标签页</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">使用 Page Object 模式最核心的收益是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q7" value="0"> 让用例执行速度更快</label>
<label class="quiz-option"><input type="radio" name="q7" value="1"> 页面元素定位与用例逻辑分离，元素变化时只改一处</label>
<label class="quiz-option"><input type="radio" name="q7" value="2"> 可以完全不需要写断言</label>
<label class="quiz-option"><input type="radio" name="q7" value="3"> 自动处理验证码和登录</label>
</div>
<div class="quiz-explanation">💡 不用 PO 时，同一个输入框的定位散落在十几个用例里，元素一变就要改一堆地方。PO 把定位和页面操作收敛到页面类中，用例只调用业务方法</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">自动化用例在 CI 上失败，但本地跑通过，为了快速定位应该优先补充什么？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q8" value="0"> 把等待时间统一改成 60 秒</label>
<label class="quiz-option"><input type="radio" name="q8" value="1"> 给用例加上更多 print 输出</label>
<label class="quiz-option"><input type="radio" name="q8" value="2"> 直接重跑三次，能过就算通过</label>
<label class="quiz-option"><input type="radio" name="q8" value="3"> 失败时自动截图并保留日志和页面源码</label>
</div>
<div class="quiz-explanation">💡 CI 上失败往往和环境、数据、时机有关，本地无法复现。失败截图 + 日志能还原失败瞬间的页面状态，是最有效的排查手段。无限加大等待只会掩盖问题</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">`driver.find_element()` 没有找到匹配元素时会怎样？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q9" value="0"> 返回 None，需要自己判空</label>
<label class="quiz-option"><input type="radio" name="q9" value="1"> 自动等待到元素出现为止</label>
<label class="quiz-option"><input type="radio" name="q9" value="2"> 抛出 NoSuchElementException 异常</label>
<label class="quiz-option"><input type="radio" name="q9" value="3"> 返回页面第一个可交互元素</label>
</div>
<div class="quiz-explanation">💡 找不到就抛异常，不会返回 None，也不会自动等待。所以关键元素操作前要用显式等待，让"元素还没渲染出来"这种情况被等待覆盖掉</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">测试结束后要关闭浏览器并释放驱动进程，应该用？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q10" value="0"> driver.quit()</label>
<label class="quiz-option"><input type="radio" name="q10" value="1"> driver.close()</label>
<label class="quiz-option"><input type="radio" name="q10" value="2"> driver.stop()</label>
<label class="quiz-option"><input type="radio" name="q10" value="3"> 什么都不做，脚本结束会自动释放</label>
</div>
<div class="quiz-explanation">💡 `close()` 只关闭当前标签页，`quit()` 会退出浏览器并结束 WebDriver 会话。放在 teardown/fixture 的收尾里用 `quit()`，否则会残留大量驱动进程</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">Selenium 4 的"相对定位器"（Relative Locators）用来解决什么问题？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q11" value="0"> 按元素在源码中的顺序定位</label>
<label class="quiz-option"><input type="radio" name="q11" value="1"> 按元素之间的相对位置定位，如 near、above、to_right_of</label>
<label class="quiz-option"><input type="radio" name="q11" value="2"> 按元素出现的时间先后定位</label>
<label class="quiz-option"><input type="radio" name="q11" value="3"> 按元素的层级深度定位</label>
</div>
<div class="quiz-explanation">💡 当元素本身没有稳定的 id/class，但和某个好定位的元素有固定位置关系时，可以用 `locate_with(...).near()`、`.above()` 这类相对定位表达，提升可读性</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">下面哪种场景**最不适合**做 UI 自动化？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q12" value="0"> 登录、下单等高频核心流程的回归</label>
<label class="quiz-option"><input type="radio" name="q12" value="1"> 需要每天重复执行的多浏览器兼容性检查</label>
<label class="quiz-option"><input type="radio" name="q12" value="2"> 数据准备类的前置操作</label>
<label class="quiz-option"><input type="radio" name="q12" value="3"> 界面样式和视觉效果的一次性主观评估</label>
</div>
<div class="quiz-explanation">💡 自动化的收益来自**重复执行 + 结果可断言**。视觉美观度这类需要人主观判断、且不重复的场景，投入产出比很低，更适合人工评审</div>
</div>

<button class="quiz-submit">提交答案</button>
<div class="quiz-score"></div>

</div>

---

## 继续学习

完成测验后，建议继续学习：

- [Selenium Web 自动化教程](Selenium-Web自动化教程-软件测试版.md) - 查看完整教程
- [Playwright 基础测验](Playwright基础测验.md) - 对比另一个 Web 自动化框架
- [Web 自动化项目实战](../项目实战/Web自动化项目实战.md) - 把定位和等待用到真实项目
