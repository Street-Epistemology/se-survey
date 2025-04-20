import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import './index.scss';
import 'bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RedirectLanguage from './pages/RedirectLanguage';
import Room from './pages/Room';
import ScrollToTop from './components/ScrollToTop';
import StartRoom from './pages/StartRoom';
import SurveyStart from './pages/SurveyStart';
import About from './pages/About';
import * as darkMode from './utils/darkModeHelper';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/:lang/about" element={<About />} />
        <Route path="/:lang/:surveyKey/new" element={<StartRoom />} />
        <Route path="/:lang/:surveyKey/:roomKey" element={<Room />} />
        <Route path="/:lang/:surveyKey" element={<SurveyStart />} />
        <Route path="/:lang" element={<SurveyStart />} />
        <Route path="/" element={<RedirectLanguage />} />
      </Routes>
    </Router>
  </StrictMode>,
);

if (darkMode.isDarkModeEnabled()) {
  darkMode.enableDarkMode();
}
