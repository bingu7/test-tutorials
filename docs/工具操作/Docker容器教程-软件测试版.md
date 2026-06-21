---
description: Docker 容器教程，镜像操作、Compose 和测试环境搭建。
---
# Docker 容器教程（软件测试人员专用）

> 本教程面向软件测试工程师，聚焦测试日常使用场景：快速搭建测试环境、隔离依赖、统一团队环境、CI 集成。

---

## 前置要求

| 项目 | 要求 | 获取方式 |
|------|------|----------|
| Linux 基础 | 熟悉命令行操作、文件系统和进程管理 | [Linux实用教程-软件测试版](../工具操作/Linux实用教程-软件测试版.md) |

---

## 新手导读

Docker 对新手来说可以先理解成“把环境打包起来运行”。测试人员使用 Docker，主要是为了快速启动数据库、缓存、接口服务或自动化运行环境。

第一遍重点掌握：

1. 镜像和容器的区别。
2. 如何 `docker run` 启动一个服务。
3. 如何查看日志和进入容器。
4. 如何用 Docker Compose 同时启动多个服务。
5. 如何停止和清理测试环境。

不要一开始就纠结镜像分层和底层网络，先把常用服务跑起来、会看日志、会排查端口占用。

### 版本与维护说明

| 项目 | 说明 |
|------|------|
| 适用工具 | Docker Engine、Docker Desktop、Docker Compose |
| 使用建议 | 新手优先掌握 `docker run`、日志查看、端口映射和 Compose 编排 |
| 更新提醒 | 安装方式、Compose 命令和 Linux 发行版仓库会变化，安装前以 Docker 官方文档为准 |

---
## 一、Docker 基础

### 1.1 什么是 Docker

Docker 是开源的应用容器引擎，将应用及其依赖打包成"容器"，实现 **一次构建，到处运行**。

### 1.2 测试人员为什么要学 Docker

| 场景 | 价值 |
|------|------|
| 快速搭建测试环境 | 一条命令起 MySQL、Redis |
| 隔离依赖 | 不污染本机环境 |
| 团队环境统一 | 避免"我电脑能跑" |
| 多版本测试 | 同时跑 JDK 8、11、17 |
| Mock 服务 | 快速启动假接口 |
| CI 集成 | 与 Jenkins/GitHub Actions 配合 |
| 跨平台 | Windows/Mac/Linux 都能运行 |

### 1.3 Docker vs 虚拟机

```
虚拟机（VM）                    Docker
┌──────────────┐              ┌──────────────┐
│   App A      │              │   App A      │
├──────────────┤              ├──────────────┤
│ Bins/Libs    │              │ Bins/Libs    │
├──────────────┤              ├──────────────┤
│  Guest OS    │              │              │
├──────────────┤              ├──────────────┤
│  Hypervisor  │              │ Docker Engine│
├──────────────┤              ├──────────────┤
│   Host OS    │              │   Host OS    │
└──────────────┘              └──────────────┘
重 / 启动慢                   轻 / 秒级启动
```

| 维度 | VM | Docker |
|------|----|----|
| 启动 | 分钟级 | 秒级 |
| 大小 | GB 级 | MB 级 |
| 资源 | 占用大 | 占用小 |
| 隔离性 | 强 | 中等 |
| 性能 | 较差 | 接近裸机 |

### 1.4 核心概念

```
镜像（Image）：模板（类）
    ↓ docker run
容器（Container）：实例（对象）
```

- **Image（镜像）**：只读模板，包含应用 + 依赖 + 配置
- **Container（容器）**：镜像的运行实例
- **Registry（仓库）**：镜像存储中心（如 Docker Hub）
- **Dockerfile**：定义镜像的脚本
- **Volume（卷）**：持久化数据
- **Network（网络）**：容器间通信

### 1.5 工作流程

```
Dockerfile → docker build → Image → docker push → Registry
                                  ↓ docker pull
                                Image → docker run → Container
```

---

## 二、安装与配置

### 2.1 Windows / Mac

下载 **Docker Desktop**：`https://www.docker.com/products/docker-desktop`

- 双击安装
- 启动后状态栏出现 Docker 图标（鲸鱼）
- 自动开机启动

!!! warning "注意"
    Windows 需要开启 Hyper-V 或 WSL2。

### 2.2 Linux

