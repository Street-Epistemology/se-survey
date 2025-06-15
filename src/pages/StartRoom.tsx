import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import FillForm from '../components/FillForm';
import Splash from '../components/Splash';
import { RouteParams } from '../DataTypes';
import * as db from '../firebase';
import { setSessionKey } from '../utils/sessionKey';
import { getAllTranslationsWithCache } from '../utils/translationCache';

export function StartRoom() {
  const { lang = '', surveyKey = '' } = useParams<RouteParams>();
  const [translations, setTranslations] = useState<{
    [key: string]: { [key: string]: string };
  }>();
  const [roomKey, setroomKey] = useState<string | null>();
  const [error, setError] = useState('');

  const languages = translations && Object.keys(translations);
  const t = translations?.[lang];

  useEffect(() => getAllTranslationsWithCache(setTranslations), []);

  if (languages && !languages.includes(lang)) {
    if (languages.includes(lang.split('-')[0])) {
      return <Navigate to={`/${lang.split('-')[0]}`} replace />;
    }

    return <Navigate to={`/${lang}`} replace />;
  }

  if (!t) return <></>;

  async function createRoom(nickname: string) {
    try {
      const { key: roomKey } = await db.push('/rooms');
      const roomURI = `/rooms/${lang}/${surveyKey}/${roomKey}/sessions`;
      const { key: sessionKey } = await db.push(roomURI);
      if (!sessionKey || !roomKey) return;
      await db.set(`${roomURI}/${sessionKey}`, { nickname, filling: true });
      setSessionKey({ lang, surveyKey, roomKey, sessionKey });
      setroomKey(roomKey);
    } catch (error) {
      setError(
        (error instanceof Error && error.toString().split(':').pop()) ||
          'An error occurred',
      );
    }
  }

  if (roomKey) return <Navigate to={`/${lang}/${surveyKey}/${roomKey}`} />;

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

export default StartRoom;
