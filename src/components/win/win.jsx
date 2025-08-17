import React, { useRef, useEffect } from "react";
import "./win.scss";

function Win({ imgRoute }) {
  const winRef = useRef(null);

  useEffect(() => {
    if (winRef.current) {
      setTimeout(() => {
        winRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 50);
    }
  }, []);
  return (
    <div ref={winRef} className="win-ad">
      <h1>You win!</h1>
      <h2>Check out the other mode</h2>
      {imgRoute}
    </div>
  );
}

export default Win;
