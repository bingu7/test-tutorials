# Web 自动化项目实战

> 本实战用于训练 Web UI 自动化项目的设计能力，重点不是录制脚本，而是建立稳定、可维护、可持续运行的自动化体系。

---

## 新手导读

| 项目 | 说明 |
|------|------|
| 适合人群 | 已会基础页面测试，想把稳定 Web 流程沉淀成自动化的新手 |
| 前置知识 | HTML 元素、浏览器 DevTools、Pytest 基础、Selenium 或 Playwright 基础 |
| 最终产出 | 页面对象、登录用例、商品搜索用例、加购用例、失败截图和 CI 运行示例 |
| 跟练方式 | 先手工记录每一步，再用代码复现，最后补等待、断言和失败产物 |
| 常见卡点 | 大量使用 `sleep`；定位器不稳定；页面没加载完就断言；用例过长 |

Web 自动化第一目标是稳定，不是数量。先让 3 到 5 条核心用例每天都能跑，再考虑扩大覆盖范围。

---

## 一、项目目标

以电商 Web 前台为例，自动化覆盖用户最核心的浏览和下单前置流程：

1. 用户登录。
2. 搜索商品。
3. 查看商品详情。
4. 加入购物车。
5. 进入购物车校验商品。
6. 提交订单前置验证。

第一版不建议自动化真实支付。支付通常依赖第三方沙箱、回调和风控规则，更适合放到接口或联调环境中验证。

如果你是新手，先把 Web 自动化理解成：

```text
用代码打开浏览器，模拟用户点击和输入，并自动检查页面结果。
```

它不是为了代替所有手工测试，而是把稳定、重复、重要的流程交给机器每天检查。

---

## 二、先手工走通，再写自动化

写脚本前，先手工执行一遍流程：

1. 打开首页。
2. 点击登录。
3. 输入账号密码。
4. 登录成功后搜索商品。
5. 进入商品详情。
6. 加入购物车。
7. 打开购物车并确认商品存在。

手工都走不通时，不要写自动化。因为这时你不知道失败是业务问题、环境问题，还是脚本问题。

记录手工步骤：

```text
页面地址：
测试账号：
操作步骤：
每一步看到的页面结果：
哪些元素需要定位：
哪些地方加载比较慢：
```

这些记录会变成自动化脚本的基础。

---

## 三、自动化范围选择

### 适合自动化的场景

| 场景 | 原因 |
|------|------|
| 登录主流程 | 高频、稳定、回归价值高 |
| 搜索商品 | 可重复验证核心入口 |
| 加入购物车 | 业务关键链路 |
| 订单提交前置 | 可验证页面、接口和数据联动 |
| 权限跳转 | 能快速发现鉴权和路由问题 |

### 不建议第一版自动化的场景

| 场景 | 原因 |
|------|------|
| 图片视觉细节 | 断言成本高，容易误报 |
| 活动页频繁改版 | 页面变化快，维护成本高 |
| 第三方支付真实流程 | 依赖外部环境，不稳定 |
| 低频后台配置 | 回归价值低 |

自动化范围要小而稳。先让核心用例每天能稳定跑，再逐步扩展。

---

## 四、技术选型

| 工具 | 适用场景 |
|------|----------|
| Selenium | 生态成熟，适合传统 Web 自动化和多语言团队 |
| Playwright | 自动等待、Trace、网络拦截能力强，适合现代 Web 项目 |

新项目优先考虑 Playwright；已有 Selenium 框架的团队，可以继续维护并逐步引入 Playwright 处理复杂场景。

---

## 五、从 0 开始准备项目

以 Playwright + Pytest 为例：

```bash
mkdir web_auto_project
cd web_auto_project
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install pytest playwright
playwright install
mkdir pages tests data common reports
```

先写一个最小脚本：

```python
def test_open_home(page):
    page.goto("https://test-web.example.com")
    assert page.title() != ""
```

能打开页面后，再继续写登录、搜索、加购流程。

---

## 六、项目目录结构

```text
web_auto_project/
├── pages/
│   ├── login_page.py
│   ├── product_page.py
│   └── cart_page.py
├── tests/
│   ├── test_login.py
│   └── test_shopping_flow.py
├── data/
│   └── users.yaml
├── common/
│   ├── browser.py
│   ├── screenshot.py
│   └── logger.py
├── reports/
├── pytest.ini
└── requirements.txt
```

目录设计原则：

- `pages/` 只放页面元素和页面行为。
- `tests/` 只描述测试场景和断言。
- `common/` 放浏览器启动、截图、日志等通用能力。
- 测试数据单独管理，不硬编码在脚本中。

---

## 七、页面对象模型

页面对象模型的核心是把页面细节和测试用例分离。

示例：

```python
class LoginPage:
    def __init__(self, page):
        self.page = page
        self.username = page.get_by_placeholder("用户名")
        self.password = page.get_by_placeholder("密码")
        self.login_button = page.get_by_role("button", name="登录")

    def login(self, username, password):
        self.username.fill(username)
        self.password.fill(password)
        self.login_button.click()
```

测试用例保持简洁：

```python
def test_login_success(page):
    login_page = LoginPage(page)
    login_page.login("test_user", "test_password")
    assert page.get_by_text("退出登录").is_visible()
```

不要在测试用例里堆大量定位器，否则页面一改，维护成本会很高。

---

## 八、元素定位策略

优先级建议：

