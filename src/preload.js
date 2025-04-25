const { contextBridge, ipcRenderer } = require('electron/renderer')
//const os = require('os');

contextBridge.exposeInMainWorld("os", {
  homedir: () => os.homedir()
});

contextBridge.exposeInMainWorld("darkMode", {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system'),
  openSettings: () => ipcRenderer.send('open-settings')
})

contextBridge.exposeInMainWorld(
  "note", {
      selectFileDialog: () => {return ipcRenderer.invoke('note:selectFileDialog')}, // calls selectFileDialog()
      readFileContents: (filePath) => {return ipcRenderer.invoke('note:readFileContents', filePath)}, // calls readFileContents()
      writeFileContents: (filePath, data) => {return ipcRenderer.invoke('note:writeFileContents', filePath, data)},
      createFile: () => ipcRenderer.invoke('note:createFile')
  }
)

contextBridge.exposeInMainWorld(
  "renderer", {
    loadFileSystem: (dirPath) => {return ipcRenderer.invoke('renderer:loadFileSystem')}, // calls loadFileSystem()
    changeDirectory: () => {return ipcRenderer.invoke('renderer:changeDirectory')}, // calls changeDirectory()
    buildFileTree: (container, files) => {return ipcRenderer.invoke('renderer:buildFileTree', container, files)}
  }
)

contextBridge.exposeInMainWorld("fsApi", {
  getFileSystem: (dirPath) => {return ipcRenderer.invoke('get-file-system', dirPath)},
  getDocumentsPath: () => {return ipcRenderer.invoke('get-documents-path')}
})

contextBridge.exposeInMainWorld("fileTree", {
  readDir: (dirPath) => {return ipcRenderer.invoke('filetree:readDir', dirPath)},
  createFolder: (folderPath) => {return ipcRenderer.invoke('filetree:createFolder', folderPath)},
  createFile: (filePath, content) => {return ipcRenderer.invoke('filetree:createFile', filePath, content)}
});

