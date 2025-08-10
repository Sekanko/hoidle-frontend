import guessForm from "../../common/js/guess-form.js";
import { checkClassicResult } from "../../common/js/api.js";
import { prepareFieldForDisplay } from "../../common/js/prepare-data.js";
import { fieldBackgroundClass } from "./static.js";
import { winProcedure } from "../../common/js/win-func.js";
import fitty from "../../node_modules/fitty/dist/fitty.module.js";

function createTable(fields) {
  const table = $("<table class='guess-table'></table>");
  const thead = $("<thead></thead>");
  const headerRow = $("<tr></tr>");
  fields.forEach((field) => {
    headerRow.append(`<th>${prepareFieldForDisplay(field)}</th>`);
  });
  thead.append(headerRow);
  table.append(thead);

  const tbody = $("<tbody></tbody>");
  table.append(tbody);

  $("#guess-container").append(table);
}

async function checkGuessFunction(guessCountry) {
  const guessResult = await checkClassicResult(guessCountry);
  const row = $("<tr></tr>");

  Object.entries(guessCountry).forEach(([key, value], index) => {
    if (key === "url") return;

    const td = $(`
      <td class="${fieldBackgroundClass[guessResult[index]]} slide-down">
        <div class="centerContainer">
          <span class="fit-in">
            ${prepareFieldForDisplay(value)}
          </span>
        </div>
      </td>`);
    td.css("animation-delay", `${index * 0.2}s`);

    row.append(td);
  });

  $("tbody").prepend(row);

  setInterval(() => {
    fitty(".fit-in", {
      minSize: 9,
      maxSize: 18,
    });
  }, 1);

  if (guessResult.every((color) => color === "GREEN")) {
    winProcedure("../borders", "../img/borders.png");
  }
}

async function init() {
  let fields = await guessForm(checkGuessFunction);
  fields = fields.filter((field) => field !== "url");
  createTable(fields);
}

init();
