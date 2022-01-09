# Windows on ARM

如果您的应用使用Electron 6.0.8及之后的版本，您现在可以在基于ARM的Windows10上构建它。他大大提高了性能，但需要重新编译您的应用程序中使用的任何本机模块。它可能还需要对您的构建和打包脚本进行小的修复。

## 运行基本应用程序

如果您的应用程序不使用任何本机模块，那么创建应用程序的 Arm 版本真的很容易。

<br>

- 确保您的应用程序的 `node_modules` 目录为空。
- 使用命令提示符，在像往常一样运行 `npm install` / `yarn install` 之前运行 `set npm_config_arch=arm64`。
- (如果您安装了 Electron 作为 development dependency)[https://www.electronjs.org/zh/docs/latest/tutorial/quick-start#prerequisites]，npm 将下载并解压 arm64 版本。然后，您可以正常打包和分发您的应用程序。

#### 一般注意事项

###### 特定于架构的代码

许多特定于 Windows 的代码包含在 x64 或 x86 架构之间进行选择的 `if...else` 逻辑。

<br>

```
if (process.arch === 'x64') {
  // Do 64-bit thing...
} else {
  // Do 32-bit thing...
}
```

<br>

如果您想以 arm64 为目标，这样的逻辑通常会选择错误的架构，因此请仔细检查您的应用程序并针对此类情况构建脚本。在自定义构建和打包脚本中，您应该始终检查环境中 `npm_config_arch` 的值，而不是依赖当前的 `process arch`。

###### 原生模块

如果您使用本机模块，则必须确保它们针对 MSVC 编译器的 v142 进行编译（在 Visual Studio 2017 中提供）。您还必须检查 native module 提供或引用的 `.dll` 或 `.lib` 文件是否可用于 Arm 上的 Windows。

###### 测试应用程序

要测试您的应用，请使用运行 Windows 10（版本 1903 或更高版本）的 Windows on Arm 设备。确保将应用程序复制到目标设备 - 从网络位置加载应用程序资产时，Chromium 的沙箱将无法正常工作。

#### 开发先决条件

###### Node.js/node-gyp

(建议使用 Node.js v12.9.0 或更高版本)[https://nodejs.org/en/]。如果不希望更新到新版本的 Node，您可以(手动将 npm 的 node-gyp 副本更新)[https://github.com/nodejs/node-gyp/wiki/Updating-npm's-bundled-node-gyp]到版本 5.0.2 或更高版本，其中包含为 Arm 编译本机模块所需的更改。

###### Visual Studio 2017

交叉编译本机模块需要 Visual Studio 2017（任何版本）。您可以通过 Microsoft 的 (Visual Studio Dev Essentials 程序)[https://visualstudio.microsoft.com/dev-essentials/]下载 Visual Studio Community 2017。安装后，您可以通过从命令提示符运行以下命令来添加特定于 Arm 的组件：

<br>

```
vs_installer.exe ^
--add Microsoft.VisualStudio.Workload.NativeDesktop ^
--add Microsoft.VisualStudio.Component.VC.ATLMFC ^
--add Microsoft.VisualStudio.Component.VC.Tools.ARM64 ^
--add Microsoft.VisualStudio.Component.VC.MFC.ARM64 ^
--includeRecommended
```
<br>

###### 创建 cross-compilation 交叉编译命令提示符

在环境中设置 `npm_config_arch=arm64` 会创建正确的 arm64 `.obj` 文件，但 \(Developer Command Prompt for VS 2017\) VS 2017 的标准开发人员命令提示符 将使用 x64 链接器。要解决这个问题：

<br>

- 将 VS 2017 快捷方式的 x64_x86 交叉工具命令提示符（例如，通过在开始菜单中找到它，右键单击，选择打开文件位置，复制和粘贴）复制到方便的地方。
- 右键单击新的快捷方式并选择属性。
- 将 Target 字段更改为最后读取 `vcvarsamd64_arm64.bat` 而不是 `vcvarsamd64_x86.bat`。

<br>

如果成功完成，命令提示符应在启动时打印类似于此的内容：

<br>

```
**********************************************************************
** Visual Studio 2017 Developer Command Prompt v15.9.15
** Copyright (c) 2017 Microsoft Corporation
**********************************************************************
[vcvarsall.bat] Environment initialized for: 'x64_arm64'
```

<br>

如果您想直接在 Windows on Arm 设备上开发应用程序，请在 Target 中替换 `vcvarsx86_arm64.bat`，以便可以使用设备的 x86 仿真进行交叉编译。

###### 链接到正确的 `node.lib`

默认情况下，`node-gyp` 解压 Electron 的 node 头文件并将 x86 和 x64 版本的 `node.lib` 下载到 `%APPDATA%\..\Local\node-gyp\Cache`，但它不会下载 arm64 版本（(对此的修复正在开发中)[https://github.com/nodejs/node-gyp/pull/1875]。）要解决此问题：

<br>

- 从 (https://electronjs.org/headers/v6.0.9/win-arm64/node.lib)[https://electronjs.org/headers/v6.0.9/win-arm64/node.lib] 下载 arm64 `node.lib`
- 将其移动到 `%APPDATA%\..\Local\node-gyp\Cache\6.0.9\arm64\node.lib`

将 `6.0.9` 替换为您正在使用的版本。

<br>

#### Cross-compiling 原生模块

完成上述所有操作后，打开交叉编译命令提示符并运行 `set npm_config_arch=arm64`。然后像往常一样使用 `npm install` 来构建你的项目。与交叉编译 x86 模块一样，您可能需要删除 `node_modules` 以强制重新编译本机模块，如果它们以前是为另一个架构编译的。

#### 调试本机模块

可以使用 Visual Studio 2017（在您的开发机器上运行）和在目标设备上运行的相应 (Visual Studio 远程调试器)[https://docs.microsoft.com/en-us/visualstudio/debugger/remote-debugging-cpp?view=vs-2019] 来调试本机模块。调试：

<br>

- 在目标设备上通过命令提示符启动 `.exe` 应用(传递 `--inspect-brk` 参数可以在加载任何 native modules 之前暂停应用)。
- 在您的开发计算机上启动 Visual Studio 2017。
- 通过选择 调试 > 访问并输入设备的 IP 地址和 Visual Studio 远程调试器工具显示的端口号，连接到目标设备。
- 单击 Refresh 并选择要 (附加的适当 Electron 进程)[https://www.electronjs.org/zh/docs/latest/development/debug-instructions-windows]。
- 您可能需要确保正确加载应用中本机模块的所有符号。要配置此内容，请进入 Visual Studio 2017Debug > Options...，并在 Debugging > Symbols 下添加包含您的 `.pdb` 符号的文件夹。
- 附加后，设置任何适当的断点并使用 Chrome 的 (Node.js 远程工具)[https://www.electronjs.org/zh/docs/latest/tutorial/debugging-main-process]恢复 JavaScript 执行。

<br>

## 获得额外帮助

如果您在使用本文档时遇到问题，或者如果您的应用程序在为 x86 编译但不能为 arm64 编译时工作，(请在标题中使用“Windows on Arm”提出问题)[https://www.electronjs.org/zh/docs/latest/development/issues]。