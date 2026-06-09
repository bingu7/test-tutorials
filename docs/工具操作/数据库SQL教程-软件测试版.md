# 数据库 SQL 教程（软件测试人员专用）

> 本教程面向软件测试工程师，聚焦测试日常使用场景：数据查询、数据校验、造数据、问题排查。以 MySQL 为主，兼顾通用 SQL 语法。

---

## 新手导读

测试人员学 SQL，第一目标是会查数据、校验数据、定位问题，不是成为 DBA。

建议第一遍只抓住四类语句：

1. `SELECT`：查询数据。
2. `WHERE`：筛选数据。
3. `JOIN`：关联多张表。
4. `ORDER BY` / `GROUP BY`：排序和统计。

学习时每条 SQL 都要问自己：这条语句能帮我验证什么业务结果？例如接口返回订单成功后，要能查订单表、订单明细表和库存表是否一致。

---
## 一、数据库基础

### 1.1 测试人员为什么要学 SQL

| 场景 | 用途 |
|------|------|
| 数据校验 | 接口返回数据 vs 数据库实际数据 |
| 造测试数据 | 直接插入数据库构造测试场景 |
| 数据清理 | 清理脏数据、重置环境 |
| 问题排查 | 查日志表、状态表定位 Bug |
| 性能分析 | 分析慢查询、索引使用 |
| 自动化辅助 | 自动化脚本中查询验证 |

### 1.2 关系型数据库 vs NoSQL

| 类型 | 代表 | 特点 |
|------|------|------|
| **关系型** | MySQL、Oracle、PostgreSQL、SQL Server | 表结构固定，强一致性，SQL 标准 |
| **NoSQL** | Redis、MongoDB、Elasticsearch | 灵活结构，高性能，专用查询 |

测试人员日常接触最多：**MySQL** + **Redis** + **MongoDB**。本教程以 MySQL 为主。

### 1.3 数据库核心概念

```
数据库（Database）
└── 表（Table）              如：users 表
    ├── 列（Column / Field）  如：id、name、age
    └── 行（Row / Record）    如：(1, '张三', 25)
```

**示例：users 表**

| id | name | age | email | created_at |
|----|------|-----|-------|------------|
| 1 | 张三 | 25 | zhang@test.com | 2026-01-01 10:00:00 |
| 2 | 李四 | 30 | li@test.com | 2026-01-02 11:00:00 |
| 3 | 王五 | 28 | wang@test.com | 2026-01-03 09:00:00 |

### 1.4 常见数据类型

**数值：**

| 类型 | 范围 | 说明 |
|------|------|------|
| `TINYINT` | -128~127 | 1 字节 |
| `INT` | ±21 亿 | 4 字节，最常用 |
| `BIGINT` | ±9.2*10^18 | 8 字节，订单号、用户 ID |
| `DECIMAL(10,2)` | 精确小数 | 金额必用，禁用 FLOAT |
| `FLOAT/DOUBLE` | 浮点 | 不精确 |

**字符串：**

| 类型 | 长度 | 说明 |
|------|------|------|
| `CHAR(n)` | 固定 n 字符 | 性别、状态码 |
| `VARCHAR(n)` | 可变长 ≤ n | 姓名、邮箱（最常用） |
| `TEXT` | 长文本 | 评论、文章 |

**日期时间：**

| 类型 | 格式 |
|------|------|
| `DATE` | 2026-06-07 |
| `TIME` | 14:30:00 |
| `DATETIME` | 2026-06-07 14:30:00 |
| `TIMESTAMP` | 时间戳，自动更新 |

**其他：**

| 类型 | 说明 |
|------|------|
| `BOOLEAN` | 实际是 TINYINT(1) |
| `JSON` | JSON 数据（MySQL 5.7+） |
| `ENUM` | 枚举 |

---

## 二、环境与客户端

### 2.1 MySQL 安装

**Windows：** 官网下载 MySQL Installer，一路 Next

**Mac：** `brew install mysql`

**Linux：**
```bash
# Ubuntu
sudo apt install mysql-server

# CentOS
sudo yum install mysql-server
```

测试人员一般不需要自己装，直接连公司数据库即可。

### 2.2 客户端工具

| 工具 | 平台 | 特点 |
|------|------|------|
| **Navicat** | 全平台 | 商业，功能强 |
| **DBeaver** | 全平台 | 开源免费，推荐 |
| **DataGrip** | 全平台 | JetBrains 家族，付费 |
| **MySQL Workbench** | 全平台 | 官方免费 |
| **HeidiSQL** | Windows | 轻量免费 |
| **命令行 mysql** | 全平台 | 服务器排查 |

