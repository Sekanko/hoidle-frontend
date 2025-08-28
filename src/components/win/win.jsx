import React, { useRef, useEffect, useState } from "react";
import "./win.scss";
import ModeLink from "../mode-link/mode-link";

function Win({ modeName }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const winRef = useRef(null);

  useEffect(() => {
    if (isLoaded && winRef.current) {
      winRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isLoaded]);

  return (
    <div ref={winRef} className="win-ad">
      <h1>You win!</h1>
      <h2>Check out the other mode</h2>
      <ModeLink modeName={modeName} onReady={() => setIsLoaded(true)} />
    </div>
  );
}

export default Win;
