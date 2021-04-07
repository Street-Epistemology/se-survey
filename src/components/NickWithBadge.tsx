import NickBadge from './NickBadge';

export default function NickWithBadge({
  nickname,
  me,
}: {
  me?: boolean;
  nickname: string;
}): JSX.Element {
  return (
    <div className="d-inline-flex">
      <div className="mx-1">
        <NickBadge me={me} nickname={nickname} />
      </div>
      <div
        className="mx-1 overflow-hidden"
        style={{ maxWidth: '150px', textOverflow: 'ellipsis' }}
      >
        {nickname}
      </div>
    </div>
  );
}
