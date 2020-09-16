import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngry,
  faFrown,
  faMeh,
  faSmile,
  faLaugh,
} from '@fortawesome/free-solid-svg-icons';

export const EmojiHeader = (groupName: string) => {
  return (
    <React.Fragment key={groupName}>
      <th className="bth align-middle scale-text">{groupName}</th>
      {[faAngry, faFrown, faMeh, faSmile, faLaugh].map((icon) => (
        <th
          key={icon.iconName}
          className="bth center align-middle text-center scale-text p-0"
        >
          <div className="zoom">
            <FontAwesomeIcon icon={icon} color="gold" />
          </div>
        </th>
      ))}
    </React.Fragment>
  );
};

export default EmojiHeader;
