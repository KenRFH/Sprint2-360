import React from "react";
import Landing from "./pages/landing.jsx";
import Footer from "./components/Footer.jsx";
import { Routes, Route } from "react-router-dom";
import Wahana from "./pages/wahana.jsx";
import DinoRanch from "./wahana/DinoRanch.jsx";
import Bianglala from "./wahana/Bianglala.jsx";
import BalonUdara from "./wahana/BalonUdara.jsx";
import FamilyCoaster from "./wahana/FamilyCoaster.jsx";
import KolamRenang from "./wahana/KolamRenang.jsx";
import MiniBCar from "./wahana/MiniBCar.jsx";
import PaddleBoat from "./wahana/PaddleBoat.jsx";
import SkyBike from "./wahana/SkyBike.jsx";
import GardenTram from "./wahana/GardenTram.jsx";
import Cinema from "./wahana/Cinema.jsx";
import Tagada from "./wahana/Tagada.jsx";
import Akoirium from "./wahana/Akoirium.jsx";


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/Wahana" element={<Wahana />} />
        <Route path="/Wahana/DinoRanch" element={<DinoRanch />} />
        <Route path="/Wahana/Bianglala" element={<Bianglala />} />
        <Route path="/Wahana/FamilyCoaster" element={<FamilyCoaster />} />
        <Route path="/Wahana/KolamRenang" element={<KolamRenang />} />
        <Route path="/Wahana/MiniBCar" element={<MiniBCar />} />
        <Route path="/Wahana/PaddleBoat" element={<PaddleBoat />} />
        <Route path="/Wahana/SkyBike" element={<SkyBike />} />
        <Route path="/Wahana/Tagada" element={<Tagada />} />
        <Route path="/Wahana/GardenTram" element={<GardenTram />} />
        <Route path="/Wahana/Cinema" element={<Cinema />} />
        <Route path="/Wahana/BalonUdara" element={<BalonUdara />} />
        <Route path="/Wahana/Akoirium" element={<Akoirium />} />
      </Routes>
    </div>
  );
};

export default App;
