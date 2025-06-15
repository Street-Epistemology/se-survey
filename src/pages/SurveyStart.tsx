import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { Link, Navigate, useParams } from 'react-router-dom';

import Splash, { getArrayFromPropKey } from '../components/Splash';
import { RouteParams, ServerSurveys, Translations } from '../DataTypes';
import * as db from '../firebase';
import { getAllTranslationsWithCache } from '../utils/translationCache';

const defaultLang = 'en';

export default function SurveyStart() {
  const { lang = defaultLang } = useParams<RouteParams>();
  const [translations, setTranslations] = useState<Translations>();
  const [surveys, setSurveys] = useState<ServerSurveys>();

  const languages = translations && Object.keys(translations);
  const t = translations?.[lang];

  useEffect(() => getAllTranslationsWithCache(setTranslations), []);
  useEffect(() => db.getOnOff(`/surveys/${lang}`, setSurveys), [lang]);

  if (languages && !languages.includes(lang)) {
    if (languages.includes(lang.split('-')[0])) {
      return <Navigate to={`/${lang.split('-')[0]}`} replace />;
    }

    return <Navigate to={defaultLang} replace />;
  }

  if (!t) return <></>;

  return (
    <Splash>
      <h4 className="text-xl">{t.description}</h4>
      <h5 className="my-4 text-xl">{t.instructionsTitle}</h5>
      <ol className="ml-2 list-inside list-decimal">
        {getArrayFromPropKey(t, 'instruction').map(
          (instruction: string, key: number) => (
            <li key={key}>{parse(instruction)}</li>
          ),
        )}
      </ol>
      {surveys &&
        Object.keys(surveys)
          .filter((surveyKey) => surveys[surveyKey].public)
          .map((surveyKey) => (
            <Link
              key={surveyKey}
              className="mt-4 block rounded-md bg-blue-600 px-4 py-2 text-center text-xl font-medium text-white hover:bg-blue-700"
              to={`/${lang}/${surveyKey}/new`}
            >
              {t.start}
            </Link>
          ))}
    </Splash>
  );
}
