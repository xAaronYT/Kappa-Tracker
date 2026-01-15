const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const savePath = path.join(app.getPath('userData'), 'save-state.json');

function createWindow() {
    const win = new BrowserWindow({
        width: 1400, height: 900,
        backgroundColor: '#050505',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    win.loadFile('index.html');
}

ipcMain.handle('save-data', async (event, state) => {
    fs.writeFileSync(savePath, JSON.stringify(state, null, 2));
});

ipcMain.handle('load-data', async () => {
    if (fs.existsSync(savePath)) return JSON.parse(fs.readFileSync(savePath, 'utf8'));
    return null;
});

app.whenReady().then(createWindow);