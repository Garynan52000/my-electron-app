# 进程沙盒化

Chromium的一个关键安全特性是，进程可以在沙盒中执行。 沙盒通过限制对大多数系统资源的访问来减少恶意代码可能造成的伤害 — 沙盒化的进程只能自由使用CPU周期和内存。 为了执行需要额外权限的操作，沙盒处的进程通过专用通信渠道将任务下放给更大权限的进程。

<br>

在Chromium中，沙盒化应用于主进程以外的大多数进程。 其中包括渲染器进程，以及功能性进程，如音频服务、GPU 服务和网络服务。

<br>

查阅Chromium的 (沙箱设计文档)[https://www.electronjs.org/zh/docs/latest/tutorial/sandbox] 了解更多信息。

## Electron沙盒化策略

Electron带有一个混合的沙盒环境，意味着沙盒化进程可以和有权限的进程一起运行。 默认情况下，渲染器进程未被沙盒化，但功能性进程是被沙盒化的。 注意，就像在Chromium中一样，主 (浏览器) 进程是有特权的且无法被沙盒化。

<br>

从历史上看，这种混合沙盒方法之所以成立，是因为在渲染器中提供Node.js对于应用开发人员来说是一个非常强大的工具。 不幸的是，这一特性同时也是一个巨大的安全漏洞。

<br>

从理论上讲，对于只显示可信代码的桌面应用程序来说，未沙盒化的渲染器不是问题，但它们使 Electron 在显示不受信任的 Web 内容时的安全性低于 Chromium。 然而，即使据称可信的代码也可能是危险的 — 在远程加载的网站上有无数恶意行为者可以使用的攻击途径。稍微举几个例子：从跨站脚本到内容注入再到中间人攻击。 因此，我们建议在大多数非常谨慎的情况下启用渲染器沙盒化。

<br>

请注意，问题跟踪器中有一个积极的讨论，以默认启用渲染器沙盒。有关详细信息，请参阅(#28466)[https://github.com/electron/electron/issues/28466])。

## Electron 中的沙盒行为

在 Electron 中沙盒进程 大部分地 表现都与 Chromium 差不多， 但因为介面是 Node.js 的关系 Electron 有一些额外的概念需要考虑。

#### 渲染器进程

当 Electron 中的渲染器进程被沙盒化时，它们的行为与常规 Chrome 渲染器一样。 一个沙盒化的渲染器不会有一个 Node.js 环境。

<br>

因此，在沙盒中，渲染器进程只能透过 进程间通讯 ( inter-process communication, IPC ) 委派任务给主进程的方式， 来执行需权限的任务 ( 例如：操作档案系统，改变作业系统 或 生成子进程 ) 。

#### 预加载脚本

为了允许渲染器进程与主进程通信，附加到沙盒渲染器的预加载脚本仍将有一个可用的 Node.js API 子集。暴露了一个类似于 Node 的 `require` 模块的 `require` 函数，但只能导入 Electron 和 Node 内置模块的一个子集：

<br>

- `electron` (only renderer process modules)
- (`事件`)[https://nodejs.org/api/events.html]
- (`timers`)[https://nodejs.org/api/timers.html]
- (`url`)[https://nodejs.org/api/url.html]

<br>

此外，预加载脚本还将某些 Node.js 原语填充为全局变量：

<br>

- (`Buffer`)[https://nodejs.org/api/Buffer.html]
- (`process`)[https://www.electronjs.org/zh/docs/latest/api/process]
- (`clearImmediate`)[https://nodejs.org/api/timers.html#timers_clearimmediate_immediate]
- (`setImmediate`)[https://nodejs.org/api/timers.html#timers_setimmediate_callback_args]

<br>

因为 `require` 函数是一个功能有限的 polyfill，所以您将无法使用 (CommonJS 模块)[https://nodejs.org/api/modules.html#modules_modules_commonjs_modules] 将您的预加载脚本分成多个文件。如果您需要拆分预加载代码，请使用打包工具，例如 (webpack)[https://webpack.js.org/] 或 (Parcel)[https://parceljs.org/]。

<br>

请注意，由于呈现给预加载脚本的环境比沙盒渲染器的环境具有更高的特权，除非启用了 (`contextIsolation`)[https://www.electronjs.org/zh/docs/latest/tutorial/context-isolation]，否则仍有可能将特权 API 泄​​漏给在渲染器进程中运行的不受信任的代码。

## 配置沙盒

#### 为单个进程启用沙箱

在 Electron 中，可以使用沙箱在每个进程的基础上启用渲染器沙箱：(`BrowserWindow`)[https://www.electronjs.org/zh/docs/latest/api/browser-window] 构造函数中设置首选项 `sandbox: true`。

<br>

```
# main.js

app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: {
      sandbox: true
    }
  })
  win.loadURL('https://google.com')
})
```

#### 全局启用沙盒

如果你想对所有渲染器强制沙盒，你也可以使用 (`app.enableSandbox`)[https://www.electronjs.org/zh/docs/latest/api/app#appenablesandbox] API。请注意，此 API 必须在应用程序的就绪事件之前调用。

<br>

```
# main.js
app.enableSandbox()

app.whenReady().then(() => {
  // no need to pass `sandbox: true` since `app.enableSandbox()` was called.
  const win = new BrowserWindow()
  win.loadURL('https://google.com')
})
```

#### 禁用 Chromium 的沙盒（仅测试）

您还可以使用 (`--no-sandbox`)[https://www.electronjs.org/zh/docs/latest/api/command-line-switches#--no-sandbox] CLI 标志完全禁用 Chromium 的沙箱，这将禁用所有进程（包括实用程序进程）的沙箱。我们强烈建议您仅将此标志用于测试目的，而不要在生产中使用。

<br>

请注意， `sandbox: true` 选项仍将禁用渲染器的 Node.js 环境。

## 关于呈现不受信任内容的说明

在 Electron 中渲染不受信任的内容仍然是一个未知的领域，尽管一些应用程序正在取得成功（例如 (Beaker Browser))[https://github.com/beakerbrowser/beaker]）。我们的目标是在沙盒内容的安全性方面尽可能接近 Chrome，但由于一些基本问题，我们最终将永远落后：

<br>

- 我们没有 Chromium 必须应用于其产品安全性的专用资源或专业知识。我们尽最大努力利用我们所拥有的，从 Chromium 继承我们所能提供的一切，并快速响应安全问题，但是如果没有 Chromium 能够奉献的资源，Electron 就无法像 Chromium 一样安全。
- Chrome 中的一些安全功能（例如安全浏览和证书透明度）需要集中式授权和专用服务器，这两者都与 Electron 项目的目标背道而驰。因此，我们禁用了 Electron 中的这些功能，代价是它们原本会带来的相关安全性。
- 只有一个 Chromium，而有成千上万个基于 Electron 构建的应用程序，所有这些应用程序的行为都略有不同。考虑到这些差异可能会产生巨大的可能性空间，并使在不寻常的用例中确保平台的安全性变得具有挑战性。
- 我们无法直接向用户推送安全更新，因此我们依赖应用程序供应商升级其应用程序底层的 Electron 版本，以便让安全更新到达用户手中。

<br>

虽然我们尽最大努力将 Chromium 安全修复程序向后移植到旧版本的 Electron，但我们不保证每个修复程序都会被向后移植。保持安全的最佳机会是使用最新的稳定版 Electron。