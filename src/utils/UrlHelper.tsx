export const getBaseUrl = (): string =>
  window.location.protocol + '//' + window.location.host;
export const getFullUrl = (relativeURL: string): string =>
  getBaseUrl() + '/' + relativeURL;
