# Redis 与 MongoDB 教程（软件测试人员专用）

> 本教程面向软件测试工程师，讲解 Redis 和 MongoDB 在测试工作中的常用操作：连接、查询、校验数据、清理数据。

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

# 清理验证码
DEL verify:code:13800138000

# 清理限流（DEL 不支持通配符，需先 KEYS 再批量 DEL）
redis-cli KEYS "rate:limit:*" | xargs redis-cli DEL

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

> **测试纪律：** 清理 Redis/MongoDB 数据前确认是测试环境。生产环境禁止执行 FLUSHDB/FLUSHALL。重要操作前先备份。
