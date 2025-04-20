import { Answer, ServerRoom, ServerSurvey } from '../../DataTypes';
import Section from './Section';

interface SurveyFormProps {
  handleResponse: (answer: Answer) => void;
  room?: ServerRoom;
  sessionKey: string;
  survey: ServerSurvey;
}

export default function SurveyForm({
  handleResponse,
  room,
  sessionKey,
  survey,
}: SurveyFormProps) {
  let previousQuestionsSum = 1;
  return (
    <table className="table table-bordered table-hover">
      {Object.keys(survey.sections || {}).map((sectionKey) => {
        const sectionStartNumber = previousQuestionsSum;
        previousQuestionsSum += Object.keys(
          survey.sections[sectionKey].questions || {},
        ).length;
        return (
          <Section
            handleResponse={handleResponse}
            key={sectionKey}
            room={room}
            section={survey.sections[sectionKey]}
            sectionKey={sectionKey}
            sectionStartNumber={sectionStartNumber}
            sessionKey={sessionKey}
          />
        );
      })}
    </table>
  );
}