### 2.3 连接数据库

**命令行：**

```bash
mysql -h 192.168.1.100 -P 3306 -u testuser -p
# 然后输入密码

# 一行连接
mysql -h 192.168.1.100 -u testuser -p123456 testdb
```

**连接参数：**

| 参数 | 含义 |
|------|------|
| `-h` | 主机 IP |
| `-P` | 端口（默认 3306） |
| `-u` | 用户名 |
| `-p` | 密码（建议不要直接跟，避免历史泄露） |
| 最后参数 | 数据库名 |

### 2.4 数据库基本操作

```sql
-- 显示所有数据库
SHOW DATABASES;

-- 切换数据库
USE testdb;

-- 显示当前数据库
SELECT DATABASE();

-- 显示所有表
SHOW TABLES;

-- 查看表结构
DESC users;
SHOW CREATE TABLE users;

-- 查看当前用户
SELECT USER();

-- 查看 MySQL 版本
SELECT VERSION();
```

---

## 三、SQL 基础语法

### 3.1 SQL 分类

| 分类 | 全称 | 包含 |
|------|------|------|
| **DQL** | 数据查询语言 | SELECT |
| **DML** | 数据操作语言 | INSERT、UPDATE、DELETE |
| **DDL** | 数据定义语言 | CREATE、ALTER、DROP |
| **DCL** | 数据控制语言 | GRANT、REVOKE |

测试人员日常 90% 用 DQL，10% 用 DML，DDL/DCL 几乎不用（开发或 DBA 负责）。

### 3.2 SQL 语法规则

- 关键字不区分大小写（习惯大写）
- 表名、列名区分大小写（Linux 服务器上）
- 字符串用 **单引号** `'value'`
- 每条语句以 **分号** 结尾
- `--` 单行注释，`/* */` 多行注释

```sql
-- 这是注释
SELECT * FROM users;  /* 查所有用户 */
```

### 3.3 一个完整的查询语句框架

```sql
SELECT  字段
FROM    表
WHERE   条件
GROUP BY 分组字段
HAVING  分组后筛选条件
ORDER BY 排序字段
LIMIT   分页;
```

**执行顺序（重要）：**

```
FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
```

---

## 四、查询语句详解

### 4.1 基础查询

```sql
-- 查所有列
SELECT * FROM users;

-- 查指定列
SELECT id, name, email FROM users;

-- 列起别名
SELECT name AS 姓名, age AS 年龄 FROM users;
SELECT name 姓名, age 年龄 FROM users;  -- AS 可省略

-- 去重
SELECT DISTINCT city FROM users;

-- 计算字段
SELECT name, age, age * 12 AS months FROM users;

-- 字符串拼接（MySQL 用 CONCAT）
SELECT CONCAT(name, '-', email) AS info FROM users;
```

### 4.2 WHERE 条件

**比较运算：**

```sql
SELECT * FROM users WHERE age = 25;
SELECT * FROM users WHERE age > 25;
SELECT * FROM users WHERE age >= 25;
SELECT * FROM users WHERE age <> 25;    -- 不等于
SELECT * FROM users WHERE age != 25;    -- 也是不等于
```

**逻辑运算：**

```sql
-- AND
SELECT * FROM users WHERE age > 20 AND age < 30;

-- OR
SELECT * FROM users WHERE city = '北京' OR city = '上海';

-- NOT
SELECT * FROM users WHERE NOT city = '北京';
```

**范围与集合：**

```sql
-- BETWEEN（含两端）
SELECT * FROM users WHERE age BETWEEN 20 AND 30;
-- 等价于：age >= 20 AND age <= 30

-- IN
SELECT * FROM users WHERE city IN ('北京', '上海', '深圳');

-- NOT IN
SELECT * FROM users WHERE city NOT IN ('北京', '上海');
```

**NULL 处理：**

```sql
-- NULL 不能用 = 比较
SELECT * FROM users WHERE email IS NULL;
SELECT * FROM users WHERE email IS NOT NULL;

-- ⚠️ 错误写法
SELECT * FROM users WHERE email = NULL;  -- 永远查不到
```

**模糊查询（LIKE）：**

```sql
-- % 任意字符串，_ 单个字符
SELECT * FROM users WHERE name LIKE '张%';      -- 张开头
SELECT * FROM users WHERE name LIKE '%伟';      -- 伟结尾
SELECT * FROM users WHERE name LIKE '%伟%';     -- 包含伟
SELECT * FROM users WHERE name LIKE '张_';      -- 张+任意 1 字
SELECT * FROM users WHERE name LIKE '张__';     -- 张+任意 2 字
```

