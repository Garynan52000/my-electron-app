# Dark Mode

## 概览

#### 自动更新原生界面

"本地界面"包括文件选择器、窗口边框、对话框、上下文 菜单等 - 任何UI来自操作系统而非应用的界面。 默认行为是从操作系统选择自动主题。


#### 自动更新您自己的界面

如果您的应用有自己的黑暗模式，您应该在与系统黑暗模式设置同步时切换。 您可以通过使用 **prefer-color-scheme** CSS 媒体查询来做到这一点。

#### 手动更新您自己的界面

如果你想手动切换 light/dark 模式，你可以在 `nativeTheme` 模块得 (`themeSource`)[https://www.electronjs.org/zh/docs/latest/api/native-theme#nativethemethemesource]属性上设置想要得模式。这个属性得值会被传递到你得渲染进程。同时任何与 `prefers-color-scheme` 相关得 CSS rules 将会因此被更新。 

#### macOS 设置

在 macOS 10.14 Mojave中， Apple 为所有 macOS 电脑引入了一个全新的 (系统级黑暗模式)[https://developer.apple.com/design/human-interface-guidelines/macos/visual-design/dark-mode/]。 如果您的 Electron 应用具有深色模式，您可以 使用"本机 api" (应用)[https://www.electronjs.org/zh/docs/latest/api/native-theme]。

<br>

In macOS 10.15 Catalina, Apple 为所有 macOS计算机介绍了一个新的 "automatic" dark 模式选项. 为了让API `isDarkMode` 和 `Tray` 在这个模式中正常工作，你需要在 `Info.plist` 文件里把 `NSRequiresAquaSystemAppearance` 设置为 `false` ，或者使用 `>=7.0.0` 的Electron。(Electron Packager)[https://github.com/electron/electron-packager] 和 (Electron Forge)[https://www.electronforge.io/] 都有 (darwinDarkModeSupport option)[https://electron.github.io/electron-packager/main/interfaces/electronpackager.options.html#darwindarkmodesupport] 可以在程序构建的时候自动化 `Info.plist` 的变化。

<br>

如果你想在使用 **Electron > 8.0.0** 的时候进行 opt-out, 你必须将 `Info.plist` 文件中的 `NSRequiresAquaSystemAppearance` 属性设置为 `true`. 请记住 **Electron 8.0.0 及以上** 不会允许你进行主题的 opt-out, 由于 macOS 10.14 SDK 的使用。

