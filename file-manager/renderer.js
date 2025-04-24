const { ipcRenderer } = require("electron");

let currentFilePath = ""; // Store the opened file path

async function loadFileSystem(dirPath) {
  const files = await ipcRenderer.invoke("get-file-system", dirPath);
  if (files.error) return alert("Error: " + files.error);

  document.getElementById("directoryPath").value = dirPath;
  const fileTree = document.getElementById("fileTree");
  fileTree.innerHTML = "";
  buildFileTree(fileTree, files);
}

function buildFileTree(container, files) {
  files.forEach(file => {
    const li = document.createElement("li");
    li.textContent = file.name;
    li.className = file.isDirectory ? "folder" : "file";

    if (file.isDirectory) {
      // Folder click event
      const ul = document.createElement("ul");
      ul.style.display = "none";

      li.onclick = async (event) => {
        event.stopPropagation();
        if (ul.children.length === 0) {
          const subFiles = await ipcRenderer.invoke("get-file-system", file.path);
          if (!subFiles.error) buildFileTree(ul, subFiles);
        }
        ul.style.display = ul.style.display === "none" ? "block" : "none";
      };

      li.appendChild(ul);
    } else if (file.name.endsWith(".txt")) {
      // Text file click event
      li.onclick = async (event) => {
        event.stopPropagation();
        await openFile(file.path);
      };
    }

    container.appendChild(li);
  });
}

async function openFile(filePath) {
  const result = await ipcRenderer.invoke("open-file", filePath);
  
  if (result.content !== undefined) {
    document.getElementById("fileName").textContent = filePath.split("/").pop();
    document.getElementById("fileContent").value = result.content;
    document.getElementById("fileContent").style.display = "block";
    currentFilePath = filePath; // ✅ Store the file path when opening
    console.log("File opened:", currentFilePath); // Debugging log
  } else {
    alert("Error opening file: " + result.error);
  }
}

async function saveFile() {
  if (!currentFilePath) {
    console.log("Save attempt failed: No file selected."); // Debugging log
    return alert("No file selected to save.");
  }

  const newContent = document.getElementById("fileContent").value;
  const result = await ipcRenderer.invoke("save-file", { filePath: currentFilePath, content: newContent });

  if (result.success) {
    alert("File saved successfully!");
  } else {
    alert("Error saving file: " + result.error);
  }
}

// Change directory
function changeDirectory() {
  const newPath = document.getElementById("directoryPath").value.trim();
  if (!newPath) return alert("Please enter a valid directory path.");
  loadFileSystem(newPath);
}

// Load the Documents folder on startup
window.onload = async () => {
  const documentsPath = await ipcRenderer.invoke("get-documents-path");
  loadFileSystem(documentsPath);
};

window.changeDirectory = changeDirectory;
window.saveFile = saveFile;
