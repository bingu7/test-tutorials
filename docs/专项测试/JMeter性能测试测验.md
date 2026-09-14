---
description: JMeter 性能测试测验，检验线程组、参数化、关联和结果指标掌握程度。
---
# JMeter 性能测试测验

!!! abstract "测验说明"
    本测验用于检验 JMeter 性能测试教程的学习效果。共 12 道选择题，覆盖性能指标、线程组、参数化、关联和结果分析。

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

<div class="quiz-container" data-quiz-id="jmeter-basics">

<div class="quiz-item" data-correct="1">
<div class="quiz-question">性能指标 TPS 的含义是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q1" value="0"> 每秒传输的字节数</label>
<label class="quiz-option"><input type="radio" name="q1" value="1"> 每秒事务数（每秒完成的请求数）</label>
<label class="quiz-option"><input type="radio" name="q1" value="2"> 事务的平均响应时间</label>
<label class="quiz-option"><input type="radio" name="q1" value="3"> 单次请求的最大耗时</label>
</div>
<div class="quiz-explanation">💡 TPS（Transactions Per Second）= 每秒事务数，衡量系统吞吐能力。QPS 含义类似，一般可通用；RT 才是响应时间，别把两者混为一谈</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">并发数 200，平均响应时间 200ms，按 TPS = 并发数 / 平均 RT（秒）估算，TPS 约为？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q2" value="0"> 40</label>
<label class="quiz-option"><input type="radio" name="q2" value="1"> 100</label>
<label class="quiz-option"><input type="radio" name="q2" value="2"> 400</label>
<label class="quiz-option"><input type="radio" name="q2" value="3"> 1000</label>
</div>
<div class="quiz-explanation">💡 先把 RT 换算成秒：200ms = 0.2s。TPS = 200 / 0.2 = 1000。**单位换算是这题的关键**，直接拿 200/200 会得出错误结论</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">线程组参数中的 Ramp-up period 表示？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q3" value="0"> 启动所有线程所需的时间（秒）</label>
<label class="quiz-option"><input type="radio" name="q3" value="1"> 每个线程的循环次数</label>
<label class="quiz-option"><input type="radio" name="q3" value="2"> 两次请求之间的等待时间</label>
<label class="quiz-option"><input type="radio" name="q3" value="3"> 压测的总时长</label>
</div>
<div class="quiz-explanation">💡 Ramp-up 决定"多久把线程全部启动起来"。它影响压力的爬升速度，设置过小会造成瞬间冲击，和真实用户逐步进入的场景不符</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">配置 100 个线程、Ramp-up 100 秒，实际效果是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q4" value="0"> 100 秒后同时启动 100 个线程</label>
<label class="quiz-option"><input type="radio" name="q4" value="1"> 每 100 秒启动 1 个线程</label>
<label class="quiz-option"><input type="radio" name="q4" value="2"> 平均每秒启动 1 个线程</label>
<label class="quiz-option"><input type="radio" name="q4" value="3"> 每个线程运行 100 秒</label>
</div>
<div class="quiz-explanation">💡 100 线程分摊到 100 秒，即平均每秒启动 1 个。若 Ramp-up 设为 0，则 100 个线程会瞬间全部启动，形成尖峰压力</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">登录接口返回 token，后续请求都要带这个 token，最常用的做法是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q5" value="0"> 把 token 写死在后续请求的请求头里</label>
<label class="quiz-option"><input type="radio" name="q5" value="1"> 用 JSON Extractor 从响应中提取 token，再通过变量引用</label>
<label class="quiz-option"><input type="radio" name="q5" value="2"> 给线程组加大 Ramp-up 时间</label>
<label class="quiz-option"><input type="radio" name="q5" value="3"> 在聚合报告里手动填写 token</label>
</div>
<div class="quiz-explanation">💡 这就是**关联**（Correlation）：token 每次登录都不同，必须动态提取。JSON Extractor 是 JSON 响应中最常用的提取器，提取后以 `${变量名}` 引用</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">要用几千个不同账号做数据驱动的压测，最合适的组件是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q6" value="0"> 用户参数（User Parameters）</label>
<label class="quiz-option"><input type="radio" name="q6" value="1"> 计数器（Counter）</label>
<label class="quiz-option"><input type="radio" name="q6" value="2"> 随机变量（Random Variable）</label>
<label class="quiz-option"><input type="radio" name="q6" value="3"> CSV Data Set Config</label>
</div>
<div class="quiz-explanation">💡 数据量小时可以用"用户参数"手工维护；数据量大时用 CSV Data Set Config 从文件读取，最常用也最好维护</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">聚合报告中的 Error % 表示？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q7" value="0"> 失败请求占总请求的比例</label>
<label class="quiz-option"><input type="radio" name="q7" value="1"> 服务器返回 500 的绝对次数</label>
<label class="quiz-option"><input type="radio" name="q7" value="2"> 请求超时的时间占比</label>
<label class="quiz-option"><input type="radio" name="q7" value="3"> JMeter 自身脚本报错的比例</label>
</div>
<div class="quiz-explanation">💡 Error % 是错误率。性能结论必须同时看 TPS、RT 和错误率——只报 TPS 上涨但错误率飙升，等于系统已经在丢请求</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">想实现"逐步加压、阶梯式增加并发"的压测场景，通常需要？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q8" value="0"> 把普通线程组的循环次数调大</label>
<label class="quiz-option"><input type="radio" name="q8" value="1"> 复制多个普通线程组并手动同时启动</label>
<label class="quiz-option"><input type="radio" name="q8" value="2"> 安装 Custom Thread Groups 插件，使用阶梯加压线程组</label>
<label class="quiz-option"><input type="radio" name="q8" value="3"> 调大 Ramp-up period 即可自动阶梯</label>
</div>
<div class="quiz-explanation">💡 普通线程组只能线性爬升。阶梯加压需要 Custom Thread Groups 插件（Stepping Thread Group）；控制吞吐量曲线则用 Throughput Shaping Timer</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">JMeter 组件的"作用域"遵循什么规则？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q9" value="0"> 所有组件都对整个测试计划生效，与位置无关</label>
<label class="quiz-option"><input type="radio" name="q9" value="1"> 按树形结构生效，父节点对所有子节点有效</label>
<label class="quiz-option"><input type="radio" name="q9" value="2"> 只有放在测试计划根节点的组件才生效</label>
<label class="quiz-option"><input type="radio" name="q9" value="3"> 组件只对它正下方的一个取样器生效</label>
</div>
<div class="quiz-explanation">💡 组件按树形层级继承：放在线程组下的 HTTP Header Manager 对该线程组内所有取样器生效，放在根节点则对整个测试计划生效。**放错层级是新手最常见的错误**</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">开始性能测试前，最先必须确认的是什么？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q10" value="0"> 压测脚本是否用了最新版 JMeter</label>
<label class="quiz-option"><input type="radio" name="q10" value="1"> 服务器是否已经扩容</label>
<label class="quiz-option"><input type="radio" name="q10" value="2"> 测试环境是否有其他人在用</label>
<label class="quiz-option"><input type="radio" name="q10" value="3"> 性能目标：RT 上限、TPS 下限、错误率上限分别是多少</label>
</div>
<div class="quiz-explanation">💡 没有目标就没有结论。必须先明确 RT < ?ms、TPS > ?、错误率 < ?%，压测结果才能判定"通过/不通过"，否则只能得到一堆无法解读的数字</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">压测只跑了 1 分钟就得出"系统稳定"的结论，最主要的问题是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q11" value="0"> JMeter 无法处理 1 分钟以内的压测</label>
<label class="quiz-option"><input type="radio" name="q11" value="1"> 报告文件会因此损坏</label>
<label class="quiz-option"><input type="radio" name="q11" value="2"> 时间太短，无法覆盖稳定运行阶段和内存泄漏等累积性问题</label>
<label class="quiz-option"><input type="radio" name="q11" value="3"> 1 分钟内的 TPS 一定不准</label>
</div>
<div class="quiz-explanation">💡 短时压测只能反映瞬时表现。连接池耗尽、内存泄漏、GC 抖动这类问题往往要在持续运行后才暴露，所以需要按目标时长跑并观察指标随时间的变化趋势</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">压测中 TPS 曲线先上升后明显下跌，同时响应时间急剧变大，最可能的原因是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q12" value="0"> 并发继续增加后系统达到拐点，资源出现瓶颈</label>
<label class="quiz-option"><input type="radio" name="q12" value="1"> JMeter 客户端网络断了</label>
<label class="quiz-option"><input type="radio" name="q12" value="2"> 这个现象说明系统性能很好</label>
<label class="quiz-option"><input type="radio" name="q12" value="3"> 聚合报告显示错误，需要重装 JMeter</label>
</div>
<div class="quiz-explanation">💡 TPS 见顶回落、RT 陡增，说明系统已过容量拐点，通常伴随 CPU、连接池或数据库达到瓶颈。定位拐点正是性能测试的核心产出之一</div>
</div>

<button class="quiz-submit">提交答案</button>
<div class="quiz-score"></div>

</div>

---

## 继续学习

完成测验后，建议继续学习：

- [JMeter 性能测试教程](JMeter性能测试教程-软件测试版.md) - 查看完整教程
- [性能测试项目实战](../项目实战/性能测试项目实战.md) - 训练指标、场景和结果分析
- [章节练习与参考答案](../章节练习与参考答案.md) - 性能与安全练习
