function winProcedure(href, img) {
  const elements = $("#guess-input, #guess-button");
  let animationsFinished = 0;

  elements.addClass("fade-out-keep-space");
  $("#guess-form").find("input, button").prop("disabled", true);

  elements.on(
    "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",
    function () {
      animationsFinished++;
      if (animationsFinished === elements.length) {
        const winAd = $(`
            <div class="win-ad" style="display:none;">
              <h1>You win!</h1>
              <h2>Check out the other mode</h2>
              <a class="fs-10" href="${href}">
                <img src="${img}" alt="mode-img" class="mode-img" />
              </a>
            </div>
          `);

        $("article").append(winAd);
        winAd.fadeIn();

        $("html, body").animate(
          {
            scrollTop: $(".win-ad").offset().top,
          },
          500
        );
      }
    }
  );
}

export { winProcedure };
