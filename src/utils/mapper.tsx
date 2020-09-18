import { Session } from '../DataTypes';
import { loadData } from './dataHelper';

export const mapSessionToQuestionGroups = (session: Session) => {
  const result = loadData();
  let index = 0;
  for (let i = 0; i < result.length; i++) {
    const group = result[i];
    for (let j = 0; j < group.questions.length; j++) {
      const question = group.questions[j];
      if (index <= session.responses.length) {
        question.confidence = session.responses[index] ?? undefined;
      }

      if (index <= session.initialResponses.length) {
        // question.previousConfidence = session.responses[index] ?? undefined;
      }

      index++;
    }
  }

  return result;
};

export const mapAnyToSession = (input: any) => {
  return { ...input } as Session;
};
