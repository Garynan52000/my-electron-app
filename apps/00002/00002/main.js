const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron')
const path = require('path')

function createWindow() {
    // 创建窗口
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        // 定义预加载文件
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // 读取 html 页面
    win.loadFile('index.html')

    // 进程间通信（主进程中添加事件监听）
    // dark-mode 切换事件 
    ipcMain.handle('dark-mode:toggle', () => {
        // 是否使用 dark-mode boolean
        if (nativeTheme.shouldUseDarkColors) {
            nativeTheme.themeSource = 'light'
        } else {
            nativeTheme.themeSource = 'dark'
        }
        // 是否使用 dark-mode boolean
        return nativeTheme.shouldUseDarkColors
    })

    // 进程间通信（主进程中添加事件监听）
    // 事件 dark-mode:system 系统默认主题
    ipcMain.handle('dark-mode:system', () => {
        nativeTheme.themeSource = 'system'
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
