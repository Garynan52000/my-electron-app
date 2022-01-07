# 在线/离线事件探测

## 概览

在渲染进程中，(在线/离线事件)[https://developer.mozilla.org/en-US/docs/Online_and_offline_events] 的探测，是通过标准 HTML5 API 中 (`navigator.onLine`)[http://html5index.org/Offline%20-%20NavigatorOnLine.html] 属性来实现的。

<br>

`navigator.onLine` 属性返回值：
- `false`：如果所有网络请求都失败(例如，断开网络)。
- `true`: 在其他情况下都返回 true

<br>

由于许多情况都会返回 `true`，你应该小心对待误报的情况， 因为我们不能总是假设 true 值意味着 Electron 可以访问互联网。 例如，当计算机运行的虚拟化软件时，虚拟以太网适配器处于 "always connected" 状态。 因此，如果您想要确定 Electron 的互联网访问状态，您应该为此检查进行额外的开发。

## 示例

<br>

查看 `apps/00002/00014/`

```
npm start -- -p apps/00002/00014/main.js
```

<br>