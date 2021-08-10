import React, { useEffect, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { Link, Redirect, useParams } from 'react-router-dom';
import * as db from '../firebase';
import { RouteParamTypes } from '../DataTypes';
import Splash, { getArrayFromPropKey } from '../components/Splash';

const defaultLang = 'en';
const defaultsurveyKey = 'nathan';

export default function AboutPage(): JSX.Element {
  const {
    lang = defaultLang,
    surveyKey = defaultsurveyKey,
  } = useParams<RouteParamTypes>();
  const [t, setTranslations] = useState<{ [key: string]: string }>({});

  useEffect(() => db.getOnOff(`/translations/${lang}`, setTranslations), [
    lang,
  ]);

  if (!t.description) {
    return <Redirect to={`/${defaultLang}`} />;
  }

  return (
    <Splash>
      <blockquote className="blockquote">
        <p>{t.description}</p>
      </blockquote>
      <h5>{t.instructionsTitle}</h5>
      <ol>
        {getArrayFromPropKey(t, 'instruction').map(
          (instruction: string, key: number) => (
            <li key={key}>{ReactHtmlParser(instruction)}</li>
          )
        )}
      </ol>
      <div className="d-grid mx-auto">
        <Link
          className="btn btn-lg btn-primary"
          to={`/${lang}/${surveyKey}/new`}
        >
          {t.start}
        </Link>
      </div>
    </Splash>
  );
}
