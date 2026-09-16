---
description: Git 版本控制教程，分支管理、冲突解决和协作流程。
---
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

避免每次推送都输密码。SSH 密钥是一对文件：私钥（留给自己，不能泄露）和公钥（上传到 GitHub/GitLab）。推送代码时用私钥证明身份，不需要输密码。

```bash
# 1. 生成密钥（一路回车即可。-t 指定算法，-C 是备注通常写邮箱）
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
| 参数 | 含义 |
| -- | -- |
| `--graph` | 用 ASCII 图形显示分支合并关系 |
| `--oneline` | 每个 commit 只显示一行（简略） |
| `--all` | 显示所有分支（不只是当前分支） |
| `--decorate` | 显示 commit 关联的分支/tag 名称 |

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

把当前分支的提交"重放"到目标分支末端，让提交历史变成一条直线。适合功能分支落后于主干时追赶进度，但**不要对已推送到共享分支的提交 rebase**（会改写历史）。

```bash
git checkout feature
git rebase main
```

> **`git rebase` 参数说明：**
>
> | 参数 | 含义 |
> |------|------|
> | `checkout feature` | 切换到功能分支（rebase 操作的对象是当前分支） |
> | `rebase main` | 将当前分支的提交"重放"到 main 分支末端，形成线性历史 |

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
> **`本地分支:远程分支` 语法：** 冒号左边是本地分支名，右边是推送到远程后的分支名。如果不加 `:远程名`，则远程分支名与本地相同。常用于重命名远程分支或推送本地分支到不同名称的远程分支。

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

工作未完成但要切分支时使用。`git stash` 把未提交的修改临时"藏起来"，工作区恢复干净。之后用 `git stash pop` 取回。就像把桌上的草稿放进抽屉，腾出空间做别的事。

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

> **`git filter-repo` 是什么？** 专门用来改写 Git 历史的工具（比如删除某个文件、替换敏感信息）。比 `git filter-branch` 更安全、更快。使用前需安装：`pip install git-filter-repo`。

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

> **代码块命令说明：**
>
> | 命令 | 含义 |
> |------|------|
> | `git log --oneline` | 以简略格式查看提交历史（每行一个 commit） |
> | `git cherry-pick <hash>` | 把指定 commit 的改动"摘"到当前分支（不带历史） |
> | `git reset --hard HEAD~1` | 回退一个 commit，工作区也一起还原（`--hard` 会丢弃修改） |

> **`cherry-pick` 是什么？** 把某个提交"摘下来"放到当前分支。就像从树上摘樱桃，只挑那个特定的提交，不管它原来在哪个分支。

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

## 动手任务：用提交历史定位"测试被悄悄关掉"的元凶

> 这是本教程的收尾练习。请**独立完成**，不要先看参考答案。目标不是"把命令敲一遍"，而是**用 Git 证明你的判断**。

### 任务背景

你负责的订单接口自动化项目，上周 CI 还是全绿的。这周一开始，流水线"通过了"，但你隐约觉得不对——**订单创建用例失败时不再报警了**，构建照样是绿色。同事说"我没动过你的用例"。

你需要用 Git 回答三个问题：**是哪个提交、哪个人、什么时候**让这条用例失去了断言能力；这个改动是操作失误，还是团队流程本身留了口子；以及怎么改，才能让同类问题不再发生。

### 任务数据

在临时目录里复现这个仓库（所有时间戳都用 `GIT_AUTHOR_DATE` 固定，保证你看到的结果和我写的完全一致）：

```bash
mkdir /tmp/git-task && cd /tmp/git-task
git init -b main
git config user.name "task"
git config user.email "task@example.com"
mkdir testcases config
```

提交历史如下（**6 次提交，全部在 `main` 分支上，无合并**）：

```
* 556b3aa  2025-03-15 09:20  test: 补充订单取消用例的日志输出
* 065736d  2025-03-14 09:02  test: 调整接口超时时间到 30 秒
* 53b445a  2025-03-12 16:20  test: 新增订单取消用例
* edf8ef2  2025-03-11 10:40  test: 临时禁用订单创建用例
* dbaa8ab  2025-03-10 14:05  test: 调整订单创建接口断言
* 80930ee  2025-03-03 09:12  test: 初始化订单接口测试框架
```

各次提交涉及的文件：

| 提交 | 涉及文件 | 变更类型 |
|------|----------|----------|
| `80930ee` | `testcases/test_order.py`、`config/settings.py` | 新增 A |
| `dbaa8ab` | `testcases/test_order.py` | 修改 M |
| `edf8ef2` | `testcases/test_order.py` | 修改 M |
| `53b445a` | `testcases/test_order.py` | 修改 M |
| `065736d` | `config/settings.py` | 修改 M |
| `556b3aa` | `logs/pytest_20250315.log` | 新增 A |

`testcases/test_order.py` 在这 6 次提交中依次变成：

```python
# 80930ee（初始版本，断言 200）
def test_order_create():
    r = requests.post(f"{BASE_URL}/api/order/create", json={"sku": "A001", "num": 1})
    assert r.status_code == 200
