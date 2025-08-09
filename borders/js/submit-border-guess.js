import guessForm from "../../common/js/guess-form.js";
import { checkBorderResult } from "../../common/js/api.js";
import { winProcedure } from "../../common/js/win-func.js";

async function checkGuessFunction(guessCountry) {
  const guessResult = await checkBorderResult(guessCountry);
  const newGuess = $(
    `<div class="${
      guessResult ? "guess-item guess-success" : "guess-item guess-failure"
    }" style="display: none;"> ${guessCountry.name}</div>`
  );
  $("#guess-container").prepend(newGuess);
  newGuess.slideDown(400);

  if (guessResult) {
    winProcedure("../classic", "../img/classic.png");
  }
}
await guessForm(checkGuessFunction);