### 4.3 排序 ORDER BY

```sql
-- 升序（默认）
SELECT * FROM users ORDER BY age;
SELECT * FROM users ORDER BY age ASC;

-- 降序
SELECT * FROM users ORDER BY age DESC;

-- 多字段排序
SELECT * FROM users ORDER BY city ASC, age DESC;

-- 按位置（不推荐，可读性差）
SELECT name, age FROM users ORDER BY 2 DESC;  -- 按 age
```

### 4.4 分页 LIMIT

```sql
-- 取前 10 条
SELECT * FROM users LIMIT 10;

-- 跳过 20 条，取 10 条（第 3 页，每页 10）
SELECT * FROM users LIMIT 20, 10;
SELECT * FROM users LIMIT 10 OFFSET 20;  -- 等价写法

-- 分页公式：
-- 第 N 页，每页 size 条 → LIMIT (N-1)*size, size
```

### 4.5 分组 GROUP BY

```sql
-- 按城市分组，统计每城市人数
SELECT city, COUNT(*) AS cnt
FROM users
GROUP BY city;

-- 按城市分组，统计每城市平均年龄
SELECT city, AVG(age) AS avg_age
FROM users
GROUP BY city;

-- 多字段分组
SELECT city, gender, COUNT(*)
FROM users
GROUP BY city, gender;
```

### 4.6 HAVING（分组后过滤）

```sql
-- 城市人数 > 100 的
SELECT city, COUNT(*) AS cnt
FROM users
GROUP BY city
HAVING COUNT(*) > 100;
```

> **注意：** 标准 SQL 中 HAVING 执行顺序在 SELECT 之前，不能引用 SELECT 别名。MySQL 宽松允许 `HAVING cnt > 100`（别名），但写 `HAVING COUNT(*) > 100` 更规范、跨数据库兼容。

**WHERE vs HAVING：**

```sql
SELECT city, COUNT(*) AS cnt
FROM users
WHERE age > 18        -- 分组前过滤
GROUP BY city
HAVING COUNT(*) > 100 -- 分组后过滤（用聚合函数，不用别名）
ORDER BY cnt DESC
LIMIT 10;
```

### 4.7 完整查询示例

```sql
-- 查每个城市 18 岁以上的人数，人数 > 100 的，
-- 按人数降序，取前 10
SELECT city, COUNT(*) AS user_count
FROM users
WHERE age >= 18
  AND status = 'ACTIVE'
GROUP BY city
HAVING COUNT(*) > 100
ORDER BY user_count DESC
LIMIT 10;
```

---

## 五、多表查询

### 5.1 JOIN 连接基础

实际业务中数据分散在多张表，需要联表查询。

**示例数据：**

`users` 表（用户）：

| id | name | city |
|----|------|------|
| 1 | 张三 | 北京 |
| 2 | 李四 | 上海 |
| 3 | 王五 | 广州 |

`orders` 表（订单）：

| id | user_id | amount | status |
|----|---------|--------|--------|
| 101 | 1 | 100 | PAID |
| 102 | 1 | 200 | UNPAID |
| 103 | 2 | 300 | PAID |
| 104 | 99 | 50 | PAID |

### 5.2 INNER JOIN（内连接）

只返回两边都匹配的记录。

```sql
SELECT u.name, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
```

结果：

| name | amount |
|------|--------|
| 张三 | 100 |
| 张三 | 200 |
| 李四 | 300 |

王五没有订单不出现；订单 104 没有对应用户也不出现。

### 5.3 LEFT JOIN（左连接，最常用）

左表全保留，右表无匹配为 NULL。

```sql
SELECT u.name, o.amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
```

结果：

| name | amount |
|------|--------|
| 张三 | 100 |
| 张三 | 200 |
| 李四 | 300 |
| 王五 | NULL |

### 5.4 RIGHT JOIN（右连接，少用）

右表全保留，左表无匹配为 NULL。

```sql
SELECT u.name, o.amount
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;
```

| name | amount |
|------|--------|
| 张三 | 100 |
| 张三 | 200 |
| 李四 | 300 |
| NULL | 50 |

### 5.5 三表以上联查

```sql
SELECT u.name, o.id AS order_id, p.name AS product_name
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
WHERE u.city = '北京';
```

### 5.6 子查询

**WHERE 子查询：**

