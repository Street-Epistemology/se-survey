import { Session } from '../DataTypes';
import React, { useEffect, useState } from 'react';
import { FirebaseContext } from '../firebase';

interface SessionListProps {
  onSessionSelected: (session: Session) => void;
}

export const SessionList: React.FC<SessionListProps> = ({
  onSessionSelected,
}) => {
  const firebase = React.useContext(FirebaseContext);
  const [sessions, setSessions] = useState<Array<Session>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(
    () =>
      firebase?.subscribeToSessions((results) => {
        setSessions(results);
        setIsLoading(false);
      }),
    []
  );

  return (
    <div>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border m-5" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th className="text-center" scope="col">
                ID
              </th>
              {/* <th scope="col">Created</th> */}
              <th className="text-center" scope="col">
                Progress
              </th>
              <th className="text-center" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {sessions
              ? sessions.map((session) => {
                  const responses = session.responses.filter(
                    (response) => response
                  ).length;
                  return (
                    <tr>
                      <th className="text-center" scope="row">
                        {session.name}
                      </th>
                      {/* <td>{session.created}</td> */}
                      <td className="text-center">
                        {responses}
                        /24 ({(responses * 100) / 24}%)
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-primary"
                          onClick={() => onSessionSelected(session)}
                        >
                          Join
                        </button>
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      )}
    </div>
  );
};
