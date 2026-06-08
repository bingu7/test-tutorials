# Selenium Web 自动化测试教程（软件测试人员专用）

> 本教程面向软件测试工程师，系统讲解 Selenium 进行 Web UI 自动化测试，覆盖环境搭建、元素定位、用例编写、Page Object 模式、框架设计、CI 集成。

---

## 一、Web 自动化基础

### 1.1 Selenium 简介

Selenium 是开源的 **Web UI 自动化测试框架**：

- 跨浏览器：Chrome、Firefox、Edge、Safari
- 跨平台：Windows、Mac、Linux
- 多语言：Python、Java、JavaScript、C#、Ruby
- 开源免费

### 1.2 Selenium 家族

| 工具 | 用途 |
|------|------|
| **Selenium WebDriver** | 主流，浏览器自动化（本教程） |
| **Selenium IDE** | 录制回放工具 |
| **Selenium Grid** | 分布式测试 |

### 1.3 工作原理

```
测试脚本 → Selenium Client → WebDriver 协议 → 浏览器驱动 → 浏览器
（Python）                   (JSON Wire)      (chromedriver)
```

### 1.4 Selenium 4 新特性

- 支持 W3C WebDriver 标准
- Relative Locators（相对定位）
- 抓取浏览器日志
- 新的 Selenium Manager（无需手动下驱动）

### 1.5 Selenium vs Playwright vs Cypress

| 维度 | Selenium | Playwright | Cypress |
|------|----------|------------|---------|
| 多浏览器 | ✓ | ✓ | △（限 Chromium）|
| 多语言 | ✓ | ✓（少） | 仅 JS |
| 速度 | 中等 | 快 | 快 |
| 稳定性 | 中等 | 高 | 高 |
| 学习曲线 | 平缓 | 中 | 平缓 |
| 生态 | 最大 | 增长快 | 中 |

> Selenium 仍是最广泛使用的（兼容性、生态、求职面广），是测试人员必学的基础。

---

## 二、环境搭建

### 2.1 安装 Python

详见 Python 教程。验证：

```bash
python --version
pip --version
```

### 2.2 安装 Selenium

```bash
pip install selenium
```

验证：

```python
import selenium
print(selenium.__version__)    # 4.x
```

### 2.3 浏览器驱动

**Selenium 4.6+ 推荐：内置 Selenium Manager 自动下载驱动**

无需手动操作，直接使用：

```python
from selenium import webdriver
driver = webdriver.Chrome()    # 自动下载 chromedriver
```

**手动方式（旧版或离线环境）：**

1. **Chrome 驱动：** 
   - 看 Chrome 版本：地址栏 `chrome://version`
   - 下载对应版本：`https://chromedriver.chromium.org/downloads`
   - 把 chromedriver 放到 PATH，或在代码中指定

2. **Firefox 驱动：**
   - 下载 geckodriver：`https://github.com/mozilla/geckodriver/releases`

3. **Edge 驱动：**
   - 下载 msedgedriver：`https://developer.microsoft.com/microsoft-edge/tools/webdriver/`

**指定驱动路径：**

```python
from selenium.webdriver.chrome.service import Service

service = Service(executable_path="D:/drivers/chromedriver.exe")
driver = webdriver.Chrome(service=service)
```

### 2.4 安装其他依赖

```bash
pip install pytest
pip install pytest-html
pip install allure-pytest
pip install webdriver-manager     # 备用驱动管理
```

### 2.5 IDE

推荐 PyCharm 或 VSCode。

---

## 三、第一个自动化用例

### 3.1 简单示例

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
import time

# 启动 Chrome
driver = webdriver.Chrome()

# 打开网页
driver.get("https://www.baidu.com")

# 找搜索框，输入关键字
search_box = driver.find_element(By.ID, "kw")
search_box.send_keys("Selenium")

# 点击搜索按钮
search_btn = driver.find_element(By.ID, "su")
search_btn.click()

# 等 3 秒看结果
time.sleep(3)

# 截图
driver.save_screenshot("baidu_result.png")

# 关闭浏览器
driver.quit()
```

### 3.2 用 Pytest 改写

```python
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By

@pytest.fixture(scope="function")
def driver():
    driver = webdriver.Chrome()
    driver.maximize_window()
    driver.implicitly_wait(10)
    yield driver
    driver.quit()

def test_baidu_search(driver):
    driver.get("https://www.baidu.com")
    driver.find_element(By.ID, "kw").send_keys("Selenium")
    driver.find_element(By.ID, "su").click()
    
    # 断言：标题包含 Selenium
    assert "Selenium" in driver.title