```sql
-- 查询有订单的用户
SELECT * FROM users 
WHERE id IN (SELECT DISTINCT user_id FROM orders);

-- 查询消费金额最高的用户
SELECT * FROM users
WHERE id = (
    SELECT user_id FROM orders 
    GROUP BY user_id 
    ORDER BY SUM(amount) DESC 
    LIMIT 1
);
```

**FROM 子查询（派生表）：**

```sql
SELECT t.user_id, t.total
FROM (
    SELECT user_id, SUM(amount) AS total
    FROM orders
    GROUP BY user_id
) t
WHERE t.total > 1000;
```

**EXISTS：**

```sql
-- 有订单的用户
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

### 5.7 UNION 合并结果

```sql
-- UNION 去重合并
SELECT name FROM users
UNION
SELECT username FROM admins;

-- UNION ALL 不去重（性能更好）
SELECT name FROM users
UNION ALL
SELECT username FROM admins;
```

要求两侧 SELECT 列数相同，类型兼容。

---

## 六、数据修改

> ⚠️ **极危险！** DELETE / UPDATE 没有 WHERE 会清空整张表。测试人员操作前务必三思，最好先 SELECT 验证。

### 6.1 INSERT 插入

```sql
-- 完整插入
INSERT INTO users (name, age, email, city)
VALUES ('张三', 25, 'zhang@test.com', '北京');

-- 省略字段名（必须按表字段顺序提供全部值，含主键和所有非空字段）
-- 假设 users 表字段顺序为 (id, name, age, email, city, created_at)
INSERT INTO users VALUES (NULL, '张三', 25, 'zhang@test.com', '北京', NOW());
-- ⚠️ 不推荐：依赖字段顺序，表结构变了就报错；建议永远写明字段名

-- 批量插入
INSERT INTO users (name, age, city) VALUES 
('张三', 25, '北京'),
('李四', 30, '上海'),
('王五', 28, '广州');

-- 插入查询结果
INSERT INTO users_backup (id, name, age)
SELECT id, name, age FROM users WHERE city = '北京';
```

### 6.2 UPDATE 修改

```sql
-- 修改单条
UPDATE users SET age = 26 WHERE id = 1;

-- 修改多个字段
UPDATE users 
SET age = 26, city = '上海'
WHERE id = 1;

-- 批量修改
UPDATE users SET status = 'INACTIVE' WHERE last_login < '2025-01-01';

-- 表达式更新
UPDATE users SET age = age + 1 WHERE id = 1;
UPDATE products SET price = price * 0.9 WHERE category = '清仓';

-- 关联更新
UPDATE users u
JOIN orders o ON u.id = o.user_id
SET u.vip_level = 1
WHERE o.total_amount > 10000;
```

**测试人员操作规范：**

```sql
-- Step 1：先用 SELECT 验证条件能查到正确数据
SELECT * FROM users WHERE id = 1;

-- Step 2：开启事务（可回滚）
BEGIN;

-- Step 3：执行 UPDATE
UPDATE users SET age = 26 WHERE id = 1;

-- Step 4：再 SELECT 验证结果
SELECT * FROM users WHERE id = 1;

-- Step 5：确认无误后提交，错了 ROLLBACK
COMMIT;
-- 或 ROLLBACK;
```

### 6.3 DELETE 删除

```sql
-- 删除单条
DELETE FROM users WHERE id = 1;

-- 批量删除
DELETE FROM users WHERE status = 'INACTIVE';

-- 删除所有数据（保留表结构）
DELETE FROM users;          -- 慢，可回滚
TRUNCATE TABLE users;       -- 快，不可回滚，自增 ID 重置
```

**TRUNCATE vs DELETE：**

| 维度 | DELETE | TRUNCATE |
|------|--------|----------|
| 类型 | DML | DDL |
| WHERE | 支持 | 不支持 |
| 速度 | 慢 | 快 |
| 自增 ID | 不重置 | 重置 |
| 触发器 | 触发 | 不触发 |
| 事务 | 可回滚 | 隐式提交，不可回滚 |

> **TRUNCATE 注意：** MySQL 中 TRUNCATE 会隐式提交事务，即使在 BEGIN 后执行也无法 ROLLBACK 撤销。

### 6.4 安全操作建议

**MySQL 安全模式：**

```sql
-- 开启后，UPDATE/DELETE 必须有 WHERE 主键/索引
SET SQL_SAFE_UPDATES = 1;
```

**操作前自检：**

- [ ] 是否在正确的数据库？`SELECT DATABASE();`
- [ ] WHERE 条件是否能匹配到正确数据？先 SELECT 验证
- [ ] 影响的行数是否符合预期？
- [ ] 是否开了事务？万一错了能回滚
- [ ] 是否是生产环境？（生产禁止测试人员操作）

---

## 七、常用函数

### 7.1 字符串函数

```sql
-- 长度
SELECT LENGTH('hello');         -- 5（字节）
SELECT CHAR_LENGTH('你好');     -- 2（字符）

