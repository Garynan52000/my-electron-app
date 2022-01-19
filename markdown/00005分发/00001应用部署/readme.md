# 应用部署

## 概览

要使用 Electron 分发你的应用，需要打包并重命名它。 为此，您可以使用专用工具或手动方法。

## 专用工具

您可以使用以下工具来分发您的应用程序：

<br>

- (electron-forge)[https://github.com/electron-userland/electron-forge]
- (electron-builder)[https://github.com/electron-userland/electron-builder]
- (electron-packager)[https://github.com/electron/electron-packager]

<br>

这些工具将自动进行所有的步骤，例如，打包您的应用程序，重组可执行文件，并设置正确的图标。

<br>

您可以查看 (快速上手指南)[https://www.electronjs.org/zh/docs/latest/tutorial/quick-start#package-and-distribute-your-application] 中如何用 `electron-forge` 打包您的应用程序的例子。

## 手动发布

#### 使用预构建可执行文件​

为了使用 Electron 部署你的应用程序，你需要下载 Electron 的 (prebuilt binaries)[https://github.com/electron/electron/releases]。 接下来，你存放应用程序的文件夹需要叫做 `app` 并且需要放在 Electron 的 资源文件夹Resources下，如下面的示例所示。

> 请注意: 在下面的示例中，Electron 的预构建可执行文件的位置用 `electron/` 表示。

<br>

在 macOS 中:

<br>

```
electron/Electron.app/Contents/Resources/app/
├── package.json
├── main.js
└── index.html
```

<br>

在 Windows 和 Linux 中:

<br>

```
electron/resources/app
├── package.json
├── main.js
└── index.html
```

<br>

然后在 macOS上执行 `Electron.app` ，在 Linux 上执行 `electron` 或 在 Windows上执行 `electron.exe`, 随后 Electron 将作为你的应用启动。 然后， `electron` 目录将作为您的分发产品交付给用户。

#### 应用程序源代码存档​

如果你没有使用 Parcel 或 Webpack 之类的构建工具，为了减轻拷贝源文件的分发压力，你可以把你的 app 打包成一个 (asar)[https://github.com/electron/asar] 包来提升文件在 Windows 等平台上的可读性.

<br>

为了使用一个 `asar` 档案文件代替 `app` 文件夹，你需要修改这个档案文件的名字为 `app.asar` ， 然后将其放到 Electron 的资源文件夹下，然后 Electron 就会试图读取这个档案文件并从中启动。 如下所示：

<br>

在 macOS 中:

<br>

```
electron/Electron.app/Contents/Resources/
└── app.asar
```

<br>

在 Windows 和 Linux 中:

```
electron/resources/
└── app.asar
```

<br>

你可以在 (`electron/asar` 存储库)[https://github.com/electron/asar] 中找到有关如何使用 asar 的更多详细信息。

#### 使用下载好的可执行文件进行重新定制

将您的应用程序捆绑到Electron后，您可能需要在把应用分发给用户前将Electron进行重新定制

###### macOS

你可以将 `Electron.app` 重命名为任意你喜欢的名字，然后你也需要将一些文件中的 `CFBundleDisplayName`， `CFBundleIdentifier` 以及 `CFBundleName` 字段一并修改掉。 这些文件如下：

<br>

- `Electron.app/Contents/Info.plist`
- `Electron.app/Contents/Frameworks/Electron Helper.app/Contents/Info.plist`

<br>

你也可以重命名帮助程序以避免它在系统活动监视器中显示为 `Electron Helper`， 但是请确保你已经修改了帮助应用的可执行文件的名字。

<br>

一个重命名后的应用程序的结构可能是这样的

<br>

```
MyApp.app/Contents
├── Info.plist
├── MacOS/
│   └── MyApp
└── Frameworks/
    └── MyApp Helper.app
        ├── Info.plist
        └── MacOS/
            └── MyApp Helper
```

###### Windows​

你可以将 `electron.exe` 重命名为任何你喜欢的名字，然后可以使用像 (rcedit)[https://github.com/electron/rcedit] 那样的工具编辑它的 icon 和其他信息。

###### Linux​

你可以将 `electron` 重命名为任意你喜欢的名字。

#### 通过重新构建 Electron 源文件来定制​

你也可以通过改变产品名称后从源码构建来重塑Electron的形象。 你只需要在 `args.gn` 文件中将构建参数设置为对应产品的名称(`electron_product_name = "YourProductName"`)，并进行重新构建。