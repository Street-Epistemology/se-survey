import { QuestionGroup, QuestionResponse } from './DataTypes';
import React, { useState } from 'react';
import questionJson from './files/questions.json';
import * as Router from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { mapHash, getHash } from './utils/Hasher';
import Header from './components/Header';
import Menu from './components/Menu';
import Questionnaire from './components/Questionnaire';
import ShareInfo from './components/ShareInfo';
import { getHashUrl } from './utils/UrlHelper';

export const loadData = () => {
  const result: QuestionGroup[] = JSON.parse(JSON.stringify(questionJson));
  return result;
};

type TParams = { id?: string | undefined };

const App = () => {
  const match: Router.match<TParams> = Router.useRouteMatch();
  const hist = Router.useHistory();

  const questionGroupsFromHash = mapHash(match.params.id, loadData());

  const [useEmoji, setUseEmoji] = useState<boolean>(true);
  const [tickSymbol, setTickSymbol] = useState<string>('✓');
  const [showChanges, setShowChanges] = useState<boolean>(true);
  const [questionGroups, setQuestionGroups] = useState<QuestionGroup[]>(
    questionGroupsFromHash
  );

  const handleSelection = (response: QuestionResponse) => {
    let newGroups = [...questionGroups];
    for (let group of newGroups) {
      for (let question of group.questions) {
        if (question.question === response.question) {
          question.confidence = response.confidence;
          question.previousConfidence = response.previousConfidence;
        }
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
        showChanges={showChanges}
        onUseEmojiToggled={setUseEmoji}
        onShowChangesToggled={setShowChanges}
        onSymbolSelected={setTickSymbol}
      />

      <div className="container fluid">
        <div>
          <Header />
          {!isEmpty ? (
            <ShareInfo
              hash={hash}
              onCopy={handleCopy}
              onReset={handleReset}
              tweetUrl={tweetUrl}
            />
          ) : null}
        </div>
        <Questionnaire
          questionGroups={questionGroups}
          tickSymbol={tickSymbol}
          useEmoji={useEmoji}
          showChanges={showChanges}
          handleSelection={handleSelection}
        />
      </div>
    </div>
  );
};

export default App;
