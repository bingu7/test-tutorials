# Python + Requests + Allure 接口自动化教程（软件测试人员专用）

> 本教程面向软件测试工程师，系统讲解基于 Python 技术栈搭建接口自动化测试框架，覆盖从环境搭建、用例编写、数据驱动到 Allure 报告生成、CI/CD 集成的完整流程。

<div class="tutorial-meta">
    <span class="difficulty-badge difficulty-intermediate">📙 进阶难度</span>
    <span class="meta-item">⏱ 约 5 天</span>
    <span class="meta-item">📋 前置：Python 基础、接口测试基础</span>
    <span class="meta-item">🎯 目标：搭建完整的接口自动化测试框架</span>
</div>

| 项目 | 要求 | 获取方式 |
|------|------|----------|
| Python 基础 | 掌握变量、函数、类、文件读写、异常处理 | [Python基础教程-软件测试版](../基础理论/Python基础教程-软件测试版.md) |
| 接口测试基础 | 了解接口测试流程、用例设计方法 | [接口测试完整教程-软件测试版](../专项测试/接口测试完整教程-软件测试版.md) |

---

## 新手导读

这篇教程内容较长，新手不要一次性追完整框架。先完成“一个接口用例能运行、能断言、能出报告”这个小目标。

建议学习顺序：

1. 先学 Requests 发送 GET / POST 请求。
2. 再学 Pytest 如何识别和执行用例。
3. 然后学习 Fixture、参数化和配置文件。
4. 最后再加 Allure 报告、日志、数据驱动和 CI/CD。

如果你还不会 Python 基础和 Postman，建议先补这两部分，否则直接看框架会比较吃力。

### 版本与维护说明

| 项目 | 说明 |
|------|------|
| 适用技术栈 | Python 3.x、Requests、Pytest、Allure |
| 使用建议 | 示例以接口自动化思路为主，具体依赖版本以项目 `requirements.txt` 为准 |
| 更新提醒 | Pytest 插件、Allure 命令行和 CI Action 版本可能变化，落地前先用最小用例验证 |

---

## 最佳实践速查：推荐写法 vs 新手写法

| 场景 | 新手常见写法 | 推荐写法 | 原因 |
|------|--------------|----------|------|
| 请求地址 | 用例里硬编码完整 URL | 配置 `base_url`，请求封装拼接 path | 环境切换更安全 |
| 超时 | 不设置 timeout | 每个请求设置统一 timeout | 避免接口卡死导致用例挂住 |
| token | 写死 token | Fixture 动态登录获取 token | 避免 token 过期 |
| 断言 | 只断言 `status_code == 200` | 断言状态码、业务码、字段、数据变化 | 提高缺陷发现能力 |
| 测试数据 | 所有用例共用同一数据 | 独立数据或执行前准备数据 | 降低互相影响 |
| 日志 | 打印完整请求、响应、token | 脱敏输出关键字段 | 安全且易排查 |
| 用例依赖 | 用例按固定顺序执行 | 单接口用例独立，流程用例单独管理 | 减少连锁失败 |

不推荐：

```python
def test_login():
    r = requests.post(
        "https://api-test.example.com/api/login",
        json={"username": "test", "password": "123456"}
    )
    assert r.status_code == 200
```

推荐：

```python
def test_login_success(api_client):
    response = api_client.post(
        "/api/login",
        json={"username": "test", "password": "123456"},  # (1)
    )
    body = response.json()

    assert response.status_code == 200                     # (2)
    assert body["code"] == 0                               # (3)
    assert body["data"]["token"]                           # (4)
```

1. `json=` 会自动将字典序列化为 JSON 并设置 `Content-Type: application/json`，而 `data=` 发送的是表单编码
2. 断言 HTTP 状态码，确认请求本身没有网络层错误
3. 断言业务状态码，区分“请求成功但业务失败”（如密码错误返回 code=1001）
4. 断言关键字段存在，确保登录后确实返回了 token，否则后续接口调用会全部失败

接口自动化的价值不是“能发请求”，而是能稳定判断业务是否被破坏。

## 一、技术栈介绍

### 1.1 为什么选这个组合

| 工具 | 作用 | 优势 |
|------|------|------|
| **Python** | 编程语言 | 简洁易学，测试领域标配 |
| **Requests** | HTTP 请求库 | 接口测试事实标准，API 友好 |
| **Pytest** | 测试框架 | 用例编写灵活，插件生态丰富 |
| **Allure** | 测试报告 | 美观详细，支持步骤、附件、历史趋势 |
| **PyYAML** | 配置/数据驱动 | 可读性强，适合接口数据 |
| **Loguru** | 日志库 | 开箱即用，比标准库简单 |
| **Jenkins** | 持续集成 | 触发执行 + 展示报告 |

### 1.2 框架架构

```
┌─────────────────────────────────────────┐
│           测试用例层 (testcases/)         │
│   pytest 用例 + Allure 装饰器             │
├─────────────────────────────────────────┤
│           业务封装层 (apis/)              │
│   接口请求封装（登录、订单、用户等）         │
├─────────────────────────────────────────┤
│           基础工具层 (common/)            │
│   HTTP 请求、断言、日志、读配置、读数据      │
├─────────────────────────────────────────┤
│      数据/配置 (data/, config/)          │
│   YAML 用例数据、环境配置                  │
└─────────────────────────────────────────┘
```

### 1.3 学习前置

- 了解 HTTP 协议基础（请求方法、状态码、Header）
- 掌握 Postman 或 Fiddler 基础使用
- Python 语法基础（变量、函数、类、模块）

---

## 二、环境搭建

### 2.1 安装 Python

**Windows：**

1. 官网下载：`https://www.python.org/downloads/`（推荐 3.11+；至少使用仍在维护的版本）
2. 安装时 **务必勾选** `Add Python to PATH`
3. 验证：

```bash
python --version
pip --version
```

**Mac/Linux：**

```bash
# Mac
brew install python3

# Ubuntu
sudo apt install python3 python3-pip

# CentOS
sudo yum install python3 python3-pip
```

### 2.2 配置 pip 国内源（加速）

```bash
# 临时使用
pip install requests -i https://pypi.tuna.tsinghua.edu.cn/simple

# 永久配置
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

常用国内源：
- 清华：`https://pypi.tuna.tsinghua.edu.cn/simple`
- 阿里：`https://mirrors.aliyun.com/pypi/simple/`
- 豆瓣：`https://pypi.douban.com/simple/`

### 2.3 安装项目依赖

创建 `requirements.txt`：

