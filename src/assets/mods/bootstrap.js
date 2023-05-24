var modsConfig = [];
var modList = ['legacy'];

window.onload = () => {
  for (const modName of modList) {
    var scr = document.createElement("script");
    scr.src = './assets/mods/' + modName + '/config.js';
    document.head.appendChild(scr);
  }
}
