# 上下文隔离

## 上下文隔离是什么？

上下文隔离功能将确保您的 `预加载脚本` 和 `Electron的内部逻辑` 运行在所加载的 (`webcontent网页`)[https://www.electronjs.org/zh/docs/latest/api/web-contents] 之外的另一个独立的上下文环境里。 这对安全性很重要，因为它有助于阻止网站访问 Electron 的内部组件 和 您的预加载脚本可访问的高等级权限的API 。

<br>

这意味着，实际上，您的预加载脚本访问的 `window` 对象**并不是网站所能访问的对象**。 例如，如果您在预加载脚本中设置` window.hello = 'wave '` 并且启用了上下文隔离，当网站尝试访问 `window.hello` 对象时将返回 `undefined`。

<br>

自 Electron 12 以来，默认情况下已启用上下文隔离，并且它是 所有应用程序推荐的安全设置。

## 迁移

> 在没有上下文隔离的情况下，我曾经使用 `window.X = apiObject` 从我的预加载脚本中提供 API。怎么办？

#### 之前： 上下文隔离禁用

在渲染器进程中将预加载脚本中的 API 暴露给加载的网站是一个常见的用例。禁用上下文隔离后，您的预加载脚本将与渲染器共享一个通用的全局 `window` 对象。然后，您可以将任意属性附加到预加载脚本：

<br>

```
# preload.js

// 上下文隔离禁用的情况下使用预加载
window.myAPI = {
  doAThing: () => {}
}
```

<br>

```
# renderer.js

// 在渲染器中使用开放的 API
window.myAPI.doAThing()
```

<br>

然后可以在渲染器进程中直接使用 doAThing() 函数：

#### 之后：启用上下文隔离

Electron 中有一个专门的模块可以帮助您轻松地完成此操作。 (`contextBridge`)[https://www.electronjs.org/zh/docs/latest/api/context-bridge] 模块可用于安全地将 API 从预加载脚本的隔离上下文公开到网站运行的上下文。API 还可以像以前一样，从 `window.myAPI` 网站上访问。

<br>

```
# preload.js

// 在上下文隔离启用的情况下使用预加载
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
  doAThing: () => {}
})
```

<br>

```
# renderer.js

// 在渲染器中使用开放的 API
window.myAPI.doAThing()
```

<br>

请阅读上面链接的 `contextBridge` 文档以充分了解其局限性。例如，您不能通过桥发送 `自定义 prototypes` 或 `symbols`。

## 安全事项

单单开启和使用 `contextIsolation` 并不直接意味着您所做的一切都是安全的。 例如，此代码是 **不安全的。**

<br>

```
# preload.js

// 错误使用
contextBridge.exposeInMainWorld('myAPI', {
  send: ipcRenderer.send
})
```

<br>

它直接暴露了一个没有任何参数过滤的高等级权限 API 。 这将允许任何网站发送任意的 IPC 消息，这不会是你希望发生的。 相反，暴露进程间通信相关 API 的正确方法是为每一种通信消息提供一种实现方法。

<br>

```
# preload.js

// ✅ 正确使用
contextBridge.exposeInMainWorld('myAPI', {
  loadPreferences: () => ipcRenderer.invoke('load-prefs')
})
```

## 与Typescript一同使用

如果您使用 TypeScript 构建您的 Electron 应用程序，您需要将类型添加到通过上下文桥公开的 API。除非您使用 (声明文件)[https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html]  扩展类型，否则渲染器的 `window` 对象不会有正确的类型。

<br>

例如，给定这个 `preload.ts` 脚本：

<br>

```
# preload.ts

contextBridge.exposeInMainWorld('electronAPI', {
  loadPreferences: () => ipcRenderer.invoke('load-prefs')
})
```

<br>

您可以创建一个 `renderer.d.ts` 声明文件并全局扩充 `Window` 界面：

<br>

```
export interface IElectronAPI {
  loadPreferences: () => Promise<void>,
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
```

<br>

这样做将确保 TypeScript 编译器在渲染器进程中编写脚本时知道全局 `window` 对象上的 `electronAPI` 属性：

<br>

```
# renderer.ts

window.electronAPI.loadPreferences()
```