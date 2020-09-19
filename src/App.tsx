import { QuestionGroup, QuestionResponse, Session } from './DataTypes';
import React, { useEffect, useState } from 'react';
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

type TParams = { id?: string | undefined };

interface SessionState {
  mySessionId: string | undefined;
  spectatingSession: Session | undefined;
}

const App = () => {
  const firebase = React.useContext(FirebaseContext);
  const match: Router.match<TParams> = Router.useRouteMatch();
  const hist = Router.useHistory();

  const questionGroupsFromHash = mapHash(
    match.params.id,
    dataHelper.loadData()
  );

  const [useEmoji, setUseEmoji] = useState<boolean>(true);
  const [sessionState, setSessionState] = useState<SessionState>();
  const [tickSymbol, setTickSymbol] = useState<string>('✓');
  const [showChanges, setShowChanges] = useState<boolean>(true);
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
    const id = sessionState?.spectatingSession?.id;
    if (!id) return;
    confirmAlert({
      title: 'Disconnect from Session',
      message:
        'Are you sure you want to disconnect from the session "' + id + '"?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            firebase?.unsubscribeFromSession(id);
            setSessionState({
              mySessionId: sessionState?.mySessionId,
              spectatingSession: undefined,
            });
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
    setSessionState({
      mySessionId: undefined,
      spectatingSession: session,
    });
  };

  const hash = getHash(responseState[0]);
  const hashExp = new RegExp('^A*$');
  const isEmpty = !hashExp || hashExp.test(hash);
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
    setSessionState({
      mySessionId: sessionId,
      spectatingSession: undefined,
    });
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
        </div>
        {isSpectator && (
          <div>
            <button
              className="btn btn-warning"
              onClick={unsubscribeFromSession}
            >
              Disconnect
            </button>
          </div>
        )}
        <Questionnaire
          questionGroups={responseState[0]}
          lastResponse={responseState[1]}
          tickSymbol={tickSymbol}
          useEmoji={useEmoji}
          showChanges={showChanges}
          handleSelection={handleResponse}
        />
      </div>
    </div>
  );
};

export default App;
