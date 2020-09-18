import { Confidence } from './utils/Confidence';

export interface QuestionResponse {
  confidence: Confidence | undefined;
  question: string;
}

export interface QuestionGroup {
  questions: QuestionResponse[];
  groupName: string;
}

export interface Session {
  id: Number | null;
  name: string;
  created: Date;
  isActive: boolean;
  initialResponses: Array<Confidence | null>;
  responses: Array<Confidence | null>;
  survey: string;
}
