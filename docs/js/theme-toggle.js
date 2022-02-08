var darkMode = localStorage.darkMode | false;

function toggleDarkMode() {
  darkMode ^= true;
  localStorage.darkMode = darkMode;

  document.getElementsByTagName('html')[0].classList.toggle('dark-mode');

  // redraw each graph for new mode to take effect
  if (graphs) {
    for (let graphType in graphs) {
      graphs[graphType].sketch.redraw();
    }
  }
}

function setDarkMode() {
  if (darkMode) {
    document.getElementsByTagName('html')[0].classList.add('dark-mode');
  }
  else {
    document.getElementsByTagName('html')[0].classList.remove('dark-mode');
  }
}

// set the dark mode (if previously saved in localStorage)
setDarkMode();
