---
description: Playwright 自动化教程，自动等待、网络拦截和 Trace 回放。
---
# Playwright 自动化测试教程（软件测试人员专用）

> 本教程面向软件测试工程师，系统讲解 Microsoft Playwright 进行 Web UI 自动化测试，覆盖环境搭建、元素定位、用例编写、Page Object 模式、API 测试、CI 集成。

---

## 前置要求

| 项目 | 要求 | 获取方式 |
|------|------|----------|
| Python 基础 | 掌握变量、函数、类、文件读写、异常处理 | [Python基础教程-软件测试版](../基础理论/Python基础教程-软件测试版.md) |
| HTML/CSS 基础 | 了解 HTML 标签结构和 CSS 选择器 | [前端基础教程-软件测试版](../基础理论/前端基础教程-软件测试版.md) |

---

## 新手导读

Playwright 比 Selenium 更现代，但新手仍然要按基础流程学：打开页面、定位元素、操作元素、等待结果、断言结果。

建议第一遍重点掌握：

1. `page.goto()` 打开页面。
2. `get_by_role`、`get_by_text`、`get_by_test_id` 定位元素。
3. `click()`、`fill()` 完成操作。
4. 自动等待和断言。
5. Trace 用来回放失败过程。

不要一开始就追求复杂框架。先写出 3 条稳定用例，再学习 Page Object 和 CI 集成。

### 版本与维护说明

| 项目 | 说明 |
|------|------|
| 适用技术栈 | Playwright Python、Pytest、官方浏览器依赖 |
| 使用建议 | 先学定位、自动等待、断言和 Trace，再搭 Page Object |
| 更新提醒 | 官方镜像标签、浏览器依赖和 Action 版本会变化，CI 前先本地执行最小用例 |

---

## 最佳实践速查：推荐写法 vs 新手写法

| 场景 | 新手常见写法 | 推荐写法 | 原因 |
|------|--------------|----------|------|
| 等待 | `page.wait_for_timeout(5000)` | `expect(locator).to_be_visible()` | 自动等待更稳定，减少误报 |
| 定位 | XPath 或复杂 CSS | `get_by_role`、`get_by_label`、`get_by_test_id` | 更接近用户行为，维护成本低 |
| 断言 | 只断言 URL 包含某字符串 | 断言用户可见结果和关键业务状态 | URL 变化不一定代表业务成功 |
| 登录前置 | 每条 UI 用例都从登录页开始 | 用接口登录或 storage state 复用登录态 | 降低用例耗时和失败点 |
| 失败排查 | 只看命令行报错 | 保存截图、视频或 Trace | 能回放失败现场 |
| 用例范围 | 一个用例跑完整业务长链路 | UI 只覆盖核心路径，复杂校验下沉接口层 | 降低维护成本 |

不推荐：

```python
page.goto("https://test.example.com/login")
page.locator("#username").fill("test")
page.locator("#password").fill("123456")
page.locator(".btn").click()
page.wait_for_timeout(5000)
assert "home" in page.url
```

推荐：

```python
from playwright.sync_api import expect


def test_login_success(page):
    page.goto("https://test.example.com/login")
    page.get_by_label("用户名").fill("test")          # (1)
    page.get_by_label("密码").fill("123456")
    page.get_by_role("button", name="登录").click()   # (2)

    expect(page.get_by_text("退出登录")).to_be_visible()  # (3)
```

1. `get_by_label` 通过 `<label>` 标签的文本定位输入框，比 CSS 选择器更接近用户视角，表单结构变化时不易断裂
2. `get_by_role` 基于 ARIA 语义角色定位，不依赖 CSS class 或 DOM 结构，是最稳定的定位策略
3. `expect` 内置自动等待（默认 5 秒），元素出现前会持续轮询，无需手动 `sleep`；断言失败时自动截图

稳定的 Playwright 用例通常有三个特点：定位可读、等待可靠、失败可追踪。

## 一、Playwright 简介

### 1.1 什么是 Playwright

