---
description: Python 基础教程，语法、数据类型、函数、文件操作和异常处理。
---
# Python 基础教程（软件测试人员专用）

!!! abstract "教程简介"
    本教程面向软件测试工程师，聚焦自动化测试所需的 Python 基础知识，不深入底层原理，够用即可。

<div class="tutorial-meta">
    <span class="difficulty-badge difficulty-beginner">📗 入门难度</span>
    <span class="meta-item">⏱ 约 3 天</span>
    <span class="meta-item">🎯 目标：掌握 Python 基础语法，能编写简单测试脚本</span>
</div>

---

## 新手导读

这篇 Python 教程是为测试工作服务的，不要求你一开始就学成开发。第一遍先掌握变量、列表、字典、判断、循环、函数、文件读写和异常处理即可。

建议学习顺序：

1. 先能读懂别人写的简单 Python 脚本。
2. 再能自己写一个读取测试数据、发送请求或处理文件的小脚本。
3. 最后再学习类、模块、常用库，为接口自动化和 Web 自动化做准备。

遇到装饰器、生成器、元类等高级内容可以先跳过。测试新人更需要先把基础语法用熟。

---
## 一、Python 简介

### 1.1 为什么测试人员要学 Python

| 理由 | 说明 |
|------|------|
| 语法简洁 | 上手快，代码量少 |
| 生态丰富 | requests、pytest、playwright 等测试库 |
| 通用性强 | 接口测试、Web 自动化、数据处理、脚本工具 |
| 社区活跃 | 遇到问题容易找到答案 |
| 就业面广 | 测试岗位最主流的编程语言 |

### 1.2 学到什么程度

```
够用程度（本教程覆盖）：
├── 基础语法
├── 数据类型（列表、字典、字符串）
├── 流程控制（if/for/while）
├── 函数
├── 类（基础）
├── 文件读写
├── 异常处理
├── 常用模块（os/json/re/datetime）

进阶（按需学）：
├── 装饰器、生成器
├── 多线程/多进程
├── 网络编程
├── 数据库操作
```

---

## 二、环境搭建

### 2.1 安装 Python

**Windows：**

1. 官网下载：`https://www.python.org/downloads/`
2. 安装时 **勾选** `Add Python to PATH`
3. 验证：`python --version`

**Mac：**
```bash
brew install python3
```

**Linux（通常自带）：**
```bash
python3 --version
```

### 2.2 pip 包管理

```bash
# 安装包
pip install requests

# 指定版本
pip install requests==2.31.0

# 升级
pip install --upgrade requests

# 卸载
pip uninstall requests

# 查看已安装
pip list

# 导出依赖（把当前所有包及版本写入文件，方便团队共享或环境复现）
pip freeze > requirements.txt

# 从文件安装（一键安装文件中列出的所有包）
pip install -r requirements.txt

# 国内镜像加速
pip install requests -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### 2.3 IDE

| IDE | 特点 |
|-----|------|
| **PyCharm** | 功能最强（Community 版免费） |
| **VSCode** | 轻量，插件丰富 |
| **IDLE** | Python 自带 |

---

## 三、基础语法

### 3.1 注释

```python
# 单行注释

"""
多行注释
用三引号
"""
```

### 3.2 变量

```python
name = "张三"        # 字符串
age = 25             # 整数
height = 175.5       # 浮点数
is_student = True    # 布尔值

# 多变量赋值
a, b, c = 1, 2, 3
x = y = z = 0
```

**命名规范：**

- 变量名：`snake_case`（小写下划线）：`user_name`、`test_data`
- 常量：`UPPER_CASE`：`MAX_RETRY`、`BASE_URL`
- 类名：`PascalCase`：`LoginPage`、`TestLogin`

### 3.3 输入输出

```python
# 输出
print("Hello")
print("名字:", name)
print(f"名字: {name}, 年龄: {age}")   # f-string（推荐）

# 输入（测试中较少用）
user_input = input("请输入：")
```

### 3.4 类型转换

```python
int("123")        # 字符串 → 整数
float("3.14")     # 字符串 → 浮点
str(123)          # 数字 → 字符串
bool(0)           # 0 → False，非0 → True
list("abc")       # ['a', 'b', 'c']
```

### 3.5 字符串操作

```python
s = "Hello, World!"

# 长度
len(s)                # 13

