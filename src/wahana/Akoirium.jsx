import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Akoirium = () => {
  return (
    <>
      <Navbar />
      <section className="relative w-full h-[400px] md:h-[550px] lg:h-[650px] overflow-hidden rounded-b-4xl">
        <div className="absolute inset-0">
          <img
            src="/assets/IMG/Akoirium1-min.jpg"
            alt="Akoirium"
            className="w-full h-full object-cover transform scale-105 hover:scale-100 transition-transform"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center w-full px-6">
          <div className="animate-fade-in-up">
            <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-bold drop-shadow-2xl mb-4">
              Akoirium
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-slate-100 text-lg md:text-xl lg:text-2xl font-light drop-shadow-lg max-w-2xl mx-auto leading-relaxed">
              Melihat banyak koi cantik dari dalam atau luar
            </p>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mt-2 mb-6">
                Pengalaman yang <br />
                Menenangkan di{" "}
                <span className="text-blue-600">Akuarium Koi</span>
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
                <p>
                  Akuarium Koi di Taman Rekreasi Selecta menghadirkan pengalaman
                  <span className="text-slate-800 font-semibold">
                    {" "}
                    melihat gerakan koi yang anggun{" "}
                  </span>
                  dalam sebuah ruang yang didesain tenang dan jernih. Area ini
                  menjadi salah satu spot favorit bagi pengunjung yang ingin
                  bersantai sambil menikmati warna-warni ikan koi yang memukau.
                </p>
                <p>
                  Rasakan ketenangan dari alunan air dan gerakan lembut
                  ikan-ikan koi yang berenang dengan harmonis. Kehangatan
                  suasana dan kejernihan akuarium membuat momen ini sempurna
                  untuk berfoto maupun sekadar menikmati keindahan alam dalam
                  suasana yang damai.
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
                <p className="text-slate-600">08.00 — 17.00 WIB</p>
                <p className="text-sm text-slate-500 mt-1">Setiap Hari</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-red-50 p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center mb-3 justify-center">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 48 48"
                      className="text-red-400">
                      <path
                        fill="CurrentColor"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M25.356 24.01c-.18-.541-.451-.993-.27-1.535c.09-.452.36-.994.722-1.355c.813-.813 2.077-.723 3.07-.452c.362.09 1.175.272 1.356.723c.09.18 0 .632 0 .813v.994c0 .632 0 1.264.09 1.806c.09.452.18 1.265.452 1.626s.903.723 1.264.994c.452.36.994.722 1.445 1.174a36.419 36.419 0 0 1 2.89 2.348c1.717 1.536 2.71 3.613 3.704 5.69c.542 1.084.903 2.259.542 3.433c-.271.993-1.174 1.716-1.987 2.258c-1.987 1.174-4.516 1.174-6.774.994a11.165 11.165 0 0 1-3.523-.813c-.542-.181-.994-.452-1.536-.723s-.993-.723-1.535-.903c-.452-.18-1.084.09-1.536.18c-.632.09-1.174.09-1.806.362c-1.084.451-2.078 1.084-3.162 1.355c-1.987.451-4.787-.632-5.058-2.89c-.09-1.175.813-1.988 1.807-2.259a6.874 6.874 0 0 1 1.897-.27h1.174c.27 0 .632.18.903 0c-.632-.362-1.265-.543-1.897-.904c-.722-.361-1.355-.813-1.987-1.264c-1.355-.994-2.439-2.078-3.523-3.252s-3.07.361-4.245-.542c-.542-.452-.632-1.174-.542-1.806c.09-.813.542-1.265 1.355-1.355c.18 0 .723.09.723-.09c.09-.181-.362-.814-.452-.994a10.315 10.315 0 0 1-.813-2.349c-.451-1.625-.632-3.161-.632-4.877c0-3.162.813-6.233 2.8-8.762c.452-.542.994-.993 1.535-1.535c.452-.723.813-1.445 1.265-2.078c.813-1.174 2.078-1.896 3.432-2.348c.723-.271 1.446-.452 2.168-.632c.632-.09 1.987-.362 2.62.09c.903.542-1.897 1.987-2.349 2.258c-1.174.994-.903 2.348-.451 3.703c.18.452.451 1.265.18 1.807c-.361.632-1.355.27-1.806.18c-1.536-.451-3.071-.27-4.426.542c-1.174.723-2.168 1.807-1.807 3.252c.09.271.18.632.362.903c.27.362.542.362.903.542c.542.271.27.994.993 1.174c.813.271 1.717-.09 2.62.271c.722.362.993.904 1.445 1.446c.452.451 1.445.27 1.987.27c.723 0 1.626-.09 2.349.362c.27.18.541.451.722.813c.18.361.361.361.723.542c.813.27 1.716.722 2.62 1.084Z"
                      />
                      <path
                        fill="currentColor"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M31.71 38.142c.981-.14 2.103 2.242.841 2.383c-1.262.42-1.963-2.383-.841-2.383Z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-amber-500">
                    Jumlah Koi
                  </h3>
                </div>
                <p className="text-red-600 text-3xl text-center font-semibold">
                  100++ Koi
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-red-100 rounded-2xl p-1 transform rotate-2">
              <div className="bg-amber-100 rounded-xl p-4 transform -rotate-2">
                <img
                  src="/assets/IMG/Akoirium1-min.jpg"
                  alt="Koi"
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
              Lihat wahana balon udara dari setiap sudut sebelum Anda
              mengunjunginya
            </p>
          </div>

          <div className="relative">
            <div className="w-full h-[400px] md:h-[600px] lg:h-[750px] rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
              <iframe
                src="/assets/Akoirium/index.htm"
                width="100%"
                height="100%"
                className="rounded-2xl"
                allowFullScreen
                title="360 Tour Balon Udara"
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

export default Akoirium;
