import React, { useState } from "react";
import useSWR from "swr";
import GuessForm from "../form/form";
import "./borders.scss";
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

  if (error) return <div>Failed to load</div>;
  if (!country) return <div>Loading...</div>;

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
    const data = await response.json();

    setGuesses((prewDivs) => [
      { countryName: selectedCountry.name, isCorrect: data },
      ...prewDivs,
    ]);
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
      <GuessForm submitFunction={submitHandler} />
      <div id="guess-container">
        {guesses.length > 0 &&
          guesses.map((country) => (
            <div
              key={country.countryName}
              className={`guess-item ${
                country.isCorrect ? "guess-success" : "guess-failure"
              }`}
            >
              {country.countryName}
            </div>
          ))}
      </div>
    </article>
  );
}

export default Borders;
