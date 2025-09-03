import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home/home";
import Classic from "./components/classic/classic";
import Borders from "./components/borders/bordes";
import HoidleHeader from "./components/header/HoidleHeader";
import { resetStorageAndSetUpNewPlayDate } from "./components/utils/set-storage-item";
import {
  isDateSameInWarsaw,
  getTimeToNextMidnight,
} from "./components/utils/date";
import { storageItems } from "./components/utils/constants/storage-item-names";

function App() {
  useEffect(() => {
    const date = localStorage.getItem(storageItems.PLAY_DATE);
    if (date && !isDateSameInWarsaw(date)) {
      resetStorageAndSetUpNewPlayDate();
    }
    const scheduleReset = () => {
      setTimeout(() => {
        resetStorageAndSetUpNewPlayDate();
        scheduleReset();
      }, getTimeToNextMidnight());
    };

    scheduleReset();
  }, []);
  return (
    <>
      <HoidleHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classic" element={<Classic />} />
        <Route path="/borders" element={<Borders />} />
      </Routes>
    </>
  );
}

export default App;
