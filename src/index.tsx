import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import ScrollToTop from './components/ScrollToTop';
import About from './pages/About';
import Room from './pages/Room';
import StartRoom from './pages/StartRoom';
import SurveyStart from './pages/SurveyStart';
import loadCurrentTheme from './utils/themeHelper';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/:lang/about" element={<About />} />
        <Route path="/:lang/:surveyKey/new" element={<StartRoom />} />
        <Route path="/:lang/:surveyKey/:roomKey" element={<Room />} />
        <Route path="/:lang/:surveyKey" element={<SurveyStart />} />
        <Route path="/:lang" element={<SurveyStart />} />
        <Route
          index
          element={<Navigate to={`/${navigator.language}`} replace />}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', loadCurrentTheme);

loadCurrentTheme();
