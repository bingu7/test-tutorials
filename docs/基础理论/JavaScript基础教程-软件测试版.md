---
description: JavaScript 基础教程，JS 语法、DOM、异步和 Postman 脚本。
---
# JavaScript 基础教程（软件测试人员专用）

!!! abstract "教程简介"
    本教程面向软件测试工程师，聚焦测试工作中需要的 JavaScript 基础知识：Postman Tests 脚本、Playwright 自动化、浏览器控制台调试、接口数据处理。

<div class="tutorial-meta">
    <span class="difficulty-badge difficulty-beginner">📗 入门难度</span>
    <span class="meta-item">⏱ 约 3 天</span>
    <span class="meta-item">🎯 目标：能读懂和编写测试脚本中的 JavaScript 代码</span>
</div>

---

## 前置要求

| 项目 | 要求 | 获取方式 |
|------|------|----------|
| 编程基础 | 了解变量、条件判断、循环等基本概念 | [Python 基础教程](Python基础教程-软件测试版.md) 或任何编程入门 |

---

## 新手导读

测试人员学 JavaScript 不是为了做前端开发，而是为了：

1. **写 Postman Tests 脚本**（断言、提取 Token、数据驱动）。
2. **写 Playwright 自动化测试**（Python 版 Playwright 用 Python，但 Node.js 版用 JS）。
3. **在浏览器控制台调试**（F12 → Console 直接执行 JS 排查问题）。
4. **理解前端 Bug**（看懂前端代码逻辑，判断问题在哪）。

第一遍先掌握变量、数组、对象、函数、JSON、异步（async/await）即可。DOM 操作和事件处理按需学。

---

## 一、为什么测试人员要学 JavaScript

| 场景 | 用途 |
|------|------|
| Postman Tests | 编写断言脚本、提取 Token、数据校验 |
| Playwright（Node.js 版） | 编写 Web 自动化测试 |
| 浏览器控制台 | F12 Console 中执行 JS 调试页面 |
| 接口数据处理 | 解析 JSON 响应、提取嵌套字段 |
| 前端 Bug 定位 | 看懂前端代码，判断问题在前端还是后端 |
| 安全测试 | 理解 XSS 攻击原理 |

---

## 二、环境搭建

### 2.1 浏览器控制台（最快上手）

任何现代浏览器都自带 JavaScript 运行环境：

1. 按 `F12` 打开开发者工具
2. 切换到 `Console` 标签
3. 直接输入 JavaScript 代码按回车执行

```javascript
console.log("Hello, 测试!")    // 输出：Hello, 测试!
2 + 3                          // 输出：5
```

> 这是最简单的学习方式，不需要安装任何东西。

### 2.2 安装 Node.js（命令行运行）

下载地址：`https://nodejs.org/`（选 LTS 版本）

验证安装：

```bash
node --version       # 查看版本
node -e "console.log('OK')"    # 直接执行一行 JS
```

创建文件 `test.js`，运行：

```bash
node test.js
```

### 2.3 IDE 推荐

- **VSCode**（推荐）：安装后直接用，内置终端
- **浏览器 F12 Console**：学习阶段最方便

---

## 三、基础语法

### 3.1 变量

```javascript
let name = "张三"         // 可变变量（推荐）
const PI = 3.14           // 不可变变量（常量，推荐）
var old = "旧写法"        // 旧语法，避免使用
```

> **规则：** 优先用 `const`，需要修改值时用 `let`，不要用 `var`。

### 3.2 数据类型

```javascript
let str = "hello"             // 字符串
let num = 42                  // 数字（整数和小数都是 number）
let bool = true               // 布尔值
let n = null                  // 空值（主动赋值为空）
let u = undefined             // 未定义（变量声明但未赋值）
let arr = [1, 2, 3]           // 数组
let obj = {name: "张三"}      // 对象
```

查看类型：

```javascript
typeof "hello"     // "string"
typeof 42          // "number"
typeof true        // "boolean"
typeof [1,2]       // "object"（数组也是 object）
typeof null        // "object"（这是 JS 的历史 Bug）
```

### 3.3 模板字符串

用反引号 `` ` `` 包裹，里面可以用 `${}` 插入变量（类似 Python f-string）：

```javascript
let user = "testuser"
let msg = `欢迎 ${user} 登录系统`    // "欢迎 testuser 登录系统"

// 拼接接口 URL
let base_url = "https://api.example.com"
let endpoint = `${base_url}/api/user/1`    // "https://api.example.com/api/user/1"
```

### 3.4 类型转换

```javascript
// 字符串 → 数字
Number("123")        // 123
parseInt("123")      // 123（整数）
parseFloat("3.14")   // 3.14
+"456"               // 456（快捷写法）

// 数字 → 字符串
String(42)           // "42"
(42).toString()      // "42"

// 判断是否为数字
isNaN("abc")         // true（不是数字）
isNaN("123")         // false（是数字）
```

---

## 四、运算符

### 4.1 算术与比较

```javascript
// 算术
10 + 3      // 13
10 - 3      // 7
10 * 3      // 30
10 / 3      // 3.333...
10 % 3      // 1（取余数）

