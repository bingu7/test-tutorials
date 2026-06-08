# Linux 实用教程（软件测试人员专用）

> 本教程面向软件测试工程师，聚焦测试日常工作场景：环境部署、日志排查、性能监控、服务管理。不深入内核、编译原理等开发向内容。

---

## 一、Linux 简介

### 1.1 测试人员为什么要学 Linux

| 工作场景 | Linux 是否必需 |
|---------|--------------|
| 部署被测系统 | 必需，绝大多数服务器是 Linux |
| 查看应用日志 | 必需，日志在服务器上 |
| 排查线上 Bug | 必需，需要登录服务器抓数据 |
| 性能测试 | 必需，监控 CPU/内存/磁盘 |
| 自动化测试环境 | 必需，CI/CD 通常基于 Linux |
| 数据库测试 | 必需，多数数据库部署在 Linux |
| 移动端测试 | 部分必需，Android 底层是 Linux |

### 1.2 常见发行版

| 发行版 | 特点 | 包管理 |
|--------|------|--------|
| **CentOS / RHEL** | 企业级首选，稳定 | `yum` / `dnf` |
| **Ubuntu** | 桌面友好，社区活跃 | `apt` |
| **Debian** | Ubuntu 基础，稳定 | `apt` |
| **Alpine** | 体积小，Docker 常用 | `apk` |
| **OpenEuler / 麒麟** | 国产化替代 | `yum` / `dnf` |

> **测试人员建议：** CentOS 7/8 和 Ubuntu 是企业最常见的两个，掌握这两个即可应对 90% 场景。

### 1.3 Linux 目录结构

```
/                根目录
├── bin/         基础命令（ls、cp 等）
├── boot/        启动文件
├── dev/         设备文件
├── etc/         配置文件（重要！修改配置常来这）
├── home/        普通用户主目录
├── lib/         系统库
├── mnt/         挂载点
├── opt/         第三方应用（很多公司部署应用在此）
├── proc/        进程信息（虚拟文件系统）
├── root/        root 用户主目录
├── sbin/        系统管理命令
├── tmp/         临时文件（重启会清空）
├── usr/         用户程序（/usr/local/ 常用于安装软件）
└── var/         可变数据（/var/log/ 系统日志）
```

**测试人员重点关注：**
- `/etc/` — 配置文件
- `/var/log/` — 系统日志
- `/opt/` 或 `/usr/local/` — 应用部署位置
- `/tmp/` — 临时文件

---

## 二、连接 Linux 服务器

### 2.1 SSH 工具选择

| 工具 | 平台 | 特点 |
|------|------|------|
| **Xshell / Xftp** | Windows | 商业软件，企业常用 |
| **MobaXterm** | Windows | 集成度高，免费 |
| **FinalShell** | 全平台 | 国产，免费，自带性能监控 |
| **SecureCRT** | 全平台 | 老牌商业工具 |
| **iTerm2 + ssh** | Mac | 原生体验 |
| **Windows Terminal + ssh** | Windows 10+ | 微软官方 |
| **VSCode Remote-SSH** | 全平台 | 可视化编辑远程文件 |

### 2.2 SSH 命令连接

```bash
# 基础连接
ssh username@192.168.1.100

# 指定端口（默认 22）
ssh -p 2222 username@192.168.1.100

# 使用密钥登录
ssh -i ~/.ssh/id_rsa username@192.168.1.100
```

首次连接会提示确认指纹，输入 `yes` 后输入密码即可登录。

### 2.3 文件传输

**SCP 命令（命令行）：**

```bash
# 本地 → 远程
scp /local/file.txt username@192.168.1.100:/remote/path/

# 远程 → 本地
scp username@192.168.1.100:/remote/file.txt /local/path/

# 传输文件夹（加 -r）
scp -r /local/dir username@192.168.1.100:/remote/path/
```

**SFTP（交互式）：**

```bash
sftp username@192.168.1.100

# 进入 sftp 后常用命令
put localfile.txt        # 上传
get remotefile.txt       # 下载
ls                       # 列出远程文件
lls                      # 列出本地文件
bye                      # 退出
```

工具如 Xftp、FinalShell 提供图形化拖拽传输，更直观。

### 2.4 免密登录配置

频繁登录服务器时，配置密钥免密登录：

```bash
# 在本地生成密钥对（一路回车）
ssh-keygen -t rsa

# 将公钥发送到服务器
ssh-copy-id username@192.168.1.100

# 之后登录无需密码
ssh username@192.168.1.100
```

---

## 三、基础命令入门

### 3.1 命令格式

```
命令 [选项] [参数]

示例：ls -la /home/test
     ^   ^   ^
     命令 选项 参数
```

- 短选项：`-l`、`-a`，可合并 `-la`
- 长选项：`--help`、`--version`
- 多数命令支持 `--help` 查看用法

### 3.2 必备的"导航"命令

```bash
pwd                    # 显示当前路径（print working directory）
whoami                 # 显示当前用户
hostname               # 显示主机名
date                   # 显示当前时间
uname -a               # 显示系统信息
uptime                 # 显示运行时长和负载
history                # 查看历史命令
clear                  # 清屏（快捷键 Ctrl+L）
exit                   # 退出当前 shell
```

### 3.3 获取帮助

```bash
ls --help              # 命令简要帮助
man ls                 # 完整手册（按 q 退出）
info ls                # info 文档
which ls               # 查看命令路径
type ls                # 查看命令类型
```

### 3.4 命令行快捷键

| 快捷键 | 功能 |
|--------|------|
| `Tab` | 自动补全（最常用） |
| `Ctrl + C` | 中断当前命令 |
| `Ctrl + D` | 退出当前 shell / 结束输入 |
| `Ctrl + L` | 清屏 |
| `Ctrl + R` | 搜索历史命令 |
| `Ctrl + A` | 光标移到行首 |
| `Ctrl + E` | 光标移到行尾 |
| `Ctrl + U` | 删除光标到行首 |
| `Ctrl + K` | 删除光标到行尾 |
| `Ctrl + W` | 删除光标前一个单词 |
| `↑ / ↓` | 切换历史命令 |
| `!!` | 重复上一条命令 |
| `!grep` | 重复最近以 grep 开头的命令 |