-- 大小写
SELECT UPPER('hello');          -- HELLO
SELECT LOWER('HELLO');          -- hello

-- 截取
SELECT SUBSTRING('hello world', 1, 5);  -- hello（从 1 开始）
SELECT LEFT('hello', 3);                 -- hel
SELECT RIGHT('hello', 3);                -- llo

-- 拼接
SELECT CONCAT('hello', '-', 'world');           -- hello-world
SELECT CONCAT_WS('-', 'a', 'b', 'c');           -- a-b-c

-- 替换
SELECT REPLACE('hello world', 'o', '0');         -- hell0 w0rld

-- 去空格
SELECT TRIM('  hello  ');       -- hello
SELECT LTRIM('  hello');        -- hello
SELECT RTRIM('hello  ');        -- hello

-- 填充
SELECT LPAD('5', 3, '0');       -- 005
SELECT RPAD('5', 3, '0');       -- 500
```

### 7.2 数值函数

```sql
SELECT ABS(-5);                  -- 5
SELECT CEIL(3.2);                -- 4 向上取整
SELECT FLOOR(3.8);               -- 3 向下取整
SELECT ROUND(3.567, 2);          -- 3.57 保留 2 位
SELECT MOD(10, 3);               -- 1 取余
SELECT 10 % 3;                   -- 1 等价
SELECT POWER(2, 10);             -- 1024
SELECT SQRT(16);                 -- 4
SELECT RAND();                   -- 随机 0~1
```

### 7.3 日期时间函数

```sql
-- 当前
SELECT NOW();                    -- 2026-06-07 14:30:00
SELECT CURDATE();                -- 2026-06-07
SELECT CURTIME();                -- 14:30:00

-- 提取部分
SELECT YEAR('2026-06-07');       -- 2026
SELECT MONTH('2026-06-07');      -- 6
SELECT DAY('2026-06-07');        -- 7
SELECT HOUR('14:30:00');         -- 14
SELECT DATE('2026-06-07 14:30:00');  -- 2026-06-07
SELECT TIME('2026-06-07 14:30:00');  -- 14:30:00

-- 格式化
SELECT DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s');
SELECT DATE_FORMAT(NOW(), '%Y年%m月%d日');

-- 加减
SELECT DATE_ADD(NOW(), INTERVAL 7 DAY);       -- 7 天后
SELECT DATE_ADD(NOW(), INTERVAL -1 MONTH);    -- 1 月前
SELECT DATE_SUB(NOW(), INTERVAL 1 YEAR);      -- 1 年前

-- 差值
SELECT DATEDIFF('2026-06-07', '2026-01-01');  -- 157 天
SELECT TIMESTAMPDIFF(HOUR, '2026-06-07 10:00', '2026-06-07 18:00');  -- 8 小时

-- 时间戳
SELECT UNIX_TIMESTAMP();         -- 当前时间戳（秒）
SELECT FROM_UNIXTIME(1717740000); -- 转回时间
```

### 7.4 聚合函数

```sql
SELECT COUNT(*) FROM users;                 -- 行数
SELECT COUNT(email) FROM users;             -- 非 NULL 计数
SELECT COUNT(DISTINCT city) FROM users;     -- 去重计数
SELECT SUM(amount) FROM orders;             -- 求和
SELECT AVG(amount) FROM orders;             -- 平均
SELECT MAX(amount) FROM orders;             -- 最大
SELECT MIN(amount) FROM orders;             -- 最小
```

### 7.5 条件函数

```sql
-- IF
SELECT name, IF(age >= 18, '成年', '未成年') AS status FROM users;

-- CASE WHEN
SELECT name,
    CASE 
        WHEN age < 18 THEN '未成年'
        WHEN age < 60 THEN '成年'
        ELSE '老年'
    END AS group_name
FROM users;

-- CASE 简洁式
SELECT name,
    CASE status
        WHEN 1 THEN '正常'
        WHEN 2 THEN '锁定'
        WHEN 3 THEN '注销'
        ELSE '未知'
    END AS status_text
FROM users;

