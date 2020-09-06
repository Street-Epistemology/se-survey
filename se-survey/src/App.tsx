import React, { useState } from 'react';
import logo from './images/se-logo-color.png';
import questionJson from './files/questions.json';
import { QuestionResponse, Question } from './components/Question';

interface QuestionGroup {
  questions: QuestionResponse[];
  groupName: string;
}

const loadData = () => {
  const result: QuestionGroup[] = JSON.parse(JSON.stringify(questionJson));
  return result;
};

const App = () => {
  const [questionGroups, setQuestionGroups] = useState<QuestionGroup[]>(
    loadData()
  );

  const handleSelection = (response: QuestionResponse) => {
    let newGroups = [...questionGroups];
    for (let group of newGroups) {
      for (let question of group.questions) {
        if (question.question === response.question)
          question.confidence = response.confidence;
      }
    }

    setQuestionGroups(newGroups);
    console.log(newGroups);
  };

  return (
    <div className="App">
      <div className="container-m">
        <tr>
          <th>
            <img src={logo} height={100} className="App-logo" alt="logo" />
          </th>
          <th>{'\tHOW DO WE KNOW\n\rWHAT WE KNOW?'}</th>
        </tr>
      </div>
      <div className="scrl container-m">
        {questionGroups.map((group, groupNo) => {
          return (
            <>
              <tr>
                <th className="bth" colSpan={2}>
                  {group.groupName}
                </th>
                <th className="bth" colSpan={5}>
                  Disagree ↔ Agree
                </th>
              </tr>
              {group.questions.map((question, questionNo) => {
                let lineNo = groupNo * 6 + questionNo + 1;
                return (
                  <Question
                    key={question.question}
                    response={question}
                    questionNo={lineNo}
                    callback={handleSelection}
                  />
                );
              })}
            </>
          );
        })}
      </div>
    </div>
  );
};

export default App;
