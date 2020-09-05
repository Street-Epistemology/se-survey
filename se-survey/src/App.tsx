import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div>
        <Question response={{question: 'Test Question', confidence: Confidence.Undecided}} />
      </div>
    </div>
  );
}

enum Confidence {
  StronglyDisagree,
  Disagree,
  Undecided,
  Agree,
  StronglyAgree,
}

var confidenceLevels = [
  Confidence.StronglyDisagree,
  Confidence.Disagree,
  Confidence.Undecided,
  Confidence.Agree,
  Confidence.StronglyAgree,
];

interface QuestionOptionProps {
  confidence: Confidence;
  onClick: (e: Confidence) => void;
}

const QuestionOption: React.FC<QuestionOptionProps> = ({ confidence, onClick }) => (
  <button type="button" className="btn btn-secondary" onClick={() => onClick(confidence)}>
    {Confidence[confidence]}
  </button>
);

interface QuestionResponse {
  confidence: Confidence;
  question: string;
}

interface QuestionGroup {
  questions: Array<QuestionResponse>;
  groupName: string;
}

interface QuestionResponseProps {
  response: QuestionResponse;
  onClick: (e: Confidence) => void;
}

const Question: React.FC<QuestionResponseProps> = ({ response, onClick }) => {
  let buttons = confidenceLevels.map((confidence) => {
    return (
      <QuestionOption confidence={confidence} onClick={(e) => onClick(confidence)}/>
    );
  });

  return (
    <tr>
      <td>{response.question}</td>
      <div className="btn-group" role="group" aria-label="Basic example">
        {buttons}
      </div>
    </tr>
  );
};

export default App;
