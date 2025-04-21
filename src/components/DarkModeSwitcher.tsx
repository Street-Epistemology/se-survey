import { faAdjust } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { toggleDarkMode } from '../utils/darkModeHelper';

export default function DarkModeSwitcher() {
  return (
    <button
      className="my-2 flex h-6 w-6 items-center rounded-full transition-colors hover:text-neutral-900 dark:hover:text-neutral-400"
      onClick={toggleDarkMode}
    >
      <FontAwesomeIcon icon={faAdjust} className="h-6 w-6 text-2xl" />
    </button>
  );
}
