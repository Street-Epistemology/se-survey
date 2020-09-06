import React, { useState } from 'react';
import logo from './images/se-logo-color.png';

enum Confidence {
  StronglyDisagree,
  Disagree,
  Undecided,
  Agree,
  StronglyAgree,
}

var questions = [
  {
    groupName: 'What is Truth?',
    questions: [
      {
        confidence: undefined,
        question: 'Truth is that which best matches external reality.',
      },
      {
        confidence: undefined,
        question:
          'People experience the same reality and only interpret it differently.',
      },
      {
        confidence: undefined,
        question: 'Truth depends on the opinions and beliefs of people.',
      },
      {
        confidence: undefined,
        question: 'People create words and define their meaning.',
      },
      {
        confidence: undefined,
        question: 'Something is true if everyone agrees to it.',
      },
      {
        confidence: undefined,
        question:
          'Strong belief, even without action, can change external reality.',
      },
    ],
  },
  {
    groupName: 'How does Belief Work?',
    questions: [
      {
        confidence: undefined,
        question: 'Some beliefs should not be questioned.',
      },
      {
        confidence: undefined,
        question: 'Someone can be certain of something yet still be mistaken.',
      },
      {
        confidence: undefined,
        question: 'It is bad when someone doubts their beliefs.',
      },
      {
        confidence: undefined,
        question:
          'If all members of a society share a belief, they are justified to hold that belief.',
      },
      {
        confidence: undefined,
        question:
          'Believing something that is false feels just like believing something that is true.',
      },
      {
        confidence: undefined,
        question: 'Feelings are a reliable way to discover truth.',
      },
    ],
  },
  {
    groupName: 'When should we believe?',
    questions: [
      {
        confidence: undefined,
        question: 'Believing something without evidence is admirable.',
      },
      {
        confidence: undefined,
        question:
          'It is important to know where we came from and what happens after death.',
      },
      {
        confidence: undefined,
        question:
          'Believing something that is false is okay if it gives you comfort.',
      },
      {
        confidence: undefined,
        question:
          'I give all claims the benefit of the doubt when I first encounter them.',
      },
      {
        confidence: undefined,
        question:
          'Someone is justified in their beliefs until they are proven wrong.',
      },
      {
        confidence: undefined,
        question:
          'The most important criteria for my beliefs is that they match reality.',
      },
    ],
  },
  {
    groupName: 'When should we change our minds?',
    questions: [
      {
        confidence: undefined,
        question: 'I often investigate beliefs that do not match my own.',
      },
      {
        confidence: undefined,
        question: "I am comfortable with saying: I don't know.",
      },
      {
        confidence: undefined,
        question:
          'It is beneficial to find out when I am wrong about something.',
      },
      {
        confidence: undefined,
        question:
          'I will abandon a belief if I discover reliable information that falsifies it.',
      },
      {
        confidence: undefined,
        question:
          'I look for more information before I accept something as true.',
      },
      {
        confidence: undefined,
        question: 'It is possible that some of my beliefs are not true.',
      },
    ],
  },
];

const App = () => {
  const [questionGroups, setQuestionGroups] = useState<QuestionGroup[]>(
    questions
  );

  const handleSelection = (response: QuestionResponse) => {
    let newGroups = [...questionGroups];
    for (let group of newGroups) {
      for (let question of group.questions) {
        if (question.question === response.question)
          question.confidence = response.confidence;
      }
    }

    setQuestionGroups(newGroups);
    console.log(newGroups);
  };

  return (
    <div className="App">
    <tr>
      <th>
        <img src={logo} height={100} className="App-logo" alt="logo" />
      </th>
      <th>{'\tHOW DO WE KNOW\n\rWHAT WE KNOW?'}</th>
    </tr>
      <div className='scrl'>
        {questionGroups.map((group, groupNo) => {
          return (
            <>
              <tr>
                <th className="bth" colSpan={2}>
                  {group.groupName}
                </th>
                <th className="bth" colSpan={5}>
                  Disagree ↔ Agree
                </th>
              </tr>
              {group.questions.map((question, questionNo) => {
                let lineNo = groupNo * 6 + questionNo + 1;
                return (
                  <Question
                    key={question.question}
                    response={question}
                    questionNo={lineNo}
                    callback={handleSelection}
                  />
                );
              })}
            </>
          );
        })}
      </div>
    </div>
  );
};

var confidenceLevels = [
  Confidence.StronglyDisagree,
  Confidence.Disagree,
  Confidence.Undecided,
  Confidence.Agree,
  Confidence.StronglyAgree,
];

interface QuestionResponse {
  confidence: Confidence | undefined;
  question: string;
}

interface QuestionGroup {
  questions: QuestionResponse[];
  groupName: string;
}

interface QuestionResponseProps {
  response: QuestionResponse;
  questionNo: number | undefined;
  callback: (response: QuestionResponse) => void;
}

const Question: React.FC<QuestionResponseProps> = ({
  response,
  questionNo,
  callback,
}) => {
  let buttons = confidenceLevels.map((confidence) => {
    let value = {
      confidence: confidence,
      question: response.question,
    };
    return (
      <td
        key={confidence}
        onClick={() => callback(value)}
        className="trc check"
      >
        {response.confidence === confidence ? '✓' : null}
      </td>
    );
  });

  return (
    <tr>
      <td>{questionNo}</td>
      <td>{response.question}</td>
      {buttons}
    </tr>
  );
};

export default App;