```
requests==2.31.0
pytest==7.4.3
pytest-html==4.1.1
allure-pytest==2.13.2
pyyaml==6.0.1
loguru==0.7.2
jsonpath-ng==1.6.0
faker==20.1.0
```

> 注：`jsonpath` 老库多年未更新，推荐使用 `jsonpath-ng`（功能更全、活跃维护）；如需更轻量可选 `jsonpath-python`。

安装：

```bash
pip install -r requirements.txt
```

### 2.4 安装 Allure 命令行工具

Allure 报告分两部分：Python 库 `allure-pytest`（已通过 pip 装好）+ 命令行工具（需另装）。

**Windows：**

方式 1：通过 Scoop（推荐）

```bash
scoop install allure
```

方式 2：手动安装
1. 下载：`https://github.com/allure-framework/allure2/releases`
2. 解压到本地，如 `D:\tools\allure-<版本号>`
3. 添加到系统环境变量 PATH：`D:\tools\allure-<版本号>\bin`
4. 验证：`allure --version`

**Mac：**

```bash
brew install allure
```

**Linux：**

```bash
# 下载前到 https://github.com/allure-framework/allure2/releases 确认最新稳定版
ALLURE_VERSION=2.30.0
wget -O allure.tgz https://github.com/allure-framework/allure2/releases/download/${ALLURE_VERSION}/allure-${ALLURE_VERSION}.tgz
tar -zxvf allure.tgz -C /opt/
# 添加软链接
ln -sf /opt/allure-${ALLURE_VERSION}/bin/allure /usr/local/bin/allure
allure --version
```

!!! warning "注意"
    Allure 依赖 Java 8+，需先安装 JDK。

### 2.5 安装 IDE

推荐 **PyCharm Community**（免费版足够）或 **VSCode + Python 插件**。

PyCharm 配置：
- `File` → `Settings` → `Project` → `Python Interpreter`
- 选择正确的 Python 解释器
- 安装项目依赖

---

## 三、Requests 库详解

### 3.1 发送基础请求

```python
import requests

# GET 请求
response = requests.get("https://httpbin.org/get")
print(response.status_code)        # 状态码
print(response.text)               # 文本响应
print(response.json())             # JSON 解析  # (1)

# POST 请求
response = requests.post("https://httpbin.org/post", data={"key": "value"})
```

1. `.json()` 将响应体自动反序列化为 Python 字典，若响应非 JSON 格式会抛出 `JSONDecodeError`，调用前建议先检查 `Content-Type`

### 3.2 GET 请求传参

```python
# 方式 1：URL 拼接（不推荐）
requests.get("https://api.example.com/users?page=1&size=10")

# 方式 2：params 参数（推荐）
params = {"page": 1, "size": 10, "keyword": "test"}
response = requests.get("https://api.example.com/users", params=params)
# 实际请求：https://api.example.com/users?page=1&size=10&keyword=test
```

### 3.3 POST 请求三种数据格式

```python
# 1. JSON 格式（最常用）
data = {"username": "test", "password": "123456"}
response = requests.post(
    "https://api.example.com/login",
    json=data       # (1)
)

# 2. 表单格式（form-data）
data = {"username": "test", "password": "123456"}
response = requests.post(
    "https://api.example.com/login",
    data=data       # (2)
)

# 3. 上传文件（multipart/form-data）
files = {"file": open("test.jpg", "rb")}
data = {"description": "头像"}
response = requests.post(
    "https://api.example.com/upload",
    files=files,
    data=data
)
```

1. `json=` 自动将字典序列化为 JSON 字符串，并设置 `Content-Type: application/json`，适用于绝大多数 REST API
2. `data=` 将字典编码为表单格式 `key=value&key=value`，`Content-Type` 为 `application/x-www-form-urlencoded`，适用于传统表单提交

### 3.4 请求头与认证

```python
# 自定义 Headers
headers = {
    "Authorization": "Bearer eyJhbGc...",
    "User-Agent": "TestClient/1.0",
    "X-Request-Id": "abc123"
}
response = requests.get("https://api.example.com/user", headers=headers)

# Basic Auth
from requests.auth import HTTPBasicAuth
response = requests.get(
    "https://api.example.com/secure",
    auth=HTTPBasicAuth("admin", "password")
)

# Cookie
cookies = {"sessionId": "abc123"}
response = requests.get("https://api.example.com/profile", cookies=cookies)
```

### 3.5 响应对象处理

```python
response = requests.get("https://api.example.com/user/1")

# 状态码
response.status_code              # 200
response.ok                       # True（< 400 即 True）
response.raise_for_status()       # 状态码 >= 400 时抛异常  # (1)

# 响应内容
response.text                     # 字符串形式
response.content                  # 二进制（图片、文件）
response.json()                   # JSON 字典

# 响应头
response.headers                  # 全部
response.headers["Content-Type"]  # 指定

# Cookie
response.cookies                  # 服务器返回的 Cookie
response.cookies.get("sessionId")

# 其他
response.url                      # 实际请求 URL
response.elapsed.total_seconds()  # 响应耗时（秒）
response.encoding                 # 编码
response.encoding = "utf-8"       # 设置编码（解决中文乱码）
```

1. 比手动检查 `status_code` 更高效，配合 `try/except HTTPError` 可统一处理 4xx 和 5xx 错误

### 3.6 Session 会话保持

测试需要"登录后调其他接口"的场景，Session 自动保持 Cookie：

```python
session = requests.Session()

# 第一次：登录
session.post("https://api.example.com/login", json={
    "username": "test",
    "password": "123456"
})

# 后续：自动携带登录态
response = session.get("https://api.example.com/user/info")  # (1)
response = session.get("https://api.example.com/order/list")

# 关闭
session.close()

# 推荐用 with 自动关闭
with requests.Session() as s:
    s.post("https://api.example.com/login", json={"username":"test","password":"123456"})
    r = s.get("https://api.example.com/user/info")
```

1. Session 对象会自动管理 Cookie，登录后服务器返回的 Cookie 会被保存，后续请求自动携带，无需手动处理

### 3.7 高级选项

### 3.7 高级选项

```python
# 超时（强烈推荐设置！）
requests.get("https://api.example.com", timeout=10)              # 总超时 10s  # (1)
requests.get("https://api.example.com", timeout=(3, 10))         # 连接 3s，读取 10s  # (2)

# 跳过 SSL 校验（自签名证书）
requests.get("https://192.168.1.100", verify=False)
# 抑制警告
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# 代理（搭配 Fiddler 抓包）
proxies = {
    "http": "http://127.0.0.1:8888",
    "https": "http://127.0.0.1:8888"
}
requests.get("https://api.example.com", proxies=proxies)

# 重定向控制
requests.get("https://example.com", allow_redirects=False)

# 流式下载大文件
with requests.get("https://example.com/big.zip", stream=True) as r:
    with open("big.zip", "wb") as f:
        for chunk in r.iter_content(chunk_size=8192):
            f.write(chunk)
```

