const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
    const win = new BrowserWindow({
        width: 1650, 
        height: 950,
        autoHideMenuBar: true,
        backgroundColor: '#050505',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            webSecurity: false 
        }
    });
    win.loadFile('index.html');
}

// Handles saving progress to progress.json
ipcMain.handle('save-data', async (e, d) => { 
    fs.writeFileSync(path.join(__dirname, 'progress.json'), JSON.stringify(d)); 
});

// Handles loading progress from progress.json
ipcMain.handle('load-data', async () => {
    const p = path.join(__dirname, 'progress.json');
    return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p)) : { completedQuests: [], collectorItems: [] };
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});