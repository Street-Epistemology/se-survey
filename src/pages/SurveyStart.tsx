import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { Link, Navigate, useParams } from 'react-router-dom';

import Splash, { getArrayFromPropKey } from '../components/Splash';
import { RouteParams } from '../DataTypes';
import * as db from '../firebase';

const defaultLang = 'en';
const defaultsurveyKey = 'nathan';

export default function SurveyStart() {
  const { lang = defaultLang, surveyKey = defaultsurveyKey } =
    useParams<RouteParams>();
  const [t, setTranslations] = useState<{ [key: string]: string }>({});

  useEffect(
    () => db.getOnOff(`/translations/${lang}`, setTranslations),
    [lang],
  );

  if (!t?.description) {
    return <Navigate to={`/${defaultLang}`} replace />;
  }

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
      <Link
        className="mt-4 block rounded-md bg-blue-600 px-4 py-2 text-center text-xl font-medium text-white hover:bg-blue-700"
        to={`/${lang}/${surveyKey}/new`}
      >
        {t.start}
      </Link>
    </Splash>
  );
}