Playwright 是 Microsoft 开源的 **Web 端到端测试框架**，支持：

- **Chromium**（Chrome / Edge）
- **Firefox**
- **WebKit**（Safari 引擎）
- **全平台**：Windows、Mac、Linux
- **多语言**：TypeScript / JavaScript（原生）、Python、Java、.NET

### 1.2 Playwright vs Selenium

| 维度 | Playwright | Selenium |
|------|-----------|----------|
| 架构 | 直连浏览器协议（CDP/自研） | WebDriver 协议 |
| 速度 | 快 | 中等 |
| 自动等待 | ✅ 内置 | ❌ 需手动 |
| 网络拦截 | ✅ 原生支持 | ❌ 需第三方 |
| 代码生成 | ✅ Codegen 录制 | ❌ 无 |
| Trace 录制 | ✅ 内置 | ❌ 无 |
| 多标签/iframe | 原生流畅 | 需切换上下文 |
| 浏览器驱动 | 自动下载 | 需手动管理 |
| 生态 | 增长中 | 最成熟 |
| 学习曲线 | 平缓 | 中等 |

### 1.3 核心特性

- **自动等待**：元素可操作时自动执行，无需 `sleep` 或显式 `wait`
- **网络拦截**：Mock 接口、拦截请求/响应
- **Codegen**：录制操作自动生成测试代码
- **Trace Viewer**：时间线回放，失败可追溯
- **并行执行**：默认并行，无需额外配置
- **浏览器上下文**：轻量隔离，模拟多用户

### 1.4 适用场景

| 场景 | 适合度 |
|------|--------|
| Web UI 回归测试 | ✅ 非常适合 |
| 跨浏览器兼容性 | ✅ 三引擎 |
| 表单/流程测试 | ✅ |
| API 测试 | ✅ 内置 API |
| 性能测试 | ❌ 用专门工具 |
| 移动 App 测试 | ❌ 用 Appium |

---

## 二、环境搭建

### 2.1 安装（Python）

```bash
pip install playwright
playwright install        # 自动下载 Chromium、Firefox、WebKit
```

> `playwright install` 下载的浏览器约 300-500MB，首次需等待。

如只需 Chromium：

```bash
playwright install chromium
```

### 2.2 安装 Pytest 插件

```bash
pip install pytest-playwright
```

### 2.3 验证

```bash
python -c "from playwright.sync_api import sync_playwright; print('OK')"
playwright --version
```

### 2.4 IDE 配置

**VSCode 插件：** 安装 `Playwright Test for VSCode`（官方插件），支持一键运行、调试、录制。

**PyCharm：** 无需特殊配置，Python 项目即可。

---

## 三、第一个测试

### 3.1 Pytest 风格（推荐）

> `page` 参数由 pytest-playwright 插件自动注入，不需要手动创建浏览器或页面——写上 `page: Page` 就能直接用。

```python
# test_demo.py
from playwright.sync_api import Page, expect

def test_baidu_search(page: Page):
    page.goto("https://www.baidu.com")          # (1)
    page.locator("#kw").fill("Playwright")
    page.locator("#su").click()
    expect(page).to_have_title("Playwright")    # (2)
```

1. 默认 `wait_until="load"`，可选 `"domcontentloaded"`、`"networkidle"` 或 `"commit"`，单页应用推荐用 `"networkidle"` 等待接口完成
2. `expect` 内置自动等待（默认 5 秒超时），比 `assert page.title() == ...` 更稳定，避免页面标题尚未更新时的误报

运行：

```bash
pytest test_demo.py --browser chromium -v
```

### 3.2 原生 API 风格

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto("https://www.baidu.com")
    page.locator("#kw").fill("Playwright")
    page.locator("#su").click()
    print(page.title())
    browser.close()
