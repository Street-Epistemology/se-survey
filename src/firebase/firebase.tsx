import app from 'firebase/app';
import 'firebase/database';
import 'firebase/analytics';
import { QuestionGroup, QuestionResponse, Session } from '../DataTypes';
import * as mapper from '../utils/mapper';

const config = {
  apiKey: 'AIzaSyByqJZKz4QQ_4ymFSSUATIOkIErLiVkVtQ',
  authDomain: 'se-survey.firebaseapp.com',
  databaseURL: 'https://se-survey.firebaseio.com',
  projectId: 'se-survey',
  storageBucket: 'se-survey.appspot.com',
  messagingSenderId: '589870623313',
  appId: '1:589870623313:web:275da34511af68d7e26670',
  measurementId: 'G-ZPSR252PER',
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    app.analytics();
  }
  database() {
    return app.database();
  }

  subscribeToSessions(
    callback: (sessions: Session[]) => any,
    cancelCallbackOrContext?: (error: any) => any
  ): void {
    app
      .database()
      .ref('sessions')
      .orderByChild('isActive')
      .equalTo(true)
      .on('value', (snapshot) => {
        const val = snapshot.val();
        const sessions = Object.keys(val).map((key) => {
          let session = mapper.mapAnyToSession(val[key]);
          session.id = key;
          return session;
        });
        callback(sessions);
      });
  }

  subscribeToSession(
    id: string,
    callback: (session: Session) => any,
    cancelCallbackOrContext?: (error: any) => any
  ): void {
    app
      .database()
      .ref('sessions/' + id)
      .on('value', (snapshot) => {
        const result = mapper.mapAnyToSession(snapshot.val());
        callback(result);
      });
  }

  unsubscribeFromSession(id: string): void {
    app
      .database()
      .ref('sessions/' + id)
      .off();
  }

  createSession(id: string, state: [QuestionGroup[], QuestionResponse | null]) {
    const session = mapper.mapStateToSerializableSession(state);
    app.database().ref('sessions').child(id).set(session);
  }

  updateSession(id: string, state: [QuestionGroup[], QuestionResponse | null]) {
    const session = mapper.mapStateToSerializableSession(state) as any;
    const questions = mapper.flattenQuestionGroups(state[0]);
    if (state[1])
      session.lastQuestionIndex = questions.findIndex(
        (question) => question.question === state[1]?.question
      );
    delete session.created;
    delete session.survey;
    app.database().ref('sessions').child(id).set(session);
  }

  closeSession(id: string) {
    app.database().ref('sessions').child(id).child('isActive').set(false);
  }

  addSessionSubscriber(id: string) {
    app
      .database()
      .ref('sessions')
      .child(id)
      .child('subscribers')
      .once('value', (snapshot) => {
        app
          .database()
          .ref('sessions')
          .child(id)
          .set((snapshot.val() as number) + 1);
      });
  }
}

export default Firebase;
