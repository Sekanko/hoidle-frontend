import React from "react";
import { Link } from "react-router-dom";
import classicImg from "../../assets/classic.png";
import bordersImg from "../../assets/borders.png";
import "./mode-link.scss";

function ModeLink({ modeName }) {
  const images = { classic: classicImg, borders: bordersImg };
  if (!images[modeName]) throw new Error("Such mode doesn't exists");
  return (
    <Link className="nav-link active fs-10" to={`/${modeName}`}>
      <img src={images[modeName]} alt={modeName} className="mode-img" />
    </Link>
  );
}

export default ModeLink;
