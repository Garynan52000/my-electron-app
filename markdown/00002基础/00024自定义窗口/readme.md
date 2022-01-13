# 自定义窗口

`BrowserWindow` 模块是 Electron 应用程序的基础，它公开了许多可以改变浏览器窗口外观和行为的 API。在本教程中，我们将讨论在 macOS、Windows 和 Linux 上进行窗口自定义的各种用例。

## 创建无边框窗口

无框窗口是没有 (chrome 镶边)[https://developer.mozilla.org/en-US/docs/Glossary/Chrome] 的窗口。不要与 Google Chrome 浏览器混淆，窗口镶边是指不属于网页的窗口部分（例如工具栏、控件）。

<br>

要创建无框窗口，您需要在 `BrowserWindow` 构造函数中将 `frame` 设置为 `false`。

<br>

```
# main.js

const { BrowserWindow } = require('electron')
const win = new BrowserWindow({ frame: false })
```

## 应用自定义标题栏样式 \(macOS Windows\)

标题栏样式允许您隐藏 BrowserWindow 的大部分镶边，同时保持系统的本机窗口控件完好无损，并且可以使用 `BrowserWindow` 构造函数中的 `titleBarStyle` 选项进行配置。

<br>

应用隐藏标题栏样式会导致隐藏标题栏和全尺寸内容窗口。

<br>

```
const { BrowserWindow } = require('electron')
const win = new BrowserWindow({ titleBarStyle: 'hidden' })
```

#### 控制红绿灯 \(macOS\)

在 macOS 上，应用隐藏的标题栏样式仍会在左上角显示标准窗口控件（“交通灯”）。

#### 自定义交通灯的外观 \(macOS\)

`customButtonsOnHover` 标题栏样式将隐藏交通信号灯，直到您将鼠标悬停在它们上方。如果您想在 HTML 中创建自定义交通信号灯但仍使用本机 UI 来控制窗口，这将非常有用。

<br>

```
const { BrowserWindow } = require('electron')
const win = new BrowserWindow({ titleBarStyle: 'customButtonsOnHover' })
```

#### 自定义红绿灯位置 \(macOS\)

要修改交通灯窗口控件的位置，有两个可用的配置选项。

<br>

应用 `hiddenInset` 标题栏样式将使交通灯的垂直插入移动一个固定的量。

<br>

```
const { BrowserWindow } = require('electron')
const win = new BrowserWindow({ titleBarStyle: 'hiddenInset' })
```

<br>

如果您需要更精细地控制交通信号灯的位置，可以将一组坐标传递给 `BrowserWindow` 构造函数中的 `trafficLightPosition` 选项。

<br>

```
const { BrowserWindow } = require('electron')
const win = new BrowserWindow({
  titleBarStyle: 'hidden',
  trafficLightPosition: { x: 10, y: 10 }
})
```

#### 以编程方式显示和隐藏红绿灯 \(macOS\)

您还可以在主进程中以编程方式显示和隐藏交通信号灯。 `win.setWindowButtonVisibility` 根据其布尔参数的值强制显示或隐藏交通灯。

<br>

```
const { BrowserWindow } = require('electron')
const win = new BrowserWindow()
// hides the traffic lights
win.setWindowButtonVisibility(false)
```

<br>

> 注意：鉴于可用 API 的数量，有很多方法可以实现这一点。例如，将 `frame: false` 与 `win.setWindowButtonVisibility(true)` 组合将产生与设置 `titleBarStyle: 'hidden'` 相同的布局结果。

## 窗口控件覆盖 \(macOS Windows\)

(Window Controls Overlay API)[https://github.com/WICG/window-controls-overlay/blob/main/explainer.md] 是一种 Web 标准，它使 Web 应用程序能够在安装在桌面上时自定义其标题栏区域。 Electron 通过 `BrowserWindow` 构造函数选项 `titleBarOverlay` 公开这个 API。

<br>

仅当在 macOS 或 Windows 上应用自定义 `titlebarStyle` 时，此选项才有效。启用 `titleBarOverlay` 时，窗口控件将在其默认位置暴露，并且 DOM 元素无法使用该区域下方的区域。

<br>

`titleBarOverlay` 选项接受两种不同的值格式。

<br>

在任一平台上指定 `true` 将导致覆盖区域具有默认系统颜色：

<br>

```
// on macOS or Windows
const { BrowserWindow } = require('electron')
const win = new BrowserWindow({
  titleBarStyle: 'hidden',
  titleBarOverlay: true
})
```

<br>

在 Windows 上，您还可以通过将 `titleBarOverlay` 设置为具有 `color` 和 `symbolColor` 属性的对象来指定叠加层及其符号的颜色。如果未指定选项，则颜色将默认为其窗口控制按钮的系统颜色：

<br>

```
// on Windows
const { BrowserWindow } = require('electron')
const win = new BrowserWindow({
  titleBarStyle: 'hidden',
  titleBarOverlay: {
    color: '#2f3241',
    symbolColor: '#74b1be'
  }
})
```

> 注意：从主进程启用标题栏覆盖后，您可以使用一组只读 (JavaScript API)[https://github.com/WICG/window-controls-overlay/blob/main/explainer.md#javascript-apis] 和 (CSS 环境变量)[https://github.com/WICG/window-controls-overlay/blob/main/explainer.md#css-environment-variables] 从渲染器访问覆盖的颜色和尺寸值。

## 创建透明窗口

通过将 `transparent` 选项设置为 `true`，您可以制作一个完全透明的窗口。

<br>

```
const { BrowserWindow } = require('electron')
const win = new BrowserWindow({ transparent: true })
```

<br>

#### 局限性

- 您无法单击透明区域。有关详细信息，请参阅 (#1335)[https://github.com/electron/electron/issues/1335]。
- 透明窗口不可调整大小。 在某些平台上，将 `resizable` 设置为 `true` 可能会使透明窗口停止工作。
- CSS `blur()` 过滤器仅适用于窗口的 Web 内容，因此无法对窗口下方的内容（即用户系统上打开的其他应用程序）应用模糊效果。
- 在 **Windows** 上
    - 禁用 DWM 时，透明窗口将不起作用。
    - 使用 Windows 系统菜单或双击标题栏无法最大化透明窗口。这背后的原因可以在 PR (#28207)[https://github.com/electron/electron/pull/28207] 中看到。
- 在 **macOS** 上
    - 本机窗口阴影不会显示在透明窗口上。

## 创建 click-through 窗口

要创建一个点击穿透窗口，也就是使窗口忽略所有鼠标事件，可以调用 (win.setIgnoreMouseEvents(ignore))[https://www.electronjs.org/zh/docs/latest/api/browser-window#winsetignoremouseeventsignore-options] API：

<br>

```
const { BrowserWindow } = require('electron')
const win = new BrowserWindow()
win.setIgnoreMouseEvents(true)
```

<br>

#### 转发鼠标事件 \(macOS Windows\)

忽略鼠标消息会使 Web 内容忽略鼠标移动，这意味着不会发出鼠标移动事件。在 Windows 和 macOS 上，可以使用可选参数将鼠标移动消息转发到网页，从而允许发出诸如 `mouseleave` 之类的事件

<br>

```
# main.js

const { BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const win = new BrowserWindow({
  webPreferences: {
    preload: path.join(__dirname, 'preload.js')
  }
})

ipcMain.on('set-ignore-mouse-events', (event, ...args) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  win.setIgnoreMouseEvents(...args)
})
```

<br>

```
# preload.js

window.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('clickThroughElement')
  el.addEventListener('mouseenter', () => {
    ipcRenderer.send('set-ignore-mouse-events', true, { forward: true })
  })
  el.addEventListener('mouseleave', () => {
    ipcRenderer.send('set-ignore-mouse-events', false)
  })
})
```

<br>

这使得网页在 `#clickThroughElement` 元素上方时点击通过，并在其外部恢复正常。

## 设置自定义可拖动区域

默认情况下, 无边框窗口是不可拖拽的。 应用程序需要在 CSS 中指定 `-webkit-app-region: drag` 来告诉 Electron 哪些区域是可拖拽的（如操作系统的标准标题栏），在可拖拽区域内部使用 `-webkit-app-region: no-drag` 则可以将其中部分区域排除。 请注意, 当前只支持矩形形状。

<br>

要使整个窗口可拖拽, 您可以添加 `-webkit-app-region: drag` 作为 `body` 的样式:

<br>

```
styles.css

body {
  -webkit-app-region: drag;
}
```
<br>

请注意，如果您使整个窗口都可拖拽，则必须将其中的按钮标记为不可拖拽，否则用户将无法点击它们：

<br>

```
button {
  -webkit-app-region: no-drag;
}
```

<br>

如果只将自定义标题栏设置为可拖拽，还需要使标题栏中的所有按钮都不可拖拽。

## 技巧：禁用文本选择

创建可拖动区域时，拖动行为可能与文本选择冲突。例如，当您拖动标题栏时，您可能会意外选择其文本内容。为防止这种情况，您需要在可拖动区域内禁用文本选择，如下所示：

<br>

```
.titlebar {
  -webkit-user-select: none;
  -webkit-app-region: drag;
}
```

## 技巧：禁用上下文菜单​

在某些平台上，可拖动区域将被视为非客户端框架，因此当您右键单击它时，会弹出一个系统菜单。为了使上下文菜单在所有平台上都能正常运行，您永远不应该在可拖动区域上使用自定义上下文菜单。