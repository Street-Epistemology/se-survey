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

export interface Session {
  id: string;
  created: Date;
  isActive: boolean;
  initialResponses: Array<Confidence | null>;
  responses: Array<Confidence | null>;
  survey: string;
  lastQuestionIndex: number | null;
}
