# Git 版本控制教程（软件测试人员专用）

> 本教程面向软件测试工程师，聚焦测试日常使用场景：拉取代码、提交自动化脚本、分支管理、协作流程、冲突解决。

---

## 前置要求

| 项目 | 要求 | 获取方式 |
|------|------|----------|
| Linux 基础命令 | 熟悉 cd、ls、cat、pwd 等基本目录和文件操作 | [Linux实用教程-软件测试版](../工具操作/Linux实用教程-软件测试版.md) |

---

## 新手导读

Git 对测试人员最重要的不是复杂命令，而是能安全地拉代码、看改动、提交自动化脚本、处理简单冲突。

第一遍先掌握：

1. `git clone`：把项目下载到本地。
2. `git status`：查看当前改动。
3. `git diff`：看具体改了什么。
4. `git add`、`git commit`、`git push`：提交自己的修改。
5. `git pull`：同步远程更新。

遇到冲突不要慌，先看冲突文件内容，再决定保留哪一段。不要随便执行 `reset --hard`，它会丢失本地改动。

---
## 1、Git 基础

### 1.1 测试人员为什么要学 Git

| 场景 | 用途 |
|------|------|
| 拉取项目代码 | 看代码定位 Bug、了解实现 |
| 提交自动化脚本 | 测试代码版本管理 |
| 查看代码变更 | 了解本次改动范围、判断回归点 |
| 协作开发 | 与团队成员同步代码 |
| 回滚版本 | 发现问题快速回退 |
| 代码评审 | Review 开发提交 |

### 1.2 版本控制是什么

**版本控制（Version Control）：** 记录文件变化历史，便于查看、协作、回滚。

```
版本 1 → 版本 2 → 版本 3 → ... → 当前版本
                                   ↓
                              可以回到任意版本
```

### 1.3 Git vs SVN

| 维度 | Git | SVN |
|------|-----|-----|
| 类型 | 分布式 | 集中式 |
| 离线工作 | 支持 | 不支持 |
| 速度 | 快 | 慢 |
| 分支 | 轻量、易切 | 重、慢 |
| 学习曲线 | 较陡 | 平缓 |
| 主流程度 | 绝对主流 | 衰落 |

!!! abstract "核心概念"
    Git 是目前事实标准，99% 的公司在用。

### 1.4 核心概念

```
工作区（Working Directory）
       ↓ git add
暂存区（Staging Area / Index）
       ↓ git commit
本地仓库（Local Repository）
       ↓ git push          ↑ git pull
远程仓库（Remote Repository）
```

- **工作区**：你看到的文件目录
- **暂存区**：准备提交的快照
- **本地仓库**：本地的 `.git` 目录
- **远程仓库**：GitHub/GitLab/Gitee 等服务器

---

## 2、安装与配置

### 2.1 安装

**Windows：** 官网下载 `https://git-scm.com/`，安装时全部默认即可（含 Git Bash 终端）

**Mac：** `brew install git`

**Linux：**
```bash
# Ubuntu
sudo apt install git

# CentOS
sudo yum install git
```

**验证：**

```bash
git --version
```

### 2.2 初始配置

第一次使用 Git 必须配置用户信息（提交时使用）：

```bash
# 全局配置
git config --global user.name "张三"
git config --global user.email "zhangsan@company.com"

# 查看配置
git config --list
# 输出示例：
# user.name=张三
# user.email=zhangsan@company.com
# core.repositoryformatversion=0
# core.filemode=true
# core.quotepath=false

git config user.name
# 输出：张三

# 配置编辑器（可选）
git config --global core.editor "vim"

# 中文文件名不转码
git config --global core.quotepath false

# 命令缩写（可选，方便）
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
# 之后可用 git st 代替 git status
```

### 2.3 SSH 密钥配置（推荐）

避免每次推送都输密码：

```bash
# 1. 生成密钥（一路回车，推荐 ed25519，安全且短小）
ssh-keygen -t ed25519 -C "zhangsan@company.com"
# 老系统不支持 ed25519 时再回退到 rsa：
# ssh-keygen -t rsa -b 4096 -C "zhangsan@company.com"

# 2. 查看公钥
cat ~/.ssh/id_ed25519.pub
# Windows Git Bash 路径：~/.ssh/id_ed25519.pub
# 如果用的是 rsa：cat ~/.ssh/id_rsa.pub

# 3. 复制公钥内容

# 4. 粘贴到平台（注意 ed25519 用 id_ed25519.pub）
# GitHub: Settings → SSH and GPG keys → New SSH key
# GitLab: 头像 → Preferences → SSH Keys
# Gitee: 设置 → 安全设置 → SSH 公钥

# 5. 验证
ssh -T git@github.com
```

