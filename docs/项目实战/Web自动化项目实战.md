---
description: Web 自动化项目实战，Page Object、失败截图和 CI 运行。
---
# Web 自动化项目实战

!!! info "概述"
    本实战用于训练 Web UI 自动化项目的设计能力，重点不是录制脚本，而是建立稳定、可维护、可持续运行的自动化体系。

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

---

## 动手任务：给一批 UI 失败用例做分类和取舍

> 这是本教程的收尾练习。请**独立完成**，不要先看参考答案。目标不是「让用例通过」，而是能判断一条失败到底值不值得修，并做出有依据的取舍。

### 任务背景

Web 自动化套件每天 22:00 跑一次，连续三天红了。团队有两种声音：研发说「UI 自动化误报太多，建议砍掉」，测试负责人说「不能砍，砍了就没人守核心流程」。

你被要求在这批失败记录里给出结论：哪些是真缺陷、哪些是脚本脆弱、哪些应该直接下线，以及每条对应的修复动作。

### 任务准备

连续三次运行的失败记录（示例值，摘录）：

```text
Run 2024-05-20 21:00  passed 118 / failed 9   duration 26m
Run 2024-05-21 21:00  passed 121 / failed 6   duration 24m
Run 2024-05-22 21:00  passed 115 / failed 12  duration 31m
```

```text
# 失败明细（含错误摘要）
F1  test_login_success
    TimeoutException: waiting for #loginBtn (10s)  ← 连续 3 天失败
F2  test_add_to_cart
    AssertionError: cart count expected 1, got 2   ← 仅第 3 天失败
F3  test_checkout_amount
    AssertionError: displayed 199.00, expected 348.00  ← 连续 3 天失败
F4  test_search_result_count
    AssertionError: expected 5, got 4               ← 仅第 1 天失败
F5  test_order_list_paging
    StaleElementReferenceException: element detached ← 第 1、3 天失败
F6  test_logout
    TimeoutException: waiting for .login-form (5s)  ← 第 2 天失败
F7  test_product_detail_image
    AssertionError: img loaded=False                 ← 连续 3 天失败
F8  test_coupon_apply
    ElementClickInterceptedException: toast 遮挡     ← 第 3 天失败
F9  test_profile_save
    AssertionError: nickname expected new, got old   ← 第 1、2 天失败
```

```python
# pages/login_page.py（节选）
class LoginPage:
    def login(self, user, pwd):
        self.driver.find_element(By.CSS_SELECTOR, "#loginBtn").click()   # F1
        self.driver.find_element(By.ID, "placeholder-2").send_keys(user)
        time.sleep(1)                                                    # 显式 sleep
        return self.driver.find_element(By.CLASS_NAME, "user-name").text # F6 用同一选择器

# tests/test_cart.py（节选）
def test_add_to_cart(driver):
    driver.get(BASE + "/product/1001")
    driver.find_element(By.LINK_TEXT, "立即购买").click()                 # F2/F8
    assert len(driver.find_elements(By.CLASS_NAME, "cart-item")) == 1

# tests/test_order.py（节选）
def test_checkout_amount(driver):
    total = driver.find_element(By.ID, "total").text                      # F3
    assert total == "348.00"                                             # 硬编码期望值
```

```text
环境信息：
- CI 无头 Chrome 123，视口 1280x800（本地为 1920x1080）
- 测试账号：共享账号 qa_web（三套用例共用，包括购物车用例）
- 重试策略：未启用
```

### 任务要求

请依次完成，并**保留每条命令和输出**：

1. **失败分类**：把 F1~F9 逐条归入「真缺陷 / 脚本脆弱 / 环境差异 / 数据污染」四类，并标注稳定性（连续失败 or 偶发）。输出表格：用例 / 分类 / 依据（引用代码或错误摘要）/ 稳定性。

2. **根因定位**：至少指出 3 个跨用例的共性根因（等待策略、定位策略、期望值来源、执行环境），并说明每个根因影响了哪几条 F 项。要指出 `#loginBtn` 这类问题为什么在本地通过、在 CI 失败。