-- IFNULL
SELECT name, IFNULL(email, '未填写') FROM users;

-- COALESCE（多个候选取第一个非 NULL）
SELECT COALESCE(email, phone, '无联系方式') FROM users;
```

### 7.6 类型转换

```sql
SELECT CAST('123' AS UNSIGNED);          -- 字符串转数字
SELECT CAST(123 AS CHAR);                -- 数字转字符串
SELECT CAST('2026-06-07' AS DATE);
SELECT CONVERT('123', SIGNED);
```

---

## 八、索引与性能

### 8.1 索引是什么

类似书的目录，加速查询。

```sql
-- 没索引：从 100 万行逐行扫
-- 有索引：通过 B+ 树 3-4 次磁盘 IO 定位
```

### 8.2 索引类型

| 类型 | 说明 |
|------|------|
| **主键索引** | 主键自动建索引，唯一 |
| **唯一索引** | UNIQUE，列值不重复 |
| **普通索引** | 加速查询 |
| **联合索引** | 多列组合索引 |
| **全文索引** | 文本搜索 |

```sql
-- 查看表索引
SHOW INDEX FROM users;

-- 创建索引
CREATE INDEX idx_email ON users(email);
CREATE UNIQUE INDEX uk_phone ON users(phone);
CREATE INDEX idx_city_age ON users(city, age);  -- 联合索引

-- 删除索引
DROP INDEX idx_email ON users;
```

### 8.3 EXPLAIN 分析查询

测试人员排查慢 SQL 的核心工具：

```sql
EXPLAIN SELECT * FROM users WHERE email = 'test@test.com';
```

**关键字段：**

| 字段 | 含义 |
|------|------|
| `type` | 访问类型，从优到劣：`system > const > eq_ref > ref > range > index > ALL` |
| `key` | 实际使用的索引 |
| `rows` | 预估扫描行数（越少越好） |
| `Extra` | 附加信息 |

**type 解读：**

- `ALL`：全表扫描（**性能差，需优化**）
- `index`：索引全扫描
- `range`：范围扫描（BETWEEN、IN、>）
- `ref`：非唯一索引等值查找
- `eq_ref`：唯一索引等值查找
- `const`：主键或唯一索引等值
- `system`：表只有 1 行

**Extra 关注：**

- `Using filesort`：额外排序（性能差）
- `Using temporary`：临时表（性能差）
- `Using index`：覆盖索引（很好）
- `Using where`：WHERE 过滤

### 8.4 慢 SQL 优化思路

1. **EXPLAIN 看是否走索引**
2. **WHERE 字段加索引**
3. **避免 SELECT \***，只查需要的列
4. **避免 OR**，用 IN 或 UNION 替代
5. **避免函数操作索引列**：`WHERE DATE(create_time) = '2026-06-07'` 不走索引
6. **避免 LIKE '%xxx'**，前缀模糊不走索引
7. **避免隐式类型转换**：`WHERE phone = 13800138000`（phone 是字符串）
8. **JOIN 字段加索引**
9. **大表分页用游标**，避免 `LIMIT 1000000, 10`

### 8.5 测试常见性能问题

| 问题 | 排查 |
|------|------|
| 接口慢 | EXPLAIN 接口背后的 SQL |
| 列表分页越翻越慢 | 大 OFFSET 问题 |
| 查询正常但偶尔超时 | 数据库锁、连接池 |
| 删除大量数据卡死 | 分批 DELETE |

---

## 九、事务

### 9.1 事务 ACID

- **A** Atomicity 原子性：要么全成功，要么全失败
- **C** Consistency 一致性：数据状态保持有效
- **I** Isolation 隔离性：事务间互不干扰
- **D** Durability 持久性：提交后永久保存

### 9.2 事务操作

```sql
-- 开启事务
BEGIN;
-- 或 START TRANSACTION;

-- 执行操作
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- 提交（确认生效）
COMMIT;

-- 或回滚（撤销）
ROLLBACK;
```

**测试人员高频用法：** 操作生产数据前开事务，错了能回滚。

```sql
BEGIN;
UPDATE users SET status = 'LOCKED' WHERE id IN (1,2,3);
SELECT id, status FROM users WHERE id IN (1,2,3);
-- 检查无误
COMMIT;
-- 错了执行 ROLLBACK
```

### 9.3 事务隔离级别

| 级别 | 脏读 | 不可重复读 | 幻读 |
|------|------|----------|------|
| READ UNCOMMITTED | ✓ | ✓ | ✓ |
| READ COMMITTED | ✗ | ✓ | ✓ |
| **REPEATABLE READ** （MySQL 默认）| ✗ | ✗ | ✓ |
| SERIALIZABLE | ✗ | ✗ | ✗ |

```sql
-- 查看当前隔离级别
-- MySQL 8.0+
SELECT @@transaction_isolation;
-- MySQL 5.7 及以下
SELECT @@tx_isolation;