### 2.4 GUI 客户端推荐

| 客户端 | 平台 | 特点 |
|--------|------|------|
| **Sourcetree** | 全平台 | 免费功能全 |
| **GitKraken** | 全平台 | 界面美观，部分收费 |
| **TortoiseGit** | Windows | 集成右键菜单 |
| **GitHub Desktop** | 全平台 | 官方，简洁 |
| **VSCode 内置** | 全平台 | 编辑器直接用 |
| **IDEA / PyCharm 内置** | 全平台 | JetBrains 系列内置 |

!!! tip "建议"
    测试人员从命令行学起，配 IDE/编辑器内置 Git 使用足够。

---

## 3、基础命令

### 3.1 初始化与克隆

```bash
# 方式 1：初始化一个新仓库
mkdir myproject
cd myproject
git init
# 当前目录变为 Git 仓库

# 方式 2：克隆已有仓库（最常用）
git clone https://github.com/user/repo.git
git clone git@github.com:user/repo.git    # SSH
git clone https://github.com/user/repo.git mydir  # 克隆到指定目录
git clone -b dev https://github.com/user/repo.git  # 克隆指定分支
```

`git clone` 输出示例：

```
Cloning into 'repo'...
remote: Enumerating objects: 1523, done.
remote: Counting objects: 100% (1523/1523), done.
remote: Compressing objects: 100% (876/876), done.
Receiving objects: 100% (1523/1523), 3.25 MiB | 2.10 MiB/s, done.
Resolving deltas: 100% (612/612), done.
```

### 3.2 查看状态

```bash
# 查看工作区状态（最常用）
git status

# 简洁版
git status -s
```

输出示例：

```
M  modified.py        ← 修改未暂存
A  new.py             ← 新增已暂存
D  deleted.py         ← 删除
?? untracked.py       ← 未追踪（新文件）
```

### 3.3 添加到暂存区

```bash
# 添加单文件
git add file.py

# 添加多个
git add file1.py file2.py

# 添加目录
git add testcases/

# 添加所有变更（含新增、修改、删除）
git add .
git add -A          # 等价

# 交互式添加（高级）
git add -p
```

### 3.4 提交

```bash
# 提交（会打开编辑器）
git commit

# 提交并写信息（推荐）
git commit -m "添加登录接口测试用例"

# 跳过暂存区直接提交修改文件
git commit -am "修改用例数据"

# 修改最近一次提交（增改信息或追加变更）
git add forgot.py
git commit --amend
```

**提交信息规范（推荐）：**

```
<类型>: <简短描述>

[可选的详细描述]

类型：
- feat: 新功能
- fix: 修复 Bug
- test: 添加/修改测试
- docs: 文档
- refactor: 重构
- chore: 杂项（构建、配置）
- style: 格式（不影响代码）

示例：
test: 添加订单创建接口的边界值测试用例
fix: 修复登录用例中 token 未传递的问题
docs: 更新 README 安装说明
```

### 3.5 查看历史

```bash
# 完整日志
git log

# 简洁单行
git log --oneline
# 输出示例：
# a1b2c3d test: 添加订单创建接口的测试用例
# e4f5g6h fix: 修复登录用例中 token 未传递的问题
# i7j8k9l docs: 更新 README 安装说明
# m0n1o2p feat: 初始项目结构

# 图形化
git log --graph --oneline --all --decorate

# 最近 N 条
git log -5
git log -n 5

# 按作者
git log --author="张三"

# 按时间
git log --since="2026-06-01" --until="2026-06-07"

# 按关键字
git log --grep="登录"

# 查看某文件历史
git log file.py
git log -p file.py     # 含每次差异
```

### 3.6 查看差异

