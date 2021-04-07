import { Redirect } from 'react-router-dom';

export default function RedirectLanguage(): JSX.Element {
  return <Redirect to={`/${navigator.language.split('-')[0]}`} />;
}
