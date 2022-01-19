# Node 原生模块

原生 Node.js 模块由Electron支持，但由于Electron具有与给定Node.js不同的 (应用二进制接口 (ABI))[https://en.wikipedia.org/wiki/Application_binary_interface] (由于使用Chromium的 BoringSL 而不是 OpenSSL 等 差异)，您使用的原生 模块需要为Electron重新编译。 否则，当您尝试运行您的应用程序时， 将会遇到以下的错误：

<br>

```
Error: The module '/path/to/native/module.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION $XYZ. This version of Node.js requires
NODE_MODULE_VERSION $ABC. Please try re-compiling or re-installing
the module (for instance, using `npm rebuild` or `npm install`).
```

## 如何安装原生模块

有多种不同的方法来安装原生模块：

#### 为 Electron 安装并重新编译模块

您可以像其他 Node 项目一样安装模块，然后用 (`electron-rebuild`)[https://github.com/electron/electron-rebuild] 包重建这些模块以适配 Electron 。 这个包可以自动识别当前 Electron 版本，为你的应用自动完成下载 headers、重新编译原生模块等步骤。 如果您正在使用 (Electron Forge)[https://electronforge.io/]，这个工具将在开发模式和发布时自动使用。

<br>

例如，要安装独立的 `electron-rebuild` 工具，然后通过命令行使用它重建模块：

<br>

```
npm install --save-dev electron-rebuild

# Every time you run "npm install", run this:
./node_modules/.bin/electron-rebuild

# If you have trouble on Windows, try:
.\node_modules\.bin\electron-rebuild.cmd
```

<br>

有关使用和与其他工具（例如 (Electron Packager)[https://github.com/electron/electron-packager]）集成的更多信息，请参阅项目的自述文件。

#### 通过 npm 安装

只要设置一些系统环境变量，你就可以通过 npm 直接安装原生模块。

<br>

例如，要安装所有Electron的依赖：

<br>

```
# Electron 的版本。
export npm_config_target=1.2.3
# Electron的目标架构, 可用的架构列表请参见
# https://electronjs.org/docs/tutorial/support#supported-platforms
export npm_config_arch=x64
export npm_config_target_arch=x64
# 下载 Electron 的 headers。
export npm_config_disturl=https://electronjs.org/headers
# 告诉 node-pre-gyp 我们是在为 Electron 生成模块。
export npm_config_runtime=electron
# 告诉 node-pre-gyp 从源代码构建模块。
export npm_config_build_from_source=true
# 安装所有依赖，并缓存到 ~/.electron-gyp。
HOME=~/.electron-gyp npm install
```

#### 为 Electron 手动编译

如果你是一个原生模块的开发人员，想在 Electron 中进行测试， 你可能要手动编译 Electron 模块。 你可以 使用 `node-gyp` 直接编译：

<br>

```
cd /path-to-module/
HOME=~/.electron-gyp node-gyp rebuild --target=1.2.3 --arch=x64 --dist-url=https://electronjs.org/headers
```

<br>

- `HOME=~/.electron-gyp` 设置去哪找头文件
- `--target=1.2.3` 设置了 Electron 的版本。
- `--dist-url=...` 设置了 Electron 的 headers 的下载地址。
- `--arch=x64` 设置了该模块为适配64位操作系统而编译。

#### 为Electron的自定义编译手动编译

如果是为一个与公共发行版不匹配的Electron自定义版本编译原生Node模块，需要让`npm`使用你的Electron自定义版本所对应的Node版本。

<br>

```
npm rebuild --nodedir=/path/to/src/out/Default/gen/node_headers
```

## 故障排查​

如果您安装了本机模块并发现它无法正常工作，则需要检查以下内容：

<br>

- 当有疑问时，请先执行 `electron-rebuild`。
- 确保原生模块与Electron应用程序的目标平台和体系结构兼容。
- 确保在该模块的`binding.gyp`中`win_delay_load_hook`没有被设置为`false`。
- 如果升级了 Electron，你通常需要重新编译这些模块。

#### 关于`win_delay_load_hook`的说明

在Windows上，默认情况下，`node-gyp`将原生模块与`node.dll`链接。 然而，在Electron 4.x和更高的版本中，原生模块需要的symbols由`electron.exe`导出，并且没有`node.dll`。为了在 Windows 上加载原生模块，`node-gyp` 安装了一个 (延迟加载钩子)[https://msdn.microsoft.com/en-us/library/z9h1h6ty.aspx]，在加载原生模块时触发，并重定向 `node.dll` 引用以使用加载可执行文件，而不是在库搜索路径中查找 node.dll（这不会出现任何内容）。因此，在 Electron 4.x 及更高版本上，`'win_delay_load_hook': 'true'` 是加载本机模块所必需的。

<br>

如果你得到一个错误，比如 `Module did not self-register`，或者 `The specified procedure could not be found`，这可能意味着你尝试使用的模块没有正确包含延迟加载钩子。如果模块是使用 `node-gyp` 构建的，请确保在 `binding.gyp` 文件中将 `win_delay_load_hook` 变量设置为 `true`，并且不会在任何地方被覆盖。如果模块是使用另一个系统构建的，您需要确保使用安装在主 `.node` 文件中的延迟加载挂钩进行构建。您的 `link.exe` 调用应如下所示：

<br>

```
link.exe /OUT:"foo.node" "...\node.lib" delayimp.lib /DELAYLOAD:node.exe /DLL
    "my_addon.obj" "win_delay_load_hook.obj"
```

<br>

尤其重要的是：

<br>

- 您从 Electron 而不是 Node.js 链接 `node.lib`。如果您链接到错误的 `node.lib`，当您需要 Electron 中的模块时，您将收到加载时错误。
- 您包括标志 `/DELAYLOAD:node.exe`。如果 `node.exe` 链接没有延迟，则延迟加载挂钩将没有机会触发，节点符号将无法正确解析。
- `win_delay_load_hook.obj` 直接链接到最终的 DLL。如果挂钩是在依赖 DLL 中设置的，它不会在正确的时间触发。

<br>

如果您正在实现自己的延迟加载钩子，请参阅 (`node-gyp`)[https://github.com/nodejs/node-gyp/blob/e2401e1395bef1d3c8acec268b42dc5fb71c4a38/src/win_delay_load_hook.cc] 以获取示例。

## 依赖于 `prebuild` 的模块

(`prebuild`)[https://github.com/prebuild/prebuild] 提供了一种方法来发布原生 Node 模块，其中包含用于多个版本的 Node 和 Electron 的预构建二进制文件。

<br>

如果 `prebuild-powered` 模块为 Electron 中的使用提供二进制文件，请确保省略 `--build-from-source` 和 `npm_config_build_from_source` 环境变量，以充分利用预构建的二进制文件。

## 依赖于 `node-pre-gyp` 的模块

(`node-pre-gyp`)[https://github.com/mapbox/node-pre-gyp] 工具提供一种部署原生 Node 预编译二进制模块的方法， 许多流行的模块都是使用它。

<br>

有时这些模块在 Electron 下运行良好，但是当没有可用的 Electron 特定二进制文件时，您需要从源代码构建。因此，建议对这些模块使用 `electron-rebuild`。

<br>

如果您按照 `npm` 方式安装模块，则需要将 `--build-from-source` 传递给 `npm`，或设置 `npm_config_build_from_source` 环境变量。