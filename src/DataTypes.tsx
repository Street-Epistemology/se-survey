import { Confidence } from './utils/Confidence';

export interface QuestionResponse {
  previousConfidence: Confidence | undefined;
  confidence: Confidence | undefined;
  question: string;
}

export interface QuestionGroup {
  questions: QuestionResponse[];
  groupName: string;
}
