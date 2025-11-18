import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`navbar fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md rounded-b-[1.2rem]" : "bg-transparent"
      }`}>
      <div className="container mx-auto">
        <div className="navbar-box flex justify-between items-center p-4">
          {/* Logo */}
          <div className="logo">
            <img
              src="/assets/selecta-logo1.png"
              alt="Selecta Logo"
              className="h-16"
            />
          </div>

          {/* Hamburger Button (Mobile) */}
          <button className="md:hidden text-3xl" onClick={() => setOpen(!open)}>
            {open ? (
              <span>&#10005;</span> // X
            ) : (
              <span>&#9776;</span> // ☰
            )}
          </button>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-10 items-center font-medium">
            <li>
              <a href="/" className="hover:text-blue-600 transition-colors">
                Beranda
              </a>
            </li>
            <li>
              <a href="" className="hover:text-blue-600 transition-colors">
                Wahana
              </a>
            </li>
            <li>
              <a
                href="https://yellow-partridge-166068.hostingersite.com/keranjang"
                className="rounded-lg p-3 font-semibold text-white bg-gradient-to-br from-blue-500 to-blue-600 flex items-center gap-2 hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl">
                Pesan Tiket{" "}
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="currenColor"
                    className="text-white">
                    <g
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2">
                      <path d="M6.331 8H17.67a2 2 0 0 1 1.977 2.304l-1.255 8.152A3 3 0 0 1 15.426 21H8.574a3 3 0 0 1-2.965-2.544l-1.255-8.152A2 2 0 0 1 6.331 8z" />
                      <path d="M9 11V6a3 3 0 0 1 6 0v5" />
                    </g>
                  </svg>
                </span>
              </a>
            </li>
          </ul>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}>
          <ul className="flex flex-col gap-5 bg-white/95 backdrop-blur-sm p-4 shadow-inner">
            <li>
              <a
                href=""
                className="block py-2 hover:text-blue-600 transition-colors">
                Beranda
              </a>
            </li>
            <li>
              <a
                href=""
                className="block py-2 hover:text-blue-600 transition-colors">
                Wahana
              </a>
            </li>
            <li>
              <a
                href="https://yellow-partridge-166068.hostingersite.com/keranjang"
                className="rounded-lg p-3 font-semibold text-white bg-gradient-to-br from-blue-500 to-blue-600 flex items-center gap-2 hover:from-blue-600 hover:to-blue-700 transition-all">
                Pesan Tiket
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
