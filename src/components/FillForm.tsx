import { FormEvent, SyntheticEvent, useEffect, useState } from 'react';

export default function FillForm({
  handleSubmit,
  id,
  initialValue,
  label,
  name,
  submitLabel,
}: {
  handleSubmit: (value: string) => unknown;
  id: string;
  initialValue?: string;
  label: string;
  name: string;
  submitLabel: string;
}): JSX.Element {
  const [value, setValue] = useState<string>('');

  const onChange = (event: FormEvent<HTMLInputElement>) =>
    setValue(event.currentTarget.value);

  const onSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    handleSubmit(value);
  };

  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
    }
  }, [initialValue]);

  return (
    <form onSubmit={onSubmit}>
      <div className="form-floating">
        <input
          className="form-control"
          id={id}
          name={name}
          onChange={onChange}
          placeholder={label}
          required
          type="text"
          value={typeof value === 'string' ? value : initialValue}
        />
        <label htmlFor={id}>{label}</label>
        <div className="d-grid mx-auto pt-1">
          <button type="submit" className="btn btn-primary">
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
