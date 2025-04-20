import { faAdjust } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toggleDarkMode } from '../utils/darkModeHelper';

export default function DarkModeSwitcher() {
  return (
    <div className="d-flex align-items-center my-2">
      <FontAwesomeIcon
        onClick={toggleDarkMode}
        icon={faAdjust}
        className="style-mode-switch-icon "
      />
    </div>
  );
}
