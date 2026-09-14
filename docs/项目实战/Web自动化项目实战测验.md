---
description: Web 自动化项目实战测验，检验范围选择、页面对象、等待策略与失败产物设计能力。
---
# Web 自动化项目实战测验

!!! abstract "测验说明"
    本测验用于检验 Web 自动化项目实战的学习效果。共 12 道选择题，覆盖自动化范围选择、页面对象模型、元素定位、等待策略、失败截图与 CI 运行。

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

<div class="quiz-container" data-quiz-id="web-auto-project">

<div class="quiz-item" data-correct="1">
<div class="quiz-question">写 Web 自动化脚本前，第一步应该做什么？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q1" value="0"> 先把页面对象类全部写好，再考虑流程</label>
<label class="quiz-option"><input type="radio" name="q1" value="1"> 先手工把流程走通，记录页面地址、账号、步骤、需要定位的元素和加载较慢的环节</label>
<label class="quiz-option"><input type="radio" name="q1" value="2"> 先配好 CI 流水线，让脚本自动跑起来</label>
<label class="quiz-option"><input type="radio" name="q1" value="3"> 先用录制工具录一遍脚本</label>
</div>
<div class="quiz-explanation">💡 教程的原话是"手工都走不通时，不要写自动化"。因为这时你分不清失败是业务问题、环境问题还是脚本问题。手工阶段的记录会直接变成自动化脚本的基础</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">下列哪类场景最适合第一版自动化？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q2" value="0"> 登录主流程、搜索商品、加入购物车</label>
<label class="quiz-option"><input type="radio" name="q2" value="1"> 图片视觉细节比对</label>
<label class="quiz-option"><input type="radio" name="q2" value="2"> 频繁改版的活动页</label>
<label class="quiz-option"><input type="radio" name="q2" value="3"> 第三方真实支付流程</label>
</div>
<div class="quiz-explanation">💡 教程按"高频、稳定、回归价值高"挑选自动化范围。图片视觉细节断言成本高且容易误报，活动页改版快维护成本高，真实支付依赖外部环境不稳定，都属于第一版不建议自动化的场景</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">元素定位方式的优先级，最高的是哪一项？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q3" value="0"> XPath</label>
<label class="quiz-option"><input type="radio" name="q3" value="1"> CSS 选择器</label>
<label class="quiz-option"><input type="radio" name="q3" value="2"> 与前端约定的 <code>data-testid</code></label>
<label class="quiz-option"><input type="radio" name="q3" value="3"> 按元素在页面中的索引位置定位</label>
</div>
<div class="quiz-explanation">💡 教程给出的优先级是：<code>data-testid</code> → role / label / text → CSS 选择器 → XPath。XPath 作为兜底，不建议大量依赖，因为页面结构一调整就容易失效</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">页面对象模型（Page Object）的核心目的是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q4" value="0"> 让用例执行速度更快</label>
<label class="quiz-option"><input type="radio" name="q4" value="1"> 把页面细节和测试用例分离，页面改动时只需要改页面对象</label>
<label class="quiz-option"><input type="radio" name="q4" value="2"> 减少断言数量，让用例更短</label>
<label class="quiz-option"><input type="radio" name="q4" value="3"> 免除等待设置</label>
</div>
<div class="quiz-explanation">💡 教程提醒"不要在测试用例里堆大量定位器，否则页面一改维护成本会很高"。POM 让页面元素和页面行为集中在一处，用例只描述场景和断言</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">关于等待策略，教程推荐的做法是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q5" value="0"> 在每个操作后统一加 3 秒 <code>sleep</code></label>
<label class="quiz-option"><input type="radio" name="q5" value="1"> 完全不等待，失败就重试</label>
<label class="quiz-option"><input type="radio" name="q5" value="2"> 用 <code>while</code> 循环不停轮询元素</label>
<label class="quiz-option"><input type="radio" name="q5" value="3"> 优先等待元素可见、可点击或网络响应完成，不把固定 <code>sleep</code> 作为主要等待方式</label>
</div>
<div class="quiz-explanation">💡 教程指出 Web 自动化失败很多时候不是功能缺陷，而是等待策略不合理。固定 <code>sleep</code> 要么不够要么浪费时间，Playwright 的 <code>wait_for</code> 和 Selenium 的显式等待才是正确做法</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">Web 自动化用例失败时，至少应该保留哪些产物？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q6" value="0"> 只要一句失败原因就够了</label>
<label class="quiz-option"><input type="radio" name="q6" value="1"> 只需要一张全屏截图</label>
<label class="quiz-option"><input type="radio" name="q6" value="2"> 截图、页面 HTML、浏览器日志、测试日志，Playwright 场景下还可以保留 Trace</label>
<label class="quiz-option"><input type="radio" name="q6" value="3"> 只需要当时的测试数据</label>
</div>
<div class="quiz-explanation">💡 每一样产物回答不同问题：截图看页面状态，HTML 判断元素是否存在，浏览器日志发现前端异常，测试日志还原步骤，Trace 可以回放整个失败过程。少一样都会拉长排查时间</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">按照教程的目录结构，<code>tests/</code> 目录的职责是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q7" value="0"> 只描述测试场景和断言</label>
<label class="quiz-option"><input type="radio" name="q7" value="1"> 存放页面元素和页面行为</label>
<label class="quiz-option"><input type="radio" name="q7" value="2"> 存放浏览器启动、截图、日志等通用能力</label>
<label class="quiz-option"><input type="radio" name="q7" value="3"> 存放测试数据</label>
</div>
<div class="quiz-explanation">💡 教程的划分很清楚：<code>pages/</code> 放页面元素和页面行为，<code>tests/</code> 只描述场景和断言，<code>common/</code> 放浏览器启动、截图、日志，测试数据单独管理不硬编码在脚本里</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">报告中为什么不能只看"通过率"？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q8" value="0"> 因为通过率算不出来</label>
<label class="quiz-option"><input type="radio" name="q8" value="1"> 如果失败集中在等待、环境、测试数据上，说明框架稳定性还需要优化，通过率高低说明不了这一点</label>
<label class="quiz-option"><input type="radio" name="q8" value="2"> 因为通过率越高说明用例越少</label>
<label class="quiz-option"><input type="radio" name="q8" value="3"> 因为报告只能看截图</label>
</div>
<div class="quiz-explanation">💡 教程建议报告里要包含用例名称、执行环境、浏览器版本、失败截图、失败步骤、错误堆栈和耗时。把这些维度打开看，才能分清是产品缺陷还是框架本身不稳定</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">关于 Selenium 与 Playwright 的选型建议是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q9" value="0"> 新项目必须用 Selenium</label>
<label class="quiz-option"><input type="radio" name="q9" value="1"> 两者只能二选一，选定后不能引入另一种</label>
<label class="quiz-option"><input type="radio" name="q9" value="2"> 新项目优先考虑 Playwright；已有 Selenium 框架的团队可以继续维护并逐步引入 Playwright 处理复杂场景</label>
<label class="quiz-option"><input type="radio" name="q9" value="3"> 用 JMeter 做 Web UI 自动化</label>
</div>
<div class="quiz-explanation">💡 教程对两者的定位是：Selenium 生态成熟，适合传统 Web 自动化和多语言团队；Playwright 自动等待、Trace、网络拦截能力强，适合现代 Web 项目。选型要结合团队现状，不是非此即彼</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">为什么第一版不建议自动化真实支付？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q10" value="0"> 支付页面没有可以被定位的元素</label>
<label class="quiz-option"><input type="radio" name="q10" value="1"> 支付流程不需要测试</label>
<label class="quiz-option"><input type="radio" name="q10" value="2"> 自动化工具打不开支付页面</label>
<label class="quiz-option"><input type="radio" name="q10" value="3"> 支付依赖第三方沙箱、回调和风控规则，环境不稳定，更适合放到接口或联调环境中验证</label>
</div>
<div class="quiz-explanation">💡 教程把真实支付放进"不建议第一版自动化"清单，原因是不稳定、回归价值被环境问题稀释。Web 自动化自动化的应该是提交订单前的前置流程，而不是真实资金链路</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">订单前置流程自动化的最后一步，断言应该是什么？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q11" value="0"> 完成真实支付，并校验订单状态为已支付</label>
<label class="quiz-option"><input type="radio" name="q11" value="1"> 提交订单前做拦截，校验地址和金额展示正确，不进入真实支付</label>
<label class="quiz-option"><input type="radio" name="q11" value="2"> 断言数据库中的库存已经扣减</label>
<label class="quiz-option"><input type="radio" name="q11" value="3"> 断言已经收到支付回调</label>
</div>
<div class="quiz-explanation">💡 教程的订单前置流程把边界停在"提交订单前拦截"，只校验商品勾选、结算页跳转和地址金额展示。库存扣减和支付回调属于接口与数据层的验证范围，放在 Web UI 层既慢又不稳定</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">关于用例拆分，教程推荐的做法是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q12" value="0"> 每个用例能单独运行，定位器收进页面对象，不在用例里堆大量元素选择</label>
<label class="quiz-option"><input type="radio" name="q12" value="1"> 把整个下单流程写进一条超长用例，方便一次性看完</label>
<label class="quiz-option"><input type="radio" name="q12" value="2"> 用例之间严格依赖执行顺序，前一条失败后面全部跳过</label>
<label class="quiz-option"><input type="radio" name="q12" value="3"> 直接把定位器写在用例里，读起来更直观</label>
</div>
<div class="quiz-explanation">💡 教程的练习完成标准明确要求"每个用例能单独运行"、"定位器尽量可读"。单条用例越自洽，失败时越容易判断问题出在哪一步</div>
</div>

<button class="quiz-submit">提交答案</button>
<div class="quiz-score"></div>

</div>

---

## 继续学习

完成测验后，建议继续学习：

- [Web 自动化项目实战](Web自动化项目实战.md) - 查看完整教程
- [Playwright 基础测验](../自动化测试/Playwright基础测验.md) - 补自动等待与 Trace 基础
- [接口自动化项目实战测验](接口自动化项目实战测验.md) - 把下单前置改用接口验证
- [第5阶段-项目面试通关](../学习中心/第5阶段-项目面试通关.md) - 检查阶段达成情况
