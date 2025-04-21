const DARK_MODE = {
  enabled: 'enabled',
  disabled: 'disabled',
  storageKey: 'dark_mode',
  class: 'dark',
};

export function isDarkModeEnabled(): boolean {
  const darkMode: string =
    localStorage.getItem(DARK_MODE.storageKey) || DARK_MODE.disabled;
  return darkMode === DARK_MODE.enabled;
}

export function enableDarkMode(): void {
  document.documentElement.classList.add(DARK_MODE.class);
  localStorage.setItem(DARK_MODE.storageKey, DARK_MODE.enabled);
}

export function disableDarkMode(): void {
  document.documentElement.classList.remove(DARK_MODE.class);
  localStorage.setItem(DARK_MODE.storageKey, DARK_MODE.disabled);
}

export function toggleDarkMode(): void {
  if (isDarkModeEnabled()) {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
}
