"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from 'next/image';

interface Ruangan {
  id_ruangan: string;
  nama_ruangan: string;
}

export default function RuanganSuperAdmin() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [ruangan, setRuangan] = useState<{ id: number; nama: string }[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<{
    id: number;
    nama: string;
  } | null>(null);
  const [newRoom, setNewRoom] = useState({ nama: "" });
  const [isLoading, setIsLoading] = useState(true);

  const token = Cookies.get("token");

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 🔹 Fetch ruangan dari API
  const fetchRuangan = async () => {
    setIsLoading(true);
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

      const resData = await res.json();
      console.log("RAW DATA:", resData);

      // mapping ke struktur { id, nama }
      const mapped = resData.map((r: Ruangan) => ({
        id: r.id_ruangan, // string
        nama: r.nama_ruangan, // string
      }));

      setRuangan(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRuangan();
  }, []);

  // 🔹 Handle delete room
  const handleDeleteRoom = (room: { id: number; nama: string }) => {
    setRoomToDelete(room);
    setShowDeleteModal(true);
  };

  const confirmDeleteRoom = () => {
    if (roomToDelete) {
      setRuangan(ruangan.filter((r) => r.id !== roomToDelete.id));
      setShowDeleteModal(false);
      setRoomToDelete(null);
    }
  };

  const cancelDeleteRoom = () => {
    setShowDeleteModal(false);
    setRoomToDelete(null);
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
                Memuat Data Ruangan...
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
            {/* User Management */}
            <button
              className="flex flex-col items-center transition-colors text-white hover:text-[#0B7A95]"
              onClick={() => router.push("/dashboard-superadmin")}
            >
              <i className="fas fa-users text-lg mb-1"></i>
              <span className="text-xs">User</span>
            </button>

            {/* Ruangan Management - Active */}
            <button className="flex flex-col items-center transition-colors text-[#0B7A95]">
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
              {/* User Management */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                onClick={() => router.push("/dashboard-superadmin")}
              >
                <i className="fas fa-users text-lg mr-3"></i>
                <span>User Management</span>
              </button>

              {/* Ruangan Management - Active */}
              <button className="flex items-center text-[#0B7A95] transition-colors p-2 rounded">
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

      {/* Main content */}
      <main className="flex-1 px-6 py-6">
        <div
          className="relative rounded-xl p-8 h-full"
          style={{
            background: "linear-gradient(180deg, #b9dce3 0%, #0a7a9a 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-20 pointer-events-none rounded-xl"
            style={{
              backgroundImage: `url('/bgperawat.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              zIndex: 0,
            }}
          ></div>

          {/* Content Container */}
          <div className="relative z-10">
            {/* Page Title */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Manajemen Ruangan
              </h2>
              <p className="text-white/80">
                Kelola dan pantau daftar ruangan dalam sistem
              </p>
            </div>

            {/* Rooms Table */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden md:block">
                <div className="bg-[#0E364A] px-6 py-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <h3 className="text-white font-semibold text-lg">
                        NAMA RUANGAN
                      </h3>
                    </div>
                    <div className="text-center">
                      <h3 className="text-white font-semibold text-lg">AKSI</h3>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {ruangan.map((room, index) => (
                    <div
                      key={room.id}
                      className={`grid grid-cols-2 gap-6 px-6 py-4 ${
                        index % 2 === 0 ? "bg-[#B9D9DD]" : "bg-white"
                      }`}
                    >
                      <div className="text-center text-gray-800 font-medium">
                        {room.nama}
                      </div>
                      <div className="text-center">
                        <button
                          onClick={() => handleDeleteRoom(room)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4 p-4">
                {ruangan.map((room) => (
                  <div
                    key={room.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-gray-800 text-lg">
                          {room.nama}
                        </h4>
                        <p className="text-gray-600 text-sm">Ruangan</p>
                      </div>
                      <button
                        onClick={() => handleDeleteRoom(room)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Hapus
                      </button>
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

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#B9D9DD] rounded-lg p-8 w-96 max-w-md mx-4 relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl"
            >
              ×
            </button>

            <h2 className="text-xl font-semibold text-center mb-6 text-[#0E364A]">
              Create Room
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[#0E364A] font-medium mb-2">
                  Nama Ruangan :
                </label>
                <input
                  type="text"
                  value={newRoom.nama}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, nama: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7A95] text-black bg-white"
                  placeholder="Masukkan nama ruangan"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={async () => {
                  if (newRoom.nama) {
                    try {
                      const res = await fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_API}/ruangan/register-ruangan`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({
                            nama_ruangan: newRoom.nama,
                          }),
                        }
                      );

                      if (!res.ok) throw new Error("Gagal menambahkan ruangan");
                      const resData = await res.json();
                      console.log("ROOM CREATED:", resData);

                      // langsung tambah ke state FE biar muncul tanpa reload
                      await fetchRuangan();

                      // reset modal & input
                      setShowCreateModal(false);
                      setNewRoom({ nama: "" });
                    } catch (err) {
                      console.error(err);
                      alert("Gagal menambah ruangan");
                    }
                  }
                }}
                className="bg-[#0E364A] text-white px-8 py-2 rounded-md hover:bg-[#1a4a5a] transition-colors"
              >
                Submit
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
              onClick={cancelDeleteRoom}
              className="absolute top-4 right-4 text-[#0E364A] hover:text-gray-800 text-xl"
            >
              ×
            </button>
            
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-medium text-[#0E364A] mb-2">
                Konfirmasi Hapus Ruangan
              </h3>
              <p className="text-sm text-[#0E364A] mb-6">
                Apakah Anda yakin ingin menghapus ruangan{" "}
                <strong>{roomToDelete?.nama}</strong>? Tindakan ini tidak dapat
                dibatalkan.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={cancelDeleteRoom}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDeleteRoom}
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
            Copyright 2025 © SafeNurse All Rights reserved.
          </p>
          <p className="text-xs text-white/80">
            Universitas Hasanuddin
          </p>
        </div>
      </footer>
        </>
      )}
    </div>
  );
}
