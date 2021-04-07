import getCharAt from '../utils/getCharAt';

export default function NickBadge({
  hover,
  me,
  nickname,
  opaque,
}: {
  hover?: boolean;
  me?: boolean;
  nickname: string;
  opaque?: boolean;
}): JSX.Element {
  return (
    <div
      className={`nickBadge${me ? ' myNickBadge' : ''}${
        opaque ? ' opacity-30' : ''
      }`}
    >
      {getCharAt(nickname || '', 0)}
      {hover ? (
        <div className="nickMenuContainer">
          <ul className="list-group nickMenu shadow">
            <li className="list-group-item">
              <NickBadge me={me} nickname={nickname} />
              <div
                className="overflow-hidden"
                style={{ maxWidth: '150px', textOverflow: 'ellipsis' }}
              >
                {nickname}
              </div>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
