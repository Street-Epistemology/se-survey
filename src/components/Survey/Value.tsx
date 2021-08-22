import React from 'react';
import { Answer, ServerRoom } from '../../DataTypes';
import getCharAt from '../../utils/getCharAt';
import NickWithBadge from '../NickWithBadge';

interface ValueProps {
  handleResponse: (answer: Answer) => void;
  room?: ServerRoom;
  questionKey: string;
  sectionKey: string;
  sessionKey: string;
  value: number;
}

interface Sessions {
  [key: string]: {
    nickname: string;
    revealMyName: boolean;
  };
}

interface UsersTypes {
  mySessionKey?: string;
  sessions: Sessions;
}

function Users({ mySessionKey, sessions }: UsersTypes) {
  const sessionKeys = Object.keys(sessions);
  if (sessionKeys.length === 0) return <React.Fragment />;
  return (
    <React.Fragment>
      <div
        className={`nick-badge ${
          sessionKeys.includes(mySessionKey || '') ? 'my-nick-badge' : ''
        }`}
      >
        {sessionKeys.length === 1 && sessions[sessionKeys[0]].revealMyName
          ? getCharAt(sessions[sessionKeys[0]].nickname || '', 0)
          : sessionKeys.length}
        <div className="nick-menu-container">
          <ul className="list-group nick-menu">
            {sessionKeys.map((sessionKey) =>
              sessions[sessionKey].revealMyName ? (
                <li key={sessionKey} className="list-group-item d-inline-flex">
                  <NickWithBadge
                    me={mySessionKey === sessionKey}
                    nickname={sessions[sessionKey].nickname}
                  />
                </li>
              ) : (
                <React.Fragment key={sessionKey} />
              )
            )}
            {!!sessionKeys.find(
              (sessionKey) => !sessions[sessionKey].revealMyName
            ) && (
              <li className="list-group-item d-inline-flex">
                <NickWithBadge
                  me={
                    !!sessionKeys.filter(
                      (sessionKey) =>
                        !sessions[sessionKey].revealMyName &&
                        mySessionKey === sessionKey
                    ).length
                  }
                  badgeText={`${
                    sessionKeys.filter(
                      (sessionKey) => !sessions[sessionKey].revealMyName
                    ).length
                  }`}
                  nickname="hidden"
                />
              </li>
            )}
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
}

export default function Value({
  handleResponse,
  questionKey,
  room,
  sectionKey,
  sessionKey,
  value,
}: ValueProps): JSX.Element {
  const sessions: Sessions = Object.keys(room?.sessions || {})
    .sort((a) => (sessionKey === a ? -1 : 0))
    .reduce((sessions, currentSessionKey) => {
      if (
        room?.sessions[currentSessionKey].answer?.[sectionKey]?.[questionKey]
          ?.value === value
      ) {
        return {
          ...sessions,
          [currentSessionKey]: room?.sessions[currentSessionKey],
        };
      }
      return sessions;
    }, {});
  return (
    <td
      className="td-check m-0 p-0 align-middle"
      key={value}
      onClick={() => handleResponse({ questionKey, sectionKey, value })}
    >
      <div className="p-0">
        <span className="m-0 badges">
          {room?.sessions[sessionKey]?.filling ? (
            sessions[sessionKey] ? (
              '✓'
            ) : null
          ) : (
            <Users mySessionKey={sessionKey} sessions={sessions} />
          )}
        </span>
      </div>
    </td>
  );
}
