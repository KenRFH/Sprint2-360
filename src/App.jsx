import React from "react";
import Landing from "./pages/landing.jsx";
import Footer from "./components/Footer.jsx";
import { Routes, Route } from "react-router-dom";
import Wahana from "./pages/Wahana";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/Wahana" element={<Wahana />} />
      </Routes>
    </div>
  );
};

export default App;