```bash
# Ubuntu（系统仓库版本较旧）
sudo apt update
sudo apt install docker.io

# CentOS（推荐 Docker 官方仓库的 docker-ce，系统自带 docker 包已过时）
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io

# 通用一键脚本（最简单，安装最新 docker-ce）
curl -fsSL https://get.docker.com | sudo sh

# 启动
sudo systemctl start docker
sudo systemctl enable docker

# 普通用户免 sudo
sudo usermod -aG docker $USER
# 退出重登
```

> **curl 参数说明：**
>
> | 参数 | 含义 |
> |------|------|
> | `-f` | 请求失败时返回错误码（而非输出 HTML 错误页） |
> | `-s` | 静默模式，不显示进度条和错误信息 |
> | `-S` | 配合 `-s` 使用，出错时仍显示错误信息 |
> | `-L` | 跟随 HTTP 重定向（301/302）自动跳转 |

### 2.3 验证安装

```bash
docker --version
docker info
docker run hello-world      # 跑测试容器
```

`docker run hello-world` 输出示例：

```
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
 3. The Docker daemon created a new container from that image.
 4. The Docker daemon streamed that output to the Docker client.
```

### 2.4 配置镜像加速

国内访问 Docker Hub 慢，配置镜像加速器：

**编辑 `/etc/docker/daemon.json`（Linux）或 Docker Desktop 设置：**

```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
```

**重启 Docker：**

```bash
sudo systemctl restart docker
```

### 2.5 Docker Hub 账号（可选）

- 注册：`https://hub.docker.com`
- 登录：`docker login`

---

## 三、镜像操作

### 3.1 搜索镜像

```bash
docker search mysql
docker search nginx
```

### 3.2 拉取镜像

```bash
# 拉默认 latest 标签
docker pull mysql

# 拉指定版本
docker pull mysql:8.0
docker pull mysql:5.7

# 从指定仓库拉
docker pull registry.example.com/myapp:v1.0
```

### 3.3 查看本地镜像

```bash
docker images
docker image ls          # 等价
docker images mysql      # 过滤
```

输出示例：

```
REPOSITORY   TAG    IMAGE ID       CREATED       SIZE
mysql        8.0    abc123def456   2 weeks ago   500MB
nginx        latest 789ghi012jkl   1 month ago   140MB
```

### 3.4 删除镜像

```bash
docker rmi mysql:8.0
docker rmi abc123          # 用 ID 删除
docker rmi -f mysql:8.0    # 强制删除（容器在用也删）

# 删除所有 dangling 镜像（无 tag 的）
docker image prune
docker image prune -a      # 删所有未使用镜像
```

### 3.5 查看镜像详情

```bash
docker inspect mysql:8.0
docker history mysql:8.0    # 看构建历史
```

### 3.6 镜像导入导出

适合无网络环境迁移：

```bash
# 导出
docker save -o mysql.tar mysql:8.0

# 导入
docker load -i mysql.tar
```

---

## 四、容器操作

### 4.1 启动容器（最常用）

```bash
docker run [options] image [command]
```

**简单示例：**

```bash
# 前台运行
docker run hello-world

# 后台运行
docker run -d nginx

# 端口映射
docker run -d -p 8080:80 nginx
# 本机 8080 映射到容器 80

# 命名容器
docker run -d --name mynginx -p 8080:80 nginx

# 交互式（进入 shell）
docker run -it ubuntu /bin/bash
```

**常用参数：**

| 参数 | 含义 |
|------|------|
| `-d` | 后台运行 |
| `-i` | 交互式 |
| `-t` | 分配 tty |
| `-p` | 端口映射 hostPort:containerPort |
| `-P` | 随机端口映射 |
| `--name` | 容器名 |
| `-v` | 挂载卷 hostPath:containerPath |
| `-e` | 环境变量 |
| `--network` | 指定网络 |
| `--rm` | 退出自动删除 |
| `--restart=always` | 自动重启 |
| `-w` | 工作目录 |
| `--cpus` | CPU 限制 |
| `--memory` | 内存限制 |

### 4.2 查看容器