```

执行：

```bash
pytest test_demo.py -v
```

---

## 四、浏览器操作

### 4.1 启动浏览器

```python
# Chrome
driver = webdriver.Chrome()

# Firefox
driver = webdriver.Firefox()

# Edge
driver = webdriver.Edge()

# Safari（仅 Mac）
driver = webdriver.Safari()
```

### 4.2 浏览器选项

**Chrome 选项：**

```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()

# 无头模式（不显示浏览器界面，适合 CI）
options.add_argument("--headless=new")

# 窗口大小
options.add_argument("--window-size=1920,1080")

# 最大化
options.add_argument("--start-maximized")

# 禁用 GPU（无头模式必加）
options.add_argument("--disable-gpu")

# 禁用沙箱（Linux 必加）
options.add_argument("--no-sandbox")

# 忽略证书错误
options.add_argument("--ignore-certificate-errors")

# 设置 user-agent
options.add_argument("--user-agent=Mozilla/5.0 ...")

# 隐身模式
options.add_argument("--incognito")

# 禁用日志
options.add_experimental_option("excludeSwitches", ["enable-logging"])

# 禁用扩展
options.add_argument("--disable-extensions")

# 下载目录
prefs = {"download.default_directory": "D:/downloads"}
options.add_experimental_option("prefs", prefs)

driver = webdriver.Chrome(options=options)
```

### 4.3 页面操作

```python
# 打开网页
driver.get("https://www.example.com")

# 当前 URL
url = driver.current_url

# 标题
title = driver.title

# 页面源码
html = driver.page_source

# 前进/后退
driver.back()
driver.forward()
driver.refresh()

# 关闭当前标签页
driver.close()

# 退出浏览器（关所有标签页）
driver.quit()
```

### 4.4 窗口操作

```python
# 最大化
driver.maximize_window()

# 最小化
driver.minimize_window()

# 全屏
driver.fullscreen_window()

# 设置窗口大小
driver.set_window_size(1920, 1080)

# 设置窗口位置
driver.set_window_position(0, 0)

# 获取窗口大小
size = driver.get_window_size()
```

### 4.5 多窗口切换

```python
# 当前窗口句柄
current = driver.current_window_handle

# 所有窗口
handles = driver.window_handles

# 切换到新窗口
for handle in handles:
    if handle != current:
        driver.switch_to.window(handle)
        break

# 回到原窗口
driver.switch_to.window(current)

# 打开新标签页
driver.execute_script("window.open('https://baidu.com')")
```

### 4.6 iframe 切换

iframe 中的元素需要先切入：

```python
# 切到 iframe（多种方式）
driver.switch_to.frame("frame_id")
driver.switch_to.frame(0)    # 索引
iframe = driver.find_element(By.TAG_NAME, "iframe")
driver.switch_to.frame(iframe)

# 操作 iframe 内元素
driver.find_element(By.ID, "inside").click()

# 回到主页面
driver.switch_to.default_content()

# 切回父 iframe（嵌套时）
driver.switch_to.parent_frame()
```

### 4.7 弹窗处理

```python
# 切到 alert
alert = driver.switch_to.alert

# 文本
text = alert.text

# 确认
alert.accept()

# 取消
alert.dismiss()

# 输入（prompt 弹窗）
alert.send_keys("hello")
alert.accept()
```

### 4.8 Cookie 操作

```python
# 获取所有 cookie
cookies = driver.get_cookies()

# 获取指定 cookie
cookie = driver.get_cookie("sessionId")

# 添加 cookie
driver.add_cookie({"name": "test", "value": "123"})

# 删除指定 cookie
driver.delete_cookie("test")

# 删除所有
driver.delete_all_cookies()
```

**应用场景：免登录**

```python
# 1. 手动登录一次，保存 cookie
driver.get("https://example.com")
input("登录后回车...")
import json
with open("cookies.json", "w") as f:
    json.dump(driver.get_cookies(), f)

# 2. 下次自动加载 cookie
driver.get("https://example.com")
with open("cookies.json") as f:
    cookies = json.load(f)
for cookie in cookies:
    driver.add_cookie(cookie)
driver.refresh()
# 已登录状态
```

---

## 五、元素定位

### 5.1 8 种定位方式

```python
from selenium.webdriver.common.by import By

# 1. ID（最快、最稳定）
driver.find_element(By.ID, "username")

# 2. NAME
driver.find_element(By.NAME, "password")

# 3. CLASS_NAME
driver.find_element(By.CLASS_NAME, "btn-primary")

# 4. TAG_NAME
driver.find_element(By.TAG_NAME, "button")

