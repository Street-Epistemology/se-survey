import { ServerQuestion } from '../../DataTypes';

export interface QuestionProps {
  question: ServerQuestion;
  questionNumber: number;
  renderValue: (value: number) => JSX.Element;
}

export default function Question({
  question,
  questionNumber,
  renderValue,
}: QuestionProps): JSX.Element {
  return (
    <tr>
      <td className="scale-text">{`${questionNumber}. ${question.text}`}</td>
      {question.values.map(renderValue)}
    </tr>
  );
}
