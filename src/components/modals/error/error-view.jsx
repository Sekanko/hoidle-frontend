import React from "react";
import "./error-view.scss";

function ErrorView({ error }) {
  return (
    <div className="overlay">
      <div className="error-view">
        <h1 className="error-title">Oops!</h1>
        <h2 className="error-title">Something went wrong</h2>
        <span className="error-message">{error.message}</span>
      </div>
    </div>
  );
}

export default ErrorView;
