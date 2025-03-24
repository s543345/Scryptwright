//document.getElementById('toggle-dark-mode').addEventListener('click', async () =>
//  const isDarkMode = await window.darkMode.toggle()
//  document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
//})

//document.getElementById('reset-to-system').addEventListener('click', async () => {
//  await window.darkMode.system()
//  document.getElementById('theme-source').innerHTML = 'System'
//})

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
document.getElementById('ddbtn').addEventListener('click', function() {
    const drop = document.getElementById('dropdownbtn');

    if(drop.style.display === 'none' || drop.style.display === "") {
        drop.style.display = 'block';
    }
    else{
      drop.style.display = 'none'; //hide
    }
});