---

## 四、文件与目录操作

### 4.1 查看与切换目录

```bash
ls                     # 列出当前目录
ls -l                  # 详细列表（权限/大小/时间）
ls -la                 # 包含隐藏文件
ls -lh                 # 文件大小人类可读（K/M/G）
ls -lt                 # 按时间排序
ls -lS                 # 按大小排序
ls /var/log            # 列出指定目录

cd /etc                # 切换到 /etc
cd ~                   # 回到家目录
cd -                   # 回到上一个目录
cd ..                  # 上一级目录
cd ../..               # 上两级目录
```

### 4.2 创建与删除

```bash
# 创建文件（空文件）
touch test.txt

# 创建目录
mkdir mydir
mkdir -p a/b/c         # 递归创建多层目录

# 删除文件
rm test.txt
rm -f test.txt         # 强制删除（不提示）

# 删除目录
rmdir emptydir         # 仅能删除空目录
rm -rf mydir           # 递归强制删除（危险！）
```

> ⚠️ **`rm -rf` 是 Linux 最危险的命令**。执行前务必确认路径，特别是不要在 `/` 下使用。`rm -rf /` 会清空整个系统。

### 4.3 复制与移动

```bash
# 复制
cp source.txt dest.txt
cp source.txt /tmp/    # 复制到目录
cp -r dir1 dir2        # 复制目录（递归）
cp -p file dest        # 保留权限和时间戳

# 移动 / 重命名
mv old.txt new.txt     # 重命名
mv file.txt /tmp/      # 移动到目录
mv *.log /tmp/logs/    # 移动所有 .log
```

### 4.4 查找文件

**find 命令（按属性查找）：**

```bash
# 按文件名
find /var/log -name "*.log"
find / -iname "test*"           # 忽略大小写

# 按类型
find /tmp -type f               # 文件
find /tmp -type d               # 目录

# 按大小
find /var -size +100M           # 大于 100M
find /var -size -1M             # 小于 1M

# 按修改时间
find /var/log -mtime -7         # 最近 7 天修改
find /var/log -mtime +30        # 30 天前修改
find /var/log -mmin -60         # 最近 60 分钟修改

# 按用户
find /home -user testuser

# 组合 + 操作
find /tmp -name "*.tmp" -delete                    # 找到并删除
find /var/log -name "*.log" -mtime +30 -delete     # 删除 30 天前日志
find /tmp -name "*.log" -exec ls -l {} \;          # 对结果执行命令
```

**locate 命令（按数据库快速查找）：**

```bash
locate test.txt        # 比 find 快很多
updatedb               # 更新数据库
```

### 4.5 链接文件

```bash
# 软链接（类似 Windows 快捷方式）
ln -s /opt/app/current /usr/local/app

# 硬链接（同一文件多个名字）
ln source.txt link.txt
```

测试场景常用软链接切换应用版本：
```bash
ln -sf /opt/app/v2.0 /opt/app/current
```

---

## 五、文件查看与编辑

### 5.1 查看文件内容

```bash
# 全文显示（适合小文件）
cat file.txt
cat -n file.txt        # 显示行号

# 分页查看（推荐查看大文件）
more file.txt          # 空格翻页，q 退出
less file.txt          # 功能更强（推荐）

# 看头/尾
head file.txt          # 默认前 10 行
head -n 50 file.txt    # 前 50 行
tail file.txt          # 默认后 10 行
tail -n 50 file.txt    # 后 50 行

# 实时跟踪日志（测试人员最常用！）
tail -f app.log        # 持续输出新内容
tail -f -n 100 app.log # 先显示后 100 行再持续跟踪
```

### 5.2 less 命令快捷键（推荐）

| 快捷键 | 功能 |
|--------|------|
| `空格` / `Page Down` | 向下翻页 |
| `b` / `Page Up` | 向上翻页 |
| `↑ / ↓` | 上下一行 |
| `g` | 跳到首行 |
| `G` | 跳到末行 |
| `/keyword` | 向下搜索 keyword |
| `?keyword` | 向上搜索 keyword |
| `n` | 下一个匹配 |
| `N` | 上一个匹配 |
| `q` | 退出 |
| `F` | 类似 `tail -f`，按 Ctrl+C 退出此模式 |

### 5.3 vi/vim 编辑器

vim 有三种模式，初学者最容易卡在这里。

```
┌────────────┐  i, a, o   ┌────────────┐
│  普通模式   │ ─────────→ │  编辑模式   │
│ Normal     │ ←───────── │ Insert     │
└────┬───────┘    Esc     └────────────┘
     │ :
     ↓
┌────────────┐
│  命令模式   │
│ Command    │
└────────────┘
```

**基本操作流程：**

```bash
vim file.txt           # 打开文件，默认普通模式
# 按 i 进入编辑模式，开始输入文本
# 按 Esc 回到普通模式
# 按 :wq 保存并退出
```

**普通模式常用命令：**

| 命令 | 功能 |
|------|------|
| `i` | 在光标前插入 |
| `a` | 在光标后插入 |
| `o` | 在下一行插入 |
| `dd` | 删除当前行 |
| `5dd` | 删除 5 行 |
| `yy` | 复制当前行 |
| `5yy` | 复制 5 行 |
| `p` | 粘贴到光标后 |
| `u` | 撤销 |
| `Ctrl + r` | 重做 |
| `gg` | 跳到文件开头 |
| `G` | 跳到文件结尾 |
| `:10` | 跳到第 10 行 |
| `/keyword` | 搜索 keyword |
| `n` / `N` | 下/上一个匹配 |
| `:%s/old/new/g` | 全文替换 old 为 new |

**命令模式（先按 `:`）：**

| 命令 | 功能 |
|------|------|
| `:w` | 保存 |
| `:q` | 退出 |
| `:wq` | 保存并退出 |
| `:q!` | 强制退出（不保存） |
| `:wq!` | 强制保存并退出 |
| `:set nu` | 显示行号 |
| `:set nonu` | 不显示行号 |

