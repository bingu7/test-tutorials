# Appium App 自动化测试教程（软件测试人员专用）

> 本教程面向软件测试工程师，系统讲解 Appium 进行移动端 App 自动化测试，覆盖环境搭建、元素定位、用例编写、框架设计、实战。

---

## 一、App 自动化基础

### 1.1 什么是 Appium

Appium 是开源的 **移动端自动化测试框架**，支持：

- **Native App**（原生应用）
- **Web App**（移动浏览器）
- **Hybrid App**（混合应用）
- **跨平台**：Android、iOS、Windows

### 1.2 Appium 的优势

| 优势 | 说明 |
|------|------|
| 跨平台 | 一套代码可适配 Android/iOS |
| 多语言 | Python、Java、JavaScript 等 |
| 无需源码 | 测试已编译的 App |
| 开源免费 | 社区活跃 |
| 基于 WebDriver | 与 Selenium 兼容 |

### 1.3 工作原理

```
测试脚本 → Appium Server → 设备/模拟器
（Python）    (Node.js)      （Android/iOS）
   ↓             ↓               ↓
WebDriver 协议  转换指令       UiAutomator2/XCUITest
```

### 1.4 适用场景

| 场景 | 是否适合 |
|------|---------|
| 回归测试 | ✓ |
| 冒烟测试 | ✓ |
| 性能测试 | △（用专门工具更好） |
| 兼容性测试 | ✓ |
| 用户体验测试 | ✗（人工） |
| 一次性场景 | ✗ |

### 1.5 Appium 1.x vs 2.x

| 维度 | 1.x | 2.x |
|------|-----|-----|
| 驱动 | 内置 | 插件化 |
| 安装 | 简单 | 需装 driver |
| 状态 | 维护 | 推荐用 |

> 本教程以 **Appium 2.x + Python** 为主。

---

## 二、环境搭建

### 2.1 整体架构

```
┌─────────────────────────────────────────┐
│  Python 测试脚本                          │
│  (appium-python-client)                  │
├─────────────────────────────────────────┤
│  Appium Server (Node.js)                 │
│  + uiautomator2 driver (Android)         │
│  + xcuitest driver (iOS)                 │
├─────────────────────────────────────────┤
│  Android SDK / Xcode                     │
├─────────────────────────────────────────┤
│  设备/模拟器                              │
└─────────────────────────────────────────┘
```

### 2.2 安装 JDK

需要 JDK 8+：

```bash
# Mac
brew install openjdk@11

# Windows
# 官网下载安装

# 验证
java -version
```

配置 `JAVA_HOME` 环境变量。

### 2.3 安装 Android SDK

**方式 1：装 Android Studio**（推荐）

- 官网下载：`https://developer.android.com/studio`
- 安装后通过 SDK Manager 装 SDK Platforms、Build-Tools

**方式 2：装命令行工具**

下载 Command Line Tools，配置：

```bash
# 设置 ANDROID_HOME
export ANDROID_HOME=$HOME/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$ANDROID_HOME/build-tools/版本号
```

**验证：**

```bash
adb version
sdkmanager --list
```

### 2.4 安装 Node.js

```bash
# Mac
brew install node

# Windows 官网下载
# Linux
sudo apt install nodejs npm

# 验证
node -v
npm -v
```

### 2.5 安装 Appium Server

```bash
# 全局安装
npm install -g appium

# 验证
appium -v

# 安装 Android 驱动
appium driver install uiautomator2

# 安装 iOS 驱动（Mac）
appium driver install xcuitest

# 列出已安装驱动
appium driver list --installed
```

### 2.6 环境检查

Appium 2.x 起 `appium-doctor` 已停止维护，改用驱动内置的 doctor 命令：

```bash
# 检查 Android 环境
appium driver doctor uiautomator2

# 检查 iOS 环境（Mac）
appium driver doctor xcuitest
```

逐项修复直到全绿。

### 2.7 安装 Python 客户端

```bash
pip install Appium-Python-Client
pip install selenium
pip install pytest
pip install allure-pytest
```

### 2.8 安装 Appium Inspector

可视化元素定位工具：

