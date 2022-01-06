# Electron 中的消息端口

`MessagePort` 是一个允许在不同上下文之间传递消息的 Web 功能。 就像 window.postMessage, 但是在不同的通道上。 此文档的目标是描述 Electron 如何扩展 Channel Messaging model ，并举例说明如何在应用中使用 MessagePorts

<br>

下面是 MessagePort 是什么和如何工作的一个非常简短的例子：

<br>

```
// renderer.js ///////////////////////////////////////////////////////////////
// MessagePorts 是在配对中创建的 连接的一对消息端口
// 被称为通道。
const channel = new MessageChannel()

// port1 和 port2 之间唯一的不同是你如何使用它们。 消息
// 发送到port1 将被port2 接收，反之亦然。
const port1 = channel.port1
const port2 = channel.port2

// 允许在另一端还没有注册监听器的情况下就通过通道向其发送消息
// 消息将排队等待，直到一个监听器注册为止。
port2.postMessage({ answer: 42 })

// 这次我们通过 ipc 向主进程发送 port1 对象。 类似的，
// 我们也可以发送 MessagePorts 到其他 frames, 或发送到 Web Workers, 等.
ipcRenderer.postMessage('port', null, [port1])
// main.js ///////////////////////////////////////////////////////////////////
// 在主进程中，我们接收这个端口对象
ipcMain.on('port', (event) => {
  // 当我们在主进程中接收到 MessagePort 对象, 它就成为了
  // MessagePortMain.
  const port = event.ports[0]

  // MessagePortMain 使用了 Node.js 风格的事件 API, 而不是
  // web 风格的事件 API. 因此使用 .on('message', ...) 而不是 .onmessage = ...
  port.on('message', (event) => {
    // 收到的数据是： { answer: 42 }
    const data = event.data
  })

  // MessagePortMain 阻塞消息直到 .start() 方法被调用
  port.start()
})
```

<br>

(Channel Messaging API 文档)[https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API] 是一个更好的方法去了解 MessagePorts 是怎么工作的。

## 主进程中的 MessagePorts

在 renderer 中， `MessagePorts` 类和 web 上的表现完全一致。不过，主进程不是一个网页，它没有Blink集成，因此它没有 `MessagePort` 或 `MessageChannel` 类。为了在主进程中处理 MessagePorts 并与之交互，Electron添加了两个新类: (`MessagePortMain`)[https://www.electronjs.org/zh/docs/latest/api/message-port-main] 和 (`MessageChannelMain`)[https://www.electronjs.org/zh/docs/latest/api/message-channel-main]。它们的行为类似于渲染器中的类似类。

<br>

`MessagePort` 对象可以既可以被 renderer 创建，也能被主进程创建，并使用 (`ipcRenderer.postMessage`)[https://www.electronjs.org/zh/docs/latest/api/ipc-renderer#ipcrendererpostmessagechannel-message-transfer] 和 (`WebContents.postMessage`)[https://www.electronjs.org/zh/docs/latest/api/web-contents#contentspostmessagechannel-message-transfer] 方法来回传递。请注意，通常的 IPC 方法如 `send` 和 `invoke` 不能用于传输 `MessagePort`，只有 `postMessage` 方法可以传输 `MessagePort`。通过主进程传递 `MessagePort`s，您可以连接两个可能无法通信的页面（例如，由于同源限制）。

## Extension: close event 扩展：关闭事件

Electron 向 `MessagePort` 添加了 Web 上不存在的一项功能，以使 MessagePorts 更有用。那就是 `close` 事件，它在通道的另一端关闭时发出。端口也可以通过垃圾收集来隐式关闭。在渲染器中，您可以通过分配给 `port.onclose` 或调用 `port.addEventListener('close', ...)` 来监听关闭事件。在主进程中，可以通过调用 `port.on('close', ...)` 来监听 `close` 事件。

## 示例

#### Worker 进程

在此示例中，您的应用程序有一个作为隐藏窗口实现的工作进程。您希望应用程序页面能够直接与工作进程通信，而无需通过主进程进行中继的性能开销。

<br>

查看 `apps/00002/00009/00001/`

```
npm start -- -p apps/00002/00009/00001/main.js
```

<br>

## Reply streams​ 以流的形式应答

Electron 的内置 IPC 方法仅支持两种模式：即发即弃（e,g `send`）或请求-响应（e.g. `invoke`）。使用 MessageChannels，您可以实现 “response stream”，其中单个请求以数据流进行响应。

<br>

查看 `apps/00002/00009/00002/`

```
npm start -- -p apps/00002/00009/00002/main.js
```

<br>

## 在主进程和上下文隔离页面的主世界之间直接通信

启用 (上下文隔离)[https://www.electronjs.org/zh/docs/latest/tutorial/context-isolation] 后，从主进程到 renderer 的 IPC 消息将传递到隔离世界，而不是主世界。有时你想直接将消息传递到主世界，而不必穿过孤立的世界。

<br>

查看 `apps/00002/00009/00003/`

```
npm start -- -p apps/00002/00009/00003/main.js
```

<br>

