---
description: Redis 与 MongoDB 教程，缓存查询、数据校验和测试数据清理。
---
# Redis 与 MongoDB 教程（软件测试人员专用）

> 本教程面向软件测试工程师，讲解 Redis 和 MongoDB 在测试工作中的常用操作：连接、查询、校验数据、清理数据。

---

## 前置要求

| 项目 | 要求 | 获取方式 |
|------|------|----------|
| 数据库 SQL 基础 | 掌握 SELECT、WHERE、JOIN 等基本查询语法 | [数据库SQL教程-软件测试版](../工具操作/数据库SQL教程-软件测试版.md) |

---

## 新手导读

Redis 和 MongoDB 对新手来说容易抽象。你可以先把它们理解成“业务系统旁边的特殊数据存储”：Redis 常用来放缓存、验证码、登录态、计数器；MongoDB 常用来放文档型数据。

第一遍重点掌握：

1. 如何连接测试环境。
2. 如何查询 key 或文档。
3. 如何判断接口返回和缓存/数据库是否一致。
4. 如何谨慎清理测试数据。

不要在不确认用途的情况下删除数据，尤其不要在共享测试环境随意执行批量删除命令。

---
## 一、为什么测试要学 Redis 和 MongoDB

| 场景 | 用途 |
|------|------|
| 数据校验 | 接口返回数据 vs 缓存/数据库数据 |
| 问题排查 | 确认数据是否正确写入缓存 |
| 清理数据 | 清除登录态、验证码、限流计数 |
| 性能测试 | 验证缓存命中率 |
| Mock 数据 | 直接写入缓存构造测试场景 |

---

## 二、Redis 基础

### 2.1 Redis 是什么

Redis 是开源的 **内存键值数据库**，常用于：

- 缓存（Session、Token、热点数据）
- 分布式锁
- 计数器、限流
- 消息队列

### 2.2 数据类型

| 类型 | 说明 | 示例 |
|------|------|------|
| **String** | 字符串/数字 | `SET user:1:name "张三"` |
| **Hash** | 字段-值映射 | `HSET user:1 name "张三" age 25` |
| **List** | 有序列表 | `LPUSH queue task1` |
| **Set** | 无序集合 | `SADD tags "python" "test"` |
| **Sorted Set** | 有序集合（带分数） | `ZADD rank 100 "user1"` |

### 2.3 连接 Redis

**命令行：**

```bash
# 连接本地
redis-cli

# 连接远程
redis-cli -h 192.168.1.100 -p 6379

# 带密码
redis-cli -h 192.168.1.100 -a yourpassword

# 连接后切换数据库（0-15）
SELECT 0
SELECT 1
```

> **redis-cli 连接参数说明：**
>
> | 参数 | 含义 |
> |------|------|
> | `-h <IP>` | 指定 Redis 服务器地址（默认 127.0.0.1） |
> | `-p <端口>` | 指定端口（默认 6379） |
> | `-a <密码>` | 认证密码（生产环境建议用 `REDISCLI_AUTH` 环境变量，避免密码出现在进程列表中） |
> | `--tls` | 启用 SSL/TLS 加密连接（云 Redis 通常需要） |
> | `SELECT N` | 切换到第 N 号数据库（Redis 默认有 16 个库，编号 0-15） |

**图形化工具：**

| 工具 | 平台 | 特点 |
|------|------|------|
| **RedisInsight** | 全平台 | 官方免费 |
| **Another Redis Desktop Manager** | 全平台 | 开源免费 |
| **Redis Desktop Manager** | 全平台 | 商业 |

### 2.4 基础命令

```bash
# 查看所有 key
KEYS *

# 按模式查找
KEYS user:*
KEYS *:token

# 查看 key 类型
TYPE user:1

# 查看 key 剩余时间（秒）
TTL user:1
# -1 = 永不过期，-2 = 已过期

# 删除 key
DEL user:1

# 检查 key 是否存在
EXISTS user:1

# 查看数据库大小
DBSIZE

# 清空当前数据库
FLUSHDB

# 清空所有数据库
FLUSHALL
```

---

## 三、Redis 常用操作

### 3.1 String 操作

