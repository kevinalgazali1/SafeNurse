"use client";

import { useState } from "react";
import Image from "next/image";

export default function VideoTutorialPerawatPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const [videos] = useState([
    {
      id: 1,
      title: "Pengenalan SAFENurse",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    {
      id: 2,
      title: "Pengenalan SAFENurse",
      thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    },
    {
      id: 3,
      title: "Pengenalan SAFENurse",
      thumbnail: "https://img.youtube.com/vi/L_jWHffIx5E/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=L_jWHffIx5E",
    },
    {
      id: 4,
      title: "Pengenalan SAFENurse",
      thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    },
    {
      id: 5,
      title: "Pengenalan SAFENurse",
      thumbnail: "https://img.youtube.com/vi/ZZ5LpwO-An4/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=ZZ5LpwO-An4",
    },
    {
      id: 6,
      title: "Pengenalan SAFENurse",
      thumbnail: "https://img.youtube.com/vi/astISOttCQ0/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=astISOttCQ0",
    },
    {
      id: 7,
      title: "Pengenalan SAFENurse",
      thumbnail: "https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
    },
    {
      id: 8,
      title: "Pengenalan SAFENurse",
      thumbnail: "https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    },
    {
      id: 9,
      title: "Pengenalan SAFENurse",
      thumbnail: "https://img.youtube.com/vi/Ct6BUPvE2sM/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=Ct6BUPvE2sM",
    },
    {
      id: 10,
      title: "Pengenalan SAFENurse",
      thumbnail: "https://img.youtube.com/vi/oHg5SJYRHA0/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=oHg5SJYRHA0",
    },
  ]);

  const handleVideoClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="bg-[#d9f0f6] min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <header className="bg-[#B9D9DD] rounded-xl px-6 py-3 mx-6 mt-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">
            Safe
            <span className="font-bold text-[#0B7A95]">Nurse</span>
          </h1>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Riwayat Laporan */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() => (window.location.href = "/dashboard-perawat")}
            >
              <i className="fas fa-clipboard-list text-lg mb-1"></i>
              <span className="text-xs">Riwayat</span>
            </button>

            {/* Notifikasi */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() => (window.location.href = "/notifications-perawat")}
            >
              <i className="fas fa-bell text-lg mb-1"></i>
              <span className="text-xs">Notifikasi</span>
            </button>

            {/* Video Tutorial - Active */}
            <button className="flex flex-col items-center text-[#0B7A95] transition-colors">
              <i className="fas fa-play-circle text-lg mb-1"></i>
              <span className="text-xs">Tutorial</span>
            </button>

            {/* Manage Profil */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() => (window.location.href = "/profile-perawat")}
            >
              <i className="fas fa-user text-lg mb-1"></i>
              <span className="text-xs">Profil</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white hover:text-[#0B7A95] transition-colors"
            onClick={toggleMobileMenu}
          >
            <i
              className={`fas ${
                isMobileMenuOpen ? "fa-times" : "fa-bars"
              } text-xl`}
            ></i>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/20">
            <div className="flex flex-col space-y-3">
              {/* Riwayat Laporan */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                onClick={() => (window.location.href = "/dashboard-perawat")}
              >
                <i className="fas fa-clipboard-list text-lg mr-3"></i>
                <span>Riwayat</span>
              </button>

              {/* Notifikasi */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                onClick={() =>
                  (window.location.href = "/notifications-perawat")
                }
              >
                <i className="fas fa-bell text-lg mr-3"></i>
                <span>Notifikasi</span>
              </button>

              {/* Video Tutorial - Active */}
              <button className="flex items-center text-[#0B7A95] transition-colors p-2 rounded">
                <i className="fas fa-play-circle text-lg mr-3"></i>
                <span>Tutorial</span>
              </button>

              {/* Manage Profil */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                onClick={() => (window.location.href = "/profile-perawat")}
              >
                <i className="fas fa-user text-lg mr-3"></i>
                <span>Profil</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-6 py-4 md:py-6">
        <div
          className="bg-white rounded-lg p-4 md:p-8 h-full relative overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #b9dce3 0%, #0a7a9a 100%)",
          }}
        >
          {/* Background pattern */}
          <Image
            alt="Background medical pattern"
            className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none"
            src="/bgperawat.png"
            fill
            style={{ zIndex: 0 }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Title Section */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-white text-2xl md:text-4xl font-bold mb-1 md:mb-2">
                Video Edukasi
              </h1>
              <h2 className="text-white text-2xl md:text-4xl font-bold mb-2 md:mb-4">
                Tutorial Penggunaan
              </h2>
              <h4 className="text-white text-3xl md:text-6xl font-bold">
                SAFE<span className="text-[#09839C]">Nurse</span>
              </h4>
            </div>

            {/* Video Grid - Responsive Layout */}
            <div className="overflow-x-auto pb-4">
              {/* Desktop: Horizontal Scrollable, Mobile: Grid Layout */}
              <div
                className="hidden md:flex md:space-x-6"
                style={{ width: "max-content" }}
              >
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="flex-shrink-0 w-80 bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => handleVideoClick(video.url)}
                  >
                    {/* Video Thumbnail */}
                    <div className="relative h-48 bg-gray-200">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        width={320}
                        height={180}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNDQgNzJMMTc2IDkwTDE0NCAxMDhWNzJaIiBmaWxsPSIjOUI5QjlCIi8+Cjwvc3ZnPgo=";
                        }}
                      />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all">
                        <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                          <i className="fas fa-play text-2xl text-gray-700 ml-1"></i>
                        </div>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {video.title}
                      </h3>
                      <p className="text-sm text-[#0B7A95] font-medium">
                        SAFE<span className="text-[#09839C]">Nurse</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile: Grid Layout */}
              <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => handleVideoClick(video.url)}
                  >
                    {/* Video Thumbnail */}
                    <div className="relative h-40 bg-gray-200">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        width={320}
                        height={180}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNDQgNzJMMTc2IDkwTDE0NCAxMDhWNzJaIiBmaWxsPSIjOUI5QjlCIi8+Cjwvc3ZnPgo=";
                        }}
                      />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all">
                        <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                          <i className="fas fa-play text-lg text-gray-700 ml-1"></i>
                        </div>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="p-3">
                      <h3 className="text-base font-semibold text-gray-800 mb-1">
                        {video.title}
                      </h3>
                      <p className="text-xs text-[#0B7A95] font-medium">
                        SAFE<span className="text-[#09839C]">Nurse</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