# 5. LINK_TEXT（链接文本完全匹配）
driver.find_element(By.LINK_TEXT, "登录")

# 6. PARTIAL_LINK_TEXT（链接文本部分匹配）
driver.find_element(By.PARTIAL_LINK_TEXT, "登")

# 7. CSS_SELECTOR（推荐，速度快）
driver.find_element(By.CSS_SELECTOR, "#username")
driver.find_element(By.CSS_SELECTOR, "input[name='password']")

# 8. XPATH（最灵活）
driver.find_element(By.XPATH, "//input[@id='username']")
```

### 5.2 查找多个元素

```python
links = driver.find_elements(By.TAG_NAME, "a")
for link in links:
    print(link.text)
```

### 5.3 CSS Selector 详解

```css
/* 标签 */
input

/* class */
.btn
.btn-primary

/* id */
#username

/* 属性 */
input[name="username"]
a[href*="login"]              /* href 包含 login */
a[href^="https"]              /* 以 https 开头 */
a[href$=".pdf"]               /* 以 .pdf 结尾 */

/* 组合 */
input.form-control            /* input + class */
div#header                    /* div + id */
form.login input[name="pwd"]  /* 嵌套 */

/* 子元素 */
ul > li                       /* 直接子 */
ul li                         /* 任意后代 */

/* 兄弟 */
h1 + p                        /* 紧邻 */
h1 ~ p                        /* 后续所有 */

/* 伪类 */
li:first-child
li:last-child
li:nth-child(2)               /* 第 2 个 */
li:nth-child(odd)             /* 奇数 */
input:not([disabled])
```

### 5.4 XPath 详解

```python
# 绝对路径（不推荐）
"/html/body/div[1]/form/input[1]"

# 相对路径
"//input"                              # 所有 input
"//input[@id='username']"              # 按属性
"//input[@name='user' and @type='text']"  # 多属性
"//*[@id='username']"                  # 任意标签
"//input[contains(@class, 'form')]"    # 包含
"//input[starts-with(@id, 'user')]"    # 开头
"//div[text()='登录']"                  # 按文本
"//div[contains(text(), '登')]"        # 文本包含

# 层级
"//form/input"                         # form 下直接 input
"//form//input"                        # form 下任意层级
"//div[@id='login']//button"           # id=login 内的 button

# 索引
"(//input)[1]"                         # 第 1 个
"(//input)[last()]"                    # 最后一个
"//div[@class='item'][2]"              # 第 2 个 class=item

# 父/兄弟轴
"//input/parent::div"                  # 父元素
"//input/ancestor::form"               # 祖先
"//label/following-sibling::input"     # 后兄弟
"//input/preceding-sibling::label"     # 前兄弟

# 文本提取
"//input[@id='username']/@value"       # 属性值
```

### 5.5 定位策略建议

| 优先级 | 方式 | 理由 |
|--------|------|------|
| 1 | ID | 唯一、快 |
| 2 | NAME | 较稳定 |
| 3 | CSS Selector | 语法简洁、性能好 |
| 4 | XPath | 灵活但慢 |
| 5 | LINK_TEXT | 仅链接 |

### 5.6 浏览器快速获取定位

**Chrome DevTools：**

1. F12 打开开发者工具
2. 选中元素
3. 右键 → Copy → Copy selector / Copy XPath
4. 但要 **简化** 自动生成的复杂选择器

**实用扩展：**

- ChroPath（XPath 测试）
- SelectorsHub

**控制台测试：**

```javascript
// CSS
document.querySelector("#username")
document.querySelectorAll("a")

// XPath
$x("//input[@id='username']")
```

### 5.7 相对定位（Selenium 4 新特性）

```python
from selenium.webdriver.support.relative_locator import locate_with

# 在 password 上方的元素
username = driver.find_element(locate_with(By.TAG_NAME, "input").above(password_el))

# 在某元素右侧
btn = driver.find_element(locate_with(By.TAG_NAME, "button").to_right_of(input_el))

# 附近元素（50px 内）
el = driver.find_element(locate_with(By.TAG_NAME, "label").near(input_el))
```

---

## 六、元素操作

### 6.1 基础操作

```python
el = driver.find_element(By.ID, "btn")

# 点击
el.click()

# 输入
el.send_keys("hello")

# 清空
el.clear()

# 提交表单
el.submit()
```

### 6.2 获取属性

```python
# 文本
text = el.text

# 属性
href = el.get_attribute("href")
value = el.get_attribute("value")
class_name = el.get_attribute("class")

# 标签
tag = el.tag_name

# 是否显示
displayed = el.is_displayed()

# 是否启用
enabled = el.is_enabled()

