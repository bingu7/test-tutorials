---
description: Appium 基础测验，检验 Capabilities、元素定位、上下文切换和框架设计的掌握程度。
---
# Appium 基础测验

!!! abstract "测验说明"
    本测验用于检验 Appium App 自动化教程的学习效果。共 12 道选择题，覆盖环境与 Capabilities、元素定位、等待机制、上下文切换、高级操作和框架设计。

<div class="tutorial-meta">
    <span class="difficulty-badge difficulty-intermediate">📙 中级难度</span>
    <span class="meta-item">⏱ 约 25 分钟</span>
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

<div class="quiz-container" data-quiz-id="appium-basics">

<div class="quiz-item" data-correct="1">
<div class="quiz-question">Android 上要指定被测应用的包名和启动页，对应的 Capabilities 是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q1" value="0"> <code>platformName</code> 和 <code>automationName</code></label>
<label class="quiz-option"><input type="radio" name="q1" value="1"> <code>appPackage</code> 和 <code>appActivity</code></label>
<label class="quiz-option"><input type="radio" name="q1" value="2"> <code>deviceName</code> 和 <code>udid</code></label>
<label class="quiz-option"><input type="radio" name="q1" value="3"> <code>bundleId</code> 和 <code>app</code></label>
</div>
<div class="quiz-explanation">💡 <code>appPackage</code> 是应用包名（如 <code>com.example.app</code>），<code>appActivity</code> 是启动的页面（如 <code>.ui.SplashActivity</code>）。这两个值可以在应用运行时用 adb 命令直接拿到当前焦点窗口，比翻代码快得多</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">从稳定性角度考虑，Android 元素定位方式的优先级应该是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q2" value="0"> XPath 优先，因为它最灵活</label>
<label class="quiz-option"><input type="radio" name="q2" value="1"> class name 优先，因为每个元素都有 class</label>
<label class="quiz-option"><input type="radio" name="q2" value="2"> 坐标点击优先，因为最贴近真实用户操作</label>
<label class="quiz-option"><input type="radio" name="q2" value="3"> resource-id / accessibility id 优先，XPath 作为兜底</label>
</div>
<div class="quiz-explanation">💡 id 类定位直接命中唯一元素，速度快、受布局变化影响小；XPath 需要遍历控件树，速度慢且层级一变就失效。坐标点击最不可取——换个分辨率就点空了</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">Android 上 UiAutomator 定位相比 XPath 的优势是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q3" value="0"> 由系统原生支持，速度更快，还支持"找不到就自动滚动"查找</label>
<label class="quiz-option"><input type="radio" name="q3" value="1"> 语法与 XPath 完全一致，可以互相替换</label>
<label class="quiz-option"><input type="radio" name="q3" value="2"> 可以同时用于 iOS 和 Android</label>
<label class="quiz-option"><input type="radio" name="q3" value="3"> 不需要知道任何元素属性</label>
</div>
<div class="quiz-explanation">💡 UiAutomator 是 Android 原生的自动化框架，Appium 直接调用它，所以在 Android 上比 XPath 更快更稳。它的滚动查找能力还能自动滑动到列表深处的元素，省掉手写循环滑动的麻烦</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">测试内嵌 H5 页面的混合应用（Hybrid App）时，必须先做的是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q4" value="0"> 重启 Appium Server</label>
<label class="quiz-option"><input type="radio" name="q4" value="1"> 把 Capabilities 里的 automationName 改成 XCUITest</label>
<label class="quiz-option"><input type="radio" name="q4" value="2"> 切换到对应的 WebView 上下文，操作完再切回 NATIVE_APP</label>
<label class="quiz-option"><input type="radio" name="q4" value="3"> 关闭 App 的所有权限请求</label>
</div>
<div class="quiz-explanation">💡 Native 与 WebView 是两套独立的上下文，默认停在 NATIVE_APP 时看不到 H5 里的元素。先用 <code>contexts</code> 列出可用上下文并切换过去，之后就能用 Selenium 的 H5 定位方式操作。前提是开发开启了 WebView 调试</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">Appium 中处理元素出现时机不确定的问题，推荐的做法是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q5" value="0"> 在每步操作前统一 <code>time.sleep(3)</code></label>
<label class="quiz-option"><input type="radio" name="q5" value="1"> 使用 WebDriverWait 显式等待，配合 expected_conditions</label>
<label class="quiz-option"><input type="radio" name="q5" value="2"> 关闭启动页，让 App 加载更快</label>
<label class="quiz-option"><input type="radio" name="q5" value="3"> 把隐式等待时间设置成 60 秒</label>
</div>
<div class="quiz-explanation">💡 强制等待会让整套用例的执行时间成倍增长，而且网速慢时依然可能等不够；隐式等待设得太长，一旦元素真的不存在就要白等很久才报错。显式等待只在需要时等待、条件满足立刻继续，是效率与稳定性的平衡点</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">在 Appium 2.x 中想"重置应用状态"，正确的做法是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q6" value="0"> 调用 <code>driver.reset()</code></label>
<label class="quiz-option"><input type="radio" name="q6" value="1"> 直接重启手机</label>
<label class="quiz-option"><input type="radio" name="q6" value="2"> 重新安装一次 Appium Server</label>
<label class="quiz-option"><input type="radio" name="q6" value="3"> 组合使用清数据、关闭应用、重新启动应用等操作</label>
</div>
<div class="quiz-explanation">💡 老教程里常见的 <code>driver.reset()</code> 在 Appium 2.x 已被移除。现在的做法是按需组合：清除应用数据、关闭应用、重新启动应用。照抄旧教程是新手上手时最容易卡住的地方</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">在 Appium 2.x 中模拟"断网"，应该怎么实现？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q7" value="0"> 通过 <code>mobile:</code> 扩展命令控制网络状态</label>
<label class="quiz-option"><input type="radio" name="q7" value="1"> 调用 <code>set_network_connection()</code></label>
<label class="quiz-option"><input type="radio" name="q7" value="2"> 把手机调成飞行模式后重启 Appium</label>
<label class="quiz-option"><input type="radio" name="q7" value="3"> 用 Charles 把带宽限制为 0</label>
</div>
<div class="quiz-explanation">💡 Appium 2.x 把这类设备控制能力统一收进了 <code>mobile:</code> 扩展命令，旧的 <code>set_network_connection</code> / <code>network_connection</code> 已经废弃。用它可以精确控制 WiFi 与移动数据的开关组合</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">iOS 元素定位中，教程一般不推荐使用 XPath，原因是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q8" value="0"> iOS 完全不支持 XPath</label>
<label class="quiz-option"><input type="radio" name="q8" value="1"> XPath 只能定位文本，无法定位按钮</label>
<label class="quiz-option"><input type="radio" name="q8" value="2"> 需要遍历整棵控件树，速度慢且容易因层级变化失效</label>
<label class="quiz-option"><input type="radio" name="q8" value="3"> XPath 在 iOS 上会触发应用崩溃</label>
</div>
<div class="quiz-explanation">💡 iOS 上更推荐 accessibility id，其次是 iOS Predicate 和 Class Chain——后两者是 XCUITest 的原生能力，不走全树遍历，因此更快也更稳定</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">在 Appium 框架中使用 Page Object 模式，主要收益是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q9" value="0"> 可以跳过元素定位，直接操作页面</label>
<label class="quiz-option"><input type="radio" name="q9" value="1"> 把定位与操作封装在页面类中，页面变化时只改一处</label>
<label class="quiz-option"><input type="radio" name="q9" value="2"> 让用例的执行速度提升一倍</label>
<label class="quiz-option"><input type="radio" name="q9" value="3"> 自动生成测试数据</label>
</div>
<div class="quiz-explanation">💡 移动端 UI 变更比 Web 更频繁，如果定位散落在几十个用例里，一次改版就要改几十处。把定位收敛到页面类（配合 BasePage 统一封装等待、截图等公共逻辑），维护成本会显著下降</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">自动化输入中文时失败，常见的绕过方式是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q10" value="0"> 把手机语言切换成英文后重试</label>
<label class="quiz-option"><input type="radio" name="q10" value="1"> 放弃中文输入场景，只测英文</label>
<label class="quiz-option"><input type="radio" name="q10" value="2"> 改用 XPath 定位输入框</label>
<label class="quiz-option"><input type="radio" name="q10" value="3"> 先把中文写入剪贴板，再长按输入框粘贴</label>
</div>
<div class="quiz-explanation">💡 某些输入法或系统版本对自动化发送的中文支持不好，直接输入会丢字或变成乱码。借助剪贴板粘贴是业界通用的绕行方案，注意测试环境要允许 App 读取剪贴板</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">元素能被定位到，但点击后没有任何反应，最可能的排查方向是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q11" value="0"> 元素被遮挡、尚未可点击，或点击的是父容器而非真正响应事件的控件</label>
<label class="quiz-option"><input type="radio" name="q11" value="1"> Appium Server 需要重新安装</label>
<label class="quiz-option"><input type="radio" name="q11" value="2"> 手机电量不足导致触控失灵</label>
<label class="quiz-option"><input type="radio" name="q11" value="3"> 必须改用 UiAutomator 定位才能点击</label>
</div>
<div class="quiz-explanation">💡 这是移动端自动化最典型的"隐性失效"：定位到了不代表能点。常见原因是元素还没有完全可交互（等待条件应该用"可点击"而不是"可见"）、被弹窗或透明层遮挡、或者点在了不接收点击的外层容器上</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">用 <code>adb devices</code> 查看设备时显示 <code>unauthorized</code>，应该怎么处理？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q12" value="0"> 重启 Appium Server 即可恢复</label>
<label class="quiz-option"><input type="radio" name="q12" value="1"> 重新安装手机驱动</label>
<label class="quiz-option"><input type="radio" name="q12" value="2"> 在手机上确认 USB 调试授权弹窗</label>
<label class="quiz-option"><input type="radio" name="q12" value="3"> 把数据线换成原装线</label>
</div>
<div class="quiz-explanation">💡 <code>unauthorized</code> 表示电脑的调试授权还没被设备接受。解锁手机屏幕，在"允许 USB 调试吗"弹窗上点击允许即可（勾选"一律允许"可以避免每次重连都弹）。如果弹窗没出现，可在开发者选项里撤销 USB 调试授权后再插线</div>
</div>

<button class="quiz-submit">提交答案</button>
<div class="quiz-score"></div>

</div>

---

## 继续学习

完成测验后，建议继续学习：

- [Appium App 自动化教程](Appium-App自动化教程-软件测试版.md) - 查看完整教程
- [Selenium 基础测验](Selenium基础测验.md) - 对比 Web 端自动化的异同
- [移动端专项测试测验](../专项测试/移动端专项测试测验.md) - 补齐移动端专项能力