- 下载：`https://github.com/appium/appium-inspector/releases`
- 安装即可

### 2.9 准备设备

**真机：**

1. 开启开发者选项：设置 → 关于手机 → 连续点版本号 7 次
2. 开启 USB 调试
3. USB 连接电脑
4. 验证：`adb devices`

**模拟器：**

- Android Studio → AVD Manager → 新建虚拟设备
- 启动模拟器
- 验证：`adb devices`

### 2.10 启动 Appium Server

```bash
# 默认 4723 端口
appium

# 指定端口
appium -p 4723

# 后台运行
nohup appium > appium.log 2>&1 &
```

启动后看到：

```
[Appium] Welcome to Appium v2.x.x
[Appium] Appium REST http interface listener started on 0.0.0.0:4723
```

---

## 三、Appium Inspector 使用

### 3.1 启动 Inspector

打开 Appium Inspector，配置 Capabilities：

**Server：**
- Remote Host: `127.0.0.1`
- Remote Port: `4723`
- Remote Path: `/`

**Capabilities（Android 示例）：**

```json
{
  "platformName": "Android",
  "appium:platformVersion": "13",
  "appium:deviceName": "Pixel_6",
  "appium:appPackage": "com.android.settings",
  "appium:appActivity": ".Settings",
  "appium:automationName": "UiAutomator2",
  "appium:noReset": true
}
```

### 3.2 关键 Capabilities 说明

| 字段 | 含义 |
|------|------|
| `platformName` | 平台 Android/iOS |
| `platformVersion` | 系统版本 |
| `deviceName` | 设备名 |
| `appPackage` | App 包名 |
| `appActivity` | 启动 Activity |
| `app` | apk 文件路径（替代 package） |
| `automationName` | 引擎，Android 用 UiAutomator2 |
| `noReset` | 不重置 App |
| `fullReset` | 完全重置 |
| `udid` | 设备唯一 ID（多设备时） |

### 3.3 获取 appPackage / appActivity

```bash
# 方法 1：打开 App 后查看当前 Activity
adb shell dumpsys window | grep mCurrentFocus

# 方法 2：从 apk 提取
aapt dump badging xxx.apk | grep -E "package|launchable-activity"
```

### 3.4 Inspector 操作

启动后会显示 App 当前界面：

- 左侧：界面截图（可点元素）
- 中间：UI 元素树
- 右侧：选中元素的属性

**核心功能：**

- 点击元素查看属性
- 录制操作（生成代码）
- 在线测试定位策略
- 模拟操作（点击、输入、滑动）

---

## 四、第一个自动化用例

### 4.1 简单示例

```python
from appium import webdriver
from appium.options.android import UiAutomator2Options

# 配置
options = UiAutomator2Options()
options.platform_name = "Android"
options.platform_version = "13"
options.device_name = "Pixel_6"
options.app_package = "com.android.settings"
options.app_activity = ".Settings"
options.no_reset = True

# 连接 Appium Server
driver = webdriver.Remote("http://127.0.0.1:4723", options=options)

# 等待 3 秒
driver.implicitly_wait(10)

# 查找元素
el = driver.find_element("xpath", "//android.widget.TextView[@text='网络和互联网']")
el.click()

# 截图
driver.save_screenshot("settings.png")

# 关闭
driver.quit()
```

### 4.2 用 Pytest 改写

```python
import pytest
from appium import webdriver
from appium.options.android import UiAutomator2Options
from appium.webdriver.common.appiumby import AppiumBy

@pytest.fixture(scope="function")
def driver():
    options = UiAutomator2Options()
    options.platform_name = "Android"
    options.platform_version = "13"
    options.device_name = "Pixel_6"
    options.app_package = "com.android.settings"
    options.app_activity = ".Settings"
    options.no_reset = True
    
    driver = webdriver.Remote("http://127.0.0.1:4723", options=options)
    driver.implicitly_wait(10)
    yield driver
    driver.quit()

def test_open_network_settings(driver):
    el = driver.find_element(AppiumBy.XPATH, "//*[@text='网络和互联网']")
    el.click()
    assert driver.find_element(AppiumBy.XPATH, "//*[@text='WLAN']")
```

