---
description: TypeScript 基础教程，类型系统、接口、泛型和 Playwright TS。
---
# TypeScript 基础教程（软件测试人员专用）

!!! abstract "教程简介"
    本教程面向软件测试工程师，讲解 TypeScript 在测试工作中的应用：Playwright Node.js 版、测试框架、接口数据类型定义。在 JavaScript 基础上增加类型系统，让代码更安全、IDE 提示更智能。

<div class="tutorial-meta">
    <span class="difficulty-badge difficulty-beginner">📗 入门难度</span>
    <span class="meta-item">⏱ 约 2 天</span>
    <span class="meta-item">🎯 目标：能读懂 TypeScript 测试代码，能编写带类型的测试脚本</span>
</div>

---

## 前置要求

| 项目 | 要求 | 获取方式 |
|------|------|----------|
| JavaScript 基础 | 了解变量、函数、数组、对象、async/await | [JavaScript 基础教程](JavaScript基础教程-软件测试版.md) |

---

## 新手导读

TypeScript 是 JavaScript 的"超集"——在 JS 基础上加了**类型检查**。你可以理解为：JS 是自由填写的表格，TS 是带校验的表格。

测试人员学 TypeScript 的理由：

1. **Playwright 官方推荐 TypeScript**，Node.js 版 Playwright 文档全部用 TS。
2. **IDE 提示更强大**——写代码时自动补全属性名、参数类型，减少拼写错误。
3. **类型即文档**——接口返回什么字段、什么类型，直接看类型定义就知道。
4. **编译时抓错**——拼错属性名、传错参数类型，写代码时就报红，不用等运行才发现。

第一遍先掌握基础类型、接口（interface）、函数类型、类型断言即可。泛型和高级类型按需学。

---

## 一、TypeScript 是什么

### 1.1 JavaScript vs TypeScript

```javascript
// JavaScript：灵活但容易出错
function greet(name) {
    return "Hello, " + name
}
greet(123)         // "Hello, 123"（不报错，但逻辑错误）
greet()            // "Hello, undefined"（不报错）
```

```typescript
// TypeScript：加了类型检查
function greet(name: string): string {
    return "Hello, " + name
}
greet(123)         // 报错！类型错误
greet()            // 报错！缺少参数
```

### 1.2 安装与使用

```bash
# 安装 TypeScript 编译器
npm install -g typescript

# 验证
tsc --version

# 编译 .ts 文件为 .js
tsc test.ts

# 直接运行 .ts 文件（需要 ts-node）
npm install -g ts-node
ts-node test.ts
```

> TypeScript 最终会被编译成 JavaScript 才能运行。浏览器和 Node.js 只认识 JS，不认识 TS。

---

## 二、基础类型

### 2.1 原始类型

```typescript
let name: string = "张三"
let age: number = 28
let active: boolean = true
let data: null = null
let value: undefined = undefined
```

### 2.2 数组

```typescript
// 两种写法，效果一样
let scores: number[] = [90, 85, 92]
let names: Array<string> = ["Alice", "Bob"]

// 混合类型数组（元组）
let user: [string, number] = ["张三", 28]    // 第一个是字符串，第二个是数字
```

### 2.3 any 与 unknown

```typescript
// any：关闭类型检查（尽量少用）
let x: any = "hello"
x = 123          // 不报错
x.foo()          // 不报错（但运行时会崩）

// unknown：安全的 any（必须先判断类型才能用）
let y: unknown = "hello"
y.toUpperCase()  // 报错！unknown 不能直接用方法
if (typeof y === "string") {
    y.toUpperCase()  // OK！判断过类型后可以用
}
```

> **规则：** 优先写明确类型，不确定时用 `unknown`，尽量避免 `any`。

---

## 三、接口 interface

接口定义对象的"结构模板"——必须有哪些字段、每个字段是什么类型。

### 3.1 基本用法

```typescript
// 定义接口
interface User {
    id: number
    name: string
    email: string
    age?: number           // ? 表示可选字段
}

// 使用接口
let user: User = {
    id: 1,
    name: "张三",
    email: "zhangsan@test.com"
    // age 可以不写，因为是可选的
}

user.name        // OK
user.phone       // 报错！User 接口没有 phone 字段
```

