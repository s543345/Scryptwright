const { app, BrowserWindow, clipboard, ipcMain, nativeTheme, dialog, ipcRenderer } = require('electron/main')
const path = require('node:path')
const fs = require('fs');
const { read } = require('node:fs');

let settingsWindow;
let mainWindow;

function createWindow() {
	const mainWindow = new BrowserWindow({
		height: 800,
		minHeight: 800,
		minWidth: 1000,
		width: 1200,
		show: false,
		titleBarOverlay: {
			color: '#00000000'
		},
	    webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			//contextIsolation: true,
			//enableRemoteModule: false,
			//nodeIntegration: true
		}
	})
	mainWindow.setMenuBarVisibility(true);  // edit for dev purposes
	mainWindow.webContents.loadFile("index.html");

	mainWindow.on("ready-to-show", () => {
		mainWindow.show();
	})
	mainWindow.webContents.openDevTools()
	;

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })
	ipcMain.on('open-settings',() => {
		openSettings();
	})

	mainWindow.webContents.ipc.on("toMain", (event, command, data) => {
			mainWindow.setWindowLayout(mainWindow.getNativeWindowHandle(), data.sidebarWidth, data.titlebarHeight);
	});
}

function openSettings() {
	if (!settingsWindow) {
		settingsWindow = new BrowserWindow({
			width: 400,
			height: 400,
			parent: mainWindow,
			modal: true, //keeps the window on top
			frame:true,
			resizable: false,
			webPreferences: {
				preload: path.join(__dirname, 'preload.js'),
				nodeIntegration: true
			}
		});
		settingsWindow.webContents.loadFile('settings.html');

		settingsWindow.setMenuBarVisibility(false);
		settingsWindow.on('closed', () => {
			settingsWindow = null;
		})
	}
}

app.whenReady().then(() => createWindow());

app.on("window-all-closed", () => app.quit());

ipcMain.handle('filetree:readDir', async (event, dirPath) => {
	try {
	  const items = await fs.promises.readdir(dirPath, { withFileTypes: true });
	  // Return a simple array of items with their names and a flag for directories
	  return items.map(item => ({ name: item.name, isDirectory: item.isDirectory() }));
	} catch (err) {
	  console.error("Error reading directory:", err);
	  return [];
	}
  });

// -----------------------
//  NOTE EDITOR FUNCTIONS
// -----------------------

//create a file
async function createFile(){
	console.log("[mail] Opening file dialog to create a new file")
	const {canceled, filePath} = await dialog.showSaveDialog({
		title: 'Create a new file',
		defaultPath: 'untitled.md',
		filters: [{ name: 'Markdown Files', extensions: ['.md'] }]
	});
	return canceled ? null : filePath
}

//Handler function for createFile()
ipcMain.handle('note:createFile', async (event, args) => {
	return await createFile();
})

// Opens a file dialog and returns the path to the file chosen.
// Call as await window.note.selectFileDialog() via the "note" preload script
async function selectFileDialog() {
	console.log("[main] Opening file dialog")
	let filePath = "noPath"
	// Open file dialog
	await dialog.showOpenDialog({
		properties: ['openFIle'],
		filters: [{ name: 'Markdown Files', extensions: ['md']}] // only show .md files
	}).then(function (response) {
		// Set file path from response
		filePath = response.filePaths[0]
	})
	return filePath
}

// Handler function for selectFileDialog()
ipcMain.handle('note:selectFileDialog', async (event, ...args) => {
	return await selectFileDialog() //returns filepath
})



// Read file contents from a file path
// Call as await window.note.readFileContents() via the "note" preload script
async function readFileContents(filePath) {
	console.log("[main] Reading file contents at " + filePath)
	return fs.readFileSync(filePath, {encoding: "utf-8"})
}

// Handler for readFileContents()
ipcMain.handle("note:readFileContents", async (event, filePath) => {
	return await readFileContents(filePath)
})



// Write <data> to the file at <filePath>. Overwrites that file.
// Call as await window.note.writeFileContents() via the "note" preload script
async function writeFileContents(filePath, data) {
	console.log("[main] Writing to " + filePath)
	fs.writeFileSync(filePath, data)
}

// Handler for writeFileContents()
ipcMain.handle("note:writeFileContents", async (event, filePath, data) => {
	await writeFileContents(filePath, data)
})



// ---------------------------
//  END NOTE EDITOR FUNCTIONS
// ---------------------------
