import React from "react";
import { Link } from "react-router-dom";
import classicImg from "../../assets/classic.png";
import bordersImg from "../../assets/borders.png";
import "./mode-link.scss";

function ModeLink({ modeName, onReady = () => {} }) {
  const images = { classic: classicImg, borders: bordersImg };
  if (!images[modeName]) throw new Error(`${modeName} mode doesn't exists`);

  return (
    <Link className="nav-link active fs-10" to={`/${modeName}`}>
      <img
        src={images[modeName]}
        alt={`${modeName} route-img`}
        className="mode-img"
        onLoad={onReady}
      />
    </Link>
  );
}

export default ModeLink;