```bash
# 设置
SET user:1:name "张三"
SET user:1:token "eyJhbGci..." EX 3600    # 带过期时间（秒）
SET verify:code:13800138000 "8888" EX 300  # 验证码 5 分钟过期

# 获取
GET user:1:name

# 自增/自减
INCR counter:login:13800138000    # +1
INCRBY counter:login:13800138000 5  # +5
DECR counter:login:13800138000    # -1
```

### 3.2 Hash 操作

```bash
# 设置单个字段
HSET user:1 name "张三"
HSET user:1 age 25

# 设置多个字段
HSET user:1 name "张三" age 25 city "北京"

# 获取单个字段
HGET user:1 name

# 获取所有字段
HGETALL user:1

# 获取多个字段
HMGET user:1 name age

# 删除字段
HDEL user:1 age

# 字段自增
HINCRBY user:1 age 1
```

### 3.3 List 操作

```bash
# 左插入
LPUSH queue task1 task2

# 右插入
RPUSH queue task3

# 查看范围
LRANGE queue 0 -1    # 全部
LRANGE queue 0 9     # 前 10 个

# 弹出
LPOP queue    # 左弹出
RPOP queue    # 右弹出

# 长度
LLEN queue
```

### 3.4 Set 操作

```bash
# 添加
SADD tags "python" "test" "api"

# 查看所有
SMEMBERS tags

# 判断是否存在
SISMEMBER tags "python"    # 1 = 存在

# 删除
SREM tags "api"

# 集合大小
SCARD tags
```

### 3.5 过期与持久化

```bash
# 设置过期时间
EXPIRE user:1:token 3600    # 3600 秒后过期

# 查看剩余时间
TTL user:1:token

# 取消过期
PERSIST user:1:token
```

---

## 四、Redis 测试场景实战

### 4.1 场景一：验证登录 Token

```bash
# 登录后，查看 token 是否存入 Redis
KEYS *token*
# 或
KEYS user:*:token

# 获取 token 值
GET user:12345:token

# 查看过期时间
TTL user:12345:token

# 验证：token 值与接口返回一致
# 验证：过期时间符合预期（如 7200 秒）
```

### 4.2 场景二：验证码测试

```bash
# 发送验证码后查看
KEYS verify:code:*

# 获取验证码
GET verify:code:13800138000

# 查看过期时间（通常 5 分钟 = 300 秒）
TTL verify:code:13800138000

# 手动设置验证码（构造测试场景）
SET verify:code:13800138000 "8888" EX 300
```

### 4.3 场景三：限流计数器

```bash
# 查看限流计数
GET rate:limit:13800138000

# 手动重置（解除限流）
DEL rate:limit:13800138000

# 手动设置到限流阈值（测试限流触发）
SET rate:limit:13800138000 100 EX 60
```

### 4.4 场景四：缓存数据校验

```bash
# 查看用户缓存
HGETALL user:12345:info

# 验证字段值
HGET user:12345:info name
HGET user:12345:info vip_level

# 清除缓存（测试缓存失效后重建）
DEL user:12345:info
```

### 4.5 场景五：清理测试数据

```bash
# 清理所有测试 token（redis-cli 不支持管道 xargs，需通过 shell）
redis-cli KEYS "test:*:token" | xargs redis-cli DEL
```

**命令拆解：**

| 部分 | 含义 |
|------|------|
| `redis-cli KEYS "test:*:token"` | 查找所有匹配的 key |
| `\|` | 管道符，把前一个命令的输出传给下一个 |
| `xargs redis-cli DEL` | 把前面查到的 key 一个个传给 `DEL` 命令删除 |

> 简单理解：`KEYS` 查出所有 key → 用管道 `\|` 传给 `xargs` → `xargs` 批量调用 `DEL` 删除。

```bash
# 清理验证码
DEL verify:code:13800138000

# 清理限流（DEL 不支持通配符，需先 KEYS 再批量 DEL）
redis-cli KEYS "rate:limit:*" | xargs redis-cli DEL
```

**清空整个测试数据库**（谨慎！）：

```bash
# 清空整个测试数据库
SELECT 1
FLUSHDB
```

---

## 五、MongoDB 基础

### 5.1 MongoDB 是什么

