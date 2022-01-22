# Mac App Store 应用程序提交指南

本指南提供以下相关资讯：

- 如何在 macOS 上为 Electron 应用签名；
- 如何在 Mac App Store (MAS) 上提交 Electron 应用；
- 对于 MAS 构建版本的局限性。

## 要求

要为 Electron 应用签名，则必须首先安装下列应用：

- Xcode 11 或更高版本。
- (electron-osx-sign)[https://github.com/electron/electron-osx-sign] npm 模块.
- 您还必须注册一个苹果开发者帐户，并加入 (苹果开发者计划)[https://developer.apple.com/support/compare-memberships/]。

#### 为 Electron 应用签名

Electron应用可以通过 Mac 应用商店或其外部进行发布。 每种方式都需要不同的签名和测试方法。 本指南侧重于通过 Mac 应用商店进行发布，也会提及其他方法。

<br>

以下步骤描述了如何从 Apple 获得证书，如何对Electron应用程序进行签名以及如何测试它们。

###### 获取证书

获得签名证书的最简单方法是使用 Xcode：

<br>

- 打开Xcode并打开“帐户”首选项；
- 使用您的 Apple 帐户登录;
- 选择一个团队并单击"管理证书";
- 在签名证书表的左下角，单击添加按钮 (+)，并添加以下证书：
    - "Apple Development"
    - "Apple Distribution"

<br>

“Apple Development”证书用于在Apple Developer网站上注册的计算机上签署用于开发和测试的应用程序。 注册方法会在(准备配置文件)[https://www.electronjs.org/zh/docs/latest/tutorial/mac-app-store-submission-guide#prepare-provisioning-profile]中描述。

<br>

带有"Apple Development"证书签名的应用无法提交到Mac 应用商店。 为此，应用程序必须使用"Apple Distribution"证书进行签名。 但请注意，使用"Apple Distribution"证书签名的应用程序不能直接运行，它们必须由 Apple 重新签名才能运行，也就是只有从 Mac 应用商店下载后才能运行。

###### 其它证书

您可以注意到还有其他类型的证书。

<br>

"Developer ID Application"证书用于将应用发布到Mac 应用商店以外的地方之前签名。

<br>

"Deceloper ID Installer"和"Mac Installer Distribution"证书用于签署 Mac 安装程序包，而不是应用程序本身。 大多数Electron应用不使用Mac Installer Package，因此通常不需要它们。

<br>

完整的证书类型列表可以在(这里)[https://help.apple.com/xcode/mac/current/#/dev80c6204ec]找到。

<br>

使用 "Apple Development" 和 "Apple Distribution" 证书签名的应用程序只能在 (App Sandbox)[https://developer.apple.com/app-sandboxing/] 下运行， 所以他们必须使用Electron 的 MAS 构建。 然而，“Developer ID Application”证书没有这个限制，因此，用其签名的应用既可以使用普通构建也可以使用 Electron 的 MAS 构建。

###### 传统证书名称

Apple在过去几年中一直在更改证书的名称，您可能会在阅读旧文档时遇到这些证书，并且一些工具仍然在使用旧名称。

<br>

- “Apple Distribution”证书也叫做“3rd Party Mac Developer Application”和“Mac App Distribution”。
- “Apple Development”证书也叫做“Mac Developer”和“Development”。

#### 准备配置配置文件

如果您想在将应用提交给Mac App Store之前在本地机器上测试您的应用， 您必须使用"Apple Development"证书签名该应用，并在程序包中嵌入配置文件。

<br>

要 (创建一个配置文件)[https://help.apple.com/developer-account/#/devf2eb157f8]，您可以按照以下步骤：

<br>

- 在 (Apple Developer)[https://developer.apple.com/account] 网站上打开"证书、标识符 & 配置文件"页面。
- 在“标识符”页面为您的应用添加一个新的App ID。
- 在"设备"页面中注册本地计算机。 您可以在"系统信息"应用的"硬件"页面中找到机器的"设备 ID"。
- 在“Profiles”页面注册一个新的配置文件，然后下载到 `/path/to/yourapp.provisionfile`。

#### 启用Apple的应用沙箱

提交到 Mac App Store 的应用程序必须在 (Apple App Sandbox)[https://developer.apple.com/app-sandboxing/] 下运行， 并且只有Electron的 MAS 构建可以使用App Sandbox 运行。 在 App Sandbox 下运行时，Electron 的标准 darwin 构建将无法启动。

<br>

使用 `electron-osx-signe` 签名时，它将会自动将必要的权限添加到您应用的所需权利中， 但如果您正在使用自定义所需权利，您必须确保App Sandbox capacity已经添加：

<br>

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.app-sandbox</key>
    <true/>
  </dict>
</plist>
```

#### 不使用 electron-osx-sign的额外步骤​

如果您的应用没有使用 `electron-osx-sign` 进行签名，您必须确保应用包的权限至少有以下键：

<br>

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.app-sandbox</key>
    <true/>
    <key>com.apple.security.application-groups</key>
    <array>
      <string>TEAM_ID.your.bundle.id</string>
    </array>
  </dict>
</plist>
```

<br>

`TEAM_ID` 应替换为 Apple 开发者帐户的Team ID，`your.bundle.id` 应替换为应用的App ID。

<br>

以下权限必须添加到应用程序包的二进制程序和助手中：

<br>

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.app-sandbox</key>
    <true/>
    <key>com.apple.security.inherit</key>
    <true/>
  </dict>
</plist>
```

<br>

应用程序包的 `Info.plist` 必须包含 `ElectronTeamID` 键，其值为你的 Apple 开发者团队ID：

<br>

```
<plist version="1.0">
<dict>
  ...
  <key>ElectronTeamID</key>
  <string>TEAM_ID</string>
</dict>
</plist>
```

<br>

当使用 `electron-osx-sign` 时， `ElectronTeamID` 键将通过从证书名称提取团队 ID 自动添加。 如果`electron-osx-sign` 找不到正确的团队 ID，则可能需要你手动添加此键 。

#### Sign apps for development

要对可以在您的开发机器上运行的应用程序进行签名，您必须使用“Apple Development”证书对其进行签名，并将配置文件传递给 `electron-osx-sign`。

<br>

```
electron-osx-sign YourApp.app --identity='Apple Development' --provisioning-profile=/path/to/yourapp.provisionprofile
```

<br>

如果您在没有 `electron-osx-sign` 的情况下进行签名，则必须将配置文件放置到 `YourApp.app/Contents/embedded.provisionprofile`

<br>

签名的应用程序只能在通过配置文件注册的机器上运行，这是在提交到 Mac App Store 之前测试签名的应用程序的唯一方法。

#### Sign apps for submitting to the Mac App Store​

要对将提交到 Mac App Store 的应用程序进行签名，您必须使用“Apple Distribution”证书对其进行签名。 请注意，使用此证书签名的应用程序将无法在任何地方运行，除非它是从 Mac App Store 下载的。

<br>

```
electron-osx-sign YourApp.app --identity='Apple Distribution'
```

#### Sign apps for distribution outside the Mac App Store

如果您不打算将应用程序提交到 Mac App Store，您可以签署 “Developer ID Application” 证书。 这样对 App Sandbox 没有要求，如果你不使用 App Sandbox，你应该使用 Electron 的普通 darwin 构建。

<br>

```
electron-osx-sign YourApp.app --identity='Developer ID Application' --no-gatekeeper-assess
```

<br>

通过 `--no-gatekeeper-assess`，`electron-osx-sign` 将跳过 macOS GateKeeper 检查，因为您的应用程序通常尚未通过此步骤进行公证。

<br>

本指南不涉及 (App Notarization)[https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution]，但您可能希望这样做，否则 Apple 可能会阻止用户在 Mac App Store 之外使用您的应用程序。

#### Submit Apps to the Mac App Store

使用“Apple Distribution”证书签署应用程序后，您可以继续将其提交到 Mac App Store。

<br>

但是，本指南并不能确保您的应用会获得 Apple 的批准； 您仍然需要阅读 Apple 的(提交您的应用程序指南)[https://developer.apple.com/library/mac/documentation/IDEs/Conceptual/AppDistributionGuide/SubmittingYourApp/SubmittingYourApp.html]，了解如何满足 Mac App Store 的要求。

###### Upload

应用程序加载器应用于将签名的应用程序上传到 iTunes Connect 进行处理，请确保您在上传之前已(创建记录)[https://developer.apple.com/library/ios/documentation/LanguagesUtilities/Conceptual/iTunesConnect_Guide/Chapters/CreatingiTunesConnectRecord.html]。

<br>

如果您看到类似私有 API 使用的错误，您应该检查应用程序是否使用了 Electron 的 MAS 构建。

#### Submit for review

上传后，您应该提(交您的应用以供审核。)[https://developer.apple.com/library/ios/documentation/LanguagesUtilities/Conceptual/iTunesConnect_Guide/Chapters/SubmittingTheApp.html]

## MAS 构建限制

为了让你的应用满足沙箱的所有条件，在 MAS 构建的时候，下面的模块已被禁用：

<br>

- `crashReporter`
- `autoUpdater`

<br>

并且下面的行为也改变了

<br>

- 一些视频采集功能无效。
- 某些辅助功能无法访问。
- 应用无法检测 DNS 变化。

<br>

此外，由于应用沙盒的使用，应用程序可以访问的资源受到严格限制；您可以阅读 (应用沙盒)[https://developer.apple.com/app-sandboxing/] ，了解更多信息。

#### 附加权利

根据您的应用使用的 Electron API，您可能需要在应用的权利文件中添加额外的权利。 否则，App Sandbox 可能会阻止您使用它们。

###### Network access

启用传出的网络连接，允许你的应用程序连接到服务器：

<br>

```
<key>com.apple.security.network.client</key>
<true/>
```

<br>

启用传入的网络连接，让你的应用程序打开网络 socket 监听：

<br>

```
<key>com.apple.security.network.server</key>
<true/>
```

<br>

有关更多 详细信息，请参阅(启用网络访问文档)[https://developer.apple.com/library/ios/documentation/Miscellaneous/Reference/EntitlementKeyReference/Chapters/EnablingAppSandbox.html#//apple_ref/doc/uid/TP40011195-CH4-SW9]。

###### dialog.showOpenDialog

```
<key>com.apple.security.files.user-selected.read-only</key>
<true/>
```

<br>

有关更多详细信息，请参阅("启用访问用户选择的文件"文档)[https://developer.apple.com/library/mac/documentation/Miscellaneous/Reference/EntitlementKeyReference/Chapters/EnablingAppSandbox.html#//apple_ref/doc/uid/TP40011195-CH4-SW6]。

## Electron 使用的加密算法

根据你发布应用所在的国家或地区，你可能需要提供您软件使用的加密算法的信息。 更多信息，请参阅 (加密导出合规性文档)[https://help.apple.com/app-store-connect/#/devc3f64248f] 。

<br>

- AES - (NIST SP 800-38A)[https://csrc.nist.gov/publications/nistpubs/800-38a/sp800-38a.pdf], (NIST SP 800-38D)[https://csrc.nist.gov/publications/nistpubs/800-38D/SP-800-38D.pdf], (RFC 3394)[https://www.ietf.org/rfc/rfc3394.txt]
- HMAC - (FIPS 198-1)[https://csrc.nist.gov/publications/fips/fips198-1/FIPS-198-1_final.pdf]
- ECDSA - ANS X9.62–2005
- ECDH - ANS X9.63–2001
- HKDF - (NIST SP 800-56C)[https://csrc.nist.gov/publications/nistpubs/800-56C/SP-800-56C.pdf]
- PBKDF2 - (RFC 2898)[https://tools.ietf.org/html/rfc2898]
- RSA - (RFC 3447)[https://www.ietf.org/rfc/rfc3447]
- SHA - (FIPS 180-4)[https://csrc.nist.gov/publications/fips/fips180-4/fips-180-4.pdf]
- Blowfish - (https://www.schneier.com/cryptography/blowfish/)[https://www.schneier.com/cryptography/blowfish/]
- CAST - (RFC 2144)[https://tools.ietf.org/html/rfc2144], (RFC 2612)[https://tools.ietf.org/html/rfc2612]
- DES - (FIPS 46-3)[https://csrc.nist.gov/publications/fips/fips46-3/fips46-3.pdf]
- DH - (RFC 2631)[https://tools.ietf.org/html/rfc2631]
- DSA - (ANSI X9.30)[https://webstore.ansi.org/RecordDetail.aspx?sku=ANSI+X9.30-1%3A1997]
- EC - (SEC 1)[https://www.secg.org/sec1-v2.pdf]
- IDEA - "On the Design and Security of Block Ciphers" book by X. Lai
- MD2 - (RFC 1319)[https://tools.ietf.org/html/rfc1319]
- MD4 - (RFC 6150)[https://tools.ietf.org/html/rfc6150]
- MD5 - (RFC 1321)[https://tools.ietf.org/html/rfc1321]
- MDC2 - (ISO/IEC 10118-2)[https://wiki.openssl.org/index.php/Manual:Mdc2(3)]
- RC2 - (RFC 2268)[https://tools.ietf.org/html/rfc2268]
- RC4 - (RFC 4345)[https://tools.ietf.org/html/rfc4345]
- RC5 - (https://people.csail.mit.edu/rivest/Rivest-rc5rev.pdf)[https://people.csail.mit.edu/rivest/Rivest-rc5rev.pdf]
- RIPEMD - (ISO/IEC 10118-3)[https://webstore.ansi.org/RecordDetail.aspx?sku=ISO%2FIEC%2010118-3:2004]