执行：

```bash
pytest test_demo.py -v
```

---

## 五、元素定位

### 5.1 定位方式

```python
from appium.webdriver.common.appiumby import AppiumBy

# 1. ID（最常用、最稳定）
driver.find_element(AppiumBy.ID, "com.example:id/login_btn")

# 2. XPath（最灵活）
driver.find_element(AppiumBy.XPATH, "//android.widget.EditText[@text='账号']")

# 3. 类名
driver.find_element(AppiumBy.CLASS_NAME, "android.widget.Button")

# 4. AccessibilityID
driver.find_element(AppiumBy.ACCESSIBILITY_ID, "login_button")

# 5. UiAutomator (Android 专用，强大)
driver.find_element(AppiumBy.ANDROID_UIAUTOMATOR, 'new UiSelector().text("登录")')
```

### 5.2 XPath 语法

```python
# 按 text
"//android.widget.TextView[@text='登录']"

# 按 resource-id
"//*[@resource-id='com.example:id/btn']"

# 按 content-desc
"//*[@content-desc='返回']"

# 按 class
"//android.widget.Button"

# 模糊匹配（contains）
"//*[contains(@text, '登')]"

# 多条件
"//*[@text='登录' and @clickable='true']"

# 父子层级
"//android.widget.LinearLayout/android.widget.Button[1]"

# 任意层级
"//android.widget.LinearLayout//android.widget.Button"

# 索引
"(//android.widget.Button)[2]"   # 第 2 个
```

### 5.3 UiAutomator 语法（Android 强大）

```python
# 按 text
'new UiSelector().text("登录")'
'new UiSelector().textContains("登")'
'new UiSelector().textStartsWith("登")'

# 按 resource-id
'new UiSelector().resourceId("com.example:id/btn")'

# 按 description
'new UiSelector().description("返回")'

# 按 class
'new UiSelector().className("android.widget.Button")'

# 组合
'new UiSelector().className("android.widget.Button").text("确定")'

# 索引
'new UiSelector().className("android.widget.Button").instance(1)'

# 滑动找元素（找不到自动滑动）
'new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("设置"))'
```

### 5.4 查找多个元素

```python
els = driver.find_elements(AppiumBy.CLASS_NAME, "android.widget.Button")
for el in els:
    print(el.text)
```

### 5.5 定位策略建议

```
优先级（稳定性）：
1. resource-id（最稳定）
2. AccessibilityID
3. UiAutomator with id
4. XPath with id
5. XPath with text
6. XPath 索引（最不稳定）
```

---

## 六、常用操作

### 6.1 基础操作

```python
# 点击
el.click()

# 输入
el.send_keys("hello")

# 清空
el.clear()

# 获取文本
text = el.text

# 获取属性
content_desc = el.get_attribute("content-desc")
clickable = el.get_attribute("clickable")

# 是否显示
el.is_displayed()

# 是否启用
el.is_enabled()

# 是否选中
el.is_selected()

# 元素大小和位置
size = el.size            # {'width': 100, 'height': 50}
location = el.location    # {'x': 200, 'y': 300}
```

### 6.2 屏幕操作

```python
# 截图
driver.save_screenshot("screen.png")

# 获取屏幕大小
size = driver.get_window_size()
width = size["width"]
height = size["height"]

# 旋转屏幕
driver.orientation = "LANDSCAPE"
driver.orientation = "PORTRAIT"

# 锁屏 / 解锁
driver.lock(3)         # 锁屏 3 秒后自动解锁
driver.unlock()
```

### 6.3 应用控制

```python
# 启动应用
driver.activate_app("com.example.app")

# 关闭应用（保留）
driver.terminate_app("com.example.app")

# 后台运行（Appium 2.x 推荐 mobile: 命令）
driver.execute_script("mobile: backgroundApp", {"seconds": 5})

# 重置应用（Appium 2.x 已移除 driver.reset()，改用以下组合）
driver.terminate_app("com.example.app")
driver.activate_app("com.example.app")

# 卸载
driver.remove_app("com.example.app")

# 安装
driver.install_app("/path/to/app.apk")

# 是否安装
driver.is_app_installed("com.example.app")
```

