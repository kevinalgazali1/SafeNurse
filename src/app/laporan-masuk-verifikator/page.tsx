"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Image from 'next/image';
import { toast, Toaster } from "react-hot-toast";

interface Report {
  id: string;
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

  // tambahan
  historyAksi: {
    id_aksi: string;
    aksi: string;
    kategori: string;
    grading: string;
    rekomendasi_tindakan: string;
    [key: string]: any; // jaga-jaga ada field tambahan
  }[];

  historyCatatan: {
    id_catatan: string;
    catatan: string;
    created_at: string;
  }[];

  validasiKepalaRuangan: {
    kategori: string;
    grading: string;
    rekomendasiTindakan: string;
    catatan: string;
  };
  validasiChiefNursing: {
    kategori: string;
    grading: string;
    rekomendasiTindakan: string;
    catatan: string;
  };
}

interface ReportDetail extends Report {
  namaRuanganPerawatYangMenangani: string;
  namaPasien: string;
  noRm: string;
  umur: string;
  jenisKelamin: string;
  tanggalMasukRs: string;
  unitYangMelaporkan: string;
  lokasiKejadian: string;
  tanggalInsiden: string;
  kronologi: string;
  tindakanAwal: string;
  tindakanOleh: string;
  dampak: string;
  probablitas: string;
  status: string;
  grading: string;
  kategori: string;
  rekomendasiTindakan: string;

  // tambahan
  historyAksi: {
    id_aksi: string;
    aksi: string;
    kategori: string;
    grading: string;
    rekomendasi_tindakan: string;
    [key: string]: any; // jaga-jaga ada field tambahan
  }[];

  historyCatatan: {
    id_catatan: string;
    catatan: string;
    created_at: string;
  }[];
}