MongoDB 是开源的 **文档数据库**，数据以 JSON-like 的 BSON 格式存储。

```
Database（数据库）
└── Collection（集合）      类似 MySQL 的表
    └── Document（文档）    类似 MySQL 的行（JSON 格式）
```

### 5.2 与 MySQL 对比

| 维度 | MySQL | MongoDB |
|------|-------|---------|
| 数据结构 | 行列（表） | 文档（JSON） |
| 查询语言 | SQL | MongoDB 查询语法 |
| Schema | 固定 | 灵活 |
| 适合场景 | 结构化数据 | 半结构化、灵活数据 |

### 5.3 连接 MongoDB

**命令行：**

```bash
# 连接本地
mongosh

# 连接远程
mongosh "mongodb://192.168.1.100:27017"

# 带认证
mongosh "mongodb://admin:password@192.168.1.100:27017/mydb"

# 旧版命令（mongo）
mongo -u admin -p password 192.168.1.100:27017/mydb
```

**图形化工具：**

| 工具 | 特点 |
|------|------|
| **MongoDB Compass** | 官方免费 |
| **NoSQLBooster** | 功能强 |
| **Studio 3T** | 商业 |

---

## 六、MongoDB 常用操作

### 6.1 数据库与集合

```javascript
// 查看所有数据库
show dbs

// 切换数据库
use mydb

// 查看当前数据库
db

// 查看所有集合
show collections

// 创建集合
db.createCollection("users")

// 删除集合
db.users.drop()
```

### 6.2 查询文档

```javascript
// 查询所有
db.users.find()

// 格式化输出
db.users.find().pretty()

// 条件查询
db.users.find({name: "张三"})
db.users.find({age: {$gt: 25}})
db.users.find({age: {$gte: 20, $lte: 30}})
db.users.find({city: {$in: ["北京", "上海"]}})

// 多条件
db.users.find({city: "北京", age: {$gt: 20}})

// 或条件
db.users.find({$or: [{city: "北京"}, {city: "上海"}]})

// 只查一个
db.users.findOne({name: "张三"})

// 排序
db.users.find().sort({age: 1})     // 升序
db.users.find().sort({age: -1})    // 降序

// 限制数量
db.users.find().limit(10)

// 跳过（分页）
db.users.find().skip(20).limit(10)

// 统计（count() 已废弃，MongoDB 4.0+ 用 countDocuments / estimatedDocumentCount）
db.users.estimatedDocumentCount()          // 无条件统计（快，基于元数据）
db.users.countDocuments({city: "北京"})     // 带条件统计

// 去重
db.users.distinct("city")

// 只返回指定字段
db.users.find({}, {name: 1, age: 1, _id: 0})
```

### 6.3 常用查询操作符

| 操作符 | 含义 | 示例 |
|--------|------|------|
| `$eq` | 等于 | `{age: {$eq: 25}}` |
| `$ne` | 不等于 | `{age: {$ne: 25}}` |
| `$gt` | 大于 | `{age: {$gt: 20}}` |
| `$gte` | 大于等于 | `{age: {$gte: 20}}` |
| `$lt` | 小于 | `{age: {$lt: 30}}` |
| `$lte` | 小于等于 | `{age: {$lte: 30}}` |
| `$in` | 在列表中 | `{city: {$in: ["北京","上海"]}}` |
| `$nin` | 不在列表中 | `{city: {$nin: ["北京"]}}` |
| `$and` | 与 | `{$and: [{a:1}, {b:2}]}` |
| `$or` | 或 | `{$or: [{a:1}, {b:2}]}` |
| `$not` | 非 | `{age: {$not: {$gt: 30}}}` |
| `$exists` | 字段存在 | `{email: {$exists: true}}` |
| `$regex` | 正则匹配 | `{name: {$regex: "张"}}` |

### 6.4 修改文档

```javascript
// 更新一条
db.users.updateOne(
  {name: "张三"},
  {$set: {age: 26}}
)

// 更新多条
db.users.updateMany(
  {city: "北京"},
  {$set: {status: "active"}}
)

// 字段自增
db.users.updateOne(
  {name: "张三"},
  {$inc: {login_count: 1}}
)

// 添加字段
db.users.updateOne(
  {name: "张三"},
  {$set: {vip: true}}
)

// 删除字段
db.users.updateOne(
  {name: "张三"},
  {$unset: {temp_field: ""}}
)
```

