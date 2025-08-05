import { getBorderCountryUrl } from "../../common/js/api.js";

async function setDailyImg() {
  const url = await getBorderCountryUrl();
  $("#daily-border-img").attr("src", `borders-img/${url}`);
}
setDailyImg();