// 比较
5 == "5"     // true（宽松比较，会类型转换）
5 === "5"    // false（严格比较，类型不同直接 false，推荐用 ===）
5 !== "5"    // true
```

> **规则：** 始终用 `===` 和 `!==`（严格比较），避免 `==` 和 `!=` 的隐式转换陷阱。

### 4.2 逻辑运算符

```javascript
true && false    // false（与）
true || false    // true（或）
!true            // false（非）

// 实际用途：判断用户是否登录
let token = "eyJhbGc..."
if (token && token.length > 0) {
    console.log("已登录")
}
```

### 4.3 三元运算符

```javascript
// 条件 ? 真值 : 假值
let status = (code === 0) ? "成功" : "失败"

// 等价于：
let status
if (code === 0) {
    status = "成功"
} else {
    status = "失败"
}
```

### 4.4 可选链 `?.`

安全访问嵌套属性，避免 `Cannot read property of undefined` 报错：

```javascript
let response = { data: { user: { name: "张三" } } }

// 正常访问
response.data.user.name           // "张三"

// 如果中间某层是 null/undefined，会报错
response.data.address.city        // 报错！

// 用 ?. 安全访问（遇到 null/undefined 返回 undefined，不报错）
response.data?.address?.city      // undefined（不报错）
```

> 接口响应的字段可能缺失，用 `?.` 可以避免脚本因字段不存在而崩溃。

---

## 五、流程控制

### 5.1 if / else

```javascript
let code = 0

if (code === 0) {
    console.log("请求成功")
} else if (code === 401) {
    console.log("未登录")
} else if (code === 403) {
    console.log("无权限")
} else {
    console.log("其他错误：" + code)
}
```

### 5.2 switch

```javascript
let method = "POST"

switch (method) {
    case "GET":
        console.log("查询请求")
        break
    case "POST":
        console.log("创建请求")
        break
    case "PUT":
        console.log("更新请求")
        break
    default:
        console.log("其他方法")
}
```

### 5.3 for 循环

```javascript
// 经典 for 循环
for (let i = 0; i < 5; i++) {
    console.log("第 " + i + " 次")
}

// 遍历数组（推荐）
let users = ["Alice", "Bob", "Charlie"]
for (let user of users) {
    console.log(user)
}
```

### 5.4 while

```javascript
let retry = 0
while (retry < 3) {
    console.log("重试第 " + retry + " 次")
    retry++
}
```

### 5.5 break 与 continue

```javascript
// break：跳出整个循环
for (let i = 0; i < 10; i++) {
    if (i === 5) break        // 到 5 就停
    console.log(i)            // 输出 0 1 2 3 4
}

// continue：跳过本次，继续下一次
for (let i = 0; i < 5; i++) {
    if (i === 2) continue     // 跳过 2
    console.log(i)            // 输出 0 1 3 4
}
```

---

## 六、函数

### 6.1 函数声明

```javascript
// 普通函数
function add(a, b) {
    return a + b
}
add(1, 2)      // 3

// 箭头函数（推荐，更简洁）
const add = (a, b) => a + b
add(1, 2)      // 3

// 多行箭头函数
const login = (username, password) => {
    let result = { user: username, pwd: password }
    return result
}
```

### 6.2 参数默认值

```javascript
function greet(name = "测试员") {
    return `你好，${name}！`
}

greet()           // "你好，测试员！"
greet("张三")     // "你好，张三！"
```

### 6.3 回调函数

把函数作为参数传给另一个函数（异步编程的基础）：

```javascript
function doTest(callback) {
    console.log("执行测试...")
    callback("测试完成")
}

doTest((result) => {
    console.log(result)    // "测试完成"
})
```

---

## 七、数组

### 7.1 创建与访问

```javascript
let fruits = ["苹果", "香蕉", "橙子"]

fruits[0]             // "苹果"（索引从 0 开始）
fruits.length          // 3
fruits.includes("香蕉")  // true
```

### 7.2 常用方法

```javascript
let arr = [1, 2, 3, 4, 5]

// 添加 / 删除
arr.push(6)           // 末尾添加，arr = [1,2,3,4,5,6]
arr.pop()             // 末尾删除，arr = [1,2,3,4,5]
arr.unshift(0)        // 开头添加，arr = [0,1,2,3,4,5]
arr.shift()           // 开头删除，arr = [1,2,3,4,5]

// 截取（不改原数组）
arr.slice(1, 3)       // [2, 3]（从索引 1 到 3，不含 3）

// 查找
arr.find(x => x > 3)  // 4（找到第一个满足条件的）
arr.filter(x => x > 3) // [4, 5]（找到所有满足条件的）
arr.indexOf(3)         // 2（返回索引，找不到返回 -1）
```

### 7.3 遍历

```javascript
let users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 }
]

// forEach：遍历每个元素
users.forEach((user, index) => {
    console.log(`${index}: ${user.name}`)
})

// map：返回新数组（每个元素经过变换）
let names = users.map(u => u.name)       // ["Alice", "Bob"]