```

### 3.3 Pytest Fixtures

`pytest-playwright` 自动提供以下 fixtures：

| Fixture | 作用 |
|---------|------|
| `playwright` | Playwright 实例 |
| `browser` | 浏览器实例 |
| `browser_name` | 当前浏览器名 |
| `context` | 浏览器上下文（隔离环境） |
| `page` | 页面实例 |
| `is_chromium` / `is_firefox` / `is_webkit` | 浏览器判断 |

```python
def test_example(page: Page):
    page.goto("https://example.com")
    assert page.title() == "Example Domain"
```

---

## 四、元素定位

### 4.1 Playwright 推荐的定位策略

Playwright 用 `page.locator()` 定位，支持多种选择器：

```python
# 1. CSS 选择器
page.locator("#login-btn")
page.locator(".submit-button")
page.locator("button[type='submit']")

# 2. Text 文本（推荐，用户视角）
page.get_by_text("登录")
page.get_by_text("登录", exact=True)    # 精确匹配
page.get_by_text(/登(录|出)/)            # 正则

# 3. Role 角色（最推荐，符合 WAI-ARIA）
page.get_by_role("button", name="登录")
page.get_by_role("link", name="首页")
page.get_by_role("textbox", name="用户名")

# 4. Label 标签关联
page.get_by_label("用户名")
page.get_by_label("密码")

# 5. Placeholder 占位符
page.get_by_placeholder("请输入用户名")

# 6. Alt Text（图片）
page.get_by_alt_text("Logo")

# 7. Title 属性
page.get_by_title("关闭")

# 8. Test ID（需配合 data-testid 属性）
page.get_by_test_id("login-btn")
# 对应 HTML：<button data-testid="login-btn">登录</button>

# 9. XPath（不推荐，但支持）
page.locator("xpath=//button[@id='login']")
```

### 4.2 定位优先级

```
推荐程度（从高到低）：
1. get_by_role()      ← 用户视角，最稳定
2. get_by_test_id()   ← 开发配合加 data-testid
3. get_by_label()     ← 表单字段
4. get_by_text()      ← 按钮、链接文本
5. get_by_placeholder()
6. CSS 选择器         ← 通用
7. XPath              ← 最后选择
```

### 4.3 过滤与链式

```python
# 过滤
page.locator("div.product").filter(has_text="iPhone").click()

# 多条件过滤
page.locator("li").filter(
    has=page.locator(".title", has_text="商品A"),
    has_not=page.locator(".sold-out")
)

# 链式定位
page.locator("form#login").locator("input[name='username']").fill("test")

# 第 N 个匹配
page.locator("button").nth(0)      # 第 1 个
page.locator("button").first       # 第 1 个
page.locator("button").last        # 最后一个
```

### 4.4 断言（expect）

```python
from playwright.sync_api import expect

# 元素断言
expect(page.locator("#msg")).to_be_visible()
expect(page.locator("#msg")).to_be_hidden()
expect(page.locator("#msg")).to_contain_text("成功")
expect(page.locator("#msg")).to_have_text("登录成功")
expect(page.locator("input")).to_have_value("testuser")
expect(page.locator("input")).to_be_enabled()
expect(page.locator("input")).to_be_checked()
expect(page.locator("input")).to_have_attribute("type", "text")
expect(page.locator("input")).to_have_class(/active/)
expect(page.locator("li")).to_have_count(10)

# 页面断言
expect(page).to_have_title("首页")
expect(page).to_have_url(".*dashboard.*")
expect(page).to_have_url(re.compile(r".*/dashboard"))
```

> `expect` 自动等待，最多等 5 秒（可配置），不需要显式等待。

---

## 五、常用操作

### 5.1 导航

```python
page.goto("https://example.com")
page.go_back()
page.go_forward()
page.reload()
```

### 5.2 点击

```python
page.locator("#btn").click()
page.locator("#btn").click(button="right")       # 右键
page.locator("#btn").click(button="middle")      # 中键
page.locator("#btn").double_click()              # 双击
page.locator("#btn").click(modifiers=["Shift"])  # 按住 Shift 点击
page.locator("#btn").click(force=True)           # 强制点击（跳过可见性检查）
```

### 5.3 输入

```python
page.locator("input").fill("hello")             # 清空并输入（推荐）
page.locator("input").type("hello", delay=100)  # 逐字输入（模拟打字），Playwright 1.38+ 推荐用 press_sequentially 替代
page.locator("input").press_sequentially("hello", delay=100)  # 同上（1.38+ 新增，type() 的替代方法）
page.locator("input").clear()                   # 清空
```

### 5.4 键盘

```python
page.locator("input").press("Enter")
page.locator("input").press("Tab")
page.locator("input").press("Escape")
page.locator("input").press("Control+a")        # 全选
page.locator("input").press("Control+c")        # 复制