# 是否选中（checkbox/radio）
selected = el.is_selected()

# 大小和位置
size = el.size          # {'width': 100, 'height': 50}
location = el.location  # {'x': 200, 'y': 300}
```

### 6.3 下拉框 Select

```python
from selenium.webdriver.support.ui import Select

el = driver.find_element(By.ID, "city")
sel = Select(el)

# 按 value 选
sel.select_by_value("beijing")

# 按 visible text 选
sel.select_by_visible_text("北京")

# 按索引选
sel.select_by_index(0)

# 获取所有选项
options = sel.options
selected = sel.first_selected_option

# 多选框
sel.deselect_all()
sel.deselect_by_value("beijing")
```

### 6.4 复选框/单选框

```python
checkbox = driver.find_element(By.ID, "agree")

# 是否选中
if not checkbox.is_selected():
    checkbox.click()    # 点击选中
```

### 6.5 文件上传

**普通 input[type=file]：**

```python
upload = driver.find_element(By.ID, "file_input")
upload.send_keys("D:/test.jpg")
```

**自定义按钮（非 input）：**

需要用 PyAutoGUI 或 pywinauto 等模拟系统对话框。

### 6.6 滚动操作

```python
# 滚到底
driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

# 滚到顶
driver.execute_script("window.scrollTo(0, 0);")

# 滚到指定位置
driver.execute_script("window.scrollTo(0, 500);")

# 滚到元素
el = driver.find_element(By.ID, "footer")
driver.execute_script("arguments[0].scrollIntoView();", el)

# 滚到元素中央
driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", el)
```

### 6.7 截图

```python
# 全屏
driver.save_screenshot("page.png")

# 二进制
png = driver.get_screenshot_as_png()
base64_str = driver.get_screenshot_as_base64()

# 元素截图
el.screenshot("element.png")
```

### 6.8 键盘操作

```python
from selenium.webdriver.common.keys import Keys

el.send_keys("hello", Keys.ENTER)        # 输入后回车
el.send_keys(Keys.CONTROL, "a")          # Ctrl+A
el.send_keys(Keys.CONTROL, "c")          # Ctrl+C
el.send_keys(Keys.CONTROL, "v")          # Ctrl+V
el.send_keys(Keys.TAB)                    # Tab
el.send_keys(Keys.ESCAPE)                 # Esc
el.send_keys(Keys.BACK_SPACE)             # 删除
```

### 6.9 鼠标操作

```python
from selenium.webdriver.common.action_chains import ActionChains

actions = ActionChains(driver)

# 悬停
actions.move_to_element(el).perform()

# 右键
actions.context_click(el).perform()

# 双击
actions.double_click(el).perform()

# 拖拽
actions.drag_and_drop(source, target).perform()

# 按住拖动
actions.click_and_hold(el).move_by_offset(100, 0).release().perform()

# 组合
actions.move_to_element(menu).click(menu_item).perform()
```

---

## 七、等待机制

### 7.1 三种等待

**1. 强制等待（不推荐）：**

```python
import time
time.sleep(3)
```

**2. 隐式等待（全局）：**

```python
driver.implicitly_wait(10)
# 所有 find_element 都等最长 10 秒
```

**3. 显式等待（推荐）：**

```python
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

# 等元素出现
el = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.ID, "username"))
)

# 等元素可见
el = WebDriverWait(driver, 10).until(
    EC.visibility_of_element_located((By.ID, "username"))
)

# 等元素可点
el = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, "btn"))
)

# 等元素消失
WebDriverWait(driver, 10).until(
    EC.invisibility_of_element_located((By.ID, "loading"))
)

# 等标题
WebDriverWait(driver, 10).until(EC.title_contains("登录成功"))

# 等 URL
WebDriverWait(driver, 10).until(EC.url_contains("/home"))

# 等 alert
WebDriverWait(driver, 10).until(EC.alert_is_present())

# 等文本出现在元素中
WebDriverWait(driver, 10).until(
    EC.text_to_be_present_in_element((By.ID, "msg"), "登录成功")
)
```

### 7.2 自定义等待条件

```python
def element_has_text(locator, text):
    def condition(driver):
        try:
            el = driver.find_element(*locator)
            return text in el.text
        except:
            return False
    return condition

WebDriverWait(driver, 10).until(element_has_text((By.ID, "msg"), "成功"))
```

### 7.3 等待最佳实践

- **慎用** 隐式等待 + 显式等待混用（可能冲突）
- 推荐 **只用显式等待**
- 关键操作前都加显式等待
- 不要 sleep（除非真的必要）

---

## 八、高级操作

### 8.1 JavaScript 执行

```python
# 执行 JS
driver.execute_script("alert('hello');")

