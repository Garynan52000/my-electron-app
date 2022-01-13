# 安全性，原生能力和你的责任

Web开发人员通畅享有浏览器强大的网络安全特性，而自己的代码风险相对较小。 我们的网站在沙盒中被赋予了有限的权力，我们相信我们的用户享受到的是一个由大型工程师团队打造的浏览器，它能够快速应对新发现的安全威胁。

<br>

当使用 Electron 时，很重要的一点是要理解 Electron 不是一个 Web 浏览器。 它允许您使用熟悉的 Web 技术构建功能丰富的桌面应用程序，但是您的代码具有更强大的功能。 JavaScript 可以访问文件系统，用户 shell 等。 这允许您构建更高质量的本机应用程序，但是内在的安全风险会随着授予您的代码的额外权力而增加。

<br>

考虑到这一点，请注意，展示任意来自不受信任源的内容都将会带来严重的安全风险，而这种风险Electron也没打算处理。 事实上，最流行的 Electron 应用程序(Atom，Slack，Visual Studio Code 等) 主要显示本地内容(即使有远程内容也是无 Node 的、受信任的、安全的内容) - 如果您的应用程序要运行在线的源代码，那么您需要确保源代码不是恶意的。

## 报告安全问题

有关如何正确上报 Electron 漏洞的信息，参阅 (SECURITY.md)[https://github.com/electron/electron/tree/main/SECURITY.md]

## Chromium 安全问题和升级

Electron 与交替的 Chromium 版本保持同步。欲了解更多信息，请查看 (Electron Release Cadence 博文)[https://electronjs.org/blog/12-week-cadence]。

## 安全是所有人的共同责任

需要牢记的是，你的 Electron 程序安全性除了依赖于整个框架基础（Chromium、Node.js）、Electron 本身和所有相关 NPM 库的安全性，还依赖于你自己的代码安全性。 因此，你有责任遵循下列安全守则：

<br>

- **使用最新版的 Electron 框架搭建你的程序。** 你最终发行的产品中会包含 Electron、Chromium 共享库和 Node.js 的组件。 这些组件存在的安全问题也可能影响你的程序安全性。 你可以通过更新Electron到最新版本来确保像是 nodeIntegration 绕过攻击一类的严重漏洞已经被修复因而不会影响到你的程序。 请参阅 (“使用当前版本的Electron”)[https://www.electronjs.org/zh/docs/latest/tutorial/security#16-use-a-current-version-of-electron] 以获取更多信息。
- **评估你的依赖项目**NPM提供了五百万可重用的软件包，而你应当承担起选择可信任的第三方库。 如果你使用了受已知漏洞的过时的库，或是依赖于维护的很糟糕的代码，你的程序安全就可能面临威胁。
- **遵循安全编码实践**你的代码是你的程序安全的第一道防线。 一般的网络漏洞，例如跨站脚本攻击(Cross-Site Scripting, XSS)，对Electron将造成更大的影响，因此非常建议你遵循安全软件开发最佳实践并进行安全性测试。

## 隔离不信任的内容

每当你从不被信任的来源(如一个远程服务器)获取代码并在本地执行，其中就存在安全性问题。 例如在默认的 (`BrowserWindow`)[https://www.electronjs.org/zh/docs/latest/api/browser-window] 中显示一个远程网站. 如果攻击者以某种方式设法改变所述内容 (通过直接攻击源或者通过在应用和实际目的地之间进行攻击) ，他们将能够在用户的机器上执行本地代码。

<br>

> **无论如何**，在启用Node.js集成的情况下，你都不该加载并执行远程代码。 相反，只使用本地文件（和您的应用打包在一起）来执行Node.js代码 如果你想要显示远程内容，请使用 (`<webview>`)[https://www.electronjs.org/zh/docs/latest/api/webview-tag] Tag或者 (`BrowserView`)[https://www.electronjs.org/zh/docs/latest/api/browser-view]，并确保禁用 `nodeIntegration` 并启用 `contextIsolation`

<br>

## Electron 安全警告

从Electron 2.0版本开始，开发者将会在开发者控制台看到打印的警告和建议。 这些警告仅在可执行文件名为 Electron 时才会为开发者显示。

<br>

你可以通过在 `process.env` 或 window 对象上配置 `ELECTRON_ENABLE_SECURITY_WARNINGS` 或`ELECTRON_DISABLE_SECURITY_WARNINGS` 来强制开启或关闭这些警告。

## 清单：安全建议​

为加强程序安全性，你至少应当遵循下列规则：

<br>

- (只加载安全的内容)[https://www.electronjs.org/zh/docs/latest/tutorial/security#1-only-load-secure-content]
- (禁止在所有渲染器中使用Node.js集成显示远程内容)[https://www.electronjs.org/zh/docs/latest/tutorial/security#2-do-not-enable-nodejs-integration-for-remote-content]
- (在所有显示远程内容的渲染器中启用上下文隔离)[https://www.electronjs.org/zh/docs/latest/tutorial/security#3-enable-context-isolation-for-remote-content]。
- (Enable sandboxing)[https://www.electronjs.org/zh/docs/latest/tutorial/security#4-enable-sandboxing]
- (在所有加载远程内容的会话中使用 `ses.setPermissionRequestHandler()`)[https://www.electronjs.org/zh/docs/latest/tutorial/security#5-handle-session-permission-requests-from-remote-content].
- (不要禁用 `webSecurity`)[https://www.electronjs.org/zh/docs/latest/tutorial/security#6-do-not-disable-websecurity]
- 定义一个 (`Content-Security-Policy`)[https://www.electronjs.org/zh/docs/latest/tutorial/security#7-define-a-content-security-policy] 并设置限制规则(如：`script-src 'self'`)
- (不要设置 `allowRunningInsecureContent` 为 `true`.)[https://www.electronjs.org/zh/docs/latest/tutorial/security#8-do-not-set-allowrunninginsecurecontent-to-true]
- (不要开启实验性功能)[https://www.electronjs.org/zh/docs/latest/tutorial/security#9-do-not-enable-experimental-features]
- (不要使用 `enableBlinkFeatures`)[https://www.electronjs.org/zh/docs/latest/tutorial/security#10-do-not-use-enableblinkfeatures]
- (`<webview>`：不要使用 allowpopups)[https://www.electronjs.org/zh/docs/latest/tutorial/security#11-do-not-use-allowpopups]
- (`<webview>`：验证选项与参数)[https://www.electronjs.org/zh/docs/latest/tutorial/security#12-verify-webview-options-before-creation]
- (禁用或限制网页跳转)[https://www.electronjs.org/zh/docs/latest/tutorial/security#13-disable-or-limit-navigation]
- (禁用或限制新窗口创建)[https://www.electronjs.org/zh/docs/latest/tutorial/security#14-disable-or-limit-creation-of-new-windows]
- (不要对不可信的内容使用 `openExternal`)[https://www.electronjs.org/zh/docs/latest/tutorial/security#15-do-not-use-openexternal-with-untrusted-content]
- (使用当前版本的 Electron)[https://www.electronjs.org/zh/docs/latest/tutorial/security#16-use-a-current-version-of-electron]

<br>

如果你想要自动检测错误的配置或是不安全的模式，可以使用 (`electronegativity`)[https://github.com/doyensec/electronegativity]。 关于在使用Electron进行应用程序开发中的潜在薄弱点或者bug，您可以参考(开发者与审核人员指南)[https://doyensec.com/resources/us-17-Carettoni-Electronegativity-A-Study-Of-Electron-Security-wp.pdf]