# 全局键盘
page.keyboard.press("Enter")
page.keyboard.press("ArrowDown")
page.keyboard.type("hello")
```

### 5.5 选择框

```python
# 单选
page.locator("select#city").select_option("beijing")
page.locator("select#city").select_option(value="beijing")
page.locator("select#city").select_option(label="北京")
page.locator("select#city").select_option(index=0)

# 多选
page.locator("select#tags").select_option(["tag1", "tag2"])

# 原生 checkbox / radio
page.locator("input#agree").check()
page.locator("input#agree").uncheck()
page.locator("input#agree").set_checked(True)   # 设为选中
```

### 5.6 文件上传

```python
# 单文件
page.locator("input[type='file']").set_input_files("test.jpg")

# 多文件
page.locator("input[type='file']").set_input_files(["a.jpg", "b.jpg"])

# 无文件上传控件时（通过事件）
with page.expect_file_chooser() as fc_info:
    page.locator("#upload-btn").click()
file_chooser = fc_info.value
file_chooser.set_files("test.jpg")
```

### 5.7 鼠标操作

```python
# 悬停
page.locator("#menu").hover()

# 拖放
page.locator("#source").drag_to(page.locator("#target"))

# 精确坐标
page.mouse.click(100, 200)
page.mouse.dblclick(100, 200)
page.mouse.move(300, 400)
```

### 5.8 截图

```python
# 全页面截图
page.screenshot(path="page.png")

# 元素截图
page.locator("#form").screenshot(path="form.png")

# 整个滚动页面
page.screenshot(path="full.png", full_page=True)
```

---

## 六、等待机制

### 6.1 Playwright 的自动等待

Playwright 在执行操作前会自动：

1. 等待元素 attached 到 DOM
2. 等待元素 visible
3. 等待元素 stable（不在动画中）
4. 等待元素 enabled
5. 等待元素可接收事件

```python
# 不需要手动等待，Playwright 自动处理
page.locator("#btn").click()   # 自动等到按钮可点
```

### 6.2 显式等待

```python
# 等待元素出现
page.locator("#result").wait_for(timeout=10000)

# 等待元素消失（如 loading）
page.locator("#loading").wait_for(state="hidden", timeout=10000)

# 等待页面导航
page.wait_for_url("**/dashboard")

# 等待网络空闲（500ms 内无新请求，适合 SPA 单页应用等 API 加载完再操作）
page.wait_for_load_state("networkidle")

# 等待特定请求完成
with page.expect_response("**/api/user") as resp_info:
    page.locator("#load-user").click()
response = resp_info.value
```

### 6.3 强制等待（不推荐）

```python
import time
time.sleep(3)   # 尽量避免
```

---

## 七、浏览器上下文与页面

### 7.1 浏览器上下文

上下文（Context）是轻量隔离环境，类似无痕模式：

```python
with sync_playwright() as p:
    browser = p.chromium.launch()
    
    # 两个独立上下文 = 两个独立用户
    context1 = browser.new_context()  # (1)
    context2 = browser.new_context()
    
    page1 = context1.new_page()
    page2 = context2.new_page()
    
    page1.goto("https://example.com/login")
    page1.locator("#username").fill("user1")
    
    page2.goto("https://example.com/login")
    page2.locator("#username").fill("user2")
    
    # 互不影响
    context1.close()
    context2.close()
    browser.close()
