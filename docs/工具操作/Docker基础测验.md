---
description: Docker 基础测验，检验镜像、容器、Dockerfile、数据卷和 Compose 掌握程度。
---
# Docker 基础测验

!!! abstract "测验说明"
    本测验用于检验 Docker 容器教程的学习效果。共 12 道选择题，建议在学完教程后独立完成。

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

<div class="quiz-container" data-quiz-id="docker-basics">

<div class="quiz-item" data-correct="2">
<div class="quiz-question">Docker 中"镜像"和"容器"的关系，最准确的描述是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q1" value="0"> 镜像是容器的运行实例</label>
<label class="quiz-option"><input type="radio" name="q1" value="1"> 两者完全等价，可以互换使用</label>
<label class="quiz-option"><input type="radio" name="q1" value="2"> 容器是镜像的运行实例，一个镜像可以启动多个容器</label>
<label class="quiz-option"><input type="radio" name="q1" value="3"> 容器必须先导出成镜像才能启动</label>
</div>
<div class="quiz-explanation">💡 镜像是只读模板，容器是镜像运行起来的实例。同一个镜像可以同时启动多个互不影响的容器</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">`docker run -d -p 8080:80 nginx` 中 `-p 8080:80` 的含义是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q2" value="0"> 容器 8080 端口映射到宿主机 80 端口</label>
<label class="quiz-option"><input type="radio" name="q2" value="1"> 宿主机 8080 端口映射到容器 80 端口</label>
<label class="quiz-option"><input type="radio" name="q2" value="2"> 随机分配宿主机端口，同时监听 8080 和 80</label>
<label class="quiz-option"><input type="radio" name="q2" value="3"> 限制容器只能使用 8080 和 80 两个端口</label>
</div>
<div class="quiz-explanation">💡 端口映射的格式是 `宿主端口:容器端口`。所以是访问宿主机 8080，实际转发到容器内的 80 端口</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">容器启动后服务异常，想查看它的运行日志，应该用哪个命令？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q3" value="0"> docker logs mynginx</label>
<label class="quiz-option"><input type="radio" name="q3" value="1"> docker log mynginx</label>
<label class="quiz-option"><input type="radio" name="q3" value="2"> docker show mynginx</label>
<label class="quiz-option"><input type="radio" name="q3" value="3"> docker ps --logs mynginx</label>
</div>
<div class="quiz-explanation">💡 `docker logs <容器名>` 查看日志，加 `-f` 实时跟踪，加 `--tail 100` 只看最后 100 行</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">想进入一个正在运行的容器里排查问题，正确的命令是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q4" value="0"> docker run -it mynginx /bin/bash</label>
<label class="quiz-option"><input type="radio" name="q4" value="1"> docker attach --exec mynginx</label>
<label class="quiz-option"><input type="radio" name="q4" value="2"> docker enter mynginx</label>
<label class="quiz-option"><input type="radio" name="q4" value="3"> docker exec -it mynginx /bin/bash</label>
</div>
<div class="quiz-explanation">💡 `docker exec` 用于在**已运行**的容器中执行命令；`docker run` 会新建一个容器，不是进入现有容器。容器内没有 bash 时可改用 `/bin/sh`</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">Dockerfile 中用于指定基础镜像的指令是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q5" value="0"> BASE</label>
<label class="quiz-option"><input type="radio" name="q5" value="1"> FROM</label>
<label class="quiz-option"><input type="radio" name="q5" value="2"> IMAGE</label>
<label class="quiz-option"><input type="radio" name="q5" value="3"> PULL</label>
</div>
<div class="quiz-explanation">💡 `FROM` 必须是 Dockerfile 的第一条有效指令，例如 `FROM python:3.10-slim`</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">Dockerfile 中 `RUN` 和 `CMD` 的区别是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q6" value="0"> 两者完全等价，写哪个都可以</label>
<label class="quiz-option"><input type="radio" name="q6" value="1"> RUN 在容器启动时执行，CMD 在构建镜像时执行</label>
<label class="quiz-option"><input type="radio" name="q6" value="2"> RUN 在构建镜像时执行，CMD 在容器启动时执行</label>
<label class="quiz-option"><input type="radio" name="q6" value="3"> RUN 只能执行一条，CMD 可以执行多条</label>
</div>
<div class="quiz-explanation">💡 构建期用 `RUN`（装依赖、改配置），运行期用 `CMD`（指定容器启动的默认命令）。两者时机不同，不要混淆</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">容器被删除后数据就丢了，要让数据持久化应该怎么做？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q7" value="0"> 挂载数据卷，如 `-v /宿主目录:/容器目录`</label>
<label class="quiz-option"><input type="radio" name="q7" value="1"> 用 `docker commit` 把容器保存成镜像</label>
<label class="quiz-option"><input type="radio" name="q7" value="2"> 把数据写到容器内的 /tmp 目录</label>
<label class="quiz-option"><input type="radio" name="q7" value="3"> 给容器加大内存限制</label>
</div>
<div class="quiz-explanation">💡 容器本身是"用完即弃"的，数据要落在数据卷（volume）或宿主机目录上，才能不随容器删除而丢失</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">`docker ps` 和 `docker ps -a` 的区别是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q8" value="0"> -a 只显示已停止的容器</label>
<label class="quiz-option"><input type="radio" name="q8" value="1"> 两者输出完全相同</label>
<label class="quiz-option"><input type="radio" name="q8" value="2"> -a 显示所有宿主机上的容器</label>
<label class="quiz-option"><input type="radio" name="q8" value="3"> -a 显示运行中和已停止的全部容器</label>
</div>
<div class="quiz-explanation">💡 `docker ps` 只列运行中的容器，`docker ps -a` 连已退出的容器一起列出——排查"容器为什么起不来"时经常靠它看到退出状态</div>
</div>