// filter：返回满足条件的新数组
let older = users.filter(u => u.age > 25) // [{ name: "Bob", age: 30 }]
```

### 7.4 解构赋值

快速从数组/对象中提取值：

```javascript
// 数组解构
let [first, second] = [10, 20]
first     // 10
second    // 20

// 对象解构
let { name, age } = { name: "Alice", age: 25 }
name      // "Alice"
age       // 25
```

---

## 八、对象

### 8.1 创建与访问

```javascript
// 创建对象
let user = {
    name: "张三",
    age: 28,
    role: "tester"
}

// 访问属性
user.name           // "张三"（点号语法，推荐）
user["age"]         // 28（方括号语法，属性名是变量时用）

// 修改 / 添加
user.email = "zhangsan@test.com"    // 添加新属性
user.age = 29                       // 修改已有属性
```

### 8.2 属性简写

变量名和属性名相同时可以简写：

```javascript
let name = "张三"
let age = 28

// 完整写法
let user1 = { name: name, age: age }

// 简写（推荐）
let user2 = { name, age }
```

### 8.3 嵌套对象

接口返回的 JSON 通常是嵌套对象：

```javascript
let response = {
    code: 0,
    msg: "成功",
    data: {
        user: {
            id: 1,
            name: "张三",
            roles: ["admin", "tester"]
        }
    }
}

// 访问嵌套属性
response.data.user.name          // "张三"
response.data.user.roles[0]      // "admin"

// 安全访问（防止中间层为 null）
response.data?.user?.phone       // undefined（不报错）
```

### 8.4 Object 方法

```javascript
let user = { name: "张三", age: 28, role: "tester" }

Object.keys(user)      // ["name", "age", "role"]（所有键名）
Object.values(user)    // ["张三", 28, "tester"]（所有值）
Object.entries(user)   // [["name","张三"], ["age",28], ["role","tester"]]

// 遍历对象
for (let [key, value] of Object.entries(user)) {
    console.log(`${key}: ${value}`)
}
```

---

## 九、字符串与正则

### 9.1 常用方法

```javascript
let str = "Hello, 测试工程师!"

str.includes("测试")       // true
str.startsWith("Hello")    // true
str.endsWith("!")          // true
str.replace("Hello", "Hi") // "Hi, 测试工程师!"
str.split(", ")            // ["Hello", "测试工程师!"]
str.trim()                 // 去掉首尾空格
str.toUpperCase()          // 转大写
str.toLowerCase()          // 转小写
str.length                 // 14
str.slice(7, 9)            // "测试"（截取）
```

### 9.2 正则表达式

```javascript
// test：检测是否匹配
/\d+/.test("订单号12345")     // true（包含数字）

// match：提取匹配内容
"订单号12345".match(/\d+/)    // ["12345"]

// replace：替换匹配内容
"电话13800138000".replace(/\d/g, "*")    // "电话***********"
```

> 正则详细教程参见 [正则表达式教程](../工具操作/正则表达式教程-软件测试版.md)。

---

## 十、JSON

JSON（JavaScript Object Notation）是接口数据的标准格式。

### 10.1 JSON 与对象互转

```javascript
// JSON 字符串 → 对象（解析接口响应时常用）
let jsonStr = '{"code":0, "msg":"成功", "data":{"name":"张三"}}'
let obj = JSON.parse(jsonStr)
obj.code          // 0
obj.data.name     // "张三"

// 对象 → JSON 字符串（构造请求体时常用）
let body = { username: "test", password: "123456" }
JSON.stringify(body)    // '{"username":"test","password":"123456"}'

// 格式化输出（调试用）
JSON.stringify(body, null, 2)    // 带缩进的格式化 JSON
```

### 10.2 测试中的 JSON 操作

```javascript
// Postman 中解析响应
let response = pm.response.json()        // 直接得到对象
let token = response.data.token           // 取 token
let userId = response.data.user.id        // 取嵌套字段

// 断言某个字段存在
pm.expect(response.data).to.have.property("token")
```

---

## 十一、DOM 基础

DOM（Document Object Model）是浏览器把 HTML 转成的 JavaScript 对象树。测试人员用它在控制台操作页面。

### 11.1 选取元素

```javascript
// 按 CSS 选择器选取（推荐）
document.querySelector("#username")           // 选一个
document.querySelectorAll(".item")            // 选所有（返回 NodeList）
document.querySelector("button[type='submit']")  // 复杂选择器
```

### 11.2 读取与修改

```javascript
let el = document.querySelector("#username")

// 读取
el.textContent            // 获取文本内容
el.value                  // 获取输入框的值
el.getAttribute("href")   // 获取属性

// 修改
el.textContent = "新内容"
el.value = "新输入值"
el.style.color = "red"    // 修改样式
```

### 11.3 控制台调试技巧

在 F12 Console 中可以直接操作页面：

```javascript
// 找到所有按钮并打印文本
document.querySelectorAll("button").forEach(btn => console.log(btn.textContent))

// 找到所有链接
document.querySelectorAll("a").forEach(a => console.log(a.href))