```bash
# 工作区 vs 暂存区
git diff
# 输出示例：
# diff --git a/testcases/test_login.py b/testcases/test_login.py
# index 1a2b3c4..5d6e7f8 100644
# --- a/testcases/test_login.py
# +++ b/testcases/test_login.py
# @@ -10,6 +10,8 @@ def test_login_success():
#      response = login_api.post("/login", data)
#      assert response.status_code == 200
# +    assert response.json()["token"] is not None
# +    assert response.json()["expires_in"] > 0

# 暂存区 vs 上次提交
git diff --staged
git diff --cached      # 等价

# 工作区 vs 上次提交
git diff HEAD

# 两个提交之间
git diff commit1 commit2

# 两个分支之间
git diff main..dev

# 看某文件的差异
git diff file.py
```

### 3.7 删除文件

```bash
# 从 Git 和文件系统都删除
git rm file.py
git commit -m "删除废弃文件"

# 仅从 Git 删除，保留文件
git rm --cached file.py

# 文件已用 rm 删除，告诉 Git
rm file.py
git rm file.py
# 或
git add -A      # 自动识别删除
```

### 3.8 重命名/移动

```bash
git mv old.py new.py
# 等价于：
# mv old.py new.py
# git rm old.py
# git add new.py
```

---

## 4、分支管理

### 4.1 分支是什么

**分支** 让多人并行开发，互不干扰。

```
              ┌── feature/login  ──┐
main ────────┤                     ├──── 合并回 main
              └── feature/order  ──┘
```

### 4.2 分支基础操作

```bash
# 查看分支
git branch              # 本地分支
# 输出示例：
#   develop
#   feature/login
# * main                  ← 当前分支

git branch -r           # 远程分支
# 输出示例：
#   origin/HEAD -> origin/main
#   origin/develop
#   origin/feature/login
#   origin/main

git branch -a           # 所有分支

# 创建分支
git branch feature/new-test

# 切换分支
git checkout feature/new-test
git switch feature/new-test    # 新命令（Git 2.23+）

# 创建并切换
git checkout -b feature/new-test
git switch -c feature/new-test

# 删除分支
git branch -d feature/old      # 安全删除（未合并会拒绝）
git branch -D feature/old      # 强制删除

# 重命名分支
git branch -m old-name new-name
```

### 4.3 合并分支

```bash
# 当前在 main，把 dev 合并进来
git checkout main
git merge dev
# 输出示例（快进合并）：
# Updating 4a5b6c7..8d9e0f1
# Fast-forward
#  testcases/test_order.py | 45 +++++++++++++++++++++++++++++++++++++++++++++
#  1 file changed, 45 insertions(+)

# 合并时不快进（保留分支历史）
git merge --no-ff dev
```

**Fast-Forward vs No-Fast-Forward：**

```
快进合并（默认，无分叉时）：
  main ── A ── B          →  main ── A ── B ── C ── D
              \                                    
               C ── D                              

非快进合并（--no-ff，保留分支信息）：
  main ── A ── B ─────────── M
              \             /
               C ── D ──────
```

### 4.4 Rebase（变基）

把当前分支的提交"嫁接"到目标分支末端。

```bash
git checkout feature
git rebase main
```

**Rebase vs Merge：**

```
Merge（保留分叉，产生 Merge Commit）：
  A ── B ───────── M
       \         /
        C ── D ──

Rebase（变成直线，更清爽）：
  A ── B ── C' ── D'
```

!!! warning "测试人员注意"
    rebase 会改写提交历史，已 push 到共享分支的提交不要 rebase。

### 4.5 分支合并策略

| 场景 | 推荐 |
|------|------|
| 个人功能分支合到主干 | merge --no-ff（保留功能边界） |
| 主干更新合到功能分支 | rebase（保持线性） |
| 合并 PR | 通常使用 squash merge |
| 长期开发分支 | 定期 rebase 主干，减少冲突 |

---

## 5、远程仓库

### 5.1 关联远程仓库

```bash
# 查看已关联的远程仓库
git remote -v
# 输出示例：
# origin  https://github.com/user/repo.git (fetch)
# origin  https://github.com/user/repo.git (push)

# 添加远程仓库
git remote add origin https://github.com/user/repo.git

# 修改远程地址
git remote set-url origin git@github.com:user/repo.git

# 删除远程
git remote remove origin

# 重命名远程
git remote rename origin upstream
```

!!! tip "提示"
    `origin` 是远程仓库的默认名字，可以改成任何名字。

### 5.2 推送（Push）

```bash
# 推送当前分支
git push origin main

# 首次推送，关联本地与远程分支
git push -u origin main
# 之后 git push 即可

# 推送所有分支
git push --all

# 推送标签
git push --tags

# 强制推送（危险！）
git push --force
git push -f
```

