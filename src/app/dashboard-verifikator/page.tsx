"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const gradingColors: Record<string, string> = {
  merah: "#ef4444", // merah
  kuning: "#facc15", // kuning
  biru: "#3b82f6", // biru
  hijau: "#22c55e", // hijau
  Unknown: "#9ca3af", // default abu-abu
};

const kategoriColors: Record<string, string> = {
  KTD: "#3b82f6", // biru
  KPC: "#f97316", // oranye
  KNC: "#22c55e", // hijau
  KTC: "#8b5cf6", // ungu
  Sentinel: "#ef4444", // merah
  Unknown: "#9ca3af", // abu-abu default
};

interface Insiden {
  kode_laporan: string;
  nama_pasien: string;
  kategori: string;
  grading: string;
  tgl_insiden: string;
  tgl_msk_rs: string;
  ruangan?: {
    nama_ruangan: string;
  };
}

export default function DashboardVerifikatorPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filterUnit, setFilterUnit] = useState("Semua");
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [filterGrading, setFilterGrading] = useState("Semua");
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  const [insidenData, setInsidenData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<Insiden[]>([]);
  const [laporanData, setLaporanData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);

  const token = Cookies.get("token");

  // CSS Keyframes untuk animasi
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideDown {
        from { 
          opacity: 0; 
          transform: translateY(-20px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
      
      @keyframes scaleIn {
        from { 
          opacity: 0; 
          transform: scale(0.95); 
        }
        to { 
          opacity: 1; 
          transform: scale(1); 
        }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes fadeInUp {
        from { 
          opacity: 0; 
          transform: translateY(30px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
      
      @keyframes textGlow {
        0%, 100% { text-shadow: 0 0 5px rgba(44,62,80,0.5); }
        50% { text-shadow: 0 0 20px rgba(44,62,80,0.8), 0 0 30px rgba(44,62,80,0.6); }
      }
      
      @keyframes fadeInRight {
        from { 
          opacity: 0; 
          transform: translateX(30px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(0); 
        }
      }
      
      @keyframes fadeInLeft {
        from { 
          opacity: 0; 
          transform: translateX(-30px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(0); 
        }
      }
      
      @keyframes pulseGentle {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }
      
      @keyframes bounceSubtle {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
      }
      
      @keyframes fadeInDelayed {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fadeInDelayed2 {
        0% { opacity: 0; transform: translateX(-20px); }
        100% { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes fadeInDelayed3 {
        0% { opacity: 0; transform: translateX(20px); }
        100% { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 5px rgba(107,140,174,0.3); }
        50% { box-shadow: 0 0 20px rgba(107,140,174,0.6), 0 0 30px rgba(107,140,174,0.4); }
      }
      
      @keyframes chartSlideUp {
        from { 
          opacity: 0; 
          transform: translateY(40px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
      
      .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
      .animate-slideDown { animation: slideDown 0.6s ease-out; }
      .animate-scaleIn { animation: scaleIn 0.5s ease-out; }
      .animate-float { animation: float 6s ease-in-out infinite; }
      .animate-fadeInUp { animation: fadeInUp 0.7s ease-out; }
      .animate-textGlow { animation: textGlow 3s ease-in-out infinite; }
      .animate-fadeInRight { animation: fadeInRight 0.8s ease-out; }
      .animate-fadeInLeft { animation: fadeInLeft 0.8s ease-out; }
      .animate-pulseGentle { animation: pulseGentle 3s ease-in-out infinite; }
      .animate-bounceSubtle { animation: bounceSubtle 2s ease-in-out infinite; }
      .animate-fadeInDelayed { animation: fadeInDelayed 0.8s ease-out 0.2s both; }
      .animate-fadeInDelayed2 { animation: fadeInDelayed2 0.8s ease-out 0.4s both; }
      .animate-fadeInDelayed3 { animation: fadeInDelayed3 0.8s ease-out 0.6s both; }
      .animate-glow { animation: glow 4s ease-in-out infinite; }
      .animate-chartSlideUp { animation: chartSlideUp 0.9s ease-out; }
      
      .hover-lift:hover { 
        transform: translateY(-3px) scale(1.01); 
        transition: all 0.3s ease; 
      }
      
      .stagger-1 { animation-delay: 0.1s; }
      .stagger-2 { animation-delay: 0.2s; }
      .stagger-3 { animation-delay: 0.3s; }
      .stagger-4 { animation-delay: 0.4s; }
      .stagger-5 { animation-delay: 0.5s; }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/laporan/verifikator`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await res.json();
        console.log(json);
        setLaporanData(json.data || []);
        if (json?.data) {
          setInsidenData(json.data);
          setFilteredData(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  fetchReportCount();

  const fetchNotifications = async () => {
    const token = Cookies.get("token");
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

      // Hitung hanya notifikasi baru
      const countBaru = resData.notifikasi_baru?.length || 0;
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

  const handleFilter = () => {
    let data = [...insidenData];

    if (filterUnit !== "Semua") {
      data = data.filter(
        (d) =>
          d.ruangan?.nama_ruangan?.toLowerCase() === filterUnit.toLowerCase()
      );
    }
    if (filterKategori !== "Semua") {
      data = data.filter(
        (d) => d.kategori?.toLowerCase() === filterKategori.toLowerCase()
      );
    }
    if (filterGrading !== "Semua") {
      data = data.filter(
        (d) => d.grading?.toLowerCase() === filterGrading.toLowerCase()
      );
    }
    if (filterYear) {
      data = data.filter((d) => {
        const insidenDate = new Date(d.tgl_insiden);
        return insidenDate.getFullYear().toString() === filterYear;
      });
    }
    if (filterMonth) {
      data = data.filter((d) => {
        const insidenDate = new Date(d.tgl_insiden);
        const month = (insidenDate.getMonth() + 1).toString().padStart(2, "0");
        return month === filterMonth;
      });
    }

    setFilteredData(data);
  };

  // === Chart Data Calculation ===
  const kategoriCounts = filteredData.reduce<Record<string, number>>(
    (acc, d) => {
      const key = d.kategori || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {}
  );

  const gradingCounts = filteredData.reduce<Record<string, number>>(
    (acc, d) => {
      const key = d.grading || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {}
  );

  const monthlyCounts = filteredData.reduce<Record<string, number>>(
    (acc, d) => {
      const date = new Date(d.tgl_insiden);
      const month = date.toLocaleDateString("id-ID", { month: "long" }); // Januari, Februari, dst
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    },
    {}
  );

  const monthlyData = Object.entries(monthlyCounts).map(([month, count]) => ({
    month,
    count,
  }));

  const kategoriData = Object.entries(kategoriCounts).map(([key, val]) => ({
    name: key,
    value: val,
  }));

  const gradingData = Object.entries(gradingCounts).map(([key, val]) => ({
    name: key,
    value: val,
  }));

  // === Export Excel ===
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      laporanData.map((item, index) => ({
        No: index + 1,
        Kode: item.kode_laporan,
        Nama_Pasien: item.nama_pasien,
        No_RM: item.no_rm,
        Umur: item.umur,
        Jenis_Kelamin: item.jenis_kelamin,
        Judul_Insiden: item.judul_insiden,
        Kategori: item.kategori,
        Grading: item.grading,
        Dampak: item.dampak,
        Probabilitas: item.probabilitas,
        Lokasi_Insiden: item.lokasi_insiden,
        Tanggal_Insiden: new Date(item.tgl_insiden).toLocaleString("id-ID"),
        Tanggal_Masuk_RS: item.tgl_msk_rs,
        Tanggal_Laporan: new Date(item.tgl_waktu_pelaporan).toLocaleString(
          "id-ID"
        ),
        Ruangan: item.ruangan?.nama_ruangan || "-",
        Perawat: item.perawat?.nama_perawat || "-",
        Status: item.status,
        Catatan_Chief: item.catatan_chief_nursing,
        Catatan_Kepala_Ruangan: item.catatan_kepala_ruangan,
        Catatan_Verifikator: item.catatan_verifikator,
        Kronologi: item.kronologi,
        Rekomendasi_Tindakan: item.rekomendasi_tindakan,
        Tindakan_Awal: item.tindakan_awal,
        Tindakan_Oleh: item.tindakan_oleh,
        Tindak_Lanjut: item.tindak_lanjut,
        Yang_Dilaporkan: item.yang_dilaporkan,
        Updated_At: new Date(item.updated_at).toLocaleString("id-ID"),
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), "laporan-insiden.xlsx");
  };

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
                Memuat Data Dashboard...
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
      ) : (
        <>
          <div className="bg-[#d9f0f6] min-h-screen flex flex-col animate-fadeIn">
            {/* Header/Navbar */}
            <header className="bg-[#B9D9DD] rounded-xl px-4 sm:px-6 py-3 mx-4 sm:mx-6 mt-4 sm:mt-6">
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
                  {/* Dashboard - Active */}
                  <button className="flex flex-col items-center text-[#0B7A95] transition-colors">
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
                    className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors relative"
                    onClick={() =>
                      (window.location.href = "/notifications-verifikator")
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
                    onClick={() =>
                      (window.location.href = "/profile-verifikator")
                    }
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
                    {/* Dashboard - Active */}
                    <button className="flex items-center text-[#0B7A95] transition-colors p-2 rounded">
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
                      <span>Laporan Masuk</span>
                    </button>

                    {/* Manage Profil */}
                    <button
                      className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                      onClick={() =>
                        (window.location.href = "/profile-verifikator")
                      }
                    >
                      <i className="fas fa-user-cog text-lg mr-3"></i>
                      <span>Profil</span>
                    </button>
                  </div>
                </div>
              )}
            </header>

            {/* Main content */}
            <main className="flex-1 px-4 sm:px-6 py-4 sm:py-6 animate-slideDown">
              <div className="bg-[#A8C8E1] rounded-lg p-4 sm:p-6 h-full relative overflow-hidden animate-scaleIn">
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
                  {/* Header */}
                  <div className="mb-4 sm:mb-6 animate-fadeInUp">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#2C3E50] mb-2 animate-textGlow">
                      Dashboard Insiden dan Data
                    </h2>
                  </div>

                  {/* Filter Data Section */}
                  <div className="bg-white rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 animate-fadeInLeft hover-lift animate-glow">
                    <h3 className="text-base sm:text-lg font-semibold text-[#2C3E50] mb-3 sm:mb-4 animate-pulseGentle">
                      Filter Data
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 items-end">
                      {/* Unit */}
                      <div>
                        <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                          Unit
                        </label>
                        <select
                          value={filterUnit}
                          onChange={(e) => setFilterUnit(e.target.value)}
                          className="w-full px-3 py-2 bg-[#6B8CAE] text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
                        >
                          <option value="Semua">Semua</option>
                          <option value="IGD">IGD</option>
                          <option value="ICU">ICU</option>
                          <option value="Bedah">Bedah</option>
                        </select>
                      </div>

                      {/* Kategori */}
                      <div>
                        <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                          Kategori
                        </label>
                        <select
                          value={filterKategori}
                          onChange={(e) => setFilterKategori(e.target.value)}
                          className="w-full px-3 py-2 bg-[#6B8CAE] text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
                        >
                          <option value="Semua">Semua</option>
                          <option value="KTD">KTD</option>
                          <option value="KPC">KPC</option>
                          <option value="KNC">KNC</option>
                          <option value="KTC">KTC</option>
                          <option value="Sentinel">Sentinel</option>
                        </select>
                      </div>

                      {/* Grading */}
                      <div>
                        <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                          Grading
                        </label>
                        <select
                          value={filterGrading}
                          onChange={(e) => setFilterGrading(e.target.value)}
                          className="w-full px-3 py-2 bg-[#6B8CAE] text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
                        >
                          <option value="Semua">Semua</option>
                          <option value="Merah">Merah</option>
                          <option value="Kuning">Kuning</option>
                          <option value="Hijau">Hijau</option>
                          <option value="Biru">Biru</option>
                        </select>
                      </div>

                      {/* Tahun */}
                      <div>
                        <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                          Tahun
                        </label>
                        <select
                          value={filterYear}
                          onChange={(e) => setFilterYear(e.target.value)}
                          className="w-full px-3 py-2 bg-[#6B8CAE] text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
                        >
                          <option value="">Semua Tahun</option>
                          <option value="2024">2026</option>
                          <option value="2024">2025</option>
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                          <option value="2022">2022</option>
                          <option value="2021">2021</option>
                          <option value="2020">2020</option>
                        </select>
                      </div>

                      {/* Bulan */}
                      <div>
                        <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                          Bulan
                        </label>
                        <select
                          value={filterMonth}
                          onChange={(e) => setFilterMonth(e.target.value)}
                          className="w-full px-3 py-2 bg-[#6B8CAE] text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
                        >
                          <option value="">Semua Bulan</option>
                          <option value="01">Januari</option>
                          <option value="02">Februari</option>
                          <option value="03">Maret</option>
                          <option value="04">April</option>
                          <option value="05">Mei</option>
                          <option value="06">Juni</option>
                          <option value="07">Juli</option>
                          <option value="08">Agustus</option>
                          <option value="09">September</option>
                          <option value="10">Oktober</option>
                          <option value="11">November</option>
                          <option value="12">Desember</option>
                        </select>
                      </div>

                      {/* Filter Button */}
                      <div className="sm:col-span-2 lg:col-span-1">
                        <button
                          onClick={handleFilter}
                          className="w-full sm:w-12 h-10 bg-[#6B8CAE] text-white rounded hover:bg-[#5a7a9e] transition-colors flex items-center justify-center"
                        >
                          <i className="fas fa-search"></i>
                          <span className="ml-2 sm:hidden">Filter</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6 animate-fadeInRight">
                    {/* Grafik Tren Insiden */}
                    <div className="bg-white rounded-lg p-3 sm:p-4 animate-chartSlideUp stagger-1 hover-lift animate-glow">
                      <h4 className="text-base sm:text-lg font-semibold text-[#2C3E50] mb-3 sm:mb-4 animate-bounceSubtle">
                        Grafik Tren Insiden
                      </h4>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={monthlyData}>
                          <XAxis dataKey="month" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#6B8CAE" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Distribusi Berdasarkan Kategori */}
                    <div className="bg-white rounded-lg p-3 sm:p-4 animate-chartSlideUp stagger-2 hover-lift animate-glow">
                      <h4 className="text-base sm:text-lg font-semibold text-[#2C3E50] mb-3 sm:mb-4 animate-bounceSubtle">
                        Distribusi Berdasarkan Kategori
                      </h4>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={kategoriData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={80}
                            label
                          >
                            {kategoriData.map((entry, index) => (
                              <Cell
                                key={`cell-kategori-${index}`}
                                fill={
                                  kategoriColors[entry.name] ||
                                  kategoriColors.Unknown
                                }
                              />
                            ))}
                          </Pie>

                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Distribusi Berdasarkan Grading */}
                    <div className="bg-white rounded-lg p-3 sm:p-4 animate-chartSlideUp stagger-3 hover-lift animate-glow">
                      <h4 className="text-base sm:text-lg font-semibold text-[#2C3E50] mb-3 sm:mb-4 animate-bounceSubtle">
                        Distribusi Berdasarkan Grading
                      </h4>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={gradingData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={80}
                            label
                          >
                            {gradingData.map((entry, index) => (
                              <Cell
                                key={`cell-grading-${index}`}
                                fill={
                                  gradingColors[entry.name.toLowerCase()] ||
                                  gradingColors.Unknown
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Data Insiden Table */}
                  <div className="bg-white rounded-lg overflow-hidden animate-fadeInDelayed hover-lift animate-glow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 border-b space-y-2 sm:space-y-0 animate-fadeInDelayed2">
                      <h4 className="text-base sm:text-lg font-semibold text-[#2C3E50] animate-pulseGentle">
                        Data Insiden
                      </h4>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto animate-fadeInDelayed3">
                        <button
                          onClick={handleExportExcel}
                          className="bg-[#6B8CAE] text-white px-3 sm:px-4 py-2 rounded text-xs sm:text-sm hover:bg-[#5a7a9e] transition-colors flex items-center justify-center space-x-2 hover-lift animate-pulseGentle"
                        >
                          <i className="fas fa-file-excel"></i>
                          <span>Ekspor Excel</span>
                        </button>
                      </div>
                    </div>

                    {/* Table Header - Hidden on mobile */}
                    <div className="bg-[#2C3E50] text-white hidden sm:block animate-fadeInUp">
                      <div className="grid grid-cols-4 gap-4 px-4 py-3 text-sm font-medium">
                        <div className="text-center">Tanggal</div>
                        <div className="text-center">Unit</div>
                        <div className="text-center">Kategori</div>
                        <div className="text-center">Grading</div>
                      </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-200">
                      {insidenData.map((item, index) => (
                        <div
                          key={item.id}
                          className="animate-fadeInUp hover-lift"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          {/* Desktop View */}
                          <div
                            className={`hidden sm:grid grid-cols-4 gap-4 px-4 py-3 text-sm ${
                              index % 2 === 0 ? "bg-[#A8C8E1]" : "bg-white"
                            } hover:bg-blue-50 transition-colors`}
                          >
                            <div className="text-center font-medium text-[#2C3E50]">
                              {new Date(
                                item.tgl_waktu_pelaporan
                              ).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </div>
                            <div className="text-center text-[#2C3E50]">
                              {item.ruangan?.nama_ruangan}
                            </div>
                            <div className="text-center text-[#2C3E50]">
                              {item.kategori}
                            </div>
                            <div className="text-center text-[#2C3E50]">
                              {item.grading}
                            </div>
                          </div>

                          {/* Mobile Card View */}
                          <div
                            className={`sm:hidden p-4 ${
                              index % 2 === 0 ? "bg-[#A8C8E1]" : "bg-white"
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-gray-600">
                                  Tanggal:
                                </span>
                                <span className="text-sm font-medium text-[#2C3E50]">
                                  {item.tgl_msk_rs}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-gray-600">
                                  Unit:
                                </span>
                                <span className="text-sm text-[#2C3E50]">
                                  {item.ruangan?.nama_ruangan}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-gray-600">
                                  Kategori:
                                </span>
                                <span className="text-sm text-[#2C3E50]">
                                  {item.kategori}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-gray-600">
                                  Grading:
                                </span>
                                <span className="text-sm text-[#2C3E50]">
                                  {item.grading}
                                </span>
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

            {/* Sticky Footer */}
            <footer className="mt-auto bg-[#0B7A95] text-white py-4 px-6">
              <div className="text-center space-y-1">
                <p className="text-sm font-medium">
                  Copyright 2025 © SafeNurse All Rights reserved.
                </p>
                <p className="text-xs text-white/80">Universitas Hasanuddin</p>
              </div>
            </footer>
          </div>
        </>
      )}
    </>
  );
}
