export default function TextHeader({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <>
      <th className="bth align-middle scale-text">{title}</th>
      <th
        className="bth center align-middle text-center scale-text"
        colSpan={5}
      >
        {text}
      </th>
    </>
  );
}
