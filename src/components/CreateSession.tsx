import React, { useState } from 'react';

export interface CreateSessionProps {
  onCancel: () => void;
  onConfirm: (sessionId: string) => void;
}

export const CreateSession: React.FC<CreateSessionProps> = ({
  onCancel,
  onConfirm,
}) => {
  const [id, setId] = useState<string>();
  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setId(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const finalId =
      id +
      '-' +
      Math.floor(Math.random() * 9999)
        .toString()
        .padStart(4, '0');
    onConfirm(finalId);
  };

  const isValid = id !== undefined && /^[a-zA-Z0-9]*$/.test(id);
  return (
    <div className="container fluid">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="idInput">Session Name</label>
          <input
            type="text"
            className="form-control"
            id="idInput"
            name="id"
            onChange={handleIdChange}
          />
          {!isValid ? (
            <small className="form-text text-danger">
              The name must not be empty and only contain numbers and letters.
            </small>
          ) : null}
        </div>
        <button type="submit" className="btn btn-primary" disabled={!isValid}>
          Ok
        </button>
        <button className="btn btn-primary ml-2" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};
