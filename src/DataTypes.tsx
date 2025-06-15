export interface Question {
  question: string;
}

export interface QuestionGroup {
  scaleTitle: string;
  questions: Question[];
  groupName: string;
}

export interface Survey {
  groups: QuestionGroup[];
  surveyTitle: string;
}

export type AnswerValue = string | number;

export interface Answer {
  questionKey: string;
  sectionKey: string;
  value: number;
}

export interface ServerAnswer {
  value: number;
}

export interface ServerSession {
  nickname?: string;
  filling: boolean;
  revealMyName: boolean;
  answers?: {
    [sectionKey: string]: {
      [questionKey: string]: {
        [answerKey: string]: ServerAnswer;
      };
    };
  };
  answer?: {
    [sectionKey: string]: {
      [questionKey: string]: ServerAnswer;
    };
  };
  lastQuestion?: {
    sectionKey: string;
    questionKey: string;
  };
}

export interface ServerRoom {
  sessions: {
    [sessionKey: string]: ServerSession;
  };
}

export interface ServerRooms {
  rooms: {
    [languageKey: string]: {
      [surveyKey: string]: {
        [roomKey: string]: ServerRoom;
      };
    };
  };
}

export interface ServerQuestion {
  text: string;
  values: number[];
}

export interface ServerSection {
  title: string;
  answersTitle: string;
  questions: {
    [questionKey: string]: ServerQuestion;
  };
  lastQuestion?: string;
}

export interface ServerSurvey {
  title?: string;
  sections: {
    [sectionKey: string]: ServerSection;
  };
}

export interface ServerSurveys {
  [languageKey: string]: {
    [surveyKey: string]: ServerSurvey;
  };
}

export type RouteParams = {
  lang: string;
  surveyKey?: string;
  roomKey?: string;
  sessionKey?: string;
};

export interface AboutTypes {
  description?: string;
  instructions?: string[];
  instructionsTitle?: string;
  more?: string;
  start?: string;
  title?: string;
}

export interface LanguageTranslations {
  [key: string]: string;
}

export interface Translations {
  [languageKey: string]: LanguageTranslations;
}

export type SessionType = 'hosting' | 'spectating';