### 3.2 接口继承

```typescript
interface Animal {
    name: string
    age: number
}

interface Dog extends Animal {
    breed: string    // 品种
}

let dog: Dog = {
    name: "旺财",
    age: 3,
    breed: "金毛"
}
```

### 3.3 接口定义接口响应

实际测试中最常见的用法——定义接口返回数据的类型：

```typescript
// 定义接口响应结构
interface LoginResponse {
    code: number
    msg: string
    data: {
        token: string
        userId: number
        expires: number
    }
}

// 使用：解析响应时有完整类型提示
async function login(): Promise<LoginResponse> {
    const response = await fetch("https://api.example.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "test", password: "123456" })
    })
    return response.json()
}

// 调用时 IDE 自动提示 data.token、data.userId 等字段
const result = await login()
console.log(result.data.token)     // IDE 自动补全
console.log(result.data.tokn)      // 报红！拼写错误，编译时就能发现
```

---

## 四、类型别名 type

`type` 和 `interface` 类似，但更灵活：

```typescript
// 基本类型别名
type ID = number | string    // 联合类型：可以是数字或字符串

let userId: ID = 1
let orderId: ID = "ORD-001"

// 对象类型别名
type Point = {
    x: number
    y: number
}

// 联合类型
type Status = "success" | "error" | "pending"
let status: Status = "success"    // 只能是这三个值之一
let s: Status = "fail"            // 报错！不在联合类型中
```

### interface vs type

| 场景 | 推荐 |
|------|------|
| 定义对象结构 | `interface`（可继承、可扩展） |
| 联合类型、交叉类型 | `type` |
| 一般场景 | 都行，选一个团队统一即可 |

---

## 五、函数类型

### 5.1 参数和返回值类型

```typescript
// 参数类型 + 返回值类型
function add(a: number, b: number): number {
    return a + b
}

// 箭头函数
const multiply = (a: number, b: number): number => a * b

// 无返回值用 void
function log(msg: string): void {
    console.log(msg)
}
```

### 5.2 可选参数与默认值

```typescript
// 可选参数
function greet(name: string, greeting?: string): string {
    return `${greeting || "Hello"}, ${name}!`
}
greet("张三")              // "Hello, 张三!"
greet("张三", "你好")       // "你好, 张三!"

// 默认值
function createUser(name: string, role: string = "tester") {
    return { name, role }
}
createUser("张三")          // { name: "张三", role: "tester" }
```

### 5.3 箭头函数类型

```typescript
// 定义函数类型
type Callback = (data: string) => void

// 使用
function fetchData(callback: Callback) {
    callback("接口返回的数据")
}

fetchData((data) => {
    console.log(data)    // "接口返回的数据"
})
```

---

## 六、类 class

```typescript
class LoginPage {
    // 属性类型声明
    private username: string
    private password: string

    constructor(username: string, password: string) {
        this.username = username
        this.password = password
    }

    // 方法
    login(): { user: string; token: string } {
        // 模拟登录
        return { user: this.username, token: "abc123" }
    }
}

const page = new LoginPage("test", "123456")
const result = page.login()
```

### 访问修饰符

| 修饰符 | 含义 |
|--------|------|
| `public` | 公开，任何地方都能访问（默认） |
| `private` | 私有，只有类内部能访问 |
| `protected` | 受保护，类内部和子类能访问 |

```typescript
class User {
    public name: string          // 公开
    private password: string     // 私有
    protected role: string       // 受保护

    constructor(name: string, password: string, role: string) {
        this.name = name
        this.password = password
        this.role = role
    }
}

const user = new User("张三", "123456", "admin")
user.name        // OK
user.password    // 报错！private 不能在外部访问
```

---

## 七、泛型

泛型让函数/接口能处理多种类型，而不丢失类型信息。

### 7.1 泛型函数

```typescript
// 不用泛型：返回 any，丢失类型信息
function firstElement(arr: any[]): any {
    return arr[0]
}
firstElement([1, 2, 3])        // any（IDE 不知道是 number）

// 用泛型：保留类型信息
function first<T>(arr: T[]): T {
    return arr[0]
}
first([1, 2, 3])               // number（IDE 知道是 number）
first(["a", "b", "c"])         // string
```