<div class="quiz-item" data-correct="0">
<div class="quiz-question">对测试人员来说，Docker 最核心的价值是？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q9" value="0"> 一条命令拉起一致的测试环境，消除"我这儿能跑"</label>
<label class="quiz-option"><input type="radio" name="q9" value="1"> 可以替代全部自动化测试脚本</label>
<label class="quiz-option"><input type="radio" name="q9" value="2"> 让数据库不再需要备份</label>
<label class="quiz-option"><input type="radio" name="q9" value="3"> 直接提升接口的响应速度</label>
</div>
<div class="quiz-explanation">💡 Docker 解决的是**环境一致性**：把被测服务、数据库、中间件按同样的版本和配置拉起，环境问题不再干扰测试结论</div>
</div>

<div class="quiz-item" data-correct="2">
<div class="quiz-question">docker-compose 主要解决什么问题？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q10" value="0"> 在单个容器里安装多个软件</label>
<label class="quiz-option"><input type="radio" name="q10" value="1"> 把镜像压缩得更小</label>
<label class="quiz-option"><input type="radio" name="q10" value="2"> 用一个 YAML 文件编排多个容器服务的启动</label>
<label class="quiz-option"><input type="radio" name="q10" value="3"> 替代 Dockerfile 构建镜像</label>
</div>
<div class="quiz-explanation">💡 一个系统往往由应用、数据库、缓存等多个容器组成，Compose 用一份 YAML 描述并一键启停这一组服务</div>
</div>

<div class="quiz-item" data-correct="1">
<div class="quiz-question">`docker run -d` 中的 `-d` 表示？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q11" value="0"> 删除容器后自动清理数据</label>
<label class="quiz-option"><input type="radio" name="q11" value="1"> 后台（detached）运行</label>
<label class="quiz-option"><input type="radio" name="q11" value="2"> 以调试模式运行</label>
<label class="quiz-option"><input type="radio" name="q11" value="3"> 禁用容器网络</label>
</div>
<div class="quiz-explanation">💡 `-d` 让容器在后台运行并返回容器 ID；不加 `-d` 时终端会被容器占用</div>
</div>

<div class="quiz-item" data-correct="3">
<div class="quiz-question">容器起来了，但在宿主机上访问不到它提供的服务，最先应该排查？</div>
<div class="quiz-options">
<label class="quiz-option"><input type="radio" name="q12" value="0"> 宿主机的 CPU 占用率</label>
<label class="quiz-option"><input type="radio" name="q12" value="1"> 镜像的构建耗时</label>
<label class="quiz-option"><input type="radio" name="q12" value="2"> 容器名称是否符合命名规范</label>
<label class="quiz-option"><input type="radio" name="q12" value="3"> 是否配置了 `-p` 端口映射</label>
</div>
<div class="quiz-explanation">💡 没做端口映射时容器内服务正常，但宿主机无法访问。先看 `-p`，再看容器日志和服务自身是否监听正确</div>
</div>

<button class="quiz-submit">提交答案</button>
<div class="quiz-score"></div>

</div>

---

## 继续学习

完成测验后，建议继续学习：

- [Docker 容器教程](Docker容器教程-软件测试版.md) - 查看完整教程
- [章节练习与参考答案](../章节练习与参考答案.md) - 更多工具练习
- [持续集成测验](../持续集成/持续集成测验.md) - 检验 CI/CD 中的容器应用