> **测试人员小贴士：** 如果只是修改配置文件，不熟悉 vim 时可以用 `nano` 代替，操作类似 Windows 记事本：
> ```bash
> nano file.txt
> # Ctrl+O 保存，Ctrl+X 退出
> ```

---

## 六、用户与权限管理

### 6.1 用户管理

```bash
# 查看当前用户
whoami
id

# 切换用户
su - testuser          # 切换到 testuser
sudo command           # 以 root 权限执行单条命令
sudo -i                # 切换到 root（需当前用户有 sudo 权限）

# 创建用户（需 root）
useradd testuser
passwd testuser        # 设置密码

# 删除用户
userdel testuser       # 仅删用户
userdel -r testuser    # 连同家目录一起删
```

### 6.2 文件权限基础

```bash
ls -l file.txt
# 输出：-rw-r--r-- 1 root root 1024 Jun 7 10:00 file.txt
#       │└┬┘└┬┘└┬┘
#       │ │  │  └─ 其他用户权限
#       │ │  └──── 所属组权限
#       │ └─────── 文件所有者权限
#       └──────── 文件类型（- 文件，d 目录，l 链接）
```

**权限位含义：**

| 字符 | 含义 | 数字 |
|------|------|------|
| `r` | 读 | 4 |
| `w` | 写 | 2 |
| `x` | 执行 | 1 |
| `-` | 无权限 | 0 |

**常见权限组合：**

| 数字 | 字符 | 含义 |
|------|------|------|
| 755 | rwxr-xr-x | 所有者全权，其他读+执行（脚本常用） |
| 644 | rw-r--r-- | 所有者读写，其他只读（配置文件常用） |
| 777 | rwxrwxrwx | 所有人全权（不安全） |
| 600 | rw------- | 仅所有者读写（密钥文件常用） |

### 6.3 修改权限

```bash
# 数字方式（推荐，简洁）
chmod 755 script.sh
chmod 644 config.yaml
chmod -R 755 mydir      # 递归修改

# 字符方式
chmod +x script.sh      # 添加执行权限
chmod -w file.txt       # 移除写权限
chmod u+x,g-w file.txt  # 用户加执行，组去写
```

### 6.4 修改所有者

```bash
chown testuser file.txt           # 改所有者
chown testuser:testgroup file.txt # 改所有者和组
chown -R testuser /opt/app        # 递归
```

### 6.5 sudo 权限

```bash
# 配置 sudo 权限（root 执行）
visudo

# 添加用户到 sudo 组（Ubuntu）
usermod -aG sudo testuser

# 添加用户到 wheel 组（CentOS）
usermod -aG wheel testuser
```

---

## 七、文本处理三剑客

> **测试人员核心技能**：grep、sed、awk 是 Linux 处理日志的三大利器，必须掌握。

### 7.1 grep（过滤）

**基础用法：**

```bash
# 在文件中搜索关键字
grep "ERROR" app.log

# 忽略大小写
grep -i "error" app.log

# 显示行号
grep -n "ERROR" app.log

# 显示匹配行的前后内容
grep -A 3 "ERROR" app.log     # 匹配行后 3 行
grep -B 3 "ERROR" app.log     # 匹配行前 3 行
grep -C 3 "ERROR" app.log     # 匹配行前后各 3 行

# 反向匹配（不包含）
grep -v "DEBUG" app.log

# 统计匹配行数
grep -c "ERROR" app.log

# 仅显示匹配的文件名
grep -l "ERROR" *.log

# 递归搜索目录
grep -r "ERROR" /var/log/

# 正则表达式
grep -E "ERROR|WARN" app.log
grep -E "^[0-9]{4}-[0-9]{2}-[0-9]{2}" app.log    # 日期开头的行
```

**测试常用组合：**

```bash
# 统计今天的错误数
grep "$(date +%Y-%m-%d)" app.log | grep -c "ERROR"

# 查看错误及上下文
grep -B 2 -A 5 "Exception" app.log

# 多关键字过滤
grep "ERROR" app.log | grep "OrderService"

# 排除某些关键字
grep "ERROR" app.log | grep -v "test"
```

### 7.2 sed（替换/编辑）

```bash
# 替换（输出到屏幕，不修改文件）
sed 's/old/new/' file.txt          # 每行第一个
sed 's/old/new/g' file.txt         # 全部替换

# 替换并写回原文件
sed -i 's/old/new/g' file.txt

# 删除特定行
sed '5d' file.txt                  # 删除第 5 行
sed '/pattern/d' file.txt          # 删除匹配行
sed '2,5d' file.txt                # 删除 2-5 行

# 打印特定行
sed -n '5p' file.txt               # 打印第 5 行
sed -n '5,10p' file.txt            # 打印 5-10 行
sed -n '/ERROR/p' file.txt         # 打印含 ERROR 的行
```

**测试常用：**

```bash
# 批量修改配置文件
sed -i 's/127.0.0.1/192.168.1.100/g' app.conf

# 修改端口号
sed -i 's/port=8080/port=9090/' application.yml

# 删除空行
sed -i '/^$/d' file.txt

# 删除以 # 开头的注释
sed -i '/^#/d' config.conf
```

### 7.3 awk（按列处理）

awk 适合处理结构化文本（如表格、日志的特定列）。

**基础语法：**

```bash
awk '条件 {动作}' 文件
```

**示例：**

```bash
# 打印第 1 列
awk '{print $1}' file.txt

# 打印第 1 列和第 3 列
awk '{print $1, $3}' file.txt

# 指定分隔符（默认空格/Tab）
awk -F: '{print $1}' /etc/passwd       # 冒号分隔，打印用户名

# 条件筛选
awk '$3 > 100 {print $1, $3}' file.txt   # 第 3 列大于 100

# 内置变量
awk '{print NR, $0}' file.txt          # NR 行号，$0 整行
awk 'END {print NR}' file.txt          # 统计总行数

# 计算总和
awk '{sum += $1} END {print sum}' nums.txt
```

**测试场景示例：**

```bash
# 统计 Nginx 访问日志中每个 IP 的访问次数
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -10

# 统计 HTTP 状态码分布
awk '{print $9}' access.log | sort | uniq -c | sort -rn

# 计算接口平均响应时间（假设第 10 列是响应时间）
awk '{sum+=$10; count++} END {print sum/count}' access.log

# 找出响应时间超过 1 秒的请求
awk '$10 > 1000 {print $0}' access.log
```