### 7.2 泛型接口

```typescript
// 定义通用的接口响应类型
interface ApiResponse<T> {
    code: number
    msg: string
    data: T
}

// 不同接口用不同的 data 类型
interface User { id: number; name: string }
interface Order { orderId: string; amount: number }

type UserResponse = ApiResponse<User>
type OrderResponse = ApiResponse<Order>

// 使用
const userRes: UserResponse = {
    code: 0,
    msg: "成功",
    data: { id: 1, name: "张三" }    // data 的类型是 User
}
```

> 泛型初学时看不懂没关系，在实际项目中遇到时再回来看。

---

## 八、类型断言

当你比 TypeScript 更清楚某个值的类型时，可以用类型断言"告诉"编译器。

```typescript
// 场景：从 DOM 获取元素
const el = document.querySelector("#username")    // 类型是 Element | null

// 直接用 .value 会报错，因为 Element 没有 .value 属性
el.value    // 报错！

// 类型断言：告诉 TS 这是一个 HTMLInputElement
const input = el as HTMLInputElement
input.value    // OK！

// 另一种写法（效果一样）
const input2 = <HTMLInputElement>el
```

### 常见断言场景

```typescript
// 接口响应断言
const data = response.json() as LoginResponse

// DOM 元素断言
const btn = document.querySelector("#submit") as HTMLButtonElement
btn.disabled = true

// 非空断言（你确定它不是 null/undefined）
const token = getToken()!    // ! 表示"我确定不是 null"
```

> 类型断言不会在运行时做任何检查，它只是告诉编译器"相信我"。如果断言错误，运行时仍然会出错。

---

## 九、枚举 enum

枚举定义一组命名常量：

```typescript
// 数字枚举
enum Status {
    Pending,      // 0
    Success,      // 1
    Failed        // 2
}
let s: Status = Status.Success    // 1

// 字符串枚举（推荐，值更直观）
enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

function sendRequest(method: HttpMethod, url: string) {
    // ...
}

sendRequest(HttpMethod.GET, "/api/users")    // OK
sendRequest("GET", "/api/users")             // 报错！类型不匹配
```

---

## 十、测试场景实战

### 10.1 定义接口响应类型

```typescript
// 定义接口响应结构（放在 types 目录下）
interface LoginResponse {
    code: number
    msg: string
    data: {
        token: string
        userId: number
    }
}

interface UserInfo {
    id: number
    username: string
    email: string
    roles: string[]
}

// 类型安全的接口调用
async function login(username: string, password: string): Promise<LoginResponse> {
    const res = await fetch("https://api.example.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    return res.json() as Promise<LoginResponse>
}
```

### 10.2 Playwright TypeScript 示例

```typescript
import { test, expect } from "@playwright/test"

// 类型安全的测试
test("用户登录", async ({ page }) => {
    await page.goto("https://example.com/login")
    await page.fill("#username", "testuser")
    await page.fill("#password", "123456")
    await page.click("#login-btn")

    // 期望跳转到首页
    await expect(page).toHaveURL(/.*dashboard/)
})
```

### 10.3 Postman 中的 TypeScript 风格

虽然 Postman Tests 用 JavaScript，但 TypeScript 的类型思维同样适用：

```javascript
// Postman Tests（JS）— 用类型思维写断言
const res = pm.response.json()

// 先判断结构再取值（类似 TypeScript 类型守卫）
pm.expect(res).to.have.property("code")
pm.expect(res).to.have.property("data")
pm.expect(res.data).to.have.property("token")
pm.expect(res.data.token).to.be.a("string")
```

### 10.4 封装类型安全的测试工具

```typescript
// 封装 API 请求工具
interface RequestConfig {
    method: "GET" | "POST" | "PUT" | "DELETE"
    url: string
    headers?: Record<string, string>
    body?: unknown
}

interface ApiResponse<T = unknown> {
    status: number
    data: T
}

async function apiRequest<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body: config.body ? JSON.stringify(config.body) : undefined
    })
    return {
        status: response.status,
        data: await response.json() as T
    }
}

// 使用：完全类型安全
interface User { id: number; name: string }
const result = await apiRequest<User>({
    method: "GET",
    url: "https://api.example.com/users/1"
})
console.log(result.data.name)    // IDE 自动补全
```