# 操作元素（绕过隐藏/遮挡问题）
el = driver.find_element(By.ID, "btn")
driver.execute_script("arguments[0].click();", el)

# 修改元素值
driver.execute_script("arguments[0].value = 'hello';", input_el)

# 获取返回值
title = driver.execute_script("return document.title;")

# 异步 JS（需先设置脚本超时，否则默认 0ms 立即超时）
driver.set_script_timeout(10)
driver.execute_async_script("""
    const callback = arguments[arguments.length - 1];
    setTimeout(() => callback('done'), 1000);
""")
```

### 8.2 处理日历控件

很多日历是 readonly 的 input，直接 send_keys 无效：

```python
# 方法 1：去掉 readonly
date_input = driver.find_element(By.ID, "date")
driver.execute_script("arguments[0].removeAttribute('readonly');", date_input)
date_input.send_keys("2026-06-07")

# 方法 2：JS 设值
driver.execute_script("document.getElementById('date').value = '2026-06-07';")
```

### 8.3 处理验证码

| 方案 | 说明 |
|------|------|
| 关闭验证码 | 测试环境开关 |
| 万能验证码 | 后门，如 8888 |
| 截图识别 | 第三方 OCR |
| 打码平台 | 付费服务 |
| 跳过登录 | 用 cookie/token |

**推荐：测试环境关闭或固定验证码。**

### 8.4 处理新标签页打开

```python
# 点击前记录窗口
old_handles = driver.window_handles
link.click()

# 等新窗口出现
WebDriverWait(driver, 10).until(
    lambda d: len(d.window_handles) > len(old_handles)
)

# 切到新窗口
new_handle = [h for h in driver.window_handles if h not in old_handles][0]
driver.switch_to.window(new_handle)
```

### 8.5 处理 Shadow DOM

```python
# Selenium 4
host = driver.find_element(By.ID, "shadow-host")
shadow = host.shadow_root
el = shadow.find_element(By.CSS_SELECTOR, "input")
```

### 8.6 性能日志

```python
options.set_capability(
    "goog:loggingPrefs", {"performance": "ALL"}
)
driver = webdriver.Chrome(options=options)

# 获取
logs = driver.get_log("performance")
```

> **注意：** Selenium 4.10+ 已弃用 `driver.get_log()`，新项目推荐使用 BiDi 协议或 CDP（Chrome DevTools Protocol）抓取网络/性能数据。

### 8.7 网络拦截（Selenium 4 + BiDi）

```python
# 拦截请求、修改响应（实验性功能）
# 类似 Playwright 的能力，但 Selenium 还不成熟
# 实际拦截推荐用 Fiddler/Charles/mitmproxy
```

---

## 九、Page Object 设计模式

### 9.1 为什么用 Page Object

**反模式（不用 PO）：**

```python
def test_login():
    driver.get("https://example.com/login")
    driver.find_element(By.ID, "username").send_keys("test")
    driver.find_element(By.ID, "password").send_keys("123")
    driver.find_element(By.ID, "btn").click()
    assert driver.title == "首页"

def test_register():
    driver.get("https://example.com/register")
    driver.find_element(By.ID, "username").send_keys("test")
    # 大量重复定位...
```

**问题：**
- 元素变了改一堆地方
- 重复代码
- 可读性差

### 9.2 Page Object 模式

```
testcase/
├── test_login.py        ← 用例（业务逻辑）
pages/
├── login_page.py        ← 页面（元素 + 操作）
```

### 9.3 BasePage 基类

```python
# pages/base_page.py
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 10)
    
    def open(self, url):
        self.driver.get(url)
    
    def find(self, locator):
        return self.wait.until(EC.presence_of_element_located(locator))
    
    def click(self, locator):
        self.wait.until(EC.element_to_be_clickable(locator)).click()
    
    def input(self, locator, text):
        el = self.find(locator)
        el.clear()
        el.send_keys(text)
    
    def get_text(self, locator):
        return self.find(locator).text
    
    def is_exist(self, locator, timeout=3):
        try:
            WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located(locator)
            )
            return True
        except:
            return False
    
    def screenshot(self, name):
        self.driver.save_screenshot(f"reports/{name}.png")
```

### 9.4 LoginPage 示例

```python
# pages/login_page.py
from selenium.webdriver.common.by import By
from pages.base_page import BasePage

