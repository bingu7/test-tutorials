# Python 基础测验

!!! abstract "测验说明"
    本测验用于检验 Python 基础教程的学习效果。共 10 道选择题，建议在学完教程后独立完成。

<div class="tutorial-meta">
    <span class="difficulty-badge difficulty-beginner">📗 入门难度</span>
    <span class="meta-item">⏱ 约 15 分钟</span>
    <span class="meta-item">📝 10 道选择题</span>
</div>

!!! tip "测验反馈"
    提交答案后，系统会显示：
    - 得分和正确率
    - 错题分析和薄弱知识点
    - 复习建议和推荐教程
    - 下一步学习建议

---

<div class="quiz-container" data-quiz-id="python-basics">

<div class="quiz-item" data-correct="1">
<div class="quiz-question">Python 中用于定义函数的关键字是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q1" value="0"> defunction</label>
<label class="quiz-option"><input type="radio" name="q1" value="1"> def</label>
<label class="quiz-option"><input type="radio" name="q1" value="2"> function</label>
<label class="quiz-option"><input type="radio" name="q1" value="3"> define</label>
</div>
<div class="quiz-explanation">💡 Python 使用 `def` 关键字定义函数，例如 `def my_function():`</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">以下哪个是 Python 的列表（List）？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q2" value="0"> {1, 2, 3}</label>
<label class="quiz-option"><input type="radio" name="q2" value="1"> (1, 2, 3)</label>
<label class="quiz-option"><input type="radio" name="q2" value="2"> [1, 2, 3]</label>
<label class="quiz-option"><input type="radio" name="q2" value="3"> {"a": 1, "b": 2}</label>
</div>
<div class="quiz-explanation">💡 方括号 `[]` 定义列表，圆括号 `()` 定义元组，花括号 `{}` 定义集合或字典</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">Python 中 `==` 和 `=` 的区别是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q3" value="0"> `==` 比较值，`=` 赋值</label>
<label class="quiz-option"><input type="radio" name="q3" value="1"> `=` 比较值，`==` 赋值</label>
<label class="quiz-option"><input type="radio" name="q3" value="2"> 两者都是比较</label>
<label class="quiz-option"><input type="radio" name="q3" value="3"> 两者都是赋值</label>
</div>
<div class="quiz-explanation">💡 `==` 是比较运算符，用于判断两个值是否相等；`=` 是赋值运算符，用于给变量赋值</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">以下哪个不是 Python 的数据类型？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q4" value="0"> int</label>
<label class="quiz-option"><input type="radio" name="q4" value="1"> str</label>
<label class="quiz-option"><input type="radio" name="q4" value="2"> list</label>
<label class="quiz-option"><input type="radio" name="q4" value="3"> array</label>
</div>
<div class="quiz-explanation">💡 Python 内置类型包括 int、str、list、dict、tuple、set 等，`array` 需要导入 array 模块或使用 numpy</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">`for` 循环中 `range(5)` 生成的数字序列是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q5" value="0"> 1, 2, 3, 4, 5</label>
<label class="quiz-option"><input type="radio" name="q5" value="1"> 0, 1, 2, 3, 4</label>
<label class="quiz-option"><input type="radio" name="q5" value="2"> 0, 1, 2, 3, 4, 5</label>
<label class="quiz-option"><input type="radio" name="q5" value="3"> 1, 2, 3, 4</label>
</div>
<div class="quiz-explanation">💡 `range(5)` 生成 0 到 4 的整数序列（左闭右开），共 5 个数字</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">Python 中用于处理异常的关键字组合是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q6" value="0"> if / else</label>
<label class="quiz-option"><input type="radio" name="q6" value="1"> for / while</label>
<label class="quiz-option"><input type="radio" name="q6" value="2"> try / except</label>
<label class="quiz-option"><input type="radio" name="q6" value="3"> do / catch</label>
</div>
<div class="quiz-explanation">💡 Python 使用 `try/except` 捕获异常，还可以用 `finally` 执行清理代码</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">以下哪种方式可以创建一个空字典？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q7" value="0"> `dict()` 或 `{}`</label>
<label class="quiz-option"><input type="radio" name="q7" value="1"> `[]`</label>
<label class="quiz-option"><input type="radio" name="q7" value="2"> `()`</label>
<label class="quiz-option"><input type="radio" name="q7" value="3"> `set()`</label>
</div>
<div class="quiz-explanation">💡 `dict()` 和 `{}` 都可以创建空字典；`[]` 创建空列表；`()` 创建空元组；`set()` 创建空集合</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">Python 中字符串方法 `.strip()` 的作用是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q8" value="0"> 转换为大写</label>
<label class="quiz-option"><input type="radio" name="q8" value="1"> 去除首尾空白字符</label>
<label class="quiz-option"><input type="radio" name="q8" value="2"> 分割字符串</label>
<label class="quiz-option"><input type="radio" name="q8" value="3"> 替换字符</label>
</div>
<div class="quiz-explanation">💡 `.strip()` 去除字符串首尾的空白字符（空格、换行、制表符等）</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">在测试脚本中，哪个库常用于发送 HTTP 请求？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q9" value="0"> os</label>
<label class="quiz-option"><input type="radio" name="q9" value="1"> json</label>
<label class="quiz-option"><input type="radio" name="q9" value="2"> re</label>
<label class="quiz-option"><input type="radio" name="q9" value="3"> requests</label>
</div>
<div class="quiz-explanation">💡 `requests` 是 Python 最流行的 HTTP 请求库，用于接口测试</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">Python 中 `if __name__ == "__main__":` 的作用是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q10" value="0"> 定义主函数</label>
<label class="quiz-option"><input type="radio" name="q10" value="1"> 导入模块</label>
<label class="quiz-option"><input type="radio" name="q10" value="2"> 确保代码只在直接运行时执行</label>
<label class="quiz-option"><input type="radio" name="q10" value="3"> 声明变量</label>
</div>
<div class="quiz-explanation">💡 当文件被直接运行时，`__name__` 等于 `"__main__"`；被导入时不等于，因此可以用来区分是否直接运行</div>
</div>

<button class="quiz-submit">提交答案</button>
<div class="quiz-score"></div>

</div>

---

## 继续学习

完成测验后，建议继续学习：

- [Python 基础教程](Python基础教程-软件测试版.md) - 查看完整教程
- [章节练习与参考答案](../章节练习与参考答案.md) - 更多练习题
- [学习路线](../学习路线.md) - 规划下一步学习
