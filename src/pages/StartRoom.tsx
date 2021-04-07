import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { AboutTypes, RouteParamTypes } from '../DataTypes';
import * as db from '../firebase';
import { setSessionKey } from '../utils/sessionKey';
import FillForm from '../components/FillForm';

export function StartRoom(): JSX.Element {
  const { lang, surveyKey } = useParams<RouteParamTypes>();
  const [roomKey, setroomKey] = useState<string | null>();
  const [about, setAbout] = useState<AboutTypes>({});

  async function createRoom(nickname: string) {
    const { key: roomKey } = await db.push('/rooms');
    const roomURI = `/rooms/${lang}/${surveyKey}/${roomKey}/sessions`;
    const { key } = await db.push(roomURI);
    db.set(`${roomURI}/${key}`, { nickname, filling: true });
    setSessionKey({ lang, surveyKey, roomKey, key });
    setroomKey(roomKey);
  }

  useEffect(() => db.getOnOff(`/translations/${lang}/about`, setAbout), [lang]);

  if (!roomKey) {
    return (
      <div className="container py-4">
        <div className="row align-items-center">
          <div className="col-md" />
          <div className="col-md">
            <FillForm
              handleSubmit={createRoom}
              id="nickname"
              initialValue=""
              name="nickname"
              label="Enter nickname"
              submitLabel={about?.start || ''}
            />
          </div>
          <div className="col-md" />
        </div>
      </div>
    );
  }
  return <Redirect push to={`/${lang}/${surveyKey}/${roomKey}`} />;
}

export default StartRoom;
