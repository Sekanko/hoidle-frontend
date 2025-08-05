import { getCountries } from "./api.js";

async function guessForm() {
  const countries = await getCountries();

  $("#guess-input").on("input", function () {
    const input = $(this).val();
    const suggestions = filterCountriesByName(input, countries);

    $(".suggestions").remove();

    if (input.length === 0) return;

    console.log(input);
    $(".guess-input-group").after(
      `<ul class="suggestions list-group">${
        suggestions.length > 0
          ? suggestions
              .map(
                (country) => `<li class='list-group-item'>${country.name}</li>`
              )
              .join("")
          : "<li class='list-group-item no-country'>There's no such country</li>"
      }</ul>`
    );
    $(document).on("click", ".suggestions .list-group-ite`m", function () {
      const text = $(this).text();
      if (text !== "There's no such country") {
        $("#guess-input").val(text);
        $(".suggestions").remove();
        $("#guess-form")[0].submit();
      }
    });
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

guessForm();
