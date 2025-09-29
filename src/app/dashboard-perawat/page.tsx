"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";

interface Report {
  id: number;
  tanggal: string;
  kategori: string;
  status: string;
  grading: string;
  catatanKepalaRuangan: string;
  catatanChiefnursing: string;
  catatanVerifikator: string;
  kode: string;
  kodeLaporan: string;
  namaPerawatYangMenangani: string;
  namaRuanganPerawatYangMenangani: string;
  namaPasien: string;
  noRm: string;
  umur: string;
  jenisKelamin: string;
  tanggalMasukRs: string;
  unitYangMelaporkan: string;
  lokasiKejadian: string;
  tanggalInsiden: string;
  yangDilaporkan: string;
  judulInsiden: string;
  kronologi: string;
  tindakanAwal: string;
  tindakanOleh: string;
  dampak: string;
  probablitas: string;
  rekomendasiTindakan: string;
  tanggalWaktuPelaporan: string;
}

interface MobileReportCardProps {
  report: Report;
  onDetailClick: (report: Report) => void;
}

// Fungsi untuk menentukan warna background Status Laporan
const getStatusLaporanColor = (status: string) => {
  switch (status) {
    case "laporan disetujui chief nursing":
      return "bg-blue-500 text-white shadow-md";
    case "diteruskan ke verifikator":
      return "bg-orange-500 text-white shadow-md";
    case "laporan ditolak validator":
      return "bg-red-500 text-white shadow-md";
    case "laporan disetujui verifikator":
      return "bg-green-500 text-white shadow-md";
    case "diteruskan ke validator":
      return "bg-yellow-500 text-white shadow-md";
    default:
      return "bg-gray-500 text-white shadow-md";
  }
};

// Fungsi untuk menentukan warna background Grading
const getGradingColor = (grading: string) => {
  switch (grading) {
    case "merah":
      return "bg-red-500 text-white shadow-md";
    case "kuning":
      return "bg-yellow-500 text-white shadow-md";
    case "hijau":
      return "bg-green-500 text-white shadow-md";
    case "biru":
      return "bg-blue-500 text-white shadow-md";
    default:
      return "bg-gray-500 text-white shadow-md";
  }
};