// 检查某个元素是否存在
document.querySelector("#login-btn") !== null    // true 表示存在
```

---

## 十二、异步基础

### 12.1 为什么需要异步

接口请求、文件读取等操作需要等待，异步让程序不被阻塞。

### 12.2 Promise

Promise 代表一个"将来会有结果"的操作：

```javascript
// 创建 Promise
let promise = new Promise((resolve, reject) => {
    // 模拟接口请求
    setTimeout(() => {
        resolve({ code: 0, data: { name: "张三" } })
    }, 1000)
})

// 使用 Promise
promise.then(result => {
    console.log(result.data.name)    // "张三"
}).catch(error => {
    console.log("请求失败：" + error)
})
```

### 12.3 async / await（推荐）

`async/await` 让异步代码看起来像同步代码，更易读：

```javascript
// 声明异步函数
async function getUser() {
    try {
        let response = await fetch("https://jsonplaceholder.typicode.com/users/1")
        let data = await response.json()
        console.log(data.name)       // "Leanne Graham"
    } catch (error) {
        console.log("请求失败：" + error)
    }
}

getUser()
```

> `await` 只能在 `async` 函数内部使用。`await` 会暂停当前函数，等 Promise 完成后继续。

### 12.4 fetch API

浏览器内置的 HTTP 请求方法：

```javascript
// GET 请求
async function getUser() {
    let response = await fetch("https://jsonplaceholder.typicode.com/users/1")
    let data = await response.json()
    console.log(data)
}

// POST 请求
async function login() {
    let response = await fetch("https://api.example.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "test", password: "123456" })
    })
    let data = await response.json()
    console.log(data)
}
```

---

## 十三、异常处理

```javascript
try {
    let data = JSON.parse("不是合法的 JSON")
    console.log(data)
} catch (error) {
    console.log("解析失败：" + error.message)
} finally {
    console.log("无论成功失败都会执行")
}
```

**主动抛出错误：**

```javascript
function divide(a, b) {
    if (b === 0) {
        throw new Error("除数不能为零")
    }
    return a / b
}

try {
    divide(10, 0)
} catch (error) {
    console.log(error.message)    // "除数不能为零"
}
```

---

## 十四、测试场景实战

### 14.1 Postman Tests 断言

```javascript
// 解析响应
const res = pm.response.json()

// 断言状态码
pm.test("状态码为 200", () => {
    pm.response.to.have.status(200)
})

// 断言业务码
pm.test("业务码为 0", () => {
    pm.expect(res.code).to.eql(0)
})

// 断言字段存在且非空
pm.test("返回 token", () => {
    pm.expect(res.data.token).to.be.a("string").that.is.not.empty
})

// 提取 token 供后续接口使用
if (res.code === 0) {
    pm.environment.set("token", res.data.token)
}
```

### 14.2 浏览器控制台批量操作

```javascript
// 找到页面上所有接口请求（需要在 Network 面板用）
// 在 Console 中执行：监控所有 fetch 请求
const originalFetch = window.fetch
window.fetch = async (...args) => {
    console.log("请求:", args[0])
    const response = await originalFetch(...args)
    console.log("响应:", response.status)
    return response
}
```

### 14.3 数据处理

```javascript
// 模拟接口返回的用户列表
let users = [
    { id: 1, name: "Alice", role: "admin", active: true },
    { id: 2, name: "Bob", role: "tester", active: false },
    { id: 3, name: "Charlie", role: "tester", active: true }
]

// 筛选活跃的测试人员
let activeTesters = users
    .filter(u => u.role === "tester" && u.active)
    .map(u => u.name)
// 结果：["Charlie"]

// 统计各角色人数
let roleCount = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1
    return acc
}, {})
// 结果：{ admin: 1, tester: 2 }
```

### 14.4 构造测试数据

```javascript
// 生成随机手机号
function randomPhone() {
    let prefix = ["138", "139", "150", "186"][Math.floor(Math.random() * 4)]
    let suffix = String(Math.floor(Math.random() * 100000000)).padStart(8, "0")
    return prefix + suffix
}

randomPhone()    // "13812345678"（每次不同）

// 生成当前时间戳
Date.now()       // 1718000000000（毫秒）

// 格式化日期
new Date().toISOString()    // "2026-06-19T10:30:00.000Z"
```

---

## 十五、常见错误排查

### 15.1 Cannot read property 'xxx' of undefined

```javascript
let data = undefined
data.name    // 报错！

// 解决：用可选链
data?.name   // undefined（不报错）
```

### 15.2 xxx is not a function

```javascript
let str = "hello"
str.push("!")      // 报错！字符串没有 push 方法

// 正确做法
str + "!"          // "hello!"
```

### 15.3 Unexpected token

通常是语法错误：漏了括号、引号不匹配、多了逗号。

```javascript
// ❌ 错误
let obj = { name: "张三", age: 28, }    // 最后的逗号在旧浏览器会报错

// ✅ 正确
let obj = { name: "张三", age: 28 }
```

### 15.4 async/await 报错

```javascript
// ❌ 错误：在非 async 函数中用 await
function test() {
    let data = await fetch(url)    // 报错！
}

