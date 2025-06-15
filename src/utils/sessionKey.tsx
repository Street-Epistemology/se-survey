export function getSessionKey({
  lang,
  roomKey,
  surveyKey,
}: {
  lang: string;
  roomKey: string;
  surveyKey: string;
}): string {
  return (
    localStorage.getItem(`${lang}_${surveyKey}_${roomKey}_sessionKey`) || ''
  );
}

export function setSessionKey({
  lang,
  surveyKey,
  roomKey,
  sessionKey,
}: {
  lang: string;
  surveyKey: string;
  roomKey: string;
  sessionKey: string;
}): void {
  localStorage.setItem(
    `${lang}_${surveyKey}_${roomKey}_sessionKey`,
    `${sessionKey}`,
  );
}