```

1. 每个 `new_context()` 拥有独立的 cookie、localStorage 和会话状态，天然隔离多用户场景，无需手动清理

### 7.2 上下文配置

配置项按需选用，不用全部写上。常用的：`base_url` 省得每次写完整 URL，`viewport` 测试不同屏幕尺寸，`ignore_https_errors` 跳过测试环境证书。

```python
context = browser.new_context(
    base_url="https://test.example.com",     # 基础 URL，之后 goto 可以写相对路径
    viewport={"width": 1920, "height": 1080},  # 浏览器窗口大小（测试响应式布局用）
    ignore_https_errors=True,               # 忽略证书错误（测试环境常用）
    locale="zh-CN",                          # 语言
    timezone_id="Asia/Shanghai",             # 时区（影响页面时间显示）
    geolocation={"longitude": 116.4, "latitude": 39.9},  # GPS 坐标（测定位功能）
    permissions=["geolocation"],             # 授权地理位置权限
    color_scheme="dark",                     # 暗色模式
    storage_state="auth.json",              # (1)
)
```

1. `storage_state` 加载之前保存的 cookie 和 localStorage，跳过登录步骤；配合 `context.storage_state(path="auth.json")` 保存，实现登录态复用

### 7.3 持久化登录态

```python
# 第一次：手动登录，保存状态
context = browser.new_context()
page = context.new_page()
page.goto("https://example.com/login")
page.locator("#username").fill("test")
page.locator("#password").fill("123456")
page.locator("#login-btn").click()
context.storage_state(path="auth.json")    # 保存 cookie/localStorage
context.close()

# 后续：直接恢复登录态
context = browser.new_context(storage_state="auth.json")
page = context.new_page()
page.goto("https://example.com/dashboard")  # 已登录状态
```

### 7.4 多标签页

```python
page = context.new_page()
page.goto("https://example.com")

# 点击会打开新标签页时
with context.expect_page() as new_page_info:
    page.locator("#open-new-tab").click()
new_page = new_page_info.value
new_page.wait_for_load_state()
print(new_page.title())
```

---

## 八、高级操作

### 8.1 网络拦截

**拦截请求：**

```python
# 阻止图片加载（加速测试）— 用正则代替 glob 大括号
import re
page.route(re.compile(r"\.(png|jpg|jpeg|gif)$"), lambda route: route.abort())
# lambda 是简写函数，等价于 def block(route): route.abort()

# 修改请求头
def add_auth(route):
    route.continue_(headers={**route.request.headers, "Authorization": "Bearer test"})
page.route("**/api/**", add_auth)
```

**Mock 接口响应：**

```python
# Mock 一个 API
page.route("**/api/user", lambda route: route.fulfill(
    status=200,
    content_type="application/json",
    body='{"code":0,"data":{"name":"测试用户"}}'
))

# 根据请求参数返回不同响应
def mock_login(route):
    body = route.request.post_data
    if "testuser" in body:
        route.fulfill(status=200, content_type="application/json",
                      body='{"code":0,"data":{"token":"abc123"}}')
    else:
        route.fulfill(status=200, content_type="application/json",
                      body='{"code":1001,"msg":"账号不存在"}')

page.route("**/api/login", mock_login)
```

**监听网络请求：**

```python
# 记录所有请求
page.on("request", lambda req: print(f">> {req.method} {req.url}"))
page.on("response", lambda res: print(f"<< {res.status} {res.url}"))

# 只监听特定
def log_api(response):
    if "/api/" in response.url:
        print(f"API: {response.url} -> {response.status}")
page.on("response", log_api)

# 获取特定请求的响应
with page.expect_response("**/api/data") as resp_info:
    page.locator("#load").click()
response = resp_info.value
print(response.json())
```

### 8.2 iframe

```python
# 不需要 switch_to.frame，直接用 frame_locator
frame = page.frame_locator("iframe#editor")
frame.locator("#content").fill("hello")
frame.locator("#save").click()