### 7.4 管道与重定向

**管道 `|`：** 把前一个命令的输出作为后一个命令的输入

```bash
cat app.log | grep "ERROR" | wc -l                    # 统计错误数
ps aux | grep nginx                                    # 查找 nginx 进程
ls -lh /var/log | awk '{print $5, $9}' | sort -h      # 按大小排序文件
```

**重定向：**

```bash
# 输出重定向（覆盖）
ls > files.txt

# 输出重定向（追加）
ls >> files.txt

# 错误输出重定向
command 2> error.log

# 标准输出和错误输出合并
command > output.log 2>&1
command &> output.log              # 等价写法

# 丢弃输出（黑洞）
command > /dev/null 2>&1

# 输入重定向
mysql -uroot -p < backup.sql
```

**测试常用：**

```bash
# 执行测试脚本，日志写入文件，错误也包含
./test.sh > test.log 2>&1

# 后台执行 + 日志重定向
nohup ./test.sh > test.log 2>&1 &
```

---

## 八、日志分析实战

> 这是测试人员的核心日常工作。下面是真实场景下的日志分析套路。

### 8.1 常见日志位置

| 路径 | 内容 |
|------|------|
| `/var/log/messages` | 系统消息（CentOS） |
| `/var/log/syslog` | 系统消息（Ubuntu） |
| `/var/log/secure` | 安全日志（登录） |
| `/var/log/dmesg` | 内核启动日志 |
| `/var/log/cron` | 定时任务日志 |
| `/var/log/nginx/access.log` | Nginx 访问日志 |
| `/var/log/nginx/error.log` | Nginx 错误日志 |
| `/var/log/mysql/error.log` | MySQL 错误日志 |
| 应用日志 | 通常在 `/opt/<app>/logs/` 或 `/data/logs/` |

### 8.2 实时跟踪日志

```bash
# 实时查看日志（最常用！）
tail -f app.log

# 同时跟踪多个文件
tail -f app.log error.log

# 显示最后 200 行后继续跟踪
tail -n 200 -f app.log

# 过滤后实时跟踪
tail -f app.log | grep "ERROR"

# 高亮关键字（颜色）
tail -f app.log | grep --color=auto -E "ERROR|WARN"
```

### 8.3 历史日志分析

```bash
# 按时间过滤
grep "2026-06-07 14:" app.log              # 当天 14 点的日志
grep "2026-06-07" app.log | grep "ERROR"   # 当天所有错误

# 统计错误数量
grep -c "ERROR" app.log

# 统计每小时错误分布
grep "ERROR" app.log | awk '{print $2}' | cut -c1-2 | sort | uniq -c

# 找出最频繁的错误
grep "ERROR" app.log | awk '{print $5}' | sort | uniq -c | sort -rn | head -10
```

### 8.4 多文件日志分析

```bash
# 多文件搜索
grep "OrderException" /var/log/app/*.log

# 跨日切割的日志（如 app.log、app.log.2026-06-06）
grep "ERROR" app.log*

# 压缩日志查询（无需解压）
zgrep "ERROR" app.log.gz
zcat app.log.gz | grep "ERROR"
```

### 8.5 完整排错套路

测试反馈线上某接口报错，排查流程：

```bash
# Step 1：定位错误时间附近的日志
cd /opt/app/logs
tail -n 1000 app.log | grep "ERROR"

# Step 2：找到具体异常堆栈
grep -A 30 "OrderException" app.log | head -100

# Step 3：根据 traceId 串起整条链路
grep "traceId=abc123" app.log

# Step 4：统计该错误是否影响其他用户
grep -c "OrderException" app.log

# Step 5：查看错误的时间分布
grep "OrderException" app.log | awk '{print $1, $2}' | head -20
```

---

## 九、进程与服务管理

### 9.1 查看进程

```bash
# 查看所有进程
ps -ef
ps aux

# 查找特定进程
ps -ef | grep nginx
ps -ef | grep java | grep -v grep   # 排除 grep 自身

# 树状显示
pstree
pstree -p              # 显示 PID

# 动态查看（按 CPU 排序）
top
# top 内快捷键：
# P  按 CPU 排序
# M  按内存排序
# k  杀进程（输入 PID）
# q  退出

# 增强版 top（更友好）
htop                   # 需安装：yum install htop
```

### 9.2 杀进程

```bash
kill PID               # 发送 TERM 信号（友好退出）
kill -9 PID            # 强制杀死
kill -15 PID           # 同 kill PID
killall nginx          # 按名称杀
pkill -f "java.*MyApp" # 按命令行匹配杀
```

**测试场景：**

```bash
# 找到并杀死 Java 进程
ps -ef | grep java | grep -v grep | awk '{print $2}' | xargs kill -9

# 一行命令
pkill -9 -f "MyApp"
```

### 9.3 后台运行

```bash
# 方式 1：nohup + &（推荐，关闭终端后仍运行）
nohup ./startup.sh > app.log 2>&1 &

# 方式 2：& 直接后台（关终端就停）
./script.sh &

# 查看后台任务
jobs

# 切回前台
fg %1                  # 切第 1 个任务

# 切到后台
Ctrl + Z               # 暂停当前任务
bg %1                  # 让暂停任务后台运行

# 退出登录后保持运行
disown -h %1
```

### 9.4 systemd 服务管理

CentOS 7+ / Ubuntu 16+ 使用 systemd 管理服务。

```bash
# 启动 / 停止 / 重启 / 重载
systemctl start nginx
systemctl stop nginx
systemctl restart nginx
systemctl reload nginx          # 不中断重载配置

# 查看状态
systemctl status nginx

# 开机启动
systemctl enable nginx
systemctl disable nginx

# 查看所有服务
systemctl list-units --type=service
systemctl list-unit-files | grep enabled

# 查看服务日志
journalctl -u nginx
journalctl -u nginx -f          # 实时
journalctl -u nginx --since "2026-06-07 10:00"
```

### 9.5 老版本服务管理（service / chkconfig）