1. 单值超时同时限制连接和读取，接口测试建议统一设 10-30 秒，避免服务端无响应时用例永久挂起
2. 元组超时分别控制连接建立和响应读取，适用于慢接口需要更长读取时间但连接应快速失败的场景

### 3.8 异常处理

```python
import requests
from requests.exceptions import Timeout, ConnectionError, HTTPError, RequestException

try:
    response = requests.get("https://api.example.com", timeout=5)
    response.raise_for_status()
except Timeout:
    print("请求超时")
except ConnectionError:
    print("连接错误")
except HTTPError as e:
    print(f"HTTP 错误：{e}")
except RequestException as e:
    print(f"请求异常：{e}")
```

---

## 四、Pytest 测试框架

### 4.1 安装与第一个用例

```bash
pip install pytest
```

创建 `test_demo.py`：

```python
def add(a, b):
    return a + b

def test_add_normal():
    assert add(1, 2) == 3

def test_add_negative():
    assert add(-1, -2) == -3
```

运行：

```bash
pytest                        # 运行当前目录所有 test_*.py
pytest test_demo.py           # 运行指定文件
pytest test_demo.py::test_add_normal   # 运行指定用例
pytest -v                     # 详细输出
pytest -s                     # 显示 print 输出
pytest -k "normal"            # 关键字匹配
```

### 4.2 命名规范

Pytest 自动发现规则：

| 类型 | 规范 |
|------|------|
| 文件名 | `test_*.py` 或 `*_test.py` |
| 类名 | `Test*` 开头，不能有 `__init__` |
| 函数名 | `test_*` 开头 |

```python
# 函数式
def test_login_success():
    pass

# 类式
class TestLogin:
    def test_login_success(self):
        pass

    def test_login_fail(self):
        pass
```

### 4.3 断言（Assert）

Pytest 直接使用 Python 原生 `assert`：

```python
def test_examples():
    # 数值
    assert 1 + 1 == 2
    assert 10 > 5
    
    # 字符串
    assert "hello" in "hello world"
    assert "test".startswith("te")
    
    # 列表 / 字典
    assert [1, 2, 3] == [1, 2, 3]
    assert {"name": "test"}.get("name") == "test"
    
    # 类型
    assert isinstance(123, int)
    
    # 接口响应
    response = {"code": 0, "msg": "ok"}
    assert response["code"] == 0
    assert response["msg"] == "ok"
    
    # 自定义错误消息（断言失败时显示）
    assert response["code"] == 0, f"期望 code=0，实际={response['code']}"
```

### 4.4 Fixture（前置/后置）

Fixture 替代了传统的 setUp / tearDown，更灵活。

```python
import pytest

@pytest.fixture
def login_token():
    """登录获取 token"""
    print("\n→ 执行登录")
    token = "eyJhbGc..."     # 实际为登录接口返回
    yield token              # 把 token 给用例  # (1)
    print("\n→ 清理工作（用例执行后）")           # (2)

def test_get_user_info(login_token):
    print(f"使用 token：{login_token[:8]}...")
    assert login_token is not None

def test_get_order_list(login_token):
    print(f"使用 token：{login_token[:8]}...")
    assert login_token.startswith("ey")
```

1. `yield` 之前的代码在用例执行前运行（setup），`yield` 的值作为参数注入用例函数
2. `yield` 之后的代码在用例执行后运行（teardown），无论用例成功或失败都会执行，适合做资源清理

真实项目不要在本地日志、Allure 附件或 CI 日志中输出完整 Token。需要排查时只输出前几位，或输出“Token 已获取”。

**Fixture 作用域：**

```python
@pytest.fixture(scope="function")   # 每个用例都执行（默认）
@pytest.fixture(scope="class")      # 每个类执行一次
@pytest.fixture(scope="module")     # 每个文件执行一次
@pytest.fixture(scope="session")    # 整个测试会话执行一次（最常用于登录、连数据库）
```

### 4.5 conftest.py（共享 Fixture）

`conftest.py` 是 pytest 的特殊文件，其中定义的 Fixture **不需要 import 即可被同目录及子目录的用例使用**。

`conftest.py`:

```python
import pytest
import requests

@pytest.fixture(scope="session")
def base_url():
    return "https://api-test.example.com"

@pytest.fixture(scope="session")
def login_session(base_url):
    """整个测试会话共享一个登录态"""
    session = requests.Session()
    session.post(f"{base_url}/api/login", json={
        "username": "testuser",
        "password": "123456"
    })
    yield session     # (1)
    session.close()   # (2)
```

1. `scope="session"` 让登录只执行一次，所有用例共享同一个 Session 对象和 Cookie，大幅减少重复登录开销
2. `yield` 后关闭 Session 释放连接资源，确保测试结束后不会残留未关闭的 HTTP 连接

任意用例文件直接使用：

```python
def test_user_info(login_session, base_url):
    response = login_session.get(f"{base_url}/api/user/info")
    assert response.status_code == 200
```

### 4.6 参数化（Parametrize）

一个用例 + 多组数据：

```python
import pytest

@pytest.mark.parametrize("a, b, expected", [   # (1)
    (1, 2, 3),
    (5, 5, 10),
    (-1, 1, 0),
    (0, 0, 0),
])
def test_add(a, b, expected):
    assert a + b == expected
```

1. 每组数据自动生成一个独立用例，失败时可精确定位是哪组数据出了问题，比循环测试更易于排查

执行后会产生 4 个独立用例。

**带 id 的参数化（报告更清晰）：**

```python
@pytest.mark.parametrize("username, password, expected_code", [
    ("testuser", "123456", 0),
    ("nouser", "123456", 1002),
    ("testuser", "wrong", 1001),
    ("", "123456", 1003),
], ids=["正常登录", "账号不存在", "密码错误", "账号为空"])
def test_login(username, password, expected_code):
    # ...
    pass
```

### 4.7 Mark 标记

按需运行部分用例：

```python
import pytest

@pytest.mark.smoke
def test_login():
    pass

@pytest.mark.regression
def test_order_flow():
    pass

@pytest.mark.skip(reason="接口未上线")
def test_new_feature():
    pass

@pytest.mark.skipif(condition=True, reason="生产环境跳过")
def test_data_clean():
    pass

@pytest.mark.xfail(reason="已知 Bug")
def test_known_bug():
    assert False
```

执行：

