import { Confidence, ConfidenceLevels } from "../utils/Confidence";
import React from "react";

export interface QuestionResponse {
  confidence: Confidence | undefined;
  question: string;
}

export interface QuestionResponseProps {
  response: QuestionResponse;
  questionNo: number | undefined;
  callback: (response: QuestionResponse) => void;
}

export const Question: React.FC<QuestionResponseProps> = ({
  response,
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
        {response.confidence === confidence ? "✓" : null}
      </td>
    );
  });
  return (
    <tr>
      <td className="scale">{questionNo + ". " + response.question}</td>
      {buttons}
    </tr>
  );
};
