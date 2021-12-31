# 设备访问

类似基于 Chromium 的浏览器一样, Electron 也提供了通过 web API 访问设备硬件的方法。 大部分接口就像在浏览器调用的 API 一样，但有一些差异需要考虑到。 Electron和浏览器之间的**主要区别是请求访问设备时发生的情况。** 在浏览器中，用户可以在弹出窗口中允许访问单独的设备。 **在 Electron API中，提供了可供开发者自动选择设备或提示用户通过开发者创建的接口选择设备。**

## Web Bluetooth API

(Web Bluetooth API)[https://web.dev/bluetooth/] 可以被用来连接蓝牙设备。 为了在 Electron 中使用此 API ， 开发者将需要在 webContent 处理 (`select-bluetooth-device`)[https://www.electronjs.org/zh/docs/latest/api/web-contents#event-select-bluetooth-device] 事件 ，从而与设备请求相关联。


#### 示例

这个示例演示了一个 Electron 应用程序，当点击了 Test Bluetooth 按钮时，它会自动选择第一个可用的蓝牙设备。

<br>

查看 `apps/00003/00002/00001`。

```
npm start -- -p apps/00003/00002/00001/main.js
```

## WebHID API​

(WebHID API)[https://web.dev/hid/] 可以用于访问HID 设备，例如 键盘和游戏机。 Electron 提供了几个使用 WebHID API的接口：
- 调用 `navigator.hid.requestDevice` 并选择高清设备，将触发会话内的 (`select-hid-device`)[https://www.electronjs.org/zh/docs/latest/api/session#event-select-hid-device] 事件 此外，在调用 `navigator.hid.requestDevice` 过程中， 如果设备发生插拔（挂载和卸载）将触发 (`hid-device-added`)[https://www.electronjs.org/zh/docs/latest/api/session#event-hid-device-added] 和 (`hid-device-removed`)[https://www.electronjs.org/zh/docs/latest/api/session#event-hid-device-removed] 事件。
- 在第一次调用 `navigator.hid.requestDevice` 前, 可以通过 (`ses.setDevicePermissionHandler(handler)`)[https://www.electronjs.org/zh/docs/latest/api/session#sessetdevicepermissionhandlerhandler] 给予设备默认权限, 此外，在 WebContents 的生命周期内，Electron 默认会存储授予的设备许可信息。 如果需要更长期的存储，开发人员可以存储设备许可信息(比如: 在处理 `select-hid-device` 事件时), 然后通过 `setDevicePermissionHandler` 从存储的信息中读取
- (`ses.setPermissionCheckHandler(handler)`)[https://www.electronjs.org/zh/docs/latest/api/session#sessetpermissioncheckhandlerhandler] 可以用于禁用特定来源的 HID 访问。

#### Blocklist

默认情况下，Electron 使用与 Chromium 相同的 (`blocklist`)[https://github.com/WICG/webhid/blob/main/blocklist.txt] 如果您想要覆盖此行为，您可以通过设置 `disable-hid-blocklist` 标志来做到这一点：

<br>

```
app.commandLine.appendSwitch('disable-hid-blocklist')
```

## 示例

这个示例演示了，当 Test WebHID 按钮被点击后，一个Electron 应用将通过 (`ses.setDevicePermissionHandler(handler)`)[https://www.electronjs.org/zh/docs/latest/api/session#sessetdevicepermissionhandlerhandler] 和 (`select-hid-device`)[https://www.electronjs.org/zh/docs/latest/api/session#event-select-hid-device] 会话事件 自动选择 HID 设备

<br>

查看 `apps/00002/00003/00002`

```
npm start -- -p apps/00002/00003/00002/main.js
```

## Web Serial API

(Web Serial API)[https://web.dev/serial/] 可以被用来访问串口设备比如 USB 或蓝牙。 为了在 Electron 中使用这个 API, 开发者需要先定义关联在串口请求中的 (`select-serial-port`)[https://www.electronjs.org/zh/docs/latest/api/session#event-select-serial-port] 会话事件 .

<br>

有几个额外的 API 用于与 Web Serial API 合作：

- (`serial-port-added`)[https://www.electronjs.org/zh/docs/latest/api/session#event-serial-port-added] 和 (`serial-port-removed`)[https://www.electronjs.org/zh/docs/latest/api/session#event-serial-port-removed] 会话事件可以被用来处理 `navigator.serial.requestPort `串口进程中设备的加载和卸载事件
- 在第一次调用 `navigator.serial.requestPort` 前, 可以通过 (`ses.setDevicePermissionHandler(handler)`)[https://www.electronjs.org/zh/docs/latest/api/session#sessetdevicepermissionhandlerhandler] 给予设备默认权限, 此外，在 WebContents 的生命周期内，Electron 默认会存储授予的设备许可信息。 如果需要更长期的存储，开发人员可以存储设备许可信息(比如: 在处理 `select-serial-port` 事件时), 然后通过 `setDevicePermissionHandler` 从存储的信息中读取
- (`ses.setPermissionCheckHandler(handler)`)[https://www.electronjs.org/zh/docs/latest/api/session#sessetpermissioncheckhandlerhandler] 可以用于禁用特定来源的串口访问。

## 示例

这个示例演示了，当 Test WebHID 按钮被点击后，一个Electron 应用将通过 (`ses.setDevicePermissionHandler(handler)`)[https://www.electronjs.org/zh/docs/latest/api/session#sessetdevicepermissionhandlerhandler] 和 (`select-hid-device`)[https://www.electronjs.org/zh/docs/latest/api/session#event-select-hid-device] 会话事件 自动选择 HID 设备

<br>

查看 `apps/00002/00003/00003`

```
npm start -- -p apps/00002/00003/00003/main.js
```
