import { Confidence } from "./utils/Confidence";

export interface QuestionResponse {
  confidence: Confidence | undefined;
  question: string;
}

export interface QuestionGroup {
  questions: QuestionResponse[];
  groupName: string;
}