### 6.5 删除文档

```javascript
// 删除一条
db.users.deleteOne({name: "张三"})

// 删除多条
db.users.deleteMany({status: "deleted"})

// 删除所有
db.users.deleteMany({})
```

### 6.6 索引

```javascript
// 查看索引
db.users.getIndexes()

// 创建索引
db.users.createIndex({name: 1})           // 单字段
db.users.createIndex({city: 1, age: -1})  // 复合索引
db.users.createIndex({email: 1}, {unique: true})  // 唯一索引

// 删除索引
db.users.dropIndex("name_1")
```

---

## 七、MongoDB 测试场景实战

### 7.1 场景一：验证订单数据

```javascript
// 查询最近创建的订单
db.orders.find().sort({created_at: -1}).limit(5).pretty()

// 查询特定用户的订单
db.orders.find({user_id: 12345}).sort({created_at: -1})

// 查询待支付订单
db.orders.find({status: "WAIT_PAY"})

// 验证订单金额
db.orders.findOne({order_id: "ORD20260607001"})
```

### 7.2 场景二：数据一致性校验

```javascript
// 检查孤儿数据（用户已删除但订单还在）
db.orders.find({
  user_id: {$nin: db.users.distinct("user_id")}
})

// 检查状态异常
db.orders.find({
  status: "PAID",
  payment_id: {$exists: false}
})
```

### 7.3 场景三：清理测试数据

```javascript
// 清理测试用户的订单
db.orders.deleteMany({user_id: {$in: [10001, 10002, 10003]}})

// 清理 30 天前的日志
db.logs.deleteMany({
  created_at: {$lt: new Date(Date.now() - 30*24*60*60*1000)}
})

// 清空集合
db.test_data.deleteMany({})
```

### 7.4 场景四：构造测试数据

```javascript
// 插入测试用户
db.users.insertOne({
  user_id: 99999,
  name: "测试用户",
  email: "test@example.com",
  status: "active",
  created_at: new Date()
})

// 批量插入
var users = [];
for (var i = 1; i <= 100; i++) {
  users.push({
    user_id: 20000 + i,
    name: "test_user_" + i,
    email: "test" + i + "@test.com",
    status: "active"
  });
}
db.users.insertMany(users);
```

---

## 八、常见问题排查

### 8.1 Redis 连不上

```bash
# 检查端口
telnet 192.168.1.100 6379

# 检查密码
redis-cli -h 192.168.1.100 -a password PING
# 返回 PONG 表示正常

# 检查是否需要 SSL
redis-cli -h 192.168.1.100 --tls
```

### 8.2 MongoDB 连不上

```bash
# 检查端口
telnet 192.168.1.100 27017

# 检查认证
mongosh "mongodb://admin:password@192.168.1.100:27017/mydb"

# 检查防火墙
```

### 8.3 Redis key 找不到

```bash
# 用模糊搜索
KEYS *keyword*

# 确认数据库编号
SELECT 0
SELECT 1
DBSIZE

# key 可能已过期
TTL key_name    # -2 表示已过期
```

### 8.4 MongoDB 查询慢

```javascript
// 查看执行计划
db.orders.find({user_id: 12345}).explain("executionStats")

// 检查是否走了索引
// "stage": "COLLSCAN" = 全表扫描（慢）
// "stage": "IXSCAN" = 索引扫描（快）
```

---

## 附录：速查表

### Redis

```bash
KEYS pattern          # 查找 key
TYPE key              # 类型
TTL key               # 剩余时间
GET key               # 获取 String
SET key value EX sec  # 设置 String
HGETALL key           # 获取 Hash 全部
DEL key               # 删除
FLUSHDB               # 清空当前库
```

### MongoDB

```javascript
show dbs                          # 列数据库
use dbname                        # 切换数据库
show collections                  # 列集合
db.col.find({条件})                # 查询
db.col.find().pretty()            # 格式化
db.col.updateOne({条件}, {$set:{}}) # 更新
db.col.deleteMany({条件})          # 删除
db.col.countDocuments({条件})        # 统计
db.col.distinct("field")          # 去重
```