// ✅ 正确
async function test() {
    let data = await fetch(url)
}
```

### 15.5 var 的变量提升陷阱

```javascript
// var 会变量提升（声明提前到作用域顶部），容易出 Bug
console.log(x)    // undefined（不会报错，但值不对）
var x = 10

// let 不会提升，直接报错，更容易发现问题
console.log(y)    // 报错！
let y = 10
```

---

## 附录：速查表

### 变量与类型

```javascript
let x = 10              // 可变
const PI = 3.14         // 不可变
typeof x                // "number"
JSON.parse(str)         // JSON 字符串 → 对象
JSON.stringify(obj)     // 对象 → JSON 字符串
```

### 数组

```javascript
arr.push(item)          // 末尾添加
arr.pop()               // 末尾删除
arr.map(fn)             // 映射新数组
arr.filter(fn)          // 过滤
arr.find(fn)            // 查找一个
arr.includes(val)       // 是否包含
arr.slice(start, end)   // 截取
arr.forEach(fn)         // 遍历
```

### 对象

```javascript
obj.key                 // 访问属性
obj?.key                // 安全访问
Object.keys(obj)        // 所有键
Object.values(obj)      // 所有值
{ a, b }                // 简写（变量名 = 属性名）
const { name } = obj    // 解构
```

### 异步

```javascript
async function fn() {
    const data = await fetch(url).then(r => r.json())
}
```

### 字符串

```javascript
str.includes("x")       // 包含
str.replace("a", "b")   // 替换
str.split(",")           // 拆分
`hello ${name}`          // 模板字符串
```

---

!!! tip "学习建议"
    JavaScript 和 Python 很多概念相似（变量、数组、函数、JSON），学过 Python 再学 JS 会很快。重点掌握 `===` 严格比较、`let/const`、箭头函数、`async/await`、`JSON.parse/stringify`，这些在测试脚本中最常用。

---

---

## 动手任务：用 JS 处理一批订单接口数据，判定「能不能验收」

> 这是本教程的收尾练习。请**独立完成**，不要先看参考答案。目标不是"会用 `filter`"，而是**能用数组方法和对象操作，把一堆原始 JSON 变成有明确预期输出的验收结论**。

### 任务背景

订单列表接口刚改完「支付金额计算」逻辑，开发说"改好了，你们回归一下"。你手上只有一份接口响应 JSON，需要在**不写自动化框架**的前提下，用一段 JS 脚本回答三个问题：

- 有没有订单的 `payAmount` 和明细算出来的金额对不上？
- 有没有记录该有的字段缺了？
- 这批数据到底能不能验收？

脚本要**可重复运行、输出固定**，让别人拿去能复算出同样的数字。

### 任务数据

把下面内容保存为 `orders.json`（模拟接口 `GET /api/order/list` 的响应）：

```json
{
    "code": 0,
    "msg": "success",
    "data": {
        "total": 8,
        "list": [
            { "orderId": "SO20260601001", "status": 3, "totalAmount": 128.5,  "payAmount": 128.5,  "items": [ { "sku": "A1", "qty": 2, "price": 35.65 }, { "sku": "A2", "qty": 1, "price": 57.2 } ] },
            { "orderId": "SO20260601002", "status": 3, "totalAmount": 99.0,   "payAmount": 89.0,   "items": [ { "sku": "B1", "qty": 1, "price": 99.0 } ] },
            { "orderId": "SO20260601003", "status": 3, "totalAmount": 258.0,  "payAmount": 258.0,  "items": [] },
            { "orderId": "SO20260601004", "status": 3, "totalAmount": 148.67, "payAmount": 148.67 },
            { "orderId": "SO20260601005", "status": 3, "totalAmount": 24.62,  "payAmount": 24.62,  "items": [ { "sku": "E1", "qty": 1, "price": 9.9 },  { "sku": "E2", "qty": 3, "price": 4.907 } ] },
            { "orderId": "SO20260601006", "status": 3, "totalAmount": 237.15, "payAmount": 237.15, "items": [ { "sku": "F1", "qty": 3, "price": 79.05 } ] },
            { "orderId": "SO20260601007", "status": 3, "totalAmount": 89.51,  "payAmount": 89.51,  "items": [] },
            { "orderId": "SO20260601008", "status": 3, "totalAmount": 258.0,  "payAmount": 258.0,  "items": [ { "sku": "H1", "qty": 1, "price": 258.0 } ] }
        ]
    }
}
```

**业务规则（判定依据）：**

1. 只有 `status === 3`（已支付）的订单才参与金额校验，其他状态跳过。
2. 订单的应付金额应为 `payAmount`；**若支付金额与明细合计不一致，或明细合计与 `totalAmount` 不一致**，都算金额异常。
3. 明细金额 = `sum(item.price * item.qty)`。
4. 每条订单**必须**有 `orderId`、`status`、`totalAmount`、`payAmount`、`items` 五个字段；`items` 必须是数组且**至少 1 条**明细。

### 任务要求

请用 **JavaScript 基础语法**（`let/const`、`==` 与 `===` 的区别、数组 `filter/map/reduce/find`、对象 `Object.keys`/`hasOwnProperty`、模板字符串、`try/catch`）完成：

1. **先做一个陷阱实验**：接口里的数字有时是字符串（如 `"128.5"`）。请分别写出 `0 == "0"`、`"128.5" === 128.5` 的求值结果，并说明**为什么金额比较绝不能用 `==`**。给出一个"用 `==` 会误判为通过"的具体例子。
2. **找出字段缺失的订单**：筛出缺少必填字段、或 `items` 不是数组/为空的订单，输出 `{ orderId, missing: [...] }` 列表。
3. **找出金额不符的订单**：对 `status === 3` 的订单，用 `reduce` 算出明细合计，与 `payAmount` 比对，输出 `{ orderId, totalAmount, payAmount, expectedPay, diff }`。
4. **给出验收结论**：算出"金额校验通过率"，并按规则输出 `可以验收` / `不可验收`。注意 `filter`、`map` **不会修改原数组**，请顺便验证这一点。
5. **可复用产出**：把校验逻辑封装成 `validateOrders(json)` 函数，输入整份接口响应，返回一份结构化的校验报告（含各类问题清单与计数）。

### 提交物

| 产出 | 要求 |
|------|------|
| 校验脚本 | 单个 `.js` 文件，`node 文件名.js` 可直接运行 |
| 运行输出 | 粘贴真实输出，含字段缺失清单、金额不符清单、通过率、结论 |
| 陷阱实验 | 第 1 题的 `==` 误判例子（要有具体数值） |
| 结论说明 | 用 3-5 句话说明：这批数据能不能验收、必须先修哪几条、依据是什么 |

### 完成标准

- [ ] 字段比较一律用 `===`，能用具体例子说明 `==` 造成的误判
- [ ] 金额计算用**分**（整数）而非直接比较浮点数，且能说明为什么（浮点精度）
- [ ] 输出数字**自洽可复算**：明细合计、差额、通过率与手算一致
- [ ] 结论明确写出**哪些订单号**异常，而不是只给一句"有问题"
- [ ] 用 `filter/map/reduce` 链式表达，没有用 `for` 循环硬堆

??? tip "参考答案与思路（先自己做完再看）"

    **第 1 题：为什么金额比较必须用 `===`（附误判实例）**

    ```javascript
    0 == "0"                  // true   ← 宽松比较，字符串被转成数字
    0 === "0"                 // false  ← 严格比较，类型不同直接 false
    "128.5" === 128.5         // false
    "128.5" ==  128.5         // true   ← 看起来"相等"，其实是隐式转换的假象
    ```

    **会误判成"通过"的具体例子**：假设接口把 `payAmount` 返回成了字符串 `"99.0"`，而明细算出来是数字 `99.0`。

    ```javascript
    const payAmount = "99.0";     // 后端序列化 bug：金额变成了字符串
    const expected  = 99.0;
    payAmount ==  expected        // true  ← 用 == 时：判定"通过"，Bug 被放过
    payAmount === expected        // false ← 用 === 时：判定"不通过"，Bug 被抓到
    ```

    也就是说，**`==` 会替你"原谅"一个类型错误**。金额字段类型错误（数字变字符串）本身就是需要提单的缺陷，用 `==` 就把它顺手埋了。所以本任务统一用 `===`。

    > 补充：`===` 也救不了 `NaN`——`NaN === NaN` 是 `false`。若字段缺失导致算不出金额，要用 `Number.isNaN(x)` 判断，再单独归入"数据不完整"一类。

    **第 2 题：字段缺失订单**

    ```javascript
    const REQUIRED = ["orderId", "status", "totalAmount", "payAmount", "items"];

    const hasField = (obj, key) =>
        obj != null && Object.prototype.hasOwnProperty.call(obj, key);

    const missingFieldOrders = orders
        .filter(o => REQUIRED.some(k => !hasField(o, k)) ||
                     !Array.isArray(o.items) || o.items.length === 0)
        .map(o => ({
            orderId: o.orderId,
            missing: REQUIRED.filter(k => !hasField(o, k)),
            emptyItems: Array.isArray(o.items) && o.items.length === 0,
        }));
    ```

    实际输出（共 3 条）：

    ```json
    [
      { "orderId": "SO20260601003", "missing": [],        "emptyItems": true },
      { "orderId": "SO20260601004", "missing": ["items"], "emptyItems": false },
      { "orderId": "SO20260601007", "missing": [],        "emptyItems": true }
    ]
    ```

    > 为什么不用 `if (!o.items)`？因为 `items: []` 是**真值**（空数组为 truthy），用真值判断会漏掉"空明细"这一整类问题——`SO20260601003` 和 `SO20260601007` 就会从报告里消失。这就是要用 `Array.isArray` + `length === 0` 双判断的原因。

    **第 3 题：金额不符订单（用「分」消除浮点误差）**

    浮点陷阱是本题的**第二个关键点**：

    ```javascript
    0.1 + 0.2            // 0.30000000000000004
    0.1 + 0.2 === 0.3    // false  ← 直接比浮点数会误判
    ```

    所以**先把金额换算成分（整数）再算**：

    ```javascript
    const toFen = v => Math.round(Number(v) * 100);   // 元 → 分，四舍五入到整数

    const sumItems = items => {
        if (!Array.isArray(items)) return null;
        const fen = items.map(it => {
            if (it == null || typeof it.price !== "number") return NaN;
            return toFen(it.price) * Number(it.qty);
        });
        if (fen.some(Number.isNaN)) return NaN;
        return fen.reduce((a, b) => a + b, 0);
    };
    ```

    校验主体：

    ```javascript
    const amountMismatch = orders
        .filter(o => o.status === 3)                      // 只校验已支付
        .map(o => {
            const calcFen  = sumItems(o.items);
            const payFen   = toFen(o.payAmount);
            const totalFen = toFen(o.totalAmount);
            return { o, calcFen, payFen, totalFen };
        })
        .filter(r => r.calcFen !== null && !Number.isNaN(r.calcFen))
        .filter(r => r.calcFen !== r.payFen || r.calcFen !== r.totalFen)
        .map(r => ({
            orderId: r.o.orderId,
            totalAmount: r.o.totalAmount,
            payAmount: r.o.payAmount,
            expectedPay: r.calcFen / 100,
            diff: (r.payFen - r.calcFen) / 100,
        }));
    ```

    实际输出（共 2 条）：

    ```json
    [
      {
        "orderId": "SO20260601002",
        "totalAmount": 99,
        "payAmount": 89,
        "expectedPay": 99,
        "diff": -10
      },
      {
        "orderId": "SO20260601005",
        "totalAmount": 24.62,
        "payAmount": 24.62,
        "expectedPay": 24.63,
        "diff": -0.01
      }
    ]
    ```

    验算 `SO20260601002`：明细 `[{sku:"B1", qty:1, price:99.0}]` → `99.0 × 1 = 99.00`，而 `payAmount = 89.00`，**差额 -10.00 元**，与 `totalAmount: 99.0` 一致 → **明细对、支付金额少收了 10 元**，是真缺陷。

    再验算几条"应该通过"的，确认脚本没有误报：

    | 订单号 | 明细（price×qty） | 按行取整合计（元） | payAmount | 结论 |
    |--------|-------------------|-------------------|-----------|------|
    | SO20260601001 | 35.65×2=71.30，57.20×1=57.20 | 128.50 | 128.5 | ✅ 一致 |
    | SO20260601005 | 9.90×1=9.90，4.907×3=14.721 | 24.63 | 24.62 | ❌ 差 0.01 |
    | SO20260601006 | 79.05×3=237.15 | 237.15 | 237.15 | ✅ 一致 |
    | SO20260601008 | 258.00×1=258.00 | 258.00 | 258.0 | ✅ 一致 |

    > 注意 `SO20260601005` 是本任务**最值得讨论的那条边界**：它的两条明细换算成分分别是 `toFen(9.9) = 990 分`、`toFen(4.907) = 491 分`（`4.907 × 100 = 490.7`，四舍五入得 `491`），按行算 `990 + 491 × 3 = 2463 分 = 24.63 元`；但如果**先精确求和再取整**，`9.9 + 4.907 × 3 = 24.621`，`Math.round(24.621 × 100) = 2462 分 = 24.62 元`——和 `payAmount` 完全一致。
    >
    > 也就是说：**"按行取整"和"按单取整"会得出不同结论**。脚本输出哪个结论，取决于你选了哪种口径。真实项目里必须先和开发确认口径再写断言，否则测试和开发会互相"说服不了对方"。本题按"按行取整"实现，因此 `SO20260601005` 被判为不符；你可以再写一版"按单取整"做对照。

    保险起见，把两种口径都算出来：

    ```javascript
    const perItem  = toFen(4.907) * 3 + toFen(9.9) * 1;           // 491*3 + 990 = 2463 分 = 24.63
    const perOrder = Math.round((4.907 * 3 + 9.9 * 1) * 100);     // Math.round(24.621*100) = 2462 分 = 24.62
    perItem === perOrder;   // false ← 24.63 vs 24.62，口径差异实锤
    ```

    **第 4 题：验收结论**

    ```javascript
    const paid = orders.filter(o => o.status === 3).length;          // 8
    const passRate = (1 - amountMismatch.length / paid) * 100;       // (1 - 2/8)*100 = 75
    console.log(`已支付订单 ${paid} 条，金额不符 ${amountMismatch.length} 条，通过率 ${passRate.toFixed(1)}%`);
    // 已支付订单 8 条，金额不符 2 条，通过率 75.0%
    ```

    若阈值定为 **95%**：`75% < 95%` → **不可验收**。

    同时验证 `filter/map` 不修改原数组（这是它们与 `push/splice` 的本质区别）：

    ```javascript
    const before = orders.length;                       // 8
    orders.filter(o => o.status === 999);               // []（新数组，原数组未动）
    console.log(before === orders.length);              // true ← 原数组长度没变
    ```

    **结论**：这批数据**不可验收**（通过率 75.0% < 95%）。必须先修 `SO20260601002`（支付金额比明细少 10 元，属资损风险，最高优先级）；`SO20260601005` 暴露了金额**取整口径未定义**的问题，需开发先给出规则（按行取整还是按单取整）再定它是不是缺陷；另外还要确认 `SO20260601003`、`SO20260601007` 的"空明细"和 `SO20260601004` 的"明细字段缺失"是数据问题还是接口设计如此。

    **第 5 题：封装成 `validateOrders(json)`**

    ```javascript
    const toFen = v => Math.round(Number(v) * 100);

    function validateOrders(json) {
        const orders = json?.data?.list;
        if (!Array.isArray(orders)) {
            return { ok: false, error: "响应结构异常：data.list 不是数组" };
        }

        const REQUIRED = ["orderId", "status", "totalAmount", "payAmount", "items"];
        const hasField = (o, k) => o != null && Object.prototype.hasOwnProperty.call(o, k);

        const missingFields = orders
            .filter(o => REQUIRED.some(k => !hasField(o, k)) ||
                         !Array.isArray(o.items) || o.items.length === 0)
            .map(o => ({
                orderId: o.orderId,
                missing: REQUIRED.filter(k => !hasField(o, k)),
                emptyItems: Array.isArray(o.items) && o.items.length === 0,
            }));

        const amountMismatch = orders
            .filter(o => o.status === 3 && Array.isArray(o.items) && o.items.length > 0)
            .map(o => {
                const calcFen = o.items.reduce((sum, it) => sum + toFen(it.price) * Number(it.qty), 0);
                return { o, calcFen };
            })
            .filter(({ o, calcFen }) => calcFen !== toFen(o.payAmount) || calcFen !== toFen(o.totalAmount))
            .map(({ o, calcFen }) => ({
                orderId: o.orderId,
                totalAmount: o.totalAmount,
                payAmount: o.payAmount,
                expectedPay: calcFen / 100,
                diff: (toFen(o.payAmount) - calcFen) / 100,
            }));

        const paid = orders.filter(o => o.status === 3).length;
        const passRate = paid === 0 ? 100 : (1 - amountMismatch.length / paid) * 100;

        return {
            ok: passRate >= 95,
            total: orders.length,
            paid,
            missingFields,
            amountMismatch,
            passRate: Number(passRate.toFixed(1)),
            verdict: passRate >= 95 ? "可以验收" : "不可验收",
        };
    }
    ```

    参考输出：

    ```javascript
    validateOrders(json);
    // {
    //   ok: false, total: 8, paid: 8,
    //   missingFields: [ {orderId:"SO20260601003", missing:[], emptyItems:true},
    //                    {orderId:"SO20260601004", missing:["items"], emptyItems:false},
    //                    {orderId:"SO20260601007", missing:[], emptyItems:true} ],
    //   amountMismatch: [ {orderId:"SO20260601002", totalAmount:99, payAmount:89,
    //                      expectedPay:99, diff:-10},
    //                     {orderId:"SO20260601005", totalAmount:24.62, payAmount:24.62,
    //                      expectedPay:24.63, diff:-0.01} ],
    //   passRate: 75, verdict: "不可验收"
    // }
    ```

    > 上面这段输出是用 `node` 在本文给出的 `orders.json` 上实际跑出来的。**你可以直接拿它对照自己的实现**：如果 `amountMismatch` 只有 1 条、`passRate` 是 `87.5`，说明你的脚本把 `SO20260601005` 判成了通过——大概率是你用了"按单取整"（`Math.round(总价 * 100)`），请回到第 3 题把两种口径的差异说清楚，而不是简单改成和答案一样。

## 下一步建议

<div class="tutorial-next-steps" markdown="1">

### 完成检查

学完本教程后，检查自己是否能做到：

- [ ] 能用 `let`/`const` 声明变量，用 `===` 做比较
- [ ] 能用数组方法（map/filter/find/forEach）处理数据
- [ ] 能用 `JSON.parse` 和 `JSON.stringify` 处理 JSON
- [ ] 能写简单的 Postman Tests 断言脚本
- [ ] 能在浏览器 F12 Console 中执行 JS 调试
- [ ] 能用 `async/await` + `fetch` 发送 HTTP 请求

### 推荐下一步

根据你的学习进度，选择下一步：

1. **如果你想写 Postman 脚本**：学习 [Postman 接口测试教程](../工具操作/Postman接口测试教程-软件测试版.md)，用 JS 编写 Tests 断言
2. **如果你想学前端调试**：学习 [前端基础教程](前端基础教程-软件测试版.md)，掌握浏览器 DevTools
3. **如果你想学接口自动化**：学习 [Python 接口自动化](../自动化测试/Python+Requests+Allure接口自动化教程-软件测试版.md)，用 Python 写接口测试

### 阶段测验

完成教程后，建议做 [JavaScript 基础测验](JavaScript基础测验.md) 检验学习效果。

### 通关检查

完成本阶段后，使用 [第4阶段-自动化测试通关](../学习中心/第4阶段-自动化测试通关.md) 检查是否可以进入下一阶段。

</div>
