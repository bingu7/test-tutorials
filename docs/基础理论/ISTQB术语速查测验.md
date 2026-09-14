---
description: ISTQB 术语速查测验，检验测试术语、测试级别、缺陷管理和测试管理概念的掌握程度。
---
# ISTQB 术语速查测验

!!! abstract "测验说明"
    本测验用于检验 ISTQB 软件测试术语速查的学习效果。共 12 道选择题，覆盖测试基础概念、测试级别与类型、测试设计技术、缺陷管理和敏捷 DevOps 术语。

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

<div class="quiz-container" data-quiz-id="istqb-terms">

<div class="quiz-item" data-correct="2">
<div class="quiz-question">ISTQB 术语中，<strong>故障（Failure）</strong>指的是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q1" value="0"> 人犯下的失误，比如写错一条业务规则</label>
<label class="quiz-option"><input type="radio" name="q1" value="1"> 代码或文档中不正确的部分</label>
<label class="quiz-option"><input type="radio" name="q1" value="2"> 系统运行时对外表现出的异常行为</label>
<label class="quiz-option"><input type="radio" name="q1" value="3"> 缺陷管理系统里的一条记录</label>
</div>
<div class="quiz-explanation">💡 这三个词是一条因果链：人犯错叫<strong>错误（Error）</strong>，错误写进代码或文档形成<strong>缺陷（Defect）</strong>，缺陷被执行触发后表现出的异常行为才是<strong>故障（Failure）</strong>。面试时区分清楚，会显得基础很扎实</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">下列哪一项<strong>不属于</strong> ISTQB 定义的测试级别？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q2" value="0"> 组件测试</label>
<label class="quiz-option"><input type="radio" name="q2" value="1"> 集成测试</label>
<label class="quiz-option"><input type="radio" name="q2" value="2"> 系统测试</label>
<label class="quiz-option"><input type="radio" name="q2" value="3"> 回归测试</label>
</div>
<div class="quiz-explanation">💡 测试级别按被测对象的大小划分：组件 → 集成 → 系统 → 验收。回归测试是对"修改后是否破坏原有功能"的<strong>测试类型</strong>，可以发生在任何级别，不构成独立级别</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">下列测试设计技术中，哪一项属于<strong>白盒</strong>技术？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q3" value="0"> 等价类划分</label>
<label class="quiz-option"><input type="radio" name="q3" value="1"> 边界值分析</label>
<label class="quiz-option"><input type="radio" name="q3" value="2"> 语句覆盖</label>
<label class="quiz-option"><input type="radio" name="q3" value="3"> 状态迁移测试</label>
</div>
<div class="quiz-explanation">💡 黑盒技术只看输入输出，不需要读代码（等价类、边界值、决策表、状态迁移都属黑盒）；白盒技术必须基于代码结构，典型代表是语句覆盖、分支覆盖和路径覆盖</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">白盒覆盖中，覆盖强度<strong>最弱</strong>的是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q4" value="0"> 语句覆盖</label>
<label class="quiz-option"><input type="radio" name="q4" value="1"> 分支（判定）覆盖</label>
<label class="quiz-option"><input type="radio" name="q4" value="2"> 条件组合覆盖</label>
<label class="quiz-option"><input type="radio" name="q4" value="3"> 路径覆盖</label>
</div>
<div class="quiz-explanation">💡 语句覆盖只要求每行代码被执行一次，哪怕所有 if 都只走进 true 分支也能满足，所以最容易达标也最弱。强度大致按 语句 &lt; 分支 &lt; 条件组合 &lt; 路径 递增</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">某缺陷会让系统在早已停止支持的旧版系统上崩溃，产品经理评估后决定暂不修复。这属于哪种组合？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q5" value="0"> 严重程度低、优先级低</label>
<label class="quiz-option"><input type="radio" name="q5" value="1"> 严重程度高、优先级低</label>
<label class="quiz-option"><input type="radio" name="q5" value="2"> 严重程度低、优先级高</label>
<label class="quiz-option"><input type="radio" name="q5" value="3"> 严重程度高、优先级高</label>
</div>
<div class="quiz-explanation">💡 严重程度（Severity）描述缺陷对系统的影响，崩溃属于高严重程度；优先级（Priority）描述修复的紧急程度，由业务价值决定。不再支持的系统上出现崩溃，正是"严重程度高、优先级低"的经典例子</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">下列哪一项最适合作为测试的<strong>退出准则（Exit Criteria）</strong>？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q6" value="0"> 测试环境搭建完成</label>
<label class="quiz-option"><input type="radio" name="q6" value="1"> 测试用例全部编写完成</label>
<label class="quiz-option"><input type="radio" name="q6" value="2"> 用例执行率达到 100%，且未解决缺陷数低于约定阈值</label>
<label class="quiz-option"><input type="radio" name="q6" value="3"> 需求评审通过</label>
</div>
<div class="quiz-explanation">💡 进入准则回答"什么时候可以开始测"，退出准则回答"什么时候算测完"。执行率、通过率、遗留缺陷数量与等级分布，都是可量化、可验收的退出条件</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question"><strong>测试策略（Test Strategy）</strong>描述的是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q7" value="0"> 某个项目的时间、人力和资源安排</label>
<label class="quiz-option"><input type="radio" name="q7" value="1"> 组织层面长期通用的测试方法与原则</label>
<label class="quiz-option"><input type="radio" name="q7" value="2"> 一个迭代内要执行的测试用例清单</label>
<label class="quiz-option"><input type="radio" name="q7" value="3"> 缺陷修复的优先级排序规则</label>
</div>
<div class="quiz-explanation">💡 策略是"长期、通用、跨项目"的（例如风险驱动测试、自动化优先），计划是"针对某个具体项目或迭代"的（例如第 3 周完成接口回归）。选项 0 属于测试计划</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">下列哪一项属于<strong>基于经验的</strong>测试设计技术？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q8" value="0"> 决策表测试</label>
<label class="quiz-option"><input type="radio" name="q8" value="1"> 边界值分析</label>
<label class="quiz-option"><input type="radio" name="q8" value="2"> 状态迁移测试</label>
<label class="quiz-option"><input type="radio" name="q8" value="3"> 错误推测</label>
</div>
<div class="quiz-explanation">💡 ISTQB 把测试设计技术分为黑盒、白盒和基于经验三类。错误推测、探索式测试、检查表测试都属于基于经验的技术，它们依赖测试人员的经验和对失败模式的认识</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">ISTQB 术语中的<strong>测试依据（Test Basis）</strong>指的是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q9" value="0"> 设计和推导测试用例所依据的信息来源，如需求、设计、代码</label>
<label class="quiz-option"><input type="radio" name="q9" value="1"> 测试环境与测试数据的集合</label>
<label class="quiz-option"><input type="radio" name="q9" value="2"> 测试用例执行的先后顺序</label>
<label class="quiz-option"><input type="radio" name="q9" value="3"> 测试报告中引用的缺陷清单</label>
</div>
<div class="quiz-explanation">💡 没有测试依据就没法判断"预期结果应该是多少"。做需求可测性评审时，本质上就是在确认测试依据是否明确、完整、无歧义</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">敏捷团队常说的 <strong>Definition of Done（DoD）</strong>指的是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q10" value="0"> 产品负责人对需求优先级的排序结论</label>
<label class="quiz-option"><input type="radio" name="q10" value="1"> 团队对"一个工作项算完成"的共同检查标准</label>
<label class="quiz-option"><input type="radio" name="q10" value="2"> 每个迭代必须交付的固定功能列表</label>
<label class="quiz-option"><input type="radio" name="q10" value="3"> 测试人员编写的回归测试范围</label>
</div>
<div class="quiz-explanation">💡 DoD 是团队约定俗成的"完工标准"，通常包含代码评审通过、单元测试通过、自动化冒烟通过、文档更新等条目。有了它，"做完了"才不是一句主观判断</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question"><strong>持续集成（CI）</strong>的核心实践是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q11" value="0"> 每个季度把代码统一合并一次，由专人手工构建</label>
<label class="quiz-option"><input type="radio" name="q11" value="1"> 只在发版前执行一次完整的回归测试</label>
<label class="quiz-option"><input type="radio" name="q11" value="2"> 开发者频繁把代码合入主干，每次合入都自动构建并跑测试</label>
<label class="quiz-option"><input type="radio" name="q11" value="3"> 把测试环境部署到生产环境验证</label>
</div>
<div class="quiz-explanation">💡 CI 的关键字是"频繁合并 + 自动反馈"。改动越小、合入越勤，定位问题就越容易；这也正是质量门禁能拦住问题代码的前提</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">自动化测试术语中的 <strong>SUT</strong> 指的是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q12" value="0"> 测试脚本框架的名称</label>
<label class="quiz-option"><input type="radio" name="q12" value="1"> 被测系统（System Under Test）</label>
<label class="quiz-option"><input type="radio" name="q12" value="2"> 测试数据生成工具</label>
<label class="quiz-option"><input type="radio" name="q12" value="3"> 持续集成流水线</label>
</div>
<div class="quiz-explanation">💡 SUT = System Under Test，即"被测系统"。写测试报告或和自动化团队沟通时说"这部分数据由 SUT 返回"，指的就是被测系统本身的输出</div>
</div>

<button class="quiz-submit">提交答案</button>
<div class="quiz-score"></div>

</div>

---

## 继续学习

完成测验后，建议继续学习：

- [ISTQB 术语速查](ISTQB软件测试术语速查.md) - 查看完整术语表
- [软件测试理论基础测验](软件测试理论基础测验.md) - 检验测试流程与用例设计
- [测试金字塔测验](测试金字塔测验.md) - 理解测试分层策略
