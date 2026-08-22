---
description: Linux 基础测验，检验命令行和系统管理掌握程度。
---
# Linux 基础测验

!!! abstract "测验说明"
    本测验用于检验 Linux 实用教程的学习效果。共 12 道选择题，建议在学完教程后独立完成。

<div class="tutorial-meta">
    <span class="difficulty-badge difficulty-beginner">📗 入门难度</span>
    <span class="meta-item">⏱ 约 15 分钟</span>
    <span class="meta-item">📝 12 道选择题</span>
</div>

!!! tip "测验反馈"
    提交答案后，系统会显示：
    - 得分和正确率
    - 错题分析和薄弱知识点
    - 复习建议和推荐教程
    - 下一步学习建议

---

<div class="quiz-container" data-quiz-id="linux-basics">

<div class="quiz-item" data-correct="1">
<div class="quiz-question">Linux 中用于列出当前目录下文件和文件夹的命令是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q1" value="0"> dir</label>
<label class="quiz-option"><input type="radio" name="q1" value="1"> ls</label>
<label class="quiz-option"><input type="radio" name="q1" value="2"> list</label>
<label class="quiz-option"><input type="radio" name="q1" value="3"> show</label>
</div>
<div class="quiz-explanation">💡 `ls` 命令用于列出目录内容，常用参数：`-l` 详细信息，`-a` 显示隐藏文件，`-h` 人类可读大小</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">以下哪个命令用于切换目录？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q2" value="0"> cd</label>
<label class="quiz-option"><input type="radio" name="q2" value="1"> chdir</label>
<label class="quiz-option"><input type="radio" name="q2" value="2"> change</label>
<label class="quiz-option"><input type="radio" name="q2" value="3"> goto</label>
</div>
<div class="quiz-explanation">💡 `cd`（change directory）用于切换目录，例如 `cd /home` 切换到 home 目录，`cd ..` 返回上级目录</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">查看文件内容的命令是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q3" value="0"> show</label>
<label class="quiz-option"><input type="radio" name="q3" value="1"> display</label>
<label class="quiz-option"><input type="radio" name="q3" value="2"> cat</label>
<label class="quiz-option"><input type="radio" name="q3" value="3"> open</label>
</div>
<div class="quiz-explanation">💡 `cat` 命令用于查看文件内容，`more` 和 `less` 可分页查看，`tail -f` 可实时查看日志</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">在 Linux 中，哪个命令用于搜索文件内容？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q4" value="0"> find</label>
<label class="quiz-option"><input type="radio" name="q4" value="1"> locate</label>
<label class="quiz-option"><input type="radio" name="q4" value="2"> search</label>
<label class="quiz-option"><input type="radio" name="q4" value="3"> grep</label>
</div>
<div class="quiz-explanation">💡 `grep` 用于搜索文件内容，`find` 用于搜索文件。例如 `grep "error" app.log` 搜索包含 error 的行</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">查看当前系统进程的命令是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q5" value="0"> ps</label>
<label class="quiz-option"><input type="radio" name="q5" value="1"> top</label>
<label class="quiz-option"><input type="radio" name="q5" value="2"> proc</label>
<label class="quiz-option"><input type="radio" name="q5" value="3"> process</label>
</div>
<div class="quiz-explanation">💡 `top` 实时显示系统进程和资源使用，`ps` 显示当前进程快照，常用 `ps aux` 或 `ps -ef`</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">以下哪个命令用于查看端口占用情况？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q6" value="0"> netstat -tuln</label>
<label class="quiz-option"><input type="radio" name="q6" value="1"> port -show</label>
<label class="quiz-option"><input type="radio" name="q6" value="2"> network -list</label>
<label class="quiz-option"><input type="radio" name="q6" value="3"> ip -ports</label>
</div>
<div class="quiz-explanation">💡 `netstat -tuln` 查看端口占用，`ss -tuln` 是更现代的替代命令，`lsof -i :端口号` 查看特定端口</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">Linux 中，哪个命令用于修改文件权限？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q7" value="0"> perm</label>
<label class="quiz-option"><input type="radio" name="q7" value="1"> access</label>
<label class="quiz-option"><input type="radio" name="q7" value="2"> chmod</label>
<label class="quiz-option"><input type="radio" name="q7" value="3"> chperm</label>
</div>
<div class="quiz-explanation">💡 `chmod`（change mode）用于修改文件权限，例如 `chmod 755 script.sh` 设置可执行权限</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">查看磁盘使用情况的命令是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q8" value="0"> disk -show</label>
<label class="quiz-option"><input type="radio" name="q8" value="1"> storage -list</label>
<label class="quiz-option"><input type="radio" name="q8" value="2"> space -check</label>
<label class="quiz-option"><input type="radio" name="q8" value="3"> df -h</label>
</div>
<div class="quiz-explanation">💡 `df -h` 查看磁盘使用情况，`du -sh *` 查看当前目录下各文件/文件夹大小</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">在 Linux 中，哪个命令用于创建目录？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q9" value="0"> create dir</label>
<label class="quiz-option"><input type="radio" name="q9" value="1"> mkdir</label>
<label class="quiz-option"><input type="radio" name="q9" value="2"> makedir</label>
<label class="quiz-option"><input type="radio" name="q9" value="3"> newdir</label>
</div>
<div class="quiz-explanation">💡 `mkdir`（make directory）用于创建目录，`mkdir -p parent/child` 可递归创建多级目录</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">查看日志文件最后 100 行的命令是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q10" value="0"> tail -100 app.log</label>
<label class="quiz-option"><input type="radio" name="q10" value="1"> last -100 app.log</label>
<label class="quiz-option"><input type="radio" name="q10" value="2"> end -100 app.log</label>
<label class="quiz-option"><input type="radio" name="q10" value="3"> bottom -100 app.log</label>
</div>
<div class="quiz-explanation">💡 `tail -100 app.log` 查看最后 100 行，`tail -f app.log` 实时查看日志更新</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">Linux 中，哪个命令用于终止进程？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q11" value="0"> stop</label>
<label class="quiz-option"><input type="radio" name="q11" value="1"> end</label>
<label class="quiz-option"><input type="radio" name="q11" value="2"> kill</label>
<label class="quiz-option"><input type="radio" name="q11" value="3"> terminate</label>
</div>
<div class="quiz-explanation">💡 `kill PID` 终止进程，`kill -9 PID` 强制终止，`pkill 进程名` 按名称终止</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">查看系统内存使用情况的命令是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q12" value="0"> memory -show</label>
<label class="quiz-option"><input type="radio" name="q12" value="1"> ram -list</label>
<label class="quiz-option"><input type="radio" name="q12" value="2"> mem -check</label>
<label class="quiz-option"><input type="radio" name="q12" value="3"> free -h</label>
</div>
<div class="quiz-explanation">💡 `free -h` 查看内存使用情况，`-h` 参数使输出人类可读（以 GB/MB 为单位）</div>
</div>


<button class="quiz-submit">提交答案</button>
<div class="quiz-score"></div>

</div>

---

## 复习建议

根据测验结果，建议复习以下内容：

| 正确率 | 建议 |
|--------|------|
| 90%+ | 可以进入下一阶段学习 |
| 70-89% | 复习错题相关知识点 |
| 60-69% | 重新学习 Linux 实用教程 |
| <60% | 认真学习教程，完成所有练习 |

**推荐复习章节：**

- [Linux 实用教程](Linux实用教程-软件测试版.md) - 命令行操作、日志分析、进程管理

---

## 下一步学习

完成测验后，建议：

1. **如果正确率 70%+**：继续学习 [Git 版本控制教程](Git版本控制教程-软件测试版.md)
2. **如果正确率 <70%**：复习 [Linux 实用教程](Linux实用教程-软件测试版.md)
3. **查看学习进度**：访问 [学习中心](../学习中心.md)
