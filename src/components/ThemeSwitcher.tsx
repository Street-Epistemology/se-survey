import { useState } from 'react';
import { faAdjust, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import loadCurrentTheme from '../utils/themeHelper';

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(localStorage.theme);

  return (
    <button
      className="my-2 flex h-6 w-6 cursor-pointer items-center rounded-full transition-colors hover:text-neutral-900 dark:hover:text-neutral-400"
      onClick={() => {
        if (localStorage.theme === 'light') {
          localStorage.removeItem('theme');
        } else if (localStorage.theme === 'dark') {
          localStorage.theme = 'light';
        } else {
          localStorage.theme = 'dark';
        }

        setTheme(localStorage.theme);

        loadCurrentTheme();
      }}
    >
      {theme === 'light' ? (
        <FontAwesomeIcon icon={faSun} className="h-6 w-6 text-2xl" />
      ) : theme === 'dark' ? (
        <FontAwesomeIcon icon={faMoon} className="h-6 w-6 text-2xl" />
      ) : (
        <FontAwesomeIcon icon={faAdjust} className="h-6 w-6 text-2xl" />
      )}
    </button>
  );
}
