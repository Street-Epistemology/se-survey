import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import Popup from 'reactjs-popup';
import { SessionList } from './SessionList';
import { Session } from '../DataTypes';

export interface MenuProps {
  useEmoji: boolean;
  selectedSymbol: string;
  inSession: boolean;
  onUseEmojiToggled: (args: boolean) => void;
  onSymbolSelected: (args: string) => void;
  onSessionSelected: (args: Session) => void;
}

const symbols: string[] = ['✓', '✔', '✘', '❌', '✅', '★', '🎵', '🔴'];

const Menu: React.FC<MenuProps> = ({
  useEmoji,
  selectedSymbol: tickSymbol,
  inSession,
  onUseEmojiToggled,
  onSymbolSelected,
  onSessionSelected,
}) => {
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
          <span
            className="dropdown-item pointer"
            onClick={() => onUseEmojiToggled(!useEmoji)}
          >
            {useEmoji ? 'Text Headings' : 'Emoji Headings'}
          </span>
          <div className="dropdown-divider"></div>
          <Popup
            trigger={() => (
              <span className="dropdown-item pointer">Join Session</span>
            )}
            modal
            nested
          >
            {(close: () => void) => (
              <SessionList
                onSessionSelected={(session) => {
                  onSessionSelected(session);
                  close();
                }}
              />
            )}
          </Popup>
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
        </div>
      </div>
    </div>
  );
};

export default Menu;
