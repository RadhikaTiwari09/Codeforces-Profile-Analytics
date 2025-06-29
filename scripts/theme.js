const switchTheme = (theme) => {
  const themeLink = document.getElementById('themeStylesheet');
  if (theme === 'light') {
    themeLink.href = 'styles/style.css';
  } else {
    if (theme === 'dark') {
      themeLink.href = 'styles/dark.css';
    } else {
      if (theme === 'space') {
        themeLink.href = 'styles/space.css';
      }
    }
  }
};

const themeSelect = document.getElementById('themeSelect');

themeSelect.addEventListener('change', (e) => {
  switchTheme(e.target.value);
});
