# 键盘快捷键

## 概览

该功能允许你为 Electron 应用程序配置应用和全局键盘快捷键。

## 示例

#### 本地快捷键

应用键盘快捷键仅在应用程序被聚焦时触发。 为了配置本地快捷键，你需要在创建 (Menu)[https://www.electronjs.org/zh/docs/latest/api/menu-item] 模块中的 (MenuItem)[https://www.electronjs.org/zh/docs/latest/api/menu] 时指定 (accelerator)[https://www.electronjs.org/zh/docs/latest/api/accelerator] 属性。
<br>

<br>

查看 `apps/00002/00004`

```
npm start -- -p apps/00002/00004/00001/main.js
```

<br>

> 注：在上面的代码中， `CommandOrControl` 意指在 macOS 上使用 `Command` ，在 Windows/Linux 上使用 `Control` 。

<br>

启动应用后，如果你按下定义好的全局快捷键，你将在启动的 Electron 应用控制台里面看到对应的日志输出