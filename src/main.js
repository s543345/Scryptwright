const { app, BrowserWindow, clipboard, ipcMain, nativeTheme, dialog } = require('electron/main')
const path = require('node:path')
const fs = require('fs');
const { read } = require('node:fs');
const os = require("os");

let settingsWindow;
let mainWindow;

function createWindow() {
	const mainWindow = new BrowserWindow({
		height: 800,
		minHeight: 600,
		minWidth: 800,
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




// -----------------------
//  NOTE EDITOR FUNCTIONS
// -----------------------

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
	const result = await selectFileDialog()
	return result // returns a file path
})



// Read file contents from a file path
// Call as await window.note.readFileContents() via the "note" preload script
async function readFileContents(filePath) {
	console.log("[main] Reading file contents at " + filePath)
	return fs.readFileSync(filePath, {encoding: "utf-8"})
}

// Handler for readFileContents()
ipcMain.handle("note:readFileContents", async (event, filePath) => {
	const data = await readFileContents(filePath)
	return data
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

// Fetch files and folders
ipcMain.handle("get-file-system", async (_, dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) return { error: "Directory does not exist." };

    const files = fs.readdirSync(dirPath);
    return files
      .map(file => {
        try {
          const filePath = path.join(dirPath, file);
          return {
            name: file,
            path: filePath,
            isDirectory: fs.statSync(filePath).isDirectory()
          };
        } catch (error) {
          return null;
        }
      })
      .filter(file => file !== null);
  } catch (error) {
    return { error: "Failed to retrieve file system: " + error.message };
  }
});

// ---------------------------
//  END NOTE EDITOR FUNCTIONS
// ---------------------------
