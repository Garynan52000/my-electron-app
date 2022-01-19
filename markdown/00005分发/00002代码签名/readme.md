# 代码签名

代码签名是一种用来证明应用是由你创建的一种安全技术。

<br>

macOS 系统能通过代码签名检测对app的任何修改，包括意外修改和来自恶意代码的修改。

<br>

在Windows系统中，如果程序没有代码签名证书，或者代码签名授信级别较低时，系统同样会将其列为可信程序，只是当用户运行该应用时，系统会显示安全提示。 信任级别随着时间的推移构建，因此最好尽早开始代码签名。

<br>

即使开发者可以发布一个未签名的应用程序，但是我们并不建议这样做。 默认情况下，Windows 和 macOS 都会禁止未签名的应用的下载或运行。 从 macOS Catalina (10.15版本) 开始，用户需要操作很多个步骤来运行一个未签名的应用。

<br>

macOS Catalina Gatekeeper 将直接警告：无法打开应用程序，因为开发者无法验证../images/gatekeeper.png)

<br>

如你所见，用户有两个选择：直接删除应用或者取消运行。 你不会想让用户看见该对话框。

<br>

如果你正在开发一款Electron应用，并打算将其打包发布，那你就应该为其添加代码签名。

## 签名 & 认证 macOS 版本

正确准备 macOS 应用程序的发布需要两个步骤：

<br>

- 首先，应用程序需要签名。
- 然后，应用程序需要上传到苹果，然后才能进行名为“公证”的过程， 自动化系统将会进一步验证您的应用没有做任何事情来危及其用户。

<br>

若要开始，请确保你满足签名要求并认证你的应用：

<br>

