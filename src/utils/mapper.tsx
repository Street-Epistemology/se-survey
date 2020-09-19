import { QuestionGroup, QuestionResponse, Session } from '../DataTypes';
import { loadData } from './dataHelper';

export const mapSessionToQuestionGroups = (session: Session) => {
  const result = loadData();
  let index = 0;
  for (let i = 0; i < result.length; i++) {
    const group = result[i];
    for (let j = 0; j < group.questions.length; j++) {
      const question = group.questions[j];
      if (session.responses && index in session.responses) {
        question.confidence = session.responses[index] ?? undefined;
      }

      if (session.initialResponses && index in session.initialResponses) {
        question.previousConfidence =
          session.initialResponses[index] ?? undefined;
      }

      index++;
    }
  }

  return result;
};

export const mapAnyToSession = (input: any) => {
  return { ...input } as Session;
};

export const flattenQuestionGroups = (input: QuestionGroup[]) => {
  return ([] as QuestionResponse[]).concat(
    ...input.map((group) => group.questions)
  );
};

export const mapStateToSerializableSession = (
  input: [QuestionGroup[], QuestionResponse | null]
) => {
  const questions = flattenQuestionGroups(input[0]);
  const responses = questions.map((q) => q.confidence ?? null);
  const initialResponses = questions.map((q) => q.previousConfidence ?? null);
  const lastResponse = input[1];
  const lastIndex = lastResponse
    ? questions.indexOf(lastResponse)
    : questions.length - 1;
  return {
    created: new Date().toISOString(),
    isActive: true,
    responses: responses,
    initialResponses: initialResponses,
    survey: 'default',
    lastQuestionIndex: lastIndex < 0 ? null : lastIndex,
  };
};