---

## 十一、tsconfig.json 配置

TypeScript 项目根目录的 `tsconfig.json` 控制编译行为：

```json
{
    "compilerOptions": {
        "target": "ES2020",           // 编译目标 JS 版本
        "module": "commonjs",         // 模块系统
        "strict": true,               // 开启严格类型检查（推荐）
        "esModuleInterop": true,      // 兼容 CommonJS 模块
        "outDir": "./dist",           // 编译输出目录
        "rootDir": "./src"            // 源码目录
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules"]
}
```

> Playwright 项目自带 `tsconfig.json`，一般不需要手动配置。

---

## 十二、常见错误排查

### 12.1 Property 'xxx' does not exist on type

```typescript
const el = document.querySelector("#btn")
el.innerText    // 报错！Element 没有 innerText

// 解决：类型断言
(el as HTMLElement).innerText    // OK
```

### 12.2 Type 'xxx' is not assignable to type 'yyy'

```typescript
let status: "success" | "error" = "success"
status = "pending"    // 报错！不在联合类型中

// 解决：扩展联合类型
type Status = "success" | "error" | "pending"
```

### 12.3 Object is possibly 'undefined'

```typescript
interface User {
    address?: { city: string }    // address 是可选的
}

function getCity(user: User) {
    return user.address.city    // 报错！address 可能是 undefined
}

// 解决：可选链
function getCity(user: User) {
    return user.address?.city    // OK
}
```

### 12.4 Cannot find module 'xxx'

```bash
# 解决：安装类型声明
npm install @types/node          # Node.js 类型
npm install @types/jest          # Jest 类型
```

很多库自带类型定义，不需要额外安装。只有少数库需要装 `@types/xxx`。

---

## 附录：速查表

### 基础类型

```typescript
let s: string = "hello"
let n: number = 42
let b: boolean = true
let a: number[] = [1, 2, 3]
let t: [string, number] = ["a", 1]
let x: any = ...        // 关闭类型检查
let y: unknown = ...    // 安全的 any
```

### 接口与类型

```typescript
interface User { id: number; name: string; age?: number }
type Status = "success" | "error"
type ID = number | string
```

### 函数

```typescript
function fn(a: string, b?: number): void { }
const fn = (a: string): string => a.toUpperCase()
```

### 类型断言

```typescript
const el = document.querySelector("#x") as HTMLInputElement
const data = response.json() as LoginResponse
```

### 泛型

```typescript
interface ApiResponse<T> { code: number; data: T }
function first<T>(arr: T[]): T { return arr[0] }
```

---

!!! tip "学习建议"
    TypeScript 学习曲线比 JavaScript 稍陡，但好处是写代码时 IDE 就能帮你发现错误。建议先用 JavaScript 入门，再学 TypeScript 进阶。实际项目中从 JavaScript 迁移到 TypeScript 也很方便——只需要把 `.js` 改成 `.ts`，然后逐步添加类型。

---

## 下一步建议

<div class="tutorial-next-steps">

### 完成检查

学完本教程后，检查自己是否能做到：

- [ ] 能用 `interface` 定义对象结构
- [ ] 能为函数参数和返回值添加类型
- [ ] 能用类型断言处理 DOM 元素
- [ ] 能理解泛型的基本含义
- [ ] 能看懂 Playwright TypeScript 测试代码

### 推荐下一步

1. **如果你想写 Playwright 测试**：学习 [Playwright 自动化测试教程](../自动化测试/Playwright自动化测试教程-软件测试版.md)，用 TypeScript 编写 Web 自动化
2. **如果你想学 Node.js 测试框架**：学习 [Python 接口自动化](../自动化测试/Python+Requests+Allure接口自动化教程-软件测试版.md)，理解测试框架设计思路
3. **如果你想巩固 JS 基础**：回到 [JavaScript 基础教程](JavaScript基础教程-软件测试版.md) 多做练习

### 通关检查

完成本阶段后，使用 [第4阶段-自动化测试通关](../学习中心/第4阶段-自动化测试通关.md) 检查是否可以进入下一阶段。

</div>
