/* 
为了操作DOM，创建一个 renderer.js 文件，添加事件监听器到 'online' 和 'offline' 窗口 中. 
事件处理器设置基于 navigator.onLine 的结果到 <strong id='status'> element 的内容中。
*/
function updateOnlineStatus() {
    document.getElementById('status').innerHTML = navigator.onLine ? 'online' : 'offline'
}

window.addEventListener('online', updateOnlineStatus)
window.addEventListener('offline', updateOnlineStatus)

updateOnlineStatus()