CentOS 6 等老系统：

```bash
service nginx start
service nginx status
chkconfig nginx on
```

### 9.6 定时任务（crontab）

```bash
# 编辑当前用户的定时任务
crontab -e

# 查看定时任务
crontab -l

# 删除所有定时任务
crontab -r
```

**cron 语法：**

```
* * * * * command
│ │ │ │ │
│ │ │ │ └── 星期几（0-6，0=周日；部分实现支持 7=周日）
│ │ │ └──── 月份（1-12）
│ │ └────── 日期（1-31）
│ └──────── 小时（0-23）
└────────── 分钟（0-59）
```

> 不同 cron 实现对星期字段略有差异：Vixie cron / cronie 同时支持 0 和 7 表示周日；BusyBox 等精简版可能只支持 0-6。安全做法是统一用 0。

**示例：**

```bash
# 每分钟执行
* * * * * /opt/script/check.sh

# 每天凌晨 2 点
0 2 * * * /opt/script/backup.sh

# 每 5 分钟
*/5 * * * * /opt/script/monitor.sh

# 每天 0 点和 12 点
0 0,12 * * * /opt/script/sync.sh

# 工作日上午 9 点
0 9 * * 1-5 /opt/script/report.sh
```

**测试场景：** 定时执行接口监控、清理测试数据、生成测试报告等。

---

## 十、性能监控

> 测试人员做性能测试或排查问题时必备的监控命令。

### 10.1 CPU 监控

```bash
# 实时监控（最常用）
top
# 输出示例：
# %Cpu(s):  5.0 us,  2.0 sy,  0.0 ni, 92.0 id,  1.0 wa
#           用户   系统       空闲    IO等待

htop                   # 升级版

# 1 秒刷新一次，运行 5 次
top -d 1 -n 5

# CPU 详细信息
lscpu
cat /proc/cpuinfo | grep "model name" | head -1
cat /proc/cpuinfo | grep "processor" | wc -l    # 核数
```

**top 输出关键指标：**

- `load average`：1/5/15 分钟平均负载（应小于 CPU 核数）
- `%us`：用户态 CPU
- `%sy`：系统态 CPU
- `%id`：空闲 CPU
- `%wa`：等待 IO（高表示磁盘瓶颈）

### 10.2 内存监控

```bash
# 查看内存（推荐）
free -h
# 输出：
#               total  used  free  shared  buff/cache  available
# Mem:           7.7G  2.1G  3.2G    100M        2.4G       5.3G
# Swap:          2.0G    0B  2.0G

# 详细内存信息
cat /proc/meminfo

# 1 秒刷新
free -h -s 1
```

**关键概念：**
- `available`：真正可用内存（关注这个，不是 free）
- `buff/cache`：缓存（系统会按需释放）

### 10.3 磁盘监控

```bash
# 磁盘使用率（最常用！）
df -h
# 输出：
# Filesystem      Size  Used Avail Use% Mounted on
# /dev/sda1        50G   30G   20G  60% /
# /dev/sdb1       500G  100G  400G  20% /data

# 查看目录大小
du -sh /var/log               # 单个目录
du -sh /var/log/*             # 目录内每个子项
du -h --max-depth=1 /var      # 仅看一级子目录
du -sh /var/log/* | sort -h   # 按大小排序

# 找大文件
find / -type f -size +1G 2>/dev/null
find /var -type f -size +500M -exec ls -lh {} \;

# IO 监控
iostat -x 1                   # 需安装：yum install sysstat
# %util 接近 100% 表示磁盘繁忙
```

**测试场景：** 性能测试前先确认磁盘空间足够，性能测试中监控 IO。

### 10.4 网络监控

```bash
# 查看网络连接
netstat -an                    # 所有连接
netstat -anp | grep 8080       # 查看 8080 端口占用
netstat -ant | grep ESTABLISHED | wc -l   # 当前连接数

# 新版命令（CentOS 7+）
ss -anp
ss -tlnp                       # 监听的 TCP 端口

# 实时网络流量
iftop                          # 需安装
nload                          # 简洁版
sar -n DEV 1                   # 网卡流量
```

### 10.5 系统综合监控

```bash
# 综合监控（推荐性能测试时用）
vmstat 1                       # 每秒一次
# r  b   swpd  free  buff  cache   si  so  bi  bo  in  cs  us sy id wa
# 关注：r（运行队列）、si/so（swap）、wa（IO等待）

# 详细系统统计（需 sysstat）
sar -u 1 10                    # CPU
sar -r 1 10                    # 内存
sar -d 1 10                    # 磁盘
sar -n DEV 1 10                # 网络

# 系统负载历史
sar -q                         # 负载
sar -u -f /var/log/sa/sa07     # 查看历史数据（7 号）
```

---

## 十一、网络相关命令

### 11.1 网络测试

```bash
# ping 测试
ping baidu.com
ping -c 4 baidu.com            # 发 4 个包后停止

# 路由跟踪
traceroute baidu.com
tracepath baidu.com

# DNS 查询
nslookup baidu.com
dig baidu.com                  # 更详细
host baidu.com

# 测试端口连通性
telnet 192.168.1.100 8080
nc -zv 192.168.1.100 8080      # nc 更现代
nc -zv 192.168.1.100 8000-9000 # 扫描端口范围
```

### 11.2 查看本机网络

```bash
# IP 地址
ip a                           # 新版（推荐）
ip addr show
ifconfig                       # 老版（需安装 net-tools）

# 路由表
ip route
route -n

# 防火墙
firewall-cmd --list-all        # CentOS 7+
iptables -L                    # iptables
ufw status                     # Ubuntu

# 开放端口（CentOS）
firewall-cmd --permanent --add-port=8080/tcp
firewall-cmd --reload
```

### 11.3 接口调试（curl）

> **测试人员必会的接口测试命令行工具。**

