import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { RouteParamTypes } from '../DataTypes';
import FillForm from './FillForm';
import NickWithBadge from './NickWithBadge';

interface MenuProps {
  initialNicknameValue?: string;
  onNicknameSubmit: (args: string) => void;
}

export default function Menu({
  initialNicknameValue,
  onNicknameSubmit,
}: MenuProps): JSX.Element {
  const { lang } = useParams<RouteParamTypes>();
  return (
    <div className="overlay">
      <div className="dropleft m-2 float-right menu-button">
        <button
          aria-expanded="false"
          aria-haspopup="true"
          className="btn btn-dark dropdown-toggle d-inline-flex align-items-center"
          data-bs-toggle="dropdown"
          id="dropdownMenuButton"
          type="button"
        >
          <NickWithBadge me nickname={initialNicknameValue || ''} />
        </button>
        <div
          className="dropdown-menu shadow"
          aria-labelledby="dropdownMenuButton"
        >
          <div className="mx-2">
            <FillForm
              handleSubmit={onNicknameSubmit}
              name="nickname"
              id="menuNickname"
              initialValue={initialNicknameValue}
              label="Enter nickname"
              submitLabel="Set nickname"
            />
          </div>
          <div className="dropdown-divider"></div>
          <Link className="dropdown-item pointer" to={`/${lang}/about`}>
            About
          </Link>
        </div>
      </div>
    </div>
  );
}
