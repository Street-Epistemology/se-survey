import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'reactjs-popup/dist/index.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'bootstrap';
import 'bootstrap/dist/js/bootstrap.js';
import Firebase, { FirebaseContext } from './firebase';
import StartPage from './components/StartPage';
import ScrollToTop from './components/ScrollToTop';
import RedirectLanguage from './components/RedirectLanguage';

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <React.StrictMode>
      <Router>
        <ScrollToTop />
        <Switch>
          <Route path="/:lang/:surveyID/:sessionID">
            <App />
          </Route>
          <Route path="/:lang">
            <StartPage />
          </Route>
          <Route path="/">
            <RedirectLanguage />
          </Route>
        </Switch>
      </Router>
    </React.StrictMode>
  </FirebaseContext.Provider>,
  document.getElementById('root')
);