!!! danger "危险"
    强制推送会覆盖远程历史，可能让协作者代码丢失。禁止对 main/master 强制推送。

### 5.3 拉取（Pull / Fetch）

```bash
# fetch：仅下载远程，不合并
git fetch origin
git fetch origin main

# pull：fetch + merge
git pull origin main

# pull with rebase
git pull --rebase origin main
```

**Fetch vs Pull：**

- `fetch`：安全，只更新本地的远程引用，不动你的工作分支
- `pull`：等价于 `fetch + merge`，可能产生冲突

**推荐工作流：**

```bash
# 1. 先 fetch 看看远程有啥新内容
git fetch origin

# 2. 看差异
git log HEAD..origin/main --oneline

# 3. 确认后合并
git merge origin/main
```

### 5.4 分支推送/拉取

```bash
# 推送本地分支到远程
git push origin feature/test

# 推送本地分支到远程不同名分支
git push origin feature/test:feature/test-v2

# 关联本地与远程分支
git branch --set-upstream-to=origin/dev dev

# 删除远程分支
git push origin --delete feature/old
git push origin :feature/old      # 等价

# 拉取远程分支到本地
git checkout -b dev origin/dev
git checkout --track origin/dev
```

### 5.5 同步上游仓库（fork 场景）

```bash
# 添加上游
git remote add upstream https://github.com/original/repo.git

# 拉上游更新
git fetch upstream
git merge upstream/main

# 推到自己 fork
git push origin main
```

---

## 6、冲突解决

### 6.1 什么时候有冲突

两个分支修改了**同一文件的同一位置**，Git 无法自动合并。

```bash
git merge dev
# 输出：
# Auto-merging file.py
# CONFLICT (content): Merge conflict in file.py
# Automatic merge failed; fix conflicts and then commit the result.
```

### 6.2 冲突标记

打开冲突文件，会看到：

```python
def login():
<<<<<<< HEAD
    # 当前分支的版本
    return "Login from main"
=======
    # 要合并进来的版本
    return "Login from dev"
>>>>>>> dev
```

### 6.3 解决步骤

```bash
# 1. 查看冲突文件
git status

# 2. 打开文件，手动编辑
# 删除 <<<<<<<、=======、>>>>>>> 标记
# 保留你想要的内容（可能两边都要、也可能选一边）

# 3. 标记为已解决
git add file.py

# 4. 完成合并
git commit
# 自动生成 Merge Commit 信息

# 中途想放弃合并
git merge --abort
```

### 6.4 冲突解决示例

修改前：

```python
<<<<<<< HEAD
def login(username, password):
    return api.post("/login", {"u": username, "p": password})
=======
def login(username, password, captcha=None):
    return api.post("/login", {"username": username, "password": password, "captcha": captcha})
>>>>>>> dev
```

修改后（保留两边能力，合并）：

```python
def login(username, password, captcha=None):
    return api.post("/login", {"username": username, "password": password, "captcha": captcha})
```

### 6.5 使用工具解决

```bash
# 配置图形化合并工具
git config --global merge.tool vscode

# 启动工具
git mergetool
```

VSCode、PyCharm、Sourcetree 都内置可视化冲突解决界面。

### 6.6 预防冲突

1. **频繁同步主干**：每天 pull 主干
2. **小步提交**：变更小，冲突范围小
3. **分支生命周期短**：功能分支不要存在太久
4. **明确分工**：避免多人改同一文件
5. **沟通先行**：大改前先告知团队

---

## 7、撤销与回滚

### 7.1 撤销工作区修改

```bash
# 撤销单个文件的工作区修改（恢复到上次提交状态）
git checkout -- file.py
git restore file.py        # 新命令

# 撤销所有工作区修改
git checkout -- .
git restore .
```

!!! danger "危险"
    会丢失修改内容，不可恢复。

### 7.2 撤销暂存区

```bash
# 取消暂存（保留工作区修改）
git reset HEAD file.py
git restore --staged file.py    # 新命令

# 取消所有暂存
git reset HEAD
```

### 7.3 撤销提交

```bash
# 撤销最近一次提交，保留修改在暂存区
git reset --soft HEAD~1

# 撤销最近一次提交，保留修改在工作区（暂存区清空）
git reset --mixed HEAD~1
git reset HEAD~1            # 等价（--mixed 是默认）

# 撤销最近一次提交，丢弃所有修改（危险！）
git reset --hard HEAD~1
```