---

!!! warning "测试纪律"
    清理 Redis/MongoDB 数据前确认是测试环境。生产环境禁止执行 FLUSHDB/FLUSHALL。重要操作前先备份。

---

## 动手任务：定位「商品详情缓存与 DB 数据不一致」的根因

> 这是本教程的收尾练习。请**独立完成**，不要先看参考答案。目标不是"把 Redis 连上"，而是**用命令证据区分「缓存策略问题」和「写入逻辑缺陷」**。

### 任务背景

版本回归时，测试同学反馈：商品详情页偶发出现**旧的商品名称**，刷新几次后又变正常，重启 Redis 后现象消失。

研发第一反应是"缓存本来就会有一段时间不一致，等等就好"。你要做的是：**用 Redis 与 MongoDB 命令把现象复现出来、把证据钉死**，然后判断这到底是**缓存过期策略本身的问题**，还是**代码写入逻辑的缺陷**，并说清依据。

### 任务准备

**环境：** 测试环境（禁止在生产环境执行任何写操作）。Redis `192.168.1.100:6379`，MongoDB `mongodb://tester:pwd@192.168.1.100:27017/eshop_test`。

**负责商品详情缓存的服务：** `product-service`，缓存 key 规则为 `product:detail:{productId}`，读取分支里设置的逻辑过期时间是 **300 秒**。

**测试数据（已在环境里构造好）：**

| 数据 | 值 |
|------|-----|
| Redis key | `product:detail:10001`（Hash，字段 `id` / `name` / `price` / `stock`） |
| Redis key 剩余 TTL | 见任务中的 `TTL` 输出 |
| MongoDB 集合 | `eshop_test.products`，`product_id = 10001` |

**现象记录（复现步骤）：**

| 时间 | 操作 | 观察结果 |
|------|------|----------|
| T0 | 查询商品详情接口 `GET /api/product/10001` | 返回 `name = "小米移动电源 10000mAh"`（正确） |
| T1 | 运营在后台把商品名改成 `"小米移动电源 10000mAh 快充版"` | 后台提示保存成功 |
| T2 | 立即再查接口 | 仍返回**旧名称** ← 问题现象 |
| T3 | 执行 `DEL product:detail:10001` 后再查 | 返回新名称（正确） |
| T4 | 再次改回旧名称，重复 T2 | 仍旧名称，问题 100% 复现 |

**代码侧信息（研发提供，需你自行验证）：**

```python
# product_service.py —— 后台保存商品
def update_product(product_id, data):
    db.products.update_one({"product_id": product_id}, {"$set": data})
    # TODO: 这里似乎漏了什么

# product_service.py —— 查询商品详情
def get_product_detail(product_id):
    key = f"product:detail:{product_id}"
    cached = redis.hgetall(key)           # 注意：没有先判断返回是否为空
    if cached:
        return cached
    row = db.products.find_one({"product_id": product_id})
    redis.hset(key, mapping=row)
    redis.expire(key, 300)
    return row
```

### 任务要求

请依次完成，并**保留每条命令和输出**：

1. **确认缓存里到底有什么**：连接 Redis，用 `TYPE` 确认 key 的数据类型，用 `HGETALL` 打印全部字段，用 `TTL` 记录剩余过期时间。判断这个 key 的形态（未过期 / 永不过期 / 已过期）与代码里 `expire(key, 300)` 是否吻合。
2. **与 DB 做逐字段对比**：连接 MongoDB，用 `findOne` 查出 `product_id = 10001` 的文档，做成"Redis vs Mongo 字段对比表"，指出**哪些字段不一致、不一致的字段是否正好是"被修改过的字段"**。
3. **区分"过期策略问题"和"写入逻辑缺陷"**：设计并执行 2-3 条命令验证你的判断。提示方向：① 执行 `DEL` 之后现象是否消失；② `TTL` 返回 `-1` 意味着什么、是否说明 key 被写成了**永不过期**；③ 保存商品时是否应该**主动失效缓存**。用命令输出作为证据，不要只写结论。
4. **给出可复用产出**：写一段 3-5 行的**缺陷描述**（现象、复现步骤、证据、根因、修复建议），再补一条**通用的缓存一致性测试用例**（含前置条件、步骤、预期），让后续任意一个带缓存的接口都能套用。

