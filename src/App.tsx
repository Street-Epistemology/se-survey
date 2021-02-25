import {
  QuestionGroup,
  QuestionResponse,
  Session,
  SessionState,
} from './DataTypes';
import React, { useEffect, useRef, useState } from 'react';
import * as Router from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { mapHash, getHash } from './utils/Hasher';
import Header from './components/Header';
import Menu from './components/Menu';
import Questionnaire from './components/Questionnaire';
import ShareInfo from './components/ShareInfo';
import { getHashUrl } from './utils/UrlHelper';
import * as dataHelper from './utils/dataHelper';
import { FirebaseContext } from './firebase';
import { loadData } from './utils/dataHelper';
import * as mapper from './utils/mapper';
import SessionStatus from './components/SessionStatus';

type TParams = { hash?: string | undefined };

const App = () => {
  const firebase = React.useContext(FirebaseContext);
  const match: Router.match<TParams> = Router.useRouteMatch();
  const hist = Router.useHistory();

  const questionGroupsFromHash = mapHash(
    match.params.hash,
    dataHelper.loadData()
  );

  const handleUnload = (event: BeforeUnloadEvent) => {
    const id = sessionState?.sessionId;
    if (!id) return;
    if (sessionState?.isHosting) {
      firebase?.closeSession(id);
    }
    if (sessionState?.isSpectating) {
      firebase?.unsubscribeFromSession(id);
    }
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleUnload);
    if (isComplete && thankYou && thankYou.current) {
      thankYou.current.scrollIntoView({ behavior: 'auto' });
    }
    return () => window.removeEventListener('beforeunload', handleUnload);
  });

  const [useEmoji, setUseEmoji] = useState<boolean>(true);
  const [sessionState, setSessionState] = useState<SessionState>();
  const [tickSymbol, setTickSymbol] = useState<string>('✓');
  const [showChanges, setShowChanges] = useState<boolean>(false);
  const [responseState, setResponseState] = useState<
    [QuestionGroup[], QuestionResponse | null]
  >([questionGroupsFromHash, null]);

  const isSpectator =
    sessionState !== undefined && sessionState.spectatingSession !== undefined;

  const handleResponse = (response: QuestionResponse) => {
    if (isSpectator) return;
    let newGroups = [...responseState[0]];
    for (let group of newGroups) {
      for (let question of group.questions) {
        if (question.question === response.question) {
          question.confidence = response.confidence;
          question.previousConfidence = response.previousConfidence;
        }
      }
    }

    const newState: [QuestionGroup[], QuestionResponse] = [
      newGroups,
      { ...response } as QuestionResponse,
    ];

    if (sessionState !== undefined && sessionState.mySessionId !== undefined)
      firebase?.updateSession(sessionState.mySessionId, newState);
    setResponseState(newState);
  };

  const handleReset = () => {
    confirmAlert({
      title: 'Reset',
      message: 'Are you sure you want to clear all your answers?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            setResponseState([loadData(), null]);
            hist.push('/');
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  const handleCopy = () => {
    const copy = require('clipboard-copy');
    copy(url);
  };

  const unsubscribeFromSession = () => {
    const id = sessionState?.sessionId;
    if (!id) return;
    if (sessionState?.isHosting) {
      confirmAlert({
        title: 'Disconnect from Session',
        message: 'Are you sure you want to stop broadcasting your session?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              firebase?.closeSession(id);
              setSessionState(undefined);
            },
          },
          {
            label: 'No',
            onClick: () => {},
          },
        ],
      });
      return;
    }
    confirmAlert({
      title: 'Disconnect from Session',
      message:
        'Are you sure you want to disconnect from the session "' + id + '"?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            firebase?.unsubscribeFromSession(id);
            setSessionState(undefined);
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  const handleSessionChange = (session: Session) => {
    const groups = mapper.mapSessionToQuestionGroups(session);
    const responses = mapper.flattenQuestionGroups(groups);
    const index = session.lastQuestionIndex;
    let changedResponse: QuestionResponse | null = null;
    if (index !== null)
      changedResponse = index < responses.length ? responses[index] : null;

    setResponseState([groups, { ...changedResponse } as QuestionResponse]);
  };

  const subscribeToSession = (session: Session) => {
    if (!session?.id) return;
    firebase?.subscribeToSession(session.id, handleSessionChange);
    setSessionState(new SessionState(undefined, session));
  };

  const hash = getHash(responseState[0]);
  const thankYou = useRef<HTMLDivElement>(null);
  const hashExp = new RegExp('^A*$');
  const isEmpty = !hashExp || hashExp.test(hash);
  const isComplete = mapper
    .flattenQuestionGroups(responseState[0])
    .every((q) => q.confidence !== undefined);
  const url = getHashUrl(hash);
  const tweetUrl =
    'https://twitter.com/intent/tweet?text=' +
    encodeURI(
      'I completed the Street Epistemology questionnaire. Have a look at my results: &url=' +
        url
    );

  const handleSessionStarted = (sessionId: string) => {
    debugger;
    firebase?.createSession(sessionId, responseState);
    setSessionState(new SessionState(sessionId, undefined));
  };

  return (
    <div className="App">
      <Menu
        useEmoji={useEmoji}
        selectedSymbol={tickSymbol}
        inSession={isSpectator}
        showChanges={showChanges}
        onUseEmojiToggled={setUseEmoji}
        onShowChangesToggled={setShowChanges}
        onSymbolSelected={setTickSymbol}
        onSessionSelected={subscribeToSession}
        onSessionStarted={handleSessionStarted}
      />

      <div className="container fluid">
        <div>
          <Header />
          {!isEmpty ? (
            <ShareInfo
              hash={hash}
              showReset={!isSpectator}
              onCopy={handleCopy}
              onReset={handleReset}
              tweetUrl={tweetUrl}
            />
          ) : null}
          <SessionStatus
            sessionState={sessionState}
            onDisconnect={unsubscribeFromSession}
          />
        </div>
        <Questionnaire
          questionGroups={responseState[0]}
          lastResponse={responseState[1]}
          tickSymbol={tickSymbol}
          useEmoji={useEmoji}
          showChanges={showChanges}
          handleSelection={handleResponse}
        />
        {isComplete ? (
          <div ref={thankYou} className="jumbotron">
            <h2 className="display-4 difference  text-center text-uppercase">
              Thanks for completing the questionnaire!
            </h2>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default App;