### 7.4 reset vs revert

**reset：** 移动 HEAD 指针，改写历史（仅适合本地）

```
原始：A ── B ── C ── D（HEAD）

git reset --hard B：
A ── B（HEAD）   ← C 和 D 被丢弃
```

**revert：** 创建新提交来"反向"撤销（适合已 push 的提交）

```
原始：A ── B ── C ── D（HEAD）

git revert C：
A ── B ── C ── D ── E（HEAD，E 是反 C 的提交）
```

```bash
# 反向某次提交
git revert <commit-hash>

# 反向最近一次
git revert HEAD
```

### 7.5 找回丢失的提交（reflog）

```bash
# 查看所有 HEAD 移动历史
git reflog

# 输出：
# 12ab34c HEAD@{0}: reset: moving to HEAD~1
# 89de56f HEAD@{1}: commit: 添加用例
# ...

# 恢复到某状态
git reset --hard HEAD@{1}
git reset --hard 89de56f
```

!!! tip "救命的命令"
    reset --hard 之后只要 30 天内通过 reflog 还能找回。

### 7.6 暂存修改（stash）

工作未完成但要切分支时使用。

```bash
# 暂存当前修改
git stash
git stash save "调试登录用例"

# 查看暂存列表
git stash list
# 输出示例：
# stash@{0}: On feature/login: 调试登录用例
# stash@{1}: On main: WIP on test_user.py

# 应用最近的暂存
git stash apply
git stash pop        # apply + drop

# 应用指定暂存
git stash apply stash@{1}

# 删除暂存
git stash drop
git stash drop stash@{1}

# 清空所有暂存
git stash clear
```

---

## 8、协作流程

### 8.1 Git Flow（经典分支模型）

```
main         ─────●─────●─────●  长期稳定，对应生产
                  │     │     │
release        ───┴──●  │     │  发布准备
                     │  │     │
develop      ────────●──●──●──●  开发主干
                     │  │  │  
feature/login    ────●  │  │     功能分支
feature/order       ────●  │
hotfix/critical             ●    紧急修复
```

| 分支 | 用途 |
|------|------|
| `main / master` | 生产环境，每次合入要打 tag |
| `develop` | 开发主干 |
| `feature/*` | 新功能 |
| `release/*` | 发布准备 |
| `hotfix/*` | 紧急修复 |

**适合：** 中大型团队、版本化发布的项目。

### 8.2 GitHub Flow（简化）

```
main ──●──●──●──●──●  生产分支
       │  │  │  │  │
feature ●──●──●  │  │  分支开发 → PR → review → merge
              feature2  ●──●
```

流程：
1. 从 main 拉功能分支
2. 开发 + 提交
3. 推到远程开 PR
4. Code Review
5. 合并到 main
6. 自动部署

**适合：** Web 项目、持续部署。

### 8.3 测试人员典型工作流

**场景：维护接口自动化测试代码**

```bash
# 1. 早上开始工作，同步主干
git checkout main
git pull origin main

# 2. 新任务，拉个分支
git checkout -b feature/add-order-test

# 3. 写代码
# ...编辑文件...

# 4. 看看改了啥
git status
git diff

# 5. 提交
git add testcases/test_order.py data/order_data.yaml
git commit -m "test: 添加订单创建接口的测试用例"

# 6. 推到远程
git push -u origin feature/add-order-test

# 7. 在 GitLab/GitHub 开 Merge Request / Pull Request

# 8. 评审通过后合并 → 删除本地分支
git checkout main
git pull
git branch -d feature/add-order-test
```

### 8.4 代码评审（Code Review）

测试人员可能要 Review 别人的代码或被 Review。

**Review 要看什么：**

- 用例是否覆盖完整
- 断言是否合理
- 代码是否可读、可维护
- 是否有硬编码（账号、URL）
- 是否有冗余、可复用代码
- 是否有破坏现有用例

### 8.5 .gitignore 文件

排除不需要提交的文件：

```bash
# .gitignore 示例
__pycache__/
*.pyc
*.pyo
.idea/
.vscode/
venv/
.env
.DS_Store

# 日志和报告
logs/
reports/
*.log
allure-results/

# 敏感信息
config/secret.yaml
.env.local
```

!!! warning "常见误区"
    测试人员常犯错误：把测试报告、日志、配置文件（含密码）提交了，污染仓库。

