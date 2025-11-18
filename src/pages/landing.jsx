import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useScroll } from "@use-gesture/react";

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
      <div className="h-[110vh] sm:h-[130vh] md:h-[150vh] relative overflow-hidden">
        <animated.div
          style={{ transform: y.to((v) => `translateY(${v}px)`) }}
          className="absolute inset-0 w-full h-full"
        >
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
              Jelajahi keindahan Selecta dengan pengalaman virtual 360° yang imersif
            </p>

            <div className="mt-6 md:mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#tour"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Mulai Tur Virtual
              </a>
              <div>
                <a href="" className="bg-white/40 backdrop-blur-sm p-2 rounded-lg md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">Lihat Wahana</a>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 md:h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      {/* SECTION: WHAT IS 360 */}
      <section className="min-h-screen bg-white flex flex-col items-center justify-center py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Apa itu <span className="text-blue-600">360°</span>?
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Teknologi virtual tour 360° memungkinkan Anda menjelajahi tempat dengan pengalaman digital yang imersif
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* VR Preview */}
            <div className="relative order-2 lg:order-1">
              <div className="relative w-full h-[260px] sm:h-[320px] md:h-[420px] lg:h-[520px] overflow-hidden">
                <iframe
                  src="assets/loket-taman/index.htm"
                  width="100%"
                  height="100%"
                  className="block"
                  allowFullScreen
                  loading="lazy"
                ></iframe>

                {/* Smooth Gradients */}
                <div className="absolute bottom-0 w-full h-20 sm:h-24 bg-gradient-to-t from-white to-transparent" />
                <div className="absolute top-0 w-full h-20 sm:h-24 bg-gradient-to-b from-white to-transparent" />
              </div>
            </div>

            {/* Features */}
            <div className="order-1 lg:order-2 space-y-5 md:space-y-7">
              {[
                {
                  icon: "🌐",
                  title: "Pandangan 360°",
                  description:
                    "Lihat semua arah secara bebas seperti benar-benar berada di lokasi.",
                },
                {
                  icon: "👁️",
                  title: "Imersif & Interaktif",
                  description:
                    "Navigasi bebas dengan hotspot dan rotasi kamera.",
                },
                {
                  icon: "📱",
                  title: "Support Semua Device",
                  description:
                    "Akses dari HP, tablet, dan laptop tanpa aplikasi tambahan.",
                },
                {
                  icon: "🧭",
                  title: "Navigasi Mudah",
                  description:
                    "Berpindah lokasi hanya dengan klik hotspot dan indikator arah.",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-blue-100 transition duration-300"
                >
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

      {/* VR SECTION */}
      <section
        id="tour"
        className="min-h-screen bg-gradient-to-b from-blue-950 to-slate-950 pt-20 pb-28 px-4 sm:px-6 md:px-20 rounded-t-3xl"
      >
        <h1 className="text-white text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
          Selecta{" "}
          <span className="text-blue-400 text-4xl sm:text-5xl md:text-7xl">
            Tour
          </span>
        </h1>

        <p className="max-w-md text-slate-50/80 text-sm sm:text-base md:text-lg mt-4">
          Jelajahi Selecta dari awal hingga masuk dan menyeluruh.
        </p>

        <div className="relative w-full mt-10 md:mt-16">
          <div className="w-full h-[260px] sm:h-[330px] md:h-[520px] lg:h-[650px] overflow-hidden bg-black/20 backdrop-blur">
            <iframe
              src="assets/loket-taman/index.htm"
              width="100%"
              height="100%"
              allowFullScreen
            ></iframe>

            <div className="absolute top-0 w-full h-20 bg-gradient-to-b from-blue-950 to-transparent" />
            <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-slate-950 to-transparent" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;
