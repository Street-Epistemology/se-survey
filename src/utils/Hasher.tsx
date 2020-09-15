import { Confidence } from "./Confidence";
import { QuestionGroup } from "../Types";

const mapConfidenceToNumber = (confidence: Confidence | undefined): number => {
  return (confidence ?? -1) + 1;
};

const mapNumberToConfidence = (value: number): Confidence | undefined => {
  return value === 0 ? undefined : value - 1;
};

const toFlag = (
  pos1: Confidence | undefined,
  pos2: Confidence | undefined
): string => {
  const value = mapConfidenceToNumber(pos1) + mapConfidenceToNumber(pos2) * 6;
  return value > 25
    ? String.fromCharCode(22 + value)
    : String.fromCharCode(65 + value);
};

const fromFlag = (flag: string): Array<Confidence | undefined> => {
  const code = flag.charCodeAt(0);
  const value = code >= 64 ? flag.charCodeAt(0) - 65 : flag.charCodeAt(0) - 22;
  const pos1 = mapNumberToConfidence(value % 6);
  const pos2 = mapNumberToConfidence(Math.floor(value / 6));
  return [pos1, pos2];
};

export const getHash = (groups: QuestionGroup[]): string => {
  const questions = groups.flatMap((group) => group.questions);
  const hashChars: string[] = [];
  for (let i = 0; i < questions.length; i += 2) {
    const secondConfidence =
      i + 1 >= questions.length ? undefined : questions[i + 1].confidence;
    const pairFlag = toFlag(questions[i].confidence, secondConfidence);
    hashChars.push(pairFlag);
  }

  return hashChars.join("");
};

export const mapHash = (hash: string | undefined, mapTo: QuestionGroup[]): QuestionGroup[] => {
  if (hash === undefined) return mapTo;
  const questions = mapTo.flatMap((group) => group.questions);
  const setConfidenceAtIndex = (
    index: number,
    confidence: Confidence | undefined
  ): void => {
    if (index < questions.length) questions[index].confidence = confidence;
  };

  for (let i = 0; i < hash.length; i++) {
    const confidences = fromFlag(hash[i]);
    setConfidenceAtIndex(i * 2, confidences[0]);
    setConfidenceAtIndex(i * 2 + 1, confidences[1]);
  }

  return mapTo;
};
