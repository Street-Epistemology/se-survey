import React from 'react';
import { SessionState } from '../DataTypes';

interface SessionStatusProps {
  sessionState: SessionState | undefined;
  onDisconnect: () => void;
}

const SessionStatus: React.FC<SessionStatusProps> = ({
  sessionState,
  onDisconnect,
}) => {
  return (
    <>
      {sessionState !== undefined && (
        <div className="mb-2 text-center mx-auto">
          <h4 className="d-inline-block m-2 text-center align-middle">
            {sessionState.isHosting
              ? 'Hosting session ID: '
              : 'Spectation session ID'}
          </h4>
          <div className="border rounded p-2 align-middle d-inline-block mt-2 bg-light">
            {sessionState.sessionId}
          </div>
          <button
            className="btn btn-warning d-inline align-middle ml-1 mt-2"
            onClick={onDisconnect}
          >
            Disconnect
          </button>
        </div>
      )}
    </>
  );
};

export default SessionStatus;