```bash
pytest -m smoke                 # 只跑标记 smoke 的
pytest -m "smoke or regression" # 组合
pytest -m "not regression"      # 排除
```

**注册标记（避免警告）** —— `pytest.ini`:

```ini
[pytest]
markers =
    smoke: 冒烟测试
    regression: 回归测试
    p0: 最高优先级
    p1: 一般优先级
```

### 4.8 常用命令行参数

```bash
pytest -v                       # 详细输出
pytest -s                       # 显示 print
pytest -q                       # 简洁输出
pytest -x                       # 遇到第一个失败立即停止
pytest --maxfail=3              # 失败 3 个就停
pytest --lf                     # 只跑上次失败的
pytest --ff                     # 上次失败的先跑
pytest -n 4                     # 并发 4 进程（需装 pytest-xdist）
pytest --collect-only           # 仅收集不执行
pytest --html=report.html       # 生成 HTML 报告（需装 pytest-html）
```

---

## 五、项目分层设计

### 5.1 推荐项目结构

```
api-test/
├── config/                     # 配置文件
│   ├── config.yaml            # 环境配置
│   └── settings.py            # 全局常量
├── common/                     # 公共工具
│   ├── __init__.py
│   ├── request_util.py        # HTTP 请求封装
│   ├── yaml_util.py           # YAML 读取
│   ├── logger.py              # 日志封装
│   └── assertion.py           # 断言封装
├── apis/                       # 接口封装层
│   ├── __init__.py
│   ├── login_api.py
│   ├── user_api.py
│   └── order_api.py
├── data/                       # 测试数据
│   ├── login_data.yaml
│   └── order_data.yaml
├── testcases/                  # 测试用例
│   ├── __init__.py
│   ├── test_login.py
│   ├── test_user.py
│   └── test_order.py
├── logs/                       # 日志输出
├── reports/                    # 报告输出
│   ├── allure-results/        # 原始结果
│   └── allure-report/         # 生成的 HTML 报告
├── conftest.py                 # 全局 fixture
├── pytest.ini                  # pytest 配置
├── requirements.txt            # 依赖列表
├── run.py                      # 入口启动脚本
└── README.md
```

### 5.2 HTTP 请求封装（common/request_util.py）

```python
import requests
from loguru import logger

class RequestUtil:
    """HTTP 请求统一封装"""
    
    def __init__(self):
        self.session = requests.Session()
        self.timeout = 30
    
    def send_request(self, method, url, **kwargs):
        """统一发送请求入口"""
        kwargs.setdefault("timeout", self.timeout)
        kwargs.setdefault("verify", False)
        
        # 打印请求日志
        logger.info(f"请求方法：{method}")
        logger.info(f"请求 URL：{url}")
        logger.info(f"请求参数：{kwargs}")
        
        try:
            response = self.session.request(method, url, **kwargs)
            logger.info(f"响应状态：{response.status_code}")
            logger.info(f"响应内容：{response.text[:500]}")
            return response
        except Exception as e:
            logger.error(f"请求异常：{e}")
            raise
    
    def get(self, url, **kwargs):
        return self.send_request("GET", url, **kwargs)
    
    def post(self, url, **kwargs):
        return self.send_request("POST", url, **kwargs)
    
    def put(self, url, **kwargs):
        return self.send_request("PUT", url, **kwargs)
    
    def delete(self, url, **kwargs):
        return self.send_request("DELETE", url, **kwargs)

# 全局实例
http = RequestUtil()
```

### 5.3 接口封装（apis/login_api.py）

```python
from common.request_util import http
from config.settings import BASE_URL

class LoginApi:
    """登录相关接口"""
    
    @staticmethod
    def login(username, password):
        """用户登录"""
        url = f"{BASE_URL}/api/login"
        data = {"username": username, "password": password}
        return http.post(url, json=data)
    
    @staticmethod
    def logout(token):
        """退出登录"""
        url = f"{BASE_URL}/api/logout"
        headers = {"Authorization": f"Bearer {token}"}
        return http.post(url, headers=headers)
    
    @staticmethod
    def get_captcha():
        """获取验证码"""
        url = f"{BASE_URL}/api/captcha"
        return http.get(url)
```

### 5.4 测试用例（testcases/test_login.py）

```python
from apis.login_api import LoginApi

class TestLogin:
    """登录接口测试"""
    
    def test_login_success(self):
        """正常登录"""
        response = LoginApi.login("testuser", "123456")
        assert response.status_code == 200            # (1)
        result = response.json()
        assert result["code"] == 0                    # (2)
        assert "token" in result["data"]              # (3)

    def test_login_wrong_password(self):
        """密码错误"""
        response = LoginApi.login("testuser", "wrong")
        result = response.json()
        assert result["code"] == 1001                 # (4)
        assert "密码" in result["msg"]                # (5)
```

1. HTTP 状态码 200 只表示请求到达了服务器，不代表业务逻辑正确
2. 业务状态码 `code == 0` 表示登录成功，这是接口约定的业务含义
3. 验证返回数据中包含 token，后续接口依赖此 token 做鉴权
4. 密码错误时业务码应为 1001，与接口文档约定一致
5. 验证错误消息包含"密码"关键词，确认用户看到的提示是准确的

### 5.5 分层的好处

- **可维护性高**：接口变了只改 `apis/`，用例不动
- **复用性强**：同一个接口在多个用例中调用
- **职责清晰**：用例只关注业务逻辑和断言
- **新人友好**：分工明确，按模块开发

---

## 六、配置文件与环境管理

### 6.1 YAML 配置文件（config/config.yaml）

```yaml
# 当前环境
env: test

# 测试环境配置
test:
  base_url: https://api-test.example.com
  db_host: 192.168.1.100
  db_port: 3306
  db_user: test_user
  db_pwd: test_pwd
  timeout: 30

# 开发环境配置
dev:
  base_url: https://api-dev.example.com
  db_host: 192.168.1.101
  db_port: 3306
  db_user: dev_user
  db_pwd: dev_pwd
  timeout: 30

# 生产环境配置（一般禁止跑自动化）
prod:
  base_url: https://api.example.com
  timeout: 30

# 默认测试账号
account:
  username: testuser
  password: "123456"
```

### 6.2 YAML 读取工具（common/yaml_util.py）

```python
import yaml
from pathlib import Path

def read_yaml(file_path):
    """读取 YAML 文件"""
    with open(file_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

def write_yaml(file_path, data):
    """写入 YAML 文件"""
    with open(file_path, "w", encoding="utf-8") as f:
        yaml.safe_dump(data, f, allow_unicode=True)
```

### 6.3 全局配置（config/settings.py）

