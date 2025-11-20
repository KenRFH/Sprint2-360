import React from "react";
import Landing from "./pages/landing.jsx";
import Footer from "./components/Footer.jsx";
import { Routes, Route } from "react-router-dom";
import Wahana from "./pages/wahana.jsx";
import DinoRanch from "./wahana/DinoRanch.jsx";
import Bianglala from "./wahana/Bianglala.jsx";
import BalonUdara from "./wahana/BalonUdara.jsx";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/Wahana" element={<Wahana />} />
        <Route path="/Wahana/DinoRanch" element={<DinoRanch />} />
        <Route path="/Wahana/Bianglala" element={<Bianglala />} />
        <Route path="/Wahana/BalonUdara" element={<BalonUdara />} />
      </Routes>
    </div>
  );
};

export default App;