class LoginPage(BasePage):
    URL = "https://example.com/login"
    
    # 元素定位
    USERNAME = (By.ID, "username")
    PASSWORD = (By.ID, "password")
    LOGIN_BTN = (By.ID, "btn-login")
    ERROR_MSG = (By.CLASS_NAME, "error-msg")
    
    def open(self):
        super().open(self.URL)
        return self
    
    def input_username(self, username):
        self.input(self.USERNAME, username)
        return self
    
    def input_password(self, password):
        self.input(self.PASSWORD, password)
        return self
    
    def click_login(self):
        self.click(self.LOGIN_BTN)
        return self
    
    def login(self, username, password):
        return (self.input_username(username)
                    .input_password(password)
                    .click_login())
    
    def get_error_msg(self):
        return self.get_text(self.ERROR_MSG)
```

### 9.5 用例编写

```python
# testcases/test_login.py
import pytest
from pages.login_page import LoginPage
from pages.home_page import HomePage

class TestLogin:
    
    def test_login_success(self, driver):
        login_page = LoginPage(driver).open()
        login_page.login("testuser", "123456")
        
        home_page = HomePage(driver)
        assert home_page.is_exist(home_page.WELCOME_MSG)
    
    def test_login_wrong_password(self, driver):
        login_page = LoginPage(driver).open()
        login_page.login("testuser", "wrong")
        assert "密码错误" in login_page.get_error_msg()
    
    @pytest.mark.parametrize("user,pwd,expected", [
        ("", "123456", "用户名不能为空"),
        ("test", "", "密码不能为空"),
        ("nouser", "123456", "账号不存在"),
    ])
    def test_login_invalid(self, driver, user, pwd, expected):
        login_page = LoginPage(driver).open()
        login_page.login(user, pwd)
        assert expected in login_page.get_error_msg()
```

### 9.6 PO 设计原则

- **一个页面一个类**
- 元素定位集中在类顶部
- 方法返回 self 支持链式调用
- 一个方法做一件事
- 不在 Page 中写断言（断言留给用例）
- 跨页面跳转返回新 Page 对象

---

## 十、框架完整搭建

### 10.1 项目结构

```
web-test/
├── config/
│   └── config.yaml
├── pages/
│   ├── base_page.py
│   ├── login_page.py
│   ├── home_page.py
│   └── ...
├── testcases/
│   ├── test_login.py
│   └── test_home.py
├── common/
│   ├── driver_factory.py
│   ├── logger.py
│   └── yaml_util.py
├── data/
│   └── test_data.yaml
├── reports/
├── logs/
├── conftest.py
├── pytest.ini
├── requirements.txt
├── run.py
└── README.md
```

### 10.2 driver 工厂

```python
# common/driver_factory.py
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions

def create_driver(browser="chrome", headless=False):
    if browser == "chrome":
        options = ChromeOptions()
        if headless:
            options.add_argument("--headless=new")
            options.add_argument("--disable-gpu")
            options.add_argument("--no-sandbox")
        options.add_argument("--window-size=1920,1080")
        options.add_experimental_option("excludeSwitches", ["enable-logging"])
        driver = webdriver.Chrome(options=options)
    elif browser == "firefox":
        options = FirefoxOptions()
        if headless:
            options.add_argument("--headless")
        driver = webdriver.Firefox(options=options)
    else:
        raise ValueError(f"不支持的浏览器：{browser}")
    
    driver.maximize_window()
    return driver
```

### 10.3 conftest.py

```python
import pytest
import allure
from common.driver_factory import create_driver

def pytest_addoption(parser):
    parser.addoption("--browser", default="chrome", help="浏览器")
    parser.addoption("--headless", action="store_true", help="无头模式")

@pytest.fixture(scope="function")
def driver(request):
    browser = request.config.getoption("--browser")
    headless = request.config.getoption("--headless")
    driver = create_driver(browser, headless)
    yield driver
    driver.quit()

@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()
    if report.when == "call" and report.failed:
        driver = item.funcargs.get("driver")
        if driver:
            allure.attach(
                driver.get_screenshot_as_png(),
                name="失败截图",
                attachment_type=allure.attachment_type.PNG
            )
            allure.attach(
                driver.page_source,
                name="页面源码",
                attachment_type=allure.attachment_type.TEXT
            )
```

### 10.4 pytest.ini

```ini
[pytest]
testpaths = testcases
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = -v -s --alluredir=./reports/allure-results --clean-alluredir
markers =
    smoke: 冒烟测试
    regression: 回归测试
```

### 10.5 run.py

```python
import os
import shutil
import pytest

def run():
    if os.path.exists("./reports/allure-results"):
        shutil.rmtree("./reports/allure-results")
    
    pytest.main(["-v", "testcases/"])
    
    os.system("allure generate ./reports/allure-results -o ./reports/allure-report --clean")

