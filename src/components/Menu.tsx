import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';

export interface MenuProps {
  useEmoji: boolean;
  selectedSymbol: string;
  showChanges: boolean;
  onUseEmojiToggled: (args: boolean) => void;
  onShowChangesToggled: (args: boolean) => void;
  onSymbolSelected: (args: string) => void;
}

const symbols: string[] = ['✓', '✔', '✘', '✅', '★', '🎵', '🔵'];

const Menu: React.FC<MenuProps> = ({
  useEmoji,
  selectedSymbol: tickSymbol,
  showChanges,
  onShowChangesToggled,
  onUseEmojiToggled,
  onSymbolSelected,
}) => {
  const history = useHistory();
  return (
    <div className="overlay">
      <div className="dropleft m-2 float-right menu-button">
        <button
          className="btn btn-primary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <FontAwesomeIcon icon={faCog} />
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <div className="checkbox dropdown-item">
            <label>
              <input
                className="mr-2"
                type="checkbox"
                checked={useEmoji}
                onClick={() => onUseEmojiToggled(!useEmoji)}
              />
              Use Emoji
            </label>
          </div>
          <div className="checkbox dropdown-item">
            <label>
              <input
                className="mr-2"
                type="checkbox"
                checked={showChanges}
                onClick={() => onShowChangesToggled(!showChanges)}
              />
              Show Changes
            </label>
          </div>
          <div className="dropdown-divider"></div>
          {symbols.map((symbol) => {
            return (
              <span
                key={symbol}
                className={
                  'dropdown-item pointer' +
                  (symbol === tickSymbol ? ' bg-primary text-white' : '')
                }
                onClick={() => onSymbolSelected(symbol)}
              >
                {symbol}
              </span>
            );
          })}
          <div className="dropdown-divider"></div>
          <span
            className="dropdown-item pointer"
            onClick={() => history.push('/about')}
          >
            About
          </span>
        </div>
      </div>
    </div>
  );
};

export default Menu;
