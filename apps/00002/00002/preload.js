const { contextBridge, ipcRenderer } = require('electron')

// 主进程暴露 darkMode 属性 
// 渲染进程中可以通过 window.darkMode 访问
contextBridge.exposeInMainWorld('darkMode', {
  // 渲染进程触发主进程的事件
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
})
