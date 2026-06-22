---
description: Linux 面试题，常用命令、日志排查、进程管理和权限管理。
---
# Linux 面试题

Linux 面试重点包括常用命令、日志排查、进程管理、权限管理和网络排查。

## 怎么在 Linux 中查看日志？

```text
常用命令：

1. 实时查看（最常用）
   tail -f app.log
   tail -n 200 -f app.log  # 先显示后 200 行再跟踪

2. 搜索关键字
   grep "ERROR" app.log
   grep -n "ERROR" app.log  # 显示行号
   grep -A 5 "ERROR" app.log  # 显示匹配行后 5 行

3. 分页查看
   less app.log  # 推荐，支持搜索和翻页

4. 看头/尾
   head -n 50 app.log  # 前 50 行
   tail -n 50 app.log  # 后 50 行
```

## 怎么查找并杀死进程？

```text
查找进程：
ps -ef | grep java
ps aux | grep nginx

杀死进程：
kill PID              # 发送 TERM 信号（友好退出）
kill -9 PID           # 强制杀死
killall nginx         # 按名称杀
pkill -f "java.*MyApp"  # 按命令行匹配杀

组合命令：
ps -ef | grep java | grep -v grep | awk '{print $2}' | xargs kill -9
```

## 文件权限 755 和 644 是什么意思？

```text
权限由 3 组数字组成：所有者 | 所属组 | 其他用户

数字含义：
4 = 读（r）
2 = 写（w）
1 = 执行（x）
相加：7 = rwx, 6 = rw-, 5 = r-x, 4 = r--

755 = rwxr-xr-x
  所有者：读+写+执行
  所属组：读+执行
  其他用户：读+执行
  用途：脚本文件

644 = rw-r--r--
  所有者：读+写
  所属组：只读
  其他用户：只读
  用途：配置文件

600 = rw-------
  只有所有者可读写
  用途：密钥文件
```

## 怎么查看磁盘和内存使用情况？

```text
磁盘：
df -h                # 查看磁盘空间
du -h --max-depth=1  # 查看当前目录各子目录大小

内存：
free -h              # 查看内存使用
free -m              # 以 MB 为单位

CPU：
top                  # 实时监控
htop                 # 更友好的监控工具

组合：
du -h --max-depth=1 / 2>/dev/null | sort -h  # 按大小排序
```

## nohup 命令是什么？怎么用？

```text
nohup = no hang up，终端关闭后进程不退出

用法：
nohup ./startup.sh > app.log 2>&1 &

拆解：
  nohup        终端关闭后不退出
  ./startup.sh 要执行的脚本
  > app.log    标准输出写入 app.log
  2>&1         标准错误也重定向到标准输出
  &            放到后台运行

查看后台任务：jobs
切回前台：fg %1
```

## 怎么查看端口被谁占用？

```text
Linux：
netstat -anp | grep 8080
ss -tlnp | grep 8080
lsof -i:8080

Windows：
netstat -ano | findstr :8080
tasklist | findstr <PID>

参数说明：
netstat -anp：显示所有连接（-a）、数字显示（-n）、显示进程（-p）
ss -tlnp：显示 TCP 监听（-t）、监听状态（-l）、数字（-n）、进程（-p）
```

## 软链接和硬链接有什么区别？

```text
软链接（Symbolic Link）：
- 类似 Windows 的快捷方式
- 可以跨文件系统
- 可以链接目录
- 删除原文件，软链接失效
- ln -s source link_name

硬链接（Hard Link）：
- 和原文件共享同一个 inode
- 不能跨文件系统
- 不能链接目录
- 删除原文件，硬链接仍可用
- ln source link_name
```

## crontab 怎么配置定时任务？

```text
语法：
* * * * * command
│ │ │ │ │
│ │ │ │ └── 星期几（0-6，0=周日）
│ │ │ └──── 月份（1-12）
│ │ └────── 日期（1-31）
│ └──────── 小时（0-23）
└────────── 分钟（0-59）

示例：
* * * * *        每分钟
0 2 * * *        每天凌晨 2 点
*/5 * * * *      每 5 分钟
0 9 * * 1-5      工作日上午 9 点

命令：
crontab -e       编辑定时任务
crontab -l       查看定时任务
crontab -r       删除所有定时任务
```

## 面试评分参考

| 维度 | 初级（1-2年） | 中级（3-5年） |
|------|-------------|-------------|
| 基本操作 | 会文件操作、查看日志 | 能用 awk/sed 处理日志 |
| 进程管理 | 会查进程、杀进程 | 能分析进程状态、排查卡死 |
| 权限管理 | 知道 chmod 用法 | 能配置用户和权限组 |
| 网络排查 | 会 ping、telnet | 能用 tcpdump 抓包分析 |