3. **给出取舍结论**：对每条用例给出处置（立即修复 / 降级为冒烟 / 下线 / 转手工回归），并说明判断标准。必须至少下线 1 条、降级 1 条，并说明理由（维护成本 vs 拦截价值）。

4. **交付可执行的修复片段**：写出修复后的关键代码片段（含显式等待、稳定的 `data-testid` 约定、期望值来源改造），并输出一份「用例分层清单」（表格：分层 / 用例 / 执行频率 / 目标耗时）。

### 提交物

| 产出 | 要求 |
|------|------|
| 失败分类表 | F1~F9 全覆盖，含稳定性标注 |
| 根因说明 | ≥ 3 个共性根因，各自列出影响用例 |
| 取舍结论表 | 含处置动作与标准，至少 1 下线 + 1 降级 |
| 修复代码片段 | 可复制，含等待与定位改造 |
| 分层清单 | 表格，含执行频率与目标耗时 |

### 完成标准

- [ ] 能用「连续失败 vs 偶发」区分真缺陷与脆弱脚本
- [ ] 能解释「本地绿 CI 红」的常见原因（视口、渲染时序、网络延迟）
- [ ] 能把定位器问题与业务问题分开描述
- [ ] 能明确说明为什么某些用例应该下线而不是修
- [ ] 修复片段中不含 `time.sleep` 硬等待