```python
from pathlib import Path
from common.yaml_util import read_yaml

# 项目根目录
ROOT_DIR = Path(__file__).parent.parent

# 路径常量
CONFIG_DIR = ROOT_DIR / "config"
DATA_DIR = ROOT_DIR / "data"
LOG_DIR = ROOT_DIR / "logs"
REPORT_DIR = ROOT_DIR / "reports"

# 读取配置
_config = read_yaml(CONFIG_DIR / "config.yaml")
_env = _config["env"]
_env_config = _config[_env]

# 暴露配置
BASE_URL = _env_config["base_url"]
TIMEOUT = _env_config["timeout"]
ACCOUNT = _config["account"]
```

### 6.4 通过环境变量切换

修改 `settings.py`：

```python
import os
_env = os.getenv("TEST_ENV", _config["env"])    # 优先读环境变量
```

执行时：

```bash
# Linux/Mac
TEST_ENV=dev pytest

# Windows CMD
set TEST_ENV=dev && pytest

# Windows PowerShell
$env:TEST_ENV="dev"; pytest
```

---

## 七、数据驱动测试

### 7.1 为什么要数据驱动

同一个接口需要测试多种场景（正常、异常、边界），如果每个场景写一个用例，会出现大量重复代码。数据驱动让 **一套代码 + 多组数据** 自动产生多条用例。

### 7.2 YAML 数据文件（data/login_data.yaml）

```yaml
- case_id: login_001
  case_name: 正常登录
  username: testuser
  password: "123456"
  expected:
    code: 0
    msg: 成功

- case_id: login_002
  case_name: 账号不存在
  username: nouser
  password: "123456"
  expected:
    code: 1002
    msg: 账号不存在

- case_id: login_003
  case_name: 密码错误
  username: testuser
  password: wrong
  expected:
    code: 1001
    msg: 密码错误

- case_id: login_004
  case_name: 账号为空
  username: ""
  password: "123456"
  expected:
    code: 1003
    msg: 账号不能为空

- case_id: login_005
  case_name: SQL 注入测试
  username: "admin' OR '1'='1"
  password: "any"
  expected:
    code: 1001
    msg: 密码错误
```

### 7.3 数据驱动用例

```python
import pytest
from apis.login_api import LoginApi
from common.yaml_util import read_yaml
from config.settings import DATA_DIR

# 读取测试数据
login_data = read_yaml(DATA_DIR / "login_data.yaml")

class TestLogin:
    
    @pytest.mark.parametrize(
        "case",
        login_data,
        ids=[c["case_name"] for c in login_data]
    )
    def test_login(self, case):
        # 发送请求
        response = LoginApi.login(case["username"], case["password"])
        result = response.json()
        
        # 断言
        assert result["code"] == case["expected"]["code"], \
            f"用例 {case['case_id']} 失败：期望 code={case['expected']['code']}, 实际={result['code']}"
        assert case["expected"]["msg"] in result["msg"]
```

执行后会产生 5 个独立用例，报告中可清晰看到每个场景的结果。

### 7.4 复杂数据驱动（含请求体、断言）

```yaml
- case_id: order_001
  case_name: 创建订单-正常
  method: POST
  url: /api/order/create
  headers:
    Content-Type: application/json
  data:
    productId: 1001
    quantity: 2
    address: "北京市朝阳区"
  assertions:
    - jsonpath: $.code
      expected: 0
    - jsonpath: $.data.orderId
      type: number
    - jsonpath: $.data.totalAmount
      expected: 200
```

通用驱动函数：

```python
from jsonpath import jsonpath

def run_case(case):
    # 构造完整 URL
    url = BASE_URL + case["url"]
    # 发送请求
    response = http.send_request(
        method=case["method"],
        url=url,
        headers=case.get("headers"),
        json=case.get("data")
    )
    result = response.json()
    
    # 遍历断言
    for assertion in case.get("assertions", []):
        actual = jsonpath(result, assertion["jsonpath"])[0]
        if "expected" in assertion:
            assert actual == assertion["expected"]
        if assertion.get("type") == "number":
            assert isinstance(actual, (int, float))
```

---

## 八、Allure 报告集成

### 8.1 安装与基础使用

```bash
pip install allure-pytest
```

执行测试并生成结果：

```bash
# 运行测试，结果保存到 allure-results
pytest --alluredir=./reports/allure-results

# 生成 HTML 报告并自动打开
allure serve ./reports/allure-results

# 生成静态 HTML 报告
allure generate ./reports/allure-results -o ./reports/allure-report --clean
# 打开
allure open ./reports/allure-report
```

### 8.2 Allure 装饰器

```python
import allure
import pytest

@allure.epic("电商系统")                       # (1)
@allure.feature("用户模块")                    # (2)
@allure.story("登录功能")                      # (3)
class TestLogin:

    @allure.title("正常账号密码登录成功")        # (4)
    @allure.description("使用正确的账号密码登录，预期返回 token")
    @allure.severity(allure.severity_level.CRITICAL)  # (5)
    @allure.tag("smoke", "P0")
    @allure.link("https://jira.example.com/TEST-100", name="需求链接")
    @allure.issue("BUG-200", name="关联缺陷")
    @allure.testcase("TC-300", name="测试用例")
    def test_login_success(self):
        ...
```

1. `epic` 是最高层级分类，通常对应整个项目或系统，在报告左侧导航中作为一级分组
2. `feature` 对应功能模块，报告中按模块聚合用例，便于按模块查看通过率
3. `story` 对应具体场景，三层结构（epic > feature > story）让报告层级清晰
4. `title` 设置用例在报告中显示的标题，不设置则默认用函数名
5. `severity` 标记用例优先级，报告中可按严重级别筛选和统计

**严重级别（severity）：**

| 级别 | 含义 |
|------|------|
| `BLOCKER` | 阻塞 |
| `CRITICAL` | 严重 |
| `NORMAL` | 一般 |
| `MINOR` | 次要 |
| `TRIVIAL` | 轻微 |

### 8.3 步骤（Step）

```python
import allure
from apis.login_api import LoginApi

class TestOrder:
    
    @allure.title("完整下单流程")
    def test_order_flow(self):
        with allure.step("1. 用户登录"):                # (1)
            response = LoginApi.login("testuser", "123456")
            assert response.json()["code"] == 0
            token = response.json()["data"]["token"]
        
        with allure.step("2. 查询商品列表"):
            ...
        
        with allure.step("3. 加入购物车"):
            ...
        
        with allure.step("4. 创建订单"):
            ...
        
        with allure.step("5. 校验订单状态"):
            ...
```

1. `with allure.step()` 将代码块标记为报告中的一个步骤，失败时能精确定位到哪一步出问题，而不是只看到整个用例失败

