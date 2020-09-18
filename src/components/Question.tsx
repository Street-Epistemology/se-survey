import { QuestionResponse } from '../DataTypes';
import { ConfidenceLevels } from '../utils/Confidence';
import React from 'react';

export interface QuestionResponseProps {
  response: QuestionResponse;
  tickSymbol: string;
  questionNo: number | undefined;
  isActive?: boolean;
  callback: (response: QuestionResponse) => void;
}

export const Question: React.FC<QuestionResponseProps> = ({
  response,
  tickSymbol,
  isActive,
  questionNo,
  callback,
}) => {
  let buttons = ConfidenceLevels.map((confidence) => {
    let value = {
      confidence: confidence,
      question: response.question,
    };
    return (
      <td
        key={confidence}
        onClick={() => callback(value)}
        className="td-check m-0 p-0 align-middle"
      >
        {response.confidence === confidence ? tickSymbol ?? '✓' : null}
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
