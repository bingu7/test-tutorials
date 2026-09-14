---
description: CI/CD 自动化回归测验，检验流水线设计、测试分层、密钥管理与质量门禁能力。
---
# CI/CD 自动化回归测验

!!! abstract "测验说明"
    本测验用于检验 CI/CD 自动化回归实战的学习效果。共 12 道选择题，覆盖流水线阶段、测试分层、触发策略、报告归档、失败诊断与质量门禁。

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

<div class="quiz-container" data-quiz-id="cicd-project">

<div class="quiz-item" data-correct="2">
<div class="quiz-question">测试人员参与 CI/CD，重点应该放在哪里？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q1" value="0"> 写部署脚本、维护服务器</label>
<label class="quiz-option"><input type="radio" name="q1" value="1"> 只在流水线失败时负责发送通知</label>
<label class="quiz-option"><input type="radio" name="q1" value="2"> 把自动化测试放进流水线，让团队更早发现质量风险</label>
<label class="quiz-option"><input type="radio" name="q1" value="3"> 把全部测试用例都塞进每一次构建</label>
</div>
<div class="quiz-explanation">💡 教程明确写了：测试人员参与 CI/CD，重点不是写部署脚本，而是把自动化测试放进流水线。第一版重点是稳定跑通核心回归，不追求把所有测试都塞进去</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">搭建回归流水线，正确的起步方式是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q2" value="0"> 一次性把自动化、报告、通知、质量门禁全部配好</label>
<label class="quiz-option"><input type="radio" name="q2" value="1"> 先跑通最小流水线（拉代码 → 装依赖 → 跑 pytest → 上传报告），再逐步加能力</label>
<label class="quiz-option"><input type="radio" name="q2" value="2"> 先配好通知，再补测试步骤</label>
<label class="quiz-option"><input type="radio" name="q2" value="3"> 先加 Web 自动化，再加接口自动化</label>
</div>
<div class="quiz-explanation">💡 教程主张"流水线学习要从能跑一次开始"，第一次成功后再逐步加入 Secret、报告、Web 浏览器依赖和通知，每加一个能力都确认失败时能看懂日志</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">按教程的测试分层，适合"每次提交或合并"运行的是哪一层？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q3" value="0"> 冒烟测试：登录、核心接口、核心页面</label>
<label class="quiz-option"><input type="radio" name="q3" value="1"> 完整 Web 回归</label>
<label class="quiz-option"><input type="radio" name="q3" value="2"> 性能基线对比</label>
<label class="quiz-option"><input type="radio" name="q3" value="3"> 基础安全扫描</label>
</div>
<div class="quiz-explanation">💡 教程的分层是：冒烟测试每次提交或合并，接口回归每日定时或合并前，Web 回归每日定时，性能基线和安全扫描放在发版前或定期。原则是"流水线越频繁，测试集越要轻量稳定"</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">流水线中使用测试环境地址、账号密码、Token，正确的处理方式是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q4" value="0"> 直接写进 workflow 文件，方便维护</label>
<label class="quiz-option"><input type="radio" name="q4" value="1"> 写在 README 里，团队都能查</label>
<label class="quiz-option"><input type="radio" name="q4" value="2"> 用测试用例的注释保存</label>
<label class="quiz-option"><input type="radio" name="q4" value="3"> 地址走环境变量或配置文件，密码和 Token 走 CI Secret，测试代码通过环境变量读取</label>
</div>
<div class="quiz-explanation">💡 教程的原则是"流水线中不要硬编码敏感信息"：环境地址可以放环境变量或配置文件，登录账号、密码、数据库密码、SSH 私钥、Token 统统走 CI Secret，再在测试代码里通过环境变量读取</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">配置 <code>schedule: - cron: "0 18 * * *"</code> 时需要注意什么？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q5" value="0"> cron 表达式只能写分钟，不能写小时</label>
<label class="quiz-option"><input type="radio" name="q5" value="1"> GitHub Actions 的定时任务使用 UTC 时间，配置时要换算成本地时间</label>
<label class="quiz-option"><input type="radio" name="q5" value="2"> 定时任务不能用于回归测试</label>
<label class="quiz-option"><input type="radio" name="q5" value="3"> 定时触发和 push 触发不能同时存在</label>
</div>
<div class="quiz-explanation">💡 教程专门提醒了这一点。如果不换算，以为配的是"每天下午 6 点"，实际执行时间会差 8 小时，夜间定时回归可能跑到错误的时间窗里</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">流水线失败后，第一步应该做什么？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q6" value="0"> 先看哪个步骤失败，再展开具体日志，判断是环境、脚本还是业务问题</label>
<label class="quiz-option"><input type="radio" name="q6" value="1"> 直接判断是代码 Bug，提交缺陷</label>
<label class="quiz-option"><input type="radio" name="q6" value="2"> 反复重跑流水线直到变绿</label>
<label class="quiz-option"><input type="radio" name="q6" value="3"> 先通知所有开发同学</label>
</div>
<div class="quiz-explanation">💡 教程的原话是"不要看到红色流水线就直接说代码有 Bug，先用日志和报告定位失败原因"。排查顺序是看失败步骤 → 看错误信息第一行和最后一行 → 判断类型</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">流水线在 <code>Install dependencies</code> 步骤失败，通常说明？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q7" value="0"> 业务逻辑存在缺陷</label>
<label class="quiz-option"><input type="radio" name="q7" value="1"> 元素定位器失效</label>
<label class="quiz-option"><input type="radio" name="q7" value="2"> 多半是依赖安装问题，例如依赖缺失、镜像源或版本不匹配</label>
<label class="quiz-option"><input type="radio" name="q7" value="3"> 测试数据不存在</label>
</div>
<div class="quiz-explanation">💡 教程的排查模板按步骤名分类：<code>Install dependencies</code> 失败多半是依赖安装问题，<code>Run tests</code> 失败才需要看具体测试日志，<code>Upload artifacts</code> 失败多半是路径不存在</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">按照教程的失败策略，通常可以直接阻塞合并的是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q8" value="0"> 完整性能基线未达标</label>
<label class="quiz-option"><input type="radio" name="q8" value="1"> 冒烟测试失败</label>
<label class="quiz-option"><input type="radio" name="q8" value="2"> 任何一步失败都立即阻塞全团队</label>
<label class="quiz-option"><input type="radio" name="q8" value="3"> 环境不可用导致的失败</label>
</div>
<div class="quiz-explanation">💡 教程给出的策略是：冒烟测试失败可以阻塞合并；完整回归失败先通知团队，不一定立即阻塞所有开发；环境不可用要和真实缺陷区分开，否则会把环境问题误判成代码问题</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">下列哪一项<strong>不属于</strong>流水线需要归档的测试产物？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q9" value="0"> Allure 结果与 HTML 报告</label>
<label class="quiz-option"><input type="radio" name="q9" value="1"> 失败截图与 Playwright Trace</label>
<label class="quiz-option"><input type="radio" name="q9" value="2"> 执行日志与 JUnit XML</label>
<label class="quiz-option"><input type="radio" name="q9" value="3"> 开发同学本地的 IDE 配置</label>
</div>
<div class="quiz-explanation">💡 教程列出的归档清单是 Allure 结果、HTML 报告、日志、截图、Trace 和 JUnit XML，分别用于查看执行详情、快速浏览、定位问题、定位 UI 失败、回放失败场景和给 CI 平台展示结果</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">一条有价值的失败通知，应该包含哪些信息？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q10" value="0"> 只写一句"流水线红了"</label>
<label class="quiz-option"><input type="radio" name="q10" value="1"> 把全量日志整段贴出来</label>
<label class="quiz-option"><input type="radio" name="q10" value="2"> 项目、分支、提交、结果、失败用例数、主要失败模块、报告地址和处理建议</label>
<label class="quiz-option"><input type="radio" name="q10" value="3"> 只写失败用例的条数</label>
</div>
<div class="quiz-explanation">💡 教程给的通知示例就是这套结构，并强调"通知不是越多越好，只有清晰、可行动的通知才有价值"。收到通知的人应该能直接判断去哪儿看、先看什么</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">设置质量门禁时，正确的原则是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q11" value="0"> 循序渐进，不要一开始设得过严，避免团队绕过流水线</label>
<label class="quiz-option"><input type="radio" name="q11" value="1"> 一开始就要求所有用例 100% 通过</label>
<label class="quiz-option"><input type="radio" name="q11" value="2"> 门禁越严越能保证质量，不用考虑团队接受度</label>
<label class="quiz-option"><input type="radio" name="q11" value="3"> 门禁只对新人提交的代码生效</label>
</div>
<div class="quiz-explanation">💡 教程的门禁示例是分级的：构建必须成功、P0 冒烟用例 100% 通过、接口回归通过率不低于 98%、不允许存在未关闭的 P0/P1 缺陷、核心接口 P95 不超过基线 20%。同时也提醒门禁要循序渐进，否则团队会想办法绕过</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">把 Web 自动化放进每次提交触发的流水线时，建议怎么做？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q12" value="0"> 把全部 UI 用例都放在每次提交后运行，保证覆盖</label>
<label class="quiz-option"><input type="radio" name="q12" value="1"> 控制数量、优先稳定主流程；页面频繁变化时，不要让大量 UI 用例阻塞每次提交</label>
<label class="quiz-option"><input type="radio" name="q12" value="2"> 只能用图形界面运行，命令行走不通</label>
<label class="quiz-option"><input type="radio" name="q12" value="3"> 不需要安装浏览器依赖</label>
</div>
<div class="quiz-explanation">💡 教程对 Web 冒烟的定位是"应控制数量，优先选择稳定主流程"，并把耗时长的测试放到定时或发版前执行。UI 用例本身受环境和页面改版影响大，不适合作为每次提交的硬门禁</div>
</div>

<button class="quiz-submit">提交答案</button>
<div class="quiz-score"></div>

</div>

---

## 继续学习

完成测验后，建议继续学习：

- [CI/CD 自动化回归实战](CICD自动化回归实战.md) - 查看完整教程
- [持续集成测验](../持续集成/持续集成测验.md) - 补 Pipeline、Actions 与 Docker 基础
- [接口自动化项目实战测验](接口自动化项目实战测验.md) - 准备可入流水线的自动化用例
- [第5阶段-项目面试通关](../学习中心/第5阶段-项目面试通关.md) - 检查阶段达成情况
