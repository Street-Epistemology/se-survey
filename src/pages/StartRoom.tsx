import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import FillForm from '../components/FillForm';
import Splash from '../components/Splash';
import { RouteParams } from '../DataTypes';
import * as db from '../firebase';
import { setSessionKey } from '../utils/sessionKey';

export function StartRoom() {
  const { lang, surveyKey } = useParams<RouteParams>();
  const [roomKey, setroomKey] = useState<string | null>();
  const [t, setTranslations] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState('');

  async function createRoom(nickname: string) {
    const { key: roomKey } = await db.push('/rooms');
    const roomURI = `/rooms/${lang}/${surveyKey}/${roomKey}/sessions`;
    const { key } = await db.push(roomURI);
    try {
      await db.set(`${roomURI}/${key}`, { nickname, filling: true });
      setSessionKey({
        lang: lang || '',
        surveyKey: surveyKey || '',
        roomKey,
        key,
      });
      setroomKey(roomKey);
    } catch (error) {
      setError(
        (error instanceof Error && error.toString().split(':').pop()) ||
          'An error occurred',
      );
    }
  }

  useEffect(
    () => db.getOnOff(`/translations/${lang}`, setTranslations),
    [lang],
  );

  if (!roomKey) {
    return (
      <Splash>
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
      </Splash>
    );
  }
  return <Navigate to={`/${lang}/${surveyKey}/${roomKey}`} />;
}

export default StartRoom;