### 6.4 按键

```python
# 系统按键
driver.press_keycode(4)    # 返回键
driver.press_keycode(3)    # Home 键
driver.press_keycode(82)   # 菜单键
driver.press_keycode(24)   # 音量+
driver.press_keycode(25)   # 音量-
driver.press_keycode(26)   # 电源

# 用常量更可读
from selenium.webdriver.common.keys import Keys
# Appium 自己的常量在 appium.webdriver.extensions.android.nativekey
from appium.webdriver.extensions.android.nativekey import AndroidKey
driver.press_keycode(AndroidKey.BACK)
driver.press_keycode(AndroidKey.HOME)
```

### 6.5 弹窗处理

```python
# 切换到 Alert
alert = driver.switch_to.alert
alert.accept()    # 确认
alert.dismiss()   # 取消
text = alert.text
```

### 6.6 上下文切换（Hybrid App）

混合 App 中切换 Native / WebView：

```python
# 看所有上下文
contexts = driver.contexts
print(contexts)
# ['NATIVE_APP', 'WEBVIEW_com.example']

# 切到 WebView
driver.switch_to.context("WEBVIEW_com.example")

# 此时可用 Selenium 的 H5 定位
driver.find_element("css selector", "#login")

# 切回 Native
driver.switch_to.context("NATIVE_APP")
```

---

## 七、等待机制

### 7.1 三种等待

**1. 强制等待（不推荐）：**

```python
import time
time.sleep(3)    # 一定停 3 秒
```

**2. 隐式等待（全局）：**

```python
driver.implicitly_wait(10)    # 所有 find 都等最长 10 秒
```

**3. 显式等待（推荐）：**

```python
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from appium.webdriver.common.appiumby import AppiumBy

# 等元素出现
el = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((AppiumBy.ID, "com.example:id/btn"))
)

# 等元素可点
el = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((AppiumBy.ID, "com.example:id/btn"))
)

# 自定义条件
def text_appears(text):
    def condition(driver):
        try:
            return driver.find_element(AppiumBy.XPATH, f"//*[@text='{text}']")
        except:
            return False
    return condition

WebDriverWait(driver, 10).until(text_appears("登录成功"))
```

### 7.2 常用 expected_conditions

| 方法 | 含义 |
|------|------|
| `presence_of_element_located` | 元素存在（不一定可见） |
| `visibility_of_element_located` | 元素可见 |
| `element_to_be_clickable` | 元素可点 |
| `text_to_be_present_in_element` | 元素含特定文本 |
| `invisibility_of_element_located` | 元素消失 |

---

## 八、高级操作

### 8.1 滑动操作

**简单滑动：**

```python
# from_x, from_y, to_x, to_y, duration_ms
driver.swipe(500, 1500, 500, 500, 800)    # 向上滑
driver.swipe(500, 500, 500, 1500, 800)    # 向下滑
driver.swipe(800, 1000, 100, 1000, 800)   # 向左滑
driver.swipe(100, 1000, 800, 1000, 800)   # 向右滑
```

**封装通用滑动：**

```python
def swipe_up(driver, duration=500):
    size = driver.get_window_size()
    w, h = size["width"], size["height"]
    driver.swipe(w//2, h*3//4, w//2, h//4, duration)

def swipe_down(driver, duration=500):
    size = driver.get_window_size()
    w, h = size["width"], size["height"]
    driver.swipe(w//2, h//4, w//2, h*3//4, duration)

def swipe_left(driver, duration=500):
    size = driver.get_window_size()
    w, h = size["width"], size["height"]
    driver.swipe(w*3//4, h//2, w//4, h//2, duration)

def swipe_right(driver, duration=500):
    size = driver.get_window_size()
    w, h = size["width"], size["height"]
    driver.swipe(w//4, h//2, w*3//4, h//2, duration)
```

### 8.2 滚动到指定元素

**方法 1：UiAutomator（推荐）**

