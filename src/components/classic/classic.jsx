import React, { useState, useEffect } from "react";
import GuessForm from "../form/form";
import fitty from "fitty";
import "./classic.scss";
import Win from "../win/win";
import ModeLink from "../mode-link/mode-link";
import Loader from "../modals/loader/loader";
import ErrorView from "../modals/error/error-view";
import ApiClient from "../../services/api-client";

const apiClient = ApiClient.getInstance();

const fieldBackgroundClass = {
  GREEN: "correct",
  ORANGE: "half-correct",
  RED: "incorrect",
  UPPER_RED: "upper-red",
  LOWER_RED: "lower-red",
};

function Classic() {
  const [rows, setRows] = useState([]);
  const [hasWon, setHasWon] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [fields, setFields] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const data = await apiClient.get("/game/control/getCountryFields");
        setFields(data);
      } catch (e) {
        setError(e);
      }
    };

    fetchFields();
  }, []);

  useEffect(() => {
    fitty(".fit-in", {
      minSize: 9,
      maxSize: 18,
    });
  }, [rows]);

  if (error) return <ErrorView error={error} />;
  if (!fields) return <Loader />;
  if (submitError) return <ErrorView error={submitError} />;

  const handleSubmit = async (selectedCountry) => {
    try {
      const results = await apiClient.post(
        "/game/control/guessClassic",
        selectedCountry
      );

      setRows((prevRows) => [
        { country: selectedCountry, results },
        ...prevRows,
      ]);
      console.log(results);

      if (results.every((color) => color === "GREEN")) {
        setFormDisabled(true);
        const animationDuration = 0.5;
        const lastTdDelay = (fields.length - 1) * 0.2;
        const totalAnimationTime = (animationDuration + lastTdDelay) * 1000;

        setTimeout(() => setHasWon(true), totalAnimationTime);
      }
    } catch (e) {
      setError(e);
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
