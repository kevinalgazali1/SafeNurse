"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";

export default function ProfileVerifikatorPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    jabatan: "",
    unit_kerja: "",
    no_telp: "",
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token"); // ambil JWT dari cookie
    if (!token) {
      window.location.href = "/login"; // kalau token ga ada → redirect
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://safe-nurse-backend.vercel.app/api/verifikator/mBZInqBCsp7AhxgwwjYT2",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Gagal ambil data Verifikator");
        }

        const data = await res.json();
        console.log("API response:", data); // 🔥 cek isi response
        setUserData(data);
        setProfileForm({
          nama: data.nama_verifikator || "",
          jabatan: data.jabatan || "",
          unit_kerja: data.unit_kerja || "",
          no_telp: data.no_telp || "",
        });
      } catch (error) {
        console.error("Error fetch Verifikator:", error);
      } finally {
        setLoading(false);
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
      alert("Password dan konfirmasi password tidak cocok!");
      return;
    }

    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Token tidak ada, silakan login ulang.");
        return;
      }

      const res = await fetch(
        "https://safe-nurse-backend.vercel.app/api/forgot_password/change_password",
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

      alert("Password berhasil diubah!");

      // ✅ Tutup modal otomatis
      handleCloseModal();
    } catch (error) {
      console.error("Error change password:", error);
      alert("Terjadi kesalahan saat mengubah password");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  // Tambahkan fungsi baru
  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Token tidak ada, silakan login ulang.");
        return;
      }

      const res = await fetch(
        "https://safe-nurse-backend.vercel.app/api/verifikator/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nama_verifikator: profileForm.nama,
            jabatan: profileForm.jabatan,
            unit_kerja: profileForm.unit_kerja,
            no_telp: profileForm.no_telp,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Gagal update profile");
      }

      const result = await res.json();
      console.log("Profile updated:", result);

      alert("Profil berhasil diperbarui!");

      // update state biar tampilan ikut berubah
      setUserData((prev: any) => ({
        ...prev,
        nama_verifikator: profileForm.nama,
        jabatan: profileForm.jabatan,
        unit_kerja: profileForm.unit_kerja,
        no_telp: profileForm.no_telp,
      }));

      // Tutup modal
      setShowChangeProfileModal(false);
    } catch (error) {
      console.error("Error update profile:", error);
      alert("Terjadi kesalahan saat update profil");
    }
  };

  const handleLogout = () => {
    Cookies.remove("token"); // hapus token
    window.location.href = "/login"; // redirect
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!userData) {
    return <p className="text-center mt-10">Data tidak ditemukan</p>;
  }

  return (
    <div className="bg-[#d9f0f6] min-h-screen flex flex-col">
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

        .animate-fade-in-delay-5 {
          animation: fadeIn 0.8s ease-out 1s both;
        }

        .animate-fade-in-delay-6 {
          animation: fadeIn 0.8s ease-out 1.2s both;
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
          .animate-fade-in-delay-4,
          .animate-fade-in-delay-5,
          .animate-fade-in-delay-6 {
            animation-duration: 0.6s;
          }
        }
      `}</style>
      {/* Header/Navbar */}
      <header className="bg-[#B9D9DD] rounded-xl px-6 py-3 mx-6 mt-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">
            Safe
            <span className="font-bold text-[#0B7A95]">Nurse</span>
          </h1>

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

            {/* Notifikasi */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() =>
                (window.location.href = "/notifications-verifikator")
              }
            >
              <i className="fas fa-bell text-lg mb-1"></i>
              <span className="text-xs">Notifikasi</span>
            </button>

            {/* Laporan Masuk */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() =>
                (window.location.href = "/laporan-masuk-verifikator")
              }
            >
              <i className="fas fa-envelope text-lg mb-1"></i>
              <span className="text-xs">Laporan Masuk</span>
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

              {/* Notifikasi */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                onClick={() =>
                  (window.location.href = "/notifications-verifikator")
                }
              >
                <i className="fas fa-bell text-lg mr-3"></i>
                <span>Notifikasi</span>
              </button>

              {/* Laporan Masuk */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                onClick={() =>
                  (window.location.href = "/laporan-masuk-verifikator")
                }
              >
                <i className="fas fa-envelope text-lg mr-3"></i>
                <span>Laporan Masuk</span>
              </button>

              {/* Manage Profil - Active */}
              <button className="flex items-center text-[#0B7A95] transition-colors p-2 rounded">
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
                      {userData.nama_verifikator}
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
                          {userData.nama_verifikator || "-"}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row animate-fade-in-delay-3">
                        <span className="text-gray-600 text-sm md:text-base sm:w-40">
                          Jabatan :
                        </span>
                        <span className="text-gray-800 text-sm md:text-base">
                          {userData.jabatan || "-"}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row animate-fade-in-delay-3">
                        <span className="text-gray-600 text-sm md:text-base sm:w-40">
                          Unit Kerja :
                        </span>
                        <span className="text-gray-800 text-sm md:text-base">
                          {userData.unit_kerja || "-"}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row animate-fade-in-delay-4">
                        <span className="text-gray-600 text-sm md:text-base sm:w-40">
                          No Telp :
                        </span>
                        <span className="text-gray-800 text-sm md:text-base">
                          {userData.no_telp || "-"}
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
                      <div className="animate-fade-in-delay-5">
                        <label className="text-xs md:text-sm text-gray-600">
                          Email
                        </label>
                        <p className="text-sm md:text-base text-gray-800">
                          {userData.users.email}
                        </p>
                      </div>
                      <div className="animate-fade-in-delay-6">
                        <label className="text-xs md:text-sm text-gray-600">
                          Password
                        </label>
                        <p className="text-sm md:text-base text-gray-800">
                          ••••••••••••
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleChangeAccount}
                      className="bg-[#6B8CAE] text-white px-3 md:px-6 py-2 rounded-lg hover:bg-[#5A7A9A] transition-all duration-300 font-medium text-xs md:text-base w-full sm:w-auto transform hover:scale-105 hover:shadow-lg"
                    >
                      Change Account
                    </button>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="flex justify-center animate-slide-up-delay-4">
                  <button
                    onClick={handleLogout}
                    className="bg-[#2C3E50] text-white px-4 md:px-8 py-2 md:py-3 rounded-lg hover:bg-[#34495E] transition-all duration-300 font-medium text-sm md:text-base w-full sm:w-auto max-w-xs transform hover:scale-105 hover:shadow-lg"
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
              <h2 className="text-xl font-bold text-[#2C3E50]">Edit Account</h2>
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
            <form className="space-y-4" onSubmit={handleSubmitProfile}>
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

              {/* Jabatan Field */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-2">
                  Jabatan :
                </label>
                <input
                  type="text"
                  value={profileForm.jabatan}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, jabatan: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#6B8CAE] bg-white text-gray-800"
                  placeholder="Masukkan jabatan"
                  required
                />
              </div>

              {/* Unit Kerja Field */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-2">
                  Unit Kerja :
                </label>
                <input
                  type="text"
                  value={profileForm.unit_kerja}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      unit_kerja: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#6B8CAE] bg-white text-gray-800"
                  placeholder="Masukkan Unit Kerja"
                  required
                />
              </div>

              {/* No Telp Field */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-2">
                  No Telp :
                </label>
                <input
                  type="tel"
                  value={profileForm.no_telp}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, no_telp: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#6B8CAE] bg-white text-gray-800"
                  placeholder="Masukkan nomor telepon"
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
    </div>
  );
}