```

```python
# dbaa8ab（断言从 200 改成 201，同一次提交只动了这一行）
def test_order_create():
    r = requests.post(f"{BASE_URL}/api/order/create", json={"sku": "A001", "num": 1})
    assert r.status_code == 201
```

```python
# edf8ef2（用例被整体注释掉，只留一个 pass）
def test_order_create():
    # TODO 暂时联调完再打开
    # r = requests.post(f"{BASE_URL}/api/order/create", json={"sku": "A001", "num": 1})
    # assert r.status_code == 201
    pass
```

```python
# 53b445a（新增了 cancel 用例，create 用例仍然是被注释的）
def test_order_create():
    # TODO 暂时联调完再打开
    # r = requests.post(f"{BASE_URL}/api/order/create", json={"sku": "A001", "num": 1})
    # assert r.status_code == 201
    pass

def test_order_cancel():
    r = requests.post(f"{BASE_URL}/api/order/cancel", json={"order_id": "10086"})
    assert r.status_code == 200
```

`config/settings.py` 的两次变更：

```python
# 80930ee:  timeout = 10   /  retry = 1
# 065736d:  timeout = 30   /  retry = 1        # TODO 联调后改成 3
```

`556b3aa` 新增了一个 `logs/pytest_20250315.log`，内容是两行 pytest 运行日志。

!!! info "不要真跑 pytest"
    这个仓库里没有可运行的被测系统，`requests` 也不是必须装的。本任务的全部结论都从 **Git 历史**里得出，不需要跑测试。

### 任务要求

请依次完成，并**保留每条命令和输出**：

1. 查看 `testcases/test_order.py` 这一个文件的完整变更历史（只列这一个文件，不要列出 `config/settings.py` 和 `logs/` 的提交）。找出：**哪个提交让 `test_order_create` 这条用例彻底失去了执行能力**（即：用例体里不再有任何真实发起请求并断言的语句），给出短 hash、作者、时间、提交信息。
2. 判断严重程度：这条用例被"关掉"之后，CI 里跑它会发生什么？请给出一个**具体的、可验证的结论**——例如"`pytest` 收集到的用例数从几个变成几个""失败会不会让构建变红"。然后说明为什么这个改动比 `dbaa8ab` 把断言从 `200` 改成 `201` **更危险**（提示：前者会让测试静默通过，后者会让测试失败——想想哪种更不容易被发现）。
3. 交叉验证你的判断，至少用两种互相独立的方法，且结论要指向同一个提交：
   - 用 `git log -S` 反查"哪次提交把 `assert r.status_code == 201` 这一行**消失**了"，并解释为什么 `-S '# assert ...'`（带注释符）和 `-S 'assert ...'`（不带注释符）返回的提交不一样；
   - 用 `git blame -L` 直接归因到具体行，确认注释行和 `pass` 行都指向同一个提交。
4. 给出可复用的产出：
   - 一条能放进团队规范、**用于 CI 前置检查**的 Git 命令：检出"最近 N 个提交里，有没有把测试函数体注释掉的改动"（提示：`git log -G` 配合正则）；
   - 一份 `.gitignore` 片段，解决 `556b3aa` 引入的 `logs/` 被跟踪问题，并写出把它们从索引里摘掉、但不删磁盘文件的命令。

### 提交物

| 产出 | 要求 |
|------|------|
| 定位命令 | 第 1 题中"只看单个文件历史 + 找出让用例失效的提交"的完整命令与输出 |
| 归因命令 | 第 3 题中 `-S` 反查和 `blame -L` 归因的完整命令与输出 |
| CI 检查命令 | 第 4 题中能放进团队规范的一条命令，须自带说明注释 |
| `.gitignore` 片段 + 清理命令 | 要求该清理命令不删除磁盘上的日志文件（要能证明：清理后文件仍在） |
| 结论 | 用 3-5 句话说明：是操作失误还是流程缺陷，影响范围多大，建议怎么改 |

### 完成标准

- [ ] 能说出让用例失效的提交是 `edf8ef2`、作者、以及它发生在 `dbaa8ab` 之后、`53b445a` 之前
- [ ] 能说清楚 `git log -- <路径>` 会把路径过滤掉别的目录，并解释为什么 `556b3aa`（只动 `logs/`）不应该出现在该文件的变更历史里
- [ ] 结论里有具体证据（commit hash、时间、diff 内容）支撑
- [ ] 给出的 `.gitignore` 与清理命令能直接用到自己的自动化项目上，且不会误删本地日志
- [ ] CI 检查命令可以粘贴到 Jenkins / GitLab CI 的脚本步骤里直接跑

??? tip "参考答案与思路（先自己做完再看）"

    **第 1 题：只看这一个文件的历史，找到让用例失效的提交**

    ```bash
    # 只看 testcases/test_order.py 一个文件的变更历史
    git log --oneline -- testcases/test_order.py
    ```

    预期输出（**只有 4 条**，`065736d` 和 `556b3aa` 不该出现，因为它们没动这个文件）：

    ```
    53b445a test: 新增订单取消用例
    edf8ef2 test: 临时禁用订单创建用例
    dbaa8ab test: 调整订单创建接口断言
    80930ee test: 初始化订单接口测试框架
    ```

    想看作者和时间就加格式化参数：

    ```bash
    git log --format="%h %ad %an %s" --date=format:"%Y-%m-%d %H:%M" -- testcases/test_order.py
    ```

    ```
    53b445a 2025-03-12 16:20 task test: 新增订单取消用例
    edf8ef2 2025-03-11 10:40 task test: 临时禁用订单创建用例
    dbaa8ab 2025-03-10 14:05 task test: 调整订单创建接口断言
    80930ee 2025-03-03 09:12 task test: 初始化订单接口测试框架
    ```

    关键点在 `-- <路径>`：它把历史**限定在这一个文件**上。所以只改了 `logs/` 的 `556b3aa` 不会出现——很多人用 `git log` 看全仓库历史，再拿提交信息去猜，就会被无关提交干扰。

    再看候选提交里哪次改掉了用例体：

    ```bash
    # 看这一行内容的引入/删除点在哪儿
    git log -S 'assert r.status_code == 201' --oneline -- testcases/test_order.py
    # 输出：dbaa8ab test: 调整订单创建接口断言

    # 直接看 edf8ef2 干了什么
    git show edf8ef2 --format="%h %ad %an %s" --date=format:"%Y-%m-%d %H:%M" -- testcases/test_order.py
    ```

    ```
    edf8ef2 2025-03-11 10:40 task test: 临时禁用订单创建用例

    @@ -4,5 +4,7 @@ import requests
     def test_order_create():
    -    r = requests.post(f"{BASE_URL}/api/order/create", json={"sku": "A001", "num": 1})
    -    assert r.status_code == 201
    +    # TODO 暂时注释，等后端联调完再打开
    +    # r = requests.post(f"{BASE_URL}/api/order/create", json={"sku": "A001", "num": 1})
    +    # assert r.status_code == 201
    +    pass
    ```

    结论：**`edf8ef2`，作者 task，2025-03-11 10:40，提交信息"test: 临时禁用订单创建用例"**。提交信息本身还写着"临时"，说明作者认为这是权宜之计，但没有留下任何"什么时候恢复"的机制——这正是流程缺陷的起点。

    **第 2 题：严重程度——静默失效比断言写错危险得多**

    对比两次提交：

    | 提交 | 改动 | pytest 行为 | CI 结果 |
    |------|------|-------------|---------|
    | `dbaa8ab` | 断言 `200` → `201` | 用例**会被执行**，真发请求 | 只要真实接口返回非 201 就**变红**，立刻可见 |
    | `edf8ef2` | 用例体全部注释，只剩 `pass` | 函数还在，pytest 依然收集到它，但**什么都不做，直接判定通过** | **永远绿**，且没有任何提示 |

    这就是最要命的地方：`edf8ef2` 之后，`test_order_create` 变成一条**永远不会失败的空用例**。它还在用例清单里，还会出现在 pytest 的 `passed` 计数里（"6 passed"而不是"5 passed"），看上去覆盖没少。CI 是绿的，报告是绿的，人也就信了。

    而 `dbaa8ab` 虽然引入了错误断言，但它是**吵闹的失败**——下一次 CI 就会报红，改回去只是几秒钟的事。

    !!! note "一句话归纳"
        断言写错 = **故障信号变吵**，会被发现；把用例注释掉 = **故障信号被掐断**，不会被发现。测试代码里最危险的改动，永远是那些让"失败"变少、却不产生任何新抖动的改动。

    所以这个改动的影响范围不是"少了一条用例"，而是**订单创建这条最核心主流程的接口回归，从 2025-03-11 起彻底失去防线，且持续了 4 天以上无人察觉**。

    **第 3 题：交叉验证——`-S` 反查 + `blame` 归因**

    方法 A：用 `-S` 反查"哪次提交让这一行内容量发生了变化"。

    ```bash
    # 搜的是"内容字符串的增删"，不是"行是否被修改"
    git log -S 'assert r.status_code == 201' --oneline -- testcases/test_order.py
    # 输出：dbaa8ab  test: 调整订单创建接口断言
    ```

    这里有个**非常容易踩的坑**，必须理解清楚：

    ```bash
    # 带注释符：搜"这一整行被注释掉"这个字符串本身
    git log -S '# assert r.status_code == 201' --oneline -- testcases/test_order.py
    # 输出：edf8ef2  test: 临时禁用订单创建用例
    ```

    为什么两次结果不同？`git log -S<string>` 找的是**该字符串出现次数发生变化的提交**——注意是"字符串出现次数"，不是"这一行是否被改动"。`edf8ef2` 的实际 diff 是：

    ```
    -    assert r.status_code == 201
    +    # assert r.status_code == 201
    ```

    关键在于：被加上的新行 `    # assert r.status_code == 201` **本身仍然含有子串** `assert r.status_code == 201`。所以对这两个不同的搜索串：

    - `-S 'assert r.status_code == 201'`：`dbaa8ab` 引入它（出现次数 0 → 1）→ 命中；`edf8ef2` 删掉 1 次、又通过注释行加回 1 次，**净变化为 0 → 不命中**。所以这条命令找到的是"这行内容**诞生**在哪"，**不是**"这行内容什么时候被废掉"。
    - `-S '# assert r.status_code == 201'`：`edf8ef2` 让这个（带 `#` 的）字符串从 0 次变成 1 次 → 命中。这条才是指向"被注释掉"的那次提交。

    换句话说，**当改动方式是"给某行加前缀变成注释"时，搜索原字符串永远抓不到它**，因为子串还在。这是 `-S` 最反直觉的一处行为。

    !!! warning "这就是为什么不能只信一条命令"
        单独看 `-S 'assert r.status_code == 201'` 得到 `dbaa8ab`，很容易误判成"就是这次改坏的"。**`-S` 回答的是"某个字符串何时出现/消失"，不是"某段逻辑何时失效"**——必须结合 `git show` 看实际 diff 才能下结论。

    方法 B：用 `blame` 直接归因到具体行，交叉印证。

    ```bash
    git blame -L 7,10 --date=short testcases/test_order.py
    ```

    ```
    edf8ef2a (task 2025-03-11  7)     # TODO 暂时注释，等后端联调完再打开
    edf8ef2a (task 2025-03-11  8)     # r = requests.post(f"{BASE_URL}/api/order/create", json={"sku": "A001", "num": 1})
    edf8ef2a (task 2025-03-11  9)     # assert r.status_code == 201
    edf8ef2a (task 2025-03-11 10)     pass
    ```

    四条行（`TODO` 注释、被注释的请求、被注释的断言、`pass`）**全部指向 `edf8ef2`**，与方法 A 的第二个命令完全一致。两条独立路径同一个结论，可以定案。

    > `blame` 左侧 hash 前的 `^` 前缀表示"边界提交"（即该行的归属追溯到文件创建那一次提交），本例中受影响的行都不带 `^`，说明它们确实是 `edf8ef2` 改的。

    顺带一提：如果你用的是"能跑测试"的仓库，还可以用 `git bisect`——把最后一次 CI 全绿记为 `good`、当前记为 `bad`，`git bisect run pytest testcases/test_order.py` 会自动收敛到 `edf8ef2`。但**本例里 `bisect` 会失效**：`edf8ef2` 之后这条用例本身不报错了，`bisect` 会一路判定成 `good`，根本找不到那个"坏"提交。**这恰恰又是"静默失效"更危险的证据**——连自动化的历史二分工具都抓不到它。

    **第 4 题：可复用的产出**

    **产出 1：CI 前置检查——揪出"测试被注释掉"的提交**

    ```bash
    # 检查有没有提交在测试文件里新增了"被注释掉的真断言/真请求"
    # -G 匹配的是 diff 中被增删的行是否命中该正则，且默认是【行内搜索】（不要求整行相同）
    git log -G '^\s*#\s*(assert|r = requests\.)' \
      --oneline --perl-regexp --since="2025-03-01" \
      -- 'testcases/*.py' 'tests/*.py'
    ```

    预期输出（命中了把用例注释掉的那次提交）：

    ```
    edf8ef2 test: 临时禁用订单创建用例
    ```

    !!! warning "`--since` 会和本任务的固定日期打架"
        本任务的提交日期是**写死的 2025-03**（第 1 题用 `GIT_AUTHOR_DATE` 固定过）。所以：
        `--since="2025-03-01"` 能命中；而 `--since="90 days ago"` 是**相对今天**算的，等这 6 个提交"过期"之后这条命令会**静默返回空结果**——看起来像"没问题"，其实是什么都没查。把时间窗当作一个需要你自己按当前日期调整的参数来用；真实 CI 里提交总是近期的，用 `--since="90 days ago"` 没问题。

    说明三点，都很容易写错：

    - **正则用 `^\s*#\s*` 而不是 `^\+.*#`**。`-G` 的匹配对象是 diff 里**去掉 `+`/`-` 前缀之后的行内容**，不是在 diff 文本上做匹配，所以不需要（也不应该）去写 `^\+`。
    - **`assert` 要写在 `#` 之后**。这样匹配的是"行首就是注释符、注释里是断言/请求"的行，才能精准抓到"被注释掉的用例"，而不会误伤"本来就是说明性注释"的行。
    - **路径用 `'testcases/*.py'`**。Git 的 pathspec 默认**递归匹配任意深度**，`testcases/*.py` 已经能命中 `testcases/test_order.py`，也包含 `testcases/sub/x.py`；写成 `'testcases/**/*.py'` 在单层目录下是**空匹配**，命令会静默返回空结果——这个坑要特别当心。

    !!! note "为什么这里用 `-G` 而不是 `-S`"
        这正是第 3 题现象的延伸：本例中 `-S '# assert r.status_code == 201'` 恰好也能命中（因为它搜的就是"带 `#` 的新字符串"），但那种写法**把具体某一行内容写死进了命令**，换一个文件、换一行代码就失效。`-G` 用正则描述"什么形态的行算可疑"，才是能进 CI 的通用写法。

    把它放进 CI 的一个"软门禁"步骤（先只告警、不阻断），例如 GitLab CI：

    ```yaml
    test-guard:
      stage: test
      script:
        - |
          # 揪出"把测试用例注释掉"的提交
          PATTERN='^\s*#\s*(assert|r = requests\.)'
          HITS=$(git log -G "$PATTERN" --oneline --perl-regexp \
            --since="2025-03-01" -- 'testcases/*.py' 'tests/*.py' | wc -l)
          if [ "$HITS" -gt 0 ]; then
            echo "⚠️ 检测到 $HITS 个提交新增了被注释掉的断言，请确认是否为临时禁用："
            git log -G "$PATTERN" --format="%h %ad %an %s" --date=short \
              --perl-regexp --since="2025-03-01" -- 'testcases/*.py' 'tests/*.py'
            exit 1   # 想先软告警就把这行去掉
          fi
      allow_failure: true
    ```

    **产出 2：`.gitignore` 片段 + 摘除索引但不删文件**

    `556b3aa` 把 `logs/pytest_20250315.log` 提交进去了。先补 `.gitignore`：

    ```gitignore
    # 测试产物与临时文件
    __pycache__/
    *.py[cod]
    .pytest_cache/
    allure-results/
    allure-report/
    logs/
    *.log
    ```

    注意：**只加 `.gitignore` 不会让已经被跟踪的文件停止被跟踪**。`logs/pytest_20250315.log` 已经被 `556b3aa` 提交进版本库了，`.gitignore` 对它无效——必须显式把它从索引里摘掉：

    ```bash
    # 从索引中移除（--cached = 保留磁盘文件！）
    git rm -r --cached logs
    git add .gitignore
    git commit -m "chore: 忽略测试产物与日志目录"
    ```

    验证（关键：证明文件没被删掉）：

    ```bash
    git ls-files
    # .gitignore
    # config/settings.py
    # testcases/test_order.py
    #        ↑ logs/ 已不在版本库中

    ls logs/pytest_20250315.log
    # logs/pytest_20250315.log   ← 文件还在磁盘上

    # 之后再产生日志，git 就不再理会
    touch logs/pytest_20250316.log
    git status --short
    # （空输出 = 已被忽略）
    ```

    !!! danger "别漏了 `--cached`"
        直接写 `git rm -r logs`（不带 `--cached`）会**连磁盘上的日志一起删掉**——本地排查问题的日志就没了。这是这条命令最容易写错的地方。

    **最终结论（建议的作答方向）**

    这是**操作失误触发的流程缺陷**。`edf8ef2` 是个人图省事的临时改动（提交信息里"临时禁用"就是自证），但问题在于团队没有任何机制拦住它：既不需要 MR 评审、也没有"禁用用例必须留跟踪单号"的约定、CI 更不会因为"用例被注释掉"而变红。受影响的是订单创建这条主流程接口回归，从 2025-03-11 到 2025-03-15 之间至少 4 天处于无防线状态，且以"6 passed"的假象掩盖了过去。

    建议三件事：① 把第 4 题的 `-G` 检查加进 CI（先告警后阻断）；② 团队规范里写明"禁用用例必须用 `@pytest.mark.skip(reason='TEST-1234 联调中')`，禁止注释用例体"，因为 `skip` 会在报告里显式出现为 skipped，而注释不会留任何痕迹；③ 顺手把 `.gitignore` 补齐，避免日志、`allure-results/` 这类产物继续污染仓库。

---

!!! warning "测试纪律"
    提交代码前自检：1) 没有密码、Token 等敏感信息；2) 没有大文件（>10MB）；3) 没有临时文件、日志、报告；4) 提交信息清晰；5) 本地测试通过。涉及主干分支的操作三思而后行。

### 推荐下一步

根据你的学习进度，选择下一步：

1. **如果你想继续学工具**：学习 [Docker 容器教程](Docker容器教程-软件测试版.md)，掌握环境搭建
2. **如果你想学抓包**：学习 [Fiddler 抓包教程](Fiddler抓包教程-软件测试版.md)，掌握请求分析
3. **如果你想进入下一阶段**：学习 [Postman 接口测试](Postman接口测试教程-软件测试版.md)，掌握接口调试

### 阶段测验

完成教程后，建议做 [Git 基础测验](Git基础测验.md) 检验学习效果。

### 通关检查

完成本阶段后，使用 [第2阶段-工具实战通关](../学习中心/第2阶段-工具实战通关.md) 检查是否可以进入下一阶段。
