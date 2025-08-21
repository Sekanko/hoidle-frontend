import React, { useState, useEffect } from "react";
import GuessForm from "../form/form";
import "./borders.scss";
import ModeLink from "../mode-link/mode-link";
import Win from "../win/win";
import Loader from "../modals/loader/loader";
import ErrorView from "../modals/error/error-view";
import ApiClient from "../../services/api-client";

const apiClient = ApiClient.getInstance();

function Borders() {
  const [guesses, setGuesses] = useState([]);
  const [hasWon, setHasWon] = useState(false);
  const [error, setError] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const country = await apiClient.get(
          "/game/control/dayCountryOfTheDay/BORDER"
        );
        setImageSrc(`/borders-img/${country.url}`);
      } catch (e) {
        setError(e);
      }
    };
    fetchCountry();
  }, []);

  if (error) return <ErrorView error={error} />;
  if (!imageSrc) return <Loader />;

  const submitHandler = async (selectedCountry) => {
    try {
      const data = await apiClient.post(
        "/game/control/guessBorder",
        selectedCountry
      );
      setGuesses((prewDivs) => [
        { countryName: selectedCountry.name, isCorrect: data },
        ...prewDivs,
      ]);
      if (data) {
        setTimeout(() => setHasWon(true), 500);
      }
    } catch (e) {
      setError(e);
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
