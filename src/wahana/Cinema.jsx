import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Cinema = () => {
  return (
    <>
      <Navbar />
      <section className="relative w-full h-[400px] md:h-[550px] lg:h-[650px] overflow-hidden rounded-b-4xl">
        <div className="absolute inset-0">
          <img
            src="/assets/IMG/4DCinema-min.jpg"
            alt="4D Cinema"
            className="w-full h-full object-cover transform scale-105 hover:scale-100 transition-transform duration-7000"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center w-full px-6">
          <div className="animate-fade-in-up">
            <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-bold drop-shadow-2xl mb-4">
              4D Cinema
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-slate-100 text-lg md:text-xl lg:text-2xl font-light drop-shadow-lg max-w-2xl mx-auto leading-relaxed">
              Rasakan pengalaman menonton yang imersif dengan efek visual dan
              sensasi nyata, membawa Anda seolah ikut masuk ke dalam film dalam
              wahana 4D Cinema yang seru untuk semua usia.
            </p>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mt-2 mb-6">
                Pengalaman Menonton <br />
                Lebih Hidup di <span className="text-blue-600">4D Cinema</span>
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
                <p>
                  Wahana 4D Cinema di Taman Rekreasi Selecta menghadirkan
                  pengalaman
                  <span className="text-slate-800 font-semibold">
                    {" "}
                    menonton dengan sensasi nyata{" "}
                  </span>
                  yang membuat Anda seolah ikut masuk ke dalam setiap adegan.
                  Melalui teknologi visual modern, kursi bergerak, dan berbagai
                  efek pendukung, wahana ini memberikan pengalaman sinematik
                  berbeda dari bioskop biasa.
                </p>
                <p>
                  Rasakan gabungan antara gambar berkualitas tinggi, efek angin,
                  gerakan, getaran, dan kejutan menarik lainnya yang membuat
                  setiap momen terasa hidup. 4D Cinema menawarkan pengalaman
                  hiburan yang memadukan keseruan, kejutan, dan imersi maksimal
                  untuk semua usia.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="200"
                      height="20"
                      viewBox="0 0 20 20">
                      <path
                        fill="currentColor"
                        d="M10 20a10 10 0 1 1 0-20a10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16zm-1-7.59V4h2v5.59l3.95 3.95l-1.41 1.41L9 10.41z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800">
                    Jam Operasional
                  </h3>
                </div>
                <p className="text-slate-600 text-center">08.00 — 17.00 WIB</p>
                <p className="text-sm text-slate-500 mt-1 text-center ">Setiap Hari</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      className="text-blue-500">
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M2.75 7.5a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3zM7 5v14M17 5v14M2.75 9.5H7m-4.25 5H7m10-5h4.25m-4.25 5h4.25"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800">Film</h3>
                </div>
                <p className="text-blue-600 text-7xl font-bold text-center">
                  10++
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-red-100 rounded-2xl p-1 transform rotate-2">
              <div className="bg-blue-100 rounded-xl p-4 transform -rotate-2">
                <img
                  src="/assets/IMG/4DCinema-min.jpg"
                  alt="Balon Udara Experience"
                  className="w-full h-auto rounded-lg shadow-lg"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full bg-gradient-to-br from-slate-50 to-blue-50 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-7xl font-bold text-blue-600 mt-2 mb-4">
              Jelajahi{" "}
              <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                360° Experience
              </span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              
            </p>
          </div>

          <div className="relative">
            <div className="w-full h-[400px] md:h-[600px] lg:h-[750px] rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
              <iframe
                src="/assets/4DCinema/index.htm"
                width="100%"
                height="100%"
                className="rounded-2xl"
                allowFullScreen
                title="360 Tour Balon Udara"
                loading="lazy"
              />
            </div>
          </div>

          {/* Tour Instructions */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center space-x-6 text-slate-600">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    className="text-white">
                    <path
                      fill="currentColor"
                      stroke="#000000"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="m12.102 8.419l.21 2.686l6.759-6.608a1.743 1.743 0 0 1 2.426 0a1.65 1.65 0 0 1 0 2.372l-3.64 3.558l1.74 2.349c1.137 1.503 1.705 2.255 1.894 2.99c.312 1.217.175 2.452-.846 3.45c-.711.696-1.364.991-3.074 1.827c-1.085.53-1.628.796-2.17.894a4 4 0 0 1-2.615-.415c-.484-.261-.913-.68-1.77-1.52l-.727-.71c-1.14-1.115-1.711-1.673-2.01-2.374a4 4 0 0 1-.139-.384c-.22-.728-.138-1.512.028-3.081l.538-5.078c.082-.78.71-1.399 1.507-1.485c.959-.104 1.815.589 1.889 1.529M9.069 3.526c0 .844.659 1.528 1.472 1.528s1.472-.684 1.472-1.528s-.66-1.528-1.472-1.528c-.813 0-1.472.684-1.472 1.528m0 0h-.652l-.78.073M3.51 9.006a1.47 1.47 0 0 1 1.505 1.467c.013.82-.617 1.524-1.464 1.538a1.535 1.535 0 0 1-1.55-1.496c-.014-.82.662-1.495 1.509-1.509m0 0L3.6 7.66m1.716-2.986l-.332.31l-.293.315"
                      color="currentColor"
                    />
                  </svg>
                </div>
                <span>Drag untuk melihat sekitar</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    className="text-white">
                    <path
                      fill="currentColor"
                      stroke="black"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M7.416 14v-3.5m0 0V4.25a1.75 1.75 0 1 1 3.5 0V9.5l3.077.478c1.929.289 2.893.434 3.572.84c1.122.673 1.935 1.682 1.935 3.156c0 1.026-.254 1.715-.87 3.565c-.392 1.174-.587 1.76-.906 2.225a4 4 0 0 1-2.193 1.58c-.541.156-1.16.156-2.397.156h-1.405c-1.785 0-2.677 0-3.443-.335a4 4 0 0 1-.96-.593c-.642-.535-1.04-1.333-1.839-2.93c-.647-1.294-.97-1.94-.986-2.612a3 3 0 0 1 .115-.895c.184-.646.66-1.19 1.614-2.28z"
                      color="currentColor"
                    />
                  </svg>
                </div>
                <span>Scroll untuk zoom</span>
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
            Pesan tiket Anda sekarang dan rasakan sensasi melayang di atas
            keindahan Selecta
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

export default Cinema;
