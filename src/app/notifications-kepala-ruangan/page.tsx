"use client";

import { useState } from "react";
import Image from "next/image";

export default function NotificationsKepalaRuanganPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const [notifications] = useState([
    {
      id: 1,
      title:
        "Laporan dari perawat A/N Siti Nurhaliza mengenai pasien Budi Santoso telah diterima dan memerlukan review Anda.",
      time: "2 jam yang lalu",
      isRead: false,
    },
    {
      id: 2,
      title:
        "Laporan dari perawat A/N Ahmad Fauzi mengenai pasien Maria Sari telah diterima dan memerlukan review Anda.",
      time: "4 jam yang lalu",
      isRead: false,
    },
    {
      id: 3,
      title:
        "Laporan dari perawat A/N Dewi Lestari mengenai pasien Joko Widodo telah diterima dan memerlukan review Anda.",
      time: "6 jam yang lalu",
      isRead: false,
    },
    {
      id: 4,
      title:
        "Laporan dari perawat A/N Rina Sari mengenai pasien Sari Indah telah diterima dan memerlukan review Anda.",
      time: "1 hari yang lalu",
      isRead: false,
    },
    {
      id: 5,
      title:
        "Laporan dari perawat A/N Budi Hartono mengenai pasien Ani Susanti telah diterima dan memerlukan review Anda.",
      time: "2 hari yang lalu",
      isRead: false,
    },
  ]);

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
            {/* Riwayat */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() =>
                (window.location.href = "/dashboard-kepala-ruangan")
              }
            >
              <i className="fas fa-clipboard-list text-lg mb-1"></i>
              <span className="text-xs">Riwayat</span>
            </button>

            {/* Notifikasi - Active */}
            <button className="flex flex-col items-center text-[#0B7A95] transition-colors">
              <i className="fas fa-bell text-lg mb-1"></i>
              <span className="text-xs">Notifikasi</span>
            </button>

            {/* Laporan Masuk */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() =>
                (window.location.href = "/laporan-masuk-kepala-ruangan")
              }
            >
              <i className="fas fa-envelope text-lg mb-1"></i>
              <span className="text-xs">Laporan Masuk</span>
            </button>

            {/* Manage Profil */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() => (window.location.href = "/profile-kepala-ruangan")}
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
              {/* Riwayat */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                onClick={() =>
                  (window.location.href = "/dashboard-kepala-ruangan")
                }
              >
                <i className="fas fa-history text-lg mr-3"></i>
                <span>Riwayat</span>
              </button>

              {/* Notifikasi - Active */}
              <button className="flex items-center text-[#0B7A95] transition-colors p-2 rounded">
                <i className="fas fa-bell text-lg mr-3"></i>
                <span>Notifikasi</span>
              </button>

              {/* Laporan Masuk */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                onClick={() =>
                  (window.location.href = "/laporan-masuk-kepala-ruangan")
                }
              >
                <i className="fas fa-envelope text-lg mr-3"></i>
                <span>Laporan Masuk</span>
              </button>

              {/* Manage Profil */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                onClick={() =>
                  (window.location.href = "/profile-kepala-ruangan")
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
      <main className="flex-1 px-4 sm:px-6 py-4 sm:py-6">
        <div
          className="bg-white rounded-lg p-4 sm:p-8 h-full relative overflow-hidden"
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

          {/* Content Container */}
          <div className="relative z-10">
            {/* Page Title */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B7A95] mb-2">
                Notifikasi
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Daftar notifikasi terbaru untuk Anda
              </p>
            </div>

            {/* Notifications List */}
            <div className="space-y-3 sm:space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    {/* Notification Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#7BB3C7] rounded-full flex items-center justify-center">
                        <i className="fas fa-bell text-white text-xs sm:text-sm"></i>
                      </div>
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 text-xs sm:text-sm leading-relaxed mb-2 break-words">
                        {notification.title}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {notification.time}
                      </p>
                    </div>

                    {/* Unread Indicator */}
                    {!notification.isRead && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#0B7A95] rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State (if no notifications) */}
            {notifications.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-bell-slash text-gray-400 text-xl sm:text-2xl"></i>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">
                  Tidak ada notifikasi
                </h3>
                <p className="text-gray-500 text-sm sm:text-base">
                  Semua notifikasi akan muncul di sini
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
