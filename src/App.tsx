import {
  QuestionGroup,
  QuestionResponse,
  Session,
  SessionState,
  Survey,
} from './DataTypes';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Router from 'react-router-dom';
import Header from './components/Header';
import Menu from './components/Menu';
import Questionnaire from './components/Questionnaire';
import ShareInfo from './components/ShareInfo';
import { getHashUrl } from './utils/UrlHelper';
import { FirebaseContext } from './firebase';
import * as mapper from './utils/mapper';

interface ParamTypes {
  lang: string,
  surveyID: string,
  sessionID: string
}

const App = () => {
  const firebase = React.useContext(FirebaseContext);
  const { lang, surveyID, sessionID } = Router.useParams<ParamTypes>();

  const responsesID = `${lang}/${surveyID}/${sessionID}`;

  const handleUnload = (event: BeforeUnloadEvent) => {
    firebase?.unsubscribeFromSession(responsesID);
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleUnload);
    if (isComplete && thankYou && thankYou.current) {
      thankYou.current.scrollIntoView({ behavior: 'auto' });
    }
    return () => window.removeEventListener('beforeunload', handleUnload);
  });

  const [useEmoji, setUseEmoji] = useState<boolean>(false);
  const [sessionState, setSessionState] = useState<SessionState>();
  const [tickSymbol, setTickSymbol] = useState<string>('✓');
  const [showChanges, setShowChanges] = useState<boolean>(false);
  const [survey, setSurvey] = useState<Survey>({ groups: [], surveyTitle: ''});
  const [responseState, setResponseState] = useState<
    [QuestionGroup[], QuestionResponse | null]
  >([[], null]);

  useEffect(() => {
    firebase?.getSurvey((survey) => {
      setSurvey(survey);
    }, surveyID);
  }, [firebase, surveyID]);

  const isSpectator =
    sessionState !== undefined && sessionState.spectatingSession !== undefined;

  const handleResponse = (response: QuestionResponse) => {
    if (isSpectator || !response) return;
    let newGroups = [...survey.groups];
    for (let group of newGroups) {
      if (group?.questions) {
        for (let question of group.questions) {
          if (question?.question === response?.question) {
            question.confidence = response.confidence;
            question.previousConfidence = response.previousConfidence;
          }
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

  const handleCopy = () => {
    const copy = require('clipboard-copy');
    copy(url);
  };

  const handleSessionChange = useCallback((session: Session) => {
    console.log('sessionChange', session);
    const groups = mapper.mapSessionToQuestionGroups(survey.groups, session);
    const responses = mapper.flattenQuestionGroups(groups);
    const index = session.lastQuestionIndex;
    let changedResponse: QuestionResponse | null = null;
    if (index !== null)
      changedResponse = index < responses.length ? responses[index] : null;

    setResponseState([groups, { ...changedResponse } as QuestionResponse]);
  }, [survey.groups]);

  useEffect(() => {
    setSessionState(new SessionState(responsesID, undefined));
    firebase?.subscribeToSession(responsesID, handleSessionChange);
  }, [responsesID, firebase, handleSessionChange]);

  const thankYou = useRef<HTMLDivElement>(null);
  const isComplete = false;
  const url = getHashUrl(responsesID);
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
        showChanges={showChanges}
        onUseEmojiToggled={setUseEmoji}
        onShowChangesToggled={setShowChanges}
        onSymbolSelected={setTickSymbol}
      />

      <div className="container fluid">
        <div>
          <Header title={survey.surveyTitle} />
          <ShareInfo
            hash={responsesID}
            onCopy={handleCopy}
            tweetUrl={tweetUrl}
          />
        </div>
        <Questionnaire
          questionGroups={survey.groups}
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
