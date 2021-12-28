const { app, BrowserWindow } = require('electron');
const path = require('path');

/**
 * 创建一个 BrowserWindow
 */
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // 加载文件
    win.loadFile('index.html');
    // 打开开发工具
    win.webContents.openDevTools();
}

!async function () {
    await app.whenReady();

    // 只有在 app 模块的 ready 事件被激发后才能创建浏览器窗口。 
    // 您可以通过使用 app.whenReady() API来监听此事件。 
    // 在whenReady()成功后调用createWindow()。
    createWindow();

    // 在Windows和Linux上，关闭所有窗口通常会完全退出一个应用程序。
    app.on('window-all-closed', function () {
        //  if the user is not on macOS (darwin).
        if (process.platform !== 'darwin') app.quit()
    });

    // 如果没有窗口打开则打开一个窗口 
    // 因为窗口无法在 ready 事件前创建，你应当在你的应用初始化后仅监听 activate 事件。 
    // 通过在您现有的 whenReady() 回调中附上您的事件监听器来完成这个操作。
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    }); 
}();
