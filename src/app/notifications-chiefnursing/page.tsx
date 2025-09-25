"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";

export default function NotificationsChiefNursingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const fetchNotifications = async () => {
    const token = Cookies.get("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/notifikasi`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Gagal mengambil notifikasi");

      const resData = await res.json();
      console.log("Data notifikasi:", resData);

      // gabungkan notifikasi baru & lama biar jadi 1 list
      const allNotifications = [
        ...(resData.notifikasi_baru || []),
        ...(resData.notifikasi_lama || []),
      ];

      const mappedNotifications = allNotifications.map((n: any) => ({
        id: n.id_notifikasi,
        title: n.message,
        time: n.waktu, // pakai waktu yang sudah diformat dari backend
        isRead: n.status === "sudah_dibaca",
      }));

      setNotifications(mappedNotifications);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <>
      {isLoading ? (
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
                Memuat Data Notifikasi...
              </h3>
              <p className="text-[#0B7A95]/70 text-sm">
                Mohon tunggu sebentar
              </p>
            </div>
            
            {/* Loading Dots Animation */}
            <div className="flex justify-center space-x-1 mt-4">
              <div className="w-2 h-2 bg-[#0B7A95] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-[#0B7A95] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-[#0B7A95] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        </div>
      ) : (
        <>
    <div className="bg-[#d9f0f6] min-h-screen flex flex-col animate-fade-in">
      {/* Header/Navbar */}
      <header className="bg-[#B9D9DD] rounded-xl px-6 py-3 mx-6 mt-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">
            Safe
            <span className="font-bold text-[#0B7A95]">Nurse</span>
          </h1>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Riwayat */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() =>
                (window.location.href = "/dashboard-chiefnursing")
              }
            >
              <i className="fas fa-clipboard-list text-lg mb-1"></i>
              <span className="text-xs">Riwayat</span>
            </button>

            {/* Notifikasi - Active */}
            <button className="flex flex-col items-center text-[#0B7A95] transition-colors relative">
              <div className="relative">
                <i className="fas fa-bell text-lg mb-1"></i>
                {/* Notification Count Badge */}
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  3
                </span>
              </div>
              <span className="text-xs">Notifikasi</span>
            </button>

            {/* Laporan Masuk */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() =>
                (window.location.href = "/laporan-masuk-chiefnursing")
              }
            >
              <i className="fas fa-envelope text-lg mb-1"></i>
              <span className="text-xs">Laporan Masuk</span>
            </button>

            {/* Manage Profil */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() => (window.location.href = "/profile-chiefnursing")}
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
          <div className="md:hidden mt-4 pt-4 border-t border-white/20 animate-slide-down">
            <div className="flex flex-col space-y-3">
              {/* Riwayat */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                onClick={() =>
                  (window.location.href = "/dashboard-chiefnursing")
                }
              >
                <i className="fas fa-history text-lg mr-3"></i>
                <span>Riwayat</span>
              </button>

              {/* Notifikasi - Active */}
              <button className="flex items-center text-[#0B7A95] transition-colors p-2 rounded relative">
                <div className="relative">
                  <i className="fas fa-bell text-lg mr-3"></i>
                  {/* Notification Count Badge */}
                  <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    3
                  </span>
                </div>
                <span>Notifikasi</span>
              </button>

              {/* Laporan Masuk */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                onClick={() =>
                  (window.location.href = "/laporan-masuk-chiefnursing")
                }
              >
                <i className="fas fa-envelope text-lg mr-3"></i>
                <span>Laporan Masuk</span>
              </button>

              {/* Manage Profil */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                onClick={() =>
                  (window.location.href = "/profile-chiefnursing")
                }
              >
                <i className="fas fa-user text-lg mr-3"></i>
                <span>Profil</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 sm:px-6 py-4 sm:py-6 animate-slide-up">
        <div
          className="bg-white rounded-lg p-4 sm:p-8 h-full relative overflow-hidden animate-scale-in"
          style={{
            background: "linear-gradient(180deg, #b9dce3 0%, #0a7a9a 100%)",
          }}
        >
          <Image
            alt="Background medical pattern"
            className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none animate-float"
            src="/bgperawat.png"
            fill
            style={{ zIndex: 0 }}
          />

          <div className="relative z-10">
            <div className="mb-6 sm:mb-8 animate-fade-in-up">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B7A95] mb-2 animate-text-glow">
                Notifikasi
              </h2>
              <p className="text-gray-600 text-sm sm:text-base animate-fade-in-right">
                Daftar notifikasi terbaru untuk Anda
              </p>
            </div>

            {isLoading ? (
              <p className="text-gray-600 text-center animate-pulse-gentle">Memuat Data Notifikasi...</p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {notifications.length === 0 ? (
                  <div className="text-center py-12 sm:py-16 animate-fade-in-up">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-subtle">
                      <i className="fas fa-bell-slash text-gray-400 text-xl sm:text-2xl animate-swing"></i>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2 animate-fade-in-delayed">
                      Tidak ada notifikasi
                    </h3>
                    <p className="text-gray-500 text-sm sm:text-base animate-fade-in-delayed-2">
                      Semua notifikasi akan muncul di sini
                    </p>
                  </div>
                ) : (
                  notifications.map((notification, index) => (
                    <div
                      key={notification.id}
                      className={`bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in-up`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#7BB3C7] rounded-full flex items-center justify-center animate-glow">
                            <i className="fas fa-bell text-white text-xs sm:text-sm animate-ring-small"></i>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 text-xs sm:text-sm leading-relaxed mb-2 break-words">
                            {notification.title}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {notification.time}
                          </p>
                        </div>

                        {!notification.isRead && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#0B7A95] rounded-full animate-pulse-gentle"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-down {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes fade-in-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fade-in-right {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes bounce-subtle {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
          60% { transform: translateY(-3px); }
        }

        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(123, 179, 199, 0.3); }
          50% { box-shadow: 0 0 15px rgba(123, 179, 199, 0.6); }
        }

        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 5px rgba(11, 122, 149, 0.3); }
          50% { text-shadow: 0 0 15px rgba(11, 122, 149, 0.6); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes swing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }

        @keyframes ring-small {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-scale-in { animation: scale-in 0.5s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-fade-in-right { animation: fade-in-right 0.6s ease-out 0.2s both; }
        .animate-bounce-subtle { animation: bounce-subtle 2s infinite; }
        .animate-pulse-gentle { animation: pulse-gentle 2s infinite; }
        .animate-glow { animation: glow 2s infinite; }
        .animate-text-glow { animation: text-glow 3s infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-swing { animation: swing 2s ease-in-out infinite; }
        .animate-ring-small { animation: ring-small 1.5s infinite; }
        .animate-fade-in-delayed { animation: fade-in-up 0.6s ease-out 0.3s both; }
        .animate-fade-in-delayed-2 { animation: fade-in-up 0.6s ease-out 0.5s both; }
      `}</style>
    </div>
        </>
      )}
    </>
  );
}
