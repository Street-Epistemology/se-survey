import { QuestionGroup, QuestionResponse, Session } from './DataTypes';
import React, { useState } from 'react';
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

const App = () => {
  const firebase = React.useContext(FirebaseContext);
  const match: Router.match<TParams> = Router.useRouteMatch();
  const hist = Router.useHistory();

  const questionGroupsFromHash = mapHash(
    match.params.id,
    dataHelper.loadData()
  );

  const [useEmoji, setUseEmoji] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const [tickSymbol, setTickSymbol] = useState<string>('✓');
  const [questionGroups, setQuestionGroups] = useState<QuestionGroup[]>(
    questionGroupsFromHash
  );

  const inSession = session !== null;

  const handleSelection = (response: QuestionResponse) => {
    if (inSession) return;
    let newGroups = [...questionGroups];
    for (let group of newGroups) {
      for (let question of group.questions) {
        if (question.question === response.question)
          question.confidence = response.confidence;
      }
    }

    setQuestionGroups(newGroups);
  };

  const handleReset = () => {
    confirmAlert({
      title: 'Reset',
      message: 'Are you sure you want to clear all your answers?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            setQuestionGroups(loadData());
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
    confirmAlert({
      title: 'Reset',
      message: 'Are you sure you want to disconnect from the session "' + session?.name + '"?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            if (!session?.id) return;
            firebase?.unsubscribeFromSession(session.id, (session) => {
              const responses = mapper.mapSessionToQuestionGroups(session);
              setQuestionGroups(responses);
            });

            setSession(null);
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  const subscribeToSession = (session: Session) => {
    if (!session?.id) return;
    firebase?.subscribeToSession(session.id, (session) => {
      const responses = mapper.mapSessionToQuestionGroups(session);
      setQuestionGroups(responses);
    });

    setSession(session);
  };

  const hash = getHash(questionGroups);
  const hashExp = new RegExp('^A*$');
  const isEmpty = !hashExp || hashExp.test(hash);
  const url = getHashUrl(hash);
  const tweetUrl =
    'https://twitter.com/intent/tweet?text=' +
    encodeURI(
      'I completed the Street Epistemology questionnaire. Have a look at my results: &url=' +
        url
    );

  return (
    <div className="App">
      <Menu
        useEmoji={useEmoji}
        selectedSymbol={tickSymbol}
        inSession={inSession}
        onUseEmojiToggled={setUseEmoji}
        onSymbolSelected={setTickSymbol}
        onSessionSelected={subscribeToSession}
      />

      <div className="container fluid">
        <div>
          <Header />
          {!isEmpty ? (
            <ShareInfo
              hash={hash}
              showReset={!inSession}
              onCopy={handleCopy}
              onReset={handleReset}
              tweetUrl={tweetUrl}
            />
          ) : null}
        </div>
        {inSession && (
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
          questionGroups={questionGroups}
          tickSymbol={tickSymbol}
          useEmoji={useEmoji}
          handleSelection={handleSelection}
        />
      </div>
    </div>
  );
};

export default App;
