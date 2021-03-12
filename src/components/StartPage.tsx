import React from 'react';
import logo from '../images/se-logo-color.png';
import { Link, useParams } from 'react-router-dom';

interface ParamTypes {
  lang?: string
}

export const AboutPage = () => {
  const { lang = 'em-US' } = useParams<ParamTypes>();
  return (
    <div className="container fluid">
      <div className="jumbotron">
        <div className="container">
          <div className="col-md-auto text-center">
            <Link to="/">
              <img
                src={logo}
                className="logo m-4 col-sm"
                alt="logo"
              />
            </Link>
          </div>
          <div className="col align-middle text-center">
            <h1 className="display-4 difference">
              Street Epistemology Survey
            </h1>
          </div>
        </div>
      </div>
      <div className="container">
        <blockquote className="blockquote">
          <p>This survey serves as an outline for conversations in which everyone gains deeper insights into the principles underlying our beliefs.</p>
        </blockquote>
        <h5>How to use the survey:</h5>
        <ol>
          <li>Grab a <strong>conversation partner</strong> to go through the survey with.</li>
          <li>Click Start Session to get a <strong>link to share</strong> with your conversation partner.</li>
          <li>Understand how your partner is interpreting each principle.</li>
          <li><strong>Ask questions</strong> that expand on why they agree or disagree to each principle.</li>
        </ol>
        <Link className="btn btn-lg btn-primary position-relative d-block start-50" to={`/${lang}/default/Y2djh5Ak4`}>Start Session</Link>
        <p className=""><a href="#more-surveys">Load more surveys...</a></p>
      </div>
    </div>
  );
};

export default AboutPage;
