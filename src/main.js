const { app, BrowserWindow, clipboard, ipcMain, nativeTheme } = require('electron/main')
const path = require('node:path')

function createWindow() {
	const mainWindow = new BrowserWindow({
		height: 500,
		minHeight: 400,
		minWidth: 500,
		width: 900,
		show: false,
		titleBarStyle: "hidden",
		...(process.platform !== 'darwin' ? {titleBarOverlay: true} : {}),
    titleBarOverlay: {
      color:: " #00000000"
    },
    webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true
    }
	})

	mainWindow.webContents.loadFile("index.html");

	mainWindow.on("ready-to-show", () => {
		mainWindow.show();
	});

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

	mainWindow.webContents.ipc.on("toMain", (event, command, data) => {
			mainWindow.setWindowLayout(mainWindow.getNativeWindowHandle(), data.sidebarWidth, data.titlebarHeight);
	});
}

app.whenReady().then(() => createWindow());

app.on("window-all-closed", () => app.quit());
