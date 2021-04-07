import React from 'react';
import logo from '../images/se-logo-color.png';
import { Link } from 'react-router-dom';

export default function About(): JSX.Element {
  return (
    <div className="container fluid">
      <div className="jumbotron">
        <div className="container">
          <div className="col-md-auto text-center">
            <Link to="/">
              <img src={logo} className="logo m-4 col-sm" alt="logo" />
            </Link>
          </div>
          <div className="col align-middle text-center">
            <h1 className="display-4 difference">Street Epistemology Survey</h1>
          </div>
        </div>
      </div>
      <div className="container">
        <h2>Discover More</h2>
        <hr />
        Street Epistemology is a conversational tool that helps people reflect
        on the quality of their reasons and the reliability of their methods
        used to arrive at their deeply-held beliefs. It aims to break down
        barriers that people encounter when talking about their cherished
        beliefs. Find out more at the official{' '}
        <a href="https://streetepistemology.com/">
          Street Epistemology Website
        </a>
        !
        <br />
        <br />
        <br />
        <h2>FAQ</h2>
        <hr />
        <h3>What is this?</h3>
        <p>
          This questionnaire represents some of the topics that are typically
          discussed in a conversation about epistemology, or how we know what we
          know. It allows you to gain a deeper insight into the processes and
          influences that form your beliefs.
        </p>
        <hr />
        <h3>What is the point?</h3>
        <p>
          Our beliefs determine how we see and interact with the world. Someone
          who believes that people are all generally good at heart sees the
          world in a completely different light than someone who believes
          everyone around them is secrectly KGB spies out to get them!
          <br />
          <br />
          We frequently think about our beliefs, but rarely take the time to
          think about how we arrive at those beliefs. That's like a math teacher
          checking the answer but not all the steps in between! Even if the
          answer is correct, there might be a flaw in the math that will cause
          problems in the future.
          <br />
          <br />
          This is like math, only less boring. The simple act of considering
          these questions can help you think about how you come to your beliefs
          and identify blindspots or places that you think you can do better at.
          See them as your personal window into the beautiful, messy machine
          that is your mind!
        </p>
        <hr />
        <h3>What if I give the wrong answers?</h3>
        <p>
          There are no wrong answers! Yes, really.
          <br />
          <br />
          They way you approach forming your beliefs is deeply personal and
          unique, and influenced by your goals and values. Philosophers have
          been slugging it out about the RIGHT way to do it for years, but they
          still haven't found the silver bullet and they likely never will.
          <br />
          <br />
          That doesn't mean thinking about your epistemology is pointless.
          Beliefs can be like lazy, unwanted house guests. Unless you give them
          a good kick, they'll just hang around indefinitely. Considering these
          questions can help you figure out if there are doors you left open
          letting those unwanted guests.
        </p>
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}
