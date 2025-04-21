import { Fragment, useEffect, useState } from 'react';
import { faCaretDown, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import copy from 'clipboard-copy';
import { Link, useParams } from 'react-router-dom';

import DarkModeSwitcher from '../components/DarkModeSwitcher';
import FillForm from '../components/FillForm';
import NickWithBadge from '../components/NickWithBadge';
import Splash from '../components/Splash';
import {
  Answer,
  RouteParams,
  ServerRoom,
  ServerSession,
  ServerSurvey,
} from '../DataTypes';
import * as db from '../firebase';
import logo from '../images/se-logo-color.png';
import getCharAt from '../utils/getCharAt';
import { getSessionKey, setSessionKey } from '../utils/sessionKey';

interface Sessions {
  [key: string]: {
    nickname: string;
    revealMyName: boolean;
  };
}

export default function Room() {
  const { lang = '', roomKey, surveyKey } = useParams<RouteParams>();

  const roomURL = `${lang}/${surveyKey}/${roomKey}`;
  const roomURLFull = `${window.location.protocol}//${window.location.host}/${roomURL}`;
  const roomURI = `/rooms/${roomURL}`;

  const sessionKey: string = getSessionKey({ lang, roomKey, surveyKey });

  const [room, setRoom] = useState<ServerRoom | undefined>();
  const [survey, setSurvey] = useState<ServerSurvey>({ sections: {} });
  const [t, setTranslations] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState('');

  useEffect(
    () => db.getOnOff(`/translations/${lang}`, setTranslations),
    [lang],
  );

  useEffect(
    () => db.getOnOff(`/surveys/${lang}/${surveyKey}`, setSurvey),
    [lang, surveyKey],
  );

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
        setSessionKey({
          lang: lang || '',
          surveyKey: surveyKey || '',
          roomKey: roomKey || '',
          key,
        });
        return;
      }
      await db.set(`${roomURI}/sessions/${sessionKey}/nickname`, nickname);
    } catch (error) {
      setError(
        (error instanceof Error && error.toString().split(':').pop()) ||
          'An error occurred',
      );
    }
  };

  const toggleRevealMyName = async () => {
    if (!sessionKey) return;
    db.set(
      `${roomURI}/sessions/${sessionKey}/revealMyName`,
      !room?.sessions[sessionKey]?.revealMyName,
    );
  };

  const toggleFilling = async () => {
    if (!sessionKey) return;
    db.set(
      `${roomURI}/sessions/${sessionKey}/filling`,
      !room?.sessions[sessionKey]?.filling,
    );
  };

  useEffect(() => db.getOnOff(`${roomURI}`, setRoom), [roomURI]);

  if (!sessionKey) {
    return (
      <Splash>
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
      </Splash>
    );
  }

  let previousQuestionsSum = 1;
  const initialNicknameValue = room?.sessions[sessionKey]?.nickname;

  return (
    <div className="my-10 p-3 print:!m-0 print:p-0 md:my-4">
      <div className="pointer-events-none fixed top-0 h-full w-full print:hidden">
        <div className="pointer-events-auto absolute right-0 top-0 float-right mx-4 my-2 flex flex-row">
          <div className="flex justify-end">
            <DarkModeSwitcher />
          </div>
          <Popover className="group ml-6 mr-3 flex justify-end">
            <PopoverButton
              aria-expanded="false"
              aria-haspopup="true"
              className="inline-flex items-center rounded-md bg-neutral-800 px-3 py-2 text-white shadow-sm transition-colors hover:bg-neutral-900 dark:bg-neutral-700 dark:hover:bg-neutral-800"
              id="dropdownMenuButton"
            >
              <NickWithBadge me nickname={initialNicknameValue || ''} />
              <FontAwesomeIcon
                className="ml-2 transition-transform group-data-[open]:rotate-180"
                icon={faCaretDown}
              />
            </PopoverButton>
            <PopoverPanel
              transition
              anchor="bottom"
              className="mt-2 w-56 rounded-md border bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
              aria-labelledby="dropdownMenuButton"
            >
              <div className="mx-2 py-2">
                <FillForm
                  error={error}
                  id="menuNickname"
                  initialValue={initialNicknameValue}
                  label="Enter nickname"
                  name="nickname"
                  onChange={() => setError('')}
                  onSubmit={handleNickname}
                  submitLabel="Set nickname"
                />
              </div>
              <div className="border-t border-neutral-200 dark:border-neutral-700"></div>
              <Link
                className="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                to={`/${lang}/about`}
              >
                About
              </Link>
            </PopoverPanel>
          </Popover>
        </div>
      </div>

      <div className="container mx-auto">
        <div>
          <div className="flex flex-col items-center md:flex-row">
            <div className="text-center md:w-auto">
              <Link to="/">
                <img
                  src={logo}
                  className="m-4 h-auto max-w-[200px] print:m-0 print:mb-2 print:w-10"
                  alt="logo"
                />
              </Link>
            </div>
            <div className="flex-1 text-center">
              <h3 className="w-full text-3xl font-semibold uppercase print:text-2xl">
                {survey.title}
              </h3>
            </div>
          </div>

          <div className="print:hidden">
            <div className="mx-auto text-center">
              Share this link with others and invite them to fill out the survey
              with you:
            </div>
            <div className="mx-auto mb-2 text-center">
              <Link
                className="mt-2 inline-block break-all rounded border border-neutral-300 bg-neutral-100 p-2 align-middle text-blue-600 underline transition-colors hover:text-blue-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-blue-400 dark:hover:text-blue-500"
                to={`/${roomURL}`}
              >
                {roomURLFull}
              </Link>

              <button
                className="mx-1 mt-2 rounded-md bg-blue-600 px-4 py-2 align-middle text-white transition-colors hover:bg-blue-700"
                onClick={() => copy(roomURLFull)}
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
          </div>
        </div>

        <table className="w-full">
          {Object.keys(survey.sections || {}).map((sectionKey) => {
            const section = survey.sections[sectionKey];
            const sectionStartNumber = previousQuestionsSum;
            previousQuestionsSum += Object.keys(section.questions || {}).length;
            return (
              <Fragment key={sectionKey}>
                <thead className="bg-neutral-800 text-neutral-100 dark:bg-black dark:text-neutral-300">
                  <tr>
                    <th className="border border-neutral-700 p-2 text-left align-middle text-sm print:!text-xs md:text-base lg:text-xl">
                      {section.title}
                    </th>
                    <th
                      className="border border-neutral-700 p-2 text-center align-middle text-sm print:!text-xs md:text-base lg:text-xl"
                      colSpan={5}
                    >
                      {section.answersTitle}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(section.questions || {}).map(
                    (questionKey, questionI) => {
                      const question = section.questions[questionKey];
                      const questionNumber = sectionStartNumber + questionI;
                      return (
                        <tr
                          key={questionKey}
                          className="hover:backdrop-brightness-95 dark:hover:backdrop-brightness-75 print:!backdrop-brightness-100"
                        >
                          <td className="border border-neutral-300 p-2 text-sm dark:border-neutral-700 print:!text-xs md:text-base lg:text-xl">{`${questionNumber}. ${question.text}`}</td>
                          {question.values.map((value) => {
                            const sessions: Sessions = Object.keys(
                              room?.sessions || {},
                            )
                              .sort((sessionKeyX) =>
                                sessionKey === sessionKeyX ? -1 : 0,
                              )
                              .reduce((sessions, sessionKeyX) => {
                                if (
                                  room?.sessions[sessionKeyX].answer?.[
                                    sectionKey
                                  ]?.[questionKey]?.value === value
                                ) {
                                  return {
                                    ...sessions,
                                    [sessionKeyX]: room?.sessions[sessionKeyX],
                                  };
                                }
                                return sessions;
                              }, {});

                            const sessionKeys = Object.keys(sessions);

                            return (
                              <td
                                className="m-0 h-12 w-12 min-w-[30px] cursor-pointer border border-neutral-300 p-0 text-center align-middle text-base dark:border-neutral-700 print:h-6 print:w-6 print:!text-xs md:min-w-[40px] md:text-lg lg:min-w-[50px] lg:text-xl"
                                key={value}
                                onClick={() =>
                                  handleResponse({
                                    questionKey,
                                    sectionKey,
                                    value,
                                  })
                                }
                              >
                                <span className="center m-0 flex flex-row justify-center text-2xl print:!text-base">
                                  {room?.sessions[sessionKey]?.filling ? (
                                    sessions[sessionKey] ? (
                                      '✓'
                                    ) : null
                                  ) : sessionKeys.length === 0 ? (
                                    <></>
                                  ) : (
                                    <>
                                      <div
                                        className={`group/value inline-flex items-center justify-center transition-colors ${sessionKeys.includes(sessionKey || '') ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-900 hover:bg-purple-950'} text-'} h-7 min-h-[28px] w-7 rounded-full text-base font-bold text-white`}
                                      >
                                        {sessionKeys.length === 1 &&
                                        sessions[sessionKeys[0]].revealMyName
                                          ? getCharAt(
                                              sessions[sessionKeys[0]]
                                                .nickname || '',
                                              0,
                                            )
                                          : sessionKeys.length}
                                        <div className="relative">
                                          <ul className="invisible absolute right-0 z-[1000] flex max-h-[150px] flex-col overflow-hidden overflow-y-auto rounded border border-neutral-300 bg-white text-neutral-700 opacity-0 transition-opacity duration-200 group-hover/value:visible group-hover/value:opacity-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 print:hidden">
                                            {sessionKeys.map((sessionKeyX) =>
                                              sessions[sessionKeyX]
                                                .revealMyName ? (
                                                <li
                                                  key={sessionKeyX}
                                                  className="inline-flex border-b border-neutral-300 p-2 dark:border-neutral-700"
                                                >
                                                  <NickWithBadge
                                                    me={
                                                      sessionKey === sessionKeyX
                                                    }
                                                    nickname={
                                                      sessions[sessionKeyX]
                                                        .nickname
                                                    }
                                                  />
                                                </li>
                                              ) : (
                                                <Fragment key={sessionKeyX} />
                                              ),
                                            )}
                                            {!!sessionKeys.find(
                                              (sessionKey) =>
                                                !sessions[sessionKey]
                                                  .revealMyName,
                                            ) && (
                                              <li className="inline-flex border-b border-neutral-300 p-2 last:border-b-0 dark:border-neutral-700">
                                                <NickWithBadge
                                                  me={
                                                    !!sessionKeys.filter(
                                                      (sessionKeyX) =>
                                                        !sessions[sessionKeyX]
                                                          .revealMyName &&
                                                        sessionKeyX ===
                                                          sessionKey,
                                                    ).length
                                                  }
                                                  badgeText={`${
                                                    sessionKeys.filter(
                                                      (sessionKey) =>
                                                        !sessions[sessionKey]
                                                          .revealMyName,
                                                    ).length
                                                  }`}
                                                  nickname="hidden"
                                                />
                                              </li>
                                            )}
                                          </ul>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </Fragment>
            );
          })}
        </table>

        {t.revealAnswers && t.changeMyAnswers && (
          <div className="mt-4 inline-flex flex-wrap gap-6 text-lg print:hidden">
            <button
              className="rounded-md bg-blue-600 px-4 py-2 text-center text-lg font-medium text-white transition-colors hover:bg-blue-700"
              onClick={toggleFilling}
            >
              {room?.sessions[sessionKey].filling
                ? t.revealAnswers
                : t.changeMyAnswers}
            </button>

            <div className="inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="h-4 w-4 cursor-pointer"
                onChange={toggleRevealMyName}
                value=""
                id="revealMyName"
                checked={!!room?.sessions[sessionKey].revealMyName}
              />

              <label htmlFor="revealMyName" className="cursor-pointer pl-2">
                {t.revealMyName}
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
