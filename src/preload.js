const { contextBridge, ipcRenderer } = require('electron/renderer')
const os = require('os');

contextBridge.exposeInMainWorld("os", {
  homedir: () => os.homedir()
});

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system'),
  openSettings: () => ipcRenderer.send('open-settings')
})

contextBridge.exposeInMainWorld(
  "note", {
    selectFileDialog: () => {return ipcRenderer.invoke('note:selectFileDialog')}, // calls selectFileDialog()
    readFileContents: (filePath) => {return ipcRenderer.invoke('note:readFileContents', filePath)}, // calls readFileContents()
    writeFileContents: (filePath, data) => {return ipcRenderer.invoke('note:writeFileContents', filePath, data)}
  }
)

contextBridge.exposeInMainWorld("fileTree", {
  readDir: (dirPath) => ipcRenderer.invoke('filetree:readDir', dirPath),
  createFolder: (folderPath) => ipcRenderer.invoke('filetree:createFolder', folderPath),
  createFile: (filePath, content) => ipcRenderer.invoke('filetree:createFile', filePath, content)
});
