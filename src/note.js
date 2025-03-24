// 
// Document editor functions
//

// HOW TO USE
// Call saveNote() when closing a note to save the document editor's buffer into the file.
// -  Supply saveNote a file path or it will ask for one using a file dialog!
//
// Call openNote() to open a file into the document editor.
// -  Supply the first argument with a file path or it will ask for one using a file dialog!
// -  If save_first == true, openNote() automatically calls saveNote() on whatever it believes the currently open file is.
//
// Call updateFilePath() to change where openNote() and saveNote() automatically target.
// - "current": The file path you provide will be used for write operations.
// - "target": The file path you provide will be used for read operations.

var pathToCurrentNote = null;  // the file path to write to
var pathToTargetNote = null;   // the file path to read from

// Opens a file dialog to select a file, then calls updateFilePath() to change it.
// <which_path> (string):
// - "current": Updates pathToCurrentNote
// - "target": Updates pathToTargetNote
async function requestFilePath(which_path) {
    // Get file path from file select dialog in [main]
    console.log("[note-editor] Opening a file dialog...")
    let filePath = await window.note.selectFileDialog() // calls selectFileDialog()
    await updateFilePath(filePath, which_path)
}



// Updates pathToCurrentNote or pathToTargetNote with <filePath>.
// <which_path> (string):
// - "current": Updates pathToCurrentNote
// - "target": Updates pathToTargetNote
async function updateFilePath(filePath, which_path) {
  if (which_path == "current") {
    console.log("[note] Updating pathToCurrentNote to " + filePath)
    pathToCurrentNote = filePath
  } else {
    console.log("[note] Updating pathToTargetNote to " + filePath)
    pathToTargetNote = filePath
  }
}

// Displays the text parameter as raw text to the editor.
// <data> (string): The data to write to the document editor.
async function displayContentsToEditor(data) {
  console.log("[note] Displaying new data to editor")
  document.getElementById("document").value = data
}


// Reads the file from a given file path and returns its contents.
// <filePath> (String): The file path to read from. Usually is called as the value of <pathToTargetNote>.
async function readContentsOfFile(filePath) {
    console.log("[note] Reading contents of file at " + filePath)
    const data = await window.note.readFileContents(filePath)
    return data
}


// Writes whatever is in the editor to <pathToCurrentNote>. Only handles the write operation.
// Use saveNote() if you're calling this from outside note.js!
async function writeContentsToFile() {
    // If no note is loaded, requests a file path
    if (pathToCurrentNote == null) {
        await requestFilePath("current")
    }
    // Write whatever is in the document viewer to file at <pathToCurrentNote>
    console.log("[note] Sending request to overwrite file contents at " + pathToCurrentNote)
    const data = document.getElementById("document").value
    await window.note.writeFileContents(pathToCurrentNote, data)
}


// Primary function to save the contents of the editor to a file.
// If no <filePath> is specified, saves to <pathToCurrentNote>.
async function saveNote(filePath = null) {
    if (filePath != null) {
        pathToCurrentNote = filePath
        writeContentsToFile(filePath)
    } else {
        writeContentsToFile(pathToCurrentNote)
    }
}


// Loads a note to the editor.
// Automatically saves the current file!
// Call this function when the explorer switches notes with the new file path.
// <filePath> (string): The file path to open. If null, uses whatever <pathToTargetNote> is.
// <save_first> (boolean): Whether to call saveNote() before overwriting the document reader.
async function openNote(filePath = null, save_first = true) {
    if (save_first) { await saveNote() }

    // If <filePath> is given, <pathToTargetNote> (the file to open) is set to <filePath>
    // Otherwise, if <pathToTargetNote> is defined, use that.
    // Otherwise, request a path.
    if (filePath == null) {
        if (pathToTargetNote == null) { // then request a file to open
            await requestFilePath("target")
        } // otherwise, use pathToTargetNote
    } else { // use the new file path
        pathToTargetNote = filePath
    }

    // Read target file and output data to the document viewer
    console.log("[note] Sending request to read file contents at " + pathToTargetNote)
    const data = await readContentsOfFile(pathToTargetNote)
    displayContentsToEditor(data)
}


// Add listeners on test buttons for demonstration purposes
// Please note: these buttons should not exist. This is only to demonstrate the functionality while the document outline feature is in progress.
document.getElementById('document-select-read').addEventListener('click', function () {requestFilePath("target")})
document.getElementById('document-select-write').addEventListener('click', function () {requestFilePath("current")})
document.getElementById('document-save').addEventListener('click', function () {saveNote()})
document.getElementById('document-load').addEventListener('click', function () {openNote(null, save_first = false)})