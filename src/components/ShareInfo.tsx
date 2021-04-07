import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { getFullUrl } from '../utils/UrlHelper';

interface ShareInfoProps {
  onCopy: () => void;
  url: string;
}

export default function ShareInfo({
  onCopy,
  url,
}: ShareInfoProps): JSX.Element {
  return (
    <div className="ShareInfo">
      <div className="text-center mx-auto">
        Share this link with others and invite them to fill out the survey with
        you:
      </div>
      <div className="mb-2 text-center mx-auto">
        <div className="border rounded p-2 align-middle d-inline-block mt-2 bg-light">
          <Link className="text-break" to={`/${url}`}>
            {getFullUrl(url)}
          </Link>
        </div>
        <button
          className="btn btn-primary d-inline align-middle mx-1 mt-2"
          onClick={onCopy}
        >
          <FontAwesomeIcon icon={faCopy} />
        </button>
      </div>
    </div>
  );
}