---

## 9、常用平台使用

### 9.1 GitHub

**核心概念：**

- **Repository（仓库）**：代码项目
- **Fork**：复制别人的仓库到自己账号
- **Pull Request（PR）**：申请合并
- **Issue**：问题/需求追踪
- **Actions**：CI/CD 自动化

### 9.2 GitLab

国内企业用得多，功能与 GitHub 类似：

- **Project**：项目
- **Merge Request（MR）**：等同于 PR
- **CI/CD Pipeline**：内置流水线

### 9.3 Gitee（国内）

国产 Git 平台，速度快，企业版本本地化。

### 9.4 Pull Request / Merge Request 流程

```
1. fork 仓库（或在分支上开发）
2. 创建分支
3. 提交代码 + push
4. 在平台上点 "New Pull Request"
5. 填写：
   - 标题
   - 描述（做了什么、为什么、怎么测）
   - 关联 Issue
   - 指定 Reviewer
6. 等待 Review
7. 根据评论修改
8. 合并
9. 删除分支
```

**PR 描述模板：**

```markdown
## 变更内容
- 添加订单创建接口的 10 条测试用例
- 修复登录用例中 token 未传递的问题

## 影响范围
- testcases/test_order.py（新增）
- data/order_data.yaml（新增）
- apis/login_api.py（修改）

## 测试
- [x] 本地执行通过
- [x] CI 流水线通过
- [x] 关联 Jira：TEST-123
```

---

## 10、测试场景实战

### 10.1 场景一：克隆项目并跑自动化

```bash
# 1. 克隆
git clone git@gitlab.company.com:test/api-automation.git
cd api-automation

# 2. 看主要分支
git branch -a

# 3. 切到测试分支
git checkout dev

# 4. 安装依赖（项目相关）
pip install -r requirements.txt

# 5. 跑测试
pytest

# 6. 之后每天同步更新
git pull
```

### 10.2 场景二：贡献新用例

```bash
# 1. 拉最新主干
git checkout main && git pull

# 2. 拉功能分支
git checkout -b feature/test-payment

# 3. 写代码 + 验证
# 编辑 testcases/test_payment.py
pytest testcases/test_payment.py

# 4. 提交
git add testcases/test_payment.py data/payment_data.yaml
git commit -m "test: 添加支付接口测试用例（10 条）"

# 5. 推送
git push -u origin feature/test-payment

# 6. 在 GitLab 开 MR
```

### 10.3 场景三：紧急修复线上 Bug

```bash
# 1. 从主干拉 hotfix 分支
git checkout main && git pull
git checkout -b hotfix/critical-fix

# 2. 修复
# ...编辑文件...

# 3. 提交
git commit -am "fix: 修复登录接口偶发 500 错误"

# 4. 推送 + 合并
git push -u origin hotfix/critical-fix
# 创建 MR，加急 review + merge
```

### 10.4 场景四：撤回错误提交

**情况 1：刚 commit，还没 push**

```bash
# 撤回最后一次提交，修改后重提
git reset --soft HEAD~1
# 修改文件
git commit -m "正确的信息"
```

**情况 2：已 push，但 main 分支**

```bash
# 用 revert，不要 reset（会破坏历史）
git revert HEAD
git push
```

**情况 3：误提交了敏感信息（密码/Token）**

```bash
# 1. 修改文件移除敏感信息
# 2. 提交修复
git commit -m "remove sensitive data"
git push
# 3. ⚠️ 立即修改密码/重置 Token，因为历史中仍然有
# 4. 如必须从历史移除，需用 git filter-repo（高级）
```

### 10.5 场景五：解决冲突

```bash
# 1. 拉主干更新到我的分支
git checkout feature/my-test
git pull origin main

# 输出冲突：
# CONFLICT (content): Merge conflict in testcases/test_user.py

# 2. 查看冲突文件
git status

# 3. 打开 testcases/test_user.py，找到 <<<<<<<
# 4. 手动合并保留正确版本
# 5. 标记解决
git add testcases/test_user.py

# 6. 完成 merge
git commit -m "merge: resolve conflict in test_user.py"

# 7. 推送
git push
```

### 10.6 场景六：协作约定

**团队约定（建议）：**