```bash
# GET 请求
curl http://api.example.com/user/1

# 显示响应头
curl -i http://api.example.com/user/1

# 仅显示响应头
curl -I http://api.example.com/user/1

# 详细输出（调试用）
curl -v http://api.example.com/user/1

# POST JSON
curl -X POST http://api.example.com/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123456"}'

# POST 表单
curl -X POST http://api.example.com/login \
  -d "username=test&password=123456"

# 带 Header
curl -H "Authorization: Bearer eyJhbGc..." \
     -H "X-Request-Id: abc123" \
     http://api.example.com/user

# 保存响应到文件
curl -o response.json http://api.example.com/data

# 下载文件
curl -O http://example.com/file.zip

# 跟随重定向
curl -L http://example.com

# 跳过 SSL 校验（自签名证书）
curl -k https://192.168.1.100/api

# 上传文件
curl -X POST http://api.example.com/upload \
  -F "file=@/path/to/file.jpg" \
  -F "name=test"

# 测试接口响应时间
curl -o /dev/null -s -w "HTTP: %{http_code}\nTotal: %{time_total}s\nDNS: %{time_namelookup}s\nConnect: %{time_connect}s\n" \
  http://api.example.com/test
```

**wget 下载工具：**

```bash
wget http://example.com/file.zip
wget -c http://example.com/file.zip       # 断点续传
wget -b http://example.com/file.zip       # 后台下载
```

### 11.4 抓包工具

```bash
# tcpdump（命令行抓包）
tcpdump -i eth0                            # 抓 eth0 网卡
tcpdump -i any port 8080                   # 抓 8080 端口
tcpdump -i any host 192.168.1.100          # 抓特定 IP
tcpdump -i any port 8080 -w capture.pcap   # 保存到文件
# 抓的 pcap 可用 Wireshark 打开分析
```

---

## 十二、压缩与解压

### 12.1 tar 命令（最常用）

```bash
# 打包（不压缩）
tar -cvf archive.tar dir/         # c 创建，v 显示，f 文件名
tar -xvf archive.tar              # x 解包

# 打包 + gzip 压缩（最常用）
tar -czvf archive.tar.gz dir/
tar -xzvf archive.tar.gz

# 打包 + bzip2 压缩（更高压缩率）
tar -cjvf archive.tar.bz2 dir/
tar -xjvf archive.tar.bz2

# 解压到指定目录
tar -xzvf archive.tar.gz -C /opt/

# 仅查看不解压
tar -tzvf archive.tar.gz
```

**记忆口诀：**
- `c` create 创建
- `x` extract 解压
- `t` list 列表
- `z` gzip
- `j` bzip2
- `v` verbose 显示过程
- `f` file 指定文件名

### 12.2 zip / unzip

```bash
# 压缩
zip -r archive.zip dir/

# 解压
unzip archive.zip
unzip archive.zip -d /opt/        # 解压到指定目录

# 查看不解压
unzip -l archive.zip
```

### 12.3 gzip / bzip2

```bash
# gzip（单文件压缩）
gzip file.txt                     # 生成 file.txt.gz，原文件消失
gunzip file.txt.gz                # 解压

# bzip2
bzip2 file.txt
bunzip2 file.txt.bz2
```

---

## 十三、软件包管理

### 13.1 CentOS / RHEL（yum / dnf）

```bash
# 安装
yum install nginx
yum install -y nginx              # 自动确认

# 卸载
yum remove nginx

# 更新
yum update                        # 更新所有
yum update nginx                  # 更新单个

# 搜索
yum search nginx
yum list installed                # 已安装的
yum info nginx                    # 详细信息

# 仓库管理
yum repolist                      # 列出仓库
yum-config-manager --add-repo URL

# CentOS 8+ 推荐 dnf（用法一致）
dnf install nginx
```

### 13.2 Ubuntu / Debian（apt）

```bash
# 更新索引（首次安装前必做）
apt update

# 安装
apt install nginx
apt install -y nginx

# 卸载
apt remove nginx
apt purge nginx                   # 连同配置一起删

# 升级
apt upgrade                       # 升级所有
apt upgrade nginx                 # 升级单个

# 搜索
apt search nginx
apt list --installed
apt show nginx
```

### 13.3 通用安装方式

```bash
# 二进制压缩包安装（如 JDK）
tar -xzvf jdk.tar.gz -C /opt/
# 配置环境变量
vim /etc/profile
# 添加：
# export JAVA_HOME=/opt/jdk
# export PATH=$JAVA_HOME/bin:$PATH
source /etc/profile

# rpm 包（CentOS）
rpm -ivh package.rpm              # 安装
rpm -qa | grep nginx              # 查询已安装
rpm -e package                    # 卸载

# deb 包（Ubuntu）
dpkg -i package.deb
dpkg -l | grep nginx
dpkg -r package
```

---

## 十四、Shell 脚本基础

### 14.1 第一个脚本

创建 `hello.sh`：

```bash
#!/bin/bash
# 这是注释

echo "Hello, World!"
echo "当前用户：$(whoami)"
echo "当前时间：$(date)"
```

执行：

```bash
chmod +x hello.sh
./hello.sh

# 或
bash hello.sh
```

### 14.2 变量

```bash
#!/bin/bash

# 定义变量（等号两边不能有空格）
name="测试人员"
age=25

# 使用变量
echo "姓名：$name"
echo "年龄：${age}"

# 命令结果赋值
today=$(date +%Y-%m-%d)
files=$(ls /var/log | wc -l)

# 环境变量
echo $HOME
echo $PATH
echo $USER

# 特殊变量
echo $0    # 脚本名
echo $1    # 第 1 个参数
echo $2    # 第 2 个参数
echo $#    # 参数个数
echo $@    # 所有参数
echo $?    # 上条命令的退出状态（0 成功）
echo $$    # 当前进程 PID
```

### 14.3 条件判断

```bash
#!/bin/bash

# 数字比较
num=10
if [ $num -gt 5 ]; then
    echo "大于 5"
elif [ $num -eq 5 ]; then
    echo "等于 5"
else
    echo "小于 5"
fi

# 字符串比较
str="hello"
if [ "$str" = "hello" ]; then
    echo "匹配"
fi

# 文件判断
if [ -f /etc/passwd ]; then
    echo "文件存在"
fi
```

**常用判断符：**

