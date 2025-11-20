import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const Wahana = () => {
  return (
    <>
      <Navbar />
      <section className="bg-green-50 min-h-[calc(100vh-80px)] flex items-center py-10 lg:py-0">
        <div className="container mx-auto px-6 md:px-10 flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-4">
          {/* Text Content */}
          <div className="flex flex-col justify-center items-center lg:items-start h-full max-w-2xl text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-600 font-bold leading-tight">
              Melihat{" "}
              <span className="relative inline-block mx-1">
                <span className="absolute -inset-1 bg-blue-600 block -skew-y-3 rounded-lg"></span>
                <span className="relative text-white px-2 py-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                  Selecta
                </span>
              </span>{" "}
              <br className="block sm:hidden" />
              Lebih{" "}
              <span className="bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">
                Dekat
              </span>
            </h1>

            <p className="mt-6 text-slate-700 text-base sm:text-lg max-w-md lg:max-w-full mx-auto lg:mx-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Perspiciatis non aspernatur pariatur inventore...
            </p>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-2">
            <img
              src="/assets/DinoRanch.png"
              alt="Wahana Selecta"
              className="h-64 sm:h-80 md:h-96 lg:h-[600px] w-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>
      <div className="relative w-full overflow-hidden leading-none -mt-1">
        <svg
          className="block w-full h-12 sm:h-24 text-green-50"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none">
          <path
            fill="currentColor"
            d="M321.39,56.44c58-10.79,114.16-30.13,
            172-41.86c82.39-16.72,168.19-17.73,
            250.45-.39C823.78,31,906.67,72,985.66,
            92.83c70.05,18.48,146.53,26.09,
            214.34,3V0H0V27.35A600.21,600.21,
            0,0,0,321.39,56.44Z"
          />
        </svg>
      </div>
      <section className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-slate-100 -mt-23 rounded-b-2xl pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-t from-blue-500 to-blue-600 mb-4">
              Wahana Pilihan
            </h2>
            <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
              Jelajahi berbagai wahana seru yang kami sediakan untuk pengalaman
              tak terlupakan
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Dino Ranch */}
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative">
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-amber-500 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  BARU!
                </span>
              </div>
              <div className="w-full h-44 md:h-48 bg-gradient-to-r from-white to-white/40 rounded-t-xl overflow-hidden relative">
                <img
                  src="/assets/DinoRanch.png"
                  alt="Dino Ranch"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="p-5 md:p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800">
                    Dino Ranch
                  </h3>
                  <div className="flex items-center text-amber-500">
                    <i className="fas fa-star text-xs md:text-sm"></i>
                    <span className="ml-1 text-xs md:text-sm font-semibold">
                      4.8
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-xs md:text-sm mb-4 line-clamp-2">
                  Nikmati keseruan wahana air yang menyegarkan dengan berbagai
                  pilihan kolam dan seluncuran!
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <div className="flex items-center text-slate-500 text-xs md:text-sm">
                    <i className="fas fa-clock mr-1"></i>
                    <span>10.00 - 18.00</span>
                  </div>
                  <Link
                    to="/Wahana/DinoRanch"
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs md:text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-300 flex items-center">
                    <span>Detail</span>
                    <i className="fas fa-arrow-right ml-2 text-[10px]"></i>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bianglala */}
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative">
              <div className="w-full h-44 md:h-48 bg-gradient-to-r from-white to-white/40 rounded-t-xl overflow-hidden relative">
                <img
                  src="../assets/Bianglala.png"
                  alt="Bianglala"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="p-5 md:p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800">
                    Bianglala
                  </h3>
                  <div className="flex items-center text-amber-500">
                    <i className="fas fa-star text-xs md:text-sm"></i>
                    <span className="ml-1 text-xs md:text-sm font-semibold">
                      4.7
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-xs md:text-sm mb-4 line-clamp-2">
                  Area taman penuh warna untuk bersantai dan berfoto dengan
                  pemandangan alam yang menakjubkan.
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <div className="flex items-center text-slate-500 text-xs md:text-sm">
                    <i className="fas fa-clock mr-1"></i>
                    <span>08.00 - 20.00</span>
                  </div>
                  <Link
                    to="/Wahana/Bianglala"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs md:text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-300 flex items-center">
                    <span>Detail</span>
                    <i className="fas fa-arrow-right ml-2 text-[10px]"></i>
                  </Link>
                </div>
              </div>
            </div>

            {/* Balon Udara */}
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative">
              <div className="w-full h-44 md:h-48 bg-gradient-to-r from-white to-white/40 rounded-t-xl overflow-hidden relative">
                <img
                  src="./assets/IMG/BalonUdara-min.jpg"
                  alt="Balon Udara"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="p-5 md:p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800">
                    Balon Udara
                  </h3>
                  <div className="flex items-center text-amber-500">
                    <i className="fas fa-star text-xs md:text-sm"></i>
                    <span className="ml-1 text-xs md:text-sm font-semibold">
                      4.7
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-xs md:text-sm mb-4 line-clamp-2">
                  Area taman penuh warna untuk bersantai dan berfoto dengan
                  pemandangan alam yang menakjubkan.
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <div className="flex items-center text-slate-500 text-xs md:text-sm">
                    <i className="fas fa-clock mr-1"></i>
                    <span>08.00 - 20.00</span>
                  </div>
                  <Link
                    to="/Wahana/BalonUdara"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs md:text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-300 flex items-center">
                    <span>Detail</span>
                    <i className="fas fa-arrow-right ml-2 text-[10px]"></i>
                  </Link>
                </div>
              </div>
            </div>
            {/*Akoirium */}
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative">
              <div className="w-full h-44 md:h-48 bg-gradient-to-r from-white to-white/40 rounded-t-xl overflow-hidden relative">
                <img
                  src="./assets/IMG/Akoirium1-min.jpg"
                  alt="Akoirium"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="p-5 md:p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800">
                    Akoirium
                  </h3>
                  <div className="flex items-center text-amber-500">
                    <i className="fas fa-star text-xs md:text-sm"></i>
                    <span className="ml-1 text-xs md:text-sm font-semibold">
                      4.7
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-xs md:text-sm mb-4 line-clamp-2">
                  Area taman penuh warna untuk bersantai dan berfoto dengan
                  pemandangan alam yang menakjubkan.
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <div className="flex items-center text-slate-500 text-xs md:text-sm">
                    <i className="fas fa-clock mr-1"></i>
                    <span>08.00 - 20.00</span>
                  </div>
                  <Link
                    to="/Wahana/Akoirium"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs md:text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-300 flex items-center">
                    <span>Detail</span>
                    <i className="fas fa-arrow-right ml-2 text-[10px]"></i>
                  </Link>
                </div>
              </div>
            </div>
            {/* Garden Tram */}
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative">
              <div className="w-full h-44 md:h-48 bg-gradient-to-r from-white to-white/40 rounded-t-xl overflow-hidden relative">
                <img
                  src="./assets/IMG/GardenTram.jpg"
                  alt="Garden Tram"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="p-5 md:p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800">
                    Garden Tram
                  </h3>
                  <div className="flex items-center text-amber-500">
                    <i className="fas fa-star text-xs md:text-sm"></i>
                    <span className="ml-1 text-xs md:text-sm font-semibold">
                      4.7
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-xs md:text-sm mb-4 line-clamp-2">
                  Area taman penuh warna untuk bersantai dan berfoto dengan
                  pemandangan alam yang menakjubkan.
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <div className="flex items-center text-slate-500 text-xs md:text-sm">
                    <i className="fas fa-clock mr-1"></i>
                    <span>08.00 - 20.00</span>
                  </div>
                  <Link
                    to="/Wahana/GardenTram"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs md:text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-300 flex items-center">
                    <span>Detail</span>
                    <i className="fas fa-arrow-right ml-2 text-[10px]"></i>
                  </Link>
                </div>
              </div>
            </div>
            {/* Family Coaster */}
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative">
              <div className="w-full h-44 md:h-48 bg-gradient-to-r from-white to-white/40 rounded-t-xl overflow-hidden relative">
                <img
                  src="./assets/IMG/FamilyCoaster-min.jpg"
                  alt="Family Coaster"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="p-5 md:p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800">
                    Family Coaster
                  </h3>
                  <div className="flex items-center text-amber-500">
                    <i className="fas fa-star text-xs md:text-sm"></i>
                    <span className="ml-1 text-xs md:text-sm font-semibold">
                      4.7
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-xs md:text-sm mb-4 line-clamp-2">
                  Area taman penuh warna untuk bersantai dan berfoto dengan
                  pemandangan alam yang menakjubkan.
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <div className="flex items-center text-slate-500 text-xs md:text-sm">
                    <i className="fas fa-clock mr-1"></i>
                    <span>08.00 - 20.00</span>
                  </div>
                  <Link
                    to="/Wahana/FamilyCoaster"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs md:text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-300 flex items-center">
                    <span>Detail</span>
                    <i className="fas fa-arrow-right ml-2 text-[10px]"></i>
                  </Link>
                </div>
              </div>
            </div>
            {/* 4D Cinema */}
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative">
              <div className="w-full h-44 md:h-48 bg-gradient-to-r from-white to-white/40 rounded-t-xl overflow-hidden relative">
                <img
                  src="./assets/IMG/4DCinema-min.jpg"
                  alt="4D Cinema"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="p-5 md:p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800">
                    4D Cinema
                  </h3>
                  <div className="flex items-center text-amber-500">
                    <i className="fas fa-star text-xs md:text-sm"></i>
                    <span className="ml-1 text-xs md:text-sm font-semibold">
                      4.7
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-xs md:text-sm mb-4 line-clamp-2">
                  Area taman penuh warna untuk bersantai dan berfoto dengan
                  pemandangan alam yang menakjubkan.
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <div className="flex items-center text-slate-500 text-xs md:text-sm">
                    <i className="fas fa-clock mr-1"></i>
                    <span>08.00 - 20.00</span>
                  </div>
                  <Link
                    to="/Wahana/Cinema"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs md:text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-300 flex items-center">
                    <span>Detail</span>
                    <i className="fas fa-arrow-right ml-2 text-[10px]"></i>
                  </Link>
                </div>
              </div>
            </div>
            {/* Paddle Boat*/}
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative">
              <div className="w-full h-44 md:h-48 bg-gradient-to-r from-white to-white/40 rounded-t-xl overflow-hidden relative">
                <img
                  src="./assets/IMG/PaddleBoat-min.jpg"
                  alt="Paddle Boat"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="p-5 md:p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800">
                    Paddle Boat
                  </h3>
                  <div className="flex items-center text-amber-500">
                    <i className="fas fa-star text-xs md:text-sm"></i>
                    <span className="ml-1 text-xs md:text-sm font-semibold">
                      4.7
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-xs md:text-sm mb-4 line-clamp-2">
                  Area taman penuh warna untuk bersantai dan berfoto dengan
                  pemandangan alam yang menakjubkan.
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <div className="flex items-center text-slate-500 text-xs md:text-sm">
                    <i className="fas fa-clock mr-1"></i>
                    <span>08.00 - 20.00</span>
                  </div>
                  <Link
                    to="/Wahana/PaddleBoat"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs md:text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-300 flex items-center">
                    <span>Detail</span>
                    <i className="fas fa-arrow-right ml-2 text-[10px]"></i>
                  </Link>
                </div>
              </div>
            </div>
            {/* SkyBike*/}
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative">
              <div className="w-full h-44 md:h-48 bg-gradient-to-r from-white to-white/40 rounded-t-xl overflow-hidden relative">
                <img
                  src="./assets/IMG/SkyBike.jpg"
                  alt="SkyBike"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="p-5 md:p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800">
                    SkyBike
                  </h3>
                  <div className="flex items-center text-amber-500">
                    <i className="fas fa-star text-xs md:text-sm"></i>
                    <span className="ml-1 text-xs md:text-sm font-semibold">
                      4.7
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-xs md:text-sm mb-4 line-clamp-2">
                  Area taman penuh warna untuk bersantai dan berfoto dengan
                  pemandangan alam yang menakjubkan.
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <div className="flex items-center text-slate-500 text-xs md:text-sm">
                    <i className="fas fa-clock mr-1"></i>
                    <span>08.00 - 20.00</span>
                  </div>
                  <Link
                    to="/Wahana/SkyBike"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs md:text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-300 flex items-center">
                    <span>Detail</span>
                    <i className="fas fa-arrow-right ml-2 text-[10px]"></i>
                  </Link>
                </div>
              </div>
            </div>
            {/* Tagada */}
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative">
              <div className="w-full h-44 md:h-48 bg-gradient-to-r from-white to-white/40 rounded-t-xl overflow-hidden relative">
                <img
                  src="./assets/IMG/Tagada-min.jpg"
                  alt="Tagada"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="p-5 md:p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800">
                    Tagada
                  </h3>
                  <div className="flex items-center text-amber-500">
                    <i className="fas fa-star text-xs md:text-sm"></i>
                    <span className="ml-1 text-xs md:text-sm font-semibold">
                      4.7
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-xs md:text-sm mb-4 line-clamp-2">
                  Area taman penuh warna untuk bersantai dan berfoto dengan
                  pemandangan alam yang menakjubkan.
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <div className="flex items-center text-slate-500 text-xs md:text-sm">
                    <i className="fas fa-clock mr-1"></i>
                    <span>08.00 - 20.00</span>
                  </div>
                  <Link
                    to="/Wahana/Tagada"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs md:text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-300 flex items-center">
                    <span>Detail</span>
                    <i className="fas fa-arrow-right ml-2 text-[10px]"></i>
                  </Link>
                </div>
              </div>
            </div>
            {/* Mini Bumper Car*/}
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative">
              <div className="w-full h-44 md:h-48 bg-gradient-to-r from-white to-white/40 rounded-t-xl overflow-hidden relative">
                <img
                  src="./assets/IMG/MiniBumper-min.jpg"
                  alt="Mini Bumper Car"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="p-5 md:p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800">
                    Mini Bumper Car
                  </h3>
                  <div className="flex items-center text-amber-500">
                    <i className="fas fa-star text-xs md:text-sm"></i>
                    <span className="ml-1 text-xs md:text-sm font-semibold">
                      4.7
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-xs md:text-sm mb-4 line-clamp-2">
                  Area taman penuh warna untuk bersantai dan berfoto dengan
                  pemandangan alam yang menakjubkan.
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <div className="flex items-center text-slate-500 text-xs md:text-sm">
                    <i className="fas fa-clock mr-1"></i>
                    <span>08.00 - 20.00</span>
                  </div>
                  <Link
                    to="/Wahana/MiniBCar"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs md:text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-300 flex items-center">
                    <span>Detail</span>
                    <i className="fas fa-arrow-right ml-2 text-[10px]"></i>
                  </Link>
                </div>
              </div>
            </div>
            {/* Kolam Renang*/}
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative">
              <div className="w-full h-44 md:h-48 bg-gradient-to-r from-white to-white/40 rounded-t-xl overflow-hidden relative">
                <img
                  src="./assets/IMG/MiniBumper-min.jpg"
                  alt="Kolam Renang"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="p-5 md:p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800">
                    Kolam Renang
                  </h3>
                  <div className="flex items-center text-amber-500">
                    <i className="fas fa-star text-xs md:text-sm"></i>
                    <span className="ml-1 text-xs md:text-sm font-semibold">
                      4.7
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-xs md:text-sm mb-4 line-clamp-2">
                  Area taman penuh warna untuk bersantai dan berfoto dengan
                  pemandangan alam yang menakjubkan.
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <div className="flex items-center text-slate-500 text-xs md:text-sm">
                    <i className="fas fa-clock mr-1"></i>
                    <span>08.00 - 20.00</span>
                  </div>
                  <Link
                    to="/Wahana/KolamRenang"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs md:text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-300 flex items-center">
                    <span>Detail</span>
                    <i className="fas fa-arrow-right ml-2 text-[10px]"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gradient-to-b from-blue-800 to-blue-900 py-16 overflow-hidden rounded-t-2xl">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Siap untuk Mencoba Wahana?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Pesan tiket Anda sekarang dan nikmati wahana serta keindahan Selecta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://yellow-partridge-166068.hostingersite.com/keranjang"
              className="bg-white text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors duration-500 shadow-lg hover:shadow-xl transform flex items-center gap-2">
              Pesan Tiket Sekarang{" "}
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 256 256">
                  <path
                    fill="currentColor"
                    d="M227.19 104.48A16 16 0 0 0 240 88.81V64a16 16 0 0 0-16-16H32a16 16 0 0 0-16 16v24.81a16 16 0 0 0 12.81 15.67a24 24 0 0 1 0 47A16 16 0 0 0 16 167.19V192a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16v-24.81a16 16 0 0 0-12.81-15.67a24 24 0 0 1 0-47ZM32 167.2a40 40 0 0 0 0-78.39V64h56v128H32Zm192 0V192H104V64h120v24.8a40 40 0 0 0 0 78.39Z"
                  />
                </svg>
              </span>
            </a>
            <a
              href="https://yellow-partridge-166068.hostingersite.com/"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-600 hover:text-white transition-colors duration-500 flex items-center gap-2">
              Kunjungi Website Utama{" "}
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M3.055 11a9.009 9.009 0 0 1 6.277-7.598A16.906 16.906 0 0 0 7.029 11H3.055Zm7.937-9.954C5.39 1.554 1 6.265 1 12s4.39 10.445 9.992 10.954l.008.01l.425.021A12.476 12.476 0 0 0 12 23a11.285 11.285 0 0 0 .575-.015l.425-.02l.008-.01C18.61 22.444 23 17.735 23 12S18.61 1.554 13.008 1.046L13 1.036l-.426-.021a11.162 11.162 0 0 0-1.148 0l-.426.02l-.008.01ZM12.002 3a14.918 14.918 0 0 1 2.965 8H9.033a14.918 14.918 0 0 1 2.966-8H12ZM7.028 13c.16 2.76.98 5.345 2.303 7.598A9.009 9.009 0 0 1 3.054 13h3.974Zm4.97 8a14.918 14.918 0 0 1-2.966-8h5.934A14.918 14.918 0 0 1 12 21Zm2.67-.402A16.907 16.907 0 0 0 16.97 13h3.974a9.009 9.009 0 0 1-6.277 7.598ZM16.97 11c-.16-2.76-.98-5.345-2.303-7.598A9.009 9.009 0 0 1 20.945 11h-3.974Z"
                  />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Wahana;
