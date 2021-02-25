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
import AboutPage from './components/AboutPage';
import ScrollToTop from './components/ScrollToTop';

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <React.StrictMode>
      <Router>
        <ScrollToTop />
        <Switch>
          <Route path="/dashboard">
            <App />
          </Route>
          <Route path="/:hash">
            <App />
          </Route>
          <Route path="/">
            <AboutPage />
          </Route>
        </Switch>
      </Router>
    </React.StrictMode>
  </FirebaseContext.Provider>,
  document.getElementById('root')
);
