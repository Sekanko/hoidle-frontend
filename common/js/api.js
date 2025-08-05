const http = "http://localhost:8080";

async function getData(
  endpoint,
  errorMessage = "Could not get data from the server"
) {
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(errorMessage);
  return await response.json();
}

async function getCountries() {
  return await getData(`${http}/data/allCountries`, "Could not get countries");
}

async function getBorderCountryUrl() {
  const data = await getData(
    `${http}/game/control/dayCountryOfTheDay/BORDER`,
    "Could not get border country"
  );
  return data.url;
}

async function checkBorderResult(guessCountry) {
  const response = await fetch(`${http}/game/control/guessBorder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(guessCountry),
  });

  if (!response.ok) {
    throw new Error("Could not check border result");
  }

  const data = await response.json();
  return data;
}

export { getCountries, checkBorderResult, getBorderCountryUrl };
