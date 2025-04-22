const { contextBridge, ipcRenderer } = require('electron/renderer')

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

contextBridge.exposeInMainWorld(
  "renderer", {
    loadFileSystem: (dirPath) => {return ipcRenderer.invoke('renderer:loadFileSystem')}, // calls loadFileSystem()
    changeDirectory: () => {return ipcRenderer.invoke('renderer:changeDirectory')}, // calls changeDirectory()
    buildFileTree: (container, files) => {return ipcRenderer.invoke('renderer:buildFileTree', container, files)}
  }
)

contextBridge.exposeInMainWorld('fsApi', {
  getFileSystem: (dirPath) => ipcRenderer.invoke('get-file-system', dirPath),
  getDocumentsPath: () => ipcRenderer.invoke('get-documents-path')
});