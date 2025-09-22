"use client";

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

function MobileReportCard({ report, onDetailClick }: MobileReportCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
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

      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Grading:</span>
              <span className="text-gray-800">{report.grading}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Kode Laporan:</span>
              <span className="text-gray-800">{report.kode}</span>
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

  const token = Cookies.get("token");

  const fetchReports = async () => {
    if (!token) return;

    try {
      const res = await fetch(
        "https://safe-nurse-backend.vercel.app/api/laporan/perawat",
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
  const handleAddReport = () => router.push("/tambah-laporan");
  const handleDetailClick = (report: Report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
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
              onClick={() => (window.location.href = "/notifications-perawat")}
            >
              <i className="fas fa-bell text-lg mb-1"></i>
              <span className="text-xs">Notifikasi</span>
            </button>

            {/* Video Tutorial */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() => (window.location.href = "/video-tutorial-perawat")}
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
              className="flex items-center text-white hover:text-[#0B7A95] transition-colors py-2"
              onClick={() => (window.location.href = "/notifications-perawat")}
            >
              <i className="fas fa-bell text-lg mr-3"></i>
              <span className="text-sm">Notifikasi</span>
            </button>

            {/* Video Tutorial */}
            <button
              className="flex items-center text-white hover:text-[#0B7A95] transition-colors py-2"
              onClick={() => (window.location.href = "/video-tutorial-perawat")}
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
            {/* Header section with date picker and add button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <button
                  className="bg-[#0E364A] text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:brightness-110 transition w-full sm:w-auto"
                  onClick={() => console.log("Pilih Bulan clicked")}
                >
                  Pilih Bulan
                </button>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B7A95]"
                  placeholder="Filter tanggal"
                />
              </div>

              <button
                className="bg-[#0B7A95] text-white px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-medium hover:brightness-110 transition flex items-center justify-center space-x-2 w-full sm:w-auto max-w-xs sm:max-w-none"
                onClick={handleAddReport}
              >
                <i className="fas fa-plus"></i>
                <span>Tambah Laporan</span>
              </button>
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
                  {selectedReport.tanggalInsiden}
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
                  {selectedReport.tanggalWaktuPelaporan}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
