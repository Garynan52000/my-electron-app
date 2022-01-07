# 更新应用程序

有多种方法可以更新Electron应用. 最简单并且获得官方支持的方法是利用内置的 (Squirrel 框架)[https://github.com/Squirrel] 和Electron的 (autoUpdater)[https://www.electronjs.org/zh/docs/latest/api/auto-updater] 模块。

## 使用 `update.electronjs.org`

Electron 团队维护 (update.electronjs.org)[https://github.com/electron/update.electronjs.org]，一个免费开源的网络服务，可以让 Electron 应用使用自动更新。 这个服务是设计给那些满足以下标准的 Electron 应用：

<br>

- 应用运行在 macOS 或者 Windows
- 应用有公开的 GitHub 仓库
- 编译的版本发布在 GitHub Releases
- 编译的版本已代码签名

<br>

使用这个服务最简单的方法是安装 (update-electron-app)[https://github.com/electron/update-electron-app]，一个预配置好的 Node.js 模块来使用 update.electronjs.org。

<br>

安装模块

<br>

```
npm install update-electron-app
```

<br>

从你的应用的 main process 文件调用这个更新：

<br>

```
require('update-electron-app')()
```

<br>

默认情况下，这个模块会在应用启动的时候检查更新，然后每隔十分钟再检查一次。 当发现了一个更新，它会自动在后台下载。 当下载完成后，会显示一个对话框以允许用户重启应用。

<br>

如果你需要定制化你的配置，你可以 (将配置设置传递给 `update-electron-app`)[https://github.com/electron/update-electron-app] 或者 (直接使用更新服务)[https://github.com/electron/update.electronjs.org]。
