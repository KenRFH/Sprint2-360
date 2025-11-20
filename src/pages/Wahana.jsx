import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Wahana = () => {
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-blue-100 via-lime-100 to-blue-200 h-[calc(100vh-80px)] flex items-center">
        <div className="flex justify-between items-center w-full px-10 gap-10">
          {/* TEXT */}
          <div className="flex flex-col justify-center items-start h-full max-w-2xl">
            <h1 className="text-7xl text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500 font-bold leading-tight">
              Melihat Selecta Lebih Dekat
            </h1>

            <p className="mt-4 text-slate-700">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Perspiciatis non aspernatur pariatur inventore...
            </p>
          </div>

          {/* IMAGE */}
          <img
            src="/assets/Wahana3.png"
            alt=""
            className="h-[600px] object-contain"
          />
        </div>
      </section>

      {/* WAVY SEPARATOR */}
      {/* WAVY SEPARATOR */}
      <div className="relative w-full overflow-hidden leading-none -mt-1">
        <svg
          className="block w-full h-24"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#93C5FD" /> {/* blue-300 */}
              <stop offset="50%" stopColor="#BBF7D0" /> {/* green-200 */}
              <stop offset="100%" stopColor="#A5F3FC" /> {/* sky-200 */}
            </linearGradient>
          </defs>

          <path
            fill="url(#waveGradient)"
            d="M321.39,56.44c58-10.79,114.16-30.13,
      172-41.86c82.39-16.72,168.19-17.73,
      250.45-.39C823.78,31,906.67,72,985.66,
      92.83c70.05,18.48,146.53,26.09,
      214.34,3V0H0V27.35A600.21,600.21,
      0,0,0,321.39,56.44Z"
          />
        </svg>
      </div>

      {/* CONTENT SECTION */}
      <section className="min-h-screen bg-white"></section>

      <Footer />
    </>
  );
};

export default Wahana;
