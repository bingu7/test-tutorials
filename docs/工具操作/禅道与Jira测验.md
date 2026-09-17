---
description: 禅道与 Jira 测验，检验缺陷流转、用例管理、严重程度与优先级、JQL 查询与质量度量的掌握程度。
---
# 禅道与 Jira 测验

!!! abstract "测验说明"
    本测验用于检验禅道与 Jira 实战教程的学习效果。共 14 道选择题，覆盖缺陷要素、流转闭环、严重程度与优先级、解决结果分支、禅道对象模型、JQL 查询与质量度量指标。

<div class="tutorial-meta">
    <span class="difficulty-badge difficulty-beginner">📘 入门难度</span>
    <span class="meta-item">⏱ 约 20 分钟</span>
    <span class="meta-item">📝 14 道选择题</span>
</div>

!!! tip "测验反馈"
    提交答案后，系统会显示：

    - 得分和正确率
    - 错题分析和薄弱知识点
    - 复习建议和推荐教程
    - 下一步学习建议

---

## 选择题

<div class="quiz-container" data-quiz-id="bug-tracking">

<div class="quiz-item" data-correct="2">
<div class="quiz-question">在禅道中提交缺陷时，下列哪个字段的填写水平最能体现测试人员的专业度？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q1" value="0"> 操作系统</label>
<label class="quiz-option"><input type="radio" name="q1" value="1"> 抄送人</label>
<label class="quiz-option"><input type="radio" name="q1" value="2"> 缺陷标题——要做到「[模块] + 操作条件 + 现象」，一眼看懂且不含主观推断</label>
<label class="quiz-option"><input type="radio" name="q1" value="3"> 附件大小</label>
</div>
<div class="quiz-explanation">💡 标题是开发第一眼看到的内容，也是后续统计和检索的入口。好标题如"【购物车】库存不足时点击结算页面白屏且无提示"，坏标题如"结算有问题"——后者开发需要反复追问，是效率杀手</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">测试验证开发修复后的缺陷，发现问题依然存在。正确做法是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q2" value="0"> 新建一个缺陷，描述问题仍未修复</label>
<label class="quiz-option"><input type="radio" name="q2" value="1"> 在原缺陷上「重新激活」并说明验证不通过的原因</label>
<label class="quiz-option"><input type="radio" name="q2" value="2"> 把原缺陷直接关闭，口头告知开发</label>
<label class="quiz-option"><input type="radio" name="q2" value="3"> 修改原缺陷的严重程度后保持"已解决"状态</label>
</div>
<div class="quiz-explanation">💡 新建会让缺陷数量虚高、追溯链断裂，也让"重开率"这个反映修复质量的核心指标失真。正确做法是在原缺陷上重新激活，写明验证环境和实际现象——这条链路本身就是开发修复质量的数据来源</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">关于「严重程度」与「优先级」，下列理解正确的是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q3" value="0"> 严重程度描述缺陷的破坏力，由测试主导判断；优先级描述修复的紧急度，由业务方主导</label>
<label class="quiz-option"><input type="radio" name="q3" value="1"> 两者含义相同，填一个即可</label>
<label class="quiz-option"><input type="radio" name="q3" value="2"> 严重程度高的缺陷优先级一定高</label>
<label class="quiz-option"><input type="radio" name="q3" value="3"> 优先级由测试人员根据技术难度决定</label>
</div>
<div class="quiz-explanation">💡 首页 Logo 拼写错误——严重程度低（不影响功能）但优先级高（老板会看到）；某个一年用一次的后台导出崩溃——严重程度高但优先级可能低。两者的判断维度不同，这正是面试的高频考点</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">在禅道中，缺陷（Bug）应该挂在哪个对象下？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q4" value="0"> 项目上，因为缺陷是项目过程中产生的</label>
<label class="quiz-option"><input type="radio" name="q4" value="1"> 测试单上，因为缺陷来自用例执行</label>
<label class="quiz-option"><input type="radio" name="q4" value="2"> 任务上，因为修复是一个任务</label>
<label class="quiz-option"><input type="radio" name="q4" value="3"> 产品上（并指定影响版本），因为产品持续存在而项目会结束</label>
</div>
<div class="quiz-explanation">💡 这是禅道双体系结构中最容易搞错的一点。缺陷挂产品才能形成"这个产品累计有多少缺陷"的长期质量档案；如果挂项目，项目一关闭历史缺陷就无从追溯了</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">开发把缺陷标记为「设计如此」并解决，测试接下来应该做什么？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q5" value="0"> 直接关闭，认可开发的判断</label>
<label class="quiz-option"><input type="radio" name="q5" value="1"> 回到需求文档确认设计约定；若需求确实如此则关闭，若无明确约定则升级为需求问题讨论</label>
<label class="quiz-option"><input type="radio" name="q5" value="2"> 重新激活，坚持自己的判断</label>
<label class="quiz-option"><input type="radio" name="q5" value="3"> 上报给测试经理处理</label>
</div>
<div class="quiz-explanation">💡 "设计如此"不是一个可以单方面成立的结论，它必须能指向明确的需求或设计文档。有依据就关闭，没依据就说明需求本身存在缺口——这个缺陷暴露的其实是需求问题，应该推动补充需求</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">禅道中「测试单（TestTask）」的作用是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q6" value="0"> 存放测试用例的容器，用例只属于测试单</label>
<label class="quiz-option"><input type="radio" name="q6" value="1"> 记录测试人员的工时</label>
<label class="quiz-option"><input type="radio" name="q6" value="2"> 一次测试执行的载体，关联某个版本和一批用例，执行结果汇总为测试报告</label>
<label class="quiz-option"><input type="radio" name="q6" value="3"> 管理测试环境的配置</label>
</div>
<div class="quiz-explanation">💡 用例属于产品、可复用在多个测试单上；测试单代表"本轮对某个构建版本的这次测试"。执行用例时标记通过/失败，失败可直接转 Bug 并自动带出用例步骤——这是禅道提升效率的关键设计</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">下列哪个指标最能反映「开发的修复质量」？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q7" value="0"> 缺陷重开率 = 重开数 / 已解决数</label>
<label class="quiz-option"><input type="radio" name="q7" value="1"> 缺陷总数</label>
<label class="quiz-option"><input type="radio" name="q7" value="2"> 用例执行通过率</label>
<label class="quiz-option"><input type="radio" name="q7" value="3"> 严重缺陷占比</label>
</div>
<div class="quiz-explanation">💡 重开率高意味着"标记已修复但实际没改好"，直接指向修复质量。而严重缺陷占比反映整体质量基线，用例通过率反映本轮执行情况，逃逸缺陷数反映测试有效性——每个指标指向的问题不同，面试时不要混用</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">用于判断「版本能否按期上线」的关键数据是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q8" value="0"> 测试用例总数</label>
<label class="quiz-option"><input type="radio" name="q8" value="1"> 本轮已执行用例数</label>
<label class="quiz-option"><input type="radio" name="q8" value="2"> 开发提交代码的次数</label>
<label class="quiz-option"><input type="radio" name="q8" value="3"> 缺陷收敛趋势（每日新增 vs 已解决）与遗留缺陷的严重程度构成</label>
</div>
<div class="quiz-explanation">💡 健康的收敛曲线是"新增持续下降、解决持续上升"。如果上线前一天新增缺陷仍在高位，说明系统还不稳定。再叠加遗留缺陷的严重程度构成，就能给出"核心链路可上线，某低频功能缺陷列为已知问题"这样有依据的结论</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">Jira 与禅道相比，在测试用例管理上的主要差异是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q9" value="0"> Jira 的用例管理功能比禅道更强</label>
<label class="quiz-option"><input type="radio" name="q9" value="1"> 两者都不支持用例管理</label>
<label class="quiz-option"><input type="radio" name="q9" value="2"> 禅道内置用例管理模块，Jira 原生不支持，需要 Zephyr、Xray 等插件扩展</label>
<label class="quiz-option"><input type="radio" name="q9" value="3"> Jira 只能管理用例不能管理缺陷</label>
</div>
<div class="quiz-explanation">💡 这是两者最实用的差别：禅道开箱即用，适合以测试为中心的团队；Jira 把一切统一为 Issue，灵活但对测试支持需要插件补齐。面试谈选型时提到这一点，说明你真正在两个平台里工作过</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">想查询「当前迭代中所有状态为待验证的缺陷」，下列哪个 JQL 写法最合适？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q10" value="0"> project = "EC" AND status = "In Review"</label>
<label class="quiz-option"><input type="radio" name="q10" value="1"> sprint in openSprints() AND status = "In Review"</label>
<label class="quiz-option"><input type="radio" name="q10" value="2"> created >= -7d AND status != Done</label>
<label class="quiz-option"><input type="radio" name="q10" value="3"> assignee = currentUser()</label>
</div>
<div class="quiz-explanation">💡 `openSprints()` 精确限定当前打开的迭代，`status = "In Review"` 筛出待验证状态。其他选项要么缺少迭代范围（会带出历史遗留），要么范围过宽。把这类查询存成 Filter 挂到 Dashboard，就是一块自动更新的质量看板</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">在 Jira 中如何处理一个「重复扣款」缺陷，以体现测试视角？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q11" value="0"> 只填标题和复现步骤，其余交给开发补充</label>
<label class="quiz-option"><input type="radio" name="q11" value="1"> 把严重程度和优先级都设为最高，强调其重要性</label>
<label class="quiz-option"><input type="radio" name="q11" value="2"> 在描述里直接写出"应该是幂等没做"并指派给开发</label>
<label class="quiz-option"><input type="radio" name="q11" value="3"> 用 Linked Issues 标出阻塞关系，并在描述中区分实际结果、期望结果与需求依据</label>
</div>
<div class="quiz-explanation">💡 重复扣款往往同时关联支付回调幂等性和订单状态机两个技术债，用 `blocks` 标出会卡住哪些下游工作，能让项目经理一眼看出影响面。同时记住：**不要替开发下结论**，要写现象和证据，让开发自己判断根因</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">只看「缺陷总数」这一个数字，无法判断版本质量。正确的做法是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q12" value="0"> 结合模块分布、严重程度构成、引入版本做交叉分析，才能定位质量薄弱环节</label>
<label class="quiz-option"><input type="radio" name="q12" value="1"> 用缺陷总数除以开发人数，算出人均缺陷数</label>
<label class="quiz-option"><input type="radio" name="q12" value="2"> 缺陷越多说明测试越仔细，属于正向信号</label>
<label class="quiz-option"><input type="radio" name="q12" value="3"> 缺陷总数是唯一可靠的质量指标</label>
</div>
<div class="quiz-explanation">💡 单一维度的数据只能说明"多或少"，要判断质量薄弱环节必须做**交叉分析**：按模块分布看哪个模块缺陷最多、按严重程度看质量基线、按引入版本看是不是新代码带来的。数据本身不产生结论，分析框架才产生结论</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">关于缺陷附件（截图/录屏/日志），正确的理解是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q13" value="0"> 只有偶现缺陷才需要附件</label>
<label class="quiz-option"><input type="radio" name="q13" value="1"> 附件是开发要的，测试可以等开发索要时再补</label>
<label class="quiz-option"><input type="radio" name="q13" value="2"> 附件是缺陷报告的必备要素——截图证明现象、日志提供线索、录屏还原偶现过程</label>
<label class="quiz-option"><input type="radio" name="q13" value="3"> 附件越大越详细越好，应上传完整的系统日志</label>
</div>
<div class="quiz-explanation">💡 一个没有附件的缺陷，开发第一反应是"你先确认一下"——来回沟通的成本远超截图的一分钟。但也要注意：日志要截取**相关片段**而非上传整个 GB 级文件，附带时间点和关键行号才有价值</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">面试官问"你用过什么缺陷管理工具"，怎样回答最能体现专业度？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q14" value="0"> 直接说"我用过禅道和 Jira"，然后等下一个问题</label>
<label class="quiz-option"><input type="radio" name="q14" value="1"> 说明用禅道做用例与缺陷闭环、用 Jira 跟踪迭代；讲清两者的字段差异，并说明会用报表和 JQL 支撑上线决策</label>
<label class="quiz-option"><input type="radio" name="q14" value="2"> 强调自己熟悉工具的所有菜单功能</label>
<label class="quiz-option"><input type="radio" name="q14" value="3"> 说"工具只是辅助，我更关注测试思维"</label>
</div>
<div class="quiz-explanation">💡 只报工具名等于没说。有效回答包含三层：**用过什么**（工具 + 具体动作）、**懂差异**（禅道内置用例、Jira 靠插件 + JQL 强）、**会用它做决策**（报表看收敛趋势、Filter 挂看板）。第三层是候选人之间的分水岭</div>
</div>

<button class="quiz-submit">提交答案</button>
<div class="quiz-score"></div>

</div>

---

## 继续学习

完成测验后，建议继续学习：

- [禅道与 Jira 实战教程](禅道与Jira实战教程-软件测试版.md) - 查看完整教程
- [缺陷报告模板](../模板库/缺陷报告模板.md) - 对照规范自查缺陷写法
- [测试报告模板](../模板库/测试报告模板.md) - 把缺陷数据汇总成结论
- [第2阶段-工具实战通关](../学习中心/第2阶段-工具实战通关.md) - 检查阶段通关情况
