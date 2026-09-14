---
description: Redis 与 MongoDB 测验，检验缓存与文档数据库的数据校验、造数和清理能力。
---
# Redis 与 MongoDB 测验

!!! abstract "测验说明"
    本测验用于检验 Redis 与 MongoDB 教程的学习效果。共 12 道选择题，覆盖 Redis 数据类型与常用命令、缓存类场景验证，以及 MongoDB 查询与数据一致性校验。

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

<div class="quiz-container" data-quiz-id="redis-mongodb">

<div class="quiz-item" data-correct="1">
<div class="quiz-question">用 <code>TTL token:1001</code> 查看到返回值为 <code>-1</code>，说明？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q1" value="0"> 这个 key 已经过期</label>
<label class="quiz-option"><input type="radio" name="q1" value="1"> 这个 key 存在，但没有设置过期时间</label>
<label class="quiz-option"><input type="radio" name="q1" value="2"> 这个 key 不存在</label>
<label class="quiz-option"><input type="radio" name="q1" value="3"> 命令执行出错，需要重试</label>
</div>
<div class="quiz-explanation">💡 TTL 有三种典型返回：正数表示剩余秒数，<code>-1</code> 表示存在但永不过期，<code>-2</code> 表示 key 不存在（可能已过期被清除）。验证登录态过期时间时，这个返回值就是断言依据</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">关于 Redis 的数据库，下列说法正确的是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q2" value="0"> Redis 只能使用一个数据库，无法切换</label>
<label class="quiz-option"><input type="radio" name="q2" value="1"> Redis 用 SQL 语句切换数据库</label>
<label class="quiz-option"><input type="radio" name="q2" value="2"> 默认提供 0～15 共 16 个库，用 <code>SELECT</code> 切换</label>
<label class="quiz-option"><input type="radio" name="q2" value="3"> 每个库之间的数据会自动同步</label>
</div>
<div class="quiz-explanation">💡 不同库之间数据相互隔离，所以"明明写进去了却查不到"的常见原因之一，就是连到了错误的库编号。排查时先 <code>SELECT</code> 确认库号再 <code>KEYS</code> 查找</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">要一次取出某个 Hash 结构里的所有字段和值，应使用？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q3" value="0"> <code>HGETALL user:1001</code></label>
<label class="quiz-option"><input type="radio" name="q3" value="1"> <code>GET user:1001</code></label>
<label class="quiz-option"><input type="radio" name="q3" value="2"> <code>LRANGE user:1001 0 -1</code></label>
<label class="quiz-option"><input type="radio" name="q3" value="3"> <code>SMEMBERS user:1001</code></label>
</div>
<div class="quiz-explanation">💡 不同数据类型要用对应命令：String 用 <code>GET</code>、Hash 用 <code>HGET/HGETALL</code>、List 用 <code>LRANGE</code>、Set 用 <code>SMEMBERS</code>。用错命令会直接报类型错误，先用 <code>TYPE</code> 确认类型最稳妥</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">测试短信验证码登录时，想跳过"等待真实短信"这一步，最实用的做法是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q4" value="0"> 让开发临时关闭验证码校验</label>
<label class="quiz-option"><input type="radio" name="q4" value="1"> 反复点击发送按钮直到收到短信</label>
<label class="quiz-option"><input type="radio" name="q4" value="2"> 使用固定的万能验证码 000000</label>
<label class="quiz-option"><input type="radio" name="q4" value="3"> 直接在 Redis 中写入或读取该手机号对应的验证码</label>
</div>
<div class="quiz-explanation">💡 验证码通常以 <code>sms:code:手机号</code> 之类的 key 存在 Redis 里，可以直接 <code>SET</code> 一个已知值来构造场景，也可以 <code>GET</code> 出真实值用于验证。这样既能测正常流程，也能测过期、错误次数超限等异常分支</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">要验证"清空缓存后系统能正确回源重建"，测试步骤应该是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q5" value="0"> 重启 Redis 服务，再看接口是否报错</label>
<label class="quiz-option"><input type="radio" name="q5" value="1"> 先查询接口确认结果，再删除对应缓存 key，重新查询并比对结果是否一致</label>
<label class="quiz-option"><input type="radio" name="q5" value="2"> 直接修改缓存里的字段值，再判断接口是否返回错误</label>
<label class="quiz-option"><input type="radio" name="q5" value="3"> 等缓存自然过期即可，不需要主动验证</label>
</div>
<div class="quiz-explanation">💡 缓存失效后重建是缺陷高发区：回源查不到数据、回源结果与缓存不一致、并发下缓存击穿。主动删 key 再比对"删前删后接口返回是否一致"，是最直接的验证方式</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">测试限流功能时，想把计数器直接改成"刚好达到阈值"，需要？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q6" value="0"> 用 <code>KEYS</code> 命令直接删除该 key</label>
<label class="quiz-option"><input type="radio" name="q6" value="1"> 用 <code>TTL</code> 把剩余时间改成 0</label>
<label class="quiz-option"><input type="radio" name="q6" value="2"> 用 <code>SET</code> 把计数器的值直接写成阈值</label>
<label class="quiz-option"><input type="radio" name="q6" value="3"> 关闭 Redis 再重新连接</label>
</div>
<div class="quiz-explanation">💡 限流计数器本质就是一个自增的 key，直接改写它的值就能把系统推到"下一次请求即触发限流"的临界状态，省去真实发请求几百次的时间。测试完成后记得清理，避免影响后续用例</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">关于批量清理测试数据，下列做法正确的是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q7" value="0"> <code>DEL</code> 不支持通配符，需要先用 <code>KEYS</code> 查出 key 再批量删除</label>
<label class="quiz-option"><input type="radio" name="q7" value="1"> 直接执行 <code>DEL test:*</code> 即可删除所有测试数据</label>
<label class="quiz-option"><input type="radio" name="q7" value="2"> 只能逐个手动删除，无法批量处理</label>
<label class="quiz-option"><input type="radio" name="q7" value="3"> 必须重启 Redis 才能清理数据</label>
</div>
<div class="quiz-explanation">💡 通配符只在 <code>KEYS</code>、<code>SCAN</code> 这类查找命令中生效，<code>DEL</code> 只能接收明确的 key。所以标准做法是 <code>KEYS</code> 拿到列表后再批量 <code>DEL</code>。注意生产环境慎用 <code>KEYS</code>，它会阻塞 Redis</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">MongoDB 与 MySQL 相比，最本质的差异是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q8" value="0"> MongoDB 不支持任何查询条件</label>
<label class="quiz-option"><input type="radio" name="q8" value="1"> MongoDB 只能存储数字类型</label>
<label class="quiz-option"><input type="radio" name="q8" value="2"> MongoDB 必须预先定义严格的表结构</label>
<label class="quiz-option"><input type="radio" name="q8" value="3"> MongoDB 以文档（JSON）为单位存储，schema 更灵活</label>
</div>
<div class="quiz-explanation">💡 MySQL 是行列结构的表、schema 固定；MongoDB 存的是文档，字段可以动态增减。对测试的影响是：校验 MongoDB 数据时要先确认字段是否真的存在，不能照搬关系库的思维</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">要查询 <code>orders</code> 集合中 <code>status</code> 为 <code>paid</code> 且 <code>amount</code> 大于 100 的订单，正确的写法是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q9" value="0"> <code>db.orders.find({status: "paid", amount: ">100"})</code></label>
<label class="quiz-option"><input type="radio" name="q9" value="1"> <code>db.orders.find({status: "paid", amount: {$gt: 100}})</code></label>
<label class="quiz-option"><input type="radio" name="q9" value="2"> <code>db.orders.find({status = "paid" and amount &gt; 100})</code></label>
<label class="quiz-option"><input type="radio" name="q9" value="3"> <code>db.orders.select({status: "paid", amount: 100})</code></label>
</div>
<div class="quiz-explanation">💡 MongoDB 用 <code>{字段: {$操作符: 值}}</code> 表达范围条件，比较操作符写成 <code>$gt</code> <code>$gte</code> <code>$lt</code> <code>$lte</code>。把它写成 SQL 的 <code>&gt;100</code> 是最常见的语法错误</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">查询 <code>email</code> 字段存在（不为空）的文档，应该用？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q10" value="0"> <code>{email: {$gt: null}}</code></label>
<label class="quiz-option"><input type="radio" name="q10" value="1"> <code>{email: {$in: null}}</code></label>
<label class="quiz-option"><input type="radio" name="q10" value="2"> <code>{email: {$exists: true}}</code></label>
<label class="quiz-option"><input type="radio" name="q10" value="3"> <code>{email: {$regex: true}}</code></label>
</div>
<div class="quiz-explanation">💡 <code>$exists</code> 专门判断字段是否存在，配合 <code>$regex</code> 还能做模糊匹配。<code>$in</code> 用于列表匹配，<code>$regex</code> 用于正则，两者都不能替代 <code>$exists</code></div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">做数据一致性校验时，正确的思路是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q11" value="0"> 以接口文档约定的字段含义为准，比对接口返回与库中记录的关键字段</label>
<label class="quiz-option"><input type="radio" name="q11" value="1"> 只要数据库里有记录就算通过，不需要比对具体值</label>
<label class="quiz-option"><input type="radio" name="q11" value="2"> 只校验金额字段，其他字段可以忽略</label>
<label class="quiz-option"><input type="radio" name="q11" value="3"> 以数据库的值反推接口应该返回什么</label>
</div>
<div class="quiz-explanation">💡 校验的基准是"业务期望"，不是任何一侧的现有数据——否则"两边都错成一样"就会被放过。重点关注金额、状态、时间戳、外键关联这些容易出错的字段</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">测试人员 <code>KEYS</code> 查不到某个 key，下列哪个原因<strong>最不可能</strong>？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q12" value="0"> 当前连接的数据库编号不对</label>
<label class="quiz-option"><input type="radio" name="q12" value="1"> key 已经到达过期时间被自动清除</label>
<label class="quiz-option"><input type="radio" name="q12" value="2"> 通配符写法不对，没匹配到实际 key 名</label>
<label class="quiz-option"><input type="radio" name="q12" value="3"> Redis 需要重启后才能查到新写入的 key</label>
</div>
<div class="quiz-explanation">💡 Redis 写入立即可读，不存在"需要重启才能查到"的情况。查不到 key 基本就是三类原因：库号错、key 已过期、模式没写对。按这个顺序排查最快</div>
</div>

<button class="quiz-submit">提交答案</button>
<div class="quiz-score"></div>

</div>

---

## 继续学习

完成测验后，建议继续学习：

- [Redis 与 MongoDB 教程](Redis与MongoDB教程-软件测试版.md) - 查看完整教程
- [SQL 基础测验](SQL基础测验.md) - 对比关系型数据库的查询方式
- [接口抓包联调实战教程](接口抓包联调实战教程-软件测试版.md) - 把数据校验串进接口测试流程
