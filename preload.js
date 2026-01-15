const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    save: (d) => ipcRenderer.invoke('save-data', d),
    load: () => ipcRenderer.invoke('load-data')
});