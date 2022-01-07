const { app, BrowserWindow } = require('electron')
const fs = require('fs')
const path = require('path')

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    win.loadFile('index.html')
}

const filePath = path.join(__dirname, 'recently-used.md')
fs.writeFile(filePath, 'Lorem Ipsum', () => {
    app.addRecentDocument(filePath)
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    app.clearRecentDocuments()
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