# 嵌套 iframe
inner = page.frame_locator("iframe#outer").frame_locator("iframe#inner")
inner.locator("#btn").click()
```

### 8.3 弹窗 / 对话框

```python
# 自动处理 dialog
page.on("dialog", lambda dialog: dialog.accept())

# 或按条件处理
def handle_dialog(dialog):
    if "确认" in dialog.message:
        dialog.accept()
    else:
        dialog.dismiss()
page.on("dialog", handle_dialog)
```

### 8.4 Shadow DOM

```python
# Playwright 原生支持 Shadow DOM，直接定位
page.locator("my-component").locator("#inner-btn").click()
```

### 8.5 Codegen 录制

自动生成测试代码：

```bash
# 打开录制器
playwright codegen https://example.com

# 指定语言
playwright codegen --target python https://example.com

# 保存登录态后录制
playwright codegen --save-storage=auth.json https://example.com
playwright codegen --load-storage=auth.json https://example.com
```

录制过程中，操作浏览器会自动生成对应 Python 代码。

### 8.6 Trace 录制

```python
context = browser.new_context()
context.tracing.start(screenshots=True, snapshots=True, sources=True)

page = context.new_page()
page.goto("https://example.com")
# ... 执行测试 ...

context.tracing.stop(path="trace.zip")
```

查看 Trace：

```bash
playwright show-trace trace.zip
```

会打开一个时间线 UI，可逐步回放、查看每一步的截图、DOM、网络请求。

---

## 九、Page Object 模式

### 9.1 BasePage

```python
# pages/base_page.py
from playwright.sync_api import Page, expect

class BasePage:
    def __init__(self, page: Page):
        self.page = page
    
    def navigate(self, url: str):
        self.page.goto(url)
        return self
    
    def click(self, locator: str):
        self.page.locator(locator).click()
        return self
    
    def fill(self, locator: str, text: str):
        self.page.locator(locator).fill(text)
        return self
    
    def get_text(self, locator: str) -> str:
        return self.page.locator(locator).text_content()
    
    def is_visible(self, locator: str) -> bool:
        return self.page.locator(locator).is_visible()
    
    def wait_for(self, locator: str, state: str = "visible"):
        self.page.locator(locator).wait_for(state=state)
        return self
```

### 9.2 LoginPage 示例

```python
# pages/login_page.py
from playwright.sync_api import Page, expect
from pages.base_page import BasePage

class LoginPage(BasePage):
    URL = "/login"
    
    # 定位
    USERNAME = "input[name='username']"
    PASSWORD = "input[name='password']"
    LOGIN_BTN = "button[type='submit']"
    ERROR_MSG = ".error-message"
    
    def __init__(self, page: Page):
        super().__init__(page)
    
    def open(self):
        self.navigate(self.URL)
        return self
    
    def login(self, username: str, password: str):
        self.fill(self.USERNAME, username)
        self.fill(self.PASSWORD, password)
        self.click(self.LOGIN_BTN)
        return self
    
    def get_error_msg(self) -> str:
        return self.get_text(self.ERROR_MSG)
    
    def expect_error(self, msg: str):
        expect(self.page.locator(self.ERROR_MSG)).to_contain_text(msg)
        return self
```

### 9.3 测试用例

```python
# tests/test_login.py
import pytest
from pages.login_page import LoginPage

class TestLogin:
    
    def test_login_success(self, page):
        login_page = LoginPage(page)
        login_page.open().login("testuser", "123456")
        expect(page).to_have_url("**/dashboard")
    
    def test_login_wrong_password(self, page):
        login_page = LoginPage(page)
        login_page.open().login("testuser", "wrong")
        login_page.expect_error("密码错误")
    
    @pytest.mark.parametrize("user,pwd,expected", [
        ("", "123456", "用户名不能为空"),
        ("test", "", "密码不能为空"),
    ])
    def test_login_invalid(self, page, user, pwd, expected):
        login_page = LoginPage(page)
        login_page.open().login(user, pwd)
        login_page.expect_error(expected)
