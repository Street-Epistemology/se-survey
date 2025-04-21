import Splash from '../components/Splash';

export default function About() {
  return (
    <Splash>
      <h2 className="my-4 text-3xl">Discover More</h2>
      <hr className="my-4 border-neutral-500" />
      <p className="my-4">
        Street Epistemology is a conversational tool that helps people reflect
        on the quality of their reasons and the reliability of their methods
        used to arrive at their deeply-held beliefs. It aims to break down
        barriers that people encounter when talking about their cherished
        beliefs. Find out more at the official{' '}
        <a
          className="text-blue-600 underline dark:text-blue-500"
          href="https://streetepistemology.com/"
        >
          Street Epistemology Website
        </a>
        !
      </p>
      <h2 className="my-4 text-3xl">FAQ</h2>
      <hr className="my-4 border-neutral-500" />
      <h3 className="my-3 text-2xl">What is this?</h3>
      <p className="my-4">
        This questionnaire represents some of the topics that are typically
        discussed in a conversation about epistemology, or how we know what we
        know. It allows you to gain a deeper insight into the processes and
        influences that form your beliefs.
      </p>
      <hr className="my-4 border-neutral-500" />
      <h3 className="my-3 text-2xl">What is the point?</h3>
      <p className="my-4">
        Our beliefs determine how we see and interact with the world. Someone
        who believes that people are all generally good at heart sees the world
        in a completely different light than someone who believes everyone
        around them is secrectly KGB spies out to get them!
      </p>
      <p className="my-4">
        We frequently think about our beliefs, but rarely take the time to think
        about how we arrive at those beliefs. That's like a math teacher
        checking the answer but not all the steps in between! Even if the answer
        is correct, there might be a flaw in the math that will cause problems
        in the future.
      </p>
      <p className="my-4">
        This is like math, only less boring. The simple act of considering these
        questions can help you think about how you come to your beliefs and
        identify blindspots or places that you think you can do better at. See
        them as your personal window into the beautiful, messy machine that is
        your mind!
      </p>
      <hr className="my-4 border-neutral-500" />
      <h3 className="my-3 text-2xl">What if I give the wrong answers?</h3>
      <p className="my-4">There are no wrong answers! Yes, really.</p>
      <p className="my-4">
        They way you approach forming your beliefs is deeply personal and
        unique, and influenced by your goals and values. Philosophers have been
        slugging it out about the RIGHT way to do it for years, but they still
        haven't found the silver bullet and they likely never will.
      </p>
      <p className="my-4">
        That doesn't mean thinking about your epistemology is pointless. Beliefs
        can be like lazy, unwanted house guests. Unless you give them a good
        kick, they'll just hang around indefinitely. Considering these questions
        can help you figure out if there are doors you left open letting those
        unwanted guests.
      </p>
    </Splash>
  );
}
