"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface JwtPayload {
  role: string;
  exp?: number;
  iat?: number;
}

interface User {
  id_user: string;
  email: string;
  role: string;
  nama: string;
  nama_ruangan: string;
  unit_kerja: string;
  ruangan?: Array<{ id_ruangan: string; nama_ruangan: string }>;
} 

type UserRole =
  | "perawat"
  | "kepala_ruangan"
  | "chief_nursing"
  | "verifikator"
  | "super_admin";

interface EditUser {
  nama: string;
  email: string;
  id_ruangan?: string;
  role: UserRole;
  jabatan?: string;
  unit_kerja?: string;
  no_telp?: string;
}

export default function DashboardSuperAdmin() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [ruanganList, setRuanganList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination and search states
  const [currentPage, setCurrentPage] = useState(1);
  const [searchUser, setSearchUser] = useState("");
  const itemsPerPage = 10;

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

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal mengambil data users");

      const data = await res.json();
      console.log("Users dari API:", data);
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchRuangan = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/ruangan`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Gagal mengambil data ruangan");

        const data = await res.json();
        console.log("Data ruangan:", data);
        setRuanganList(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) fetchRuangan();
  }, [token]);

  const handleSubmit = async () => {
    try {
      const body = {
        email: newUser.email,
        password: newUser.password,
        jabatan: newUser.jabatan,
        role: newUser.role,
        id_ruangan: newUser.ruangan, // pastikan sesuai dengan id dari API ruangan
        unit_kerja: newUser.unitKerja,
        nama: newUser.nama,
        ...(newUser.role !== "perawat" && { no_telp: newUser.telepon }), // hanya kirim kalau bukan perawat
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Register gagal:", errorText);
        toast.error("Gagal register user!");
        return;
      }

      const data = await res.json();
      console.log("Register sukses:", data);
      toast.success("User berhasil didaftarkan!");

      // ✅ Refresh tabel dengan fetch ulang
      await fetchUsers();

      // reset form
      setShowCreateModal(false);
      setNewUser({
        nama: "",
        role: "",
        unitKerja: "",
        ruangan: "",
        email: "",
        jabatan: "",
        telepon: "",
        password: "",
      });
    } catch (err: any) {
      console.error("Error saat register:", err);
      toast.error("Terjadi kesalahan saat register!");
    }
  };

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id_user: string;
    nama: string;
    email: string;
    role: string;
    ruangan: string;
  } | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [editUser, setEditUser] = useState({
    nama: "",
    email: "",
    id_ruangan: "",
    role: "perawat",
    jabatan: "",
    unit_kerja: "",
    no_telp: "",
  });

  const [filterRole, setFilterRole] = useState("");
  const [newUser, setNewUser] = useState({
    nama: "",
    role: "",
    unitKerja: "",
    ruangan: "",
    email: "",
    jabatan: "",
    telepon: "",
    password: "",
  });

  // Filter users by role and search
  const filteredUsers = users.filter((user) => {
    const matchesRole = filterRole ? user.role === filterRole : true;
    const matchesSearch = searchUser
      ? user.nama.toLowerCase().includes(searchUser.toLowerCase()) ||
        user.email.toLowerCase().includes(searchUser.toLowerCase())
      : true;
    return matchesRole && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilterChange = (newFilterRole: string) => {
    setFilterRole(newFilterRole);
    setCurrentPage(1);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearchUser(newSearch);
    setCurrentPage(1);
  };

  // Pagination component
  const PaginationComponent = () => {
    const getPageNumbers = () => {
      const pages: number[] = [];
      const maxVisiblePages = 3;

      if (totalPages === 0) return pages;

      const groupIndex = Math.floor((currentPage - 1) / maxVisiblePages);
      const start = groupIndex * maxVisiblePages + 1;
      const end = Math.min(start + maxVisiblePages - 1, totalPages);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    };

    return (
      <div className="flex flex-row justify-center items-center space-x-2 mt-6">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-100 border border-gray-300"
          }`}
        >
          <i className="fas fa-chevron-left" aria-hidden="true"></i>
          <span className="hidden sm:inline ml-2">Sebelumnya</span>
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
              page === currentPage
                ? "bg-[#0B7A95] text-white"
                : "bg-white text-black hover:bg-gray-100 border border-gray-300"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-100 border border-gray-300"
          }`}
        >
          <span className="hidden sm:inline mr-2">Selanjutnya</span>
          <i className="fas fa-chevron-right" aria-hidden="true"></i>
        </button>
      </div>
    );
  };

  const updateUser = async (id_user: string, userData: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/users/update/${id_user}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // token dari login
          },
          body: JSON.stringify(userData),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal update user");
      }

      toast.success("User berhasil diperbarui ✅");
      await fetchUsers(); // refresh data tabel
      setShowEditModal(false); // tutup modal
    } catch (err: any) {
      console.error("Error updating user:", err);
      toast.error(err.message || "Gagal update user ❌");
    }
  };

  // Handle edit user
  const handleEditUser = (user: any) => {
    setUserToEdit(user);

    setEditUser({
      nama: user.nama || "",
      email: user.email || "",
      id_ruangan: user.id_ruangan || "",
      role: user.role || "perawat",
      jabatan: user.jabatan || "",
      unit_kerja: user.unit_kerja || "",
      no_telp: user.no_telp || "",
    });

    setShowEditModal(true);
  };

  // Handle delete user
  const handleDeleteUser = (user: User) => {
    setUserToDelete({
      id_user: user.id_user, // simpan id_user langsung
      nama: user.nama,
      email: user.email,
      role: user.role,
      ruangan: user.nama_ruangan,
    });
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/users/delete/${userToDelete.id_user}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Gagal hapus user:", errorText);
          toast.error("Gagal menghapus user");
          return;
        }

        // ✅ Refresh data
        await fetchUsers();

        // ✅ Tutup modal
        setShowDeleteModal(false);
        setUserToDelete(null);

        toast.success("User berhasil dihapus");
      } catch (err) {
        console.error("Error deleting user:", err);
        toast.error("Terjadi kesalahan saat menghapus user");
      }
    }
  };

  const cancelDeleteUser = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // Handle edit submit
  const handleEditSubmit = async () => {
    if (!userToEdit) return;

    const userData = {
      nama: editUser.nama,
      email: editUser.email,
      id_ruangan: editUser.id_ruangan,
      role: editUser.role,
      jabatan: editUser.jabatan,
      unit_kerja: editUser.unit_kerja,
      no_telp: editUser.no_telp,
    };

    await updateUser(userToEdit.id_user, userData);
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
                Memuat Data User...
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

      {/* Main Content - Only show when not loading */}
      {!isLoading && (
        <>
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
                {/* User Management - Active */}
                <button className="flex flex-col items-center transition-colors text-[#0B7A95]">
                  <i className="fas fa-users text-lg mb-1"></i>
                  <span className="text-xs">User</span>
                </button>

                {/* Ruangan Management */}
                <button
                  className="flex flex-col items-center transition-colors text-white hover:text-[#0B7A95]"
                  onClick={() => router.push("/dashboard-super-admin/ruangan")}
                >
                  <i className="fas fa-hospital text-lg mb-1"></i>
                  <span className="text-xs">Ruangan</span>
                </button>

                {/* Profil */}
                <button
                  className="flex flex-col items-center transition-colors text-white hover:text-[#0B7A95]"
                  onClick={() => router.push("/dashboard-super-admin/profil")}
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
                  {/* User Management - Active */}
                  <button className="flex items-center text-[#0B7A95] transition-colors p-2 rounded">
                    <i className="fas fa-users text-lg mr-3"></i>
                    <span>User Management</span>
                  </button>

                  {/* Ruangan Management */}
                  <button
                    className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                    onClick={() =>
                      router.push("/dashboard-super-admin/ruangan")
                    }
                  >
                    <i className="fas fa-hospital text-lg mr-3"></i>
                    <span>Ruangan Management</span>
                  </button>

                  {/* Profil */}
                  <button
                    className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                    onClick={() => router.push("/dashboard-super-admin/profil")}
                  >
                    <i className="fas fa-user text-lg mr-3"></i>
                    <span>Profil</span>
                  </button>
                </div>
              </div>
            )}
          </header>

          {/* Main Content */}
          <main className="flex-1 px-6 py-6">
            <div
              className="relative rounded-xl p-8 h-full"
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
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Manajemen User
                  </h2>
                  <p className="text-white/80">
                    Kelola dan pantau daftar user dalam sistem
                  </p>
                </div>

                {/* Search and Filter */}
                <div className="mb-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    {/* Filter by Role */}
                    <div className="w-full md:w-64">
                      <label className="block text-white font-medium mb-2">
                        Filter by Role:
                      </label>
                      <select
                        value={filterRole}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7A95] text-black bg-white"
                      >
                        <option value="">Semua Role</option>
                        <option value="perawat">Perawat</option>
                        <option value="kepala_ruangan">Kepala Ruangan</option>
                        <option value="chief_nursing">Chief Nursing</option>
                        <option value="verifikator">Verifikator</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </div>

                    {/* Search by User */}
                    <div className="w-full md:w-64">
                      <label className="block text-white font-medium mb-2">
                        Search by User:
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Cari nama atau email..."
                          value={searchUser}
                          onChange={(e) => handleSearchChange(e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7A95] text-black bg-white"
                        />
                        <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
                  {/* Desktop Table - Hidden on Mobile */}
                  <div className="hidden md:block">
                    {/* Table Header */}
                    <div className="bg-[#0E364A] px-6 py-4">
                      <div className="grid grid-cols-5 gap-6">
                        <div className="text-center">
                          <h3 className="text-white font-semibold text-lg">
                            NAMA
                          </h3>
                        </div>
                        <div className="text-center">
                          <h3 className="text-white font-semibold text-lg">
                            EMAIL
                          </h3>
                        </div>
                        <div className="text-center">
                          <h3 className="text-white font-semibold text-lg">
                            ROLE
                          </h3>
                        </div>
                        <div className="text-center">
                          <h3 className="text-white font-semibold text-lg">
                            RUANGAN
                          </h3>
                        </div>
                        <div className="text-center">
                          <h3 className="text-white font-semibold text-lg">
                            AKSI
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-200">
                      {currentUsers.map((user, index) => {
                        // Mapping role agar lebih readable
                        const roleLabel: Record<string, string> = {
                          super_admin: "Super Admin",
                          verifikator: "Verifikator",
                          perawat: "Perawat",
                          kepala_ruangan: "Kepala Ruangan",
                          chief_nursing: "Chief Nursing",
                          admin: "Admin",
                        };

                        const namaRuanganGabungan = user.ruangan && user.ruangan.length > 0
                          ? user.ruangan.map((r: any) => r.nama_ruangan).join(", ")
                          : "-"; // Tampilkan strip jika tidak ada ruangan

                        return (
                          <div
                            key={user.id_user}
                            className={`grid grid-cols-5 gap-6 px-6 py-4 ${
                              index % 2 === 0 ? "bg-[#B9D9DD]" : "bg-white"
                            }`}
                          >
                            <div className="text-center text-gray-800 font-medium">
                              {user.nama}
                            </div>
                            <div className="text-center text-gray-600">
                              {user.email}
                            </div>
                            <div className="text-center text-gray-600 no-underline">
                              {roleLabel[user.role] || user.role}
                            </div>
                            <div className="text-center text-gray-600">
                              {namaRuanganGabungan}
                            </div>
                            <div className="text-center">
                              <div className="flex justify-center space-x-2">
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                                >
                                  <i className="fas fa-edit mr-1"></i>
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user)}
                                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                                >
                                  <i className="fas fa-trash mr-1"></i>
                                  Hapus
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Show message if no users found */}
                      {currentUsers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <i className="fas fa-users text-4xl mb-4 opacity-50"></i>
                          <p className="text-lg">
                            Tidak ada user yang ditemukan
                          </p>
                          <p className="text-sm">
                            Coba ubah filter atau kata kunci pencarian
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile Cards - Visible on Mobile */}
                  <div className="md:hidden space-y-4 p-4">
                    {currentUsers.map((user) => {
                      const roleLabel: Record<string, string> = {
                        super_admin: "Super Admin",
                        verifikator: "Verifikator",
                        perawat: "Perawat",
                        kepala_ruangan: "Kepala Ruangan",
                        chief_nursing: "Chief Nursing",
                        admin: "Admin",
                      };

                      return (
                        <div
                          key={user.id_user}
                          className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                        >
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-gray-800 text-lg">
                                  {user.nama}
                                </h4>
                                <p className="text-gray-600 text-sm truncate max-w-[200px]">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">
                                  Role:
                                </span>
                                <p className="text-gray-600 no-underline">
                                  {roleLabel[user.role] || user.role}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">
                                  Ruangan:
                                </span>
                                <p className="text-gray-600">
                                  {user.nama_ruangan}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditUser(user)}
                                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user)}
                                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Show message if no users found - Mobile */}
                    {currentUsers.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <i className="fas fa-users text-4xl mb-4 opacity-50"></i>
                        <p className="text-lg">Tidak ada user yang ditemukan</p>
                        <p className="text-sm">
                          Coba ubah filter atau kata kunci pencarian
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pagination */}
                {filteredUsers.length > 0 && <PaginationComponent />}
              </div>
            </div>
          </main>

          {/* Floating Add Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="fixed bottom-6 right-6 bg-[#0B7A95] text-white w-16 h-16 rounded-full shadow-lg hover:bg-[#095a6b] transition-colors flex items-center justify-center z-50"
          >
            <i className="fas fa-plus text-2xl"></i>
          </button>

          {/* Create Account Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-[#B9D9DD] rounded-lg w-full max-w-md max-h-[90vh] relative flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    <span>Back</span>
                  </button>
                  <h2 className="text-xl font-semibold text-[#0E364A]">
                    Create Account
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-600 hover:text-gray-800 text-xl w-8 h-8 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    {/* Nama */}
                    {newUser.role !== "" && (
                      <div>
                        <label className="block text-[#0E364A] font-medium mb-2">
                          Nama :
                        </label>
                        <input
                          type="text"
                          value={newUser.nama}
                          onChange={(e) =>
                            setNewUser({ ...newUser, nama: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7A95] text-black bg-white"
                        />
                      </div>
                    )}

                    {/* Role */}
                    <div>
                      <label className="block text-[#0E364A] font-medium mb-2">
                        Role :
                      </label>
                      <select
                        value={newUser.role}
                        onChange={(e) =>
                          setNewUser({ ...newUser, role: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7A95] text-black bg-white"
                      >
                        <option value="">Pilih Role</option>
                        <option value="perawat">Perawat</option>
                        <option value="kepala_ruangan">Kepala Ruangan</option>
                        <option value="chief_nursing">Chief Nursing</option>
                        <option value="verifikator">Verifikator</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </div>

                    {/* Email */}
                    {newUser.role !== "" && (
                      <div>
                        <label className="block text-[#0E364A] font-medium mb-2">
                          Email :
                        </label>
                        <input
                          type="email"
                          value={newUser.email}
                          onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7A95] text-black bg-white"
                        />
                      </div>
                    )}

                    {/* Ruangan (perawat, kepala ruangan) */}
                    {(newUser.role === "perawat" ||
                      newUser.role === "kepala_ruangan") && (
                      <div>
                        <label className="block text-[#0E364A] font-medium mb-2">
                          Nama Ruangan :
                        </label>
                        <select
                          value={newUser.ruangan}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              ruangan: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-[#0B7A95] text-black bg-white"
                        >
                          <option value="">-- Pilih Ruangan --</option>
                          {ruanganList.map((ruang) => (
                            <option
                              key={ruang.id_ruangan}
                              value={ruang.id_ruangan}
                            >
                              {ruang.nama_ruangan}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Unit kerja (verifikator) */}
                    {newUser.role === "verifikator" && (
                      <div>
                        <label className="block text-[#0E364A] font-medium mb-2">
                          Unit Kerja :
                        </label>
                        <input
                          type="text"
                          value={newUser.unitKerja}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              unitKerja: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7A95] text-black bg-white"
                        />
                      </div>
                    )}

                    {/* Jabatan */}
                    {(newUser.role === "kepala_ruangan" ||
                      newUser.role === "chief_nursing" ||
                      newUser.role === "verifikator") && (
                      <div>
                        <label className="block text-[#0E364A] font-medium mb-2">
                          Jabatan :
                        </label>
                        <input
                          type="text"
                          value={newUser.jabatan}
                          onChange={(e) =>
                            setNewUser({ ...newUser, jabatan: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7A95] text-black bg-white"
                        />
                      </div>
                    )}

                    {/* Telepon */}
                    {(newUser.role === "kepala_ruangan" ||
                      newUser.role === "chief_nursing" ||
                      newUser.role === "verifikator") && (
                      <div>
                        <label className="block text-[#0E364A] font-medium mb-2">
                          No. Telepon :
                        </label>
                        <input
                          type="tel"
                          value={newUser.telepon}
                          onChange={(e) =>
                            setNewUser({ ...newUser, telepon: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7A95] text-black bg-white"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-200">
                  <div className="flex justify-center">
                    <button
                      onClick={handleSubmit}
                      className="bg-[#0E364A] text-white px-8 py-2 rounded-md hover:bg-[#1a4a5a] transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit User Modal */}

          {showEditModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-[#B9D9DD] rounded-lg w-full max-w-md max-h-[90vh] relative flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-[#0E364A]">
                    Edit User
                  </h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-600 hover:text-gray-800 text-xl"
                  >
                    ×
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {/* Nama */}
                  <div>
                    <label className="block text-[#0E364A] font-medium mb-2">
                      Nama :
                    </label>
                    <input
                      type="text"
                      value={editUser.nama}
                      onChange={(e) =>
                        setEditUser({ ...editUser, nama: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[#0E364A] font-medium mb-2">
                      Email :
                    </label>
                    <input
                      type="email"
                      value={editUser.email}
                      onChange={(e) =>
                        setEditUser({ ...editUser, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                    />
                  </div>

                  {/* Kondisional sesuai role */}
                  {["perawat", "kepala_ruangan"].includes(editUser.role) && (
                    <div>
                      <label className="block text-[#0E364A] font-medium mb-2">
                        Ruangan :
                      </label>
                      <select
                        value={editUser.id_ruangan}
                        onChange={(e) =>
                          setEditUser({
                            ...editUser,
                            id_ruangan: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                      >
                        <option value="">-- Pilih Ruangan --</option>
                        {ruanganList.map((ruang) => (
                          <option
                            key={ruang.id_ruangan}
                            value={ruang.id_ruangan}
                          >
                            {ruang.nama_ruangan}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {["kepala_ruangan", "chief_nursing", "verifikator"].includes(
                    editUser.role
                  ) && (
                    <div>
                      <label className="block text-[#0E364A] font-medium mb-2">
                        Jabatan :
                      </label>
                      <input
                        type="text"
                        value={editUser.jabatan}
                        onChange={(e) =>
                          setEditUser({ ...editUser, jabatan: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                      />
                    </div>
                  )}

                  {editUser.role === "verifikator" && (
                    <div>
                      <label className="block text-[#0E364A] font-medium mb-2">
                        Unit Kerja :
                      </label>
                      <input
                        type="text"
                        value={editUser.unit_kerja}
                        onChange={(e) =>
                          setEditUser({
                            ...editUser,
                            unit_kerja: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                      />
                    </div>
                  )}

                  {["kepala_ruangan", "chief_nursing", "verifikator"].includes(
                    editUser.role
                  ) && (
                    <div>
                      <label className="block text-[#0E364A] font-medium mb-2">
                        No. Telp :
                      </label>
                      <input
                        type="text"
                        value={editUser.no_telp}
                        onChange={(e) =>
                          setEditUser({ ...editUser, no_telp: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                      />
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex justify-center">
                  <button
                    onClick={handleEditSubmit}
                    className="bg-[#0E364A] text-white px-6 py-2 rounded-md hover:bg-[#1a4a5a] transition"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-[#B9D9DD] rounded-lg w-full max-w-md p-6 relative">
                <button
                  onClick={cancelDeleteUser}
                  className="absolute top-4 right-4 text-[#0E364A] hover:text-gray-800 text-xl"
                >
                  ×
                </button>

                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                  </div>
                  <h3 className="text-lg font-medium text-[#0E364A] mb-2">
                    Konfirmasi Hapus User
                  </h3>
                  <p className="text-sm text-[#0E364A] mb-6">
                    Apakah Anda yakin ingin menghapus user{" "}
                    <strong>{userToDelete?.nama}</strong>? Tindakan ini tidak
                    dapat dibatalkan.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={cancelDeleteUser}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmDeleteUser}
                    className="flex-1 bg-[#0E364A] text-white px-4 py-2 rounded-md hover:bg-[#1a4a5a] transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sticky Footer */}
          <footer className="mt-auto bg-[#0B7A95] text-white py-4 px-6">
            <div className="text-center space-y-1">
              <p className="text-sm font-medium">
                Copyright 2025 © SAFE-Nurse Universitas Hasanuddin.
              </p>
              <p className="text-xs text-white/80">
                Penelitian Tesis Magister Kemdiktisaintek
              </p>
            </div>
          </footer>

          {/* Toast Notifications */}
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
        </>
      )}
    </div>
  );
}