function MobileReportCard({ report, onDetailClick }: MobileReportCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="mb-3">
          {/* Status di atas kanan */}
          <div className="flex justify-end items-center space-x-2 mb-2">
            <span
              className={`inline-block px-3 py-2 rounded-lg text-xs font-semibold ${getStatusLaporanColor(report.status)}`}
            >
              {report.status}
            </span>
            <i
              className={`fas fa-chevron-${
                isExpanded ? "up" : "down"
              } text-gray-400 text-xs`}
            ></i>
          </div>

          {/* Kategori dan tanggal berdampingan */}
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 text-sm">
              {report.kategori}
            </h3>
            <p className="text-xs text-gray-600">{report.tanggal}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDetailClick(report);
            }}
            className="bg-[#0B7A95] text-white px-3 py-1 rounded text-xs hover:bg-[#0a6b85] transition-colors"
          >
            Detail
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Grading:</span>
              <span className={`inline-block px-3 py-2 rounded-lg text-xs font-semibold ${getGradingColor(report.grading)}`}>
                {report.grading}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Kode Laporan:</span>
              <span className="text-gray-800">{report.kodeLaporan}</span>
            </div>
            <div className="mt-3">
              <span className="font-medium text-gray-600 block mb-1">
                Catatan Kepala Ruangan:
              </span>
              <p className="text-gray-800 text-xs leading-relaxed">
                {report.catatanKepalaRuangan}
              </p>
            </div>
            <div className="mt-3">
              <span className="font-medium text-gray-600 block mb-1">
                Catatan Chief Nursing:
              </span>
              <p className="text-gray-800 text-xs leading-relaxed">
                {report.catatanChiefnursing}
              </p>
            </div>
            <div className="mt-3">
              <span className="font-medium text-gray-600 block mb-1">
                Catatan Verifikator:
              </span>
              <p className="text-gray-800 text-xs leading-relaxed">
                {report.catatanVerifikator}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPerawatPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  
  // State untuk filter
  const [filterKategori, setFilterKategori] = useState("");
  const [filterGrading, setFilterGrading] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  

  const token = Cookies.get("token");

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideDown {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes scaleIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes fadeInUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes textGlow {
        0%, 100% { text-shadow: 0 0 5px rgba(255,255,255,0.5); }
        50% { text-shadow: 0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6); }
      }
      
      @keyframes fadeInRight {
        from { transform: translateX(20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes fadeInLeft {
        from { transform: translateX(-20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes pulseGentle {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }
      
      @keyframes bounceSubtle {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-2px); }
      }
      
      @keyframes fadeInDelayed {
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fadeInDelayed2 {
        0% { opacity: 0; transform: translateY(15px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 5px rgba(11, 122, 149, 0.3); }
        50% { box-shadow: 0 0 20px rgba(11, 122, 149, 0.6), 0 0 30px rgba(11, 122, 149, 0.4); }
      }
      
      @keyframes tableSlideUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
      .animate-slideDown { animation: slideDown 0.6s ease-out; }
      .animate-scaleIn { animation: scaleIn 0.5s ease-out; }
      .animate-float { animation: float 6s ease-in-out infinite; }
      .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
      .animate-textGlow { animation: textGlow 3s ease-in-out infinite; }
      .animate-fadeInRight { animation: fadeInRight 0.7s ease-out; }
      .animate-fadeInLeft { animation: fadeInLeft 0.7s ease-out; }
      .animate-pulseGentle { animation: pulseGentle 2s ease-in-out infinite; }
      .animate-bounceSubtle { animation: bounceSubtle 2s ease-in-out infinite; }
      .animate-fadeInDelayed { animation: fadeInDelayed 0.8s ease-out 0.3s both; }
      .animate-fadeInDelayed2 { animation: fadeInDelayed2 0.8s ease-out 0.5s both; }
      .animate-glow { animation: glow 2s ease-in-out infinite; }
      .animate-tableSlideUp { animation: tableSlideUp 0.8s ease-out; }
      .hover-lift { transition: transform 0.2s ease; }
      .hover-lift:hover { transform: translateY(-2px); }
      
      .stagger-1 { animation-delay: 0.1s; }
      .stagger-2 { animation-delay: 0.2s; }
      .stagger-3 { animation-delay: 0.3s; }
      .stagger-4 { animation-delay: 0.4s; }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

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

  const fetchReports = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/laporan/perawat`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Gagal mengambil data laporan");

      const resData = await res.json();

      const mappedReports = resData.data.map((r: any) => ({
        id: r.kode_laporan,
        kodeLaporan: r.kode_laporan,
        namaPerawatYangMenangani: r.perawat.nama_perawat,
        namaRuanganPerawatYangMenangani: r.ruangan.nama_ruangan,
        namaPasien: r.nama_pasien,
        noRm: r.no_rm,
        umur: r.umur,
        jenisKelamin: r.jenis_kelamin,
        tanggalMasukRs: r.tgl_msk_rs,
        unitYangMelaporkan: r.unit_yang_melaporkan,
        lokasiKejadian: r.lokasi_insiden,
        tanggalInsiden: r.tgl_insiden,
        yangDilaporkan: "a",
        judulInsiden: r.judul_insiden,
        kronologi: r.kronologi,
        tindakanAwal: r.tindakan_awal,
        tindakanOleh: r.tindakan_oleh,
        dampak: r.dampak,
        probablitas: r.probabilitas,
        status: r.status,
        grading: r.grading,
        kategori: r.kategori,
        rekomendasiTindakan: r.rekomendasi_tindakan,
        tanggalWaktuPelaporan: r.tgl_waktu_pelaporan,
        catatanKepalaRuangan: r.catatan_kepala_ruangan,
        catatanChiefnursing: r.catatan_chief_nursing,
        catatanVerifikator: r.catatan_verifikator,
        tanggal: new Date(r.tgl_insiden).toISOString().split("T")[0], // yyyy-mm-dd
      }));

      setReports(mappedReports);
      setFilteredReports(mappedReports); // default semua
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // filter otomatis setiap kali selectedDate atau filter lainnya berubah
  useEffect(() => {
    let filtered = reports;
    
    // Filter berdasarkan tanggal
    if (selectedDate) {
      filtered = filtered.filter((r) => r.tanggal === selectedDate);
    }
    
    // Filter berdasarkan kategori
    if (filterKategori) {
      filtered = filtered.filter((r) => r.kategori === filterKategori);
    }
    
    // Filter berdasarkan grading
    if (filterGrading) {
      filtered = filtered.filter((r) => r.grading === filterGrading);
    }
    
    // Filter berdasarkan status
    if (filterStatus) {
      filtered = filtered.filter((r) => r.status === filterStatus);
    }
    
    setFilteredReports(filtered);
    // Reset ke halaman pertama setiap kali filter berubah
    setCurrentPage(1);
  }, [selectedDate, filterKategori, filterGrading, filterStatus, reports]);

  // Pagination logic
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const startIndex = (currentPage - 1) * reportsPerPage;
  const endIndex = startIndex + reportsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleAddReport = () => router.push("/tambah-laporan");
  const handleDetailClick = (report: Report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const formatTanggal = (tanggal: string) => {
    if (!tanggal || tanggal === "-") return "-";

    const date = new Date(tanggal);

    return (
      new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date) + " WITA"
    ); // tambahkan zona sesuai kebutuhan
  };

  return (
    <div className="bg-[#d9f0f6] min-h-screen flex flex-col animate-fadeIn">
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
                Memuat Data Laporan...
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
          <header className="bg-[#B9D9DD] rounded-xl mx-6 mt-6">
            <div className="flex justify-between items-center px-6 py-3">
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

              {/* Desktop Navigation Items */}
              <div className="hidden md:flex items-center space-x-6">
                {/* Riwayat Laporan - Active */}
                <button className="flex flex-col items-center text-[#0B7A95] transition-colors">
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

                {/* Manage Profil */}
                <button
                  className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
                  onClick={() => (window.location.href = "/profile-perawat")}
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
            <div
              className={`md:hidden ${
                isMobileMenuOpen ? "block" : "hidden"
              } px-6 pb-4`}
            >
              <div className="flex flex-col space-y-4">
                {/* Riwayat Laporan - Active */}
                <button className="flex items-center text-[#0B7A95] transition-colors py-2">
                  <i className="fas fa-clipboard-list text-lg mr-3"></i>
                  <span className="text-sm">Riwayat Laporan</span>
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
                  <span className="text-sm">Video Tutorial</span>
                </button>

                {/* Manage Profil */}
                <button
                  className="flex items-center text-white hover:text-[#0B7A95] transition-colors py-2"
                  onClick={() => (window.location.href = "/profile-perawat")}
                >
                  <i className="fas fa-user-cog text-lg mr-3"></i>
                  <span className="text-sm">Kelola Profil</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 px-6 py-6 animate-slideDown">
            <div
              className="bg-white rounded-lg p-6 h-full min-h-screen relative overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #b9dce3 0%, #0a7a9a 100%)",
              }}
            >
              {/* Background pattern */}
              <Image
                alt="Background medical pattern"
                className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none animate-scaleIn animate-float"
                src="/bgperawat.png"
                fill
                style={{ zIndex: 0 }}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Header section with date picker and add button */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 animate-fadeInUp space-y-4 lg:space-y-0">
                  {/* Filter Section - Kiri Atas */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
                    {/* Filter Kategori */}
                    <div className="flex flex-col w-full sm:w-auto">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Kategori
                      </label>
                      <select
                        value={filterKategori}
                        onChange={(e) => setFilterKategori(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#0B7A95] focus:border-transparent text-sm min-w-[120px]"
                      >
                        <option value="">Semua</option>
                        <option value="KTD">KTD</option>
                        <option value="KPC">KPC</option>
                        <option value="KNC">KNC</option>
                        <option value="KTC">KTC</option>
                        <option value="Sentinel">Sentinel</option>
                      </select>
                    </div>

                    {/* Filter Grading */}
                    <div className="flex flex-col w-full sm:w-auto">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Grading
                      </label>
                      <select
                        value={filterGrading}
                        onChange={(e) => setFilterGrading(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#0B7A95] focus:border-transparent text-sm min-w-[120px]"
                      >
                        <option value="">Semua</option>
                        <option value="merah">Merah</option>
                        <option value="kuning">Kuning</option>
                        <option value="hijau">Hijau</option>
                        <option value="biru">Biru</option>
                      </select>
                    </div>

                    {/* Filter Status */}
                    <div className="flex flex-col w-full sm:w-auto">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#0B7A95] focus:border-transparent text-sm min-w-[180px]"
                      >
                        <option value="">Semua</option>
                        <option value="diteruskan ke validator">
                          Diteruskan ke Validator
                        </option>
                        <option value="laporan ditolak validator">
                          Laporan Ditolak Validator
                        </option>
                        <option value="diteruskan ke verifikator">
                          Diteruskan ke Verifikator
                        </option>
                        <option value="laporan disetujui chiefnursing">
                          Laporan Disetujui Chief Nursing
                        </option>
                        <option value="laporan disetujui verifikator">
                          Laporan Disetujui Verifikator
                        </option>
                      </select>
                    </div>

                    {/* Tombol Reset Filter */}
                    <div className="flex flex-col w-full sm:w-auto">
                      <label className="text-sm font-medium text-transparent mb-1">
                        Reset
                      </label>
                      <button
                        onClick={() => {
                          setFilterKategori("");
                          setFilterGrading("");
                          setFilterStatus("");
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors text-sm font-medium"
                      >
                        Reset Filter
                      </button>
                    </div>
                  </div>

                  <button
                    className="bg-[#0B7A95] text-white px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-medium hover:brightness-110 transition flex items-center justify-center space-x-2 w-full sm:w-auto max-w-xs sm:max-w-none animate-fadeInRight hover-lift"
                    onClick={handleAddReport}
                  >
                    <i className="fas fa-plus"></i>
                    <span>Tambah Laporan</span>
                  </button>
                </div>

                {/* Desktop Table - Hidden on Mobile */}
                <div className="hidden lg:block bg-white rounded-lg overflow-hidden shadow-lg animate-tableSlideUp">
                  {/* Table Header */}
                  <div className="bg-[#0B7A95] text-white animate-fadeInRight">
                    <div className="grid grid-cols-9 gap-2 px-4 py-3 text-sm font-medium">
                      <div className="text-center">Tanggal Laporan</div>
                      <div className="text-center">Kategori Insiden</div>
                      <div className="text-center">Status Laporan</div>
                      <div className="text-center">Grading</div>
                      <div className="text-center">Catatan kepala ruangan</div>
                      <div className="text-center">Catatan Chief Nursing</div>
                      <div className="text-center">Catatan verifikator</div>
                      <div className="text-center">Kode Laporan</div>
                      <div className="text-center">Detail</div>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-gray-200">
                    {currentReports.length > 0 ? (
                      currentReports.map((report, index) => (
                        <div
                          key={report.kodeLaporan}
                          className={`grid grid-cols-9 gap-2 px-4 py-3 text-sm ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-blue-50 transition-colors`}
                        >
                          <div className="bg-[#0E364A] text-white px-3 py-1 rounded text-center text-xs font-medium">
                            {new Date(report.tanggalWaktuPelaporan).toLocaleDateString("id-ID")}
                          </div>
                          <div className="text-gray-600 text-center">
                            {report.kategori}
                          </div>
                          <div className="text-center">
                            <span className={`inline-block min-w-[120px] px-3 py-2 rounded-lg text-xs font-semibold ${getStatusLaporanColor(report.status)}`}>
                              {report.status}
                            </span>
                          </div>
                          <div className="text-center">
                            <span className={`inline-block min-w-[80px] px-3 py-2 rounded-lg text-xs font-semibold ${getGradingColor(report.grading)}`}>
                              {report.grading}
                            </span>
                          </div>
                          <div className="text-gray-600 text-center">
                            {report.catatanKepalaRuangan || "-"}
                          </div>
                          <div className="text-gray-600 text-center">
                            {report.catatanChiefnursing || "-"}
                          </div>
                          <div className="text-gray-600 text-center">
                            {report.catatanVerifikator || "-"}
                          </div>
                          <div className="text-gray-600 text-center">
                            {report.kodeLaporan}
                          </div>
                          <div className="text-center">
                            <button
                              onClick={() => handleDetailClick(report)}
                              className="bg-[#0B7A95] text-white px-3 py-1 rounded text-xs hover:bg-[#0a6b85] transition-colors"
                            >
                              Detail
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-6">
                        Tidak ada laporan ditemukan
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Card Layout - Visible on Mobile */}
                <div className="lg:hidden space-y-4 animate-fadeInDelayed">
                  {currentReports.map((report, index) => (
                    <div
                      key={report.id}
                      className={`animate-fadeInUp stagger-${index % 3}`}
                    >
                      <MobileReportCard
                        report={report}
                        onDetailClick={handleDetailClick}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {filteredReports.length > reportsPerPage && (
                  <div className="mt-8 flex flex-col items-center space-y-4">
                    {/* Pagination Info */}
                    <div className="text-sm text-gray-600">
                      Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredReports.length)} dari {filteredReports.length} laporan
                    </div>
                    
                    {/* Pagination Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === 1
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-[#0E364A] text-white hover:bg-[#1a4a5c]'
                        }`}
                      >
                        Sebelumnya
                      </button>
                      
                      {/* Page Numbers - Show max 3 pages */}
                      <div className="flex items-center space-x-1">
                        {(() => {
                          const maxVisiblePages = 3;
                          let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                          const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                          
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
                                onClick={() => handlePageChange(Math.max(1, startPage - maxVisiblePages))}
                                className="px-2 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
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
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  currentPage === i
                                    ? 'bg-[#0E364A] text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                                onClick={() => handlePageChange(Math.min(totalPages, endPage + 1))}
                                className="px-2 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                                title="Halaman selanjutnya"
                              >
                                ›
                              </button>
                            );
                          }
                          
                          return pages;
                        })()}
                      </div>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === totalPages
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-[#0E364A] text-white hover:bg-[#1a4a5c]'
                        }`}
                      >
                        Selanjutnya
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Modal Detail Laporan */}
          {showDetailModal && selectedReport && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-[#A8C8E1] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-[#6B8CAE] rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h2 className="text-lg font-semibold text-[#2C3E50]">
                        Detail Laporan
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="text-[#2C3E50] hover:text-gray-700 text-xl font-bold"
                    >
                      ×
                    </button>
                  </div>

                  {/* Kode Laporan */}
                  <div className="mb-4">
                    <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                      Kode laporan :
                    </label>
                    <p className="text-gray-800 bg-white/50 p-2 rounded">
                      {selectedReport.kodeLaporan}
                    </p>
                  </div>

                  {/* Nama Perawat Yang Menangani */}
                  <div className="mb-4">
                    <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                      Nama perawat yang menangani :
                    </label>
                    <p className="text-gray-800 bg-white/50 p-2 rounded">
                      {selectedReport.namaPerawatYangMenangani}
                    </p>
                  </div>

                  {/* Nama Ruangan Perawat Yang Menangani */}
                  <div className="mb-4">
                    <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                      Nama ruangan perawat yang menangani :
                    </label>
                    <p className="text-gray-800 bg-white/50 p-2 rounded">
                      {selectedReport.namaRuanganPerawatYangMenangani}
                    </p>
                  </div>

                  {/* Nama Pasien */}
                  <div className="mb-4">
                    <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                      Nama pasien :
                    </label>
                    <p className="text-gray-800 bg-white/50 p-2 rounded">
                      {selectedReport.namaPasien}
                    </p>
                  </div>

                  {/* No RM */}
                  <div className="mb-4">
                    <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                      No RM :
                    </label>
                    <p className="text-gray-800 bg-white/50 p-2 rounded">
                      {selectedReport.noRm}
                    </p>
                  </div>

                  {/* Umur */}
                  <div className="mb-4">
                    <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                      Umur :
                    </label>
                    <p className="text-gray-800 bg-white/50 p-2 rounded">
                      {selectedReport.umur}
                    </p>
                  </div>

                  {/* Jenis Kelamin */}
                  <div className="mb-4">
                    <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                      Jenis kelamin :
                    </label>
                    <p className="text-gray-800 bg-white/50 p-2 rounded">
                      {selectedReport.jenisKelamin}
                    </p>
                  </div>

                  {/* Tanggal Masuk RS */}
                  <div className="mb-4">
                    <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                      Tanggal masuk RS :
                    </label>
                    <p className="text-gray-800 bg-white/50 p-2 rounded">
                      {selectedReport.tanggalMasukRs}
                    </p>
                  </div>

                  {/* Unit Yang Melaporkan */}
                  <div className="mb-4">
                    <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                      Unit yang melaporkan :
                    </label>
                    <p className="text-gray-800 bg-white/50 p-2 rounded">
                      {selectedReport.unitYangMelaporkan}
                    </p>
                  </div>

                  {/* Lokasi Kejadian */}
                  <div className="mb-4">
                    <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                      Lokasi kejadian :
                    </label>
                    <p className="text-gray-800 bg-white/50 p-2 rounded">
                      {selectedReport.lokasiKejadian}
                    </p>
                  </div>

                  {/* Tanggal Insiden */}
                  <div className="mb-4">
                    <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                      Tanggal insiden :
                    </label>
                    <p className="text-gray-800 bg-white/50 p-2 rounded">
                      {formatTanggal(selectedReport.tanggalInsiden)}
                    </p>
                  </div>

                  {/* Yang Dilaporkan */}
                  <div>
                    <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                      Yang Dilaporkan :
                    </label>
                    <p className="text-gray-800 bg-white/50 p-2 rounded">
                      {selectedReport.yangDilaporkan}
                    </p>
                  </div>

                  {/* Judul Insiden */}
                  <div className="mb-4">
                    <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                      Judul insiden :
                    </label>
                    <p className="text-gray-800 bg-white/50 p-2 rounded">
                      {selectedReport.judulInsiden}
                    </p>
                  </div>

                  {/* Kronologi */}
                  <div className="mb-4">
                    <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                      Kronologi :
                    </label>
                    <p className="text-gray-800 bg-white/50 p-2 rounded">
                      {selectedReport.kronologi}
                    </p>
                  </div>

                  {/* Tindakan Awal */}
                  <div className="mb-4">
                    <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                      Tindakan awal :
                    </label>
                    <p className="text-gray-800 bg-white/50 p-2 rounded">
                      {selectedReport.tindakanAwal}
                    </p>
                  </div>

                  {/* Tindakan Oleh */}
                  <div className="mb-4">
                    <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                      Tindakan oleh :
                    </label>
                    <p className="text-gray-800 bg-white/50 p-2 rounded">
                      {selectedReport.tindakanOleh}
                    </p>
                  </div>

                  {/* Dampak */}
                  <div className="mb-4">
                    <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                      Dampak :
                    </label>
                    <p className="text-gray-800 bg-white/50 p-2 rounded">
                      {selectedReport.dampak}
                    </p>
                  </div>

                  {/* Probablitas */}
                  <div className="mb-4">
                    <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                      Probablitas :
                    </label>
                    <p className="text-gray-800 bg-white/50 p-2 rounded">
                      {selectedReport.probablitas}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="mb-4">
                    <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                      Status :
                    </label>
                    <p className="text-gray-800 bg-white/50 p-2 rounded">
                      {selectedReport.status}
                    </p>
                  </div>

                  {/* Grading */}
                  <div className="mb-4">
                    <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                      Grading :
                    </label>
                    <p className="text-gray-800 bg-white/50 p-2 rounded">
                      {selectedReport.grading}
                    </p>
                  </div>

                  {/* Kategori */}
                  <div className="mb-4">
                    <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                      Kategori :
                    </label>
                    <p className="text-gray-800 bg-white/50 p-2 rounded">
                      {selectedReport.kategori}
                    </p>
                  </div>

                  {/* Rekomendasi Tindakan */}
                  <div className="mb-4">
                    <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                      Rekomendasi tindakan :
                    </label>
                    <p className="text-gray-800 bg-white/50 p-2 rounded">
                      {selectedReport.rekomendasiTindakan}
                    </p>
                  </div>

                  {/* Tanggal Waktu Pelaporan */}
                  <div className="mb-4">
                    <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                      Tanggal waktu pelaporan :
                    </label>
                    <p className="text-gray-800 bg-white/50 p-2 rounded">
                      {formatTanggal(selectedReport.tanggalWaktuPelaporan)}
                    </p>
                  </div>
                </div>
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
          <p className="text-xs text-white/80">
            Universitas Hasanuddin
          </p>
        </div>
      </footer>
    </div>
  );
}
