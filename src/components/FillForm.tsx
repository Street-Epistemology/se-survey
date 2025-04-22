import { FormEvent, SyntheticEvent, useEffect, useState } from 'react';

export default function FillForm({
  error,
  onChange,
  onSubmit,
  id,
  initialValue,
  label,
  name,
  submitLabel,
}: {
  error?: string;
  onChange: (value: string) => unknown;
  onSubmit: (value: string) => unknown;
  id: string;
  initialValue?: string;
  label: string;
  name: string;
  submitLabel: string;
}) {
  const [value, setValue] = useState<string>('');

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
    onChange(value);
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    onSubmit(value);
  };

  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
    }
  }, [initialValue]);

  const currentValue = typeof value === 'string' ? value : initialValue;

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative mx-auto max-w-sm">
        <input
          className={`peer block w-full rounded-md border px-3 pt-6 pb-2 text-lg dark:border-neutral-600 dark:bg-neutral-800 ${error ? 'border-red-500' : 'border-neutral-300'}`}
          id={id}
          name={name}
          onChange={handleChange}
          required
          type="text"
          value={currentValue}
        />
        <label
          htmlFor={id}
          className={`absolute left-1 z-10 transform cursor-text bg-white px-2 text-neutral-500 duration-300 peer-focus:top-2 peer-focus:scale-100 peer-focus:text-sm dark:bg-neutral-800 dark:text-neutral-400 ${currentValue ? 'top-2 scale-100 text-sm' : 'top-4 text-lg'}`}
        >
          {error || label}
        </label>
        <div className="mx-auto grid pt-1">
          <button
            type="submit"
            className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-center text-lg font-medium text-white transition-colors hover:bg-blue-700"
          >
            {submitLabel || '...'}
          </button>
        </div>
      </div>
    </form>
  );
}
