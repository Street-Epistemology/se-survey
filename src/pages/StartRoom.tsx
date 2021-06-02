import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { RouteParamTypes } from '../DataTypes';
import * as db from '../firebase';
import { setSessionKey } from '../utils/sessionKey';
import FillForm from '../components/FillForm';
import Splash from '../components/Splash';

export function StartRoom(): JSX.Element {
  const { lang, surveyKey } = useParams<RouteParamTypes>();
  const [roomKey, setroomKey] = useState<string | null>();
  const [t, setTranslations] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState('');

  async function createRoom(nickname: string) {
    const { key: roomKey } = await db.push('/rooms');
    const roomURI = `/rooms/${lang}/${surveyKey}/${roomKey}/sessions`;
    const { key } = await db.push(roomURI);
    try {
      await db.set(`${roomURI}/${key}`, { nickname, filling: true });
      setSessionKey({ lang, surveyKey, roomKey, key });
      setroomKey(roomKey);
    } catch (error) {
      setError(error.toString().split(':').pop());
    }
  }

  useEffect(() => db.getOnOff(`/translations/${lang}`, setTranslations), [
    lang,
  ]);

  if (!roomKey) {
    return (
      <Splash>
        <div className="row align-items-center">
          <div className="col-md" />
          <div className="col-md">
            <FillForm
              error={error}
              onSubmit={createRoom}
              id="nickname"
              initialValue=""
              name="nickname"
              label={t.enterNickname}
              onChange={() => setError('')}
              submitLabel={t.createRoom}
            />
          </div>
          <div className="col-md" />
        </div>
      </Splash>
    );
  }
  return <Redirect push to={`/${lang}/${surveyKey}/${roomKey}`} />;
}

export default StartRoom;
