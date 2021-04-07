import React from 'react';

export default function TextHeader({
  title,
  text,
}: {
  title: string;
  text: string;
}): JSX.Element {
  return (
    <React.Fragment key={title}>
      <th className="bth align-middle scale-text">{title}</th>
      <th
        className="bth center align-middle text-center scale-text"
        colSpan={5}
      >
        {text}
      </th>
    </React.Fragment>
  );
}