```python
driver.find_element(
    AppiumBy.ANDROID_UIAUTOMATOR,
    'new UiScrollable(new UiSelector().scrollable(true))'
    '.scrollIntoView(new UiSelector().text("我的设置"))'
)
```

**方法 2：循环滑动**

```python
def scroll_to_text(driver, text, max_swipes=10):
    for _ in range(max_swipes):
        try:
            return driver.find_element(AppiumBy.XPATH, f'//*[@text="{text}"]')
        except:
            swipe_up(driver)
    raise Exception(f"未找到 {text}")
```

### 8.3 触摸操作（W3C Actions）

```python
from selenium.webdriver.common.actions import interaction
from selenium.webdriver.common.actions.action_builder import ActionBuilder
from selenium.webdriver.common.actions.pointer_input import PointerInput

# 长按
actions = ActionBuilder(driver, mouse=PointerInput(interaction.POINTER_TOUCH, "touch"))
actions.pointer_action.move_to_location(500, 500)
actions.pointer_action.pointer_down()
actions.pointer_action.pause(2)         # 长按 2 秒
actions.pointer_action.pointer_up()
actions.perform()
```

### 8.4 文件操作

```python
import base64

# 推送文件到设备
driver.push_file("/sdcard/test.txt", source_path="local.txt")

# 拉取文件（返回的是 base64 字符串，需解码）
data_b64 = driver.pull_file("/sdcard/test.txt")
data = base64.b64decode(data_b64)
with open("local_copy.txt", "wb") as f:
    f.write(data)
```

### 8.5 网络模拟

```python
# Appium 2.x 通过 mobile: 命令控制网络
# 旧的 set_network_connection / network_connection 已废弃

# 开启 WiFi + 数据
driver.execute_script("mobile: setConnectivity", {
    "wifi": True,
    "data": True,
    "airplaneMode": False
})

# 断网（飞行模式）
driver.execute_script("mobile: setConnectivity", {
    "wifi": False,
    "data": False,
    "airplaneMode": True
})

# 仅 WiFi
driver.execute_script("mobile: setConnectivity", {
    "wifi": True,
    "data": False,
    "airplaneMode": False
})
```

### 8.6 录屏

```python
# 开始录制
driver.start_recording_screen()

# 执行测试
# ...

# 停止并获取 base64
import base64
video_base64 = driver.stop_recording_screen()
with open("recording.mp4", "wb") as f:
    f.write(base64.b64decode(video_base64))
```

---

## 九、框架设计

### 9.1 项目结构

```
app-test/
├── config/
│   └── capabilities.yaml    # 设备配置
├── common/
│   ├── driver_factory.py    # 驱动初始化
│   ├── base_page.py         # 页面基类
│   └── logger.py
├── pages/                    # Page Object
│   ├── login_page.py
│   ├── home_page.py
│   └── ...
├── testcases/
│   ├── test_login.py
│   └── test_home.py
├── data/
│   └── test_data.yaml
├── reports/
├── conftest.py
├── pytest.ini
├── requirements.txt
└── README.md
```

### 9.2 driver 工厂

```python
# common/driver_factory.py
from appium import webdriver
from appium.options.android import UiAutomator2Options
import yaml

def get_driver(config_path="config/capabilities.yaml"):
    with open(config_path, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f)
    
    options = UiAutomator2Options()
    options.load_capabilities(config)
    
    driver = webdriver.Remote(
        command_executor="http://127.0.0.1:4723",
        options=options
    )
    driver.implicitly_wait(10)
    return driver
```

`capabilities.yaml`（注意：`load_capabilities` 接受不带 `appium:` 前缀的 key）：

```yaml
platformName: Android
platformVersion: "13"
deviceName: "Pixel_6"
appPackage: "com.example.myapp"
appActivity: ".MainActivity"
automationName: "UiAutomator2"
noReset: true
newCommandTimeout: 600
```

> **说明：** YAML 中如果带 `appium:` 前缀（W3C 协议要求的厂商前缀），需用 `webdriver.Remote(desired_capabilities=...)` 直接传字典；而 `UiAutomator2Options.load_capabilities()` 会自动添加前缀，所以这里 key 不要带 `appium:`。

