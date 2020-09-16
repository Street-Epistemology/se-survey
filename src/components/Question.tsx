import { QuestionResponse } from '../DataTypes';
import { ConfidenceLevels } from '../utils/Confidence';
import React from 'react';

export interface QuestionResponseProps {
  response: QuestionResponse;
  tickSymbol: string;
  questionNo: number | undefined;
  callback: (response: QuestionResponse) => void;
}

export const Question: React.FC<QuestionResponseProps> = ({
  response,
  tickSymbol,
  questionNo,
  callback,
}) => {
  const buttons = ConfidenceLevels.map((confidence) => {
    const isSelected = response.confidence === confidence;
    const value = {
      previousConfidence: response.confidence,
      confidence: confidence,
      question: response.question,
    };
    return (
      <td
        key={confidence}
        onClick={() => (isSelected ? null : callback(value))}
        className="td-check m-0 p-0 align-middle"
      >
        <div className="p-0">
          <span className="m-0">
            {response.confidence === confidence ? tickSymbol ?? '✓' : null}
          </span>
          <span className="m-0 opacity-30">
            {response.previousConfidence === confidence
              ? tickSymbol ?? '✓'
              : null}
          </span>
        </div>
      </td>
    );
  });
  return (
    <tr>
      <td className="scale-text">{questionNo + '. ' + response.question}</td>
      {buttons}
    </tr>
  );
};

export default Question;