- 加入 (Apple Developer Program)[https://developer.apple.com/programs/] (需要缴纳年费)
- 下载并安装 (Xcode)[https://developer.apple.com/xcode] - 这需要一台运行 macOS 的计算机。
- 生成，下载，然后安装(签名证书（signing certificates）)[https://github.com/electron/electron-osx-sign/wiki/1.-Getting-Started#certificates]

<br>

Electron 的生态系统有利于配置和自由，所以有多种方法让您的应用程序签名和公证。

#### electron-forge

如果你正在使用 Electron 最受欢迎的构建工具，创建你的应用程序签名 并经过公证仅需要对配置进行一些添加即可。 (Forge)[https://electronforge.io/] 是官方的 Electron 工具的 集合，在hood下使用 (`electron-packager`)[https://github.com/electron/electron-packager] (electron-osx-sign)[https://github.com/electron-userland/electron-osx-sign] (electron-notarize)[https://github.com/electron/electron-notarize] 。

<br>

让我们来看看所有必需字段的示例配置。 并不是所有都是必需的：工具非常聪明足以自动找到合适的 `identity`, 例如，但我们建议你明白无误。

<br>

```
{
  "name": "my-app",
  "version": "0.0.1",
  "config": {
    "forge": {
      "packagerConfig": {
        "osxSign": {
          "identity": "Developer ID Application: Felix Rieseberg (LT94ZKYDCJ)",
          "hardened-runtime": true,
          "entitlements": "entitlements.plist",
          "entitlements-inherit": "entitlements.plist",
          "signature-flags": "library"
        },
        "osxNotarize": {
          "appleId": "felix@felix.fun",
          "appleIdPassword": "my-apple-id-password",
        }
      }
    }
  }
}
```

<br>

此处引用的 `plist` 文件需要以下的 macOS 特定权限来保证您的应用正在做这些事情的苹果安全机制并不意味着任何伤害：

<br>

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.debugger</key>
    <true/>
  </dict>
</plist>
```

<br>

请注意，直到Electron 12, `com.apple.security.cs.allow-unsigned-executable-memory` 的权限都是必需的。 但是，如果可以避免，则不应再使用它。

<br>

要查看所有这些都在操作中，请查看 Electron Fiddle 的源代码，(尤其是其 `electron-forge` 配置文件)[https://github.com/electron/fiddle/blob/master/forge.config.js]。

<br>

如果您打算在应用中使用 Electron 的 API 访问麦克风或摄像头，您还需要添加以下权限：

```
<key>com.apple.security.device.audio-input</key>
<true/>
<key>com.apple.security.device.camera</key>
<true/>
```   

<br> 当你调用应用权限中没有的东西时, 比如:

```
const { systemPreferences } = require('electron')

const microphone = systemPreferences.askForMediaAccess('microphone')
```

<br>

您的应用可能会崩溃。 在 (Hardened Runtime)[https://developer.apple.com/documentation/security/hardened_runtime] 中查看资源访问部分以获取更多信息和您可能需要的权限。

#### electron-builder

Electron Builder 附带一个自定义解决方案，用于签署应用程序。 你可以在这里找到 (它的文档)[https://www.electron.build/code-signing]

#### electron-packager

如果你没有使用集成的构建工具比如 Forge 或 Builder, 你更倾向于使用 (`electron-packager`)[https://github.com/electron/electron-packager] 的话，可用的有 (electron-osx-sign)[https://github.com/electron-userland/electron-osx-sign] 和 (electron-notarize)[https://github.com/electron/electron-notarize].

<br>

如果您正在使用Packager的 API，您可以通过配置 (来签名并对您的应用程序进行公证)[https://electron.github.io/electron-packager/main/interfaces/electronpackager.options.html]

<br>

```
const packager = require('electron-packager')

packager({
  dir: '/path/to/my/app',
  osxSign: {
    identity: 'Developer ID Application: Felix Rieseberg (LT94ZKYDCJ)',
    'hardened-runtime': true,
    entitlements: 'entitlements.plist',
    'entitlements-inherit': 'entitlements.plist',
    'signature-flags': 'library'
  },
  osxNotarize: {
    appleId: 'felix@felix.fun',
    appleIdPassword: 'my-apple-id-password'
  }
})
```

<br>

此处引用的 `plist` 文件需要以下的 macOS 特定权限来保证您的应用正在做这些事情的苹果安全机制并不意味着任何伤害：

<br>

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.debugger</key>
    <true/>
  </dict>
</plist>
```

<br>

请注意，直到Electron 12, `com.apple.security.cs.allow-unsigned-executable-memory` 的权限都是必需的。 但是，如果可以避免，则不应再使用它。

#### Mac 应用程序商店

详见 (Mac App Store Guide)[https://www.electronjs.org/zh/docs/latest/tutorial/mac-app-store-submission-guide].

## 签署windows应用程序

在签署Windows应用程序前，你需要完成以下事项：

<br>

- 获取一个 Windows 身份验证码签名证书 (需要年度费用)
- 安装 Visual Studio 以获取签名工具 (免费 (社区版)[https://visualstudio.microsoft.com/vs/community/] 已足够)

<br>

您可以从许多经销商获得代码签名证书。 价格各异，所以值得你花点时间去货比三家。 常见经销商包括：

<br>

- (digicert)[https://www.digicert.com/code-signing/microsoft-authenticode.htm]
- (Sectigo)[https://sectigo.com/ssl-certificates-tls/code-signing]
- 除其他外，请货比三家后选择适合你的那一款，Google 是您的朋友😄：

<br>

你可以运用许多方式来签署你的应用：

<br>

- (`electron-winstaller`)[https://github.com/electron/windows-installer] 将生成一个窗口安装程序并为你签名
- (`electron-forge`)[https://github.com/electron-userland/electron-forge] 可以为通过 Squirrel.Windows 或 MSI 方式生成的安装包生成签名
- (`electron-builder`)[https://github.com/electron-userland/electron-builder] 可以为某些 windows 平台产品生成签名

#### Windows 应用商店

参考 (Windows Store Guide)[https://www.electronjs.org/zh/docs/latest/tutorial/windows-store-guide].