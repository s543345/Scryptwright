document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-dark-mode')
  const resetBtn = document.getElementById('reset-to-system')
  const themeLabel = document.getElementById('theme-source')

  if (toggleBtn && themeLabel) {
    toggleBtn.addEventListener('click', async () => {
      const isDarkMode = await window.darkMode.toggle()
      themeLabel.innerHTML = isDarkMode ? 'Dark' : 'Light'
    })
  }

  if (resetBtn && themeLabel) {
    resetBtn.addEventListener('click', async () => {
      await window.darkMode.system()
      themeLabel.innerHTML = 'System'
    })
  }
})

//frame size adjust to the window size
const hdfr = document.getElementById('header')
const docfr = document.getElementById('docs')
const comfr = document.getElementById('coms')
const textArea = document.getElementById('document');
const noteArea = document.getElementById('notes');
const charnum = document.getElementById('charnum');

hdfr.onload = function(){
  hdfr.style.height = hdfr.contentWindow.document.body.scrollHeight+ 'px';
  hdfr.style.width = hdfr.contentWindow.document.body.scrollHeight + 'px';
  hdfr.style.borderRadius = '15px';
}

docfr.onload = function(){
  // frame adjustment and structure
  docfr.style.height = docfr.contentWindow.document.body.scrollHeight + 'px';
  docfr.style.width = docfr.contentWindow.document.body.scrollWidth + 'px';
  docfr.style.borderRadius = '15px';
}

comfr.onload = function(){
  comfr.style.height = comfr.contentWindow.document.body.scrollHeight + 'px';
  comfr.style.width = comfr.contentWindow.document.body.scrollWidth + 'px';
  comfr.style.borderRadius = '15px';
}

textArea.onload = function(){
  textArea.style.height = window.innerHeight * 0.8 + 'px';
  textArea.style.width = window.innerWidth * 0.5 + 'px';
  textArea.style.borderRadius = '15px';
}

noteArea.onload = function(){
  textArea.style.height = window. innerHeight * 0.2 + 'px';
  textArea.style.width = window.innerWidth * 0.5 + 'px';
  textArea.style.borderRadius = '15px';
}

//character counter
textArea.addEventListener('input', function() {
  charnum.textContent = this.value.length + " characters";
})

window.onload = function(){
  charnum.style.height = charnum.offsetHeight + 'px';
  charnum.style.width = charnum.offsetWidth + 'px';
}

function openSettings(){
  ipcRenderer.send('open-settings');
}

// dropdown button
/* HEAD
//document.getElementById('ddbtn').addEventListener('click', function() {
//    const drop = document.getElementById('dropdownbtn');
=======
/*document.getElementById('ddbtn').addEventListener('click', function() {
    const drop = document.getElementById('dropdownbtn');
>>>>>>> Evan-Test

//    if(drop.style.display === 'none' || drop.style.display === "") {
//        drop.style.display = 'block';
//    }
//    else{
//      drop.style.display = 'none'; //hide
//    }
//});*/

let currentFilePath = ""; // Store the opened file path

async function loadFileSystem(dirPath) {
  const files = await window.fsApi.getFileSystem(dirPath);
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
          const subFiles = await window.fsApi.getFileSystem(dirPath);
          if (!subFiles.error) buildFileTree(ul, subFiles);
        }
        ul.style.display = ul.style.display === "none" ? "block" : "none";
      };

      li.appendChild(ul);
    } else if (file.name.endsWith(".md")) {
      // Text file click event
      li.onclick = async (event) => {
        event.stopPropagation();
        await openFile(file.path);
      };
    }
  });
}

/*<<<<<<< HEAD

    container.appendChild(li);*/

// Change directory
function changeDirectory() {
  const newPath = document.getElementById("directoryPath").value.trim();
  if (!newPath) return alert("Please enter a valid directory path.");
  loadFileSystem(newPath);
}

// Load the Documents folder on startup
window.onload = async () => {
  const documentsPath = await window.fsApi.getDocumentsPath();
  loadFileSystem(documentsPath);
};

window.changeDirectory = changeDirectory;
window.saveFile = saveFile;

   /* else{
      drop.style.display = 'none'; //hide
    }
});*/

// A recursive function to build a file tree list
async function buildFileTree(directoryPath, container) {
  // Fetch the directory items using your IPC-exposed function
  const items = await window.fileTree.readDir(directoryPath);
  
  const ul = document.createElement('ul');
  
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.name;
    
    // When a directory is clicked, expand it
    li.addEventListener('click', async (e) => {
      // Prevent click event from propagating to parent elements
      e.stopPropagation();
      
      if (item.isDirectory) {
        // Toggle expand/collapse
        const existingUl = li.querySelector('ul');
        if (existingUl) {
          li.removeChild(existingUl);
        } else {
          const subDirPath = path.join(directoryPath, item.name);
          await buildFileTree(subDirPath, li);
        }
      } else {
        // For files, you may load content into the editor
        const filePath = path.join(directoryPath, item.name);
        // Example: load file contents (using your note.readFileContents)
        const content = await window.note.readFileContents(filePath);
        document.getElementById('document').value = content;
      }
    });
    
    ul.appendChild(li);
  });
  
  container.appendChild(ul);
}

// On DOM load, build the file tree in the sidebar
document.addEventListener('DOMContentLoaded', async () => {
  const sidebar = document.getElementById('sidebar');
  // Use a starting directory (for example, the user's home directory):
  const os = require('os');
  const initialDir = window.os.homedir();
  
  buildFileTree(initialDir, sidebar);
});

