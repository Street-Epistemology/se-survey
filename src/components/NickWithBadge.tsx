import NickBadge from './NickBadge';

export default function NickWithBadge({
  badgeText,
  nickname,
  me,
}: {
  badgeText?: string;
  me?: boolean;
  nickname: string;
}) {
  return (
    <>
      <div className="mx-1">
        <NickBadge me={me} nickname={badgeText || nickname} />
      </div>
      <div
        className="mx-1 overflow-hidden"
        style={{ maxWidth: '150px', textOverflow: 'ellipsis' }}
      >
        {nickname}
      </div>
    </>
  );
}
