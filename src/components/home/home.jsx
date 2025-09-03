import React from "react";
import ModeLink from "../mode-link/mode-link";

function Home() {
  return (
    <article className="text-center d-flex flex-column align-items-center">
      <ul className="nav justify-content-center">
        <li className="nav-item">
          <ModeLink modeName={"classic"} />
        </li>
        <li className="nav-item">
          <ModeLink modeName={"borders"} />
        </li>
      </ul>
    </article>
  );
}

export default Home;