-- 设置（一般不动）
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

> **注意：** MySQL 8.0 移除了 `@@tx_isolation`，必须用 `@@transaction_isolation`。

---

## 十、测试场景实战

### 10.1 场景一：接口返回与数据库校验

**接口：** `POST /api/order/create`，返回订单 ID。

**测试：** 接口创建订单后，数据库应有对应记录。

```sql
-- 1. 验证订单创建
SELECT * FROM orders WHERE id = 100001;

-- 2. 验证字段正确
SELECT id, user_id, amount, status, created_at
FROM orders 
WHERE id = 100001;

-- 3. 验证关联表（订单明细）
SELECT * FROM order_items WHERE order_id = 100001;

-- 4. 验证库存扣减
SELECT id, stock FROM products WHERE id = 1001;

-- 5. 验证用户积分变化
SELECT id, points FROM users WHERE id = 12345;
```

### 10.2 场景二：造测试数据

```sql
-- 造 100 个测试用户
INSERT INTO users (name, email, age, city)
SELECT 
    CONCAT('test_user_', n),
    CONCAT('test_', n, '@test.com'),
    20 + (n % 40),
    CASE (n % 3) WHEN 0 THEN '北京' WHEN 1 THEN '上海' ELSE '广州' END
FROM (
    SELECT a.N + b.N * 10 + 1 AS n
    FROM (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
          UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
         (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
          UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b
) numbers
WHERE n <= 100;

-- 造异常数据：金额为 0 的订单
INSERT INTO orders (user_id, amount, status) VALUES (1, 0, 'PAID');

-- 造极限数据：超长字符串
INSERT INTO users (name) VALUES (REPEAT('a', 255));

-- 造时间数据：1 年前的订单
INSERT INTO orders (user_id, amount, created_at) 
VALUES (1, 100, DATE_SUB(NOW(), INTERVAL 1 YEAR));
```

### 10.3 场景三：数据清理

```sql
-- 清理测试用户产生的所有数据
BEGIN;

-- 清理订单
DELETE FROM order_items 
WHERE order_id IN (SELECT id FROM orders WHERE user_id IN 
    (SELECT id FROM users WHERE name LIKE 'test_%'));

DELETE FROM orders 
WHERE user_id IN (SELECT id FROM users WHERE name LIKE 'test_%');

-- 清理用户
DELETE FROM users WHERE name LIKE 'test_%';

-- 检查
SELECT COUNT(*) FROM users WHERE name LIKE 'test_%';
SELECT COUNT(*) FROM orders WHERE user_id IN 
    (SELECT id FROM users WHERE name LIKE 'test_%');

COMMIT;
```

### 10.4 场景四：定位 Bug

**Bug：** 用户反馈下单成功但订单页查不到。

```sql
-- 1. 通过用户手机号找用户
SELECT * FROM users WHERE phone = '13800138000';
-- 拿到 user_id = 12345

-- 2. 查该用户所有订单
SELECT * FROM orders WHERE user_id = 12345 ORDER BY created_at DESC LIMIT 10;
-- 发现有订单，状态是 DELETED

-- 3. 看状态变更日志
SELECT * FROM order_logs WHERE order_id = 100001 ORDER BY created_at;
-- 发现订单创建后立即被风控系统标记删除

-- 4. 看风控规则
SELECT * FROM risk_logs WHERE order_id = 100001;
-- 找到误判原因 → 提交 Bug
```

### 10.5 场景五：业务统计

```sql
-- 今日订单数
SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURDATE();

-- 今日新增用户
SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURDATE();

-- 各状态订单数
SELECT status, COUNT(*) FROM orders GROUP BY status;

-- 今日 GMV（成交总额）
SELECT SUM(amount) FROM orders 
WHERE status = 'PAID' AND DATE(created_at) = CURDATE();

-- TOP 10 用户消费排行
SELECT u.name, SUM(o.amount) AS total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status = 'PAID'
GROUP BY u.id
ORDER BY total DESC
LIMIT 10;

-- 每天订单趋势（近 7 天）
SELECT DATE(created_at) AS date, COUNT(*) AS cnt
FROM orders
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY DATE(created_at)
ORDER BY date;
```