### 8.4 用装饰器封装步骤

```python
@allure.step("登录账号：{username}")
def do_login(username, password):
    return LoginApi.login(username, password)

class TestLogin:
    def test_login(self):
        response = do_login("testuser", "123456")
        assert response.status_code == 200
```

### 8.5 添加附件

报告中可附加请求/响应详情、截图、日志：

```python
import allure

# 文本附件
allure.attach(
    body="这是请求详情",
    name="请求信息",
    attachment_type=allure.attachment_type.TEXT
)

# JSON 附件
import json
allure.attach(
    body=json.dumps(response.json(), ensure_ascii=False, indent=2),
    name="响应数据",
    attachment_type=allure.attachment_type.JSON
)

# HTML 附件
allure.attach(
    body="<h1>结果</h1>",
    name="HTML 展示",
    attachment_type=allure.attachment_type.HTML
)

# 图片附件（如截图）
with open("screenshot.png", "rb") as f:
    allure.attach(
        f.read(),
        name="界面截图",
        attachment_type=allure.attachment_type.PNG
    )
```

### 8.6 在请求封装中自动记录

修改 `request_util.py`，发送请求时自动写入 Allure：

```python
import allure
import json
import requests
from loguru import logger

class RequestUtil:
    def __init__(self):
        self.session = requests.Session()
    
    def send_request(self, method, url, **kwargs):
        kwargs.setdefault("timeout", 30)
        kwargs.setdefault("verify", False)
        
        # 记录到 Allure
        with allure.step(f"发送请求：{method} {url}"):
            # 请求信息
            req_info = {
                "method": method,
                "url": url,
                "headers": kwargs.get("headers"),
                "params": kwargs.get("params"),
                "json": kwargs.get("json"),
                "data": kwargs.get("data"),
            }
            allure.attach(
                json.dumps(req_info, ensure_ascii=False, indent=2),
                name="请求数据",
                attachment_type=allure.attachment_type.JSON
            )
            
            # 发送
            response = self.session.request(method, url, **kwargs)
            
            # 响应信息
            try:
                res_body = response.json()
                allure.attach(
                    json.dumps(res_body, ensure_ascii=False, indent=2),
                    name="响应数据",
                    attachment_type=allure.attachment_type.JSON
                )
            except:
                allure.attach(response.text, name="响应数据", 
                             attachment_type=allure.attachment_type.TEXT)
            
            logger.info(f"[{method}] {url} → {response.status_code}")
            return response
    
    def get(self, url, **kwargs):
        return self.send_request("GET", url, **kwargs)
    
    def post(self, url, **kwargs):
        return self.send_request("POST", url, **kwargs)
```

### 8.7 报告中的环境信息

在 `allure-results` 目录下创建 `environment.properties`（pytest 运行前后写入）：

```properties
项目名称=电商接口自动化
测试环境=test
BaseUrl=https://api-test.example.com
Python版本=3.10
执行人=tester
```

或在 `conftest.py` 中自动生成：

```python
import os
import sys
from config.settings import BASE_URL

def pytest_configure(config):
    # 通过 --alluredir 参数获取目录
    allure_dir = config.getoption("--alluredir", default=None)
    if allure_dir:
        os.makedirs(allure_dir, exist_ok=True)
        env_file = os.path.join(allure_dir, "environment.properties")
        with open(env_file, "w", encoding="utf-8") as f:
            f.write(f"项目名称=电商接口自动化\n")
            f.write(f"BaseUrl={BASE_URL}\n")
            f.write(f"Python版本={sys.version.split()[0]}\n")
```

### 8.8 报告趋势（历史对比）

每次执行时把上次的 `history` 目录复制到本次 `allure-results`：

```bash
# 保留历史趋势
cp -r ./reports/allure-report/history ./reports/allure-results/history

# 生成报告
allure generate ./reports/allure-results -o ./reports/allure-report --clean
```

---

## 九、接口依赖与数据传递

### 9.1 场景示例

```
登录接口 → 拿到 token
   ↓
创建订单接口（需要 token） → 拿到 orderId
   ↓
查询订单接口（需要 orderId）
```

### 9.2 方式一：Fixture 传递（推荐用例间）

```python
import pytest
from apis.login_api import LoginApi
from apis.order_api import OrderApi

@pytest.fixture(scope="session")
def token():
    response = LoginApi.login("testuser", "123456")
    return response.json()["data"]["token"]

@pytest.fixture(scope="function")
def order_id(token):
    response = OrderApi.create_order(token, productId=1001, quantity=2)
    return response.json()["data"]["orderId"]

class TestOrder:
    def test_query_order(self, token, order_id):
        response = OrderApi.query_order(token, order_id)
        assert response.json()["data"]["orderId"] == order_id
    
    def test_cancel_order(self, token, order_id):
        response = OrderApi.cancel_order(token, order_id)
        assert response.json()["code"] == 0
```

### 9.3 方式二：全局上下文（推荐用例内串接）

创建 `common/context.py`：

```python
class TestContext:
    """测试上下文，存储动态数据"""
    _data = {}
    
    @classmethod
    def set(cls, key, value):
        cls._data[key] = value
    
    @classmethod
    def get(cls, key, default=None):
        return cls._data.get(key, default)
    
    @classmethod
    def clear(cls):
        cls._data.clear()
```

使用：

```python
from common.context import TestContext

def test_full_flow():
    # 登录
    response = LoginApi.login("test", "123456")
    TestContext.set("token", response.json()["data"]["token"])
    
    # 创建订单
    response = OrderApi.create_order(TestContext.get("token"), 1001, 2)
    TestContext.set("order_id", response.json()["data"]["orderId"])
    
    # 查询订单
    response = OrderApi.query_order(
        TestContext.get("token"),
        TestContext.get("order_id")
    )
    assert response.json()["code"] == 0
```

### 9.4 方式三：YAML 中引用变量

```yaml
- case_id: 001
  case_name: 登录
  url: /api/login
  data:
    username: testuser
    password: "123456"
  extract:
    token: $.data.token         # 用 JSONPath 提取响应字段保存

- case_id: 002
  case_name: 查询用户信息
  url: /api/user/info
  headers:
    Authorization: "Bearer ${token}"   # 引用上一个用例提取的 token
```

执行框架需要解析 `${变量}` 占位符，替换为上下文中的实际值。

---

## 十、日志与异常处理

### 10.1 Loguru 日志配置

`common/logger.py`：

