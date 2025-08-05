import guessForm from "../../common/js/guess-form.js";
import { checkBorderResult } from "../../common/js/api.js";

async function checkGuessFunction(guessCountry) {
  const guessResult = await checkBorderResult(guessCountry);

  if (guessResult) {
    $("#guess-input").addClass("fade-out-keep-space");
    $("#guess-button").addClass("fade-out-keep-space");
    $("#guess-form").find("input, button").prop("disabled", true);
  }
  const newGuess = $(
    `<div class="${
      guessResult ? "guess-item guess-success" : "guess-item guess-failure"
    }" style="display: none;"> ${guessCountry.name}</div>`
  );
  $("#guess-container").prepend(newGuess);
  newGuess.slideDown(400);
}
await guessForm(checkGuessFunction);
