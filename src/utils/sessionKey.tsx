export function getSessionKey({
  lang,
  roomKey,
  surveyKey,
}: {
  lang: string;
  roomKey?: string;
  surveyKey?: string;
}): string {
  return (
    localStorage.getItem(`${lang}_${surveyKey}_${roomKey}_sessionKey`) || ''
  );
}

export function setSessionKey({
  key,
  lang,
  roomKey,
  surveyKey,
}: {
  key: string | null;
  lang: string;
  roomKey?: string | null;
  surveyKey?: string;
}): void {
  localStorage.setItem(`${lang}_${surveyKey}_${roomKey}_sessionKey`, `${key}`);
}
