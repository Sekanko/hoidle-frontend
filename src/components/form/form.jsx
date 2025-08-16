import React, { useState, useEffect } from "react";
import useSWR from "swr";
import "./form.scss";

const liSuggestionClass = "list-group-item bg-dark text-white suggestion-item";

function GuessForm({ submitFunction }) {
  //api
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  let {
    data: countries,
    error,
    isValidating,
  } = useSWR("https://hoidle.onrender.com/data/allCountries", fetcher);

  //use states
  const [input, setInput] = useState("");
  const [availableCountries, setAvailableCountries] = useState([]);
  useEffect(() => {
    if (countries) setAvailableCountries(countries);
  }, [countries]);

  if (error) return <div>Failed to load</div>;
  if (!countries) return <div>Loading...</div>;

  const filteredCountries = filterCountriesByName(input, availableCountries);

  const handler = (e) => {
    e.preventDefault();
    if (filteredCountries.length > 0) {
      const selectedCountry = filteredCountries[0];
      submitFunction(selectedCountry);
      setAvailableCountries((prev) =>
        prev.filter((country) => country !== selectedCountry)
      );
    }
    setInput("");
  };

  return (
    <form id="guess-form" onSubmit={handler}>
      <div className="guess-input-group">
        <input
          type="text"
          id="guess-input"
          className="form-control"
          placeholder="Type a country..."
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      {input && filteredCountries.length > 0 && (
        <ul className="suggestions list-group">
          {filteredCountries.map((country) => (
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
          ))}
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
