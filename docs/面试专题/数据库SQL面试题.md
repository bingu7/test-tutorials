---
description: 数据库与 SQL 面试题，查询优化、索引原理、事务隔离和数据校验。
---
# 数据库与 SQL 面试题

数据库面试重点包括 SQL 查询、索引原理、事务特性和数据校验。

## SQL 中 JOIN 有哪几种类型？

```text
1. INNER JOIN（内连接）
   - 只返回两表都匹配的行
   - SELECT * FROM A INNER JOIN B ON A.id = B.a_id

2. LEFT JOIN（左连接）
   - 返回左表所有行，右表匹配的行，不匹配为 NULL
   - SELECT * FROM A LEFT JOIN B ON A.id = B.a_id

3. RIGHT JOIN（右连接）
   - 返回右表所有行，左表匹配的行

4. CROSS JOIN（交叉连接）
   - 返回两表的笛卡尔积（A 行数 × B 行数）

测试中常用 LEFT JOIN 找"有主表但没有关联数据"的异常：
  SELECT * FROM orders LEFT JOIN payments ON orders.id = payments.order_id
  WHERE payments.id IS NULL  -- 找出没有支付记录的订单
```

## 什么是索引？为什么能加速查询？

```text
索引 = 数据库的"目录"

原理：
- 没有索引：全表扫描（逐行检查）
- 有索引：通过 B+ 树快速定位

类比：
- 没有索引 → 在字典里逐页找"测试"
- 有索引 → 先翻到 T 开头的页，再找"测试"

索引类型：
- 主键索引：自动创建，唯一
- 唯一索引：值不能重复
- 普通索引：最常用
- 复合索引：多列组合索引

代价：
- 占用存储空间
- 写入操作变慢（要同时更新索引）
```

## 什么情况下索引会失效？

```text
索引失效的常见情况：

1. 对索引列使用函数
   WHERE YEAR(create_time) = 2025  ❌
   WHERE create_time >= '2025-01-01'  ✅

2. 对索引列做运算
   WHERE id + 1 = 10  ❌
   WHERE id = 9  ✅

3. LIKE 以通配符开头
   WHERE name LIKE '%test'  ❌
   WHERE name LIKE 'test%'  ✅

4. OR 条件中有非索引列
   WHERE indexed_col = 1 OR non_indexed_col = 2  ❌

5. 类型不匹配
   WHERE varchar_col = 123  ❌（隐式转换）
   WHERE varchar_col = '123'  ✅
```

## 事务的 ACID 特性是什么？

```text
A（Atomicity）原子性
  - 事务中的操作要么全部成功，要么全部回滚
  - 例：转账时扣款和加款必须同时成功或同时失败

C（Consistency）一致性
  - 事务前后数据状态一致
  - 例：转账前后总金额不变

I（Isolation）隔离性
  - 并发事务之间互不干扰
  - 例：两个事务同时修改同一行，不会出现脏数据

D（Durability）持久性
  - 事务提交后数据永久保存
  - 例：即使数据库重启，已提交的数据不丢失
```

## MySQL 有哪些事务隔离级别？

```text
从低到高：

1. READ UNCOMMITTED（读未提交）
   - 能读到其他事务未提交的数据（脏读）
   - 几乎不用

2. READ COMMITTED（读已提交）
   - 只能读到其他事务已提交的数据
   - 解决脏读，但有不可重复读问题

3. REPEATABLE READ（可重复读）
   - MySQL 默认级别
   - 同一事务内多次读取结果一致
   - 解决不可重复读，但有幻读问题

4. SERIALIZABLE（串行化）
   - 最严格，完全串行执行
   - 性能最差

测试中关注：
- 高并发下数据一致性
- 脏读、幻读是否出现
```

## 怎么用 SQL 做数据校验？

```text
测试中常用的 SQL 校验：

1. 校验数据是否落库
   SELECT * FROM orders WHERE order_id = 'xxx';

2. 校验状态变化
   SELECT order_status FROM orders WHERE order_id = 'xxx';
   -- 预期：待支付 → 已支付

3. 校验数据一致性
   SELECT COUNT(*) FROM orders WHERE user_id = 1;
   -- 和页面显示的订单数对比

4. 校验金额计算
   SELECT SUM(amount) FROM order_items WHERE order_id = 'xxx';
   -- 和订单总金额对比

5. 校验数据唯一性
   SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;
   -- 检查是否有重复邮箱
```

## DELETE、TRUNCATE、DROP 有什么区别？

```text
DELETE：
- 逐行删除，可回滚
- 不重置自增 ID
- 触发触发器
- DELETE FROM users WHERE id = 1;

TRUNCATE：
- 清空表数据，不可回滚
- 重置自增 ID
- 不触发触发器
- TRUNCATE TABLE users;

DROP：
- 删除整个表（结构 + 数据）
- 不可回滚
- DROP TABLE users;

测试中：清理测试数据用 TRUNCATE，删除特定数据用 DELETE。
```

## 面试评分参考

| 维度 | 初级（1-2年） | 中级（3-5年） |
|------|-------------|-------------|
| SQL 基础 | 会增删改查、多表查询 | 能写复杂查询、子查询、窗口函数 |
| 索引理解 | 知道索引能加速 | 知道索引失效场景、能看执行计划 |
| 事务理解 | 知道 ACID | 能解释隔离级别和锁机制 |
| 数据校验 | 能写基本校验 SQL | 能设计完整的数据校验方案 |