if __name__ == "__main__":
    run()
```

### 10.6 执行

```bash
# Chrome 默认
pytest

# Firefox
pytest --browser=firefox

# 无头模式（CI）
pytest --headless

# 只跑冒烟
pytest -m smoke

# 完整执行+报告
python run.py
```

---

## 十一、Selenium Grid 分布式

### 11.1 Grid 是什么

Selenium Grid 让测试分布到多台机器/多个浏览器并行执行。

**架构：**

```
        Hub（集中控制）
        ↓        ↓        ↓
     Node 1   Node 2   Node 3
   (Chrome)  (Firefox) (Edge)
```

### 11.2 Docker 部署 Grid

```yaml
# docker-compose.yml
version: '3'

services:
  selenium-hub:
    image: selenium/hub:4
    ports:
      - "4442:4442"
      - "4443:4443"
      - "4444:4444"

  chrome:
    image: selenium/node-chrome:4
    shm_size: 2gb
    depends_on:
      - selenium-hub
    environment:
      SE_EVENT_BUS_HOST: selenium-hub
      SE_EVENT_BUS_PUBLISH_PORT: 4442
      SE_EVENT_BUS_SUBSCRIBE_PORT: 4443

  firefox:
    image: selenium/node-firefox:4
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

Hub 控制台：`http://localhost:4444`

### 11.3 远程执行

```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
driver = webdriver.Remote(
    command_executor="http://localhost:4444/wd/hub",
    options=options
)
```

### 11.4 并行执行

```bash
pip install pytest-xdist
pytest -n 4    # 4 进程并行
```

---

## 十二、实战案例

### 12.1 案例一：电商搜索下单流程

```python
import pytest
import allure
from pages.home_page import HomePage
from pages.search_page import SearchPage
from pages.product_page import ProductPage
from pages.cart_page import CartPage
from pages.order_page import OrderPage

@allure.feature("电商流程")
class TestEcommerce:
    
    @allure.title("完整下单流程")
    def test_full_order_flow(self, driver, login):
        # 1. 首页搜索
        with allure.step("搜索商品"):
            home = HomePage(driver).open()
            home.search("iPhone")
        
        # 2. 选择商品
        with allure.step("选择第一个商品"):
            search = SearchPage(driver)
            search.click_first_product()
        
        # 3. 加入购物车
        with allure.step("加入购物车"):
            product = ProductPage(driver)
            product.select_color("黑色")
            product.select_size("128GB")
            product.add_to_cart()
        
        # 4. 去结算
        with allure.step("提交订单"):
            cart = CartPage(driver).open()
            cart.go_to_checkout()
            order = OrderPage(driver)
            order_id = order.submit()
        
        # 5. 验证
        with allure.step("验证订单成功"):
            assert order.is_success()
            assert order_id is not None
```

### 12.2 案例二：表单测试（数据驱动）

```python
import pytest
import yaml
from pages.register_page import RegisterPage

with open("data/register_data.yaml") as f:
    register_data = yaml.safe_load(f)

class TestRegister:
    
    @pytest.mark.parametrize("case", register_data,
                              ids=[c["case_name"] for c in register_data])
    def test_register(self, driver, case):
        page = RegisterPage(driver).open()
        page.fill_form(case["data"])
        page.submit()
        
        if case["expected_success"]:
            assert page.is_success_displayed()
        else:
            assert case["expected_error"] in page.get_error()
```

`data/register_data.yaml`:

```yaml
- case_name: 正常注册
  data:
    username: newuser01
    password: Test@123
    email: test01@example.com
    phone: "13800138000"
  expected_success: true
  expected_error: ""

- case_name: 密码太弱
  data:
    username: newuser02
    password: "123"
    email: test02@example.com
    phone: "13800138000"
  expected_success: false
  expected_error: 密码至少 8 位

- case_name: 邮箱格式错
  data:
    username: newuser03
    password: Test@123
    email: invalid-email
    phone: "13800138000"
  expected_success: false
  expected_error: 邮箱格式不正确

- case_name: 手机号错
  data:
    username: newuser04
    password: Test@123
    email: test04@example.com
    phone: "123"
  expected_success: false
  expected_error: 手机号格式不正确
```

### 12.3 案例三：登录状态保持（Cookie）

