import React from 'react';

export const TextHeader = (groupName: string) => {
  return (
    <React.Fragment key={groupName}>
      <th className="bth align-middle scale-text">{groupName}</th>
      <th
        className="bth center align-middle text-center scale-text"
        colSpan={5}
      >
        Disagree ↔ Agree
      </th>
    </React.Fragment>
  );
};

export default TextHeader;
