const { app, BrowserWindow } = require('electron')
const fs = require('fs')
const path = require('path')

app.disableHardwareAcceleration()

let win

app.whenReady().then(() => {
    win = new BrowserWindow({ webPreferences: { offscreen: true } })
    win.loadURL('https://www.baidu.com')
    // win.loadFile('index.html')
    win.webContents.on('paint', (event, dirty, image) => {
        const filePath = path.join(__dirname, 'ex.png');
        fs.writeFileSync(filePath, image.toPNG())
        console.log(`The screenshot has been successfully saved to ${filePath}`)
    })
    win.webContents.setFrameRate(60)
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
