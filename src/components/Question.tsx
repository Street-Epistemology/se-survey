import { QuestionResponse } from '../DataTypes';
import { ConfidenceLevels } from '../utils/Confidence';
import React from 'react';

export interface QuestionProps {
  response: QuestionResponse;
  tickSymbol: string;
  questionNo: number | undefined;
  isActive?: boolean;
  showChanges?: boolean;
  callback: (response: QuestionResponse) => void;
}

export const Question: React.FC<QuestionProps> = ({
  response,
  tickSymbol,
  isActive,
  questionNo,
  showChanges,
  callback,
}) => {
  const buttons = ConfidenceLevels.map((confidence) => {
    const value = {
      previousConfidence: response.confidence,
      confidence: confidence,
      question: response.question,
    };
    return (
      <td
        key={confidence}
        onClick={() => callback(value)}
        className="td-check m-0 p-0 align-middle"
      >
        <div className="p-0">
          <span className="m-0">
            {response.confidence === confidence ? tickSymbol ?? '✓' : null}
          </span>
          {showChanges ? (
            <span className="m-0 opacity-30">
              {response.previousConfidence === confidence
                ? tickSymbol ?? '✓'
                : null}
            </span>
          ) : null}
        </div>
      </td>
    );
  });
  return (
    <tr className={isActive ? 'table-primary' : ''}>
      <td className="scale-text">{questionNo + '. ' + response.question}</td>
      {buttons}
    </tr>
  );
};

export default Question;
