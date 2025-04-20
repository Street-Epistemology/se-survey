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

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-floating">
        <input
          className={`form-control${error ? ' is-invalid' : ''}`}
          id={id}
          name={name}
          onChange={handleChange}
          placeholder={error || label}
          required
          type="text"
          value={typeof value === 'string' ? value : initialValue}
        />
        <label htmlFor={id}>{error || label}</label>
        <div className="d-grid mx-auto pt-1">
          <button type="submit" className="btn btn-primary">
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
