const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const os = require("os");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile("index.html");
});

// Get user's Documents directory
ipcMain.handle("get-documents-path", async () => {
  return path.join(os.homedir(), "Documents");
});

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

// Open a .txt file
ipcMain.handle("open-file", async (_, filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return { error: "File not found: " + filePath };
    }

    const content = fs.readFileSync(filePath, "utf8");
    return { success: true, content };
  } catch (error) {
    return { error: error.message };
  }
});

// Save file
ipcMain.handle("save-file", async (_, { filePath, content }) => {
  try {
    if (!fs.existsSync(filePath)) {
      return { error: "File does not exist." };
    }
    fs.writeFileSync(filePath, content, "utf8");
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
});

