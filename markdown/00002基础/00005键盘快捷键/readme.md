# 键盘快捷键

## 概览

该功能允许你为 Electron 应用程序配置应用和全局键盘快捷键。

## 示例

#### 本地快捷键

应用键盘快捷键仅在应用程序被聚焦时触发。 为了配置本地快捷键，你需要在创建 (Menu)[https://www.electronjs.org/zh/docs/latest/api/menu] 模块中的 (MenuItem)[https://www.electronjs.org/zh/docs/latest/api/menu-item] 时指定 (accelerator)[https://www.electronjs.org/zh/docs/latest/api/accelerator] 属性。
<br>

<br>

查看 `apps/00002/00005/00001/`

```
npm start -- -p apps/00002/00005/00001/main.js
```

<br>

> 注意：在上面的代码中，您可以看到基于用户的操作系统的 accelerator 差异。 对于MacOS，是 `Alt+Cmd+I`，而对于Linux 和 Windows，则是 `Alt+Shift+I`.

<br>

启动 Electron 应用程序后，你应该看到应用程序菜单以及您刚刚定义的本地快捷方式。
<br>
如果你点击 Help 或按下定义的加速器，然后打开你运行的 Electron 应用程序的终端。 将看到触发 `click` 事件后生成的消息：“Electron rocks！”

#### 全局快捷键

要配置全局键盘快捷键， 您需要使用 (globalShortcon)[https://www.electronjs.org/zh/docs/latest/api/global-shortcut] 模块来检测键盘事件，即使应用程序没有获得键盘焦点。

<br>

查看 `apps/00002/00005/00002/`

```
npm start -- -p apps/00002/00005/00002/main.js
```

<br>

> 注：在上面的代码中， CommandOrControl 意指在 macOS 上使用 Command ，在 Windows/Linux 上使用 Control 。

<br>

启动应用后，如果你按下定义好的全局快捷键，你将在启动的 Electron 应用控制台里面看到对应的日志输出

#### 在浏览器窗口内的快捷方式

- **使用 web APIs**

<br>
如果您想要在 (BrowserWindow)[https://www.electronjs.org/zh/docs/latest/api/browser-window] 中处理键盘快捷键，你可以在渲染进程中使用 addEventListener() API来监听 `kepup` 和 `keydown` (DOM事件)[https://developer.mozilla.org/en-US/docs/Web/Events]。

<br>

查看 `apps/00002/00005/00003/`

```
npm start -- -p apps/00002/00005/00003/main.js
```

<br>

> 注意：第三个参数 `true` 表明了当前监听器会持续在其它监听器之前接收按键按下事件，因此无法在其它监听器中调用 `stopPropagation()`。

- **拦截主进程中的事件**

在调度页面中的 `keydown` 和 `keyup` 事件之前，会发出 (`before-input-event`)[https://www.electronjs.org/zh/docs/latest/api/web-contents#event-before-input-event] 事件。 它可以用于捕获和处理在菜单中不可见的自定义快捷方式。

<br>

查看 `apps/00002/00005/00004/`

```
npm start -- -p apps/00002/00005/00004/main.js
```

<br>

在运行Electron应用程序之后，如果你打开你运行Electron应用的终端并按下 `Ctrl+I` 组合键，你会发现刚才按下的组合键被成功拦截了。

- **使用第三方库​**

如果您不想手动进行快捷键解析，可以使用一些库来进行高级的按键检测。例如 (mousetrap)[https://github.com/ccampbell/mousetrap]. 以下是在渲染进程中 `mousetrap` 的使用示例：

```
Mousetrap.bind('4', () => { console.log('4') })
Mousetrap.bind('?', () => { console.log('show shortcuts!') })
Mousetrap.bind('esc', () => { console.log('escape') }, 'keyup')

// combinations
Mousetrap.bind('command+shift+k', () => { console.log('command shift k') })

// map multiple combinations to the same callback
Mousetrap.bind(['command+k', 'ctrl+k'], () => {
  console.log('command k or control k')

  // return false to prevent default behavior and stop event from bubbling
  return false
})

// gmail style sequences
Mousetrap.bind('g i', () => { console.log('go to inbox') })
Mousetrap.bind('* a', () => { console.log('select all') })

// konami code!
Mousetrap.bind('up up down down left right left right b a enter', () => {
  console.log('konami code')
})
```

