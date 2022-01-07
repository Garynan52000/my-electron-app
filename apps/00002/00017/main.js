const { app, BrowserWindow } = require('electron')
const os = require('os');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    win.loadFile('index.html')

    win.setRepresentedFilename(os.homedir())
    win.setDocumentEdited(true)
}

app.whenReady().then(createWindow)

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