```

---

## 十、API 测试

Playwright 内置 `APIRequestContext`，可以做接口测试：

```python
from playwright.sync_api import APIRequestContext

def test_login_api(api_context: APIRequestContext):
    response = api_context.post("/api/login", data={
        "username": "testuser",
        "password": "123456"
    })
    assert response.ok
    body = response.json()
    assert body["code"] == 0
    assert "token" in body["data"]
```

**Fixtures 配置：**

```python
# conftest.py
import pytest
from playwright.sync_api import APIRequestContext

@pytest.fixture(scope="session")
def api_context(playwright):
    context = playwright.request.new_context(
        base_url="https://api-test.example.com",
        extra_http_headers={"Content-Type": "application/json"}
    )
    yield context
    context.dispose()
```

**UI + API 混合测试：**

```python
def test_order_flow(page: Page, api_context: APIRequestContext):
    # API 登录拿 token
    resp = api_context.post("/api/login", data={"username": "test", "password": "123"})
    token = resp.json()["data"]["token"]
    
    # 注入 token 到浏览器
    page.goto("https://example.com")
    page.evaluate(f"localStorage.setItem('token', '{token}')")
    page.reload()
    
    # UI 操作
    page.goto("https://example.com/dashboard")
    expect(page.locator(".welcome")).to_contain_text("欢迎")
```

---

## 十一、项目框架搭建

### 11.1 目录结构

```
playwright-test/
├── pages/                    # Page Object
│   ├── base_page.py
│   ├── login_page.py
│   └── home_page.py
├── tests/                    # 测试用例
│   ├── test_login.py
│   └── test_home.py
├── data/                     # 测试数据
│   └── login_data.yaml
├── conftest.py               # Fixtures
├── pytest.ini                # Pytest 配置
├── playwright.config.py      # Playwright 配置（可选）
├── requirements.txt
└── README.md
```

### 11.2 conftest.py

```python
import os
import pytest
from playwright.sync_api import Page, BrowserContext

@pytest.fixture(scope="function")
def login_context(browser) -> BrowserContext:
    """已登录的上下文"""
    context = browser.new_context(
        storage_state="auth.json" if os.path.exists("auth.json") else None
    )
    yield context
    context.close()

@pytest.fixture(scope="function")
def login_page(login_context) -> Page:
    """已登录的页面"""
    page = login_context.new_page()
    yield page
    page.close()
```

### 11.3 pytest.ini

```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts =
    -v                                  # 详细输出
    --browser chromium                  # 默认浏览器
    --screenshot on                     # 失败时自动截图
    --video on                          # 录制测试视频
    --tracing on                        # 记录执行轨迹（用 playwright show-trace 查看）
    --output test-results               # 截图/视频/轨迹保存目录
```

### 11.4 playwright.config.py（可选，非 pytest 插件用）

```python
# Playwright Test 原生配置（Node.js 版），Python 通常用 pytest.ini
# 保留供参考
```

---

## 十二、CI/CD 集成

### 12.1 GitHub Actions

```yaml
name: Playwright Tests
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      
      - name: Install dependencies
        run: |
          pip install playwright pytest-playwright
          playwright install --with-deps chromium
      
      - name: Run tests
        run: pytest --browser chromium --output test-results
      
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: test-results/
```

### 12.2 Docker 运行

```dockerfile
# 版本号需与 pip install playwright 的版本一致
# 基础镜像标签按官方可用标签选择，如 noble / jammy 等系统版本
# 查看可用标签：https://mcr.microsoft.com/en-us/artifact/mar/playwright/python
FROM mcr.microsoft.com/playwright/python:v1.52.0-jammy
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["pytest", "--browser", "chromium"]
```

---

## 十三、实战案例

### 13.1 电商登录测试

```python
import pytest
from playwright.sync_api import Page, expect