export default function LaporanMasukVerifikator() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [catatan, setCatatan] = useState("");
  const [showRevisiModal, setShowRevisiModal] = useState(false);
  const [showRiwayatModal, setShowRiwayatModal] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedGrading, setSelectedGrading] = useState("");
  const [catatanRevisi, setCatatanRevisi] = useState("");
  const [tindakanAwal, setTindakanAwal] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk modal validasi
  const [showValidasiModal, setShowValidasiModal] = useState(false);
  const [alasanValidasi, setAlasanValidasi] = useState("");

  // CSS Keyframes untuk animasi
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
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
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
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

      @keyframes textGlow {
        0%, 100% {
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
        }
        50% {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
        }
      }

      @keyframes glow {
        0%, 100% {
          box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
        }
        50% {
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
        }
      }

      @keyframes pulseGentle {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }

      @keyframes bounceSubtle {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-3px);
        }
      }

      @keyframes fadeInDelayed {
        0% {
          opacity: 0;
          transform: translateY(20px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeInDelayed2 {
        0% {
          opacity: 0;
          transform: translateX(-20px);
        }
        100% {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .animate-slideDown {
        animation: slideDown 0.6s ease-out;
      }

      .animate-scaleIn {
        animation: scaleIn 0.5s ease-out;
      }

      .animate-float {
        animation: float 6s ease-in-out infinite;
      }

      .animate-fadeInUp {
        animation: fadeInUp 0.8s ease-out;
      }

      .animate-fadeInRight {
        animation: fadeInRight 0.8s ease-out;
      }

      .animate-textGlow {
        animation: textGlow 2s ease-in-out infinite;
      }

      .animate-glow {
        animation: glow 2s ease-in-out infinite;
      }

      .animate-pulseGentle {
        animation: pulseGentle 2s ease-in-out infinite;
      }

      .animate-bounceSubtle {
        animation: bounceSubtle 1s ease-in-out infinite;
      }

      .animate-fadeInDelayed {
        animation: fadeInDelayed 0.8s ease-out;
      }

      .animate-fadeInDelayed2 {
        animation: fadeInDelayed2 0.8s ease-out;
      }

      .hover-lift {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .hover-lift:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const token = Cookies.get("token");

  // === Ambil data ringkas laporan masuk ===
  const fetchReports = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
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
      console.log(resData);

      const mappedReports = resData.data.map((r: any) => ({
        id: r.kode_laporan,
        kodeLaporan: r.kode_laporan,
        judulInsiden: r.judul_insiden,
        namaPerawatYangMenangani: r.perawat?.nama_perawat || "-",
        tanggalWaktuPelaporan: r.tgl_waktu_pelaporan,
      }));

      setReports(mappedReports);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // === Ambil detail berdasarkan kode laporan ===
  const fetchReportDetail = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/laporan/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Gagal mengambil detail laporan");
      const resData = await res.json();
      console.log("Detail response:", resData);

      const r = resData.data;

      const detail: ReportDetail = {
        id: r.id || r.kode_laporan || "-",
        kode: r.kode || r.kode_laporan || "-",
        kodeLaporan: r.kode_laporan || "-",
        judulInsiden: r.judul_insiden || "-",
        namaPerawatYangMenangani: r.perawat.nama_perawat || "-",
        tanggalWaktuPelaporan: r.tgl_waktu_pelaporan || "-",
        namaRuanganPerawatYangMenangani: r.ruangan.nama_ruangan || "-",
        namaPasien: r.nama_pasien || "-",
        noRm: r.no_rm || "-",
        umur: r.umur || "-",
        jenisKelamin: r.jenis_kelamin || "-",
        tanggalMasukRs: r.tgl_msk_rs || "-",
        unitYangMelaporkan: r.unit_yang_melaporkan || "-",
        lokasiKejadian: r.lokasi_insiden || "-",
        tanggalInsiden: r.tgl_insiden || "-",
        yangDilaporkan: "-",
        kronologi: r.kronologi || "-",
        tindakanAwal: r.tindakan_awal || "-",
        tindakanOleh: r.tindakan_oleh || "-",
        dampak: r.dampak || "-",
        probablitas: r.probabilitas || "-",
        rekomendasiTindakan: r.rekomendasi_tindakan || "-",
        status: r.status || "-",
        grading: r.grading || "-",
        kategori: r.kategori || "-",
        tanggal: r.tanggal || "-",
        catatanKepalaRuangan: r.catatan_kepala_ruangan || "-",
        catatanChiefnursing: r.catatan_chiefnursing || "-",
        catatanVerifikator: r.catatan_verifikator || "-",

        // tambahan
        historyAksi: r.history_aksi || [],
        historyCatatan: r.history_catatan || [],

        validasiKepalaRuangan: {
          kategori: r.validasi_kepala_ruangan?.kategori || "-",
          grading: r.validasi_kepala_ruangan?.grading || "-",
          rekomendasiTindakan:
            r.validasi_kepala_ruangan?.rekomendasi_tindakan || "-",
          catatan: r.validasi_kepala_ruangan?.catatan || "-",
        },
        validasiChiefNursing: {
          kategori: r.validasi_chief_nursing?.kategori || "-",
          grading: r.validasi_chief_nursing?.grading || "-",
          rekomendasiTindakan:
            r.validasi_chief_nursing?.rekomendasi_tindakan || "-",
          catatan: r.validasi_chief_nursing?.catatan || "-",
        },
      };

      setSelectedReport(detail);
      setShowModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
    setCatatan("");
  };

  const handleCloseRiwayatModal = () => {
    setShowRiwayatModal(false);
  };

  const handleValidasi = () => {
    setShowValidasiModal(true);
    setAlasanValidasi("");
  };

  const handleCloseValidasiModal = () => {
    setShowValidasiModal(false);
    setAlasanValidasi("");
  };

  const handleKonfirmasiValidasi = async () => {
    if (!selectedReport) return;
    
    // Validasi alasan wajib diisi
    if (!alasanValidasi.trim()) {
      toast.error("Alasan validasi wajib diisi!");
      return;
    }

    const reportId = selectedReport.id;

    try {
      // Kirim validasi laporan
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/laporan/approve/${reportId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Gagal memvalidasi laporan");
      }

      // Kirim alasan validasi sebagai catatan
      const catatanRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/laporan/addCatatan/${reportId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            catatan: alasanValidasi,
          }),
        }
      );

      if (!catatanRes.ok) {
        console.warn("Gagal mengirim alasan validasi, tapi validasi berhasil");
      }

      console.log("✅ Validasi berhasil");

      // Refresh data laporan
      await fetchReports();

      handleCloseModal();
      handleCloseValidasiModal();
      toast.success("Laporan berhasil divalidasi dengan alasan!");
    } catch (err: any) {
      console.error("❌ Error validasi:", err.message);
      toast.error(err.message || "Terjadi kesalahan saat validasi laporan");
    }
  };

  const handleRevisi = () => {
    setShowRevisiModal(true);
    setSelectedKategori("");
    setSelectedGrading("");
    setCatatanRevisi("");
    setTindakanAwal("");
  };

  const handleCloseRevisiModal = () => {
    setShowRevisiModal(false);
    setSelectedKategori("");
    setSelectedGrading("");
    setCatatanRevisi("");
    setTindakanAwal("");
  };

  const handleKirimRevisi = async () => {
    if (!selectedReport) return;

    // Validasi catatan wajib diisi
    if (!catatanRevisi.trim()) {
      toast.error("Catatan wajib diisi sebelum mengirim revisi!");
      return;
    }

    const reportId = selectedReport.id; // sekarang pasti string (LAP-xxxx)
    try {
      // Kirim revisi laporan
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/laporan/revisi/${reportId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            kategori: selectedKategori,
            grading: selectedGrading,
            rekomendasi_tindakan: tindakanAwal,
          }),
        }
      );

      if (!res.ok) throw new Error("Gagal mengirim revisi");

      // Kirim catatan revisi
      const catatanRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/laporan/addCatatan/${reportId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            catatan: catatanRevisi,
          }),
        }
      );

      if (!catatanRes.ok) throw new Error("Gagal mengirim catatan revisi");

      const resData = await res.json();
      console.log("Revisi berhasil:", resData);

      // Refresh list laporan agar perubahan terlihat
      await fetchReports();

      // Tutup modal setelah berhasil
      handleCloseRevisiModal();
      handleCloseModal();

      // Notifikasi sederhana
      toast.success("Revisi dan catatan berhasil dikirim!");
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengirim revisi. Silakan coba lagi.");
    }
  };

  const handleKirimCatatan = async () => {
    if (!selectedReport) return;

    const reportId = selectedReport.id;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/laporan/addCatatan/${reportId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ catatan }),
        }
      );

      if (!res.ok) {
        throw new Error("Gagal mengirim catatan");
      }

      const data = await res.json();
      console.log("Catatan berhasil dikirim:", data);

      // reset input catatan setelah berhasil
      setCatatan("");
      handleCloseModal();

      // kalau mau refresh data laporan
      // await fetchReportDetail(selectedReport.kodeLaporan);
    } catch (error) {
      console.error("Error saat kirim catatan:", error);
    }
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
                Memuat Data Laporan Masuk...
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
          <div className="bg-[#d9f0f6] min-h-screen flex flex-col">
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
                  {/* Dashboard */}
                  <button
                    className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
                    onClick={() =>
                      (window.location.href = "/dashboard-verifikator")
                    }
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
                    className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors relative"
                    onClick={() =>
                      (window.location.href = "/notifications-verifikator")
                    }
                  >
                    <div className="relative">
                      <i className="fas fa-bell text-lg mb-1"></i>
                      {/* Notification Count Badge */}
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        3
                      </span>
                    </div>
                    <span className="text-xs">Notifikasi</span>
                  </button>

                  {/* Laporan Masuk - Active */}
                  <button className="flex flex-col items-center text-[#0B7A95] transition-colors">
                    <i className="fas fa-envelope text-lg mb-1"></i>
                    <span className="text-xs">Laporan Masuk</span>
                  </button>

                  {/* Manage Profil */}
                  <button
                    className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
                    onClick={() =>
                      (window.location.href = "/profile-verifikator")
                    }
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
                      className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded relative"
                      onClick={() =>
                        (window.location.href = "/notifications-verifikator")
                      }
                    >
                      <div className="relative">
                        <i className="fas fa-bell text-lg mr-3"></i>
                        {/* Notification Count Badge */}
                        <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                          3
                        </span>
                      </div>
                      <span>Notifikasi</span>
                    </button>

                    {/* Laporan Masuk - Active */}
                    <button className="flex items-center text-[#0B7A95] transition-colors p-2 rounded">
                      <i className="fas fa-envelope text-lg mr-3"></i>
                      <span>Laporan Masuk</span>
                    </button>

                    {/* Manage Profil */}
                    <button
                      className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                      onClick={() =>
                        (window.location.href = "/profile-verifikator")
                      }
                    >
                      <i className="fas fa-user text-lg mr-3"></i>
                      <span>Profil</span>
                    </button>
                  </div>
                </div>
              )}
            </header>

            {/* Main Content */}
            <main className="flex-1 px-4 sm:px-6 py-4 sm:py-6 animate-slideDown">
              {/* Background Pattern */}
              <div
                className="relative rounded-xl p-4 sm:p-8 h-full animate-scaleIn"
                style={{
                  background:
                    "linear-gradient(180deg, #b9dce3 0%, #0a7a9a 100%)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none rounded-xl animate-float"
                  style={{
                    backgroundImage: `url('/bgperawat.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                ></div>

                {/* Content Container */}
                <div className="relative z-10">
                  {/* Page Title */}
                  <div className="mb-6 sm:mb-8 animate-fadeInUp">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 animate-textGlow">
                      Daftar Laporan Masuk
                    </h2>
                  </div>

                  {/* Reports List */}
                  <div className="space-y-3 sm:space-y-4 animate-fadeInRight">
                    {reports.map((report, index) => (
                      <div
                        key={report.id}
                        className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-3 sm:p-6 hover:bg-white/95 transition-colors cursor-pointer hover-lift animate-glow ${
                          index === 0
                            ? "animate-fadeInDelayed"
                            : index === 1
                            ? "animate-fadeInDelayed2"
                            : "animate-fadeInDelayed"
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => fetchReportDetail(report.id)}
                      >
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div className="bg-[#0B7A95] p-2 sm:p-3 rounded-lg flex-shrink-0 animate-pulseGentle">
                            <i className="fas fa-envelope text-white text-sm sm:text-lg animate-bounceSubtle"></i>
                          </div>
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-1 leading-tight">
                              Laporan dari Perawat{" "}
                              {report.namaPerawatYangMenangani}
                            </h3>

                            <div className="space-y-1">
                              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                <span className="font-medium">
                                  Judul Insiden:
                                </span>{" "}
                                {report.judulInsiden}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                <span className="font-medium">
                                  Tanggal Laporan:
                                </span>{" "}
                                {report.tanggalWaktuPelaporan}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </main>

            {/* Modal Detail Laporan */}
            {showModal && selectedReport && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                <div className="bg-[#A8C8D8] rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative mx-2 sm:mx-0">
                  {/* Header Modal */}
                  <div className="bg-[#6B8CAE] rounded-t-2xl p-3 sm:p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="bg-white p-1.5 sm:p-2 rounded-lg">
                        <i className="fas fa-envelope text-[#6B8CAE] text-sm sm:text-lg"></i>
                      </div>
                      <h2 className="text-white font-bold text-sm sm:text-lg">
                        Detail Laporan
                      </h2>
                    </div>
                    <button
                      onClick={handleCloseModal}
                      className="text-white hover:text-gray-200 transition-colors"
                    >
                      <i className="fas fa-times text-lg sm:text-xl"></i>
                    </button>
                  </div>

                  {/* Content Modal */}
                  <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    {/* Kode laporan */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                        Kode laporan :
                      </label>
                      <p className="text-gray-800 bg-white/50 p-2 rounded">
                        {selectedReport.kodeLaporan}
                      </p>
                    </div>

                    {/* Nama perawat yang menangani */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                        Nama perawat yang menangani :
                      </label>
                      <p className="text-gray-800 bg-white/50 p-2 rounded">
                        {selectedReport.namaPerawatYangMenangani}
                      </p>
                    </div>

                    {/* nama ruangan perawat yang menangani */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                        nama ruangan perawat yang menangani :
                      </label>
                      <p className="text-gray-800 bg-white/50 p-2 rounded">
                        {selectedReport.namaRuanganPerawatYangMenangani}
                      </p>
                    </div>

                    {/* nama pasien */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                        nama pasien :
                      </label>
                      <p className="text-gray-800 bg-white/50 p-2 rounded">
                        {selectedReport.namaPasien}
                      </p>
                    </div>

                    {/* no rm */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                        no rm :
                      </label>
                      <p className="text-gray-800 bg-white/50 p-2 rounded">
                        {selectedReport.noRm}
                      </p>
                    </div>

                    {/* umur */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                        umur :
                      </label>
                      <p className="text-gray-800 bg-white/50 p-2 rounded">
                        {selectedReport.umur}
                      </p>
                    </div>

                    {/* jenis kelamin */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                        jenis kelamin :
                      </label>
                      <p className="text-gray-800 bg-white/50 p-2 rounded">
                        {selectedReport.jenisKelamin}
                      </p>
                    </div>

                    {/* tanggal masuk rs */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                        tanggal masuk rs :
                      </label>
                      <p className="text-gray-800 bg-white/50 p-2 rounded">
                        {selectedReport.tanggalMasukRs}
                      </p>
                    </div>

                    {/* unit yang melaporkan */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                        unit yang melaporkan :
                      </label>
                      <p className="text-gray-800 bg-white/50 p-2 rounded">
                        {selectedReport.unitYangMelaporkan}
                      </p>
                    </div>

                    {/* lokasi kejadian */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                        lokasi kejadian :
                      </label>
                      <p className="text-gray-800 bg-white/50 p-2 rounded">
                        {selectedReport.lokasiKejadian}
                      </p>
                    </div>

                    {/* tanggal insiden */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                        tanggal insiden :
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

                    {/* judul insiden */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                        judul insiden :
                      </label>
                      <p className="text-gray-800 bg-white/50 p-2 rounded">
                        {selectedReport.judulInsiden}
                      </p>
                    </div>

                    {/* kronologi */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                        kronologi :
                      </label>
                      <p className="text-gray-800 bg-white/50 p-2 rounded">
                        {selectedReport.kronologi}
                      </p>
                    </div>

                    {/* tindakan awal */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                        tindakan awal :
                      </label>
                      <p className="text-gray-800 bg-white/50 p-2 rounded">
                        {selectedReport.tindakanAwal}
                      </p>
                    </div>

                    {/* tindakan oleh */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                        tindakan oleh :
                      </label>
                      <p className="text-gray-800 bg-white/50 p-2 rounded">
                        {selectedReport.tindakanOleh}
                      </p>
                    </div>

                    {/* dampak */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                        dampak :
                      </label>
                      <p className="text-gray-800 bg-white/50 p-2 rounded">
                        {selectedReport.dampak}
                      </p>
                    </div>

                    {/* probablitas */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                        probablitas :
                      </label>
                      <p className="text-gray-800 bg-white/50 p-2 rounded">
                        {selectedReport.probablitas}
                      </p>
                    </div>

                    {/* status */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                        status :
                      </label>
                      <p className="text-gray-800 bg-white/50 p-2 rounded">
                        {selectedReport.status}
                      </p>
                    </div>

                    {/* grading */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                        grading :
                      </label>
                      <p className="text-gray-800 bg-white/50 p-2 rounded">
                        {selectedReport.grading}
                      </p>
                    </div>

                    {/* kategori */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                        kategori :
                      </label>
                      <p className="text-gray-800 bg-white/50 p-2 rounded">
                        {selectedReport.kategori}
                      </p>
                    </div>

                    {/* rekomendasi tindakan */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                        rekomendasi tindakan :
                      </label>
                      <p className="text-gray-800 bg-white/50 p-2 rounded">
                        {selectedReport.rekomendasiTindakan}
                      </p>
                    </div>

                    {/* tanggal waktu pelaporan */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                        tanggal waktu pelaporan :
                      </label>
                      <p className="text-gray-800 bg-white/50 p-2 rounded">
                        {formatTanggal(selectedReport.tanggalWaktuPelaporan)}
                      </p>
                    </div>

                    {/* Validasi Kepala Ruangan */}
                    <div className="bg-white/30 p-4 rounded-lg mt-4">
                      <h3 className="text-[#2C3E50] font-bold mb-3 text-base">
                        Validasi Kepala Ruangan
                      </h3>

                      <div className="mb-3">
                        <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                          Kategori:
                        </label>
                        <p className="text-gray-800 bg-white/50 p-2 rounded text-sm">
                          {selectedReport.validasiKepalaRuangan.kategori}
                        </p>
                      </div>

                      <div className="mb-3">
                        <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                          Grading:
                        </label>
                        <p className="text-gray-800 bg-white/50 p-2 rounded text-sm">
                          {selectedReport.validasiKepalaRuangan.grading}
                        </p>
                      </div>

                      <div className="mb-3">
                        <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                          Rekomendasi Tindakan:
                        </label>
                        <p className="text-gray-800 bg-white/50 p-2 rounded text-sm">
                          {
                            selectedReport.validasiKepalaRuangan
                              .rekomendasiTindakan
                          }
                        </p>
                      </div>

                      <div>
                        <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                          Catatan:
                        </label>
                        <p className="text-gray-800 bg-white/50 p-2 rounded text-sm">
                          {selectedReport.validasiKepalaRuangan.catatan}
                        </p>
                      </div>
                    </div>

                    {/* Validasi Chief Nursing */}
                    <div className="bg-white/30 p-4 rounded-lg mt-4">
                      <h3 className="text-[#2C3E50] font-bold mb-3 text-base">
                        Validasi Chief Nursing
                      </h3>

                      <div className="mb-3">
                        <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                          Kategori:
                        </label>
                        <p className="text-gray-800 bg-white/50 p-2 rounded text-sm">
                          {selectedReport.validasiChiefNursing.kategori}
                        </p>
                      </div>

                      <div className="mb-3">
                        <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                          Grading:
                        </label>
                        <p className="text-gray-800 bg-white/50 p-2 rounded text-sm">
                          {selectedReport.validasiChiefNursing.grading}
                        </p>
                      </div>

                      <div className="mb-3">
                        <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                          Rekomendasi Tindakan:
                        </label>
                        <p className="text-gray-800 bg-white/50 p-2 rounded text-sm">
                          {
                            selectedReport.validasiChiefNursing
                              .rekomendasiTindakan
                          }
                        </p>
                      </div>

                      <div>
                        <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                          Catatan:
                        </label>
                        <p className="text-gray-800 bg-white/50 p-2 rounded text-sm">
                          {selectedReport.validasiChiefNursing.catatan}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons - Moved above Catatan */}
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 justify-center pt-4 pb-4">
                      <button
                        onClick={handleValidasi}
                        className="bg-[#28a745] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-[#218838] transition-colors font-medium text-sm w-full sm:w-auto"
                      >
                        Validasi
                      </button>
                      <button
                        onClick={handleRevisi}
                        className="bg-[#ffc107] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-[#e0a800] transition-colors font-medium text-sm w-full sm:w-auto"
                      >
                        Revisi
                      </button>
                      <button
                        onClick={() => setShowRiwayatModal(true)}
                        className="bg-[#6B8CAE] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-[#5a7a9a] transition-colors font-medium text-sm w-full sm:w-auto"
                      >
                        Riwayat
                      </button>
                    </div>

                    {/* Catatan */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-2 text-sm">
                        Catatan :
                      </label>
                      <textarea
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#6B8CAE] bg-white text-gray-800 resize-none text-sm"
                        rows={3}
                        placeholder="Tambahkan catatan..."
                      />
                    </div>

                    {/* Kirim Catatan Button */}
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={handleKirimCatatan}
                        className="bg-[#0B7A95] text-white px-6 sm:px-8 py-2 rounded-lg hover:bg-[#0a6b85] transition-colors font-medium text-sm"
                      >
                        Kirim Catatan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Revisi Laporan */}
            {showRevisiModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                <div className="bg-[#A8C8E1] rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
                  <div className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#6B8CAE] rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </div>
                        <h2 className="text-sm sm:text-lg font-semibold text-[#2C3E50]">
                          Revisi Laporan
                        </h2>
                      </div>
                      <button
                        onClick={handleCloseRevisiModal}
                        className="text-[#2C3E50] hover:text-gray-700 text-lg sm:text-xl font-bold"
                      >
                        ×
                      </button>
                    </div>

                    {/* Kategori */}
                    <div className="mb-4 sm:mb-6">
                      <label className="block text-[#2C3E50] font-medium mb-2 sm:mb-3 text-sm">
                        Kategori :
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["KTD", "KPC", "KNC", "KTC", "Sentinel"].map(
                          (kategori) => (
                            <button
                              key={kategori}
                              onClick={() => setSelectedKategori(kategori)}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                selectedKategori === kategori
                                  ? "bg-[#2C3E50] text-white"
                                  : "bg-white/70 text-[#2C3E50] hover:bg-white/90"
                              }`}
                            >
                              {kategori}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Grading */}
                    <div className="mb-6">
                      <label className="block text-[#2C3E50] font-medium mb-3 text-sm">
                        Grading :
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { name: "merah", color: "bg-red-500" },
                          { name: "kuning", color: "bg-yellow-500" },
                          { name: "hijau", color: "bg-green-500" },
                          { name: "biru", color: "bg-blue-500" },
                        ].map((grading) => (
                          <button
                            key={grading.name}
                            onClick={() => setSelectedGrading(grading.name)}
                            className={`px-4 py-2 rounded-full text-sm font-medium text-white transition-colors ${
                              selectedGrading === grading.name
                                ? `${grading.color} ring-2 ring-[#2C3E50]`
                                : `${grading.color} opacity-70 hover:opacity-100`
                            }`}
                          >
                            {grading.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tindakan Awal */}
                    <div className="mb-6">
                      <label className="block text-[#2C3E50] font-medium mb-2 text-sm">
                        Tindakan awal :
                      </label>
                      <textarea
                        value={tindakanAwal}
                        onChange={(e) => setTindakanAwal(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#6B8CAE] bg-white text-gray-800 resize-none"
                        rows={3}
                        placeholder="Masukkan tindakan awal..."
                      />
                    </div>

                    {/* Catatan */}
                    <div className="mb-6">
                      <label className="block text-[#2C3E50] font-medium mb-2 text-sm">
                        Catatan <span className="text-red-500">*</span> :
                      </label>
                      <textarea
                        value={catatanRevisi}
                        onChange={(e) => setCatatanRevisi(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#6B8CAE] bg-white text-gray-800 resize-none"
                        rows={3}
                        placeholder="Catatan wajib diisi sebelum mengirim revisi..."
                        required
                      />
                    </div>

                    {/* Tombol Kirim Revisi */}
                    <div className="flex justify-center">
                      <button
                        onClick={handleKirimRevisi}
                        className={`px-6 py-2 rounded-lg transition-colors font-medium text-sm ${
                          !catatanRevisi.trim()
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-[#0B7A95] text-white hover:bg-[#0a6b85]'
                        }`}
                        disabled={!catatanRevisi.trim()}
                      >
                        Kirim Revisi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Riwayat */}
            {showRiwayatModal && selectedReport && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-[#A8C8D8] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
                  {/* Header Modal */}
                  <div className="bg-[#6B8CAE] rounded-t-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white p-2 rounded-lg">
                        <i className="fas fa-history text-[#6B8CAE] text-lg"></i>
                      </div>
                      <h2 className="text-white font-bold text-lg">
                        Riwayat Laporan
                      </h2>
                    </div>
                    <button
                      onClick={handleCloseRiwayatModal}
                      className="text-white hover:text-gray-200 transition-colors"
                    >
                      <i className="fas fa-times text-xl"></i>
                    </button>
                  </div>

                  {/* Content Modal */}
                  <div className="p-6 space-y-6">
                    {/* Tabel Riwayat Catatan */}
                    <div>
                      <h3 className="text-[#2C3E50] font-bold mb-4 text-lg">
                        Riwayat Catatan
                      </h3>

                      {/* Desktop Table */}
                      <div className="bg-white/50 rounded-lg overflow-hidden hidden md:block">
                        <table className="w-full">
                          <thead className="bg-[#6B8CAE] text-white">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium">
                                Tanggal
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium">
                                Catatan
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {selectedReport.historyCatatan?.length > 0 ? (
                              selectedReport.historyCatatan.map((item) => (
                                <tr key={item.id_catatan}>
                                  <td className="px-4 py-3 text-sm text-gray-800">
                                    {new Date(item.created_at).toLocaleString(
                                      "id-ID",
                                      {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                      }
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-800">
                                    {item.catatan}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={2}
                                  className="px-4 py-3 text-sm text-gray-500 text-center"
                                >
                                  Belum ada catatan
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Cards */}
                      <div className="md:hidden space-y-3">
                        {selectedReport.historyCatatan?.map((item) => (
                          <div
                            key={item.id_catatan}
                            className="bg-white/50 rounded-lg p-4"
                          >
                            <div className="flex flex-col space-y-2">
                              <div className="flex justify-between items-start">
                                <span className="text-xs text-gray-600 font-medium">
                                  Tanggal
                                </span>
                                <span className="text-sm text-gray-800">
                                  {new Date(item.created_at).toLocaleString(
                                    "id-ID",
                                    {
                                      dateStyle: "medium",
                                      timeStyle: "short",
                                    }
                                  )}
                                </span>
                              </div>
                              <div className="border-t pt-2">
                                <span className="text-xs text-gray-600 font-medium">
                                  Catatan
                                </span>
                                <p className="text-sm text-gray-800 mt-1">
                                  {item.catatan}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tabel Riwayat Tindakan */}
                    <div>
                      <h3 className="text-[#2C3E50] font-bold mb-4 text-lg">
                        Riwayat Tindakan
                      </h3>

                      {/* Desktop Table */}
                      <div className="bg-white/50 rounded-lg overflow-hidden hidden md:block">
                        <table className="w-full">
                          <thead className="bg-[#6B8CAE] text-white">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium">
                                Tanggal
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium">
                                Aksi
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium">
                                Kategori
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium">
                                Grading
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium">
                                Rekomendasi Tindakan
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {selectedReport.historyAksi?.length > 0 ? (
                              selectedReport.historyAksi.map((aksi) => (
                                <tr key={aksi.id_aksi}>
                                  <td className="px-4 py-3 text-sm text-gray-800">
                                    {aksi.created_at
                                      ? new Date(
                                          aksi.created_at
                                        ).toLocaleString("id-ID", {
                                          dateStyle: "medium",
                                          timeStyle: "short",
                                        })
                                      : "-"}
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs ${
                                        aksi.aksi === "validasi"
                                          ? "bg-green-100 text-green-800"
                                          : aksi.aksi === "revisi"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-blue-100 text-blue-800"
                                      }`}
                                    >
                                      {aksi.aksi}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-800">
                                    {aksi.kategori}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-800">
                                    {aksi.grading}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-800">
                                    {aksi.rekomendasi_tindakan}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={5}
                                  className="px-4 py-3 text-sm text-gray-500 text-center"
                                >
                                  Belum ada riwayat tindakan
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Cards */}
                      <div className="md:hidden space-y-3">
                        {selectedReport.historyAksi?.map((aksi) => (
                          <div
                            key={aksi.id_aksi}
                            className="bg-white/50 rounded-lg p-4"
                          >
                            <div className="flex flex-col space-y-3">
                              <div className="flex justify-between items-start">
                                <span className="text-xs text-gray-600 font-medium">
                                  Tanggal
                                </span>
                                <span className="text-sm text-gray-800">
                                  {aksi.created_at
                                    ? new Date(aksi.created_at).toLocaleString(
                                        "id-ID",
                                        {
                                          dateStyle: "medium",
                                          timeStyle: "short",
                                        }
                                      )
                                    : "-"}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <span className="text-xs text-gray-600 font-medium">
                                    Aksi
                                  </span>
                                  <div className="mt-1">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs ${
                                        aksi.aksi === "validasi"
                                          ? "bg-green-100 text-green-800"
                                          : aksi.aksi === "revisi"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-blue-100 text-blue-800"
                                      }`}
                                    >
                                      {aksi.aksi}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-600 font-medium">
                                    Kategori
                                  </span>
                                  <p className="text-sm text-gray-800 mt-1">
                                    {aksi.kategori}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-600 font-medium">
                                    Grading
                                  </span>
                                  <p className="text-sm text-gray-800 mt-1">
                                    {aksi.grading}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-600 font-medium">
                                    Rekomendasi
                                  </span>
                                  <p className="text-sm text-gray-800 mt-1">
                                    {aksi.rekomendasi_tindakan}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Modal Validasi Laporan */}
          {showValidasiModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <div className="bg-[#A8C8D8] rounded-2xl max-w-md w-full mx-2 sm:mx-0">
                {/* Header Modal */}
                <div className="bg-[#6B8CAE] rounded-t-2xl p-3 sm:p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="bg-white p-1.5 sm:p-2 rounded-lg">
                      <i className="fas fa-check-circle text-green-500 text-sm sm:text-lg"></i>
                    </div>
                    <h2 className="text-white font-bold text-sm sm:text-lg">
                      Validasi Laporan
                    </h2>
                  </div>
                  <button
                    onClick={handleCloseValidasiModal}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <i className="fas fa-times text-lg sm:text-xl"></i>
                  </button>
                </div>

                {/* Content Modal */}
                <div className="p-4 sm:p-6 space-y-4">
                  <p className="text-[#2C3E50] font-medium text-sm">
                    Jelaskan alasan kamu memvalidasi laporan ini:
                  </p>

                  <textarea
                    value={alasanValidasi}
                    onChange={(e) => setAlasanValidasi(e.target.value)}
                    placeholder="Masukkan alasan validasi..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#6B8CAE] focus:border-transparent bg-white text-gray-800"
                    rows={4}
                  />

                  <button
                    onClick={handleKonfirmasiValidasi}
                    disabled={!alasanValidasi.trim()}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Validasi
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
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
    </>
  );
}

// ...existing code...
