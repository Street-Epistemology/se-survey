import getCharAt from '../utils/getCharAt';

export default function NickBadge({
  hover,
  me,
  nickname,
}: {
  hover?: boolean;
  me?: boolean;
  nickname: string;
}) {
  return (
    <div
      className={`inline-flex items-center justify-center ${me ? 'bg-blue-600' : 'bg-purple-900'} min-h-[28px] w-[28px] rounded-full text-base font-bold text-white`}
    >
      {getCharAt(nickname || '', 0)}
      {hover ? (
        <div className="relative">
          <ul className="nick-menu absolute right-0 z-[1000] hidden max-h-[150px] overflow-hidden overflow-y-auto rounded border border-neutral-300 shadow dark:border-neutral-700">
            <li className="border-b border-neutral-300 bg-white p-2 last:border-b-0 dark:border-neutral-700 dark:bg-neutral-800">
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