| 优先级 | 定位方式 | 说明 |
|--------|----------|------|
| 1 | `data-testid` | 最稳定，建议和前端约定 |
| 2 | role / label / text | 接近用户行为，可读性好 |
| 3 | CSS 选择器 | 适合结构稳定的元素 |
| 4 | XPath | 兜底使用，不建议大量依赖 |

推荐和前端约定：

```html
<button data-testid="login-submit">登录</button>
```

测试中使用：

```python
page.get_by_test_id("login-submit").click()
```

---

## 九、核心流程自动化

### 9.1 登录流程

| 步骤 | 操作 | 断言 |
|------|------|------|
| 1 | 打开登录页 | 页面加载成功 |
| 2 | 输入账号密码 | 输入框内容正确 |
| 3 | 点击登录 | 跳转首页 |
| 4 | 校验登录态 | 展示用户名或退出按钮 |

### 9.2 加购流程

| 步骤 | 操作 | 断言 |
|------|------|------|
| 1 | 搜索商品 | 列表展示目标商品 |
| 2 | 进入详情页 | 展示价格和库存 |
| 3 | 点击加入购物车 | 提示加购成功 |
| 4 | 进入购物车 | 商品名称、数量、价格正确 |

### 9.3 订单前置流程

| 步骤 | 操作 | 断言 |
|------|------|------|
| 1 | 选择购物车商品 | 商品被勾选 |
| 2 | 点击结算 | 进入确认订单页 |
| 3 | 校验地址和金额 | 信息展示正确 |
| 4 | 提交订单前拦截 | 不进入真实支付 |

---

## 十、脚本写法示例

### 10.1 登录页对象

```python
class LoginPage:
    def __init__(self, page):
        self.page = page

    def open(self):
        self.page.goto("https://test-web.example.com/login")

    def login(self, username, password):
        self.page.get_by_placeholder("用户名").fill(username)
        self.page.get_by_placeholder("密码").fill(password)
        self.page.get_by_role("button", name="登录").click()
```

### 10.2 测试用例

```python
def test_login_success(page):
    login_page = LoginPage(page)
    login_page.open()
    login_page.login("test_user", "test_password")

    page.get_by_text("退出登录").wait_for()
    assert page.get_by_text("退出登录").is_visible()
```

新手先写清楚一个流程，不要一开始就抽很多公共方法。

---

## 十一、等待与稳定性

Web 自动化失败很多时候不是功能缺陷，而是等待策略不合理。

建议：

- 不使用固定 `sleep` 作为主要等待方式。
- 优先等待元素可见、可点击或网络响应完成。
- 对异步加载列表，要等待关键数据出现。
- 失败时保存截图、HTML 和日志。

Playwright 示例：

```python
page.get_by_role("button", name="登录").click()
page.get_by_text("退出登录").wait_for()
```

Selenium 示例：

```python
WebDriverWait(driver, 10).until(
    EC.visibility_of_element_located((By.CSS_SELECTOR, "[data-testid='logout']"))
)
```

---

## 十二、失败截图与日志

失败时至少保留：

| 产物 | 用途 |
|------|------|
| 截图 | 快速判断页面状态 |
| 页面 HTML | 分析元素是否存在 |
| 浏览器日志 | 发现前端异常 |
| 测试日志 | 还原测试步骤 |
| Trace | Playwright 场景下回放失败过程 |

Pytest 可以在用例失败时自动截图，也可以通过 Allure 附件展示截图和日志。

---

## 十三、练习任务

请完成下面 5 个小任务：

1. 打开首页并断言标题不为空。
2. 完成登录成功脚本。
3. 完成登录失败脚本，并断言错误提示。
4. 完成商品搜索脚本，并断言搜索结果出现。
5. 完成加购物车脚本，并断言购物车中有目标商品。

完成标准：

- 每个用例能单独运行。
- 不使用固定 `sleep` 作为主要等待方式。
- 定位器尽量可读，例如 role、text、test id。
- 失败时能看到截图或日志。

---

## 十四、报告输出

报告中建议包含：

- 用例名称。
- 执行环境。
- 浏览器版本。
- 失败截图。
- 失败步骤。
- 错误堆栈。
- 执行耗时。

不要只看“通过率”。如果失败集中在等待、环境、测试数据，说明框架稳定性还需要优化。

---

## 十五、CI 运行

Web 自动化接入 CI 时要注意：

| 问题 | 建议 |
|------|------|
| 浏览器依赖缺失 | 使用 Playwright 官方镜像或安装浏览器依赖 |
| 无头模式差异 | 本地和 CI 都保留无头模式验证 |
| 测试数据冲突 | 使用独立测试账号和可重置测试数据 |
| 失败排查困难 | 上传截图、Trace 和日志作为构建产物 |

GitHub Actions 示例：

```yaml
name: Web UI Tests

on:
  workflow_dispatch:

jobs:
  web-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-python@v6
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: playwright install --with-deps
      - run: pytest tests/web --headed=false
```

---

## 十六、维护成本控制

| 风险 | 控制方式 |
|------|----------|
| 页面频繁改版 | 只自动化稳定主流程 |
| 定位器不稳定 | 约定 `data-testid` |
| 用例过长 | 拆分页面行为和业务流程 |
| 环境数据污染 | 使用独立测试账号，执行前准备数据 |
| 误报过多 | 优化等待、截图、日志和重试策略 |

Web 自动化不是越多越好。最有价值的是每天稳定执行、能快速发现核心流程是否被破坏的那部分用例。
