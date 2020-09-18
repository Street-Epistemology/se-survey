import { QuestionGroup } from '../DataTypes';
import questionJson from '../files/questions.json';

export const loadData = () => {
  const result: QuestionGroup[] = JSON.parse(JSON.stringify(questionJson));
  return result;
};