```bash
# 运行中的容器
docker ps
# 输出示例：
# CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS                    NAMES
# a1b2c3d4e5f6   nginx     "/docker-entrypoint.…"   5 minutes ago   Up 5 minutes   0.0.0.0:8080->80/tcp     mynginx
# f6e5d4c3b2a1   mysql     "docker-entrypoint.s…"   2 hours ago     Up 2 hours     0.0.0.0:3306->3306/tcp   mysql_test

# 所有容器（含已停止）
docker ps -a

# 只显示 ID
docker ps -q

# 输出格式自定义
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### 4.3 启动/停止/重启

```bash
docker start mynginx
docker stop mynginx
docker restart mynginx
docker kill mynginx          # 强制停止
docker pause mynginx         # 暂停
docker unpause mynginx
```

### 4.4 删除容器

```bash
docker rm mynginx              # 删已停止
docker rm -f mynginx           # 强制删（运行中也删）

# 删所有已停止
docker container prune

# 删所有容器
docker rm -f $(docker ps -aq)
```

### 4.5 进入容器

```bash
# 进入运行中容器
docker exec -it mynginx /bin/bash
docker exec -it mynginx /bin/sh    # 没 bash 时用 sh

# 进入后做啥都行：cd、ls、cat...
# 退出：exit
```

### 4.6 查看日志

```bash
docker logs mynginx
# 输出示例：
# /docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
# /docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
# Starting nginx: nginx.

docker logs -f mynginx          # 实时跟踪
docker logs --tail 100 mynginx  # 看最后 100 行
docker logs -t mynginx          # 显示时间戳
docker logs --since 10m mynginx # 最近 10 分钟
```

### 4.7 查看容器详情

```bash
docker inspect mynginx
docker inspect --format='{{.NetworkSettings.IPAddress}}' mynginx

# 资源使用
docker stats                    # 实时
docker stats --no-stream        # 一次快照
# 输出示例：
# CONTAINER ID   NAME       CPU %   MEM USAGE / LIMIT   MEM %   NET I/O         BLOCK I/O       PIDS
# a1b2c3d4e5f6   mynginx    0.00%   2.5MiB / 7.7GiB     0.03%   1.2kB / 0B      0B / 0B         2
# f6e5d4c3b2a1   mysql_test 0.12%   210MiB / 7.7GiB     2.67%   5.6kB / 3.2kB   12MB / 0B       38

# 进程
docker top mynginx
```

### 4.8 文件传输

```bash
# 本机 → 容器
docker cp test.sql mysql_test:/tmp/

# 容器 → 本机
docker cp mysql_test:/var/log/mysql/error.log ./
```

### 4.9 提交为镜像

容器中修改后，保存为新镜像：

```bash
docker commit -m "add test data" mysql_test mysql_with_data:v1
```

!!! tip "建议"
    不推荐这种方式，应该用 Dockerfile（可重复、可追溯）。

---

## 五、Dockerfile 编写

### 5.1 Dockerfile 是什么

定义镜像的脚本文件，每行一条指令。

### 5.2 第一个 Dockerfile

创建文件 `Dockerfile`：

```dockerfile
# 基础镜像
FROM python:3.10-slim

# 工作目录
WORKDIR /app

# 复制文件
COPY requirements.txt .

# 安装依赖
RUN pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

# 复制源码
COPY . .

# 暴露端口
EXPOSE 5000

# 启动命令
CMD ["python", "app.py"]
```

**构建镜像：**

```bash
docker build -t myapp:v1 .
# . 表示当前目录为构建上下文
```

> **docker build 参数说明：**
>
> | 参数 | 含义 |
> |------|------|
> | `-t` | 为镜像指定名称和标签（格式：`名称:标签`） |
> | `.` | 指定构建上下文路径，Docker 会将该目录下的文件发送给守护进程 |

**运行：**

```bash
docker run -d -p 5000:5000 myapp:v1
```

### 5.3 常用指令

**FROM：** 基础镜像

```dockerfile
FROM ubuntu:22.04
FROM python:3.10-slim
FROM openjdk:11-jre
FROM nginx:alpine
```

**WORKDIR：** 工作目录

```dockerfile
WORKDIR /app
# 后续命令都在 /app 下执行
```

**COPY / ADD：** 复制文件

```dockerfile
COPY src/ /app/src/
COPY requirements.txt .

# ADD 可以解压 tar，下载 URL（不推荐用 URL）
ADD app.tar.gz /app/
```

**RUN：** 构建时执行命令

```dockerfile
RUN apt-get update && apt-get install -y curl
RUN pip install -r requirements.txt
RUN mkdir -p /var/log/app

