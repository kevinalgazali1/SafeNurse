"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface JwtPayload {
  role: string;
  exp?: number;
  iat?: number;
}

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

export default function LaporanMasukChiefNursingPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [catatan, setCatatan] = useState("");
  const [showRevisiModal, setShowRevisiModal] = useState(false);
  const [showRiwayatModal, setShowRiwayatModal] = useState(false);
  const [showValidasiModal, setShowValidasiModal] = useState(false);
  const [implementasi, setImplementasi] = useState("");
  const [hasil, setHasil] = useState("");
  const [rencanaTindakLanjut, setRencanaTindakLanjut] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedGrading, setSelectedGrading] = useState("");
  const [catatanRevisi, setCatatanRevisi] = useState("");
  const [kronologi, setKronologi] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(10);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const router = useRouter();
  const token = Cookies.get("token");

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

  // Filter reports based on search query
  const filteredReports = reports.filter((report) =>
    report.kodeLaporan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const startIndex = (currentPage - 1) * reportsPerPage;
  const endIndex = startIndex + reportsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  // === Ambil data ringkas laporan masuk ===
  const fetchReports = async (onlyCount = false) => {
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

      if (onlyCount) {
        // ✅ Kalau cuma mau jumlah
        const count = resData.data?.length || 0;
        setReportCount(count);
        return count;
      } else {
        // ✅ Kalau mau list laporan
        const mappedReports = resData.data.map((r: any) => ({
          id: r.kode_laporan,
          kodeLaporan: r.kode_laporan,
          judulInsiden: r.judul_insiden,
          namaPerawatYangMenangani: r.perawat?.nama_perawat || "-",
          tanggalWaktuPelaporan: r.tgl_waktu_pelaporan,
        }));
        setReports(mappedReports);
        setReportCount(mappedReports.length);
        return mappedReports;
      }
    } catch (err) {
      console.error(err);
      setReportCount(0);
      if (!onlyCount) setReports([]);
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
        yangDilaporkan: r.yang_dilaporkan || "-",
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

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
    setCatatan("");
  };

  const handleCloseRiwayatModal = () => {
    setShowRiwayatModal(false);
  };

  const handleCloseValidasiModal = () => {
    setShowValidasiModal(false);
    setImplementasi("");
    setHasil("");
    setRencanaTindakLanjut("");
  };

  const handleValidasi = () => {
    setShowValidasiModal(true);
  };

  const handleKonfirmasiValidasi = async () => {
    if (!selectedReport) return;

    // Validasi ketiga field harus diisi
    if (!implementasi.trim() || !hasil.trim() || !rencanaTindakLanjut.trim()) {
      toast.error(
        "Mohon isi Implementasi, Hasil, dan Rencana tindak lanjut sebelum validasi!"
      );
      return;
    }

    const reportId = selectedReport.id;

    try {
      // Kirim catatan validasi terlebih dahulu
      // const catatanRes = await fetch(
      //   `${process.env.NEXT_PUBLIC_BACKEND_API}/laporan/addCatatan/${reportId}`,
      //   {
      //     method: "POST",
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       catatan: `Alasan Validasi: ${alasanValidasi}`,
      //     }),
      //   }
      // );

      // if (!catatanRes.ok) {
      //   const errData = await catatanRes.json();
      //   throw new Error(errData.message || "Gagal mengirim catatan validasi");
      // }

      // Lalu approve laporan
      const approveRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/laporan/approve/${reportId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            implementasi,
            hasil,
            rencana_tindak_lanjut: rencanaTindakLanjut,
          }),
        }
      );

      if (!approveRes.ok) {
        const errData = await approveRes.json();
        throw new Error(errData.message || "Gagal memvalidasi laporan");
      }

      const data = await approveRes.json();
      console.log("✅ Validasi berhasil:", data);

      // Refresh data laporan
      await fetchReports();
      await fetchNotifications();

      // Tutup modal dan reset form
      handleCloseValidasiModal();
      handleCloseModal();
      toast.success("Laporan berhasil divalidasi!");
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
    setKronologi("");
  };

  const handleCloseRevisiModal = () => {
    setShowRevisiModal(false);
    setSelectedKategori("");
    setSelectedGrading("");
    setCatatanRevisi("");
    setKronologi("");
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
            kronologi: kronologi,
            catatan: catatanRevisi,
          }),
        }
      );

      if (!res.ok) throw new Error("Gagal mengirim revisi");

      // Kirim catatan revisi
      // const catatanRes = await fetch(
      //   `${process.env.NEXT_PUBLIC_BACKEND_API}/laporan/addCatatan/${reportId}`,
      //   {
      //     method: "POST",
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       catatan: catatanRevisi,
      //     }),
      //   }
      // );

      // if (!catatanRes.ok) throw new Error("Gagal mengirim catatan revisi");

      const resData = await res.json();
      console.log("Revisi berhasil:", resData);

      // Refresh list laporan agar perubahan terlihat
      await fetchReports();
      await fetchNotifications();

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

  // const handleKirimCatatan = async () => {
  //   if (!selectedReport) return;

  //   const reportId = selectedReport.id;

  //   try {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_BACKEND_API}/laporan/addCatatan/${reportId}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({ catatan }),
  //       }
  //     );

  //     if (!res.ok) {
  //       throw new Error("Gagal mengirim catatan");
  //     }

  //     const data = await res.json();
  //     console.log("Catatan berhasil dikirim:", data);

  //     // reset input catatan setelah berhasil
  //     setCatatan("");
  //     handleCloseModal();

  //     // kalau mau refresh data laporan
  //     // await fetchReportDetail(selectedReport.kodeLaporan);
  //   } catch (error) {
  //     console.error("Error saat kirim catatan:", error);
  //   }
  // };

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

  // Fungsi untuk parse tanggal format Indonesia (contoh: "29 November 2025, 15:09 WITA")
  const parseIndonesianDate = (dateString: string): Date | null => {
    if (!dateString || dateString === "-") return null;

    // Mapping nama bulan Indonesia ke angka (0-11 untuk JavaScript Date)
    const bulanMap: { [key: string]: number } = {
      Januari: 0,
      Februari: 1,
      Maret: 2,
      April: 3,
      Mei: 4,
      Juni: 5,
      Juli: 6,
      Agustus: 7,
      September: 8,
      Oktober: 9,
      November: 10,
      Desember: 11,
    };

    try {
      // Hapus "WITA" dan whitespace ekstra
      let cleanedDate = dateString.replace(/WITA/gi, "").trim();

      // Pattern: "29 November 2025, 15:09" atau "9 Desember 2025, 10:13"
      // Regex untuk extract: tanggal, bulan, tahun, jam, menit
      const pattern = /(\d{1,2})\s+(\w+)\s+(\d{4}),?\s+(\d{1,2}):(\d{2})/;
      const match = cleanedDate.match(pattern);

      if (match) {
        const tanggal = parseInt(match[1], 10);
        const namaBulan = match[2];
        const tahun = parseInt(match[3], 10);
        const jam = parseInt(match[4], 10);
        const menit = parseInt(match[5], 10);

        // Cari bulan di mapping
        const bulan = bulanMap[namaBulan];
        if (bulan !== undefined) {
          // Buat Date object dengan komponen yang sudah di-extract
          const parsedDate = new Date(tahun, bulan, tanggal, jam, menit, 0, 0);
          return parsedDate;
        }
      }

      // Fallback: coba dengan new Date langsung (untuk format ISO)
      const isoDate = new Date(dateString);
      if (!isNaN(isoDate.getTime())) {
        return isoDate;
      }

      return null;
    } catch (error) {
      return null;
    }
  };

  // Fungsi untuk mengecek apakah laporan sudah 48 jam atau lebih
  const isReportOver48Hours = (tanggalLaporan: string | undefined): boolean => {
    if (
      !tanggalLaporan ||
      tanggalLaporan === "-" ||
      tanggalLaporan === null ||
      tanggalLaporan === undefined
    ) {
      return false;
    }

    try {
      // Coba parse dengan parser Indonesia dulu
      let reportDate = parseIndonesianDate(tanggalLaporan);

      // Jika gagal, coba dengan new Date langsung (untuk format ISO)
      if (!reportDate) {
        reportDate = new Date(tanggalLaporan);
        if (isNaN(reportDate.getTime())) {
          return false;
        }
      }

      const now = new Date();
      const diffInMs = now.getTime() - reportDate.getTime();
      const diffInHours = diffInMs / (1000 * 60 * 60); // Convert to hours

      return diffInHours >= 48;
    } catch (error) {
      console.error(
        "Error checking report age:",
        error,
        "Date:",
        tanggalLaporan
      );
      return false;
    }
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
          <div className="bg-[#d9f0f6] min-h-screen flex flex-col animate-fadeIn">
            <style jsx>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
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
                0%,
                100% {
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

              @keyframes textGlow {
                0%,
                100% {
                  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
                }
                50% {
                  text-shadow: 0 0 20px rgba(255, 255, 255, 0.8),
                    0 0 30px rgba(255, 255, 255, 0.6);
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

              @keyframes pulseGentle {
                0%,
                100% {
                  transform: scale(1);
                }
                50% {
                  transform: scale(1.05);
                }
              }

              @keyframes bounceSubtle {
                0%,
                100% {
                  transform: translateY(0);
                }
                50% {
                  transform: translateY(-5px);
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
                  transform: translateY(20px);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              @keyframes glow {
                0%,
                100% {
                  box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
                }
                50% {
                  box-shadow: 0 0 20px rgba(255, 255, 255, 0.4),
                    0 0 30px rgba(255, 255, 255, 0.2);
                }
              }

              .animate-fadeIn {
                animation: fadeIn 0.8s ease-out;
              }
              .animate-slideDown {
                animation: slideDown 0.6s ease-out;
              }
              .animate-scaleIn {
                animation: scaleIn 0.5s ease-out;
              }
              .animate-float {
                animation: float 3s ease-in-out infinite;
              }
              .animate-fadeInUp {
                animation: fadeInUp 0.7s ease-out;
              }
              .animate-textGlow {
                animation: textGlow 2s ease-in-out infinite;
              }
              .animate-fadeInRight {
                animation: fadeInRight 0.8s ease-out;
              }
              .animate-pulseGentle {
                animation: pulseGentle 2s ease-in-out infinite;
              }
              .animate-bounceSubtle {
                animation: bounceSubtle 2s ease-in-out infinite;
              }
              .animate-fadeInDelayed {
                animation: fadeInDelayed 0.8s ease-out 0.2s both;
              }
              .animate-fadeInDelayed2 {
                animation: fadeInDelayed2 0.8s ease-out 0.4s both;
              }
              .animate-glow {
                animation: glow 3s ease-in-out infinite;
              }

              .hover-lift:hover {
                transform: translateY(-5px) scale(1.02);
                transition: all 0.3s ease;
              }
            `}</style>
            {/* Header/Navbar */}
            <header className="bg-[#B9D9DD] rounded-xl px-4 sm:px-6 py-3 mx-4 sm:mx-6 mt-4 sm:mt-6">
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
                  {/* Riwayat */}
                  <button
                    className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
                    onClick={() =>
                      (window.location.href = "/dashboard-chiefnursing")
                    }
                  >
                    <i className="fas fa-clipboard-list text-lg mb-1"></i>
                    <span className="text-xs">Riwayat</span>
                  </button>

                  <button
                    className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors relative"
                    onClick={() =>
                      (window.location.href = "/notifications-chiefnursing")
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

                  {/* Laporan Masuk - Active */}
                  <button className="flex flex-col items-center text-[#0B7A95] transition-colors">
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

                  {/* Video Tutorial */}
                  <button
                    className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
                    onClick={() =>
                      (window.location.href = "/video-tutorial-chiefnursing")
                    }
                  >
                    <i className="fas fa-play-circle text-lg mb-1"></i>
                    <span className="text-xs">Tutorial</span>
                  </button>

                  {/* Manage Profil */}
                  <button
                    className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
                    onClick={() =>
                      (window.location.href = "/profile-chiefnursing")
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
                    {/* Riwayat */}
                    <button
                      className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                      onClick={() =>
                        (window.location.href = "/dashboard-chiefnursing")
                      }
                    >
                      <i className="fas fa-history text-lg mr-3"></i>
                      <span>Riwayat</span>
                    </button>

                    {/* Notifikasi */}
                    <button
                      className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded relative"
                      onClick={() =>
                        (window.location.href = "/notifications-chiefnursing")
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

                    {/* Laporan Masuk - Active */}
                    <button className="flex items-center text-[#0B7A95] transition-colors p-2 rounded">
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

                    {/* Video Tutorial */}
                    <button
                      className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                      onClick={() =>
                        (window.location.href = "/video-tutorial-chiefnursing")
                      }
                    >
                      <i className="fas fa-play-circle text-lg mr-3"></i>
                      <span>Tutorial</span>
                    </button>

                    {/* Manage Profil */}
                    <button
                      className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                      onClick={() =>
                        (window.location.href = "/profile-chiefnursing")
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
                  {/* Header with Title and Search */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 animate-fadeInUp space-y-4 sm:space-y-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-white animate-textGlow">
                      Daftar Laporan Masuk
                    </h2>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-auto">
                      <input
                        type="text"
                        placeholder="Cari kode laporan..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full sm:w-64 px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0B7A95] focus:border-[#0B7A95] transition-all duration-200"
                      />
                      <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                  </div>

                  {/* Reports List */}
                  <div className="space-y-3 sm:space-y-4 animate-fadeInRight">
                    {currentReports.length > 0 ? (
                      currentReports.map((report, index) => {
                        // Gunakan tanggalWaktuPelaporan dari report object yang sudah di-mapping dari r.tgl_waktu_pelaporan
                        const tanggalLaporan = report.tanggalWaktuPelaporan;
                        const isOver48Hours =
                          isReportOver48Hours(tanggalLaporan);

                        // Debug log (bisa dihapus setelah testing)
                        if (tanggalLaporan) {
                          console.log(
                            "Report ID:",
                            report.id,
                            "Tanggal:",
                            tanggalLaporan,
                            "IsOver48Hours:",
                            isOver48Hours
                          );
                        }

                        return (
                          <div
                            key={report.id}
                            className={`${
                              isOver48Hours
                                ? "bg-red-500/90 backdrop-blur-sm border-red-600/50 hover:bg-red-500/95"
                                : "bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white/95"
                            } rounded-xl shadow-lg border p-3 sm:p-6 transition-colors cursor-pointer hover-lift animate-glow ${
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
                              <div
                                className={`${
                                  isOver48Hours ? "bg-red-600" : "bg-[#0B7A95]"
                                } p-2 sm:p-3 rounded-lg flex-shrink-0 animate-pulseGentle`}
                              >
                                <i className="fas fa-envelope text-white text-sm sm:text-lg animate-bounceSubtle"></i>
                              </div>
                              <div className="flex-1 min-w-0 overflow-hidden">
                                <h3
                                  className={`text-sm sm:text-lg font-semibold mb-1 leading-tight ${
                                    isOver48Hours
                                      ? "text-white"
                                      : "text-gray-800"
                                  }`}
                                >
                                  Laporan dari Perawat{" "}
                                  {report.namaPerawatYangMenangani}
                                </h3>

                                <div className="space-y-1">
                                  <p
                                    className={`text-xs sm:text-sm leading-relaxed ${
                                      isOver48Hours
                                        ? "text-white/90"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    <span className="font-medium">
                                      Judul Insiden:
                                    </span>{" "}
                                    {report.judulInsiden}
                                  </p>
                                  <p
                                    className={`text-xs sm:text-sm leading-relaxed ${
                                      isOver48Hours
                                        ? "text-white/90"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    <span className="font-medium">
                                      Tanggal Laporan:
                                    </span>{" "}
                                    {report.tanggalWaktuPelaporan}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mx-auto max-w-md">
                          <i className="fas fa-search text-white/70 text-3xl mb-4"></i>
                          <h3 className="text-white font-semibold text-lg mb-2">
                            {searchQuery
                              ? "Tidak ada laporan ditemukan"
                              : "Belum ada laporan"}
                          </h3>
                          <p className="text-white/70 text-sm">
                            {searchQuery
                              ? `Tidak ada laporan dengan kode "${searchQuery}"`
                              : "Belum ada laporan masuk yang perlu ditinjau"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Pagination */}
                    {filteredReports.length > 0 && totalPages > 1 && (
                      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        {/* Pagination Info */}
                        <div className="text-sm text-black font-medium">
                          Menampilkan {startIndex + 1}-
                          {Math.min(endIndex, filteredReports.length)} dari{" "}
                          {filteredReports.length} laporan
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:space-x-2">
                          {/* Previous Button */}
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              currentPage === 1
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-white text-black hover:bg-gray-100"
                            }`}
                          >
                            <span className="hidden sm:inline">Sebelumnya</span>
                            <span className="sm:hidden">‹</span>
                          </button>

                          {/* Page Numbers */}
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                currentPage === page
                                  ? "bg-[#0B7A95] text-white"
                                  : "bg-white text-black hover:bg-gray-100"
                              }`}
                            >
                              {page}
                            </button>
                          ))}

                          {/* Next Button */}
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              currentPage === totalPages
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-white text-black hover:bg-gray-100"
                            }`}
                          >
                            <span className="hidden sm:inline">
                              Selanjutnya
                            </span>
                            <span className="sm:hidden">›</span>
                          </button>
                        </div>
                      </div>
                    )}
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

                    {/* Action Buttons - Grid Layout Desktop, Stack Mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-4 pb-4">
                      <button
                        onClick={handleValidasi}
                        className="bg-[#28a745] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-[#218838] transition-colors font-medium text-sm w-full sm:col-span-2"
                      >
                        Validasi
                      </button>
                      <button
                        onClick={handleRevisi}
                        className="bg-[#ffc107] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-[#e0a800] transition-colors font-medium text-sm w-full"
                      >
                        Revisi
                      </button>
                      <button
                        onClick={() => setShowRiwayatModal(true)}
                        className="bg-[#6B8CAE] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-[#5a7a9a] transition-colors font-medium text-sm w-full"
                      >
                        Riwayat
                      </button>
                    </div>

                    {/* Penjelasan Tombol */}
                    <div className="text-xs text-gray-600 space-y-1 px-2 pb-2">
                      <p>
                        <span className="font-semibold">Validasi:</span> Setujui
                        laporan dan isi implementasi, hasil, serta rencana
                        tindak lanjut.
                      </p>
                      <p>
                        <span className="font-semibold">Revisi:</span> Minta
                        perbaikan laporan dengan mengubah kategori, grading,
                        atau kronologi.
                      </p>
                      <p>
                        <span className="font-semibold">Riwayat:</span> Lihat
                        riwayat perubahan dan catatan pada laporan ini.
                      </p>
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
                        {["KPC", "KNC", "KTC", "KTD", "Sentinel"].map(
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
                          { name: "biru", color: "bg-blue-500" },
                          { name: "hijau", color: "bg-green-500" },
                          { name: "kuning", color: "bg-yellow-500" },
                          { name: "merah", color: "bg-red-500" },
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

                    {/* Kronologi */}
                    <div className="mb-6">
                      <label className="block text-[#2C3E50] font-medium mb-2 text-sm">
                        Kronologi :
                      </label>
                      <textarea
                        value={kronologi}
                        onChange={(e) => setKronologi(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#6B8CAE] bg-white text-gray-800 resize-none"
                        rows={3}
                        placeholder="Masukkan kronologi..."
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
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
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
                    {/* Implementasi */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-2 text-sm">
                        Implementasi :
                      </label>
                      <textarea
                        value={implementasi}
                        onChange={(e) => setImplementasi(e.target.value)}
                        placeholder="Masukkan implementasi..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#6B8CAE] focus:border-transparent bg-white text-gray-800"
                        rows={3}
                      />
                    </div>

                    {/* Hasil */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-2 text-sm">
                        Hasil :
                      </label>
                      <textarea
                        value={hasil}
                        onChange={(e) => setHasil(e.target.value)}
                        placeholder="Masukkan hasil..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#6B8CAE] focus:border-transparent bg-white text-gray-800"
                        rows={3}
                      />
                    </div>

                    {/* Rencana Tindak Lanjut */}
                    <div>
                      <label className="block text-[#2C3E50] font-medium mb-2 text-sm">
                        Rencana tindak lanjut :
                      </label>
                      <textarea
                        value={rencanaTindakLanjut}
                        onChange={(e) => setRencanaTindakLanjut(e.target.value)}
                        placeholder="Masukkan rencana tindak lanjut..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#6B8CAE] focus:border-transparent bg-white text-gray-800"
                        rows={3}
                      />
                    </div>

                    <button
                      onClick={handleKonfirmasiValidasi}
                      disabled={
                        !implementasi.trim() ||
                        !hasil.trim() ||
                        !rencanaTindakLanjut.trim()
                      }
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Validasi
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
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
  );
}
