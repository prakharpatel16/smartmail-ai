let currentTheme = 'light';
let listenerInstalled = false;

function applyTheme(theme = 'light') {
  const selected = theme === 'system'
    ? (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;
  document.documentElement.dataset.theme = selected === 'dark' ? 'dark' : 'light';
}

export function watchTheme(theme = 'light') {
  currentTheme = theme || 'light';
  applyTheme(theme);
  if (!listenerInstalled && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => {
      if (currentTheme === 'system') applyTheme('system');
    });
    listenerInstalled = true;
  }
  return () => {};
}
