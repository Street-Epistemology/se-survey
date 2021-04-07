import React, { useEffect, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import logo from '../images/se-logo-color.png';
import { Link, Redirect, useParams } from 'react-router-dom';
import * as db from '../firebase';
import { AboutTypes, RouteParamTypes } from '../DataTypes';

const defaultLang = 'en';
const defaultsurveyKey = 'nathan';

export default function AboutPage(): JSX.Element {
  const {
    lang = defaultLang,
    surveyKey = defaultsurveyKey,
  } = useParams<RouteParamTypes>();
  const [about, setAbout] = useState<AboutTypes>({
    description: '...',
    instructions: ['...', '...', '...', '...'],
    instructionsTitle: '...',
    more: '...',
    start: '...',
    title: '...',
  });

  useEffect(() => db.getOnOff(`/translations/${lang}/about`, setAbout), [lang]);

  if (!about) {
    return <Redirect to={`/${defaultLang}`} />;
  }

  return (
    <div className="container fluid">
      <div className="jumbotron">
        <div className="container">
          <div className="col-md-auto text-center">
            <Link to={`/${lang}`}>
              <img src={logo} className="logo m-4 col-sm" alt="logo" />
            </Link>
          </div>
          <div className="col align-middle text-center">
            <h1 className="display-4 difference">{about.title}</h1>
          </div>
        </div>
      </div>
      <div className="container pb-4">
        <blockquote className="blockquote">
          <p>{about.description}</p>
        </blockquote>
        <h5>{about.instructionsTitle}</h5>
        <ol>
          {about.instructions?.map((instruction: string, key: number) => (
            <li key={key}>{ReactHtmlParser(instruction)}</li>
          ))}
        </ol>
        <div className="d-grid mx-auto">
          <Link
            className="btn btn-lg btn-primary"
            to={`/${lang}/${surveyKey}/new`}
          >
            {about.start}
          </Link>
        </div>
      </div>
    </div>
  );
}
