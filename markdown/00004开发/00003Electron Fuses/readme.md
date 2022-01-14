# Electron Fuses

> 打包时间功能切换

## What are fuses?

对于 Electron 功能的子集，禁用整个应用程序的某些功能是有意义的。例如，99% 的应用程序不使用 `ELECTRON_RUN_AS_NODE`，这些应用程序希望能够发布无法使用该功能的二进制文件。我们也不希望 Electron 消费者从源代码构建 Electron，因为这既是一项巨大的技术挑战，又需要高昂的时间和金钱成本。

<br>

Fuses 保险丝 是这个问题的解决方案，在高层次上，它们是电子二进制文件中的 "magic bits"，可以在打包 Electron 应用程序时翻转，以 启用/禁用 某些 功能/限制。因为它们在您对应用程序进行代码签名之前在打包时被翻转，所以操作系统负责确保这些位不会通过操作系统级别的代码签名验证（Gatekeeper / App Locker）被翻转。

## 我如何翻转保险丝？

## 简易方式

我们制作了一个方便的模块 `@electron/fuses` 来轻松翻转这些保险丝。查看该模块的 README 以获取有关使用和潜在错误情况的更多详细信息。

<br>

```
require('@electron/fuses').flipFuses(
  // Path to electron
  require('electron'),
  // Fuses to flip
  {
    runAsNode: false
  }
)
```

<br>

## 复杂方式

#### 快速词汇表

- **Fuse Wire:** Electron 二进制文件中用于控制熔断器的字节序列
- **Sentinel:** 可用于定位保险丝的静态已知字节序列
- **Fuse Schema:** 保险丝的 格式/允许值

<br>

手动翻转保险丝需要编辑 Electron 二进制文件并将保险丝线修改为代表所需保险丝状态的字节序列。

<br>

在 Electron 二进制文件中的某个地方会有一个如下所示的字节序列：

<br>

```
| ...binary | sentinel_bytes | fuse_version | fuse_wire_length | fuse_wire | ...binary |
```

<br>

- `sentinel_bytes` 始终是这个确切的字符串 `dL7pKGdnNz796PbbjQWNKmHXBZaB9tsX`
- `fuse_version` 是一个单字节，其无符号整数值表示熔断模式的版本
- `fuse_wire_length` 是一个单字节，其无符号整数值表示后面的熔丝线中的熔丝数量
- `fuse_wire` 是 N 个字节的序列，每个字节代表一个单独的熔断器及其状态
    - "0" (0x30) 表示保险丝被禁用
    - "1" (0x31) 表示保险丝已启用
    - "r" (0x72) 表示保险丝已被移除，将字节更改为 1 或 0 将无效。

<br>

要翻转保险丝，您可以在保险丝中找到它的位置，然后根据您想要的状态将其更改为 “0” 或 “1”。您可以在 (这里)[https://github.com/electron/electron/blob/main/build/fuses/fuses.json5] 查看当前schema。