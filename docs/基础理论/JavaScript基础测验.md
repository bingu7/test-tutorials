---
description: JavaScript 基础测验，检验变量、类型、数组方法与调试能力掌握程度。
---
# JavaScript 基础测验

!!! abstract "测验说明"
    本测验用于检验 JavaScript 基础教程的学习效果。共 12 道选择题，覆盖变量与类型、运算符、数组方法、对象解构与浏览器调试。

<div class="tutorial-meta">
    <span class="difficulty-badge difficulty-beginner">📗 入门难度</span>
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

<div class="quiz-container" data-quiz-id="javascript-basics">

<div class="quiz-item" data-correct="2">
<div class="quiz-question">JavaScript 中 `==` 和 `===` 的区别是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q1" value="0"> 两者完全相同，只是写法不同</label>
<label class="quiz-option"><input type="radio" name="q1" value="1"> `===` 只比较值，`==` 同时比较值和类型</label>
<label class="quiz-option"><input type="radio" name="q1" value="2"> `===` 是严格比较，类型不同直接返回 false；`==` 会做隐式类型转换</label>
<label class="quiz-option"><input type="radio" name="q1" value="3"> `==` 只能比较数字，`===` 只能比较字符串</label>
</div>
<div class="quiz-explanation">💡 例如 `5 === "5"` 为 false，而 `5 == "5"` 为 true。隐式转换会带来难以察觉的缺陷，**规则是始终用 `===` 和 `!==`**</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">声明一个后续不会再重新赋值的变量，推荐使用？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q2" value="0"> const</label>
<label class="quiz-option"><input type="radio" name="q2" value="1"> var</label>
<label class="quiz-option"><input type="radio" name="q2" value="2"> let</label>
<label class="quiz-option"><input type="radio" name="q2" value="3"> static</label>
</div>
<div class="quiz-explanation">💡 `const` 声明常量，`let` 声明可变变量，两者都是块级作用域；老的 `var` 没有块级作用域，容易踩坑。**默认用 const，需要改再用 let**</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">用模板字符串拼接变量，正确写法是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q3" value="0"> "欢迎 " + $user + " 登录"</label>
<label class="quiz-option"><input type="radio" name="q3" value="1"> '欢迎 {user} 登录'</label>
<label class="quiz-option"><input type="radio" name="q3" value="2"> "欢迎 ${user} 登录"</label>
<label class="quiz-option"><input type="radio" name="q3" value="3"> `欢迎 ${user} 登录`（使用反引号）</label>
</div>
<div class="quiz-explanation">💡 模板字符串必须用**反引号**包裹，变量写在 `${}` 里。用双引号或单引号时 `${}` 不会被解析，会原样输出</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">可选链操作符 `?.` 的作用是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q4" value="0"> 判断变量是否为真</label>
<label class="quiz-option"><input type="radio" name="q4" value="1"> 当中间某一层为 null 或 undefined 时短路返回 undefined，避免报错</label>
<label class="quiz-option"><input type="radio" name="q4" value="2"> 把值转换成字符串</label>
<label class="quiz-option"><input type="radio" name="q4" value="3"> 声明一个可选参数</label>
</div>
<div class="quiz-explanation">💡 面对 `response.data.user.name` 这种深层取值，只要中间任意一层是空就会抛错。写成 `response?.data?.user?.name` 可以安全地拿到 undefined</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">数组方法 `map()` 和 `forEach()` 的关键区别是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q5" value="0"> `map()` 会修改原数组，`forEach()` 不会</label>
<label class="quiz-option"><input type="radio" name="q5" value="1"> `map()` 返回处理后的新数组，`forEach()` 只遍历不返回结果</label>
<label class="quiz-option"><input type="radio" name="q5" value="2"> `forEach()` 只能处理数字数组</label>
<label class="quiz-option"><input type="radio" name="q5" value="3"> 两者完全等价</label>
</div>
<div class="quiz-explanation">💡 要"转换后拿到新数组"用 `map()`；只是"逐个处理、不需要结果"用 `forEach()`。写断言脚本时常需要 `map()` 把响应数组转成想要的结构</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">要从数组里挑出满足条件的元素，应该用哪个方法？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q6" value="0"> map()</label>
<label class="quiz-option"><input type="radio" name="q6" value="1"> reduce()</label>
<label class="quiz-option"><input type="radio" name="q6" value="2"> sort()</label>
<label class="quiz-option"><input type="radio" name="q6" value="3"> filter()</label>
</div>
<div class="quiz-explanation">💡 `filter()` 按条件筛选并返回新数组；`map()` 做映射转换；`reduce()` 做聚合；`sort()` 排序。分清楚这四个是读前端代码的基本功</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">什么是回调函数？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q7" value="0"> 作为参数传给另一个函数、在合适时机被该函数调用的函数</label>
<label class="quiz-option"><input type="radio" name="q7" value="1"> 只能被调用一次的函数</label>
<label class="quiz-option"><input type="radio" name="q7" value="2"> 定义在循环内部的函数</label>
<label class="quiz-option"><input type="radio" name="q7" value="3"> 返回值一定是布尔值的函数</label>
</div>
<div class="quiz-explanation">💡 数组的 `forEach(function(item){...})`、`setTimeout(function(){...})` 里传入的都是回调函数。理解回调是看懂异步代码（接口请求、等待）的前提</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">想快速验证一小段 JS 的执行结果，最便捷的方式是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q8" value="0"> 新建一个 HTML 文件并部署到服务器</label>
<label class="quiz-option"><input type="radio" name="q8" value="1"> 装一个完整的 Node 工程</label>
<label class="quiz-option"><input type="radio" name="q8" value="2"> 直接在浏览器开发者工具的 Console 面板里输入执行</label>
<label class="quiz-option"><input type="radio" name="q8" value="3"> 把代码发给开发帮忙运行</label>
</div>
<div class="quiz-explanation">💡 按 F12 打开 Console 即可即写即看结果，是验证正则、日期格式化、JSON 取值这类小逻辑最快的方式，不需要任何环境准备</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">`const { code, msg } = response` 这种写法叫？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q9" value="0"> 类型断言</label>
<label class="quiz-option"><input type="radio" name="q9" value="1"> 展开运算符</label>
<label class="quiz-option"><input type="radio" name="q9" value="2"> 立即执行函数</label>
<label class="quiz-option"><input type="radio" name="q9" value="3"> 解构赋值</label>
</div>
<div class="quiz-explanation">💡 解构赋值把对象里的属性直接提取成变量，省去反复写 `response.code`、`response.msg`。读接口断言代码时会大量遇到这种写法</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">要判断一个值是不是数组，应该用？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q10" value="0"> typeof value === "array"</label>
<label class="quiz-option"><input type="radio" name="q10" value="1"> Array.isArray(value)</label>
<label class="quiz-option"><input type="radio" name="q10" value="2"> value.length &gt; 0</label>
<label class="quiz-option"><input type="radio" name="q10" value="3"> value == []</label>
</div>
<div class="quiz-explanation">💡 `typeof []` 返回的是 `"object"`，判断不出数组，这是 JS 的经典陷阱。判断数组要用 `Array.isArray()`；而 `value == []` 永远为 false</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">对测试人员来说，学习 JavaScript 最直接的收益是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q11" value="0"> 能看懂 Console 报错、编写 Postman Tests 与 Playwright 脚本，并判断前后端问题归属</label>
<label class="quiz-option"><input type="radio" name="q11" value="1"> 可以独立完成整个前端产品的开发</label>
<label class="quiz-option"><input type="radio" name="q11" value="2"> 可以替代接口性能压测</label>
<label class="quiz-option"><input type="radio" name="q11" value="3"> 能提升服务器的处理能力</label>
</div>
<div class="quiz-explanation">💡 测试人员学 JS 不是为了做前端，而是为了**看懂和动手**：读懂报错定位问题归属，写 Postman 断言，维护 Playwright 脚本</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">说 JavaScript 是"动态类型语言"，含义是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q12" value="0"> 变量类型必须在声明时写死，之后不能改变</label>
<label class="quiz-option"><input type="radio" name="q12" value="1"> 所有变量都是字符串类型</label>
<label class="quiz-option"><input type="radio" name="q12" value="2"> 变量类型由运行时的值决定，写错类型不会在运行前报错</label>
<label class="quiz-option"><input type="radio" name="q12" value="3"> 变量可以自动在不同类型间安全转换</label>
</div>
<div class="quiz-explanation">💡 同一个变量可以先存数字再存字符串，类型错误往往要到运行时才暴露。这正是 TypeScript 想解决的问题——**在编译期就把类型错误拦下来**</div>
</div>

<button class="quiz-submit">提交答案</button>
<div class="quiz-score"></div>

</div>

---

## 继续学习

完成测验后，建议继续学习：

- [JavaScript 基础教程](JavaScript基础教程-软件测试版.md) - 查看完整教程
- [TypeScript 基础测验](TypeScript基础测验.md) - 进阶到类型系统
- [前端基础教程](前端基础教程-软件测试版.md) - 补 HTML/CSS 与 DevTools