```python
from loguru import logger
import sys
from config.settings import LOG_DIR

# 移除默认配置
logger.remove()

# 控制台输出
logger.add(
    sys.stdout,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
    level="INFO",
    colorize=True
)

# 文件输出
logger.add(
    LOG_DIR / "test_{time:YYYY-MM-DD}.log",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
    level="DEBUG",
    rotation="00:00",           # 每天 0 点切割
    retention="7 days",         # 保留 7 天
    encoding="utf-8"
)
```

任意模块直接 `from loguru import logger` 使用：

```python
logger.debug("调试信息")
logger.info("普通信息")
logger.warning("警告")
logger.error("错误")
logger.critical("严重错误")
```

### 10.2 失败用例自动截图/抓取日志

在 `conftest.py` 中添加 hook：

```python
import pytest
import allure
from loguru import logger

@pytest.hookimpl(hookwrapper=True, tryfirst=True)
def pytest_runtest_makereport(item, call):
    """用例失败时自动处理"""
    outcome = yield
    report = outcome.get_result()
    
    if report.when == "call" and report.failed:
        # 记录到日志
        logger.error(f"用例失败：{item.name}")
        logger.error(f"失败原因：{report.longrepr}")
        
        # 附加到 Allure
        allure.attach(
            str(report.longrepr),
            name="失败堆栈",
            attachment_type=allure.attachment_type.TEXT
        )
```

---

## 十一、完整实战项目

### 11.1 入口启动脚本 run.py

```python
import os
import shutil
import pytest
from config.settings import REPORT_DIR

def run():
    # 清理上次结果
    result_dir = REPORT_DIR / "allure-results"
    report_dir = REPORT_DIR / "allure-report"
    
    if result_dir.exists():
        shutil.rmtree(result_dir)
    result_dir.mkdir(parents=True)
    
    # 保留历史趋势
    history_src = report_dir / "history"
    history_dst = result_dir / "history"
    if history_src.exists():
        shutil.copytree(history_src, history_dst)
    
    # 执行测试
    pytest_args = [
        "-v",
        "-s",
        "--alluredir", str(result_dir),
        "--clean-alluredir",
        "testcases/"
    ]
    pytest.main(pytest_args)
    
    # 生成报告
    os.system(f"allure generate {result_dir} -o {report_dir} --clean")
    
    # 可选：自动打开报告
    # os.system(f"allure open {report_dir}")

if __name__ == "__main__":
    run()
```

### 11.2 pytest.ini

```ini
[pytest]
# 用例目录
testpaths = testcases

# 文件匹配
python_files = test_*.py
python_classes = Test*
python_functions = test_*

# 命令行默认参数
addopts = -v -s --tb=short --color=yes

# 标记定义
markers =
    smoke: 冒烟测试
    regression: 回归测试
    p0: P0 用例
    p1: P1 用例
    skip_prod: 生产环境跳过

# 日志
log_cli = true
log_cli_level = INFO
log_cli_format = %(asctime)s [%(levelname)s] %(message)s
log_cli_date_format = %Y-%m-%d %H:%M:%S
```

### 11.3 conftest.py（项目根目录）

```python
import pytest
import allure
from loguru import logger
from common.request_util import http
from apis.login_api import LoginApi
from config.settings import ACCOUNT, BASE_URL

@pytest.fixture(scope="session", autouse=True)
def session_setup():
    """会话级初始化"""
    logger.info("=" * 50)
    logger.info(f"测试开始，BaseUrl={BASE_URL}")
    logger.info("=" * 50)
    yield
    logger.info("=" * 50)
    logger.info("测试结束")
    logger.info("=" * 50)

@pytest.fixture(scope="session")
def login_token():
    """全局登录 token"""
    response = LoginApi.login(ACCOUNT["username"], ACCOUNT["password"])
    assert response.json()["code"] == 0, "登录失败，无法继续测试"
    token = response.json()["data"]["token"]
    logger.info(f"登录成功，token={token[:20]}...")
    return token

@pytest.fixture(scope="session")
def auth_session(login_token):
    """已登录的 session"""
    http.session.headers.update({"Authorization": f"Bearer {login_token}"})
    return http
```

### 11.4 完整测试用例示例

`testcases/test_user.py`:

```python
import pytest
import allure
from apis.user_api import UserApi
from common.yaml_util import read_yaml
from config.settings import DATA_DIR

user_data = read_yaml(DATA_DIR / "user_data.yaml")

@allure.epic("电商系统")
@allure.feature("用户模块")
class TestUser:
    
    @allure.story("查询用户信息")
    @allure.title("查询当前登录用户信息")
    @allure.severity(allure.severity_level.CRITICAL)
    @pytest.mark.smoke
    def test_get_user_info(self, auth_session):
        with allure.step("调用查询接口"):
            response = UserApi.get_user_info()
        
        with allure.step("验证响应"):
            assert response.status_code == 200
            result = response.json()
            assert result["code"] == 0
            assert "userId" in result["data"]
            assert "username" in result["data"]
    
    @allure.story("修改用户信息")
    @allure.title("修改用户信息-{case[case_name]}")
    @pytest.mark.parametrize("case", user_data["update_cases"],
                             ids=[c["case_name"] for c in user_data["update_cases"]])
    def test_update_user(self, auth_session, case):
        with allure.step(f"修改字段：{case['data']}"):
            response = UserApi.update_user(case["data"])
        
        with allure.step(f"预期 code={case['expected']['code']}"):
            assert response.json()["code"] == case["expected"]["code"]
```

### 11.5 执行项目

```bash
# 方式 1：直接运行 run.py（推荐）
python run.py

# 方式 2：分步执行
pytest --alluredir=./reports/allure-results
allure serve ./reports/allure-results
```

---

## 十二、CI/CD 持续集成

### 12.1 Jenkins 集成

**前置准备：**
- Jenkins 安装 Allure 插件
- Jenkins 服务器安装 Python + Allure

**构建脚本（Execute shell）：**

```bash
# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

# 执行测试
pytest --alluredir=./reports/allure-results || true
```

> 加 `|| true` 是为了即使有用例失败也继续生成报告

**配置 Allure 报告（Post-build Actions）：**

- `Allure Report` → `Results` 填 `reports/allure-results`
- 构建后自动展示报告链接

### 12.2 GitHub Actions 集成

`.github/workflows/api-test.yml`:

```yaml
name: API Automation Test

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * *'    # 每天凌晨 2 点跑

jobs:
  api-test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.10'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
      
      - name: Install Allure
        run: |
          ALLURE_VERSION=2.30.0
          wget -O allure.tgz https://github.com/allure-framework/allure2/releases/download/${ALLURE_VERSION}/allure-${ALLURE_VERSION}.tgz
          sudo tar -zxvf allure.tgz -C /opt/
          sudo ln -sf /opt/allure-${ALLURE_VERSION}/bin/allure /usr/local/bin/allure
      
      - name: Run Tests
        run: pytest --alluredir=./reports/allure-results
        continue-on-error: true
      
      - name: Generate Allure Report
        if: always()
        run: allure generate ./reports/allure-results -o ./reports/allure-report --clean
      
      - name: Upload Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: allure-report
          path: ./reports/allure-report
```