| 符号 | 含义 |
|------|------|
| `-eq` | 等于 |
| `-ne` | 不等于 |
| `-gt` | 大于 |
| `-lt` | 小于 |
| `-ge` | 大于等于 |
| `-le` | 小于等于 |
| `-f` | 文件存在 |
| `-d` | 目录存在 |
| `-e` | 文件或目录存在 |
| `-r` | 可读 |
| `-w` | 可写 |
| `-x` | 可执行 |
| `=` | 字符串相等 |
| `!=` | 字符串不等 |
| `-z` | 字符串为空 |
| `-n` | 字符串非空 |

### 14.4 循环

```bash
# for 循环
for i in 1 2 3 4 5; do
    echo "数字：$i"
done

# 遍历文件
for file in /var/log/*.log; do
    echo "处理：$file"
done

# C 风格 for
for ((i=1; i<=5; i++)); do
    echo $i
done

# while 循环
count=1
while [ $count -le 5 ]; do
    echo $count
    count=$((count + 1))
done

# 读文件每行
while read line; do
    echo "$line"
done < file.txt
```

### 14.5 函数

```bash
#!/bin/bash

# 定义函数
check_service() {
    local service=$1
    if systemctl is-active --quiet $service; then
        echo "$service is running"
        return 0
    else
        echo "$service is NOT running"
        return 1
    fi
}

# 调用函数
check_service nginx
check_service mysql
```

### 14.6 测试人员常用脚本示例

**示例 1：批量 ping 服务器**

```bash
#!/bin/bash
servers=("192.168.1.100" "192.168.1.101" "192.168.1.102")
for server in "${servers[@]}"; do
    if ping -c 1 -W 1 $server > /dev/null 2>&1; then
        echo "$server: 通"
    else
        echo "$server: 不通"
    fi
done
```

**示例 2：监控接口健康**

```bash
#!/bin/bash
url="http://api.example.com/health"
code=$(curl -o /dev/null -s -w "%{http_code}" $url)
if [ "$code" = "200" ]; then
    echo "$(date) - 接口正常"
else
    echo "$(date) - 接口异常，状态码：$code"
    # 这里可以发钉钉/企业微信告警
fi
```

**示例 3：清理 N 天前的日志**

```bash
#!/bin/bash
log_dir="/opt/app/logs"
days=7
find $log_dir -name "*.log.*" -mtime +$days -exec rm -f {} \;
echo "$(date) - 清理完成"
```

**示例 4：批量执行命令**

```bash
#!/bin/bash
hosts="192.168.1.100 192.168.1.101 192.168.1.102"
for host in $hosts; do
    echo "=== $host ==="
    ssh root@$host "df -h | grep -v tmpfs"
done
```

---

## 十五、测试场景实战

### 15.1 场景一：部署被测应用

```bash
# Step 1：上传安装包
scp app.tar.gz root@192.168.1.100:/opt/

# Step 2：登录服务器
ssh root@192.168.1.100

# Step 3：解压
cd /opt
tar -xzvf app.tar.gz

# Step 4：修改配置
cd app
vim application.yml
# 或直接 sed 修改
sed -i 's/127.0.0.1/192.168.1.200/g' application.yml

# Step 5：启动
nohup java -jar app.jar > app.log 2>&1 &

# Step 6：验证启动成功
tail -f app.log
curl http://localhost:8080/health
```

### 15.2 场景二：性能测试监控

性能测试时，开多个终端窗口监控：

```bash
# 窗口 1：CPU + 内存
top

# 窗口 2：磁盘 IO
iostat -x 1

# 窗口 3：网络流量
sar -n DEV 1

# 窗口 4：应用日志
tail -f /opt/app/logs/app.log | grep -E "ERROR|slow"

# 窗口 5：连接数变化
watch -n 1 'netstat -ant | grep ESTABLISHED | wc -l'

# 窗口 6：JVM 监控（Java 应用）
jstat -gc <pid> 1000
```

### 15.3 场景三：排查接口超时

```bash
# Step 1：确认接口确实超时
time curl http://api.example.com/order/list

# Step 2：查看应用日志
tail -f /opt/app/logs/app.log | grep "OrderController"

# Step 3：检查 CPU/内存
top
free -h

# Step 4：检查数据库连接数
netstat -ant | grep 3306 | wc -l

# Step 5：检查依赖服务
curl -o /dev/null -s -w "%{http_code} %{time_total}s\n" http://downstream/api

# Step 6：查 GC 情况（Java）
jstat -gcutil <pid> 1000

# Step 7：抓线程栈分析
jstack <pid> > thread.dump
```

### 15.4 场景四：测试数据清理

```bash
#!/bin/bash
# 清理测试环境数据脚本

# 1. 清理应用日志（保留 3 天）
find /opt/app/logs -name "*.log.*" -mtime +3 -delete

# 2. 清理临时文件
rm -rf /tmp/test_*

# 3. 清理上传的测试图片
rm -rf /data/upload/test_*

# 4. 重置数据库（谨慎！）
mysql -uroot -p123456 testdb < /opt/scripts/reset.sql

# 5. 清空 Redis 缓存
redis-cli -h 192.168.1.100 -p 6379 FLUSHDB

echo "$(date) - 测试数据清理完成"
```

### 15.5 场景五：日志关键信息提取

```bash
# 提取所有 traceId
grep -oE 'traceId=[a-z0-9]+' app.log | sort -u

# 提取所有出错的接口
grep "ERROR" app.log | awk '{print $7}' | sort | uniq -c | sort -rn

# 提取最慢的 10 个接口
grep "slow" app.log | awk -F'cost=' '{print $2}' | sort -rn | head -10

# 统计每分钟的请求数（推算 QPS）
awk '{print $1, substr($2,1,5)}' access.log | sort | uniq -c

# 统计 HTTP 状态码
awk '{print $9}' access.log | sort | uniq -c | sort -rn

# 找出访问量 Top 10 的 URL
awk '{print $7}' access.log | sort | uniq -c | sort -rn | head -10

# 找出请求量 Top 10 的 IP
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -10
```

### 15.6 场景六：远程批量操作

