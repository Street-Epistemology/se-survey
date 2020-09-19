import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { getHashUrl } from '../utils/UrlHelper';

interface ShareInfoProps {
  hash: string;
  showReset: boolean;
  onCopy: () => void;
  onReset: () => void;
  tweetUrl: string;
}

const ShareInfo: React.FC<ShareInfoProps> = ({
  hash,
  showReset,
  onCopy,
  onReset,
  tweetUrl,
}) => {
  return (
    <div className="mb-2 text-center mx-auto">
      <div className="border rounded p-2 align-middle d-inline-block mt-2 bg-light">
        <Link className="text-break" to={'/' + hash}>
          {getHashUrl(hash)}
        </Link>
      </div>
      <button
        className="btn btn-primary d-inline align-middle ml-1 mt-2"
        onClick={onCopy}
      >
        <FontAwesomeIcon icon={faCopy} />
      </button>
      <button
        className="btn btn-primary d-inline align-middle ml-1 mt-2"
        onClick={onReset}
        disabled={!showReset}
      >
        Reset
      </button>
      <button
        className="btn btn-primary d-inline align-middle ml-1 mt-2 mt-twitter-share-button"
        onClick={() => window.open(tweetUrl, '_blank')}
      >
        Tweet
      </button>
    </div>
  );
};

export default ShareInfo;
