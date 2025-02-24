document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
  const isDarkMode = await window.darkMode.toggle()
  document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
})

document.getElementById('reset-to-system').addEventListener('click', async () => {
  await window.darkMode.system()
  document.getElementById('theme-source').innerHTML = 'System'
})

//frame size adjust to the window size
var hdfr = document.getElementById('header')
var docfr = document.getElementById('docs')
var comfr = document.getElementById('coms')
var textArea = document.getElementById('document');
var noteArea = document.getElementById('notes');
var charnum = document.getElementById('charnum');

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

charnum.onload = function(){
  charnum.style.height = charnum.style.height + 'px';
  charnum.style.width = charnum.style.width + 'px';
}

//character counter
textArea.addEventListener('input', function() {
  charnum.textContent = this.value.length + " characters";
})

function openSettings(){
  ipcRenderer.send('open-settings');
}