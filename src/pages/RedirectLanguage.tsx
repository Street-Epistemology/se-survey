import { Navigate } from 'react-router-dom';

export default function RedirectLanguage() {
  return <Navigate to={`/${navigator.language.split('-')[0]}`} replace />;
}
