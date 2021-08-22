const DARK_MODE = {
  enabled: 'enabled',
  disabled: 'disabled',
  storageKey: 'dark_mode',
  class: 'style-dark-mode',
};

export function isDarkModeEnabled(): boolean {
  const darkMode: string =
    localStorage.getItem(DARK_MODE.storageKey) || DARK_MODE.disabled;
  return darkMode === DARK_MODE.enabled;
}

export function enableDarkMode(): void {
  document.body.classList.add(DARK_MODE.class);
  localStorage.setItem(DARK_MODE.storageKey, DARK_MODE.enabled);
}

export function disableDarkMode(): void {
  document.body.classList.remove(DARK_MODE.class);
  localStorage.setItem(DARK_MODE.storageKey, DARK_MODE.disabled);
}

export function toggleDarkMode(): void {
  isDarkModeEnabled() ? disableDarkMode() : enableDarkMode();
}