### 9.3 conftest.py

```python
import pytest
import allure
from common.driver_factory import get_driver

@pytest.fixture(scope="function")
def driver():
    driver = get_driver()
    yield driver
    driver.quit()

@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()
    if report.when == "call" and report.failed:
        # 失败截图
        driver = item.funcargs.get("driver")
        if driver:
            allure.attach(
                driver.get_screenshot_as_png(),
                name="failure_screenshot",
                attachment_type=allure.attachment_type.PNG
            )
```

---

## 十、Page Object 模式

### 10.1 为什么用 Page Object

- 元素定位集中管理，UI 变了只改一处
- 用例与页面分离，可读性强
- 复用性高

### 10.2 BasePage

```python
# common/base_page.py
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from appium.webdriver.common.appiumby import AppiumBy

class BasePage:
    def __init__(self, driver):
        self.driver = driver
    
    def find(self, locator, timeout=10):
        """显式等待找元素"""
        return WebDriverWait(self.driver, timeout).until(
            EC.presence_of_element_located(locator)
        )
    
    def click(self, locator, timeout=10):
        WebDriverWait(self.driver, timeout).until(
            EC.element_to_be_clickable(locator)
        ).click()
    
    def input(self, locator, text, timeout=10):
        el = self.find(locator, timeout)
        el.clear()
        el.send_keys(text)
    
    def get_text(self, locator, timeout=10):
        return self.find(locator, timeout).text
    
    def is_exist(self, locator, timeout=3):
        try:
            self.find(locator, timeout)
            return True
        except:
            return False
    
    def swipe_up(self):
        size = self.driver.get_window_size()
        w, h = size["width"], size["height"]
        self.driver.swipe(w//2, h*3//4, w//2, h//4, 500)
```

### 10.3 LoginPage 示例

```python
# pages/login_page.py
from appium.webdriver.common.appiumby import AppiumBy
from common.base_page import BasePage

class LoginPage(BasePage):
    # 元素定位
    USERNAME = (AppiumBy.ID, "com.example:id/et_username")
    PASSWORD = (AppiumBy.ID, "com.example:id/et_password")
    LOGIN_BTN = (AppiumBy.ID, "com.example:id/btn_login")
    ERROR_MSG = (AppiumBy.ID, "com.example:id/tv_error")
    
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
        """链式调用"""
        self.input_username(username)
        self.input_password(password)
        self.click_login()
        return self
    
    def get_error_msg(self):
        return self.get_text(self.ERROR_MSG)
```

### 10.4 测试用例

```python
# testcases/test_login.py
import pytest
import allure
from pages.login_page import LoginPage

@allure.feature("登录")
class TestLogin:
    
    @allure.title("正常登录")
    def test_login_success(self, driver):
        login_page = LoginPage(driver)
        login_page.login("testuser", "123456")
        # 断言：登录成功后跳转到首页
        from pages.home_page import HomePage
        home_page = HomePage(driver)
        assert home_page.is_exist(home_page.HOME_TITLE)
    
    @allure.title("密码错误")
    def test_login_wrong_password(self, driver):
        login_page = LoginPage(driver)
        login_page.login("testuser", "wrong")
        assert "密码错误" in login_page.get_error_msg()
    
    @pytest.mark.parametrize("user,pwd,expected", [
        ("", "123456", "用户名不能为空"),
        ("testuser", "", "密码不能为空"),
        ("nouser", "123456", "账号不存在"),
    ])
    @allure.title("登录异常：{expected}")
    def test_login_invalid(self, driver, user, pwd, expected):
        login_page = LoginPage(driver)
        login_page.login(user, pwd)
        assert expected in login_page.get_error_msg()
```

---

## 十一、iOS 测试

### 11.1 前置条件

- **必须 Mac** 系统
- Xcode 已安装
- 真机需要 Apple Developer 账号
- 装 `xcuitest` driver：`appium driver install xcuitest`

### 11.2 iOS Capabilities

