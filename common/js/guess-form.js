import { getCountries } from "./api.js";

var guessCountry;
var attempts = 0;

async function guessForm(checkGuessFunction) {
  let countries = await getCountries();

  $("#guess-input").on("input", function () {
    const input = $(this).val();
    const suggestions = filterCountriesByName(input, countries);

    $(".suggestions").remove();

    if (input.length === 0) return;

    const liSuggestionClass =
      "list-group-item bg-dark text-white suggestion-item";

    $(".guess-input-group").after(
      `<ul class="suggestions list-group">${
        suggestions.length > 0
          ? suggestions
              .map(
                (country) =>
                  `<li class="${liSuggestionClass}">${country.name}</li>`
              )
              .join("")
          : `<li id='no-country' class='${liSuggestionClass}'>There's no such country</li>`
      }</ul>`
    );
    $(document).on("click", ".suggestions .list-group-item", function () {
      if ($(this).attr("id") !== "no-country") {
        $("#guess-input").val($(this).text());
        guessCountry = countries.find(
          (country) => country.name === $(this).text()
        );
        $("#guess-form").trigger("submit");
      }
    });
  });

  $("#guess-form").on("submit", function (e) {
    e.preventDefault();
    const input = $("#guess-input").val().trim();
    $("#guess-input").val("");
    if (input.length > 0 && !countries.includes(guessCountry)) {
      const firstSuggestion = $(".suggestions .list-group-item").first();
      if (
        firstSuggestion.length > 0 &&
        firstSuggestion.attr("id") !== "no-country"
      ) {
        firstSuggestion[0].click();
        return;
      }
    }
    $(".suggestions").remove();

    if (!guessCountry) return;

    attempts++;
    countries = countries.filter((country) => country !== guessCountry);

    checkGuessFunction(guessCountry);
    guessCountry = null;
  });

  return new Promise((resolve) => {
    resolve(Object.keys(countries[0]));
  });
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

export default guessForm;
