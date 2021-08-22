import React, { useEffect, useState } from 'react';
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
import Splash from '../components/Splash';

export default function Room(): JSX.Element {
  const { lang, roomKey, surveyKey } = Router.useParams<RouteParamTypes>();

  const roomURL = `${lang}/${surveyKey}/${roomKey}`;
  const roomURI = `/rooms/${roomURL}`;

  const sessionKey: string = getSessionKey({ lang, roomKey, surveyKey });

  const [room, setRoom] = useState<ServerRoom | undefined>();
  const [survey, setSurvey] = useState<ServerSurvey>({ sections: {} });
  const [t, setTranslations] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState('');

  useEffect(() => db.getOnOff(`/translations/${lang}`, setTranslations), [
    lang,
  ]);

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
    try {
      if (!sessionKey) {
        const sessionsURI = `${roomURI}/sessions`;
        const { key } = await db.push(sessionsURI);
        await db.set(`${sessionsURI}/${key}`, { filling: true, nickname });
        setSessionKey({ lang, surveyKey, roomKey, key });
        return;
      }
      await db.set(`${roomURI}/sessions/${sessionKey}/nickname`, nickname);
    } catch (error) {
      setError(error.toString().split(':').pop());
    }
  };

  const toggleRevealMyName = async () => {
    if (!sessionKey) return;
    db.set(
      `${roomURI}/sessions/${sessionKey}/revealMyName`,
      !room?.sessions[sessionKey]?.revealMyName
    );
  };

  const toggleFilling = async () => {
    if (!sessionKey) return;
    db.set(
      `${roomURI}/sessions/${sessionKey}/filling`,
      !room?.sessions[sessionKey]?.filling
    );
  };

  useEffect(() => db.getOnOff(`${roomURI}`, setRoom), [roomURI]);

  const handleCopy = () => {
    copy(getFullUrl(roomURL));
  };
  if (!sessionKey) {
    return (
      <Splash>
        <div className="row align-items-center">
          <div className="col-md" />
          <div className="col-md">
            <FillForm
              error={error}
              onSubmit={handleNickname}
              id="nickname"
              initialValue={room?.sessions[sessionKey]?.nickname}
              label={t.enterNickname}
              name="nickname"
              onChange={() => setError('')}
              submitLabel={t.joinRoom}
            />
          </div>
          <div className="col-md" />
        </div>
      </Splash>
    );
  }
  return (
    <div className="Room mb-4">
      <Menu
        error={error}
        onChange={() => setError('')}
        initialNicknameValue={room?.sessions[sessionKey]?.nickname}
        onNicknameSubmit={handleNickname}
        showDarkModeSwitcher={true}
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
        <div className="row row-cols-auto g-3 align-items-center">
          <button
            className="btn btn-primary RevealButton"
            onClick={toggleFilling}
          >
            {room?.sessions[sessionKey].filling
              ? t.revealAnswers
              : t.changeMyAnswers}
          </button>
          <div className="form-check mx-4">
            <input
              className="form-check-input"
              type="checkbox"
              onChange={toggleRevealMyName}
              value=""
              id="revealMyName"
              checked={!!room?.sessions[sessionKey].revealMyName}
            />
            <label className="form-check-label" htmlFor="revealMyName">
              {t.revealMyName}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