```python
options = XCUITestOptions()
options.platform_name = "iOS"
options.platform_version = "17.0"
options.device_name = "iPhone 14"
options.bundle_id = "com.example.myapp"    # 类似 Android 的 appPackage
options.automation_name = "XCUITest"
options.udid = "device-udid"     # 真机
```

### 11.3 iOS 元素定位

```python
# 通过 accessibility id（最稳定）
driver.find_element(AppiumBy.ACCESSIBILITY_ID, "login_button")

# 通过 iOS Predicate
driver.find_element(AppiumBy.IOS_PREDICATE, "name == 'Login'")
driver.find_element(AppiumBy.IOS_PREDICATE, "type == 'XCUIElementTypeButton' AND name == 'Login'")

# 通过 iOS Class Chain
driver.find_element(AppiumBy.IOS_CLASS_CHAIN, "**/XCUIElementTypeButton[`name == 'Login'`]")

# XPath（不推荐，慢）
driver.find_element(AppiumBy.XPATH, "//XCUIElementTypeButton[@name='Login']")
```

### 11.4 iOS 与 Android 差异

| 维度 | Android | iOS |
|------|---------|-----|
| 平台 | 任意 | 必须 Mac |
| 模拟器 | AVD | iOS Simulator |
| 启动慢 | 中等 | 较慢 |
| 元素定位 | id 多 | accessibility id 多 |
| 真机调试 | 简单 | 需开发者账号 |

---

## 十二、实战案例

### 12.1 案例一：完整登录测试

```python
import pytest
import allure
import yaml
from pages.login_page import LoginPage

# 读取测试数据
with open("data/login_data.yaml") as f:
    login_data = yaml.safe_load(f)

@allure.epic("用户中心")
@allure.feature("登录")
class TestLogin:
    
    @pytest.mark.parametrize("case", login_data, 
                              ids=[c["case_name"] for c in login_data])
    @allure.title("{case[case_name]}")
    def test_login(self, driver, case):
        with allure.step(f"输入账号 {case['username']}"):
            login_page = LoginPage(driver)
            login_page.input_username(case["username"])
        
        with allure.step(f"输入密码"):
            login_page.input_password(case["password"])
        
        with allure.step("点击登录"):
            login_page.click_login()
        
        with allure.step(f"验证：{case['expected']}"):
            if case["expected_success"]:
                from pages.home_page import HomePage
                home_page = HomePage(driver)
                assert home_page.is_exist(home_page.HOME_TITLE)
            else:
                assert case["expected"] in login_page.get_error_msg()
```

`data/login_data.yaml`:

```yaml
- case_name: 正常登录
  username: testuser
  password: "123456"
  expected_success: true
  expected: ""

- case_name: 密码错误
  username: testuser
  password: wrong
  expected_success: false
  expected: 密码错误

- case_name: 账号不存在
  username: nouser
  password: "123456"
  expected_success: false
  expected: 账号不存在

- case_name: 账号为空
  username: ""
  password: "123456"
  expected_success: false
  expected: 用户名不能为空
```

### 12.2 案例二：下单流程

```python
@allure.feature("订单")
class TestOrder:
    
    @allure.title("完整下单流程")
    def test_order_flow(self, driver):
        # 1. 登录
        with allure.step("登录"):
            LoginPage(driver).login("testuser", "123456")
        
        # 2. 进入商品列表
        with allure.step("选择商品"):
            home = HomePage(driver)
            home.click_product(0)
        
        # 3. 加入购物车
        with allure.step("加入购物车"):
            product = ProductPage(driver)
            product.add_to_cart()
        
        # 4. 提交订单
        with allure.step("提交订单"):
            cart = CartPage(driver)
            cart.go_to_checkout()
            checkout = CheckoutPage(driver)
            checkout.submit_order()
        
        # 5. 验证订单创建
        with allure.step("验证订单成功"):
            order_result = OrderResultPage(driver)
            assert order_result.is_success()
```

### 12.3 案例三：失败重试与截图

`conftest.py`：

