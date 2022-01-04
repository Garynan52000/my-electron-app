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