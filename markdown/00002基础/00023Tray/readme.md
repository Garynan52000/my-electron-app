# Tray

## 概览

当前指南将带领你创建 (Tray 图标)[https://www.electronjs.org/docs/api/tray], 并且其拥有系统通知区域的独立上下文菜单

<br>

在 MacOS 和 Ubuntu, 托盘将位于屏幕右上角上，靠近你的电池和wifi 图标。 在 Windows 上，托盘通常位于右下角。

## 示例

#### main.js

首先，我们需要从 `electron` 导入 `app`, `Tray`, `Menu`, `nativeImage`

<br>

```
const { app, Tray, Menu, nativeImage } = require('electron')
```

<br>

下一步我们将创建托盘。 要做到这一点，我们将使用一个 `NativeImage` 图标， 可以通过其中任一方法创建 (methods)[https://www.electronjs.org/docs/api/native-image#methods] 。请注意，我们将托盘创建代码包装在一个 (`app.whenReady`)[https://www.electronjs.org/docs/api/app#appwhenready] ，因为我们需要等待 electron 应用完成初始化

<br>

```
# main.js

let tray

app.whenReady().then(() => {
  const icon = nativeImage.createFromPath('path/to/asset.png')
  tray = new Tray(icon)

  // 注意: 你的 contextMenu, Tooltip 和 Title 代码需要写在这里!
})
```

<br>

太好了！ 现在我们可以开始将上下文菜单附加到我们的托盘上，就像这样：

<br>

```
const contextMenu = Menu.buildFromTemplate([
  { label: 'Item1', type: 'radio' },
  { label: 'Item2', type: 'radio' },
  { label: 'Item3', type: 'radio', checked: true },
  { label: 'Item4', type: 'radio' }
])

tray.setContextMenu(contextMenu)
```

<br>

上面的代码将在上下文菜单中创建4个单独的 radio-type 单选类型项。 要阅读更多关于构建原生菜单的信息，请点击 (这里)[https://www.electronjs.org/docs/api/menu#menubuildfromtemplatetemplate]

<br>

最后，让我们给我们的托盘一个工具提示和标题。

```
tray.setToolTip('This is my application')
tray.setTitle('This is my title')
```

## 结论

在启动应用后，你应该看到屏幕的顶部或底部右侧的托盘， 具体位置取决于操作系统。 `fiddle docs/latest/fiddles/native-ui/tray`