```python
@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()
    
    if report.when == "call" and report.failed:
        driver = item.funcargs.get("driver")
        if driver:
            # 截图
            screenshot = driver.get_screenshot_as_png()
            allure.attach(screenshot, "失败截图", allure.attachment_type.PNG)
            
            # 页面源码
            allure.attach(driver.page_source, "页面源码", allure.attachment_type.TEXT)
            
            # 日志
            try:
                logs = driver.get_log("logcat")
                allure.attach(str(logs[-100:]), "Logcat", allure.attachment_type.TEXT)
            except:
                pass
```

加重试：

```bash
pip install pytest-rerunfailures
pytest --reruns 2 --reruns-delay 5
```

### 12.4 案例四：多设备并行

利用 `pytest-xdist`：

```bash
pip install pytest-xdist
```

需要启动多个 Appium 端口：

```bash
appium -p 4723 --base-path /
appium -p 4724 --base-path /
```

每个 worker 用不同设备 + 端口：

```python
@pytest.fixture(scope="function")
def driver(worker_id):
    if worker_id == "gw0":
        port = 4723
        udid = "device1"
    else:
        port = 4724
        udid = "device2"
    
    # ... 创建 driver
```

执行：

```bash
pytest -n 2
```

---

## 十三、常见问题排查

### 13.1 Appium Server 启动失败

```
Error: Cannot find module 'xxx'
```

重装：

```bash
npm uninstall -g appium
npm install -g appium
appium driver install uiautomator2
```

### 13.2 设备连不上

```bash
# 看设备
adb devices

# 如果显示 unauthorized
# 手机点确认调试授权

# 如果没设备
adb kill-server
adb start-server
```

### 13.3 元素找不到

排查清单：

- 用 Appium Inspector 重新定位
- 看 App 是否在预期页面
- 加显式等待
- 检查元素是否在 WebView 中（要切换 context）
- 元素可能被遮挡或滚出屏幕

### 13.4 启动 App 失败

- appPackage / appActivity 是否对
- App 是否已安装
- 用 `adb shell am start -n package/activity` 手动验证

### 13.5 元素能找到但点击无响应

- 元素可能不在屏幕中央
- 试试坐标点击：`driver.tap([(x, y)])`
- 看 clickable 属性是否为 true
- 父元素拦截了点击：找父元素

### 13.6 输入中文失败

UiAutomator2 默认不支持中文，方案：

**方案 1：使用 unicodeKeyboard**

```python
options.unicode_keyboard = True
options.reset_keyboard = True
```

**方案 2：剪贴板**

```python
import base64
text = "中文"
driver.set_clipboard_text(text)
# 长按粘贴
```

### 13.7 WebView 找不到 context

```bash
# Hybrid App 需要开启 WebView 调试
# 让开发在代码中：
WebView.setWebContentsDebuggingEnabled(true)
```

### 13.8 真机和模拟器表现不一致

模拟器与真机差异：
- 性能
- 网络
- 传感器
- 系统优化

建议关键用例真机回归。

### 13.9 偶发失败

- 弱网导致页面慢：加显式等待
- 数据状态：每次测试用独立账号或重置
- 系统弹窗：增加权限弹窗处理

```python
# 自动同意权限弹窗
options.auto_grant_permissions = True
```

### 13.10 性能问题

```python
# 关掉录屏、详细日志
# 使用 xpath 索引（昂贵）改为 id
# 用 UiAutomator scrollIntoView 替代循环滑动
```

---

## 十四、最佳实践

### 14.1 用例编写

- 用 Page Object 模式
- 元素定位优先 id
- 必加显式等待
- 单用例不依赖其他用例
- 失败时保留截图、日志

### 14.2 维护建议

- 元素定位集中管理
- 数据外部化（YAML/CSV）
- 配置环境变量切换
- 定期回归，发现失败立即修复
- 与开发约定 resource-id 规范

### 14.3 推荐学习

- Appium 官方文档：`https://appium.io/docs/en/latest/`
- TesterHome 移动测试板块
- 《App 自动化测试入门到精通》

---

> **测试纪律：** App 自动化是 UI 层最不稳定的测试，要做好预期管理。优先用 ID 定位，避免 XPath 索引。失败用例及时排查（是环境问题、Bug 还是脚本问题），不要无视失败。
