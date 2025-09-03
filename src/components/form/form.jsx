import React, { useState, useEffect } from "react";
import "./form.scss";
import ApiClient from "../../services/api-client";
import ErrorView from "../modals/error/error-view";
import Loader from "../modals/loader/loader";
import useApiData from "../../hooks/use-api-data";

import { pushStorageArray } from "../utils/set-storage-item";

const liSuggestionClass = "list-group-item bg-dark text-white suggestion-item";
const apiClient = ApiClient.getInstance();

function GuessForm({ submitFunction, isDisabled, storageItemName }) {
  const [input, setInput] = useState("");
  const [availableCountries, setAvailableCountries] = useState([]);
  const [countries, error, setError] = useApiData("/data/countries");

  useEffect(() => {
    let usedCountries;
    const usedCountriesStorage = localStorage.getItem(storageItemName);
    if (usedCountriesStorage) {
      usedCountries = JSON.parse(usedCountriesStorage);
    }

    if (countries)
      setAvailableCountries(
        countries.filter((c) => !usedCountries?.includes(c.name))
      );
  }, [countries]);

  if (error) return <ErrorView error={error} />;
  if (!countries) return <Loader />;

  const filteredCountries = filterCountriesByName(input, availableCountries);

  const submitHandler = (e) => {
    e.preventDefault();

    if (filteredCountries.length > 0 && input) {
      const selectedCountry = filteredCountries[0];
      submitFunction(selectedCountry);
      pushStorageArray(storageItemName, selectedCountry.name);
      setAvailableCountries((prev) =>
        prev.filter((country) => country !== selectedCountry)
      );
    }
    setInput("");
  };

  return (
    <form id="guess-form" onSubmit={submitHandler}>
      <div className="guess-input-group d-flex gap-2">
        <input
          type="text"
          id="guess-input"
          className="form-control"
          placeholder="Type a country..."
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isDisabled}
        />
        <button
          id="guess-button"
          className="btn btn-primary"
          type="submit"
          disabled={isDisabled}
        >
          Submit
        </button>
      </div>

      {input && (
        <ul className="suggestions list-group">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <li
                key={country.name}
                className={liSuggestionClass}
                onClick={(e) => {
                  setInput(country.name);
                  e.currentTarget.closest("form").requestSubmit();
                }}
              >
                {country.name}
              </li>
            ))
          ) : (
            <li
              key="no-country"
              id="no-country"
              className={liSuggestionClass}
              onClick={() => setInput("")}
            >
              {"There's no such country"}
            </li>
          )}
        </ul>
      )}
    </form>
  );
}

function filterCountriesByName(name, countries) {
  name = name.toLowerCase().replaceAll(" ", "");
  return countries.filter((country) => {
    const countryName = country.name.toLowerCase();
    const countryNameSplit = countryName.split(" ");
    let text = "";
    for (let i = countryNameSplit.length - 1; i > 0; i--) {
      text = countryNameSplit[i] + text;
      if (text.startsWith(name)) {
        return true;
      }
    }
    return countryName.replaceAll(" ", "").startsWith(name);
  });
}

export default GuessForm;
