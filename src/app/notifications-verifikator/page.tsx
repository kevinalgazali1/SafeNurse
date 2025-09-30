"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { toast, Toaster } from "react-hot-toast";

export default function NotificationsVerifikatorPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    string | null
  >(null);
  const notificationsPerPage = 10;
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const token = Cookies.get("token");

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const fetchReportCount = async () => {
    if (!token) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/laporan/laporanMasuk`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Gagal mengambil data laporan masuk");

      const resData = await res.json();
      setReportCount(resData.data?.length || 0);
    } catch (err) {
      console.error(err);
      setReportCount(0);
    }
  };

  useEffect(() => {
    fetchReportCount();
  }, []);

  const fetchNotifications = async () => {
    if (!token) return;

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

      // gabungkan notifikasi baru & lama
      const allNotifications = [
        ...(resData.notifikasi_baru || []),
        ...(resData.notifikasi_lama || []),
      ];

      const mappedNotifications = allNotifications.map((n: any) => ({
        id: n.id_notifikasi,
        title: n.message,
        time: n.waktu,
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

  const fetchNewNotifications = async () => {
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
      console.log("Data notifikasi baru:", resData);

      // Hitung jumlah data notifikasi yang dikembalikan
      const countBaru = resData?.data?.length || 0;
      setNewNotificationCount(countBaru);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewNotifications();
  }, []);

  // Delete notification functions
  const handleDeleteNotification = async (id_notifikasi: string) => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/notifikasi/delete/${id_notifikasi}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id_notifikasi));
        setShowDeleteModal(false);
        setSelectedNotificationId(null);
        toast.success("Notifikasi berhasil dihapus!");
      } else {
        const errMsg = await res.text();
        console.error("Gagal menghapus notifikasi:", errMsg);

        // ⚠️ Toast error
        toast.error("Gagal menghapus notifikasi!");
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
      toast.error("Terjadi kesalahan saat menghapus notifikasi!");
    }
  };

  const handleDeleteAllNotifications = async () => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/notifikasi/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        setNotifications([]); // langsung kosongkan
        setShowDeleteAllModal(false);
        setCurrentPage(1);
        toast.success("Semua notifikasi berhasil dihapus!");
      } else {
        toast.error("Gagal menghapus semua notifikasi!");
      }
    } catch (err) {
      console.error("Error deleting all notifications:", err);
      toast.error("Terjadi kesalahan saat menghapus semua notifikasi!");
    }
  };

  const openDeleteModal = (notificationId: string) => {
    setSelectedNotificationId(notificationId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedNotificationId(null);
  };

  // Pagination logic
  const totalPages = Math.ceil(notifications.length / notificationsPerPage);
  const startIndex = (currentPage - 1) * notificationsPerPage;
  const endIndex = startIndex + notificationsPerPage;
  const currentNotifications = notifications.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
              Memuat Data Notifikasi...
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
              width={40}
              height={40}
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
              onClick={() =>
                (window.location.href = "/riwayat-laporan-verifikator")
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
              onClick={() =>
                (window.location.href = "/laporan-masuk-verifikator")
              }
            >
              <div className="relative">
                <i className="fas fa-envelope text-lg mb-1"></i>
                {reportCount > 0 && (
                  <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {reportCount}
                  </span>
                )}
              </div>
              <span className="text-xs">Laporan Masuk</span>
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
          <div className="md:hidden mt-4 pt-4 border-t border-white/20 animate-slide-down">
            <div className="flex flex-col space-y-3">
              {/* Dashboard */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                onClick={() =>
                  (window.location.href = "/dashboard-verifikator")
                }
              >
                <i className="fas fa-chart-bar text-lg mr-3"></i>
                <span>Dashboard</span>
              </button>

              {/* Riwayat Laporan */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                onClick={() =>
                  (window.location.href = "/riwayat-laporan-verifikator")
                }
              >
                <i className="fas fa-clipboard-list text-lg mr-3"></i>
                <span>Riwayat</span>
              </button>

              {/* Notifikasi - Active */}
              <button className="flex items-center text-[#0B7A95] transition-colors p-2 rounded relative">
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
                onClick={() =>
                  (window.location.href = "/laporan-masuk-verifikator")
                }
              >
                <div className="relative">
                  <i className="fas fa-envelope text-lg mr-3"></i>
                  {reportCount > 0 && (
                    <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {reportCount}
                    </span>
                  )}
                </div>
                <span>Laporan Masuk</span>
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
            <div className="mb-6 sm:mb-8 animate-fade-in-up flex justify-between items-center">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0B7A95] mb-2 animate-text-glow">
                  Notifikasi
                </h2>
              </div>

              {/* Delete All Button */}
              {notifications.length > 0 && (
                <button
                  onClick={() => setShowDeleteAllModal(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                >
                  <i className="fas fa-trash text-sm"></i>
                  <span className="sm:hidden">Delete All</span>
                  <span className="hidden sm:inline">Delete All</span>
                </button>
              )}
            </div>

            {isLoading ? (
              <p className="text-gray-600 text-center animate-pulse-gentle">
                Memuat notifikasi...
              </p>
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
                  currentNotifications.map((notification, index) => (
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

                        <div className="flex items-center space-x-2">
                          {!notification.isRead && (
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#0B7A95] rounded-full animate-pulse-gentle"></div>
                          )}

                          {/* Delete Button */}
                          <button
                            onClick={() => openDeleteModal(notification.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 group"
                            title="Hapus notifikasi"
                          >
                            <i className="fas fa-trash text-sm group-hover:scale-110 transition-transform"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Pagination */}
            {notifications.length > 0 && totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center space-y-4">
                {/* Pagination Info */}
                <div className="text-xs sm:text-sm text-black">
                  Menampilkan {startIndex + 1}-
                  {Math.min(endIndex, notifications.length)} dari{" "}
                  {notifications.length} notifikasi
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-[#0B7A95] text-white hover:bg-[#0a6b85] hover:scale-105"
                    }`}
                  >
                    <span className="hidden sm:inline">← Sebelumnya</span>
                    <span className="sm:hidden">‹</span>
                  </button>

                  {/* Page Numbers - Show max 3 pages */}
                  <div className="flex space-x-1">
                    {(() => {
                      const maxVisiblePages = 3;
                      let startPage = Math.max(
                        1,
                        currentPage - Math.floor(maxVisiblePages / 2)
                      );
                      const endPage = Math.min(
                        totalPages,
                        startPage + maxVisiblePages - 1
                      );

                      // Adjust start page if we're near the end
                      if (endPage - startPage + 1 < maxVisiblePages) {
                        startPage = Math.max(1, endPage - maxVisiblePages + 1);
                      }

                      const pages = [];

                      // Left navigation arrow for previous set of pages
                      if (startPage > 1) {
                        pages.push(
                          <button
                            key="prev-set"
                            onClick={() =>
                              handlePageChange(
                                Math.max(1, startPage - maxVisiblePages)
                              )
                            }
                            className="px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 bg-white text-black border border-[#0B7A95] hover:bg-[#0B7A95] hover:text-white hover:scale-105"
                            title="Halaman sebelumnya"
                          >
                            ‹
                          </button>
                        );
                      }

                      // Page numbers
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                              currentPage === i
                                ? "bg-[#0B7A95] text-white scale-110"
                                : "bg-white text-black border border-[#0B7A95] hover:bg-[#0B7A95] hover:text-white hover:scale-105"
                            }`}
                          >
                            {i}
                          </button>
                        );
                      }

                      // Right navigation arrow for next set of pages
                      if (endPage < totalPages) {
                        pages.push(
                          <button
                            key="next-set"
                            onClick={() =>
                              handlePageChange(
                                Math.min(totalPages, endPage + 1)
                              )
                            }
                            className="px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 bg-white text-black border border-[#0B7A95] hover:bg-[#0B7A95] hover:text-white hover:scale-105"
                            title="Halaman selanjutnya"
                          >
                            ›
                          </button>
                        );
                      }

                      return pages;
                    })()}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-[#0B7A95] text-white hover:bg-[#0a6b85] hover:scale-105"
                    }`}
                  >
                    <span className="hidden sm:inline">Selanjutnya →</span>
                    <span className="sm:hidden">›</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

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
            transform: translateY(-10px);
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

        @keyframes fade-in-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fade-in-right {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes bounce-subtle {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-5px);
          }
          60% {
            transform: translateY(-3px);
          }
        }

        @keyframes pulse-gentle {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 5px rgba(123, 179, 199, 0.3);
          }
          50% {
            box-shadow: 0 0 15px rgba(123, 179, 199, 0.6);
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
            transform: translateY(-10px);
          }
        }

        @keyframes swing {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(5deg);
          }
          75% {
            transform: rotate(-5deg);
          }
        }

        @keyframes ring-small {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.6s ease-out 0.2s both;
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
          animation: float 6s ease-in-out infinite;
        }
        .animate-swing {
          animation: swing 2s ease-in-out infinite;
        }
        .animate-ring-small {
          animation: ring-small 1.5s infinite;
        }
        .animate-fade-in-delayed {
          animation: fade-in-up 0.6s ease-out 0.3s both;
        }
        .animate-fade-in-delayed-2 {
          animation: fade-in-up 0.6s ease-out 0.5s both;
        }
      `}</style>

      {/* Delete Single Notification Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-[#A8C8D8] rounded-2xl max-w-md w-full mx-2 sm:mx-0">
            {/* Header Modal */}
            <div className="bg-[#6B8CAE] rounded-t-2xl p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="bg-white p-1.5 sm:p-2 rounded-lg">
                  <i className="fas fa-trash text-[#6B8CAE] text-sm sm:text-lg"></i>
                </div>
                <h2 className="text-white font-bold text-sm sm:text-lg">
                  Konfirmasi Hapus
                </h2>
              </div>
              <button
                onClick={closeDeleteModal}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <i className="fas fa-times text-lg sm:text-xl"></i>
              </button>
            </div>

            {/* Content Modal */}
            <div className="p-4 sm:p-6 space-y-4">
              <p className="text-[#2C3E50] text-sm sm:text-base text-center">
                Apakah Anda yakin ingin menghapus notifikasi ini?
              </p>

              <div className="flex space-x-3 justify-center">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() =>
                    selectedNotificationId &&
                    handleDeleteNotification(selectedNotificationId)
                  }
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Notifications Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-[#A8C8D8] rounded-2xl max-w-md w-full mx-2 sm:mx-0">
            {/* Header Modal */}
            <div className="bg-[#6B8CAE] rounded-t-2xl p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="bg-white p-1.5 sm:p-2 rounded-lg">
                  <i className="fas fa-trash text-[#6B8CAE] text-sm sm:text-lg"></i>
                </div>
                <h2 className="text-white font-bold text-sm sm:text-lg">
                  Konfirmasi Hapus Semua
                </h2>
              </div>
              <button
                onClick={() => setShowDeleteAllModal(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <i className="fas fa-times text-lg sm:text-xl"></i>
              </button>
            </div>

            {/* Content Modal */}
            <div className="p-4 sm:p-6 space-y-4">
              <p className="text-[#2C3E50] text-sm sm:text-base text-center">
                Apakah Anda yakin ingin menghapus semua notifikasi? Tindakan ini
                tidak dapat dibatalkan.
              </p>

              <div className="flex space-x-3 justify-center">
                <button
                  onClick={() => setShowDeleteAllModal(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteAllNotifications}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Hapus Semua
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Footer */}
      <footer className="mt-auto bg-[#0B7A95] text-white py-4 px-6">
        <div className="text-center space-y-1">
          <p className="text-sm font-medium">
            Copyright 2025 © SafeNurse All Rights reserved.
          </p>
          <p className="text-xs text-white/80">Universitas Hasanuddin</p>
        </div>
      </footer>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            style: {
              background: "#10B981",
            },
          },
          error: {
            style: {
              background: "#EF4444",
            },
          },
        }}
      />
    </div>
  );
}
