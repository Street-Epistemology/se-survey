import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.scss';
import 'bootstrap';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import RedirectLanguage from './pages/RedirectLanguage';
import Room from './pages/Room';
import ScrollToTop from './components/ScrollToTop';
import StartRoom from './pages/StartRoom';
import SurveyStart from './pages/SurveyStart';
import About from './pages/About';
import * as darkMode from './utils/darkModeHelper';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ScrollToTop />
      <Switch>
        <Route path="/:lang/about">
          <About />
        </Route>
        <Route path="/:lang/:surveyKey/new">
          <StartRoom />
        </Route>
        <Route path="/:lang/:surveyKey/:roomKey">
          <Room />
        </Route>
        <Route path="/:lang/:surveyKey">
          <SurveyStart />
        </Route>
        <Route path="/:lang">
          <SurveyStart />
        </Route>
        <Route path="/">
          <RedirectLanguage />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

if (darkMode.isDarkModeEnabled()) {
  darkMode.enableDarkMode();
}
