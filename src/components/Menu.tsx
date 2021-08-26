import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { RouteParamTypes } from '../DataTypes';
import DarkModeSwitcher from './DarkModeSwitcher';
import FillForm from './FillForm';
import NickWithBadge from './NickWithBadge';

interface MenuProps {
  error: string;
  onChange: (val: string) => unknown;
  initialNicknameValue?: string;
  onNicknameSubmit: (args: string) => void;
}

export default function Menu({
  initialNicknameValue,
  onNicknameSubmit,
  onChange,
  error,
}: MenuProps): JSX.Element {
  const { lang } = useParams<RouteParamTypes>();
  return (
    <div className="overlay">
      <div className="dropleft m-2 float-right menu-button row">
        <div className="col d-flex justify-content-end">
          <DarkModeSwitcher></DarkModeSwitcher>
        </div>
        <div className="col d-flex justify-content-end">
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
                error={error}
                id="menuNickname"
                initialValue={initialNicknameValue}
                label="Enter nickname"
                name="nickname"
                onChange={onChange}
                onSubmit={onNicknameSubmit}
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
    </div>
  );
}
