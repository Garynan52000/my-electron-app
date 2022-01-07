# 通知（Notifications）

## 概览

这三个操作系统都为应用程序向用户发送通知提供了手段。 在主进程和渲染进程中，显示通知的技术不同的。

<br>

对于渲染进程，Electron 方便地允许开发者使用 (HTML5 通知 API)[https://notifications.spec.whatwg.org/] 发送通知，然后使用当前运行中的系统的原生通知 API 来进行显示。

<br>

要在主进程中显示通知，您需要使用 (Notification)[https://www.electronjs.org/zh/docs/latest/api/notification] 模块。

## 示例

#### 在渲染进程中显示通知​

从 (Quick Start Guide)[https://www.electronjs.org/zh/docs/latest/tutorial/quick-start] 示例的应用程序开始，将以下行添加到 index.html 文件：

<br>

查看 `apps/00002/00012/00001/`

```
npm start -- -p apps/00002/00012/00001/main.js
```

<br>

#### 在主进程中显示通知

从 (Quick Start Guide)[https://www.electronjs.org/zh/docs/latest/tutorial/quick-start] 中的应用开始，将以下内容更新到 main.js。

<br>

查看 `apps/00002/00012/00002/`

```
npm start -- -p apps/00002/00012/00002/main.js
```

<br>

## 附加信息

虽然操作系统的代码和用户体验相似，但依然存在微妙的差异。

#### Windows

- 在 Windows 10 上，您的应用程序的快捷方式必须安装到启动菜单中，包含一个 (Application User Model ID)[https://msdn.microsoft.com/en-us/library/windows/desktop/dd378459(v=vs.85).aspx]。 这在开发过程中可能有点矫枉过正, `node_modules\electron\dist\electron.exe` 添加到您的“开始”菜单也可以解决问题。导航到资源管理器中的文件，右键单击并“固定到开始菜单”。 然后您需要添加 `app.setAppUserModelId(process.execPath)` 到主进程才能看到通知。
- 在 Windows 8.1 和 Windows 8 上，带有 (应用程序用户模型ID（Application User Model ID）)[https://msdn.microsoft.com/en-us/library/windows/desktop/dd378459(v=vs.85).aspx] 的应用程序快捷方式必须被添加到开始屏幕上。 但是请注意，它不需要被固定到开始屏幕。
- 在 Windows 7 上, 通知通过视觉上类似于较新系统原生的一个自定义的实现来工作。

<br>

Electron尝试将应用程序用户模型 ID 的相关工作自动化。 Electron在和安装和更新框架 Squirrel 协同使用的时候，**快捷方式将被自动正确的配置好。** 更棒的是，Electron 会自动检测 Squirrel 的存在，并且使用正确的值来自动调用 `app.setAppUserModelId()`。 在开发的过程中, 你可能需要自己调用 (`app.setAppUserModelld()`)[https://www.electronjs.org/zh/docs/latest/api/app#appsetappusermodelidid-windows]

<br>

此外，在Windows 8中，通知正文的最大长度为250个字符，Windows团队建议将通知保留为200个字符。 然而，Windows 10中已经删除了这个限制，但是Windows团队要求开发人员合理使用。 尝试将大量文本发送到API(数千个字符) 可能会导致不稳定。

###### 高级通知

Windows 的更高版本允许高级通知，自定义模板，图像和其他灵活元素。 要发送这些通知(来自主进程或渲染器进程)，请使用用户区模块 (electron-windows-notifications)[https://github.com/felixrieseberg/electron-windows-notifications] 来用原生节点附件发送 `ToastNotification` 和 `TileNotification` 对象。

<br>

当包括按钮在内的通知使用 `electron-windows-notifications` 时，处理回复需要使用 (`electron-windows-interactive-notifications`)[https://github.com/felixrieseberg/electron-windows-interactive-notifications] 帮助注册所需的 COM 组件并调用您的 Electron 应用程序和输入的用户数据。

<br>

**免打扰模式 / 演示模式**

<br>

如果要检测是否允许发送通知，请使用 (electron-notification-state)[https://github.com/felixrieseberg/electron-notification-state] 模块。这样，您可以提前确定 Windows 是否会将通知忽略。

#### macOS

MacOS上的通知是最直接的，但你应该注意(苹果关于通知的人机接口指南（Apple's Human Interface guidelines regarding notifications）)[https://developer.apple.com/macos/human-interface-guidelines/system-capabilities/notifications/].

<br>

请注意，通知的大小限制为256个字节，如果超过该限制，则会被截断。

**勿扰 / 会话状态**

要检测是否允许发送通知，请使用用户区模块 (electron-notification-state)[https://github.com/felixrieseberg/electron-notification-state]。这样可以提前检测是否显示通知。

#### Linux

通知是通过 `libnotify` 发送的，libnotify可以在任何实现了(桌面通知规范（Desktop Notifications Specification）)[https://developer.gnome.org/notification-spec/]的桌面环境中发送通知，包括Cinnamon、Enlightenment、Unity、GNOME、KDE
