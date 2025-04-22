import { ReactNode, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { RouteParams } from '../DataTypes';
import * as db from '../firebase';
import ThemeSwitcher from './ThemeSwitcher';

export function getArrayFromPropKey(
  t: { [key: string]: string },
  key = 'instruction',
  arr: Array<string> = [],
  i = 1,
): Array<string> {
  if (t[`${key}${i}`]) {
    return getArrayFromPropKey(t, key, [...arr, t[`${key}${i}`]], i + 1);
  }
  return arr;
}

export default function Splash({ children }: { children?: ReactNode }) {
  const { lang } = useParams<RouteParams>();
  const [t, setTranslations] = useState<{ [key: string]: string }>({});

  useEffect(
    () => db.getOnOff(`/translations/${lang}`, setTranslations),
    [lang],
  );

  return (
    <div className="container mx-auto p-3">
      <div className="flex justify-end">
        <ThemeSwitcher />
      </div>
      <div className="my-10 flex flex-col items-center text-center">
        <Link to={`/${lang}`}>
          <img
            src="/se-logo-color.png"
            className="col-sm m-4 mx-auto h-auto max-w-50"
            alt="logo"
          />
        </Link>
        <h1 className="mt-6 text-3xl sm:text-6xl">{t.title || '...'}</h1>
      </div>
      {children}
    </div>
  );
}