### 提交物

| 产出 | 要求 |
|------|------|
| Redis 侧证据 | `TYPE` / `TTL` / `HGETALL` 的原始输出（含执行命令） |
| MongoDB 侧证据 | `findOne` 查询语句 + 返回文档 |
| 字段对比表 | Redis 值 / Mongo 值 / 是否一致 / 说明，逐字段列出 |
| 判定结论 | 明确写出是"缓存过期策略问题"还是"写入逻辑缺陷"，并附支撑证据 |
| 缺陷描述 | 3-5 行，可直接粘贴到缺陷单 |
| 通用测试用例 | 一条可复用的缓存一致性用例 |

### 完成标准

- [ ] 能用 `TYPE` / `TTL` / `HGETALL` 三条命令完整描述一个缓存 key 的现状（类型、剩余寿命、内容）
- [ ] 能用 MongoDB `findOne` 取出 DB 侧文档，并与缓存做**逐字段**对比，而不是只看整体是否"像"
- [ ] 能正确解释 `TTL` 的 `-1`（key 存在但永不过期）与 `-2`（key 不存在）分别意味着什么
- [ ] 能说清"更新 DB 后未主动失效缓存"属于写入逻辑缺陷，而不是"缓存天生不一致"
- [ ] 产出的测试用例可被其他带缓存的接口直接复用
- [ ] 全程只在测试环境操作，未执行 `FLUSHDB` / `FLUSHALL`