```bash
# 通过 SSH 批量查看多台服务器状态
for ip in 192.168.1.{100..110}; do
    echo "=== $ip ==="
    ssh root@$ip "uptime; df -h /; free -h | head -2"
    echo ""
done

# 批量重启服务
for ip in 192.168.1.{100..110}; do
    echo "重启 $ip 的 nginx"
    ssh root@$ip "systemctl restart nginx && systemctl status nginx --no-pager"
done
```

---

## 十六、常见问题排查

### 16.1 磁盘满了

```bash
# Step 1：查看磁盘使用
df -h

# Step 2：找占用最大的目录
du -h --max-depth=1 / 2>/dev/null | sort -h

# Step 3：找大文件
find / -type f -size +1G 2>/dev/null

# Step 4：常见占用大户
du -sh /var/log/*
du -sh /tmp/*
du -sh /opt/*/logs/*

# Step 5：清理日志
> /var/log/app.log              # 清空但不删文件（推荐，避免应用句柄失效）

# 注意：rm 删除大文件后磁盘可能不释放
# 因为进程还持有文件句柄，需重启进程或：
lsof | grep deleted             # 找出已删除但被持有的文件
```

### 16.2 服务起不来

```bash
# Step 1：查看错误日志
journalctl -u nginx -n 50
tail -100 /var/log/nginx/error.log

# Step 2：检查端口占用
netstat -anp | grep 8080
lsof -i:8080

# Step 3：检查配置文件
nginx -t                        # nginx 配置测试

# Step 4：检查权限
ls -l /opt/app/
ls -l /var/log/

# Step 5：检查 SELinux（CentOS）
getenforce
setenforce 0                    # 临时关闭测试
```

### 16.3 内存爆了

```bash
# 看内存使用排行
ps aux --sort=-%mem | head -10

# 看 OOM 日志
dmesg | grep -i "out of memory"
grep -i "killed process" /var/log/messages

# 释放缓存（谨慎）
sync && echo 3 > /proc/sys/vm/drop_caches
```

### 16.4 CPU 飙高

```bash
# 找最耗 CPU 的进程
top -o %CPU

# 看 Java 进程内哪个线程耗 CPU
top -H -p <pid>
# 记下 TID（线程 ID），转 16 进制
printf "%x\n" <tid>
# 用 jstack 查看
jstack <pid> | grep -A 30 <16 进制 tid>
```

### 16.5 网络不通

```bash
# Step 1：ping
ping 192.168.1.100

# Step 2：端口
telnet 192.168.1.100 8080
nc -zv 192.168.1.100 8080

# Step 3：防火墙
firewall-cmd --list-all
iptables -L -n

# Step 4：路由
traceroute 192.168.1.100
ip route

# Step 5：DNS
nslookup baidu.com
cat /etc/resolv.conf
```

### 16.6 中文乱码

```bash
# 查看当前编码
locale

# 临时设置
export LANG=zh_CN.UTF-8

# 永久设置（仅影响交互 shell）
echo "export LANG=zh_CN.UTF-8" >> ~/.bashrc
source ~/.bashrc

# 系统级永久设置（影响所有登录、cron、systemd）
# CentOS/RHEL：
# sudo localectl set-locale LANG=zh_CN.UTF-8
# Ubuntu/Debian：
# sudo update-locale LANG=zh_CN.UTF-8
```

> bashrc 仅对交互式 shell 生效，cron 任务、systemd 服务不受影响。要全局生效用 `localectl` / `update-locale`，或修改 `/etc/locale.conf`。

### 16.7 找不到命令

```bash
# 查看命令是否存在
which ls
type ls

# 查看 PATH
echo $PATH

# 添加到 PATH（临时）
export PATH=$PATH:/opt/app/bin

# 永久添加
echo 'export PATH=$PATH:/opt/app/bin' >> ~/.bashrc
source ~/.bashrc
```

---

## 十七、进阶建议

### 17.1 学习路径

```
基础命令 → 文本三剑客 → 日志分析 → 进程服务 → 性能监控 
→ Shell 脚本 → 自动化运维 → Docker → Kubernetes
```

### 17.2 配套工具推荐

| 工具 | 用途 |
|------|------|
| **Tmux** | 终端复用，断网保持会话 |
| **Zsh + Oh-my-zsh** | 强化版 shell |
| **fzf** | 命令行模糊查找 |
| **bat** | 增强版 cat |
| **ncdu** | 交互式磁盘分析 |
| **lazygit** | Git 终端 UI |
| **Ansible** | 批量配置管理 |
| **Docker** | 容器化测试环境 |

### 17.3 常用速查表

测试人员每天可能用到的 Top 20 命令：

```bash
ls          # 列文件
cd          # 切目录
pwd         # 当前路径
cat         # 看文件
tail -f     # 跟踪日志
grep        # 过滤
ps -ef      # 查进程
top         # 监控
df -h       # 磁盘
free -h     # 内存
netstat     # 网络
curl        # 接口测试
vim         # 编辑
chmod       # 权限
chown       # 所有者
find        # 查文件
tar         # 压缩
scp         # 传文件
ssh         # 登录
systemctl   # 服务
```

### 17.4 最佳实践

1. **登录服务器前确认是哪台**：测试环境和生产环境的命令是危险的
2. **rm 前先 ls**：`rm -rf` 前用 `ls` 确认路径
3. **修改配置前先备份**：`cp config.yml config.yml.bak`
4. **生产环境只读**：测试人员通常没有生产 write 权限，遵守规范
5. **善用 history**：复杂命令拷贝复用，避免敲错
6. **不会的命令先 `--help`**：而不是上来就执行
7. **测试脚本先在测试机跑**：脚本可能误删数据

---

## 附录：参考资料

- 鸟哥的 Linux 私房菜：`http://linux.vbird.org/`
- Linux 命令大全：`https://man.linuxde.net/`
- ExplainShell（解释命令）：`https://explainshell.com/`
- TLDR（命令速查）：`https://tldr.sh/`

---

> **文档说明：** 本教程基于 CentOS 7 / Ubuntu 20.04 编写，多数命令在其他主流发行版通用。
> 
> **测试纪律：** 操作生产环境务必经过申请审批，禁止在生产环境执行未经评审的 Shell 脚本，禁止使用 root 账户进行日常测试操作。`rm -rf` 命令使用前务必三思。
