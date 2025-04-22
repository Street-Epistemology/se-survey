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
      className={`inline-flex min-h-7 w-7 items-center justify-center rounded-full text-base font-bold text-white ${me ? 'bg-blue-600' : 'bg-purple-900'}`}
    >
      {getCharAt(nickname || '', 0)}
      {hover ? (
        <div className="relative">
          <ul className="nick-menu absolute right-0 z-1000 hidden max-h-38 overflow-hidden overflow-y-auto rounded-sm border border-neutral-300 shadow-sm dark:border-neutral-700">
            <li className="border-b border-neutral-300 bg-white p-2 last:border-b-0 dark:border-neutral-700 dark:bg-neutral-800">
              <NickBadge me={me} nickname={nickname} />

              <div className="max-w-38 overflow-hidden overflow-ellipsis">
                {nickname}
              </div>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