### 10.6 场景六：数据一致性校验

```sql
-- 检查孤儿订单（user 表无对应记录）
SELECT o.id, o.user_id
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
WHERE u.id IS NULL;

-- 检查金额异常（订单金额 ≠ 明细之和）
SELECT o.id, o.amount, SUM(oi.price * oi.quantity) AS calc_amount
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.amount
HAVING o.amount <> SUM(oi.price * oi.quantity);

-- 检查状态异常（已支付但无支付记录）
SELECT o.id 
FROM orders o
LEFT JOIN payments p ON o.id = p.order_id
WHERE o.status = 'PAID' AND p.id IS NULL;
```

---

## 十一、常见问题排查

### 11.1 连接问题

**问题：** `Access denied for user`

排查：
- 用户名、密码是否正确
- 用户是否有该 IP 的访问权限
- 是否有该数据库的权限

```sql
-- 查看用户权限（需要管理员）
SHOW GRANTS FOR 'testuser'@'%';
```

### 11.2 中文乱码

```sql
-- 看库/表/字段字符集
SHOW VARIABLES LIKE 'character%';
SHOW CREATE DATABASE testdb;
SHOW CREATE TABLE users;

-- 临时设置连接字符集
SET NAMES utf8mb4;
```

> **建议：** MySQL 字符集统一用 `utf8mb4`（支持表情符）。

### 11.3 锁等待 / 死锁

```sql
-- 查看当前事务
SELECT * FROM information_schema.INNODB_TRX;

-- 查看锁
SELECT * FROM performance_schema.data_locks;

-- 杀掉卡住的连接
KILL <连接 ID>;
```

### 11.4 慢 SQL

```sql
-- 查看慢查询配置
SHOW VARIABLES LIKE 'slow_query%';
SHOW VARIABLES LIKE 'long_query_time';

-- 慢日志开启后看 /var/log/mysql/slow.log
```

### 11.5 误删数据怎么办

1. **第一时间停止操作**，禁止再写入
2. 找 DBA 用 binlog 恢复
3. 如果有事务还没 COMMIT，立即 ROLLBACK
4. 提前做好备份是关键

### 11.6 SQL 注入防御原理

```sql
-- ⚠️ 不安全：字符串拼接
sql = "SELECT * FROM users WHERE name = '" + name + "'"
-- name = "' OR '1'='1" 时变成：
-- SELECT * FROM users WHERE name = '' OR '1'='1'

-- ✅ 安全：参数化查询
sql = "SELECT * FROM users WHERE name = ?"
cursor.execute(sql, (name,))
```

测试时验证开发是否用了参数化查询。

---

## 十二、最佳实践

### 12.1 测试人员 SQL 安全准则

1. **永远不在生产环境直接改数据**
2. **UPDATE / DELETE 前必须 SELECT 验证**
3. **大表操作开事务**，错了能回滚
4. **使用只读账号** 查询生产数据
5. **批量操作分批进行**（如 LIMIT 1000）
6. **避免 SELECT \*** 大表全查
7. **避免在高峰期** 执行复杂查询

### 12.2 推荐学习资源

**书籍：**
- 《MySQL 必知必会》（入门首选）
- 《高性能 MySQL》（进阶）
- 《SQL 必知必会》（通用 SQL）

**网站：**
- SQL Zoo：`https://sqlzoo.net/`（交互式练习）
- LeetCode 数据库题
- MySQL 官方文档

---

## 附录：常用命令速查

```sql
-- 库表操作
SHOW DATABASES;
USE dbname;
SHOW TABLES;
DESC tablename;

-- 基础查询
SELECT col1, col2 FROM table WHERE condition ORDER BY col LIMIT n;

-- 联表
SELECT a.x, b.y FROM a LEFT JOIN b ON a.id = b.aid WHERE ...;

-- 分组
SELECT col, COUNT(*) FROM table GROUP BY col HAVING COUNT(*) > 10;

-- 增改删
INSERT INTO t (c1, c2) VALUES (v1, v2);
UPDATE t SET c1 = v1 WHERE id = 1;
DELETE FROM t WHERE id = 1;

-- 事务
BEGIN; ... COMMIT; / ROLLBACK;

-- 分析
EXPLAIN SELECT ...;
```

---

> **测试纪律：** 严禁未授权操作生产数据库。所有 UPDATE/DELETE 操作必须：1) 提前 SELECT 验证；2) 使用 WHERE 限定范围；3) 大批量操作开事务；4) 重要操作截图保留证据。
