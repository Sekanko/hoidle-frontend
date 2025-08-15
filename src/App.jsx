import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Home from "./components/home/home";
import Classic from "./components/classic/classic";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classic" element={<Classic />} />
      </Routes>
    </>
  );
}

export default App;
