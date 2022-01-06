# 多线程

通过 (Web Workers)[https://developer.mozilla.org/en/docs/Web/API/Web_Workers_API/Using_web_workers] ，可以实现用操作系统级别的线程来跑JavaScript

## 多线程的 Node.js

可以在 Electro n的 Web Workers 里使用 Node.js 的特性。要用的话，需把 `webPreferences` 中的 `nodeIntegrationInWorker` 选项设置为 `true`

<br>

```
const win = new BrowserWindow({
  webPreferences: {
    nodeIntegrationInWorker: true
  }
})
```

<br>

> `nodeIntegrationInWorker` 可以独立于 `nodeIntegration` 使用，但 `sandbox` **必须不能**设置为 `true`

## 可用的 API

Web Workers 支持 Node.js 的所有内置模块，而且 `asar` 档案也仍通过 Node.js 的 API 来读取。 不过所有的Electron内置模块不可以用在多线程环境中。

## 原生 Node.js 模块

在 Web Workers 里可以直接加载任何原生 Node.js 模块，但不推荐这样做。 大多数现存的原生模块是在假设单线程环境的情况下编写的，如果把它们用在 Web Workers 里会导致崩溃和内存损坏。

<br>

请注意, 即使原生 Node.js 模块如果考虑到了线程安全问题， 但在 Web Worker 中加载它仍然不安全, 因为 `process.dlopen` 函数并没有考虑线程安全。

<br>

**现在安全顺利地加载原生模块的唯一办法，就是确保在 Web Workers 启动后 app 不加载原生模块。**

<br>

```
process.dlopen = () => {
  throw new Error('Load native module is not safe')
}
const worker = new Worker('script.js')
```

<br>