# 多条命令合并（减少层数）
RUN apt-get update && \
    apt-get install -y curl vim && \
    rm -rf /var/lib/apt/lists/*
```

**ENV：** 环境变量

```dockerfile
ENV APP_ENV=production
ENV DB_HOST=mysql
ENV TZ=Asia/Shanghai
```

**EXPOSE：** 声明端口（仅文档作用）

```dockerfile
EXPOSE 8080
EXPOSE 80 443
```

**VOLUME：** 数据卷

```dockerfile
VOLUME ["/var/log", "/var/data"]
```

**USER：** 切换用户

```dockerfile
RUN useradd -m appuser
USER appuser
```

**ARG：** 构建参数

```dockerfile
ARG VERSION=1.0
ENV APP_VERSION=$VERSION
# 构建时：docker build --build-arg VERSION=2.0 -t myapp .
```

**CMD vs ENTRYPOINT：** 启动命令

```dockerfile
# CMD：默认命令，可被覆盖
CMD ["python", "app.py"]

# ENTRYPOINT：固定入口，参数可追加
ENTRYPOINT ["python"]
CMD ["app.py"]
# 启动等价于：python app.py
# docker run myapp other.py → python other.py
```

### 5.4 Dockerfile 完整示例

**Python 接口自动化测试：**

```dockerfile
FROM python:3.10-slim

LABEL maintainer="tester@company.com"
LABEL description="API automation test image"

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple

WORKDIR /app

# 系统依赖
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        git \
        wget && \
    rm -rf /var/lib/apt/lists/*

# 安装 Allure：构建前可到 releases 页面确认最新稳定版
ARG ALLURE_VERSION=2.30.0
RUN wget -O allure.tgz https://github.com/allure-framework/allure2/releases/download/${ALLURE_VERSION}/allure-${ALLURE_VERSION}.tgz && \
    tar -zxvf allure.tgz -C /opt && \
    ln -sf /opt/allure-${ALLURE_VERSION}/bin/allure /usr/local/bin/allure && \
    rm allure.tgz

# Python 依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 源码
COPY . .

CMD ["pytest", "--alluredir=./allure-results"]
```

**构建并运行：**

```bash
docker build -t api-test:v1 .
docker run --rm -v $(pwd)/reports:/app/allure-results api-test:v1
```

> **参数说明：**
>
> | 参数 | 含义 |
> |------|------|
> | `-t api-test:v1` | 为镜像命名为 `api-test`，标签为 `v1` |
> | `--rm` | 容器退出后自动删除（适合一次性测试任务） |
> | `-v $(pwd)/reports:/app/allure-results` | 将宿主机的 `reports` 目录挂载到容器内，用于收集测试报告 |

### 5.5 优化建议

**1. 合并 RUN：** 减少镜像层数

```dockerfile
# ❌ 多层
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y vim

# ✅ 合并
RUN apt-get update && \
    apt-get install -y curl vim && \
    rm -rf /var/lib/apt/lists/*
```

**2. 利用缓存：** 不常变的放前面

```dockerfile
# ✅ 先复制 requirements，依赖变化少
COPY requirements.txt .
RUN pip install -r requirements.txt

# 后复制源码
COPY . .
```

**3. 使用 `.dockerignore`：** 排除不需要的文件

```
# .dockerignore
.git
.idea
__pycache__
*.pyc
.env
node_modules
*.log
reports/
```

**4. 多阶段构建：** 减小最终镜像

```dockerfile
# 构建阶段
FROM golang:1.20 AS builder
WORKDIR /src
COPY . .
RUN go build -o app

# 运行阶段
FROM alpine:latest
COPY --from=builder /src/app /app
CMD ["/app"]
```

**5. 选择小镜像：** 用 alpine 或 slim

```dockerfile
FROM python:3.10           # ~900MB
FROM python:3.10-slim      # ~120MB
FROM python:3.10-alpine    # ~50MB
```

---

## 六、数据卷与持久化

### 6.1 为什么需要卷

容器内的数据，**容器删除后会丢失**。需要持久化的数据（数据库、日志、配置）要用卷。

### 6.2 三种挂载方式

**方式 1：Bind Mount（绑定挂载，最常用）**

宿主机路径 ↔ 容器路径：

```bash
docker run -d \
  -v /host/data:/var/lib/mysql \
  mysql:8.0

# Windows
docker run -d -v D:/data:/var/lib/mysql mysql:8.0
```

**方式 2：Volume（卷，Docker 管理）**

```bash
# 创建卷
docker volume create mysql_data

# 使用
docker run -d -v mysql_data:/var/lib/mysql mysql:8.0

# 查看卷
docker volume ls
docker volume inspect mysql_data

# 删除卷
docker volume rm mysql_data
docker volume prune          # 删未使用的
```

**方式 3：tmpfs（内存挂载）**

临时数据，重启即丢：

```bash
docker run -d --tmpfs /tmp nginx
```

### 6.3 挂载只读

```bash
docker run -v /host/config:/etc/nginx:ro nginx
# ro = read-only
```

### 6.4 测试常见挂载

```bash
# 挂载配置文件
docker run -d \
  -v $(pwd)/my.cnf:/etc/mysql/my.cnf:ro \
  mysql:8.0

# 挂载初始化脚本
docker run -d \
  -v $(pwd)/init.sql:/docker-entrypoint-initdb.d/init.sql:ro \
  mysql:8.0

# 挂载日志目录
docker run -d \
  -v $(pwd)/logs:/var/log/nginx \
  nginx
```

---

## 七、网络管理

### 7.1 默认网络

```bash
docker network ls
```

输出示例：

```
NETWORK ID     NAME      DRIVER    SCOPE
8a7b6c5d4e3f   bridge    bridge    local
1f2e3d4c5b6a   host      host      local
9c8b7a6f5e4d   none      null      local
```

| 网络 | 用途 |
|------|------|
| `bridge` | 默认，单机容器互通 |
| `host` | 共享宿主机网络 |
| `none` | 无网络 |

### 7.2 端口映射

```bash
# -p hostPort:containerPort
docker run -d -p 8080:80 nginx
# 访问 http://localhost:8080

# 指定主机 IP
docker run -d -p 192.168.1.100:8080:80 nginx

# 随机端口
docker run -d -P nginx
docker port <container>     # 查看映射
```

### 7.3 自定义网络

容器间互通推荐用自定义 bridge：

```bash
# 创建网络
docker network create mynet

# 启动容器加入网络
docker run -d --name mysql --network mynet mysql:8.0
docker run -d --name app --network mynet myapp

# app 容器可通过名字访问 mysql：
# DB_HOST=mysql:3306
```

### 7.4 网络模式 host

容器与宿主机共享网络（无端口映射）：

```bash
docker run -d --network host nginx
# 直接访问宿主机 80 端口
```

### 7.5 容器间通信

```bash
# 同网络下，容器名作为 hostname
docker exec app ping mysql

# 不同网络需要连接：
docker network connect mynet mycontainer
```

---

## 八、Docker Compose

### 8.1 为什么需要

启动多容器应用（如 App + MySQL + Redis）用命令行太繁琐，Docker Compose 用 YAML 一键管理。

### 8.2 安装

Docker Desktop 自带。Linux 单独装 V2 插件（推荐）：

```bash
# Ubuntu/Debian
sudo apt install docker-compose-plugin

# CentOS
sudo yum install docker-compose-plugin

# 验证
docker compose version
```

!!! warning "注意"
    旧的独立二进制 `docker-compose`（V1，命令带短横）已停止维护，应使用 `docker compose`（V2，作为 docker 子命令）。本教程后续示例都用 `docker compose`。

### 8.3 第一个 docker-compose.yml

!!! info "兼容性说明"
    Compose V2 已忽略 `version` 字段并发出弃用警告，新写的文件不要再加。本教程保留作示意，实际可删。

```yaml
# version: '3.8'    # V2 已弃用，可删除

services:
  mysql:
    image: mysql:8.0
    container_name: my_mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: testdb
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7
    container_name: my_redis
    restart: always
    ports:
      - "6379:6379"

  app:
    build: .
    container_name: my_app
    depends_on:
      - mysql
      - redis
    environment:
      DB_HOST: mysql
      DB_PORT: 3306
      REDIS_HOST: redis
    ports:
      - "8080:8080"

volumes:
  mysql_data:
```

### 8.4 常用命令

```bash
# 启动所有服务（后台）
docker compose up -d
# 输出示例：
# [+] Running 4/4
#  ✔ Network myproject_default   Created                          0.1s
#  ✔ Container my_mysql          Started                          2.3s
#  ✔ Container my_redis          Started                          0.8s
#  ✔ Container my_app            Started                          1.5s

# 停止
docker compose stop

# 启动已停止的
docker compose start

# 重启
docker compose restart

# 停止并删除容器
docker compose down

# 同时删除卷
docker compose down -v

# 看状态
docker compose ps
# 输出示例：
# NAME       IMAGE              COMMAND                  SERVICE    STATUS    PORTS
# my_mysql   mysql:8.0          "docker-entrypoint.s…"   mysql      running   0.0.0.0:3306->3306/tcp
# my_redis   redis:7            "docker-entrypoint.s…"   redis      running   0.0.0.0:6379->6379/tcp
# my_app     myproject-app      "python app.py"          app        running   0.0.0.0:8080->8080/tcp

# 看日志
docker compose logs
docker compose logs -f app          # 单个服务

# 进入容器
docker compose exec mysql bash

# 重建（Dockerfile 变了）
docker compose build
docker compose up -d --build
```

### 8.5 配置详解

```yaml
services:
  myapp:
    image: nginx:latest           # 用现有镜像
    # 或
    build:                        # 从 Dockerfile 构建
      context: .
      dockerfile: Dockerfile
      args:
        VERSION: 1.0
    
    container_name: my_app        # 容器名
    
    restart: always               # 重启策略
    # always / on-failure / unless-stopped / no
    
    ports:                        # 端口映射
      - "8080:80"
      - "443:443"
    
    environment:                  # 环境变量
      - APP_ENV=production
      - DB_HOST=mysql
    # 或
    env_file:
      - .env
    
    volumes:                      # 挂载
      - ./logs:/var/log
      - mydata:/data
    
    depends_on:                   # 启动顺序
      - mysql
      - redis
    
    networks:                     # 加入网络
      - mynet
    
    healthcheck:                  # 健康检查
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    
    deploy:                       # 资源限制
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

volumes:
  mydata:

networks:
  mynet:
    driver: bridge
```

---

## 九、测试环境搭建

### 9.1 一键起 MySQL

```bash
docker run -d \
  --name mysql_test \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=testdb \
  -e MYSQL_USER=test \
  -e MYSQL_PASSWORD=test123 \
  -p 3306:3306 \
  -v mysql_data:/var/lib/mysql \
  mysql:8.0

# 连接
docker exec -it mysql_test mysql -uroot -proot123
```

### 9.2 一键起 Redis

```bash
docker run -d \
  --name redis_test \
  -p 6379:6379 \
  redis:7

# 连接
docker exec -it redis_test redis-cli
```

### 9.3 一键起 RabbitMQ

```bash
docker run -d \
  --name rabbit_test \
  -p 5672:5672 \
  -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=admin \
  -e RABBITMQ_DEFAULT_PASS=admin \
  rabbitmq:3-management

# 管理界面：http://localhost:15672
```

### 9.4 一键起 MongoDB

```bash
docker run -d \
  --name mongo_test \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin \
  mongo:6
```

### 9.5 一键起 Elasticsearch

```bash
docker run -d \
  --name es_test \
  -p 9200:9200 \
  -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
  elasticsearch:8.10.0
```

!!! warning "注意"
    ES 默认堆内存较大，单机测试建议显式限制 `ES_JAVA_OPTS`，否则容易 OOM 或启动失败。

### 9.6 完整测试环境

`docker-compose.yml`：

```yaml
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: testdb
    ports: ["3306:3306"]
    volumes:
      - ./mysql/init.sql:/docker-entrypoint-initdb.d/init.sql
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:7
    ports: ["6379:6379"]

  rabbitmq:
    image: rabbitmq:3-management
    ports: ["5672:5672", "15672:15672"]
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: admin

  nginx:
    image: nginx:alpine
    ports: ["80:80"]
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf

volumes:
  mysql_data:
```

启动：

```bash
docker compose up -d
```

---

## 十、测试场景实战

### 10.1 场景一：跑接口自动化测试

将 Python 自动化项目容器化：

**Dockerfile：**

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt \
    -i https://pypi.tuna.tsinghua.edu.cn/simple

COPY . .

CMD ["pytest", "--alluredir=./allure-results", "-v"]
```

**执行：**

```bash
docker build -t api-test .
docker run --rm -v $(pwd)/reports:/app/allure-results api-test
```

### 10.2 场景二：多版本兼容性测试

测试代码在 Python 3.8 / 3.10 / 3.12 上是否兼容：

```bash
for ver in 3.8 3.10 3.12; do
  docker run --rm \
    -v $(pwd):/app -w /app \
    python:$ver \
    sh -c "pip install -r requirements.txt && pytest"
done
```

### 10.3 场景三：搭建 Selenium Grid

分布式 UI 测试环境：

```yaml
services:
  selenium-hub:
    image: selenium/hub:latest
    ports:
      - "4442:4442"
      - "4443:4443"
      - "4444:4444"

  chrome:
    image: selenium/node-chrome:latest
    shm_size: 2gb
    depends_on:
      - selenium-hub
    environment:
      SE_EVENT_BUS_HOST: selenium-hub
      SE_EVENT_BUS_PUBLISH_PORT: 4442
      SE_EVENT_BUS_SUBSCRIBE_PORT: 4443

  firefox:
    image: selenium/node-firefox:latest
    shm_size: 2gb
    depends_on:
      - selenium-hub
    environment:
      SE_EVENT_BUS_HOST: selenium-hub
      SE_EVENT_BUS_PUBLISH_PORT: 4442
      SE_EVENT_BUS_SUBSCRIBE_PORT: 4443
```

启动：

```bash
docker compose up -d --scale chrome=3 --scale firefox=2
```

Grid 控制台：`http://localhost:4444`

### 10.4 场景四：Mock 服务

启动 WireMock：

```bash
docker run -d \
  --name wiremock \
  -p 8080:8080 \
  -v $(pwd)/mappings:/home/wiremock/mappings \
  wiremock/wiremock
```

`mappings/get_user.json`:

```json
{
  "request": {
    "method": "GET",
    "url": "/api/user/1"
  },
  "response": {
    "status": 200,
    "headers": {"Content-Type": "application/json"},
    "jsonBody": {
      "id": 1,
      "name": "test user",
      "email": "test@example.com"
    }
  }
}
```

测试：

```bash
curl http://localhost:8080/api/user/1
```

### 10.5 场景五：测试环境快速重置

```bash
# 一键销毁
docker compose down -v

# 一键重建
docker compose up -d

# 重置一个服务
docker compose down mysql
docker compose up -d mysql
```

### 10.6 场景六：在 Jenkins 中用 Docker 跑测试

`Jenkinsfile`：

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t api-test:${BUILD_NUMBER} .'
            }
        }
        
        stage('Test') {
            steps {
                sh '''
                    docker run --rm \
                      -v $WORKSPACE/reports:/app/allure-results \
                      api-test:${BUILD_NUMBER}
                '''
            }
        }
    }
    
    post {
        always {
            sh 'docker rmi api-test:${BUILD_NUMBER} || true'
            allure results: [[path: 'reports']]
        }
    }
}
```

---

## 十一、常见问题排查

### 11.1 容器启动后立即退出

```bash
# 看日志
docker logs <container>

# 常见原因：
# 1. 容器主进程退出（前台程序结束）
# 2. CMD 配置错
# 3. 依赖未启动
```

### 11.2 端口占用

```bash
# 报错：port is already allocated（端口被占用）
# 找出是谁占了 8080 端口
netstat -anp | grep 8080        # Linux / Mac（显示进程 PID）
netstat -ano | findstr :8080    # Windows（显示 PID，再用 tasklist 查进程名）
lsof -i:8080                    # Linux / Mac（直接显示进程名，更直观）

# 找到后：改端口映射（如 -p 8081:80）或停止占用的程序
```

### 11.3 磁盘空间不足

```bash
# 看 Docker 占用
docker system df

# 一键清理
docker system prune -a       # 删未用镜像/容器/网络
docker system prune -a --volumes  # 含卷
```

### 11.4 容器无法访问外网

```bash
# 检查 DNS
docker run --rm alpine nslookup baidu.com

# 修复（Linux）
# 编辑 /etc/docker/daemon.json
{
  "dns": ["8.8.8.8", "114.114.114.114"]
}
sudo systemctl restart docker
```

### 11.5 容器间无法通信

```bash
# 检查是否同网络
docker network inspect bridge

# 用自定义网络
docker network create mynet
docker run -d --network mynet --name db mysql
docker run -d --network mynet --name app myapp
# app 中用 db:3306 连接
```

### 11.6 挂载目录权限问题

```bash
# 容器内写文件失败：Permission denied
# Linux 常见，UID 不匹配

# 方案 1：指定运行用户
docker run -u $(id -u):$(id -g) ...

# 方案 2：宿主机改权限
chmod -R 777 ./data
```

### 11.7 时区不对

```bash
# 容器时间是 UTC，要中国时间：
docker run -e TZ=Asia/Shanghai \
  -v /etc/localtime:/etc/localtime:ro \
  ...
```

### 11.8 镜像拉取慢

```bash
# 配置镜像加速器（前面已说）
# 临时用阿里源
docker pull registry.cn-hangzhou.aliyuncs.com/library/nginx
```

### 11.9 Docker 命令权限不足

```bash
# 报错：permission denied
# 加入 docker 组
sudo usermod -aG docker $USER
# 退出重登
```

### 11.10 容器健康但应用不健康

```bash
# 容器 running，但服务不可用
# 看日志
docker logs --tail 100 container

# 进容器排查
docker exec -it container bash
# 内部 curl localhost:8080
```

---

## 十二、最佳实践

### 12.1 开发测试规范

- 一个容器一个进程
- 镜像版本固定（用 `mysql:8.0`，不用 `mysql:latest`）
- 数据持久化用卷
- 配置外部化（环境变量、配置文件）
- 用 docker-compose 编排
- 定期清理资源

### 12.2 资源限制

```bash
docker run -d \
  --cpus="0.5" \           # 最多用 0.5 个 CPU
  --memory="512m" \        # 内存上限
  --memory-swap="1g" \     # 含 swap
  nginx
```

### 12.3 安全建议

- 不用 root 用户运行
- 不在镜像里放密码
- 镜像来源可信
- 及时更新基础镜像（修补漏洞）
- 不要 `--privileged`

### 12.4 命令速查

```bash
# 镜像
docker pull/push/build/tag/rmi/images/search/inspect

# 容器
docker run/start/stop/restart/rm/ps/logs/exec/inspect

# 卷
docker volume create/ls/inspect/rm/prune

# 网络
docker network create/ls/inspect/rm/connect

# Compose
docker compose up/down/start/stop/restart/ps/logs/exec/build

# 清理
docker system prune
docker volume prune
docker image prune
docker container prune
```

### 12.5 推荐学习资源

- 官方文档：`https://docs.docker.com/`
- Docker Hub：`https://hub.docker.com/`
- 《Docker 实践》《Docker 从入门到实践》
- Play with Docker（在线练习）：`https://labs.play-with-docker.com/`

---

!!! warning "测试纪律"
    Docker 容器是测试人员的瑞士军刀，正确使用能极大提升效率。但要养成清理习惯，避免磁盘占满；密码等敏感信息不要硬编码在 Dockerfile，用环境变量或秘钥管理。

---

## 下一步建议

<div class="tutorial-next-steps">

### 完成检查

学完本教程后，检查自己是否能做到：

- [ ] 能使用 docker pull 拉取镜像
- [ ] 能使用 docker run 启动容器
- [ ] 能使用 docker ps 查看容器
- [ ] 能使用 docker logs 查看容器日志
- [ ] 能使用 docker stop、docker rm 停止和删除容器
- [ ] 能使用 docker-compose 启动多容器服务
- [ ] 理解镜像和容器的区别

### 推荐下一步

根据你的学习进度，选择下一步：

1. **如果你想学 CI/CD**：学习 [Jenkins CI/CD](../持续集成/Jenkins-CICD教程-软件测试版.md)，掌握流水线搭建
2. **如果你想做项目实战**：进入 [CI/CD 自动化回归实战](../项目实战/CICD自动化回归实战.md)，把自动化接入流水线
3. **如果你想继续学工具**：学习 [Git 版本控制](Git版本控制教程-软件测试版.md)，掌握代码协作

### 通关检查

完成本阶段后，使用 [第2阶段-工具实战通关](../学习中心/第2阶段-工具实战通关.md) 检查是否可以进入下一阶段。

</div>
