---
description: SQL 基础测验，检验增删改查和多表查询掌握程度。
---
# SQL 基础测验

!!! abstract "测验说明"
    本测验用于检验 SQL 基础教程的学习效果。共 10 道选择题。

<div class="tutorial-meta">
    <span class="difficulty-badge difficulty-beginner">📗 入门难度</span>
    <span class="meta-item">⏱ 约 20 分钟</span>
    <span class="meta-item">📝 10 道题</span>
</div>

!!! tip "测验反馈"
    提交答案后，系统会显示：
    - 得分和正确率
    - 错题分析和薄弱知识点
    - 复习建议和推荐教程
    - 下一步学习建议

---

## 选择题

<div class="quiz-container" data-quiz-id="sql-basics">

<div class="quiz-item" data-correct="2">
<div class="quiz-question">SQL 中用于查询数据的关键字是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q1" value="0"> GET</label>
<label class="quiz-option"><input type="radio" name="q1" value="1"> FIND</label>
<label class="quiz-option"><input type="radio" name="q1" value="2"> SELECT</label>
<label class="quiz-option"><input type="radio" name="q1" value="3"> QUERY</label>
</div>
<div class="quiz-explanation">💡 SQL 使用 `SELECT` 语句查询数据，例如 `SELECT * FROM users`</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">以下哪个 SQL 语句用于删除数据？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q2" value="0"> REMOVE</label>
<label class="quiz-option"><input type="radio" name="q2" value="1"> DELETE</label>
<label class="quiz-option"><input type="radio" name="q2" value="2"> DROP</label>
<label class="quiz-option"><input type="radio" name="q2" value="3"> ERASE</label>
</div>
<div class="quiz-explanation">💡 `DELETE` 用于删除表中的数据行；`DROP` 用于删除整个表或数据库</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">`WHERE` 子句的作用是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q3" value="0"> 筛选符合条件的数据</label>
<label class="quiz-option"><input type="radio" name="q3" value="1"> 排序数据</label>
<label class="quiz-option"><input type="radio" name="q3" value="2"> 分组数据</label>
<label class="quiz-option"><input type="radio" name="q3" value="3"> 限制返回行数</label>
</div>
<div class="quiz-explanation">💡 `WHERE` 用于指定筛选条件，只返回满足条件的数据行</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">以下哪个函数用于统计数据行数？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q4" value="0"> SUM()</label>
<label class="quiz-option"><input type="radio" name="q4" value="1"> AVG()</label>
<label class="quiz-option"><input type="radio" name="q4" value="2"> MAX()</label>
<label class="quiz-option"><input type="radio" name="q4" value="3"> COUNT()</label>
</div>
<div class="quiz-explanation">💡 `COUNT()` 统计行数；`SUM()` 求和；`AVG()` 求平均值；`MAX()` 求最大值</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">`JOIN` 用于？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q5" value="0"> 插入数据</label>
<label class="quiz-option"><input type="radio" name="q5" value="1"> 删除数据</label>
<label class="quiz-option"><input type="radio" name="q5" value="2"> 关联多张表查询</label>
<label class="quiz-option"><input type="radio" name="q5" value="3"> 更新数据</label>
</div>
<div class="quiz-explanation">💡 `JOIN` 用于根据关联字段将多张表的数据关联查询</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">`ORDER BY` 默认的排序方式是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q6" value="0"> 降序（DESC）</label>
<label class="quiz-option"><input type="radio" name="q6" value="1"> 升序（ASC）</label>
<label class="quiz-option"><input type="radio" name="q6" value="2"> 随机排序</label>
<label class="quiz-option"><input type="radio" name="q6" value="3"> 不排序</label>
</div>
<div class="quiz-explanation">💡 `ORDER BY` 默认升序（ASC），降序需要显式指定 `DESC`</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">`GROUP BY` 的作用是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q7" value="0"> 按指定字段分组统计</label>
<label class="quiz-option"><input type="radio" name="q7" value="1"> 按指定字段排序</label>
<label class="quiz-option"><input type="radio" name="q7" value="2"> 筛选数据</label>
<label class="quiz-option"><input type="radio" name="q7" value="3"> 限制行数</label>
</div>
<div class="quiz-explanation">💡 `GROUP BY` 用于将数据按指定字段分组，通常配合聚合函数使用</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">`LIMIT 10 OFFSET 20` 的含义是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q8" value="0"> 返回前 10 条数据</label>
<label class="quiz-option"><input type="radio" name="q8" value="1"> 返回第 10 到 20 条数据</label>
<label class="quiz-option"><input type="radio" name="q8" value="2"> 跳过前 20 条，返回 10 条</label>
<label class="quiz-option"><input type="radio" name="q8" value="3"> 返回 20 条数据</label>
</div>
<div class="quiz-explanation">💡 `LIMIT` 限制返回行数，`OFFSET` 跳过指定行数。常用于分页查询</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">测试人员校验接口数据时，最常用的 SQL 模式是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q9" value="0"> INSERT INTO</label>
<label class="quiz-option"><input type="radio" name="q9" value="1"> SELECT ... WHERE</label>
<label class="quiz-option"><input type="radio" name="q9" value="2"> UPDATE SET</label>
<label class="quiz-option"><input type="radio" name="q9" value="3"> CREATE TABLE</label>
</div>
<div class="quiz-explanation">💡 测试人员最常用 `SELECT ... WHERE` 查询并校验数据</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">`IS NULL` 用于判断？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q10" value="0"> 字段值为 0</label>
<label class="quiz-option"><input type="radio" name="q10" value="1"> 字段值为空字符串</label>
<label class="quiz-option"><input type="radio" name="q10" value="2"> 字段值为 FALSE</label>
<label class="quiz-option"><input type="radio" name="q10" value="3"> 字段没有值（空值）</label>
</div>
<div class="quiz-explanation">💡 `NULL` 表示没有值，不同于 0、空字符串或 FALSE。判断 NULL 要用 `IS NULL`，不能用 `= NULL`</div>
</div>

<button class="quiz-submit">提交答案</button>
<div class="quiz-score"></div>

</div>

---

## 继续学习

完成测验后，建议继续学习：

- [数据库 SQL 教程](数据库SQL教程-软件测试版.md) - 查看完整教程
- [章节练习与参考答案](../章节练习与参考答案.md) - 更多 SQL 练习
- [Redis 与 MongoDB 教程](Redis与MongoDB教程-软件测试版.md) - 扩展 NoSQL 知识
