const http = "https://hoidle.onrender.com";

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

async function checkResult(
  guessCountry,
  endpoint,
  errorMessage = "Could not check result"
) {
  const response = await fetch(`${http}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(guessCountry),
  });

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return await response.json();
}

async function checkClassicResult(guessCountry) {
  return await checkResult(
    guessCountry,
    `/game/control/guessClassic`,
    "Could not check classic guess"
  );
}

async function checkBorderResult(guessCountry) {
  return await checkResult(
    guessCountry,
    `/game/control/guessBorder`,
    "Could not check border guess"
  );
}

export {
  getCountries,
  checkBorderResult,
  getBorderCountryUrl,
  checkClassicResult,
};
