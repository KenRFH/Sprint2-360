import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useScroll } from "@use-gesture/react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const Landing = () => {
  const [{ y }, api] = useSpring(() => ({ y: 0 }));
  const [scrollProgress, setScrollProgress] = useState(0);

  useScroll(
    ({ offset: [, yOffset] }) => {
      const progress = Math.min(yOffset / 900, 1);
      setScrollProgress(progress);
      api.start({ y: yOffset / 4 });
    },
    {
      target: window,
      eventOptions: { passive: true },
    }
  );

  return (
    <>
      <Navbar />
      <div className="h-[110vh] sm:h-[130vh] md:h-[160vh] relative overflow-hidden">
        <animated.div
          style={{ transform: y.to((v) => `translateY(${v}px)`) }}
          className="absolute inset-0 w-full h-full">
          <img
            src="/assets/bg3.png"
            className="w-full h-full object-cover"
            alt="Background Selecta"
          />

          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{
              backgroundColor: `rgba(0,0,0,${0.25 + scrollProgress * 0.35})`,
            }}
          />
        </animated.div>

        <div className="relative z-10 flex justify-center items-center h-full px-4 sm:px-6 lg:px-8">
          <div className="text-center w-full max-w-6xl mx-auto">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[90px] font-bold text-white drop-shadow-xl mb-4 md:mb-6 leading-tight">
              Virtual Tour{" "}
              <span className="relative inline-block">
                <span className="absolute -inset-1 bg-blue-600 block -skew-y-3 rounded-lg"></span>
                <span className="relative text-white px-3 py-1 text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-8xl">
                  Selecta
                </span>
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/90 mt-4 md:mt-6 max-w-lg sm:max-w-xl md:max-w-2xl mx-auto">
              Jelajahi keindahan Selecta dengan pengalaman virtual 360° yang
              imersif
            </p>

            <div className="mt-6 md:mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#Tour"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                Mulai Tur Virtual
              </a>

              <div>
                <Link
                  to="/Wahana"
                  className="bg-white/60 backdrop-blur-sm p-2 rounded-lg md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold flex items-center gap-1 text-blue-600">
                  Lihat Wahana{" "}
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      className="text-blue-500">
                      <path
                        fill="currentColor"
                        d="M2.002 9.538c-.023.411.207.794.581.966l7.504 3.442l3.442 7.503c.164.356.52.583.909.583l.057-.002a1 1 0 0 0 .894-.686l5.595-17.032c.117-.358.023-.753-.243-1.02s-.66-.358-1.02-.243L2.688 8.645a.997.997 0 0 0-.686.893z"
                      />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="min-h-screen bg-white flex flex-col items-center justify-center py-12 md:py-20 px-4 sm:px-6 lg:px-8 ">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 mb-4 drop-shadow-2xl">
              Selecta <span className="text-blue-600">360°</span>?
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Virtual tour 360° bikin kamu bisa “jalan-jalan” ke Selecta tanpa
              harus melangkah satu kaki pun. Tinggal gerakkan layar, kamu bisa
              nengok kiri–kanan, lihat pemandangan atas–bawah, bahkan pindah
              spot seolah lagi muter langsung di dalam taman.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className=" relative w-full h-[260px] sm:h-[320px] md:h-[420px] lg:h-[520px] overflow-hidden rounded-xl shadow-lg p-2 backdrop-blur-2xl ">
              <iframe
                src="assets/loket-taman/index.htm"
                width="100%"
                height="100%"
                className="block rounded-2xl"
                allowFullScreen
                loading="lazy"></iframe>
            </div>

            <div className="order-1 lg:order-2 space-y-5 md:space-y-7">
              {[
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 1024 1024"
                      className="text-blue-500">
                      <path
                        fill="currentColor"
                        d="M1025.02 512c0-272.016-213.663-495.104-482.319-511.023c-5.536-.608-11.088-1.009-16.72-1.009c-1.664 0-3.328.176-4.992.224c-2.992-.048-5.968-.224-8.992-.224C229.117-.032-1.026 229.664-1.026 512s230.144 512.032 513.023 512.032c3.024 0 6-.176 9.008-.24c1.664.064 3.328.24 4.992.24c5.632 0 11.184-.4 16.72-1.009c268.64-15.92 482.304-238.976 482.303-511.023zm-95.451 164.832c-17.632-5.12-61.92-16.24-140.064-25.392c6.464-44.192 10-90.896 10-139.44c0-38.256-2.208-75.343-6.288-111.008c99.008-11.824 142.384-26.72 145.296-27.745l-11.92-33.584c22.24 53.088 34.56 111.296 34.56 172.336c0 58.193-11.28 113.761-31.583 164.833zM285.488 512.001c0-35.808 2.37-70.77 6.705-104.401c51.888 4.08 113.936 7.088 186.863 7.792v222.064c-70.992.688-131.664 3.568-182.688 7.473c-7.04-42.193-10.88-86.88-10.88-132.928zM542.945 68.223c78.464 22.736 145.648 131.695 175.744 276.111c-48.368 3.856-106.624 6.673-175.744 7.33V68.223zm-63.886.783V351.63c-68.368-.688-126.88-3.473-176.063-7.232C333.7 201.79 401.428 93.646 479.059 69.006zm0 632.223l.001 253.743c-72.4-22.976-136.192-118.575-169.36-247.023c47.76-3.504 104.096-6.063 169.359-6.72zm63.888 254.543l-.001-254.56c65.952.623 122.064 3.28 169.217 6.928c-32.608 130.128-96 226.416-169.216 247.632zm-.001-318.32l.001-222.032c73.311-.688 134.991-3.776 186.191-8a844.922 844.922 0 0 1 6.496 104.592c0 46.128-3.712 90.864-10.528 133.12c-50.416-4.08-110.8-7.008-182.16-7.68zm371.858-323.52c-9.664 3.008-50.063 14.48-131.023 24.032c-18.048-95.952-50.672-177.968-93.12-237.168C788.197 143.18 867.797 219.1 914.805 313.932zM358.82 90.589c-52.208 59.952-94.832 146.161-118.096 248.113c-72.48-7.856-115.921-17.089-133.312-21.281c50.72-104.64 141.04-186.752 251.408-226.832zM83.637 377.182c12.32 3.344 58.913 14.941 145.553 24.525a795.86 795.86 0 0 0-7.68 110.305c0 48.273 4.368 94.721 12.24 138.688c-74.4 8.033-120.16 17.649-140.688 22.609c-19.44-50.096-30.208-104.447-30.208-161.312c0-46.96 7.312-92.256 20.783-134.815zm37.457 355.166c23.264-4.944 64.912-12.464 126.592-18.928c24.288 89.712 63.792 165.616 111.136 219.968c-101.12-36.72-185.296-108.752-237.728-201.04zM690.662 923.18c38.224-53.264 68.48-125.024 87.296-208.801c63.408 7.28 103.216 15.792 123.296 20.864c-48.016 83.072-121.855 149.393-210.592 187.937z"
                      />
                    </svg>
                  ),
                  title: "Pandangan 360°",
                  description:
                    "Lihat semua arah secara bebas seperti benar-benar berada di lokasi.",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 56 56"
                      className="text-blue-500">
                      <path
                        fill="currentColor"
                        d="M2.195 36.895c.82-.024 1.407-.657 1.43-1.5c.258-10.196 5.508-17.743 13.477-20.696l5.46 15c.047.117.024.211-.093.258c-.094.047-.164 0-.235-.07l-2.765-3c-1.805-1.946-4.102-2.086-5.883-.586c-2.016 1.71-2.04 4.265-.07 6.68l7.851 9.492c5.93 7.172 12.89 9.398 20.672 6.562c9.305-3.375 13.266-11.906 9.515-22.219l-1.757-4.804c-1.828-5.086-5.32-7.172-9.422-5.742c-1.102-1.43-2.79-1.922-4.617-1.266a7.14 7.14 0 0 0-1.828 1.031c-1.196-1.547-3.047-2.11-4.97-1.43a6.452 6.452 0 0 0-1.476.797L24.812 8.09c-1.007-2.79-3.539-3.961-6.14-3.024c-2.625.961-3.797 3.47-2.79 6.258l.188.516C7 15.238.695 23.98.695 35.348c0 .843.703 1.57 1.5 1.547m38.836 9.07c-6.14 2.25-11.906 1.101-17.32-5.438l-7.852-9.445c-.843-.984-.843-1.945-.093-2.602c.703-.632 1.664-.421 2.437.375l5.414 5.602c.914.938 1.711 1.031 2.485.75c.914-.328 1.312-1.312.937-2.32l-8.297-22.828c-.351-.938.07-1.828.961-2.157c.914-.328 1.758.118 2.11 1.055l5.93 16.29c.28.773 1.148 1.124 1.921.843c.75-.281 1.148-1.102.867-1.852l-2.133-5.882c.329-.305.774-.61 1.22-.774c1.1-.398 2.015.094 2.437 1.242l1.875 5.133c.28.797 1.148 1.102 1.898.82c.727-.258 1.195-1.03.89-1.851l-1.523-4.149a3.545 3.545 0 0 1 1.219-.797c1.102-.398 2.016.094 2.438 1.243l1.242 3.422c.304.82 1.172 1.125 1.922.843a1.446 1.446 0 0 0 .89-1.851l-.937-2.532c1.968-.703 3.82.891 5.085 4.407l1.477 4.008c3.211 8.859.281 15.609-7.5 18.445"
                      />
                    </svg>
                  ),
                  title: "Imersif & Interaktif",
                  description:
                    "Navigasi bebas dengan hotspot dan rotasi kamera.",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-blue-500">
                      <g
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2">
                        <path d="M1 19h12m0-3H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3" />
                        <rect width="6" height="10" x="17" y="12" rx="2" />
                      </g>
                    </svg>
                  ),
                  title: "Support Semua Device",
                  description:
                    "Akses dari HP, tablet, dan laptop tanpa aplikasi tambahan.",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      className="text-blue-500">
                      <path
                        fill="currentColor"
                        d="M2.002 9.538c-.023.411.207.794.581.966l7.504 3.442l3.442 7.503c.164.356.52.583.909.583l.057-.002a1 1 0 0 0 .894-.686l5.595-17.032c.117-.358.023-.753-.243-1.02s-.66-.358-1.02-.243L2.688 8.645a.997.997 0 0 0-.686.893z"
                      />
                    </svg>
                  ),
                  title: "Navigasi Mudah",
                  description:
                    "Berpindah lokasi hanya dengan klik hotspot dan indikator arah.",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-blue-100 transition duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                      {f.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { number: "360°", label: "View Lengkap" },
              { number: "50+", label: "Titik Virtual" },
              { number: "2K", label: "Resolusi Tinggi" },
              { number: "24/7", label: "Akses Terbuka" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-xl sm:text-3xl font-bold text-blue-600">
                  {s.number}
                </div>
                <div className="text-gray-600 text-sm sm:text-base">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        id="Tour"
        className="relative min-h-screen bg-gradient-to-b from-blue-950 to-gray-900 px-4 sm:px-6 md:px-20 pt-28 pb-40 overflow-hidden rounded-t-[4rem]">
        <div class="absolute top-0 left-0 w-full overflow-hidden leading-none">
          <svg
            class="relative block w-full h-26"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              class="fill-white/10"></path>
          </svg>
        </div>
        <div className="relative z-10">
          <div className="flex flex-col justify-center items-center ">
            <h1 className="text-transparent text-center bg-clip-text bg-gradient-to-r from-teal-500 to-teal-700 font-black leading-tight text-4xl sm:text-5xl md:text-8xl drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
              Selecta{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">
                Tour
              </span>
            </h1>

            <p className="max-w-lg text-slate-400 sm:text-lg md:text-md mt-5 justify-center flex leading-relaxed text-center items-cente">
              Jelajahi Selecta secara mendalam, mulai dari pintu masuk hingga
              seluruh area wisata, melalui pengalaman interaktif 360°.
            </p>
          </div>

          <div className="relative w-full mt-10 md:mt-16">
            <div className="relative w-full h-[260px] sm:h-[330px] md:h-[700px] overflow-hidden">
              <iframe
                src="assets/loket-taman/index.htm"
                width="100%"
                height="100%"
                allowFullScreen
                className="rounded-t-lg  shadow-2xl"
              />
              <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-[#10192C] via-[#10192C] to-transparent" />
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 px-4 md:px-8 bg-gray-900" id="contact">
        <div className="container mx-auto max-w-3xl mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Kontak Kami</h2>
            <p className="text-lg text-gray-300 max-w-xl mx-auto">
              Kirimkan pengalaman Anda atau saran untuk kami PT Selecta. 
            </p>
          </div>

          <form
            action="mailto:riezqyken57@gmail.com"
            method="POST"
            encType="text/plain"
            className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8 space-y-6">
            {/* Nama */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Nama Anda
              </label>
              <input
                type="text"
                name="Nama"
                placeholder="Masukkan nama Anda"
                required
                className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Email Pengirim */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Email Anda
              </label>
              <input
                type="email"
                name="Email"
                placeholder="Masukkan email Anda"
                required
                className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Pesan / Review */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Pengalaman & Ulasan
              </label>
              <textarea
                name="Review"
                rows="5"
                placeholder="Ceritakan pengalaman Anda..."
                required
                className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 transition text-white font-semibold rounded-xl shadow-md">
                Kirim Review
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="relative z-[20] bg-gradient-to-b from-blue-800 to-blue-900 py-16 overflow-hidden rounded-t-2xl -mt-20">
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

export default Landing;
