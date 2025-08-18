import React, { useState, useEffect } from "react";
import useSWR from "swr";
import GuessForm from "../form/form";
import "./borders.scss";
import ModeLink from "../mode-link/mode-link";
import Win from "../win/win";
import Loader from "../modals/loader/loader";
import ErrorView from "../modals/error/error-view";
function Borders() {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const {
    data: country,
    error,
    isValidating,
  } = useSWR(
    "https://hoidle.onrender.com/game/control/dayCountryOfTheDay/BORDER",
    fetcher
  );

  const [guesses, setGuesses] = useState([]);
  const [hasWon, setHasWon] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  if (error) return <ErrorView error={error} />;
  if (submitError) return <ErrorView error={submitError} />;

  if (!country) return <Loader />;

  const imageSrc = `/borders-img/${country.url}`;

  const submitHandler = async (selectedCountry) => {
    const response = await fetch(
      "https://hoidle.onrender.com/game/control/guessBorder",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedCountry),
      }
    );

    if (!response.ok) {
      setSubmitError(new Error("Stable backend - guess result error"));
      return;
    }

    const data = await response.json();

    setGuesses((prewDivs) => [
      { countryName: selectedCountry.name, isCorrect: data },
      ...prewDivs,
    ]);
    if (data) {
      setTimeout(() => setHasWon(true), 500);
    }
  };

  return (
    <article className="text-center d-flex flex-column align-items-center mx-auto">
      <div id="border-container">
        <h1>Guess the border!</h1>
        <img
          id="daily-border-img"
          src={[imageSrc]}
          alt="Something went wrong :( [Opera user ;)]"
        />
      </div>
      <GuessForm submitFunction={submitHandler} isDisabled={hasWon} />
      <div id="guess-container">
        {guesses.length > 0 &&
          guesses.map((country, index) => (
            <div
              key={country.countryName}
              className={`guess-item ${
                country.isCorrect ? "guess-success" : "guess-failure"
              } ${index === 0 ? "slide-down" : ""}`}
            >
              {country.countryName}
            </div>
          ))}
      </div>
      {hasWon && <Win imgRoute={<ModeLink modeName={"classic"} />} />}
    </article>
  );
}

export default Borders;
