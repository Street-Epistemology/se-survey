import React, { useState } from 'react';
import logo from './images/se-logo-color.png';
import questionJson from './files/questions.json';
import { QuestionResponse, Question } from './components/Question';
import { Confidence } from './utils/Confidence';
import { stringify } from 'querystring';
import { useRouteMatch, match } from 'react-router-dom';
import { Match } from '@testing-library/react';

interface QuestionGroup {
  questions: QuestionResponse[];
  groupName: string;
}

const loadData = () => {
  const result: QuestionGroup[] = JSON.parse(JSON.stringify(questionJson));
  return result;
};

const mapConfidenceToNumber = (confidence: Confidence | undefined): number => {
  return (confidence ?? -1) + 1;
};

const mapNumberToConfidence = (value: number): Confidence | undefined => {
  return value === 0 ? undefined : value - 1;
};

const toFlag = (
  pos1: Confidence | undefined,
  pos2: Confidence | undefined
): string => {
  const value = mapConfidenceToNumber(pos1) + mapConfidenceToNumber(pos2) * 6;
  return value > 25
    ? String.fromCharCode(22 + value)
    : String.fromCharCode(65 + value);
};

const fromFlag = (flag: string): Array<Confidence | undefined> => {
  const code = flag.charCodeAt(0);
  const value = code >= 64 ? flag.charCodeAt(0) - 65 : flag.charCodeAt(0) - 22;
  const pos1 = mapNumberToConfidence(value % 6);
  const pos2 = mapNumberToConfidence(Math.floor(value / 6));
  return [pos1, pos2];
};

const getHash = (groups: QuestionGroup[]): string => {
  const questions = groups.flatMap((group) => group.questions);
  const hashChars: string[] = [];
  for (let i = 0; i < questions.length; i += 2) {
    const secondConfidence =
      i + 1 >= questions.length ? undefined : questions[i + 1].confidence;
    const pairFlag = toFlag(questions[i].confidence, secondConfidence);
    hashChars.push(pairFlag);
  }

  return hashChars.join('');
};

const loadHash = (hash: string | undefined): QuestionGroup[] => {
  const result = loadData();
  if (hash == undefined) return result;
  const questions = result.flatMap((group) => group.questions);
  const setConfidenceAtIndex = (
    index: number,
    confidence: Confidence | undefined
  ): void => {
    if (index < questions.length) questions[index].confidence = confidence;
  };

  for (let i = 0; i < hash.length; i++) {
    const confidences = fromFlag(hash[i]);
    setConfidenceAtIndex(i * 2, confidences[0]);
    setConfidenceAtIndex(i * 2 + 1, confidences[1]);
  }

  return result;
};

interface QuestionnaireProps {
  questionGroups: QuestionGroup[];
  handleSelection: (response: QuestionResponse) => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({
  questionGroups,
  handleSelection,
}) => {
  return (
    <div className="container-s">
      <table className="table table-bordered table-bordered ">
        <thead>
          <tr>
            <th scope="col">
              <img src={logo} height={100} className="App-logo" alt="logo" />
            </th>
            <th scope="col" align="center">
              <h3>HOW DO WE KNOW WHAT WE KNOW?</h3>
            </th>
          </tr>
        </thead>
        {questionGroups.map((group, groupNo) => {
          return (
            <>
              <thead className="thead-dark">
                <tr>
                  <th className="bth" colSpan={2}>
                    {group.groupName}
                  </th>
                  <th className="bth" colSpan={5}>
                    Disagree ↔ Agree
                  </th>
                </tr>
              </thead>
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
      </table>
    </div>
  );
};

type TParams = { id?: string | undefined };  

const App = () => {
  const match : match<TParams> = useRouteMatch();
  const [questionGroups, setQuestionGroups] = useState<QuestionGroup[]>(
    loadHash(match.params.id)
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
    console.log(getHash(newGroups));
  };

  return (
    <div className="App">
      <Questionnaire
        questionGroups={questionGroups}
        handleSelection={handleSelection}
      />
    </div>
  );
};

export default App;
