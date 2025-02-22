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
hdfr.onload = function(){
  hdfr.style.height = window.innerHeight + 'px';
  hdfr.style.width = window.innerWidth + 'px';
}
docfr.onload = function(){
  docfr.style.height = docfr.contentWindow.document.body.scrollHeight + 'px';
  docfr.style.width = docfr.contentWindow.document.body.scrollWidth + 'px';
}
comfr.onload = function(){
  comfr.style.height = comfr.contentWindow.document.body.scrollHeight + 'px';
  comfr.style.width = comfr.contentWindow.document.body.scrollWidth + 'px';
}