# 索引（从 0 开始）
s[0]                  # 'H'
s[-1]                 # '!'

# 切片
s[0:5]                # 'Hello'
s[7:]                 # 'World!'
s[:5]                 # 'Hello'

# 常用方法
s.lower()             # 'hello, world!'
s.upper()             # 'HELLO, WORLD!'
s.strip()             # 去首尾空格
s.replace("Hello", "Hi")  # 'Hi, World!'
s.split(", ")         # ['Hello', 'World!']（按分隔符拆成列表）
s.find("World")       # 7（找不到返回 -1）
s.startswith("Hello") # True
s.endswith("!")       # True
",".join(["a","b"])   # 'a,b'（用逗号把列表元素拼成字符串，前面的字符串是分隔符）

# 格式化
f"名字: {name}, 年龄: {age}"          # f-string（推荐）
"名字: {}, 年龄: {}".format(name, age) # format 方法
```

---

## 四、数据类型

### 4.1 列表（list）

```python
# 创建
fruits = ["苹果", "香蕉", "橙子"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", True, 3.14]

# 访问
fruits[0]             # '苹果'
fruits[-1]            # '橙子'
fruits[0:2]           # ['苹果', '香蕉']

# 修改
fruits.append("葡萄")      # 末尾添加
fruits.insert(0, "西瓜")    # 指定位置插入
fruits.remove("香蕉")       # 删除指定值
fruits.pop(0)               # 删除指定位置
fruits.sort()               # 排序
fruits.reverse()            # 反转

# 其他
len(fruits)                  # 长度
"苹果" in fruits             # True（判断存在）
fruits.index("苹果")         # 查找位置
fruits.count("苹果")         # 计数
```

### 4.2 字典（dict）

```python
# 创建
user = {
    "name": "张三",
    "age": 25,
    "city": "北京"
}

# 访问
user["name"]                 # '张三'
user.get("name")             # '张三'
user.get("phone", "无")      # '无'（key 不存在返回默认值）

# 修改
user["age"] = 26             # 修改
user["phone"] = "13800138000" # 新增
del user["city"]              # 删除

# 遍历
for key in user:
    print(key, user[key])

for key, value in user.items():
    print(key, value)

# 其他
user.keys()                   # 所有 key
user.values()                 # 所有 value
"name" in user                # True（判断 key 存在）
len(user)                     # 长度
```

### 4.3 元组（tuple）

```python
# 不可变的列表
point = (10, 20)
point[0]              # 10
# point[0] = 5        # 报错，不能修改
```

### 4.4 集合（set）

```python
# 去重、集合运算
tags = {"python", "test", "api"}
tags.add("selenium")
tags.remove("api")
"python" in tags      # True
```

### 4.5 类型选择

| 场景 | 推荐类型 |
|------|---------|
| 有序、可重复 | 列表 `[]` |
| 键值对 | 字典 `{}` |
| 不可变序列 | 元组 `()` |
| 去重、集合运算 | 集合 `{}` |

---

## 五、流程控制

### 5.1 条件判断

```python
age = 25

if age >= 18:
    print("成年")
elif age >= 12:
    print("青少年")
else:
    print("儿童")

# 三元表达式
status = "成年" if age >= 18 else "未成年"
```

### 5.2 for 循环

```python
# 遍历列表
for fruit in ["苹果", "香蕉", "橙子"]:
    print(fruit)

# 遍历字典
for key, value in {"name": "张三", "age": 25}.items():
    print(f"{key}: {value}")

# range
for i in range(5):           # 0,1,2,3,4
    print(i)

for i in range(1, 6):        # 1,2,3,4,5
    print(i)

for i in range(0, 10, 2):    # 0,2,4,6,8
    print(i)

# enumerate（带索引）
for i, item in enumerate(["a", "b", "c"]):
    print(f"{i}: {item}")
```

### 5.3 列表推导式

```python
# 生成 1-10 的平方
squares = [x**2 for x in range(1, 11)]
# [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

# 带条件
even = [x for x in range(10) if x % 2 == 0]
# [0, 2, 4, 6, 8]

# 字典推导式（假设 users = [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]）
user_map = {u["id"]: u["name"] for u in users}
# 结果：{1: "Alice", 2: "Bob"}（把列表转成 id → name 的映射字典）
```

---

## 六、函数

### 6.1 定义与调用

```python
def greet(name):
    """打招呼（这是文档字符串）"""
    return f"你好, {name}!"

result = greet("张三")
```

### 6.2 参数

```python
# 默认参数
def greet(name, greeting="你好"):
    return f"{greeting}, {name}!"

greet("张三")              # "你好, 张三!"
greet("张三", "早上好")     # "早上好, 张三!"

# 可变参数
def add(*numbers):
    return sum(numbers)

add(1, 2, 3)               # 6

# 关键字参数
def make_request(**kwargs):
    print(kwargs)

make_request(url="http://api.com", method="GET")
# {'url': 'http://api.com', 'method': 'GET'}
```

### 6.3 Lambda（匿名函数）

```python
square = lambda x: x ** 2
square(5)                  # 25

# 常用于排序
users = [{"name": "张三", "age": 25}, {"name": "李四", "age": 20}]
users.sort(key=lambda u: u["age"])
```

---

## 七、类与面向对象

### 7.1 定义类

```python
class User:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def greet(self):
        return f"我是 {self.name}，{self.age} 岁"

# 使用
user = User("张三", 25)
print(user.greet())
print(user.name)
```

### 7.2 继承

```python
class Admin(User):
    def __init__(self, name, age, role):
        super().__init__(name, age)
        self.role = role
    
    def show_role(self):
        return f"{self.name} 的角色是 {self.role}"

admin = Admin("管理员", 30, "superadmin")
print(admin.greet())       # 继承的方法
print(admin.show_role())   # 自己的方法
```

### 7.3 Page Object 中的类（测试常用）

> 下面是 Playwright 自动化框架中的写法（详见 Playwright 教程）。这里重点理解类的用法：把页面操作封装成方法，测试代码更简洁。

```python
class LoginPage:
    def __init__(self, page):       # page 是浏览器页面对象
        self.page = page

    def login(self, username, password):
        self.page.fill("#username", username)   # fill = 填写输入框
        self.page.fill("#password", password)
        self.page.click("#login-btn")           # click = 点击按钮
        return self

    def get_error(self):
        return self.page.text_content(".error-msg")  # 获取错误提示文字
```

---

## 八、模块与包

### 8.1 导入模块

```python
import os
import json
from datetime import datetime
from pathlib import Path as P

# 导入自己的模块（自动化框架中会自己写的工具文件，后面项目实战会用到）
from common.yaml_util import read_yaml
```

### 8.2 常用内置模块

```python
import os           # 文件/目录操作
import sys          # 系统相关
import json         # JSON 处理
import re           # 正则表达式
import time         # 时间
import datetime     # 日期时间
import hashlib      # 哈希加密
import pathlib      # 路径操作（推荐）
import logging      # 日志
```

---

## 九、文件操作

### 9.1 读写文本文件

```python
# 读取全部内容
with open("file.txt", "r", encoding="utf-8") as f:
    content = f.read()          # 一个字符串

# 按行读取（注意：read() 和 readlines() 不要写在同一个 with 块中，read() 会移动文件指针）
with open("file.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()       # 每行一个元素的列表

# 写入
with open("file.txt", "w", encoding="utf-8") as f:
    f.write("Hello\n")

# 追加
with open("file.txt", "a", encoding="utf-8") as f:
    f.write("World\n")
```

### 9.2 读写 JSON

```python
import json

# 读取
with open("data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# 写入
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# 字符串转换
json_str = json.dumps(data, ensure_ascii=False)
data = json.loads(json_str)
```

### 9.3 读写 YAML

```python
import yaml

# 读取
with open("config.yaml", "r", encoding="utf-8") as f:
    config = yaml.safe_load(f)

# 写入
with open("config.yaml", "w", encoding="utf-8") as f:
    yaml.dump(config, f, allow_unicode=True)
```

### 9.4 路径操作（pathlib，推荐）

```python
from pathlib import Path

p = Path("data/test.yaml")
p.exists()              # 是否存在
p.is_file()             # 是否是文件
p.is_dir()              # 是否是目录
p.name                  # 文件名
p.suffix                # 扩展名
p.parent                # 父目录
p.read_text(encoding="utf-8")   # 读取
p.write_text("hello", encoding="utf-8")  # 写入
Path("logs").mkdir(parents=True, exist_ok=True)  # 创建目录
```

---

## 十、异常处理

### 10.1 try/except

```python
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"错误: {e}")
except Exception as e:
    print(f"未知错误: {e}")
finally:
    print("无论是否出错都执行")
```

### 10.2 测试中常见异常

```python
# 网络请求超时
try:
    response = requests.get(url, timeout=5)
except requests.Timeout:
    print("请求超时")

# JSON 解析失败
try:
    data = response.json()
except json.JSONDecodeError:
    print("JSON 解析失败")

# 文件不存在
try:
    with open("config.yaml") as f:
        config = yaml.safe_load(f)
except FileNotFoundError:
    print("配置文件不存在")

# 元素找不到（Playwright/Selenium）
try:
    page.locator("#btn").click()
except Exception as e:
    print(f"元素操作失败: {e}")
```

---

## 十一、常用标准库

### 11.1 os（文件/目录）

```python
import os

os.getcwd()                      # 当前目录
os.listdir(".")                  # 列出文件
os.path.exists("file.txt")      # 是否存在
os.path.isfile("file.txt")      # 是否是文件
os.path.isdir("dir")            # 是否是目录
os.path.join("dir", "file.txt") # 拼接路径
os.makedirs("dir/sub", exist_ok=True)  # 创建目录
os.remove("file.txt")           # 删除文件
os.environ.get("HOME")          # 环境变量
```

### 11.2 json

```python
import json

json.dumps({"a": 1}, ensure_ascii=False)   # dict → str
json.loads('{"a": 1}')                      # str → dict
with open("data.json", encoding="utf-8") as f:
    data = json.load(f)                     # file → dict
```

### 11.3 re（正则表达式）

正则表达式用特殊符号匹配文本模式。字符串前面加 `r` 表示原始字符串（反斜杠不转义）。常用模式：`\d` 匹配数字，`\w` 匹配字母/数字/下划线，`+` 表示一个或多个。

```python
import re

# 查找所有匹配（返回列表）
re.findall(r"\d+", "订单号12345，金额100元")  # ['12345', '100']

# 匹配
re.match(r"\d+", "123abc")                     # 匹配开头
re.search(r"\d+", "abc123def")                 # 搜索

# 替换
re.sub(r"\d+", "*", "电话13800138000")          # '电话*'

# 分割
re.split(r"[,;\s]", "a,b;c d")                 # ['a', 'b', 'c', 'd']

# 常用模式
r"\d+"           # 一个或多个数字
r"\w+"           # 一个或多个字母数字下划线
r"[a-zA-Z]+"     # 一个或多个字母
r"^https?://"    # http 或 https 开头
```

### 11.4 datetime（日期时间）

```python
from datetime import datetime, timedelta

now = datetime.now()
print(now)                              # 2026-06-08 14:30:00.123456
now.strftime("%Y-%m-%d %H:%M:%S")      # '2026-06-08 14:30:00'
now.strftime("%Y%m%d")                  # '20260608'

# 时间计算
tomorrow = now + timedelta(days=1)
last_week = now - timedelta(days=7)

# 字符串转时间
dt = datetime.strptime("2026-06-08", "%Y-%m-%d")

# 时间戳
timestamp = now.timestamp()              # 秒
from_timestamp = datetime.fromtimestamp(1717836000)
```

### 11.5 hashlib（哈希加密）

```python
import hashlib

# MD5（.encode() 把字符串转为字节，.hexdigest() 返回可读的十六进制字符串）
md5 = hashlib.md5("hello".encode()).hexdigest()
# 结果：'5d41402abc4b2a76b9719d911017c592'

# SHA256
sha = hashlib.sha256("hello".encode()).hexdigest()
```

---

## 十二、测试相关库速查

| 库 | 用途 | 安装 |
|----|------|------|
| `requests` | HTTP 请求 | `pip install requests` |
| `pytest` | 测试框架 | `pip install pytest` |
| `playwright` | Web 自动化 | `pip install playwright` |
| `selenium` | Web 自动化 | `pip install selenium` |
| `appium-python-client` | App 自动化 | `pip install Appium-Python-Client` |
| `allure-pytest` | 测试报告 | `pip install allure-pytest` |
| `pyyaml` | YAML 读写 | `pip install pyyaml` |
| `loguru` | 日志 | `pip install loguru` |
| `faker` | 假数据生成 | `pip install faker` |
| `jsonpath-ng` | JSONPath | `pip install jsonpath-ng` |
| `pymysql` | MySQL 操作 | `pip install pymysql` |
| `pymongo` | MongoDB 操作 | `pip install pymongo` |
| `redis` | Redis 操作 | `pip install redis` |
| `pytest-order` | 用例排序 | `pip install pytest-order` |
| `pytest-xdist` | 并行执行 | `pip install pytest-xdist` |
| `pytest-rerunfailures` | 失败重试 | `pip install pytest-rerunfailures` |

---

## 十三、常见问题排查

### 13.1 缩进错误

```
IndentationError: expected an indented block
```

Python 用缩进表示代码块，检查是否混用 Tab 和空格。推荐统一用 **4 个空格**。

### 13.2 编码错误

```
UnicodeEncodeError: 'ascii' codec can't encode
```

文件读写加 `encoding="utf-8"`：

```python
with open("file.txt", encoding="utf-8") as f:
    content = f.read()
```

### 13.3 模块找不到

```
ModuleNotFoundError: No module named 'xxx'
```

```bash
# 安装模块
pip install xxx

# 检查是否在正确的 Python 环境（查看 Python 路径）
which python                    # Linux / Mac（which 查找命令位置）
where python                   # Windows CMD（where 功能相同）

# 确认包是否安装成功
pip list | grep xxx             # Linux / Mac（grep 过滤含关键字的行）
pip list | findstr xxx          # Windows（findstr 是 Windows 版 grep）
```

### 13.4 缩进与代码块

```python
# ❌ 错误：if 后面没缩进
if True:
print("hello")

# ✅ 正确
if True:
    print("hello")
```

### 13.5 字符串编码

```python
# bytes ↔ str
b = "hello".encode("utf-8")   # str → bytes
s = b.decode("utf-8")          # bytes → str
```

---

!!! tip "建议"
    不需要把 Python 全学完才开始写自动化。掌握本教程内容后，直接上手写测试脚本，遇到不会的再查。实践中学习效率最高。

---

## 动手任务：用 Python 把测试结果变成「可决策」的报告

> 这是本教程的收尾练习。请**独立完成**，不要先看参考答案。目标不是"能写 for 循环"，而是**能把原始数据加工成别人能直接做决定的输出**。

### 任务背景

自动化测试跑完后，pytest 会输出一份结果。但**这份结果只有用例名和通过/失败**——测试负责人真正想知道的是：

- 这次能不能发版？
- 失败集中在哪个模块？
- 有没有"不稳定"的用例？

你的任务：写一个 Python 脚本，**读原始结果、算统计、给出结论**。

### 任务数据

把下面内容保存为 `results.txt`（模拟 pytest 输出的用例结果行）：

```text
tests/login/test_login.py::test_login_success PASSED 1.23
tests/login/test_login.py::test_login_wrong_password PASSED 0.89
tests/login/test_login.py::test_login_locked PASSED 1.45
tests/order/test_order.py::test_create_order PASSED 2.10
tests/order/test_order.py::test_order_amount FAILED 1.88
tests/order/test_order.py::test_coupon_stack FAILED 2.31
tests/order/test_order.py::test_stock_check FAILED 1.95
tests/pay/test_pay.py::test_pay_success PASSED 3.42
tests/pay/test_pay.py::test_pay_timeout FAILED 3.66
tests/pay/test_pay.py::test_pay_callback PASSED 2.87
tests/cart/test_cart.py::test_add_cart PASSED 0.55
tests/cart/test_cart.py::test_update_qty PASSED 0.61
tests/cart/test_cart.py::test_delete_item PASSED 0.58
```

### 任务要求

请用 **Python 基础语法**（文件读写、字符串处理、字典、列表、函数、异常处理）完成：

1. **读文件并解析**：把每行解析成「文件路径 / 用例名 / 状态 / 耗时」四个字段。注意：**如果文件不存在，要给出友好提示而不是直接崩溃**。
2. **统计总览**：算出总数、通过数、失败数、通过率、总耗时、平均耗时。
3. **按模块分组统计**：以 `tests/` 下的第一级目录为模块（如 `login`、`order`），统计每个模块的用例数与失败数。
4. **给出结论**：根据规则输出一句话判定 —— **通过率 ≥ 95% 输出"可以发版"；否则输出"不可发版"，并列出失败最多的模块**。
5. **异常数据防御**：某行的耗时字段可能是 `-`（无法解析）。说明你的脚本如何处理，并让脚本不因这一行而中断。

### 提交物

| 产出 | 要求 |
|------|------|
| Python 脚本 | 完整可运行，含注释 |
| 运行结果 | 脚本在给定数据上的输出 |
| 边界验证 | 证明你的脚本能处理"耗时异常"和"文件不存在"两种情况 |
| 结论 | 用 3-5 句话说明：基于这份数据，能不能发版，为什么 |

### 完成标准

- [ ] 脚本能正确解析出 13 条用例的四字段（不是用固定的列号硬切）
- [ ] 统计数字**与手算一致**（通过率、平均耗时）
- [ ] 有**异常处理**，文件不存在或数据格式异常时给出提示而不崩溃
- [ ] 最终输出是**人能直接用的结论**，不只是打印一堆数字

??? tip "参考答案与思路（先自己做完再看）"

    **完整脚本**：

    ```python
    #!/usr/bin/env python3
    """统计测试结果并给出发版建议。"""
    import os
    import sys

    RESULT_FILE = "results.txt"
    PASS_THRESHOLD = 95.0      # 通过率阈值（%）


    def parse_line(line):
        """解析一行：<文件路径>::<用例名> <状态> <耗时>

        返回 dict 或 None（无法解析时）。
        注意：不使用固定列号切分——耗时可能是 '-'，
        所以用「从右往左取 2 个字段，剩余为用例标识」的方式，更稳健。
        """
        parts = line.strip().split()
        if len(parts) < 3:
            return None
        status = parts[-2]
        duration_raw = parts[-1]
        case_id = " ".join(parts[:-2])

        # 耗时可能是 '-'，解析失败记为 0.0 并标记
        try:
            duration = float(duration_raw)
            duration_valid = True
        except ValueError:
            duration = 0.0
            duration_valid = False

        # 拆出文件路径与用例名（用例标识里可能含空格）
        if "::" in case_id:
            path, name = case_id.split("::", 1)
        else:
            path, name = case_id, ""

        return {
            "path": path,
            "name": name,
            "status": status,
            "duration": duration,
            "duration_valid": duration_valid,
        }


    def module_of(path):
        """从 tests/xxx/yyy.py 取出模块名 xxx。"""
        parts = path.split("/")
        return parts[1] if len(parts) > 1 else "(unknown)"


    def load_results(filename):
        """读取并解析结果文件；文件不存在时返回 None。"""
        if not os.path.exists(filename):
            print(f"错误：找不到结果文件 {filename}", file=sys.stderr)
            return None

        records = []
        with open(filename, encoding="utf-8") as f:
            for lineno, line in enumerate(f, 1):
                if not line.strip():
                    continue
                rec = parse_line(line)
                if rec is None:
                    print(f"警告：第 {lineno} 行无法解析，已跳过：{line.strip()}")
                    continue
                records.append(rec)
        return records


    def summarize(records):
        """统计总览。"""
        total = len(records)
        passed = sum(1 for r in records if r["status"] == "PASSED")
        failed = total - passed
        pass_rate = (passed / total * 100) if total else 0.0
        total_duration = sum(r["duration"] for r in records)
        avg_duration = (total_duration / total) if total else 0.0
        return {
            "total": total, "passed": passed, "failed": failed,
            "pass_rate": pass_rate, "total_duration": total_duration,
            "avg_duration": avg_duration,
        }


    def group_by_module(records):
        """按模块统计用例数与失败数。"""
        stats = {}
        for r in records:
            mod = module_of(r["path"])
            if mod not in stats:
                stats[mod] = {"total": 0, "failed": 0}
            stats[mod]["total"] += 1
            if r["status"] != "PASSED":
                stats[mod]["failed"] += 1
        return stats


    def build_verdict(summary, module_stats):
        """给出发版结论。"""
        if summary["pass_rate"] >= PASS_THRESHOLD:
            return f"✅ 可以发版（通过率 {summary['pass_rate']:.1f}% ≥ {PASS_THRESHOLD}%）"

        worst = sorted(module_stats.items(), key=lambda kv: kv[1]["failed"], reverse=True)
        worst_names = [f"{m}({s['failed']} 个失败)" for m, s in worst if s["failed"] > 0]
        return (f"❌ 不可发版（通过率 {summary['pass_rate']:.1f}% < {PASS_THRESHOLD}%）\n"
                f"   失败最多的模块：{'、'.join(worst_names)}")


    def main():
        records = load_results(RESULT_FILE)
        if records is None:
            return 1

        summary = summarize(records)
        module_stats = group_by_module(records)

        print("=" * 46)
        print("测试结果汇总")
        print("=" * 46)
        print(f"总用例数：{summary['total']}")
        print(f"通过：{summary['passed']}    失败：{summary['failed']}")
        print(f"通过率：{summary['pass_rate']:.1f}%")
        print(f"总耗时：{summary['total_duration']:.2f}s    平均：{summary['avg_duration']:.2f}s")

        print("\n按模块统计：")
        print(f"{'模块':<12}{'用例数':>8}{'失败数':>8}")
        for mod, s in sorted(module_stats.items()):
            print(f"{mod:<12}{s['total']:>8}{s['failed']:>8}")

        print("\n发版结论：")
        print(build_verdict(summary, module_stats))
        return 0


    if __name__ == "__main__":
        sys.exit(main())
    ```

    **运行结果**（在给定数据上的实际输出）：

    ```text
    ==============================================
    测试结果汇总
    ==============================================
    总用例数：13
    通过：9    失败：4
    通过率：69.2%
    总耗时：23.50s    平均：1.81s

    按模块统计：
    模块            用例数   失败数
    cart               3       0
    login              3       0
    order              4       3
    pay                3       1

    发版结论：
    ❌ 不可发版（通过率 69.2% < 95.0%）
       失败最多的模块：order(3 个失败)、pay(1 个失败)
    ```

    **关键数字来历**（可自行核对）：

    | 指标 | 计算 |
    |------|------|
    | 总用例 | 13 行 |
    | 通过 | 9（login 3 + order 1 + pay 2 + cart 3） |
    | 失败 | 4（order 3 + pay 1） |
    | 通过率 | 9 / 13 = 69.2% |
    | 总耗时 | 1.23+0.89+1.45+2.10+1.88+2.31+1.95+3.42+3.66+2.87+0.55+0.61+0.58 = **23.50s** |
    | 平均 | 23.50 / 13 = **1.81s** |

    **第 5 题：异常数据防御**

    脚本里有两处防御，都值得注意：

    1. **耗时解析失败**：用 `try/except ValueError` 包住 `float()`。如果某行耗时是 `-`，不会崩溃，而是记为 `0.0` 并打上 `duration_valid=False` 标记。这样统计数据不会中断，同时保留了"这条数据不可信"的信息。
    2. **文件不存在**：`load_results` 先 `os.path.exists` 判断，不存在时输出友好提示并返回 `None`，`main` 接到 `None` 就返回非零退出码——**在 CI 里这会正确标记为失败**，而不是静默通过。

    **边界验证方法**：

    ```bash
    # 验证耗时异常：把某行的耗时改成 '-'
    # 期望：脚本输出"警告"，其余统计照常完成

    # 验证文件不存在
    mv results.txt results_bak.txt
    python report.py
    # 期望：输出"错误：找不到结果文件 results.txt"，退出码非 0
    echo $?          # Windows: echo %ERRORLEVEL%
    ```

    **结论**：基于这份数据**不能发版**。通过率只有 69.2%，远低于 95% 阈值；失败高度集中在 `order` 模块（3 个失败，占该模块 4 个用例的 75%），且失败项 `test_order_amount`、`test_coupon_stack` 都涉及金额计算——属于**高风险区域**。建议先修 `order` 模块的金额问题并回归，再重新评估。

    > 注意一个设计细节：脚本把"通过率"和"失败最多的模块"**一起**输出。因为**只给通过率无法指导行动**——负责人需要知道"该找谁修什么"。这就是本题想训练的：脚本的产出要能直接支撑决策。

---

### 推荐下一步

根据你的学习进度，选择下一步：

1. **如果你想检验 Python 基础**：做 [Python 基础测验](Python基础测验.md)，检验学习效果
2. **如果你想继续学基础**：学习 [前端基础教程](前端基础教程-软件测试版.md)，掌握 HTML/CSS/JS
3. **如果你想直接进入自动化**：学习 [Python 接口自动化](../自动化测试/Python+Requests+Allure接口自动化教程-软件测试版.md)，用 Python 写测试脚本

### 通关检查

完成本阶段后，使用 [第1阶段-测试入门通关](../学习中心/第1阶段-测试入门通关.md) 检查是否可以进入下一阶段。
