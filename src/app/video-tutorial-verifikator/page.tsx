"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface JwtPayload {
  role: string;
  exp?: number;
  iat?: number;
}

export default function VideoTutorialVerifikatorPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const router = useRouter();
  const token = Cookies.get("token");

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const checkTokenValidity = () => {
    const token = Cookies.get("token");
    if (!token) {
      logoutUser();
      return;
    }

    try {
      const decoded: JwtPayload = jwtDecode(token);
      if (!decoded.exp) return;

      const now = Date.now() / 1000; // dalam detik
      const timeLeft = decoded.exp - now;

      if (timeLeft <= 0) {
        logoutUser();
      }
    } catch (err) {
      console.error("Token invalid:", err);
      logoutUser();
    }
  };

  // === 🚪 Fungsi Logout ===
  const logoutUser = () => {
    Cookies.remove("token");
    Cookies.set("session_expired", "1", { path: "/" });
    router.push("/login");
  };

  useEffect(() => {
    checkTokenValidity(); // cek pertama kali
    const interval = setInterval(() => {
      checkTokenValidity();
    }, 3000); // tiap 5 detik

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/notifikasi/new`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Gagal mengambil notifikasi baru");

      const resData = await res.json();
      const countBaru = resData?.data?.length || 0;
      setNewNotificationCount(countBaru);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

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

  // Simulate loading data from backend
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  const handleVideoClick = (url: string) => {
    window.open(url, "_blank");
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#d9f0f6] z-50 flex items-center justify-center">
        <div className="text-center">
          {/* Loading Spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#B9D9DD] border-t-[#0B7A95] rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-[#0B7A95] rounded-full animate-ping mx-auto"></div>
          </div>

          {/* Loading Text */}
          <div className="space-y-2">
            <h3 className="text-[#0B7A95] text-lg font-semibold animate-pulse">
              Memuat Video Tutorial...
            </h3>
            <p className="text-[#0B7A95]/70 text-sm">Mohon tunggu sebentar</p>
          </div>

          {/* Loading Dots Animation */}
          <div className="flex justify-center space-x-1 mt-4">
            <div
              className="w-2 h-2 bg-[#0B7A95] rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-[#0B7A95] rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-[#0B7A95] rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#d9f0f6] min-h-screen flex flex-col animate-fade-in">
      {/* Header/Navbar */}
      <header className="bg-[#B9D9DD] rounded-xl px-6 py-3 mx-6 mt-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* Logo SafeNurse */}
            <Image
              src="/logosafenurse.png"
              alt="Logo SafeNurse"
              width={50}
              height={50}
              className="object-contain"
            />

            {/* Logo Unhas */}
            <Image
              src="/logounhas.png"
              alt="Logo Unhas"
              width={40}
              height={40}
              className="object-contain"
            />

            <h1 className="text-white text-xl font-bold">
              Safe
              <span className="font-bold text-[#0B7A95]">Nurse</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Dashboard */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() => (window.location.href = "/dashboard-verifikator")}
            >
              <i className="fas fa-chart-bar text-lg mb-1"></i>
              <span className="text-xs">Dashboard</span>
            </button>

            {/* Riwayat Laporan */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() => (window.location.href = "/riwayat-laporan-verifikator")}
            >
              <i className="fas fa-clipboard-list text-lg mb-1"></i>
              <span className="text-xs">Riwayat</span>
            </button>

            {/* Notifikasi */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors relative"
              onClick={() => (window.location.href = "/notifications-verifikator")}
            >
              <div className="relative">
                <i className="fas fa-bell text-lg mb-1"></i>
                {/* Notification Count Badge */}
                {newNotificationCount > 0 && (
                  <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {newNotificationCount}
                  </span>
                )}
              </div>
              <span className="text-xs">Notifikasi</span>
            </button>

            {/* Laporan Masuk */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() => (window.location.href = "/laporan-masuk-verifikator")}
            >
              <i className="fas fa-envelope text-lg mb-1"></i>
              <span className="text-xs">Laporan Masuk</span>
            </button>

            {/* Video Tutorial - Active */}
            <button className="flex flex-col items-center text-[#0B7A95] transition-colors">
              <i className="fas fa-play-circle text-lg mb-1"></i>
              <span className="text-xs">Tutorial</span>
            </button>

            {/* Manage Profil */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() => (window.location.href = "/profile-verifikator")}
            >
              <i className="fas fa-user-cog text-lg mb-1"></i>
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
              {/* Dashboard */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                onClick={() => (window.location.href = "/dashboard-verifikator")}
              >
                <i className="fas fa-chart-bar text-lg mr-3"></i>
                <span>Dashboard</span>
              </button>

              {/* Riwayat Laporan */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                onClick={() => (window.location.href = "/riwayat-laporan-verifikator")}
              >
                <i className="fas fa-clipboard-list text-lg mr-3"></i>
                <span>Riwayat</span>
              </button>

              {/* Notifikasi */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded relative"
                onClick={() =>
                  (window.location.href = "/notifications-verifikator")
                }
              >
                <div className="relative">
                  <i className="fas fa-bell text-lg mr-3"></i>
                  {/* Notification Count Badge */}
                  {newNotificationCount > 0 && (
                    <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {newNotificationCount}
                    </span>
                  )}
                </div>
                <span>Notifikasi</span>
              </button>

              {/* Laporan Masuk */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                onClick={() => (window.location.href = "/laporan-masuk-verifikator")}
              >
                <i className="fas fa-envelope text-lg mr-3"></i>
                <span>Laporan Masuk</span>
              </button>

              {/* Video Tutorial - Active */}
              <button className="flex items-center text-[#0B7A95] transition-colors p-2 rounded">
                <i className="fas fa-play-circle text-lg mr-3"></i>
                <span>Tutorial</span>
              </button>

              {/* Manage Profil */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                onClick={() => (window.location.href = "/profile-verifikator")}
              >
                <i className="fas fa-user-cog text-lg mr-3"></i>
                <span>Profil</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-6 py-4 md:py-6 animate-slide-up">
        <div
          className="bg-white rounded-lg p-4 md:p-8 h-full relative overflow-hidden animate-scale-in"
          style={{
            background: "linear-gradient(180deg, #b9dce3 0%, #0a7a9a 100%)",
          }}
        >
          {/* Background pattern */}
          <Image
            alt="Background medical pattern"
            className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none animate-float"
            src="/bgperawat.png"
            fill
            style={{ zIndex: 0 }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Title Section */}
            <div className="mb-6 md:mb-8 animate-fade-in-up">
              <h1 className="text-white text-2xl md:text-4xl font-bold mb-1 md:mb-2 animate-text-glow">
                Video Edukasi
              </h1>
              <h2 className="text-white text-2xl md:text-4xl font-bold mb-2 md:mb-4 animate-text-glow animate-fade-in-delayed">
                Tutorial Penggunaan
              </h2>
              <h4 className="text-white text-3xl md:text-6xl font-bold animate-text-glow animate-fade-in-delayed-2">
                SAFE<span className="text-[#09839C]">Nurse</span>
              </h4>
            </div>

            {/* Video Grid - Responsive Layout */}
            <div className="overflow-x-auto pb-4">
              {/* Desktop: Horizontal Scrollable, Mobile: Grid Layout */}
              <div
                className="hidden md:flex md:space-x-6 animate-slide-in-right"
                style={{ width: "max-content" }}
              >
                {videos.map((video, index) => (
                  <div
                    key={video.id}
                    className="flex-shrink-0 w-80 bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 animate-video-card"
                    style={{
                      animationDelay: `${index * 0.15}s`,
                    }}
                    onClick={() => handleVideoClick(video.url)}
                  >
                    {/* Video Thumbnail */}
                    <div className="relative h-48 bg-gray-200 overflow-hidden">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        width={320}
                        height={180}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNDQgNzJMMTc2IDkwTDE0NCAxMDhWNzJaIiBmaWxsPSIjOUI5QjlCIi8+Cjwvc3ZnPgo=";
                        }}
                      />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-300">
                        <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center transform transition-all duration-300 hover:scale-110 animate-pulse-gentle">
                          <i className="fas fa-play text-2xl text-gray-700 ml-1 animate-bounce-subtle"></i>
                        </div>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="p-4 animate-fade-in-up">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 animate-fade-in-right">
                        {video.title}
                      </h3>
                      <p className="text-sm text-[#0B7A95] font-medium animate-fade-in-delayed">
                        SAFE<span className="text-[#09839C]">Nurse</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile: Grid Layout */}
              <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up">
                {videos.map((video, index) => (
                  <div
                    key={video.id}
                    className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-video-card-mobile"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                    onClick={() => handleVideoClick(video.url)}
                  >
                    {/* Video Thumbnail */}
                    <div className="relative h-40 bg-gray-200 overflow-hidden">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        width={320}
                        height={180}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNDQgNzJMMTc2IDkwTDE0NCAxMDhWNzJaIiBmaWxsPSIjOUI5QjlCIi8+Cjwvc3ZnPgo=";
                        }}
                      />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-300">
                        <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center transform transition-all duration-300 hover:scale-110 animate-pulse-gentle">
                          <i className="fas fa-play text-lg text-gray-700 ml-1 animate-bounce-subtle"></i>
                        </div>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="p-3 animate-fade-in-up">
                      <h3 className="text-base font-semibold text-gray-800 mb-1 animate-fade-in-right">
                        {video.title}
                      </h3>
                      <p className="text-xs text-[#0B7A95] font-medium animate-fade-in-delayed">
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

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-down {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slide-in-right {
          from {
            transform: translateX(30px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            transform: translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fade-in-right {
          from {
            transform: translateX(10px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes video-card {
          from {
            transform: translateY(30px) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes video-card-mobile {
          from {
            transform: translateY(20px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes pulse-gentle {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 5px rgba(11, 122, 149, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(11, 122, 149, 0.6);
          }
        }

        @keyframes text-glow {
          0%,
          100% {
            text-shadow: 0 0 5px rgba(11, 122, 149, 0.3);
          }
          50% {
            text-shadow: 0 0 15px rgba(11, 122, 149, 0.6);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.6s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.8s ease-out;
        }
        .animate-video-card {
          animation: video-card 0.8s ease-out;
        }
        .animate-video-card-mobile {
          animation: video-card-mobile 0.6s ease-out;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite;
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 2s infinite;
        }
        .animate-glow {
          animation: glow 2s infinite;
        }
        .animate-text-glow {
          animation: text-glow 3s infinite;
        }
        .animate-float {
          animation: float 6s infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-fade-in-delayed {
          animation: fade-in 1s ease-out 0.3s both;
        }
        .animate-fade-in-delayed-2 {
          animation: fade-in 1s ease-out 0.6s both;
        }
      `}</style>

      {/* Sticky Footer */}
      <footer className="mt-auto bg-[#0B7A95] text-white py-4 px-6">
        <div className="text-center space-y-1">
          <p className="text-sm font-medium">
            Copyright 2025 © SAFE-Nurse Universitas Hasanuddin.
          </p>
          <p className="text-xs text-white/80">Penelitian Tesis Magister Kemdiktisaintek</p>
        </div>
      </footer>
    </div>
  );
}

