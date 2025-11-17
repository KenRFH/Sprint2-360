import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useScroll } from "@use-gesture/react";

const Landing = () => {
  const [{ y }, api] = useSpring(() => ({ y: 0 }));
  const [scrollProgress, setScrollProgress] = useState(0);

  useScroll(
    ({ offset: [, yOffset] }) => {
      const progress = Math.min(yOffset / 1000, 1);
      setScrollProgress(progress);
      api.start({ y: yOffset / 3 });
    },
    {
      target: window,
      eventOptions: { passive: true },
    }
  );

  return (
    <>
      <div className="h-[120vh] md:h-[160vh] relative overflow-hidden">
        <animated.div
          style={{ transform: y.to((v) => `translateY(${v}px)`) }}
          className="absolute inset-0 w-full h-full">
          <img
            src="/assets/bg3.png"
            className="w-full h-full object-cover"
            alt="Background"
          />

          <div
            className="absolute inset-0 backdrop-blur-sm transition-all duration-300"
            style={{
              backgroundColor: `rgba(0, 0, 0, ${0.2 + scrollProgress * 0.2})`,
              backdropFilter: `blur(${scrollProgress * 4}px)`,
            }}
          />
        </animated.div>

        <div className="relative z-10 flex justify-center items-center h-screen px-4 sm:px-6 lg:px-8">
          <div className="text-center w-full max-w-6xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[100px] font-bold text-white drop-shadow-xl mb-4 md:mb-6">
              Virtual Tour{" "}
              <span className="relative inline-block mt-2 md:mt-0">
                <span className="absolute -inset-1 sm:-inset-2 md:-inset-3 bg-blue-600 block -skew-y-3 rounded-lg sm:rounded-xl"></span>
                <span className="relative text-white px-3 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                  Selecta
                </span>
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mt-6 md:mt-8 max-w-2xl mx-auto drop-shadow-lg">
              Jelajahi keindahan Selecta dengan pengalaman virtual 360° yang
              memukau
            </p>
            <div className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                Mulai Tur Virtual
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg transition-all duration-300 backdrop-blur-sm border border-white/30">
                Lihat Demo
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="animate-bounce flex flex-col items-center text-white">
            <span className="text-xs sm:text-sm mb-2 text-white/80">
              Scroll untuk menjelajahi
            </span>
            <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/60 rounded-full flex justify-center">
              <div className="w-1 h-2 sm:h-3 bg-white/60 rounded-full mt-2"></div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-32 md:h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>
      <section className="min-h-screen bg-white flex flex-col items-center justify-center py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 md:mb-6">
              Apa itu <span className="text-blue-600">360°</span>?
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6 md:mb-8"></div>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Teknologi virtual tour 360° memungkinkan Anda menjelajahi tempat
              secara digital dengan pengalaman imersif seperti berada di lokasi
              sesungguhnya
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="image-container w-full h-[400px] md:h-[500px] bg-slate-100 rounded-xl overflow-hidden relative">
                <iframe
                  src="assets/loket-taman/index.htm"
                  width="100%"
                  height="600"
                  style={{ border: "none" }}
                  allowFullScreen></iframe>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full -z-10 opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-100 rounded-full -z-10 opacity-40"></div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2 space-y-6 md:space-y-8">
              {[
                {
                  icon: (<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24"><path fill="currentColor" d="m9 20l-1.4-1.4l1.75-1.8q-3.2-.425-5.275-1.75T2 12q0-2.075 2.888-3.538T12 7q4.225 0 7.113 1.463T22 12q0 1.55-1.663 2.775T16 16.6v-2.05q1.925-.5 2.963-1.238T20 12q0-.8-2.138-1.9T12 9q-3.725 0-5.863 1.1T4 12q0 .6 1.275 1.438T8.9 14.7l-1.3-1.3L9 12l4 4l-4 4Z"/></svg>),
                  title: "Pengalaman 360 Derajat",
                  description:
                    "Jelajahi setiap sudut dengan pandangan lengkap 360° seperti berada di lokasi nyata",
                },
                {
                  icon: "👁️",
                  title: "Imersif & Interaktif",
                  description:
                    "Interaksi langsung dengan lingkungan virtual untuk pengalaman yang lebih mendalam",
                },
                {
                  icon: "📱",
                  title: "Akses di Semua Device",
                  description:
                    "Dapat diakses melalui smartphone, tablet, atau komputer tanpa batasan",
                },
                {
                  icon: "🎯",
                  title: "Navigasi Mudah",
                  description:
                    "Pindah dari satu titik ke titik lain dengan mudah menggunakan hotspot interaktif",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-blue-100 transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { number: "360°", label: "View Lengkap" },
              { number: "50+", label: "Titik Virtual" },
              { number: "4K", label: "Resolusi Tinggi" },
              { number: "24/7", label: "Akses Terbuka" },
            ].map((stat, index) => (
              <div key={index} className="text-center p-4">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;