??? tip "参考答案与思路（先自己做完再看）"

    **第 1 题：失败分类表**

    | 用例 | 分类 | 依据 | 稳定性 |
    |------|------|------|--------|
    | F1 test_login_success | 脚本脆弱 + 环境差异 | 选择器 `#loginBtn` 依赖动态 id；本地视口大可点，CI 小视口被遮挡 | 连续 |
    | F2 test_add_to_cart | 数据污染 | 共享账号 qa_web，购物车残留导致 2 条；仅共用数据变化那天失败 | 偶发 |
    | F3 test_checkout_amount | 真缺陷 | 与「下单金额异常」一致，页面确实渲染 199.00 | 连续 |
    | F4 test_search_result_count | 脚本脆弱 | 期望条数写死 5，搜索数据变化即失败，无业务含义 | 偶发 |
    | F5 test_order_list_paging | 脚本脆弱 | `StaleElementReferenceException` 是列表重渲染竞态，非缺陷 | 偶发 |
    | F6 test_logout | 脚本脆弱 | 复用 `.login-form` 定位，登出后 DOM 已变；且 `time.sleep(1)` 掩盖了真实等待条件 | 偶发 |
    | F7 test_product_detail_image | 待确认（很可能是真缺陷） | 连续 3 天 `img loaded=False`，需检查是图片 404 还是懒加载未触发 | 连续 |
    | F8 test_coupon_apply | 脚本脆弱 + 真缺陷候选 | `toast` 遮挡是脚本未等元素可点；但若等待后仍失败则是产品交互缺陷 | 偶发 |
    | F9 test_profile_save | 真缺陷（或最终一致） | 连续 2 天保存后读到旧值，需确认为缓存/主从不一致还是保存失败 | 连续 |

    判定要点：**连续失败优先怀疑真缺陷，偶发失败优先怀疑脚本与环境**。但这只是「优先怀疑」，F7 必须去查图片请求的真实状态码才能定性。

    **第 2 题：共性根因**

    1. **等待策略：`time.sleep` 代替条件等待**
       影响 F1、F6、F8。固定 sleep 在本地够用，在 CI 机器（CPU 更弱、并发跑多个容器）就会不够；而元素被 toast 遮挡时，sleep 再久也点不上。

    2. **定位策略：依赖动态 id / 文案 / 弱 class**
       影响 F1（`#loginBtn` 动态 id、`placeholder-2` 这种自动生成的 id）、F2/F8（`LINK_TEXT` 依赖文案，改文案即挂）、F6（复用登录表单 class 判断登出结果）。
       本地通过是因为本地页面版本可能不同、视口更大；CI 通过率低是因为构建产物 id 哈希不同 + 视口小导致元素不可点。

    3. **期望值来源：硬编码业务数据**
       影响 F3、F4、F9。`== 348.00`、`== 5` 把「测试数据」写进了断言。正确做法是断言**由接口或测试数据推导出的期望值**，而不是常量。

    4. **执行环境差异 + 共享账号**
       影响 F2、F9、F5（视口 1280x800 下列表高度不同，重渲染时机不同）。

    **第 3 题：取舍结论表**

    | 用例 | 处置 | 理由 |
    |------|------|------|
    | F1 test_login_success | 立即修复 | 登录是所有流程的前置，拦截价值最高 |
    | F2 test_add_to_cart | 立即修复（改数据隔离） | 购物车是核心转化路径 |
    | F3 test_checkout_amount | 立即修复 + 提缺陷 | 真缺陷，涉及金额 |
    | F4 test_search_result_count | **下线** | 断言的是数据条数而非业务规则，维护成本 > 拦截价值；改为「搜索结果非空且关键字命中」 |
    | F5 test_order_list_paging | 立即修复 | 分页是主流程，改用等待 + 重查元素 |
    | F6 test_logout | 降级为冒烟 | 登出风险低，纳入每日冒烟集，不做深度断言 |
    | F7 test_product_detail_image | 立即修复（先定性） | 连续失败必须查清 |
    | F8 test_coupon_apply | 立即修复 | 涉及优惠，资金相关必须守 |
    | F9 test_profile_save | 立即修复 | 连续失败，需定性 |

    取舍标准（三条，写进团队规范）：

    ```text
    1. 断言业务规则 → 留；断言数据条数/文案原文 → 删或改
    2. 失败能指向具体风险 → 留；失败只能说明环境抖动 → 降级
    3. 维护工时 / 拦截次数 > 阈值（如每月 > 2h 维护且 0 次有效拦截）→ 下线
    ```

    **第 4 题：修复片段与分层**

    ```python
    # 1) 显式等待替代 sleep
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC

    def login(self, user, pwd):
        WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='login-submit']"))
        ).click()
        # 断言真实业务结果，而不是等固定时间
        WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "[data-testid='user-name']"))
        )

    # 2) 稳定定位：约定 data-testid
    driver.find_element(By.CSS_SELECTOR, "[data-testid='add-to-cart']").click()

    # 3) 期望值来自接口/数据，而不是硬编码
    def test_checkout_amount(driver, api, cart_fixture):
        expected = api.get(f"/api/order/{cart_fixture.order_id}").json()["data"]["pay_amount"]
        total = driver.find_element(By.CSS_SELECTOR, "[data-testid='order-total']").text
        assert total == expected

    # 4) 列表操作先等渲染稳定再取元素
    WebDriverWait(driver, 10).until(
        lambda d: len(d.find_elements(By.CSS_SELECTOR, "[data-testid='order-row']")) > 0
    )
    ```

    分层清单：

    | 分层 | 用例 | 执行频率 | 目标耗时 |
    |------|------|----------|----------|
    | 冒烟集 | 登录、下单、支付（F1/F2/F3） | 每次提交 | ≤ 5 分钟 |
    | 主流程集 | 购物车、优惠券、订单列表 | 每日 1 次 | ≤ 12 分钟 |
    | 全量回归 | 其余 UI 用例 | 每周 / 发版前 | ≤ 30 分钟 |

    注意：在用例里写「修复了 F6」这类注释没有意义，重点是让断言指向**业务结果**而不是**页面细节**。

---

### 阶段测验

完成教程后，建议做 [Web 自动化项目实战测验](Web自动化项目实战测验.md) 检验学习效果。

### 通关检查

完成本阶段后，使用 [第5阶段-项目面试通关](../学习中心/第5阶段-项目面试通关.md) 检查是否可以进入下一阶段。
