"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DashboardSuperAdmin() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const [users, setUsers] = useState([
    {
      id: 1,
      nama: "Dr. Ahmad Santoso",
      email: "ahmad@hospital.com",
      role: "verifikator",
      ruangan: "-",
    },
    {
      id: 2,
      nama: "Siti Nurhaliza",
      email: "siti@hospital.com",
      role: "perawat",
      ruangan: "IGD",
    },
    {
      id: 3,
      nama: "Budi Prasetyo",
      email: "budi@hospital.com",
      role: "perawat",
      ruangan: "Bedah",
    },
    {
      id: 4,
      nama: "Dr. Maya Sari",
      email: "maya@hospital.com",
      role: "verifikator",
      ruangan: "-",
    },
    {
      id: 5,
      nama: "Rina Wati",
      email: "rina@hospital.com",
      role: "perawat",
      ruangan: "Kandungan",
    },
    {
      id: 6,
      nama: "Agus Setiawan",
      email: "agus@hospital.com",
      role: "kepalaruangan",
      ruangan: "ICU",
    },
    {
      id: 7,
      nama: "Dewi Lestari",
      email: "dewi@hospital.com",
      role: "chiefnursing",
      ruangan: "-",
    },
    {
      id: 8,
      nama: "Admin System",
      email: "admin@hospital.com",
      role: "admin",
      ruangan: "System",
    },
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: number; nama: string; email: string; role: string; ruangan: string } | null>(null);
  const [filterRole, setFilterRole] = useState("");
  const [newUser, setNewUser] = useState({
    nama: "",
    role: "",
    unitKerja: "",
    email: "",
    telepon: "",
    password: "",
  });

  // Filter users by role
  const filteredUsers = filterRole
    ? users.filter((user) => user.role === filterRole)
    : users;

  // Handle delete user
  const handleDeleteUser = (user: { id: number; nama: string; email: string; role: string; ruangan: string }) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDeleteUser = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
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
                onClick={() => router.push("/dashboard-super-admin/ruangan")}
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

            {/* Search Filter */}
            <div className="mb-6">
              <div className="flex justify-end">
                <div className="w-64">
                  <label className="block text-white font-medium mb-2">
                    Filter by Role:
                  </label>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7A95] text-black bg-white"
                  >
                    <option value="">Semua Role</option>
                    <option value="perawat">Perawat</option>
                    <option value="kepalaruangan">Kepala Ruangan</option>
                    <option value="chief-nursing">Chief Nursing</option>
                    <option value="verifikator">Verifikator</option>
                    <option value="admin">Admin</option>
                  </select>
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
                      <h3 className="text-white font-semibold text-lg">NAMA</h3>
                    </div>
                    <div className="text-center">
                      <h3 className="text-white font-semibold text-lg">
                        EMAIL
                      </h3>
                    </div>
                    <div className="text-center">
                      <h3 className="text-white font-semibold text-lg">ROLE</h3>
                    </div>
                    <div className="text-center">
                      <h3 className="text-white font-semibold text-lg">
                        RUANGAN
                      </h3>
                    </div>
                    <div className="text-center">
                      <h3 className="text-white font-semibold text-lg">AKSI</h3>
                    </div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                  {filteredUsers.map((user, index) => (
                    <div
                      key={user.id}
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
                      <div className="text-center text-gray-600">
                        {user.role}
                      </div>
                      <div className="text-center text-gray-600">
                        {user.ruangan}
                      </div>
                      <div className="text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Cards - Visible on Mobile */}
              <div className="md:hidden space-y-4 p-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-800 text-lg">
                            {user.nama}
                          </h4>
                          <p className="text-gray-600 text-sm">{user.email}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            Role:
                          </span>
                          <p className="text-gray-600">{user.role}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Ruangan:
                          </span>
                          <p className="text-gray-600">{user.ruangan}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
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
                    <option value="kepalaruangan">Kepala Ruangan</option>
                    <option value="chief-nursing">Chief Nursing</option>
                    <option value="verifikator">Verifikator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#0E364A] font-medium mb-2">
                    Unit Kerja / Ruangan :
                  </label>
                  <select
                    value={newUser.unitKerja}
                    onChange={(e) =>
                      setNewUser({ ...newUser, unitKerja: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7A95] text-black bg-white"
                  >
                    <option value="">Pilih Unit Kerja</option>
                    <option value="ICU">ICU</option>
                    <option value="IGD">IGD</option>
                    <option value="Bedah">Bedah</option>
                    <option value="Anak">Anak</option>
                  </select>
                </div>

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

                <div>
                  <label className="block text-[#0E364A] font-medium mb-2">
                    Password :
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7A95] text-black bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    // Handle submit logic here
                    setShowCreateModal(false);
                    setNewUser({
                      nama: "",
                      role: "",
                      unitKerja: "",
                      email: "",
                      telepon: "",
                      password: "",
                    });
                  }}
                  className="bg-[#0E364A] text-white px-8 py-2 rounded-md hover:bg-[#1a4a5a] transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Konfirmasi Hapus User
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Apakah Anda yakin ingin menghapus user{" "}
                <strong>{userToDelete?.nama}</strong>? Tindakan ini tidak dapat
                dibatalkan.
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
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
