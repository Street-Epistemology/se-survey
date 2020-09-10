import React, { Fragment } from "react";
import { Question } from "./Question";
import { QuestionResponse, QuestionGroup } from "../Types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngry,
  faFrown,
  faMeh,
  faSmile,
  faLaugh,
} from "@fortawesome/free-solid-svg-icons";

interface QuestionnaireProps {
  questionGroups: QuestionGroup[];
  tickSymbol: string;
  useEmoji?: boolean;
  handleSelection: (response: QuestionResponse) => void;
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({
  questionGroups,
  tickSymbol,
  useEmoji,
  handleSelection,
}) => {
  const defaultHeader = (groupName: string) => {
    return (
      <>
        <th className="bth align-middle">{groupName}</th>
        <th className="bth center align-middle text-center" colSpan={5}>
          Disagree ↔ Agree
        </th>
      </>
    );
  };
  const emojiHeader = (groupName: string) => {
    return (
      <>
        <th className="bth align-middle">{groupName}</th>
        <th className="bth center align-middle text-center">
          <FontAwesomeIcon icon={faAngry} />
        </th>
        <th className="bth center align-middle text-center">
          <FontAwesomeIcon icon={faFrown} />
        </th>
        <th className="bth center align-middle text-center">
          <FontAwesomeIcon icon={faMeh} />
        </th>
        <th className="bth center align-middle text-center">
          <FontAwesomeIcon icon={faSmile}/>
        </th>
        <th className="bth center align-middle text-center">
          <FontAwesomeIcon icon={faLaugh} />
        </th>
      </>
    );
  };
  return (
    <table className="table table-bordered table-hover ">
      {questionGroups.map((group, groupNo) => {
        return (
          <Fragment key={group.groupName}>
            <thead className="thead-dark">
              <tr>{useEmoji ? emojiHeader(group.groupName) : defaultHeader(group.groupName)}</tr>
            </thead>
            <tbody>
              {group.questions.map((question, questionNo) => {
                let lineNo = groupNo * 6 + questionNo + 1;
                return (
                  <Question
                    key={question.question}
                    tickSymbol={tickSymbol}
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
