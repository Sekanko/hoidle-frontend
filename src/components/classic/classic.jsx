import React, { useState, useEffect } from "react";
import GuessForm from "../form/form";
import useSWR from "swr";
import fitty from "fitty";
import "./classic.scss";
import Win from "../win/win";
import ModeLink from "../mode-link/mode-link";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const fieldBackgroundClass = {
  GREEN: "correct",
  ORANGE: "half-correct",
  RED: "incorrect",
  UPPER_RED: "upper-red",
  LOWER_RED: "lower-red",
};

function Classic() {
  const {
    data: fields,
    error,
    isValidating,
  } = useSWR(
    "https://hoidle.onrender.com/game/control/getCountryFields",
    fetcher
  );

  const [rows, setRows] = useState([]);
  const [hasWon, setHasWon] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);

  useEffect(() => {
    fitty(".fit-in", {
      minSize: 9,
      maxSize: 18,
    });
  }, [rows]);

  if (error) return <div>Failed to load</div>;
  if (!fields) return <div>Loading...</div>;

  const handleSubmit = async (selectedCountry) => {
    const response = await fetch(
      "https://hoidle.onrender.com/game/control/guessClassic",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedCountry),
      }
    );
    const results = await response.json();
    setRows((prevRows) => [{ country: selectedCountry, results }, ...prevRows]);

    if (results.every((color) => color === "GREEN")) {
      setFormDisabled(true);
      const animationDuration = 0.5;
      const lastTdDelay = (fields.length - 1) * 0.2;
      const totalAnimationTime = (animationDuration + lastTdDelay) * 1000;

      setTimeout(() => setHasWon(true), totalAnimationTime);
    }
  };

  return (
    <article className="text-center d-flex flex-column align-items-center mx-auto">
      <GuessForm submitFunction={handleSubmit} isDisabled={formDisabled} />
      <div id="guess-container">
        <table>
          <thead>
            <tr>
              {fields.length > 0 &&
                fields.map((field) => (
                  <th key={field}>{prepareFieldForDisplay(field)}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {fields.map((field, colIndex) => (
                  <td
                    key={rowIndex + "-" + colIndex + "-" + row.country.name}
                    className={`${
                      fieldBackgroundClass[row.results[colIndex]]
                    } ${rowIndex === 0 ? "slide-down" : ""}`}
                    style={{ animationDelay: `${colIndex * 0.2}s` }}
                  >
                    <div className="centerContainer">
                      <span className="fit-in">
                        {prepareFieldForDisplay(row.country[field])}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasWon && <Win imgRoute={<ModeLink modeName={"borders"} />} />}
    </article>
  );
}

function prepareFieldForDisplay(field) {
  if (typeof field === "number") {
    return field;
  }

  let displayValue = field;

  if (Array.isArray(displayValue)) {
    displayValue = displayValue.map((v) => prepareValue(v));

    displayValue = displayValue.join(", ");
  } else {
    displayValue = prepareValue(displayValue);
  }

  return displayValue;
}

function prepareValue(value) {
  let returnValue = String(value).replace(/([a-z])([A-Z])/g, "$1 $2");
  returnValue = returnValue.trim().replaceAll("_", " ").toLowerCase();
  returnValue = returnValue
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return returnValue;
}
export default Classic;
