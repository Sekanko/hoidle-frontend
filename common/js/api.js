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
  console.log(`Fetching countries from ${http}/data/allCountries`);
  return await getData(`${http}/data/allCountries`, "Could not get countries");
}

export { getCountries };