```python
import json
import os
from pages.login_page import LoginPage

@pytest.fixture(scope="session")
def login_session(driver):
    """Session 级登录，整轮测试共享"""
    cookies_file = "data/cookies.json"
    
    driver.get("https://example.com")
    
    if os.path.exists(cookies_file):
        with open(cookies_file) as f:
            cookies = json.load(f)
        for cookie in cookies:
            try:
                driver.add_cookie(cookie)
            except:
                pass
        driver.refresh()
        # 验证是否仍登录
        if "登录" not in driver.page_source:
            return driver
    
    # 重新登录
    login_page = LoginPage(driver).open()
    login_page.login("testuser", "123456")
    
    # 保存 cookie
    with open(cookies_file, "w") as f:
        json.dump(driver.get_cookies(), f)
    
    return driver
```

### 12.4 案例四：CI 集成

`.github/workflows/web-test.yml`:

```yaml
name: Web UI Test

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install Chrome
        run: |
          wget -O chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
          sudo apt install -y ./chrome.deb
      
      - name: Install dependencies
        run: pip install -r requirements.txt
      
      - name: Run tests
        run: pytest --headless --alluredir=./reports/allure-results
      
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-report
          path: ./reports/
```

---

## 十三、常见问题排查

### 13.1 ChromeDriver 版本不匹配

```
This version of ChromeDriver only supports Chrome version XX
```

**解决：**
- Selenium 4.6+ 自动管理
- 或手动下载匹配版本

### 13.2 元素找不到

排查：

- 选择器是否正确？浏览器控制台测试
- 元素是否在 iframe？需切入
- 元素是否动态加载？加显式等待
- 元素是否被遮挡？滚动到视口

### 13.3 ElementClickInterceptedException

元素被遮挡：

```python
# 方法 1：滚到元素
driver.execute_script("arguments[0].scrollIntoView({block:'center'});", el)

# 方法 2：JS 点击（绕过遮挡）
driver.execute_script("arguments[0].click();", el)

# 方法 3：等待遮挡消失
WebDriverWait(driver, 10).until(
    EC.invisibility_of_element_located((By.ID, "loading"))
)
```

### 13.4 StaleElementReferenceException

元素 DOM 引用失效（页面刷新或元素重新渲染）：

```python
# 重新查找元素
def safe_click(driver, locator, retries=3):
    for _ in range(retries):
        try:
            driver.find_element(*locator).click()
            return
        except StaleElementReferenceException:
            time.sleep(0.5)
    raise Exception("点击失败")
```

### 13.5 浏览器闪退

可能原因：
- ChromeDriver 与 Chrome 版本不匹配
- 启动参数有问题
- 内存不足

试加：

```python
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
```

### 13.6 无头模式行为异常

- 设置窗口大小：`--window-size=1920,1080`
- 加 `--disable-gpu`
- 用户代理设置：`--user-agent=...`

### 13.7 中文乱码

```python
# 文件读写指定 utf-8
with open("file.txt", encoding="utf-8") as f: ...

# 浏览器编码
options.add_argument("--lang=zh-CN")
```

### 13.8 速度慢

- 用 CSS Selector 代替 XPath
- 关闭图片加载

```python
prefs = {"profile.managed_default_content_settings.images": 2}
options.add_experimental_option("prefs", prefs)
```

- 复用浏览器（适当 session）
- 并行执行（pytest-xdist）

### 13.9 截图不全

```python
# 全页面截图（Chrome）
driver.execute_cdp_cmd("Emulation.setDeviceMetricsOverride", {
    "width": 1920,
    "height": driver.execute_script("return document.body.scrollHeight"),
    "deviceScaleFactor": 1,
    "mobile": False
})
driver.save_screenshot("full.png")
```

### 13.10 元素能找到但操作偶发失败

加重试机制：

```bash
pip install pytest-rerunfailures
pytest --reruns 2 --reruns-delay 3
```

---

## 十四、最佳实践

### 14.1 用例稳定性

- **优先 ID 定位**
- **必加显式等待**
- **避免硬编码 sleep**
- **数据独立**：每个用例独立数据
- **失败重试 + 失败截图**

### 14.2 维护建议

- 使用 Page Object
- 定位集中管理
- 与开发约定 data-test-id 属性（专门给测试用）
- 定期 review 失败用例
- 删除无效用例

### 14.3 与开发协作

推动开发添加测试属性，比所有定位都稳：

```html
<button data-test-id="login-submit">登录</button>
```

```python
driver.find_element(By.CSS_SELECTOR, "[data-test-id='login-submit']")
```

### 14.4 推荐学习

- Selenium 官方：`https://www.selenium.dev/documentation/`
- 《Selenium 自动化测试实战》
- TesterHome Selenium 板块

---

> **测试纪律：** Web UI 自动化是最不稳定的一层，要做好预期管理。优先做接口自动化和单元测试，UI 自动化只覆盖核心流程。失败用例及时分析，不要无视。
