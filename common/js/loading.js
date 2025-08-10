function loading() {
  if (!document.getElementById("loading-overlay")) {
    const overlay = document.createElement("div");
    overlay.id = "loading-overlay";
    overlay.innerHTML = `<div class="loader"></div>`;
    document.body.appendChild(overlay);
  }
}

function loaded() {
  const overlay = document.getElementById("loading-overlay");
  if (overlay) {
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.5s ease";
    setTimeout(() => overlay.remove(), 500);
  }
}

export { loading, loaded };
