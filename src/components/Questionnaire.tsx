import React, { Fragment } from 'react';
import { QuestionResponse, QuestionGroup } from '../DataTypes';
import EmojiHeader from './EmojiHeader';
import Question from './Question';
import TextHeader from './TextHeader';

interface QuestionnaireProps {
  questionGroups: QuestionGroup[];
  lastResponse: QuestionResponse | null;
  tickSymbol: string;
  useEmoji?: boolean;
  showChanges?: boolean;
  handleSelection: (response: QuestionResponse) => void;
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({
  questionGroups,
  lastResponse,
  tickSymbol,
  useEmoji,
  showChanges,
  handleSelection,
}) => (
  <table className="table table-bordered table-hover ">
    {questionGroups.map((group, groupNo) => {
      return (
        <Fragment key={group.groupName}>
          <thead className="thead-dark">
            <tr>
              {useEmoji
                ? EmojiHeader(group.groupName)
                : TextHeader(group.groupName)}
            </tr>
          </thead>
          <tbody>
            {group.questions.map((question, questionNo) => {
              const lineNo = groupNo * group.questions.length + questionNo + 1;
              return (
                <Question
                  key={question.question}
                  tickSymbol={tickSymbol}
                  isActive={
                    lastResponse !== null &&
                    lastResponse.question === question.question
                  }
                  response={question}
                  questionNo={lineNo}
                  showChanges={showChanges}
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

export default Questionnaire;