| 项 | 规则 |
|----|------|
| 主干分支 | 不直接 push，必须经过 MR |
| 分支命名 | `feature/` `bugfix/` `hotfix/` 前缀 |
| 提交信息 | `<类型>: <描述>` 格式 |
| 评审 | 至少 1 人通过才能合并 |
| 单 MR 大小 | < 500 行变更 |
| 合并方式 | Squash merge（保持历史清爽） |

---

## 11、常见问题排查

### 11.1 push 被拒绝

```
error: failed to push some refs to 'origin'
hint: Updates were rejected because the remote contains work that you do not have locally
```

**原因：** 远程有新提交，本地落后。

**解决：**

```bash
git pull --rebase    # 拉取并 rebase
# 或
git pull            # 拉取并 merge
# 解决可能的冲突后
git push
```

### 11.2 想撤销 git add

```bash
git reset HEAD file.py
git restore --staged file.py    # 等价
```

### 11.3 误用 git reset --hard 丢失代码

```bash
# 立即看 reflog
git reflog

# 找到丢失前的 commit hash
# 恢复
git reset --hard <hash>
```

### 11.4 中文文件名乱码

```bash
git config --global core.quotepath false
```

### 11.5 仓库太大，clone 太慢

```bash
# 浅克隆，只拉最近 1 次提交
git clone --depth 1 <url>

# 只克隆指定分支
git clone --branch dev --single-branch <url>
```

### 11.6 误把大文件提交了

```bash
# 用 BFG 或 git filter-repo 工具清理历史
# （操作复杂，建议找有经验的人协助）

# 防止再次发生，写好 .gitignore
```

### 11.7 不小心提交到错误分支

```bash
# 假设在 main 提交了应该在 dev 的内容
git log --oneline       # 找到 commit hash

# 切到 dev，cherry-pick 过去
git checkout dev
git cherry-pick <hash>

# 回到 main，撤销
git checkout main
git reset --hard HEAD~1     # 或 revert
```

### 11.8 远程分支已删除，本地还显示

```bash
git fetch --prune
# 或
git remote prune origin
```

### 11.9 看不懂提交记录是谁改的

```bash
# 看每行最后修改者
git blame file.py
git blame -L 10,20 file.py    # 看 10-20 行
```

### 11.10 想看某个时间点的代码

```bash
# 切到某个提交
git checkout <hash>

# 看完再回来
git checkout main
```

---

## 12、最佳实践与速查

### 12.1 提交规范

✅ 推荐：

- 一次提交只做一件事
- 提交信息清晰描述意图
- 避免 `update` `fix bug` 这种含糊信息
- 不提交临时调试代码

❌ 避免：

- 一次提交几十个文件、几千行
- 提交未测试通过的代码
- 直接 push 到主干

### 12.2 安全准则

- ⚠️ **不要提交密码、Token、私钥**
- ⚠️ **不要 force push 共享分支**
- ⚠️ **不要 git reset --hard 已 push 的提交**
- ⚠️ **重要操作前 backup 分支**

```bash
# 操作前备份
git branch backup-before-rebase
```

### 12.3 常用命令速查

```bash
# 日常
git status              # 看状态
git add .               # 加全部
git commit -m "xxx"     # 提交
git push                # 推送
git pull                # 拉取
git log --oneline       # 看日志

# 分支
git branch              # 看分支
git checkout -b xxx     # 创建并切换
git checkout main       # 切换
git merge dev           # 合并
git branch -d xxx       # 删除

# 撤销
git checkout -- file    # 撤销工作区
git reset HEAD file     # 撤销暂存
git reset HEAD~1        # 撤销提交
git revert HEAD         # 反向提交

# 应急
git stash               # 暂存
git stash pop           # 恢复
git reflog              # 救命日志

# 远程
git remote -v           # 看远程
git fetch               # 仅下载
git pull --rebase       # 拉取 + rebase
```

### 12.4 推荐学习资源

- **官方教程**：`https://git-scm.com/book/zh/v2`（免费中文）
- **可视化学习**：`https://learngitbranching.js.org/?locale=zh_CN`
- **速查表**：`https://education.github.com/git-cheat-sheet-education.pdf`
- **GitHub Skills**：`https://skills.github.com/`

---

!!! warning "测试纪律"
    提交代码前自检：1) 没有密码、Token 等敏感信息；2) 没有大文件（>10MB）；3) 没有临时文件、日志、报告；4) 提交信息清晰；5) 本地测试通过。涉及主干分支的操作三思而后行。
