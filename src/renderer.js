document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
  const isDarkMode = await window.darkMode.toggle()
  document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
})

document.getElementById('reset-to-system').addEventListener('click', async () => {
  await window.darkMode.system()
  document.getElementById('theme-source').innerHTML = 'System'
})
//frame size adjust to the window size
var docfr = document.getElementById('docs')
var comfr = document.getElementById('coms')
docfr.onload = function(){
  docfr.style.height = docfr.contentWindonw.document.body.scrollHeight + 'px';
  docfr.style.width = docfr.contentWindonw.document.body.scrollWidth + 'px';
}
comfr.onload = function(){
  comfr.style.height = comfr.contentWindonw.document.body.scrollHeight + 'px';
  comfr.style.width = comfr.contentWindonw.document.body.scrollWidth + 'px';
}