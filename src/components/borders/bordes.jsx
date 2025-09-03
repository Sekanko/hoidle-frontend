import React, { useState, useEffect } from "react";
import GuessForm from "../form/form";
import "./borders.scss";
import ModeLink from "../mode-link/mode-link";
import Win from "../win/win";
import Loader from "../modals/loader/loader";
import ErrorView from "../modals/error/error-view";
import ApiClient from "../../services/api-client";
import useApiData from "../../hooks/use-api-data";
import { storageItems } from "../utils/constants/storage-item-names";
import { setStorageItem } from "../utils/set-storage-item";

const apiClient = ApiClient.getInstance();

function Borders() {
  const [guesses, setGuesses] = useState([]);
  const [hasWon, setHasWon] = useState(false);
  const [imageSrc, error, setError] = useApiData(
    "/data/dailyBorderUrl",
    (countryImgUrl) => `/borders-img/${countryImgUrl}`
  );

  useEffect(() => {
    const savedGuesses = localStorage.getItem(storageItems.BORDER_GUESSES);
    const savedHasWon = localStorage.getItem(storageItems.BORDER_HAS_WON);

    if (savedGuesses) setGuesses(JSON.parse(savedGuesses));
    if (savedHasWon) setHasWon(JSON.parse(savedHasWon));
  }, []);

  useEffect(() => {
    if (guesses.length > 0) {
      setStorageItem(storageItems.BORDER_GUESSES, guesses);
    }
    if (hasWon) {
      setStorageItem(storageItems.BORDER_HAS_WON, hasWon);
    }
  }, [guesses, hasWon]);

  if (error) return <ErrorView error={error} />;
  if (!imageSrc) return <Loader />;

  const submitHandler = async (selectedCountry) => {
    try {
      const data = await apiClient.post("/game/guess/BORDER", selectedCountry);
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
          alt="Something went wrong :("
        />
      </div>
      <GuessForm
        submitFunction={submitHandler}
        isDisabled={hasWon}
        storageItemName={storageItems.BORDER_GUESSES}
      />
      <div id="guess-container-border">
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
      {hasWon && <Win modeName={"classic"} />}
    </article>
  );
}

export default Borders;
