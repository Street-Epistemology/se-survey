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

export interface Survey {
  groups: QuestionGroup[];
  surveyTitle: string;
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

export type SessionType = 'hosting' | 'spectating';

export class SessionState {
  mySessionId: string | undefined;
  spectatingSession: Session | undefined;
  constructor(
    mySessionId: string | undefined,
    spectatingSession: Session | undefined
  ) {
    this.mySessionId = mySessionId;
    this.spectatingSession = spectatingSession;
  }
  type(): SessionType {
    return this.mySessionId === undefined ? 'hosting' : 'spectating';
  }
  get isHosting() {
    return this.mySessionId !== undefined;
  }
  get isSpectating() {
    return this.spectatingSession !== undefined;
  }
  get sessionId(): string | undefined {
    if (this.mySessionId) {
      return this.mySessionId;
    }
    if (this.spectatingSession?.id) {
      return this.spectatingSession?.id;
    }

    return undefined;
  }
}
