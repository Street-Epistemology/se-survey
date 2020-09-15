import { QuestionGroup, QuestionResponse } from "./Types";
import React, { useState } from "react";
import logo from "./images/se-logo-color.png";
import questionJson from "./files/questions.json";
import { useRouteMatch, match as Match, useHistory } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCog } from "@fortawesome/free-solid-svg-icons";
import { Questionnaire } from "./components/Questionnaire";
import { mapHash, getHash } from "./utils/Hasher";

export const loadData = () => {
  const result: QuestionGroup[] = JSON.parse(JSON.stringify(questionJson));
  return result;
};

type TParams = { id?: string | undefined };
const symbols: string[] = ["✓", "✔", "✘", "❌", "✅", "★", "🎵", "🔴"];

const App = () => {
  const match: Match<TParams> = useRouteMatch();
  const hist = useHistory();
  const [questionGroups, setQuestionGroups] = useState<QuestionGroup[]>(
    mapHash(match.params.id, loadData())
  );
  const [useEmoji, setUseEmoji] = useState<boolean>(true);
  const [tickSymbol, setTickSymbol] = useState<string>("✓");

  const handleSelection = (response: QuestionResponse) => {
    let newGroups = [...questionGroups];
    for (let group of newGroups) {
      for (let question of group.questions) {
        if (question.question === response.question)
          question.confidence = response.confidence;
      }
    }

    setQuestionGroups(newGroups);
  };

  const onReset = () => {
    confirmAlert({
      title: "Reset",
      message: "Are you sure you want to clear all your answers?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            setQuestionGroups(loadData());
            hist.push("/");
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const onCopy = () => {
    const copy = require("clipboard-copy");
    copy(url);
  };

  const hash = getHash(questionGroups);
  const hashExp = new RegExp("^A*$");
  const isEmpty = !hashExp || hashExp.test(hash);
  const url =
    window.location.protocol + "//" + window.location.host + "/" + hash;
  const tweetUrl =
    "https://twitter.com/intent/tweet?text=" +
    encodeURI(
      "I completed the Street Epistemology questionnaire. Have a look at my results: &url=" +
        url
    );

  return (
    <div className="App">
      <div className="overlay">
        <div className="dropleft m-2 float-right menu-button">
          <button
            className="btn btn-primary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <FontAwesomeIcon icon={faCog} />
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <span
              className="dropdown-item"
              onClick={() => setUseEmoji(!useEmoji)}
            >
              {useEmoji ? "Text Headings" : "Emoji Headings"}
            </span>
            <div className="dropdown-divider"></div>
            {symbols.map((symbol) => {
              return (
                <span
                  key={symbol}
                  className={
                    "dropdown-item" +
                    (symbol === tickSymbol ? " bg-primary text-white" : "")
                  }
                  onClick={() => setTickSymbol(symbol)}
                >
                  {symbol}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container fluid">
        <div>
          <div className="row align-items-center">
            <div className="col-md-auto text-center">
              <img src={logo} className="logo m-4 col-sm" alt="logo" />
            </div>
            <div className="col align-middle text-center">
              <h3 className="col-sm text-uppercase w-100">
                How do we know what we know?
              </h3>
            </div>
          </div>
          {!isEmpty ? (
            <div className="mb-2 text-center mx-auto">
              <div className="border rounded p-2 align-middle d-inline-block mt-2 bg-light">
                <a className="text-break" href={url}>
                  {url}
                </a>
              </div>
              <button
                className="btn btn-primary d-inline align-middle ml-1 mt-2"
                onClick={onCopy}
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
              <button
                className="btn btn-primary d-inline align-middle ml-1 mt-2"
                onClick={onReset}
              >
                Reset
              </button>
              <button
                className="btn btn-primary d-inline align-middle ml-1 mt-2 mt-twitter-share-button"
                onClick={() => (window.location.href = tweetUrl)}
              >
                Tweet
              </button>
            </div>
          ) : null}
        </div>
        <Questionnaire
          questionGroups={questionGroups}
          tickSymbol={tickSymbol}
          useEmoji={useEmoji}
          handleSelection={handleSelection}
        />
      </div>
    </div>
  );
};

export default App;
