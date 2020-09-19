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

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <React.StrictMode>
      <Router>
        <Switch>
        <Route path="/about">
          <AboutPage />
        </Route>
          <Route path="/:id">
            <App />
          </Route>
          <Route path="/">
            <App />
          </Route>
        </Switch>
      </Router>
    </React.StrictMode>
  </FirebaseContext.Provider>,
  document.getElementById('root')
);
