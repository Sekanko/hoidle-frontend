import React, { useState, useEffect } from "react";
import "./form.scss";
import ApiClient from "../../services/api-client";
import ErrorView from "../modals/error/error-view";
import Loader from "../modals/loader/loader";

const liSuggestionClass = "list-group-item bg-dark text-white suggestion-item";
const apiClient = ApiClient.getInstance();

function GuessForm({ submitFunction, isDisabled }) {
  const [input, setInput] = useState("");
  const [countries, setCountries] = useState(null);
  const [availableCountries, setAvailableCountries] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await apiClient.get("/data/allCountries");
        setCountries(data);
      } catch (e) {
        setError(e);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (countries) setAvailableCountries(countries);
  }, [countries]);

  if (error) return <ErrorView error={error} />;
  if (!countries) return <Loader />;

  const filteredCountries = filterCountriesByName(input, availableCountries);

  const submitHandler = (e) => {
    e.preventDefault();
    if (filteredCountries.length > 0 && input) {
      const selectedCountry = filteredCountries[0];
      submitFunction(selectedCountry);
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
                onClick={() => {
                  setInput(country.name);
                  submitFunction(country);
                  setInput("");
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
