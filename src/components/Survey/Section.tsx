import { Answer, ServerRoom, ServerSection } from '../../DataTypes';
import TextHeader from '../TextHeader';
import Question from './Question';
import Value from './Value';

interface SectionProps {
  handleResponse: (answer: Answer) => void;
  room?: ServerRoom;
  section: ServerSection;
  sectionKey: string;
  sectionStartNumber: number;
  sessionKey: string;
}

export default function Section({
  handleResponse,
  room,
  section,
  sectionKey,
  sectionStartNumber,
  sessionKey,
}: SectionProps) {
  return (
    <>
      <thead className="table-dark">
        <tr>
          <TextHeader title={section.title} text={section.answersTitle} />
        </tr>
      </thead>
      <tbody>
        {Object.keys(section.questions || {}).map((questionKey, questionI) => {
          const questionNumber = sectionStartNumber + questionI;
          return (
            <Question
              key={questionKey}
              question={section.questions[questionKey]}
              questionNumber={questionNumber}
              renderValue={(value) => (
                <Value
                  handleResponse={handleResponse}
                  key={value}
                  questionKey={questionKey}
                  room={room}
                  sectionKey={sectionKey}
                  sessionKey={sessionKey}
                  value={value}
                />
              )}
            />
          );
        })}
      </tbody>
    </>
  );
}
