import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home/home";
import Classic from "./components/classic/classic";
import Borders from "./components/borders/bordes";
import HoidleHeader from "./components/header/HoidleHeader";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classic" element={<Classic />} />
        <Route path="/borders" element={<Borders />} />
      </Routes>
    </>
  );
}

export default App;
