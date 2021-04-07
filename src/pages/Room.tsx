import { useEffect, useState } from 'react';
import * as Router from 'react-router-dom';
import copy from 'clipboard-copy';

import {
  Answer,
  RouteParamTypes,
  ServerSurvey,
  ServerRoom,
  ServerSession,
} from '../DataTypes';

import Header from '../components/Header';
import Menu from '../components/Menu';
import ShareInfo from '../components/ShareInfo';
import SurveyForm from '../components/Survey/Form';
import { getFullUrl } from '../utils/UrlHelper';
import * as db from '../firebase';
import FillForm from '../components/FillForm';
import { getSessionKey, setSessionKey } from '../utils/sessionKey';

export default function Room(): JSX.Element {
  const { lang, roomKey, surveyKey } = Router.useParams<RouteParamTypes>();

  const roomURL = `${lang}/${surveyKey}/${roomKey}`;
  const roomURI = `/rooms/${roomURL}`;

  const sessionKey: string = getSessionKey({ lang, roomKey, surveyKey });

  const [room, setRoom] = useState<ServerRoom | undefined>();
  const [survey, setSurvey] = useState<ServerSurvey>({ sections: {} });

  useEffect(() => db.getOnOff(`/surveys/${lang}/${surveyKey}`, setSurvey), [
    lang,
    surveyKey,
  ]);

  const handleResponse = (answer: Answer) => {
    if (!answer || !sessionKey || !room?.sessions[sessionKey]?.filling) return;
    const newSession: ServerSession = { ...room?.sessions[sessionKey] };
    newSession.answer = {
      ...newSession.answer,
      [answer.sectionKey]: {
        ...newSession.answer?.[answer.sectionKey],
        [answer.questionKey]: {
          ...newSession.answer?.[answer.sectionKey]?.[answer.questionKey],
          value: answer.value,
        },
      },
    };
    newSession.lastQuestion = {
      questionKey: answer.questionKey,
      sectionKey: answer.sectionKey,
    };
    db.set(`${roomURI}/sessions/${sessionKey}`, newSession);
  };

  const handleNickname = async (nickname: string) => {
    if (!sessionKey) {
      const sessionsURI = `${roomURI}/sessions`;
      const { key } = await db.push(sessionsURI);
      db.set(`${sessionsURI}/${key}`, { filling: true, nickname });
      setSessionKey({ lang, surveyKey, roomKey, key });
      return;
    }
    db.set(`${roomURI}/sessions/${sessionKey}`, {
      ...room?.sessions[sessionKey],
      nickname,
    });
  };

  const toggleFilling = async () => {
    if (!sessionKey) return;
    db.set(`${roomURI}/sessions/${sessionKey}`, {
      ...room?.sessions[sessionKey],
      filling: !room?.sessions[sessionKey]?.filling,
    });
  };

  useEffect(() => db.getOnOff(`${roomURI}`, setRoom), [roomURI]);

  const handleCopy = () => {
    copy(getFullUrl(roomURL));
  };
  if (!sessionKey) {
    return (
      <div className="Room container py-4">
        <div className="row align-items-center">
          <div className="col-md" />
          <div className="col-md">
            <FillForm
              handleSubmit={handleNickname}
              id="nickname"
              initialValue={room?.sessions[sessionKey]?.nickname}
              label="Enter nickname"
              name="nickname"
              submitLabel="Start"
            />
          </div>
          <div className="col-md" />
        </div>
      </div>
    );
  }
  return (
    <div className="Room">
      <Menu
        initialNicknameValue={room?.sessions[sessionKey]?.nickname}
        onNicknameSubmit={handleNickname}
      />

      <div className="container-xxl">
        <div>
          <Header title={survey.title} />
          <ShareInfo onCopy={handleCopy} url={roomURL} />
        </div>
        <SurveyForm
          handleResponse={handleResponse}
          room={room}
          sessionKey={sessionKey}
          survey={survey}
        />
        <button
          className="btn btn-primary mb-4 RevealButton"
          onClick={toggleFilling}
        >
          {room?.sessions[sessionKey].filling
            ? 'Reveal all answers'
            : 'Change my answers'}
        </button>
      </div>
    </div>
  );
}
