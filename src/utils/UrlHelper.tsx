export const getBaseUrl = () =>
  window.location.protocol + '//' + window.location.host;
export const getHashUrl = (hash: string) => getBaseUrl() + '/' + hash;
