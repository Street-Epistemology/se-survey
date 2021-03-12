import React from 'react';
import { Redirect } from 'react-router-dom';

export const RedirectLanguage = () => {
  return <Redirect to={navigator.language} />
};

export default RedirectLanguage;
