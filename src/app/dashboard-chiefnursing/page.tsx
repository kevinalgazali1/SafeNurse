"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";

interface Report {
  id: string;
  tanggal: string;
  kategori: string;
  status: string;
  grading: string;
  catatanKepalaRuangan: string;
  catatanChiefnursing: string;
  catatanVerifikator: string;
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

// MobileReportCard Component Interface
interface MobileReportCardProps {
  report: Report;
  onDetailClick: (report: Report) => void;
}

// MobileReportCard Component
function MobileReportCard({ report, onDetailClick }: MobileReportCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Main Card Content */}
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 text-sm mb-1">
              {report.kategori}
            </h3>
            <p className="text-xs text-gray-600">Tanggal: {report.tanggal}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                report.status === "Selesai"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {report.status}
            </span>
            <i
              className={`fas fa-chevron-${
                isExpanded ? "up" : "down"
              } text-gray-400 text-xs`}
            ></i>
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

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Grading:</span>
              <span className="text-gray-800">{report.grading}</span>
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

export default function DashboardChiefNursing() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [catatan, setCatatan] = useState("");
  const [showRevisiModal, setShowRevisiModal] = useState(false);
  const [showRiwayatModal, setShowRiwayatModal] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedGrading, setSelectedGrading] = useState("");
  const [catatanRevisi, setCatatanRevisi] = useState("");
  const [tindakanAwal, setTindakanAwal] = useState("");

  const token = Cookies.get("token");

  const fetchReports = async () => {
    if (!token) return;

    try {
      const res = await fetch(
        "https://safe-nurse-backend.vercel.app/api/laporan/chief_nursing",
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
      console.log("respon ini", resData);

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
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // filter otomatis setiap kali selectedDate berubah
  useEffect(() => {
    if (selectedDate) {
      setFilteredReports(reports.filter((r) => r.tanggal === selectedDate));
    } else {
      setFilteredReports(reports);
    }
  }, [selectedDate, reports]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleDetailClick = async (report: Report) => {
    try {
      if (!token) return;

      const res = await fetch(
        `https://safe-nurse-backend.vercel.app/api/laporan/${report.kodeLaporan}`,
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
      console.log("Detail laporan:", resData);

      // mapping response detail ke state
      const r = resData.data;

      const mappedDetail: Report = {
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
        tanggal: new Date(r.tgl_insiden).toISOString().split("T")[0],

        // isi array dari backend
        historyAksi: r.history_aksi || [],
        historyCatatan: r.history_catatan || [],
      };

      setSelectedReport(mappedDetail);
      setCatatan("");
      setShowDetailModal(true);
    } catch (error) {
      console.error("Error mengambil detail laporan:", error);
    }
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedReport(null);
    setCatatan("");
  };

    const handleRevisi = () => {
    setShowRevisiModal(true);
    setSelectedKategori("");
    setSelectedGrading("");
    setCatatanRevisi("");
    setTindakanAwal("");
  };

  const handleValidasi = async () => {
    if (!selectedReport) return;
    const reportId = selectedReport.id; // contoh: LAP-20250918-4342

    try {
      const res = await fetch(
        `https://safe-nurse-backend.vercel.app/api/laporan/approve/${reportId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // pastikan token valid
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Gagal memvalidasi laporan");
      }

      const data = await res.json();
      console.log("✅ Validasi berhasil:", data);

      // Refresh data laporan biar status ter-update
      await fetchReports();

      handleCloseModal();
      alert("Laporan berhasil divalidasi!");
    } catch (err: any) {
      console.error("❌ Error validasi:", err.message);
      alert(err.message || "Terjadi kesalahan saat validasi laporan");
    }
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

    const reportId = selectedReport.id; // sekarang pasti string (LAP-xxxx)
    try {
      const res = await fetch(
        `https://safe-nurse-backend.vercel.app/api/laporan/revisi/${reportId}`,
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

      const resData = await res.json();
      console.log("Revisi berhasil:", resData);

      // Refresh list laporan agar perubahan terlihat
      await fetchReports();

      // Tutup modal setelah berhasil
      handleCloseRevisiModal();
      handleCloseModal();

      // Notifikasi sederhana
      alert("Revisi berhasil dikirim!");
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim revisi. Silakan coba lagi.");
    }
  };

  const handleRiwayat = () => {
    setShowRiwayatModal(true);
  };

  const handleCloseRiwayatModal = () => {
    setShowRiwayatModal(false);
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

  const handleKirimCatatan = async () => {
    if (!selectedReport) return;

    const reportId = selectedReport.id;

    try {
      const res = await fetch(
        `https://safe-nurse-backend.vercel.app/api/laporan/addCatatan/${reportId}`,
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

  return (
    <div className="bg-[#d9f0f6] min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <header className="bg-[#B9D9DD] rounded-xl mx-6 mt-6">
        <div className="flex justify-between items-center px-6 py-3">
          <h1 className="text-white text-xl font-bold">
            Safe
            <span className="font-bold text-[#0B7A95]">Nurse</span>
          </h1>

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Riwayat Laporan - Active */}
            <button className="flex flex-col items-center text-[#0B7A95] transition-colors">
              <i className="fas fa-clipboard-list text-lg mb-1"></i>
              <span className="text-xs">Riwayat</span>
            </button>

            {/* Notifikasi */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() =>
                (window.location.href = "/notifications-chiefnursing")
              }
            >
              <i className="fas fa-bell text-lg mb-1"></i>
              <span className="text-xs">Notifikasi</span>
            </button>

            {/* Laporan Masuk */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() =>
                (window.location.href = "/laporan-masuk-chiefnursing")
              }
            >
              <i className="fas fa-envelope text-lg mb-1"></i>
              <span className="text-xs">Laporan Masuk</span>
            </button>

            {/* Manage Profil */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() => (window.location.href = "/profile-chiefnursing")}
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
              className="flex items-center text-white hover:text-[#0B7A95] transition-colors py-2"
              onClick={() =>
                (window.location.href = "/notifications-chiefnursing")
              }
            >
              <i className="fas fa-bell text-lg mr-3"></i>
              <span className="text-sm">Notifikasi</span>
            </button>

            {/* Laporan Masuk */}
            <button
              className="flex items-center text-white hover:text-[#0B7A95] transition-colors py-2"
              onClick={() =>
                (window.location.href = "/laporan-masuk-chiefnursing")
              }
            >
              <i className="fas fa-envelope text-lg mr-3"></i>
              <span className="text-sm">Laporan Masuk</span>
            </button>

            {/* Manage Profil */}
            <button
              className="flex items-center text-white hover:text-[#0B7A95] transition-colors py-2"
              onClick={() => (window.location.href = "/profile-chiefnursing")}
            >
              <i className="fas fa-user text-lg mr-3"></i>
              <span className="text-sm">Profil</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-6 py-6">
        <div
          className="bg-white rounded-lg p-6 h-full min-h-screen relative overflow-hidden"
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
            {/* Header section with date picker */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <button
                  className="bg-[#0E364A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:brightness-110 transition"
                  onClick={() => console.log("Pilih Bulan clicked")}
                >
                  Pilih Bulan
                </button>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B7A95] text-black"
                  style={{
                    colorScheme: "light",
                  }}
                />
              </div>
            </div>

            {/* Desktop Table - Hidden on Mobile */}
            <div className="hidden lg:block bg-white rounded-lg overflow-hidden shadow-lg">
              {/* Table Header */}
              <div className="bg-[#0B7A95] text-white">
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
                {filteredReports.length > 0 ? (
                  filteredReports.map((report, index) => (
                    <div
                      key={report.kodeLaporan}
                      className={`grid grid-cols-9 gap-2 px-4 py-3 text-sm ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition-colors`}
                    >
                      <div className="bg-[#0E364A] text-white px-3 py-1 rounded text-center text-xs font-medium">
                        {report.tanggal}
                      </div>
                      <div className="text-gray-600 text-center">
                        {report.kategori}
                      </div>
                      <div className="text-gray-600 text-center">
                        {report.status}
                      </div>
                      <div className="text-gray-600 text-center">
                        {report.grading}
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
            <div className="lg:hidden space-y-4">
              {reports.map((report) => (
                <MobileReportCard
                  key={report.id}
                  report={report}
                  onDetailClick={handleDetailClick}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modal Detail Laporan */}
      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#A8C8D8] rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto relative">
            {/* Header Modal */}
            <div className="bg-[#6B8CAE] rounded-t-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white p-2 rounded-lg">
                  <i className="fas fa-file-alt text-[#6B8CAE] text-lg"></i>
                </div>
                <h2 className="text-white font-bold text-lg">Detail Laporan</h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            {/* Content Modal */}
            <div className="p-6 space-y-4">
              {/* Kode Laporan */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                  Kode Laporan :
                </label>
                <p className="text-gray-800 bg-white/50 p-2 rounded">
                  {selectedReport.kodeLaporan}
                </p>
              </div>

              {/* Nama Perawat Yang Menangani */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                  Nama Perawat Yang Menangani :
                </label>
                <p className="text-gray-800 bg-white/50 p-2 rounded">
                  {selectedReport.namaPerawatYangMenangani}
                </p>
              </div>

              {/* Nama Ruangan Perawat Yang Menangani */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                  Nama Ruangan Perawat Yang Menangani :
                </label>
                <p className="text-gray-800 bg-white/50 p-2 rounded">
                  {selectedReport.namaRuanganPerawatYangMenangani}
                </p>
              </div>

              {/* Nama Pasien */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                  Nama Pasien :
                </label>
                <p className="text-gray-800 bg-white/50 p-2 rounded">
                  {selectedReport.namaPasien}
                </p>
              </div>

              {/* No RM */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                  No RM :
                </label>
                <p className="text-gray-800 bg-white/50 p-2 rounded">
                  {selectedReport.noRm}
                </p>
              </div>

              {/* Umur */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                  Umur :
                </label>
                <p className="text-gray-800 bg-white/50 p-2 rounded">
                  {selectedReport.umur}
                </p>
              </div>

              {/* Jenis Kelamin */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                  Jenis Kelamin :
                </label>
                <p className="text-gray-800 bg-white/50 p-2 rounded">
                  {selectedReport.jenisKelamin}
                </p>
              </div>

              {/* Tanggal Masuk RS */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                  Tanggal Masuk RS :
                </label>
                <p className="text-gray-800 bg-white/50 p-2 rounded">
                  {selectedReport.tanggalMasukRs}
                </p>
              </div>

              {/* Unit Yang Melaporkan */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                  Unit Yang Melaporkan :
                </label>
                <p className="text-gray-800 bg-white/50 p-2 rounded">
                  {selectedReport.unitYangMelaporkan}
                </p>
              </div>

              {/* Lokasi Kejadian */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                  Lokasi Kejadian :
                </label>
                <p className="text-gray-800 bg-white/50 p-2 rounded">
                  {selectedReport.lokasiKejadian}
                </p>
              </div>

              {/* Tanggal Insiden */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                  Tanggal Insiden :
                </label>
                <p className="text-gray-800 bg-white/50 p-2 rounded">
                  {formatTanggal(selectedReport.tanggalInsiden)}
                </p>
              </div>

              {/* Judul Insiden */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                  Judul Insiden :
                </label>
                <p className="text-gray-800 bg-white/50 p-2 rounded">
                  {selectedReport.judulInsiden}
                </p>
              </div>

              {/* Kronologi */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                  Kronologi :
                </label>
                <p className="text-gray-800 bg-white/50 p-2 rounded">
                  {selectedReport.kronologi}
                </p>
              </div>

              {/* Tindakan Awal */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                  Tindakan Awal :
                </label>
                <p className="text-gray-800 bg-white/50 p-2 rounded">
                  {selectedReport.tindakanAwal}
                </p>
              </div>

              {/* Tindakan Oleh */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                  Tindakan Oleh :
                </label>
                <p className="text-gray-800 bg-white/50 p-2 rounded">
                  {selectedReport.tindakanOleh}
                </p>
              </div>

              {/* Dampak */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                  Dampak :
                </label>
                <p className="text-gray-800 bg-white/50 p-2 rounded">
                  {selectedReport.dampak}
                </p>
              </div>

              {/* Probabilitas */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                  Probablitas :
                </label>
                <p className="text-gray-800 bg-white/50 p-2 rounded">
                  {selectedReport.probablitas}
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                  Status :
                </label>
                <p className="text-gray-800 bg-white/50 p-2 rounded">
                  {selectedReport.status}
                </p>
              </div>

              {/* Grading */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                  Grading :
                </label>
                <p className="text-gray-800 bg-white/50 p-2 rounded">
                  {selectedReport.grading}
                </p>
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                  Kategori :
                </label>
                <p className="text-gray-800 bg-white/50 p-2 rounded">
                  {selectedReport.kategori}
                </p>
              </div>

              {/* Rekomendasi Tindakan */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                  Rekomendasi Tindakan :
                </label>
                <p className="text-gray-800 bg-white/50 p-2 rounded">
                  {selectedReport.rekomendasiTindakan}
                </p>
              </div>

              {/* Tanggal Waktu Pelaporan */}
              <div>
                <label className="block text-[#2C3E50] font-medium mb-1 text-sm">
                  Tanggal Waktu Pelaporan :
                </label>
                <p className="text-gray-800 bg-white/50 p-2 rounded">
                  {formatTanggal(selectedReport.tanggalWaktuPelaporan)}
                </p>
              </div>

              <div className="mt-6 flex justify-center space-x-3">
                <button
                  onClick={handleValidasi}
                  className="bg-[#28a745] text-white px-6 py-2 rounded-lg hover:bg-[#218838] transition-colors font-medium text-sm"
                >
                  Validasi
                </button>
                <button
                  onClick={handleRevisi}
                  className="bg-[#ffc107] text-white px-6 py-2 rounded-lg hover:bg-[#e0a800] transition-colors font-medium text-sm"
                >
                  Revisi
                </button>
                <button
                  onClick={handleRiwayat}
                  className="bg-[#6B8CAE] text-white px-6 py-2 rounded-lg hover:bg-[#5a7a9a] transition-colors font-medium text-sm"
                >
                  Riwayat
                </button>
              </div>

              {/* Catatan Section */}
              <div className="mt-6 border-t border-white/20 pt-6">
                <label className="block text-[#2C3E50] font-medium mb-2 text-sm">
                  Catatan :
                </label>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#6B8CAE] bg-white text-gray-800 resize-none"
                  rows={4}
                  placeholder="Masukkan catatan..."
                />
                <div className="mt-3 flex justify-center">
                  <button
                    onClick={handleKirimCatatan}
                    className="bg-[#0B7A95] text-white px-6 py-2 rounded-lg hover:bg-[#0a6b85] transition-colors font-medium text-sm"
                  >
                    Kirim Catatan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Revisi */}
      {showRevisiModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#A8C8E1] rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-[#2C3E50]">
                    Revisi Laporan
                  </h2>
                </div>
                <button
                  onClick={handleCloseRevisiModal}
                  className="text-[#2C3E50] hover:text-gray-700 text-xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Kategori */}
              <div className="mb-6">
                <label className="block text-[#2C3E50] font-medium mb-3 text-sm">
                  Kategori :
                </label>
                <div className="flex flex-wrap gap-2">
                  {["KTD", "KPC", "KNC", "KTC", "Sentinel"].map((kategori) => (
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
                  ))}
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

              {/* Tombol Kirim Revisi */}
              <div className="flex justify-center mb-6">
                <button
                  onClick={handleKirimRevisi}
                  className="bg-[#0B7A95] text-white px-6 py-2 rounded-lg hover:bg-[#0a6b85] transition-colors font-medium text-sm"
                  disabled={!tindakanAwal.trim()}
                >
                  Kirim Revisi
                </button>
              </div>

              {/* Catatan */}
              <div className="mb-6">
                <label className="block text-[#2C3E50] font-medium mb-2 text-sm">
                  Catatan :
                </label>
                <textarea
                  value={catatanRevisi}
                  onChange={(e) => setCatatanRevisi(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#6B8CAE] bg-white text-gray-800 resize-none"
                  rows={3}
                  placeholder="Tambahkan catatan revisi..."
                />
              </div>

              {/* Action Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleKirimCatatan}
                  className="bg-[#2C3E50] text-white px-8 py-2 rounded-lg hover:bg-[#34495e] transition-colors font-medium text-sm"
                  disabled={!selectedKategori || !selectedGrading}
                >
                  Kirim Catatan
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
                            {new Date(item.created_at).toLocaleString("id-ID", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
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
                                ? new Date(aksi.created_at).toLocaleString(
                                    "id-ID",
                                    {
                                      dateStyle: "medium",
                                      timeStyle: "short",
                                    }
                                  )
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
  );
}