??? tip "参考答案与思路（先自己做完再看）"

    **第 1 题：确认缓存现状**

    ```bash
    redis-cli -h 192.168.1.100 -p 6379 -a <password>
    SELECT 0
    TYPE product:detail:10001      # hash
    TTL  product:detail:10001      # 关键输出：-1
    HGETALL product:detail:10001
    ```

    ```text
    # 实际返回
    hash
    (integer) -1
    1) "id"      2) "10001"
    3) "name"    4) "小米移动电源 10000mAh"
    5) "price"   6) "79.00"
    7) "stock"   8) "128"
    ```

    要点：`TTL` 返回 **-1 表示 key 存在但没有设置过期时间（永不过期）**，返回 **-2 表示 key 不存在**。代码里 `get_product_detail` 走的是 `hset` + `expire(key, 300)` 分支，理论上 TTL 应该是 300 以内的正数；实际却是 -1，说明**这条 key 不是由该分支写入的**，或者写入后被另一条路径覆盖成了永久 key。这是第一个关键线索。

    **第 2 题：与 DB 逐字段对比**

    ```javascript
    use eshop_test
    db.products.findOne({product_id: 10001})
    ```

    ```text
    {
      _id: ObjectId("66f1a2c3d4e5f6a7b8c9d0e1"),
      product_id: 10001,
      name: "小米移动电源 10000mAh 快充版",
      price: 79.00,
      stock: 128,
      updated_at: ISODate("2026-09-14T10:12:31.000Z")
    }
    ```

    | 字段 | Redis 值 | Mongo 值 | 是否一致 | 说明 |
    |------|---------|---------|---------|------|
    | `id` | 10001 | 10001 | 一致 | 主键不变 |
    | `name` | 小米移动电源 10000mAh | 小米移动电源 10000mAh 快充版 | 不一致 | **正好是被改过的字段** |
    | `price` | 79.00 | 79.00 | 一致 | 未修改 |
    | `stock` | 128 | 128 | 一致 | 未修改 |

    结论雏形：**只有"被业务修改过的字段"不一致**，不是随机脏数据，也不是缓存写错了值——缓存里保存的是**修改前的旧快照**。

    **第 3 题：区分过期策略问题 vs 写入逻辑缺陷**

    三个判别实验：

    ```bash
    # 实验 A：删掉缓存，看现象是否消失
    DEL product:detail:10001
    TTL product:detail:10001      # -2，key 已被删除
    # 再调一次 GET /api/product/10001 → 返回"快充版"（正确）
    # 再次 HGETALL → name 已更新为"快充版"，TTL 变成 300 以内的正数
    ```

    ```bash
    # 实验 B：确认 key 的诞生路径
    TTL product:detail:10001      # -1（永不过期），而 get_product_detail 只写 300 秒
    # → 说明还存在一条"预热 / 全量同步"写入路径（如定时任务 hset + persist），
    #   它用不过期的方式写了这份旧快照；因此"等 5 分钟自愈"根本不成立
    ```

    ```text
    实验 C：推演"只调长或调短过期时间"能否解决
      TTL 到期后 key 被删除，下一次读请求会重新从 DB 加载并写回 —— 此时读到的是新值。
      所以即使把 300 秒改成 10 秒，也只是把"不一致窗口"从最长 300 秒压到 10 秒；
      只要「更新 DB 后不失效缓存」这个缺陷还在，不一致就一定还会发生。
      → 问题不在"过期时间太长"，而在"更新 DB 后没有失效缓存"。
    ```

    判定结论：

    | 假设 | 判别方法 | 结论 |
    |------|---------|------|
    | 缓存过期策略不合理（300 秒太长） | 实验 A：手动 `DEL` 后立即正确 | 不是根因，只是**掩盖**问题 |
    | 代码写入逻辑缺陷：更新 DB 后未失效缓存 | 实验 A + 代码 `update_product` 里的 `# TODO` | **根因** |
    | key 被写成永不过期，导致"等一会就好"不成立 | `TTL` 返回 -1 | 加剧因素 |

    一句话根因：**`update_product` 只写了数据库，没有 `DEL`（或重置 TTL）掉对应缓存 key，导致读到修改前的旧快照；同时又存在一条永久写入路径，使该 key 永不自然过期。**

    **第 4 题：可复用产出**

    缺陷描述（可直接粘贴）：

    > **标题**：修改商品名称后，商品详情接口持续返回旧名称（缓存未失效）
    >
    > **现象**：后台修改商品名称成功后，`GET /api/product/10001` 持续返回修改前的名称；手动 `DEL product:detail:10001` 后立即恢复正确。
    >
    > **复现步骤**：见任务准备 T0-T4，复现率 100%。
    >
    > **证据**：`TTL product:detail:10001` = `-1`（永不过期）；`HGETALL` 中 `name` 为旧值，Mongo `findOne` 中 `name` 为新值，其余字段一致。
    >
    > **根因**：`update_product` 更新 DB 后未失效缓存 key；另有预热路径写入永久 key，使问题无法自愈。
    >
    > **修复建议**：更新 DB 成功后 `DEL`（或重新 `EXPIRE` 一个短 TTL）对应 key；预热路径统一补上 `EXPIRE`。

    通用缓存一致性测试用例：

    ```text
    用例编号：CACHE-001
    前置条件：目标接口已开启缓存，缓存 TTL > 0；测试环境可连 Redis / DB
    步骤：
      1. 通过接口读取数据，确认缓存已生成（TTL > 0）
      2. 记录 Redis 缓存值（HGETALL / GET）
      3. 通过后台或 DB 修改同一份数据的某个字段
      4. 再次通过接口读取，并同时读取 Redis 与 DB
    预期结果：
      1. 接口返回值为修改后的新值
      2. 修改后缓存 key 已被删除，或值已同步为新值
      3. 若缓存仍为旧值 → 判定为"写后未失效缓存"缺陷
    ```
### 推荐下一步

根据你的学习进度，选择下一步：

1. **如果你想学接口联调**：学习 [接口抓包联调实战](接口抓包联调实战教程-软件测试版.md)，掌握完整工作流
2. **如果你想进入专项测试**：学习 [接口测试方法论](../专项测试/接口测试完整教程-软件测试版.md)，掌握用例设计
3. **如果你想学正则**：学习 [正则表达式教程](正则表达式教程-软件测试版.md)，提升日志分析和数据提取能力

### 阶段测验

完成教程后，建议做 [Redis 与 MongoDB 测验](Redis与MongoDB测验.md) 检验学习效果。

### 通关检查

完成本阶段后，使用 [第2阶段-工具实战通关](../学习中心/第2阶段-工具实战通关.md) 检查是否可以进入下一阶段。
