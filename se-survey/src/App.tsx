import React, { useState, Fragment } from "react";
import logo from "./images/se-logo-color.png";
import questionJson from "./files/questions.json";
import { QuestionResponse, Question } from "./components/Question";
import { Confidence } from "./utils/Confidence";
import { useRouteMatch, match, useHistory } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

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

  return hashChars.join("");
};

const loadHash = (hash: string | undefined): QuestionGroup[] => {
  const result = loadData();
  if (hash === undefined) return result;
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
    <table className="table table-bordered table-hover ">
      {questionGroups.map((group, groupNo) => {
        return (
          <Fragment key={group.groupName}>
            <thead className="thead-dark">
              <tr>
                <th className="bth align-middle">{group.groupName}</th>
                <th className="bth center align-middle text-center" colSpan={5}>
                  Disagree ↔ Agree
                </th>
              </tr>
            </thead>
            <tbody>
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
            </tbody>
          </Fragment>
        );
      })}
    </table>
  );
};

type TParams = { id?: string | undefined };

const App = () => {
  const match: match<TParams> = useRouteMatch();
  const hist = useHistory();
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
  };

  const onReset = () => {
    confirmAlert({
      title: "Reset",
      message: "Are you sure you want to clear all your answers?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            setQuestionGroups(loadData());
            hist.push("/");
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const onCopy = () => {
    const copy = require("clipboard-copy");
    copy(url);
  };

  const hash = getHash(questionGroups);
  const hashExp = new RegExp("^A*$");
  const isEmpty = !hashExp || hashExp.test(hash);
  const url =
    window.location.protocol + "//" + window.location.host + "/" + hash;
  const tweetUrl =
    "https://twitter.com/intent/tweet?text=" +
    encodeURI(
      "I completed the Street Epistemology questionnaire. Have a look at my results: &url=" +
        url
    );

  return (
    <div className="App">
      <div className="container fluid">
        <div>
          <div className="row align-items-center">
            <div className="col-md-auto text-center">
              <img src={logo} className="logo m-4 col-sm" alt="logo" />
            </div>
            <div className="col align-middle">
              <h3 className="col-sm text-center text-uppercase">
                How do we know what we know?
              </h3>
            </div>
          </div>
          {!isEmpty ? (
            <div className="mb-2 text-center mx-auto">
              <div className="border rounded p-2 align-middle d-inline-block mt-2 bg-light">
                <a className="text-break" href={url}>
                  {url}
                </a>
              </div>
              <button
                className="btn btn-primary d-inline align-middle ml-1 mt-2"
                onClick={onCopy}
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
              <button
                className="btn btn-primary d-inline align-middle ml-1 mt-2"
                onClick={onReset}
              >
                Reset
              </button>
              <button
                className="btn btn-primary d-inline align-middle ml-1 mt-2 mt-twitter-share-button"
                onClick={() => (window.location.href = tweetUrl)}
              >
                Tweet
              </button>
            </div>
          ) : null}
        </div>
        <Questionnaire
          questionGroups={questionGroups}
          handleSelection={handleSelection}
        />
      </div>
    </div>
  );
};

export default App;
