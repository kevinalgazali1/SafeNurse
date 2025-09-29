"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // State lain (harus di atas, sebelum return)
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangeProfileModal, setShowChangeProfileModal] = useState(false);
  const [editForm, setEditForm] = useState({
    email: "",
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [profileForm, setProfileForm] = useState({
    nama: "",
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const token = Cookies.get("token"); // ambil JWT dari cookie

  useEffect(() => {
    if (!token) {
      window.location.href = "/login"; // kalau token ga ada → redirect
      return;
    }

  const fetchNotifications = async () => {
    const token = Cookies.get("token");
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

    fetchNotifications();

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/perawat/oVteW89a6AIVOvFtyt3iV`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Gagal ambil data perawat");
        }

        const data = await res.json();
        console.log("API response:", data); // 🔥 cek isi response
        setUserData(data);
        setProfileForm({
          nama: data.nama_perawat || "",
        });
      } catch (error) {
        console.error("Error fetch perawat:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleChangeAccount = () => {
    setEditForm({
      email: userData.users?.email || "",
      oldPassword: "",
      password: "",
      confirmPassword: "",
    });
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditForm({
      email: "",
      oldPassword: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editForm.password !== editForm.confirmPassword) {
      toast.error("Password dan konfirmasi password tidak cocok!");
      return;
    }

    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Token tidak ada, silakan login ulang.");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/forgot_password/change_password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: editForm.oldPassword,
            newPassword: editForm.password,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Gagal mengubah password");
      }

      const result = await res.json();
      console.log("Password updated:", result);

      toast.success("Password berhasil diubah!");

      // ✅ Tutup modal otomatis
      handleCloseModal();
    } catch (error) {
      console.error("Error change password:", error);
      toast.error("Terjadi kesalahan saat mengubah password");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogout = () => {
    Cookies.remove("token"); // hapus token
    window.location.href = "/login"; // redirect
  };

  return (
    <div className="bg-[#d9f0f6] min-h-screen flex flex-col">
      {/* Loading Screen */}
      {isLoading && (
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
                Memuat Data Profil...
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
      )}

      {/* Error State */}
      {!isLoading && !userData && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
            </div>
            <h3 className="text-red-600 text-lg font-semibold mb-2">
              Data Tidak Ditemukan
            </h3>
            <p className="text-red-500 text-sm mb-4">
              Terjadi kesalahan saat memuat data profil
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      {/* Main Content - Only show when data is loaded */}
      {!isLoading && userData && (
        <>
          <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes bounceGentle {
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

            .animate-fade-in {
              animation: fadeIn 0.8s ease-out;
            }

            .animate-slide-up {
              animation: slideUp 0.6s ease-out;
            }

            .animate-slide-up-delay-1 {
              animation: slideUp 0.6s ease-out 0.1s both;
            }

            .animate-slide-up-delay-2 {
              animation: slideUp 0.6s ease-out 0.2s both;
            }

            .animate-slide-up-delay-3 {
              animation: slideUp 0.6s ease-out 0.3s both;
            }

            .animate-slide-up-delay-4 {
              animation: slideUp 0.6s ease-out 0.4s both;
            }

            .animate-fade-in-delay-1 {
              animation: fadeIn 0.8s ease-out 0.2s both;
            }

            .animate-fade-in-delay-2 {
              animation: fadeIn 0.8s ease-out 0.4s both;
            }

            .animate-fade-in-delay-3 {
              animation: fadeIn 0.8s ease-out 0.6s both;
            }

            .animate-fade-in-delay-4 {
              animation: fadeIn 0.8s ease-out 0.8s both;
            }

            .animate-bounce-gentle {
              animation: bounceGentle 2s infinite;
            }

            .hover\\:shadow-3xl:hover {
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            }

            @media (max-width: 768px) {
              .animate-slide-up,
              .animate-slide-up-delay-1,
              .animate-slide-up-delay-2,
              .animate-slide-up-delay-3,
              .animate-slide-up-delay-4 {
                animation-duration: 0.4s;
              }

              .animate-fade-in,
              .animate-fade-in-delay-1,
              .animate-fade-in-delay-2,
              .animate-fade-in-delay-3,
              .animate-fade-in-delay-4 {
                animation-duration: 0.6s;
              }
            }
          `}</style>
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
                  className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors relative"
                  onClick={() =>
                    (window.location.href = "/notifications-perawat")
                  }
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

                {/* Video Tutorial */}
                <button
                  className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
                  onClick={() =>
                    (window.location.href = "/video-tutorial-perawat")
                  }
                >
                  <i className="fas fa-play-circle text-lg mb-1"></i>
                  <span className="text-xs">Tutorial</span>
                </button>

                {/* Manage Profil - Active */}
                <button className="flex flex-col items-center text-[#0B7A95] transition-colors">
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
                  {/* Riwayat Laporan */}
                  <button
                    className="flex items-center text-white hover:text-[#0B7A95] transition-colors py-2"
                    onClick={() =>
                      (window.location.href = "/dashboard-perawat")
                    }
                  >
                    <i className="fas fa-clipboard-list text-lg mr-3"></i>
                    <span>Riwayat</span>
                  </button>

                  {/* Notifikasi */}
                  <button
                    className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded relative"
                    onClick={() =>
                      (window.location.href = "/notifications-perawat")
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

                  {/* Video Tutorial */}
                  <button
                    className="flex items-center text-white hover:text-[#0B7A95] transition-colors py-2"
                    onClick={() =>
                      (window.location.href = "/video-tutorial-perawat")
                    }
                  >
                    <i className="fas fa-play-circle text-lg mr-3"></i>
                    <span>Tutorial</span>
                  </button>

                  {/* Manage Profil - Active */}
                  <button className="flex items-center text-[#0B7A95] transition-colors py-2">
                    <i className="fas fa-user-cog text-lg mr-3"></i>
                    <span>Profil</span>
                  </button>
                </div>
              </div>
            )}
          </header>

          {/* Main content */}
          <main className="flex-1 px-4 md:px-6 py-4 md:py-6">
            <div
              className="bg-white rounded-lg p-4 md:p-6 h-full relative overflow-hidden animate-fade-in"
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
                {/* Profile Content Container */}
                <div className="flex justify-center items-center min-h-full">
                  <div className="max-w-4xl w-full space-y-6">
                    {/* Top Section - Profile Info and General Information */}
                    <div className="flex flex-col lg:flex-row gap-4 md:gap-6 animate-slide-up">
                      {/* Left Box - Profile Picture, Name, Email */}
                      <div className="bg-white/95 rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col items-center transform hover:scale-105 transition-all duration-300 hover:shadow-3xl animate-slide-up-delay-1">
                        <div className="w-20 md:w-24 h-20 md:h-24 bg-[#4A9B8E] rounded-full flex items-center justify-center mb-3 md:mb-4 animate-bounce-gentle">
                          <i className="fas fa-user text-2xl md:text-3xl text-white"></i>
                        </div>
                        <h2 className="text-base md:text-lg font-bold text-gray-800 text-center mb-1">
                          {userData.nama_perawat || "-"}
                        </h2>
                        <p className="text-gray-600 text-center text-xs md:text-sm">
                          {userData.users.email}
                        </p>
                      </div>

                      {/* Right Box - General Information */}
                      <div className="flex-1 bg-white/95 rounded-2xl p-4 md:p-6 shadow-2xl relative transform hover:scale-105 transition-all duration-300 hover:shadow-3xl animate-slide-up-delay-2">
                        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">
                          General Information
                        </h3>
                        <div className="space-y-2 md:space-y-3">
                          <div className="flex flex-col sm:flex-row animate-fade-in-delay-1">
                            <span className="text-gray-600 text-sm md:text-base sm:w-40">
                              Nama Lengkap :
                            </span>
                            <span className="text-gray-800 text-sm md:text-base">
                              {userData.nama_perawat || "-"}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row animate-fade-in-delay-2">
                            <span className="text-gray-600 text-sm md:text-base sm:w-40">
                              Nama Ruangan :
                            </span>
                            <span className="text-gray-800 text-sm md:text-base">
                              {userData.ruangan?.nama_ruangan}
                            </span>
                          </div>
                        </div>
                        {/* Change Profile Button */}
                        <div className="mt-4 md:mt-6 flex justify-end">
                          <button
                            onClick={() => setShowChangeProfileModal(true)}
                            className="bg-[#6B8CAE] text-white px-3 md:px-4 py-2 rounded-lg hover:bg-[#5A7A9A] transition-all duration-300 font-medium text-xs md:text-sm transform hover:scale-105 hover:shadow-lg"
                          >
                            Change Profile
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Box - Security */}
                    <div className="bg-white/95 rounded-2xl p-4 md:p-6 shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-3xl animate-slide-up-delay-3">
                      <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">
                        Security
                      </h3>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                          <div className="animate-fade-in-delay-3">
                            <label className="text-xs md:text-sm text-gray-600">
                              Email
                            </label>
                            <p className="text-gray-800 text-sm md:text-base">
                              {userData.users.email}
                            </p>
                          </div>
                          <div className="animate-fade-in-delay-4">
                            <label className="text-xs md:text-sm text-gray-600">
                              Password
                            </label>
                            <p className="text-gray-800 text-sm md:text-base">
                              ••••••••••••
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleChangeAccount}
                          className="bg-[#6B8CAE] text-white px-4 md:px-6 py-2 rounded-lg hover:bg-[#5A7A9A] transition-all duration-300 font-medium text-xs md:text-base w-full sm:w-auto transform hover:scale-105 hover:shadow-lg"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>

                    {/* Logout Button */}
                    <div className="flex justify-center animate-slide-up-delay-4">
                      <button
                        onClick={handleLogout}
                        className="bg-[#2C3E50] text-white px-6 md:px-8 py-2 md:py-3 rounded-lg hover:bg-[#34495E] transition-all duration-300 font-medium text-sm md:text-base w-full sm:w-auto max-w-xs transform hover:scale-105 hover:shadow-lg"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Edit Account Modal */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-[#A8C8D8] rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-2xl">
                {/* Close Button */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 w-8 h-8 bg-[#6B8CAE] rounded-full flex items-center justify-center text-white hover:bg-[#5A7A9A] transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>

                {/* Modal Header */}
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-[#6B8CAE] rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-edit text-white text-xl"></i>
                  </div>
                  <h2 className="text-xl font-bold text-[#2C3E50]">
                    Edit Account
                  </h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmitEdit} className="space-y-4">
                  {/* Old Password Field */}
                  <div>
                    <label className="block text-[#2C3E50] font-medium mb-2">
                      Password Lama :
                    </label>
                    <div className="relative">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        value={editForm.oldPassword}
                        onChange={(e) =>
                          handleInputChange("oldPassword", e.target.value)
                        }
                        className="w-full px-4 py-3 pr-12 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#6B8CAE] bg-white text-gray-800"
                        placeholder="Masukkan password lama"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        <i
                          className={`fas ${
                            showOldPassword ? "fa-eye-slash" : "fa-eye"
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-[#2C3E50] font-medium mb-2">
                      Password :
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={editForm.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className="w-full px-4 py-3 pr-12 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#6B8CAE] bg-white text-gray-800"
                        placeholder="Masukkan password baru"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        <i
                          className={`fas ${
                            showPassword ? "fa-eye-slash" : "fa-eye"
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-[#2C3E50] font-medium mb-2">
                      Konfirmasi Password :
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={editForm.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        className="w-full px-4 py-3 pr-12 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#6B8CAE] bg-white text-gray-800"
                        placeholder="Konfirmasi password baru"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        <i
                          className={`fas ${
                            showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-4">
                    <button
                      type="submit"
                      className="bg-[#2C3E50] text-white px-8 py-3 rounded-lg hover:bg-[#34495E] transition-colors font-medium"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Change Profile Modal */}
          {showChangeProfileModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-[#A8C8D8] rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-2xl">
                {/* Close Button */}
                <button
                  onClick={() => setShowChangeProfileModal(false)}
                  className="absolute top-4 right-4 w-8 h-8 bg-[#6B8CAE] rounded-full flex items-center justify-center text-white hover:bg-[#5A7A9A] transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>

                {/* Modal Header */}
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-[#6B8CAE] rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-user-edit text-white text-xl"></i>
                  </div>
                  <h2 className="text-xl font-bold text-[#2C3E50]">
                    Change Profile
                  </h2>
                </div>

                {/* Form */}
                <form
                  className="space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault();

                    try {
                      const token = Cookies.get("token");
                      if (!token) {
                        toast.error("Token tidak ada, silakan login ulang.");
                        return;
                      }

                      const res = await fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_API}/perawat/update`,
                        {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({
                            nama_perawat: profileForm.nama,
                          }),
                        }
                      );

                      if (!res.ok) throw new Error("Gagal update profile");

                      const updated = await res.json();
                      console.log("Profile updated:", updated);

                      // update state supaya UI langsung ke-refresh
                      setUserData((prev: any) => ({
                        ...prev,
                        nama_perawat: profileForm.nama,
                      }));

                      toast.success("Profile berhasil diupdate!");
                      setShowChangeProfileModal(false);
                    } catch (err) {
                      console.error("Error update profile:", err);
                      toast.error("Terjadi kesalahan saat update profile");
                    }
                  }}
                >
                  {/* Nama Lengkap Field */}
                  <div>
                    <label className="block text-[#2C3E50] font-medium mb-2">
                      Nama Lengkap :
                    </label>
                    <input
                      type="text"
                      value={profileForm.nama}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, nama: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#6B8CAE] bg-white text-gray-800"
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-4">
                    <button
                      type="submit"
                      className="bg-[#2C3E50] text-white px-8 py-3 rounded-lg hover:bg-[#34495E] transition-colors font-medium"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
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
