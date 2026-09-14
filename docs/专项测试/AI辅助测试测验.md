---
description: AI 辅助测试测验，检验 AI 生成用例、视觉测试、Agent 与 GenAI 应用测试的掌握程度。
---
# AI 辅助测试测验

!!! abstract "测验说明"
    本测验用于检验 AI 辅助测试教程的学习效果。共 12 道选择题，覆盖 AI 生成用例与数据、缺陷分析、视觉测试、Red Teaming、Agent 测试和自愈测试。

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

<div class="quiz-container" data-quiz-id="ai-testing">

<div class="quiz-item" data-correct="2">
<div class="quiz-question">用 AI 生成了一批测试用例后，正确的处理方式是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q1" value="0"> 直接导入测试管理平台执行，节省时间</label>
<label class="quiz-option"><input type="radio" name="q1" value="1"> 数量越多越好，全部保留以提升覆盖率</label>
<label class="quiz-option"><input type="radio" name="q1" value="2"> 逐条人工审查，删除臆造和不符合业务的部分</label>
<label class="quiz-option"><input type="radio" name="q1" value="3"> 只要格式正确就可以直接使用</label>
</div>
<div class="quiz-explanation">💡 AI 生成的是"看起来合理的草稿"，它并不了解你的业务规则和隐含约束。直接使用会把臆造的用例混进正式用例集，反而稀释了真正有效的覆盖——人工审查是不可省略的一步</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">下列哪项是 AI <strong>不擅长</strong>的？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q2" value="0"> 根据需求描述批量生成用例草稿</label>
<label class="quiz-option"><input type="radio" name="q2" value="1"> 判断缺陷对业务的实际影响和优先级</label>
<label class="quiz-option"><input type="radio" name="q2" value="2"> 从日志中提取错误模式</label>
<label class="quiz-option"><input type="radio" name="q2" value="3"> 生成符合格式的批量测试数据</label>
</div>
<div class="quiz-explanation">💡 AI 擅长"模式化、可批量"的工作，但对业务上下文、隐含需求和商业影响的判断力不足——那个"偶尔发生但影响付款"的缺陷该排多高优先级，需要人来定</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">AI 的"幻觉问题"指的是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q3" value="0"> AI 响应速度突然变慢</label>
<label class="quiz-option"><input type="radio" name="q3" value="1"> AI 拒绝回答敏感问题</label>
<label class="quiz-option"><input type="radio" name="q3" value="2"> AI 生成的内容太长无法阅读</label>
<label class="quiz-option"><input type="radio" name="q3" value="3"> AI 编造出看似合理但实际不存在或错误的内容</label>
</div>
<div class="quiz-explanation">💡 幻觉的麻烦在于"像真的"：编造的接口字段、不存在的配置项、错误的断言逻辑，不仔细核对很难发现。所以 AI 给出的每一条结论，尤其是涉及具体参数和数值的，都要回到文档或代码里验证</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">使用 AI 辅助分析线上问题时，关于数据隐私应该注意什么？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q4" value="0"> 不能把真实用户数据、密钥或未脱敏的日志直接粘贴到公共 AI 工具中</label>
<label class="quiz-option"><input type="radio" name="q4" value="1"> 只要不提交到代码仓库就没有风险</label>
<label class="quiz-option"><input type="radio" name="q4" value="2"> 所有 AI 工具都已通过合规认证，可以放心上传</label>
<label class="quiz-option"><input type="radio" name="q4" value="3"> 数据隐私是安全团队的事，测试无需关注</label>
</div>
<div class="quiz-explanation">💡 日志里往往带着手机号、身份证、token 和内部接口地址，一旦上传就脱离了公司的管控范围。规范做法是先脱敏、再用测试环境数据替代，或使用公司内部批准的工具</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">想让 AI 生成的用例更贴合需求，提示词中最重要的要素是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q5" value="0"> 尽可能简短，一句话说明需求即可</label>
<label class="quiz-option"><input type="radio" name="q5" value="1"> 使用尽可能多的高级词汇以显得专业</label>
<label class="quiz-option"><input type="radio" name="q5" value="2"> 交代角色与业务背景、给出明确的输出格式和约束条件</label>
<label class="quiz-option"><input type="radio" name="q5" value="3"> 一次提出尽可能多的问题以便批量输出</label>
</div>
<div class="quiz-explanation">💡 提示词的质量直接决定输出的可用度：说清"你是电商项目的测试工程师，这是登录需求，请按等价类/边界值输出表格，包含用例编号、前置条件、步骤、预期结果"，产出才会是一份能直接改的草稿</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">Few-shot Prompting 的含义是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q6" value="0"> 用很短的提示词快速获得答案</label>
<label class="quiz-option"><input type="radio" name="q6" value="1"> 在提示词中给出几个示例，让模型模仿示例的格式与风格输出</label>
<label class="quiz-option"><input type="radio" name="q6" value="2"> 让模型只输出少量结果以节省 token</label>
<label class="quiz-option"><input type="radio" name="q6" value="3"> 连续提问多次取最优结果</label>
</div>
<div class="quiz-explanation">💡 与其反复描述"我要什么格式"，不如直接给两三条范例。这对统一用例表格结构、缺陷报告语气这类"格式敏感"的任务尤其有效，通常一次就能对齐</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">Chain-of-Thought（思维链） prompting 最适合用在什么场景？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q7" value="0"> 需要快速生成大量相似文本</label>
<label class="quiz-option"><input type="radio" name="q7" value="1"> 需要严格保密的数据分析</label>
<label class="quiz-option"><input type="radio" name="q7" value="2"> 只需要一个简短结论</label>
<label class="quiz-option"><input type="radio" name="q7" value="3"> 需要多步推理的复杂分析，比如根据压测数据推断瓶颈</label>
</div>
<div class="quiz-explanation">💡 让模型把推理步骤写出来，能显著提升复杂问题的准确性，也方便你检查它哪一步的假设不成立。分析性能报告、定位偶发缺陷的根因都属于这类场景</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">AI 视觉回归测试相比传统的像素对比，核心改进是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q8" value="0"> 能识别"人眼看来无差异"的细微变化，忽略动态内容带来的噪声</label>
<label class="quiz-option"><input type="radio" name="q8" value="1"> 可以完全不做基线截图</label>
<label class="quiz-option"><input type="radio" name="q8" value="2"> 不需要任何人工确认即可自动修复 UI 缺陷</label>
<label class="quiz-option"><input type="radio" name="q8" value="3"> 只能用于移动端 App 的截图对比</label>
</div>
<div class="quiz-explanation">💡 传统像素对比会被时间戳、广告位、随机头像这类动态内容干扰，产生大量误报。AI 视觉测试（如 Applitools Eyes、Percy）按"视觉结构"判断差异，误报率低很多，但它仍然只负责"发现"，是否算缺陷要人来判断</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">Red Teaming（对抗性测试）的目的是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q9" value="0"> 提升模型生成内容的速度</label>
<label class="quiz-option"><input type="radio" name="q9" value="1"> 降低 AI 应用的使用成本</label>
<label class="quiz-option"><input type="radio" name="q9" value="2"> 主动构造恶意或诱导性输入，检验应用是否会输出有害、越权或违规内容</label>
<label class="quiz-option"><input type="radio" name="q9" value="3"> 对 AI 生成的用例做批量去重</label>
</div>
<div class="quiz-explanation">💡 Red Teaming 站在攻击者视角：诱导模型泄露系统提示词、绕过内容过滤、越权访问数据。这类测试要在受控环境下有计划地做，记录成功的攻击路径并推动加防护</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">测试 LLM 应用的输出一致性时，合理的断言方式是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q10" value="0"> 要求多次输出的文本逐字完全相同</label>
<label class="quiz-option"><input type="radio" name="q10" value="1"> 关注核心信息是否一致，允许措辞和表述有差异</label>
<label class="quiz-option"><input type="radio" name="q10" value="2"> 一致性无法测试，只能靠用户反馈</label>
<label class="quiz-option"><input type="radio" name="q10" value="3"> 只要第一次输出正确就不用再测</label>
</div>
<div class="quiz-explanation">💡 生成式模型的输出天然带有随机性，逐字比对必然失败。可行的做法是抽取关键要素（金额、日期、结论、是否拒答）做断言，必要时配合人工抽样评分</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">测试 AI Agent 时，"错误处理"这一检查项的预期行为是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q11" value="0"> 工具报错后直接终止整个对话</label>
<label class="quiz-option"><input type="radio" name="q11" value="1"> 忽略错误继续执行后续步骤</label>
<label class="quiz-option"><input type="radio" name="q11" value="2"> 把错误原文直接暴露给最终用户</label>
<label class="quiz-option"><input type="radio" name="q11" value="3"> 能够重试、切换其他工具或明确告知用户失败原因</label>
</div>
<div class="quiz-explanation">💡 Agent 的价值在于自主完成任务，所以"出错后怎么办"比"顺利时多聪明"更能体现可靠性。还要同时验证超时处理——工具响应慢时是否有超时机制，而不是无限等待</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">关于自愈测试（Self-Healing Tests），正确的理解是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q12" value="0"> 定位器失效时自动尝试备选定位策略，但结果仍需人工确认，不能放任其"自动变绿"</label>
<label class="quiz-option"><input type="radio" name="q12" value="1"> 可以完全替代人工维护自动化脚本</label>
<label class="quiz-option"><input type="radio" name="q12" value="2"> 会自动修复被测系统的缺陷</label>
<label class="quiz-option"><input type="radio" name="q12" value="3"> 只能在移动端自动化中使用</label>
</div>
<div class="quiz-explanation">💡 自愈机制能减少因页面结构变化导致的脚本失败，降低维护成本。但风险在于：如果它悄悄定位到了"错误的相似元素"，用例会变成假通过——所以自动修复的定位结果必须留痕并人工复核</div>
</div>

<button class="quiz-submit">提交答案</button>
<div class="quiz-score"></div>

</div>

---

## 继续学习

完成测验后，建议继续学习：

- [AI 辅助测试教程](AI辅助测试教程-软件测试版.md) - 查看完整教程
- [Web 安全测试测验](Web安全测试测验.md) - 补对抗性测试的安全基础
- [Playwright 基础测验](../自动化测试/Playwright基础测验.md) - 了解 AI 定位在自动化中的用法