### 12.3 钉钉/企业微信通知

`common/notify.py`:

```python
import requests

def send_dingtalk(webhook, content):
    """发送钉钉通知"""
    headers = {"Content-Type": "application/json"}
    data = {
        "msgtype": "markdown",
        "markdown": {
            "title": "接口自动化测试报告",
            "text": content
        }
    }
    requests.post(webhook, json=data, headers=headers)

def send_wechat(webhook, content):
    """发送企业微信通知"""
    data = {
        "msgtype": "markdown",
        "markdown": {"content": content}
    }
    requests.post(webhook, json=data)
```

在 `conftest.py` 添加测试结束 hook：

```python
def pytest_terminal_summary(terminalreporter):
    """测试结束后发送通知"""
    passed = len(terminalreporter.stats.get("passed", []))
    failed = len(terminalreporter.stats.get("failed", []))
    error = len(terminalreporter.stats.get("error", []))
    total = passed + failed + error
    pass_rate = f"{passed/total*100:.1f}%" if total > 0 else "0%"
    
    content = f"""
## 接口自动化测试报告

- 总用例数：{total}
- 通过：{passed}
- 失败：{failed}
- 错误：{error}
- 通过率：{pass_rate}

[查看报告](http://jenkins.example.com/job/api-test/allure)
"""
    # send_dingtalk("https://oapi.dingtalk.com/robot/send?access_token=xxx", content)
```

---

## 十三、常见问题排查

### 13.1 ModuleNotFoundError

```
ModuleNotFoundError: No module named 'common'
```

**原因：** Python 找不到模块路径

**解决：**

1. 项目根目录创建 `pytest.ini` 即可（pytest 会自动以 pytest.ini 所在目录为根）
2. 或在 `conftest.py` 中添加：

```python
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
```

### 13.2 SSL 警告

```
InsecureRequestWarning: Unverified HTTPS request is being made
```

**解决：**

```python
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
```

### 13.3 中文乱码

```python
# 1. 读取 YAML 用 utf-8
with open(file, encoding="utf-8") as f: ...

# 2. JSON 输出禁用 ASCII 转义
json.dumps(data, ensure_ascii=False)

# 3. response 编码强制设置
response.encoding = "utf-8"
```

### 13.4 Allure 报告打不开

直接 `file://` 打开 HTML 会因跨域限制无法加载数据，必须用：

```bash
allure open ./reports/allure-report
# 或
allure serve ./reports/allure-results
```

### 13.5 Allure 报错 "未找到 java"

Allure 需要 Java 8+：

```bash
java -version
# 没有则安装
# Ubuntu: sudo apt install openjdk-11-jdk
# CentOS: sudo yum install java-11-openjdk
```

### 13.6 用例执行顺序问题

Pytest 默认按文件名 + 用例定义顺序执行。如需控制顺序，使用插件：

```bash
# pytest-ordering 已停止维护，推荐 pytest-order
pip install pytest-order
```

```python
@pytest.mark.order(1)
def test_login(): ...

@pytest.mark.order(2)
def test_create_order(): ...
```

!!! tip "更好的实践"
    不要依赖用例执行顺序，每个用例独立。需要数据依赖时用 Fixture。

### 13.7 并发执行

```bash
pip install pytest-xdist
pytest -n 4    # 4 进程并发
pytest -n auto # 自动检测 CPU 数
```

!!! warning "注意"
    并发执行时共享数据可能出问题（如同一账号被多用例同时操作），需要每个用例使用独立数据。

### 13.8 Fixture 不生效

排查清单：
- conftest.py 是否在正确位置（用例同目录或上级目录）
- Fixture 函数名是否拼写正确
- 是否漏写了 `@pytest.fixture` 装饰器
- scope 是否合适

---

## 十四、最佳实践与进阶

### 14.1 用例编写原则

1. **独立性**：每个用例不依赖其他用例的执行结果
2. **可重复**：多次执行结果一致（数据需要清理或使用独立账号）
3. **单一职责**：一个用例只验证一个场景
4. **快速反馈**：用例执行时间 < 5 秒
5. **明确断言**：断言要具体，不要 `assert response`，要 `assert response.json()["code"] == 0`

### 14.2 项目维护建议

| 维度 | 建议 |
|------|------|
| 用例组织 | 按业务模块分文件夹，与项目结构对应 |
| 命名规范 | 见名知意，`test_login_success` 优于 `test_001` |
| 注释规范 | 每个用例写 docstring，说明测试目的 |
| 数据隔离 | 测试数据用独立账号/独立环境，不污染他人 |
| 失败重试 | `pytest-rerunfailures` 处理偶发网络问题 |
| 接口稳定性 | 框架不依赖接口字段顺序，用 JSONPath 提取 |
| 版本管理 | 接口文档变更后及时更新框架 |

### 14.3 进阶学习路径

```
基础接口测试 → 数据驱动 → 接口依赖 → Mock → 数据库校验 
→ 性能测试集成（Locust）→ 接口安全测试 → 测试平台化
```

### 14.4 配套工具与框架

| 工具/框架 | 用途 |
|----------|------|
| **Locust** | Python 性能压测 |
| **Faker** | 生成测试数据（姓名/手机号/地址） |
| **pymysql / SQLAlchemy** | 数据库校验 |
| **redis-py** | 缓存校验 |
| **WireMock** | Mock 服务 |
| **HttpRunner** | 国产自动化框架（基于 YAML） |
| **pytest-bdd** | BDD 行为驱动开发 |

---

## 附录：参考资料

- Requests 官方文档：`https://requests.readthedocs.io/`
- Pytest 官方文档：`https://docs.pytest.org/`
- Allure 官方文档：`https://docs.qameta.io/allure/`
- JSONPath 语法：`https://goessner.net/articles/JsonPath/`
- Python 官方教程：`https://docs.python.org/zh-cn/3/tutorial/`

---

!!! info "文档说明"
    本教程基于 Python 3.10、Requests 2.31、Pytest 7.4、Allure 2.24 编写。

!!! info "测试纪律"
    自动化测试请在专门的测试环境执行，禁止使用生产账号、生产数据。涉及第三方接口注意调用频率限制，避免被封禁。账号密码、Token 等敏感信息使用环境变量或加密存储，不要硬编码在代码中。
