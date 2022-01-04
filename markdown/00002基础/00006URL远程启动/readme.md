# 从其他应用中的 URL 启动您的应用

## 概览

本指南将会指导你配置 Electron 应用为 (特定协议)[https://www.electronjs.org/docs/api/protocol] 的默认处理器。
<br>
通过此教程，您会掌握如何设置您的应用以拦截并处理任意特定协议的URL的点击事件。 在本指南中，我们假定这个协议名为 “`electron-fiddle://`”

## 示例

#### 主进程（main.js）

首先，我们需要从 `electron` 导入所需的模块。 这些模块有助于控制应用的生命周期，或创建原生的浏览器窗口。

<br>

```
const { app, BrowserWindow, shell } = require('electron')
const path = require('path')
```

<br>

其次，我们将应用注册为 “`electron-fiddle://`” 协议的处理器。

<br>

```
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('electron-fiddle', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('electron-fiddle')
}
```

<br>

现在我们定义负责创建浏览器窗口的函数，并加载应用的 `index.html` 文件。

```
const createWindow = () => {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')
}
```

<br>

紧接着，我们将创建 `BrowserWindow` 并在应用中定义如何处理此外部协议被点击的事件。
<br>
与 MacOS 或 Linux 不同，在 Windows 下需要其他的代码。 这是因为在 Windows 中需要特别处理在同一个 Electron 实例中打开的协议的内容。 请点击 (此处)[https://www.electronjs.org/docs/api/app#apprequestsingleinstancelock] 了解更多

- **Windows 下代码：**
```
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 用户正在尝试运行第二个实例，我们需要让焦点指向我们的窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  // 创建 mainWindow，加载其他资源，等等……
  app.whenReady().then(() => {
    createWindow()
  })

  // 处理协议。 在本例中，我们选择显示一个错误提示对话框。
  app.on('open-url', (event, url) => {
    dialog.showErrorBox('欢迎回来', `导向自: ${url}`)
  })
}
```
- **MacOS 与 Linux 下代码：**
```
// Electron 在完成初始化，并准备创建浏览器窗口时，
// 会调用这个方法。
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow()
})

// 处理协议 在本例中，我们选择显示一个错误提示对话框。
app.on('open-url', (event, url) => {
  dialog.showErrorBox('欢迎回来', `导向自: ${url}`)
})
```

<br>

最后，我们还需要处理应用的关闭事件。

<br>

```
// 在除 MacOS 的其他平台上，当所有窗口关闭后，退出当前应用。 在 MacOS 上，
// 应用及其菜单栏通常会保持活跃状态，
// 直到用户明确按下 Cmd + Q 退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
```

## 重要提醒：

#### 打包​

在 macOS 和 Linux 上，此功能仅在应用打包后才有效。 在命令行启动的开发版中无效。 当您打包应用程序时，你需要确保应用程序的 macOS `Info.plist` 和 Linux `.desktop` 文件已更新以包含新的协议处理程序。 一些绑定和分发应用程序的 Electron 工具会自动为你处理

- (**Electron Forge**)[https://electronforge.io/]
如果您使用 Electron Forge，请调整 macOS 支持的 `packagerConfig` ，以及适当调整 Linux 制造商的 Linux 支持配置，在 (Forge 配置)[https://www.electronforge.io/configuration] (请注意以下示例仅显示添加配置时所需更改的最低值) ：
<br>
```
{
  "config": {
    "forge": {
      "packagerConfig": {
        "protocols": [
          {
            "name": "Electron Fiddle",
            "schemes": ["electron-fiddle"]
          }
        ]
      },
      "makers": [
        {
          "name": "@electron-forge/maker-deb",
          "config": {
            "mimeType": ["x-scheme-handler/electron-fiddle"]
          }
        }
      ]
    }
  }
}
```
- (**Electron Packager​**)[https://github.com/electron/electron-packager]
对于 macOS 支持：
<br>
如果您正在使用 Electron Packager 的 API，添加对协议处理程序的支持类似于 Electron Forge 的处理方式， 其他 `protocols` 是传递到 `packager` 函数的 Packager 选项的一部分。
<br>
```
const packager = require('electron-packager')

packager({
  // ...other options...
  protocols: [
    {
      name: 'Electron Fiddle',
      schemes: ['electron-fiddle']
    }
  ]

}).then(paths => console.log(`SUCCESS: Created ${paths.join(', ')}`))
  .catch(err => console.error(`ERROR: ${err.message}`))
```
<br>
如果您使用 Electron Packager 的 CLI，请使用 `--protocol` 和 `--protocol-name` 标志。 例如:
<br>
```
npx electron-packager . --protocol=electron-fiddle --protocol-name="Electron Fiddle"
```

## 结论​

启动 Electron 应用后，在浏览器内键入包含该自定义协议的 URL，如 "`electron-fiddle://open`" ，观察应用是否正确响应并显示一个错误提示对话框。

<br>

查看 `apps/00002/00006/`

```
npm start -- -p apps/00002/00006/main.js
```

<br>