class TestLogin:
    
    def test_login_success(self, page: Page):
        page.goto("https://shop.example.com/login")
        page.get_by_label("用户名").fill("testuser")
        page.get_by_label("密码").fill("123456")
        page.get_by_role("button", name="登录").click()
        expect(page).to_have_url("**/dashboard")
        expect(page.get_by_text("欢迎")).to_be_visible()
    
    def test_login_wrong_password(self, page: Page):
        page.goto("https://shop.example.com/login")
        page.get_by_label("用户名").fill("testuser")
        page.get_by_label("密码").fill("wrong")
        page.get_by_role("button", name="登录").click()
        expect(page.get_by_text("密码错误")).to_be_visible()
```

### 13.2 Mock 接口测试

```python
def test_order_list_mock(page: Page):
    # Mock 订单列表接口
    page.route("**/api/orders", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='''{
            "code": 0,
            "data": [
                {"id": 1, "amount": 100, "status": "PAID"},
                {"id": 2, "amount": 200, "status": "UNPAID"}
            ]
        }'''
    ))
    
    page.goto("https://shop.example.com/orders")
    expect(page.locator(".order-item")).to_have_count(2)
    expect(page.locator(".order-item").first).to_contain_text("100")
```

### 13.3 文件上传测试

```python
def test_avatar_upload(page: Page):
    page.goto("https://example.com/profile")
    page.locator("input[type='file']").set_input_files("test-avatar.jpg")
    expect(page.locator(".upload-success")).to_be_visible()
```

### 13.4 多浏览器测试

```bash
# 同时在三个浏览器跑
pytest --browser chromium --browser firefox --browser webkit
```

```python
# 代码中判断浏览器
def test_example(page: Page, browser_name: str):
    if browser_name == "webkit":
        pytest.skip("Safari 不支持某特性")
    # ...
```

---

## 十四、常见问题排查

### 14.1 元素找不到

- 用 `page.pause()` 打开 Playwright Inspector 调试
- 用 Codegen 录制确认选择器
- 检查是否在 iframe 中（用 `frame_locator`）
- 检查是否有 Shadow DOM

### 14.2 测试偶尔失败

- Playwright 自动等待一般够用，检查是否有竞态条件
- 用 `expect` 断言代替 `assert`（自带等待）
- Trace 录制排查：`context.tracing.start(screenshots=True)`

### 14.3 慢

- `--browser chromium` 只跑一个浏览器
- `headless=True`（默认就是）
- 阻止图片/字体加载：`page.route(re.compile(r"\.(png|jpg|woff2)$"), lambda r: r.abort())`

### 14.4 登录态问题

- 用 `storage_state` 持久化
- fixture 设置 `scope="session"` 避免每次登录

### 14.5 CI 环境问题

- Linux 无头模式需要安装依赖：`playwright install --with-deps`
- Docker 用官方镜像 `mcr.microsoft.com/playwright/python`

### 14.6 与 Selenium 迁移

Playwright 的 `locator` 类似 Selenium 的 `find_element`，但 API 更简洁。迁移时注意：
- 无需 `WebDriverWait`，`expect` 自带等待
- `page.goto()` 替代 `driver.get()`
- `locator.fill()` 替代 `send_keys()`
- iframe 不需要 `switch_to`

---

## 十五、最佳实践

### 15.1 用例编写

- 优先用 `get_by_role` / `get_by_test_id` 定位
- 用 `expect` 断言而非 `assert`
- 失败时自动截图（`--screenshot on`）
- 用 Trace 录制排查偶发失败

### 15.2 框架设计

- Page Object 模式
- 登录态用 `storage_state` 持久化
- API + UI 混合测试
- 数据外部化（YAML/JSON）

### 15.3 推荐学习

- 官方文档：`https://playwright.dev/python/`
- GitHub：`https://github.com/microsoft/playwright-python`
- Playwright Inspector：调试利器

---

!!! info "测试纪律"
    Playwright 自动等待机制大幅减少了 flaky test，但仍需注意：不要硬编码 sleep；用 expect 断言；失败用 Trace 排查；CI 环境用官方 Docker 镜像。
