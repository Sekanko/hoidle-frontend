import React, { useState, useEffect } from "react";
import GuessForm from "../form/form";
import fitty from "fitty";
import "./classic.scss";
import Win from "../win/win";
import Loader from "../modals/loader/loader";
import ErrorView from "../modals/error/error-view";
import ApiClient from "../../services/api-client";
import useApiData from "../../hooks/use-api-data";
import prepareFieldForDisplay from "../utils/prepare-value";
import { setStorageItem } from "../utils/set-storage-item";
import { getDateFromWarsaw, isDateSameInWarsaw } from "../utils/date";
import { storageItems } from "../utils/constants/storage-item-names";

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
  const [justGuessed, setJustGuessed] = useState(false);
  const [fields, error, setError] = useApiData("/data/countryFields", (data) =>
    data.filter((s) => s !== "id" && s !== "url")
  );

  useEffect(() => {
    const savedRows = localStorage.getItem(storageItems.CLASSIC_ROWS);
    const savedHasWon = localStorage.getItem(storageItems.CLASSIC_HAS_WON);

    if (savedRows) setRows(JSON.parse(savedRows));
    if (savedHasWon) setHasWon(JSON.parse(savedHasWon));
  }, []);

  useEffect(() => {
    if (rows.length > 0) {
      setStorageItem(storageItems.CLASSIC_ROWS, rows);
    }
    if (hasWon) {
      setStorageItem(storageItems.CLASSIC_HAS_WON, hasWon);
    }
  }, [rows, hasWon]);

  useEffect(() => {
    fitty(".fit-in", {
      minSize: 7,
      maxSize: 18,
    });
  }, [[], rows]);

  if (error) return <ErrorView error={error} />;
  if (!fields) return <Loader />;

  const handleSubmit = async (selectedCountry) => {
    try {
      const results = await apiClient.post(
        "/game/guess/classicMode",
        selectedCountry
      );

      setRows((prevRows) => [
        { country: selectedCountry, results },
        ...prevRows,
      ]);

      setJustGuessed(true);

      if (Object.values(results).every((color) => color === "GREEN")) {
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
      <GuessForm
        submitFunction={handleSubmit}
        isDisabled={formDisabled}
        previousGuessesStorageName={storageItems.CLASSIC_GUESSES}
      />
      <div id="guess-container-classic">
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
                    className={`${fieldBackgroundClass[row.results[field]]} ${
                      rowIndex === 0 && justGuessed ? "slide-down" : ""
                    }`}
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
      {hasWon && <Win modeName={"borders"} />}
    </article>
  );
}

export default Classic;
