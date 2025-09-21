"use client";

import { useState } from "react";

interface Report {
  id: number;
  title: string;

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
  status: string;
  grading: string;
  kategori: string;
  rekomendasiTindakan: string;
  tanggalWaktuPelaporan: string;
}

export default function LaporanMasukKepalaRuangan() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const [reports] = useState<Report[]>([
    {
      id: 1,
      title: "Laporan Insiden Keselamatan Pasien",
      status: "Menunggu Validasi",
      kodeLaporan: "IKP-2024-001",
      namaPerawatYangMenangani: "Ns. Sarah Wijaya, S.Kep",
      namaRuanganPerawatYangMenangani: "Ruang ICU Lantai 3",
      namaPasien: "Budi Santoso",
      noRm: "RM-123456",
      umur: "45 tahun",
      jenisKelamin: "Laki-laki",
      tanggalMasukRs: "15 Januari 2024",
      unitYangMelaporkan: "Unit Perawatan Intensif",
      lokasiKejadian: "Ruang ICU Bed 3",
      tanggalInsiden: "16 Januari 2024, 14:30 WIB",
      judulInsiden: "Pasien Jatuh dari Tempat Tidur",
      kronologi:
        "Pasien mencoba turun dari tempat tidur tanpa bantuan perawat saat akan ke kamar mandi. Pasien terjatuh dan mengeluh nyeri pada pinggul kanan.",
      tindakanAwal:
        "Pasien segera dibantu naik ke tempat tidur, dilakukan pemeriksaan fisik dan vital sign. Dokter jaga dipanggil untuk evaluasi lebih lanjut.",
      tindakanOleh: "Ns. Sarah Wijaya dan Dr. Ahmad Fauzi",
      dampak:
        "Pasien mengalami nyeri ringan pada pinggul kanan, tidak ada fraktur berdasarkan pemeriksaan awal",
      probablitas: "Sedang",

      grading: "Kuning",
      kategori: "KTD (Kejadian Tidak Diharapkan)",
      rekomendasiTindakan:
        "Pemasangan bed rail, edukasi pasien tentang keselamatan, dan pengawasan ketat saat mobilisasi",
      tanggalWaktuPelaporan: "16 Januari 2024, 15:00 WIB",
    },
    {
      id: 2,
      title: "Laporan Medication Error",
      status: "Sudah Divalidasi",
      kodeLaporan: "IKP-2024-002",
      namaPerawatYangMenangani: "Ns. Maya Sari, S.Kep",
      namaRuanganPerawatYangMenangani: "Ruang Penyakit Dalam",
      namaPasien: "Siti Rahayu",
      noRm: "RM-789012",
      umur: "62 tahun",
      jenisKelamin: "Perempuan",
      tanggalMasukRs: "10 Januari 2024",
      unitYangMelaporkan: "Ruang Penyakit Dalam",
      lokasiKejadian: "Ruang Penyakit Dalam Bed 12",
      tanggalInsiden: "17 Januari 2024, 08:00 WIB",
      judulInsiden: "Kesalahan Dosis Obat",
      kronologi:
        "Perawat memberikan dosis insulin yang salah (10 unit seharusnya 5 unit) karena kesalahan membaca instruksi dokter.",
      tindakanAwal:
        "Segera dilakukan monitoring gula darah ketat, dokter diberitahu, dan diberikan snack untuk mencegah hipoglikemia",
      tindakanOleh: "Ns. Maya Sari dan Dr. Linda Kusuma",
      dampak:
        "Pasien mengalami gula darah rendah ringan (70 mg/dL), tidak ada komplikasi serius",
      probablitas: "Rendah",

      grading: "Hijau",
      kategori: "KNC (Kejadian Nyaris Cedera)",
      rekomendasiTindakan:
        "Double check sistem untuk pemberian obat, pelatihan ulang prosedur pemberian insulin",
      tanggalWaktuPelaporan: "17 Januari 2024, 08:30 WIB",
    },
  ]);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [catatan, setCatatan] = useState("");
  const [showRevisiModal, setShowRevisiModal] = useState(false);
  const [showRiwayatModal, setShowRiwayatModal] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedGrading, setSelectedGrading] = useState("");
  const [catatanRevisi, setCatatanRevisi] = useState("");
  const [tindakanAwal, setTindakanAwal] = useState("");

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
    setCatatan("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
    setCatatan("");
  };

  const handleValidasi = () => {
    console.log("Validasi laporan:", selectedReport?.id);
    handleCloseModal();
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

  const handleKirimRevisi = () => {
    console.log("Kirim revisi:", {
      reportId: selectedReport?.id,
      kategori: selectedKategori,
      grading: selectedGrading,
      catatan: catatanRevisi,
      tindakanAwal: tindakanAwal,
    });
    handleCloseRevisiModal();
    handleCloseModal();
  };

  const handleTolak = () => {
    console.log("Tolak laporan:", selectedReport?.id, "Catatan:", catatan);
    handleCloseModal();
  };

  return (
    <div className="bg-[#d9f0f6] min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <header className="bg-[#B9D9DD] rounded-xl px-4 sm:px-6 py-3 mx-4 sm:mx-6 mt-4 sm:mt-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-lg sm:text-xl font-bold">
            Safe
            <span className="font-bold text-[#0B7A95]">Nurse</span>
          </h1>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Riwayat */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() =>
                (window.location.href = "/dashboard-kepala-ruangan")
              }
            >
              <i className="fas fa-clipboard-list text-lg mb-1"></i>
              <span className="text-xs">Riwayat</span>
            </button>

            {/* Notifikasi */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() =>
                (window.location.href = "/notifications-kepala-ruangan")
              }
            >
              <i className="fas fa-bell text-lg mb-1"></i>
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
              onClick={() => (window.location.href = "/profile-kepala-ruangan")}
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
                  (window.location.href = "/dashboard-kepala-ruangan")
                }
              >
                <i className="fas fa-history text-lg mr-3"></i>
                <span>Riwayat</span>
              </button>

              {/* Notifikasi */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                onClick={() =>
                  (window.location.href = "/notifications-kepala-ruangan")
                }
              >
                <i className="fas fa-bell text-lg mr-3"></i>
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
                  (window.location.href = "/profile-kepala-ruangan")
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
      <main className="flex-1 px-4 sm:px-6 py-4 sm:py-6">
        {/* Background Pattern */}
        <div
          className="relative rounded-xl p-4 sm:p-8 h-full"
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
            }}
          ></div>

          {/* Content Container */}
          <div className="relative z-10">
            {/* Page Title */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Daftar Laporan Masuk
              </h2>
            </div>

            {/* Reports List */}
            <div className="space-y-3 sm:space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-3 sm:p-6 hover:bg-white/95 transition-colors cursor-pointer"
                  onClick={() => handleReportClick(report)}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="bg-[#0B7A95] p-2 sm:p-3 rounded-lg flex-shrink-0">
                      <i className="fas fa-envelope text-white text-sm sm:text-lg"></i>
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-1 leading-tight">
                        Laporan dari Perawat {report.namaPerawatYangMenangani}
                      </h3>

                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          <span className="font-medium">Judul Insiden:</span>{" "}
                          {report.judulInsiden}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          <span className="font-medium">Tanggal Laporan:</span>{" "}
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
                  {selectedReport.tanggalInsiden}
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
                  {selectedReport.tanggalWaktuPelaporan}
                </p>
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
                  onClick={handleTolak}
                  className="bg-[#dc3545] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-[#c82333] transition-colors font-medium text-sm w-full sm:w-auto"
                >
                  Tolak
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
                  onClick={() => {
                    console.log("Kirim catatan:", catatan);
                    // Add your send note logic here
                  }}
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
                    { name: "Merah", color: "bg-red-500" },
                    { name: "Kuning", color: "bg-yellow-500" },
                    { name: "Hijau", color: "bg-green-500" },
                    { name: "Biru", color: "bg-blue-500" },
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
                  onClick={() => console.log("Kirim Revisi:", tindakanAwal)}
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
                  onClick={handleKirimRevisi}
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
      {showRiwayatModal && (
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
                onClick={() => setShowRiwayatModal(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            {/* Content Modal */}
            <div className="p-6 space-y-6">
              {/* Riwayat Catatan */}
              <div>
                <h3 className="text-[#2C3E50] font-bold mb-4 text-lg">
                  Riwayat Catatan
                </h3>

                {/* Desktop Table */}
                <div className="hidden md:block bg-white/50 rounded-lg overflow-hidden">
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
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          2024-01-15 10:30
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          Pasien menunjukkan perbaikan kondisi
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          2024-01-14 14:20
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          Perlu monitoring lebih intensif
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          2024-01-13 09:15
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          Catatan awal laporan
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium">
                          Tanggal
                        </span>
                        <span className="text-sm text-gray-800 font-medium">
                          2024-01-15 10:30
                        </span>
                      </div>
                      <div className="border-t pt-2">
                        <span className="text-xs text-gray-500 font-medium">
                          Catatan
                        </span>
                        <p className="text-sm text-gray-800 mt-1">
                          Pasien menunjukkan perbaikan kondisi
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium">
                          Tanggal
                        </span>
                        <span className="text-sm text-gray-800 font-medium">
                          2024-01-14 14:20
                        </span>
                      </div>
                      <div className="border-t pt-2">
                        <span className="text-xs text-gray-500 font-medium">
                          Catatan
                        </span>
                        <p className="text-sm text-gray-800 mt-1">
                          Perlu monitoring lebih intensif
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium">
                          Tanggal
                        </span>
                        <span className="text-sm text-gray-800 font-medium">
                          2024-01-13 09:15
                        </span>
                      </div>
                      <div className="border-t pt-2">
                        <span className="text-xs text-gray-500 font-medium">
                          Catatan
                        </span>
                        <p className="text-sm text-gray-800 mt-1">
                          Catatan awal laporan
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Riwayat Tindakan */}
              <div>
                <h3 className="text-[#2C3E50] font-bold mb-4 text-lg">
                  Riwayat Tindakan
                </h3>

                {/* Desktop Table */}
                <div className="hidden md:block bg-white/50 rounded-lg overflow-hidden">
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
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          2024-01-15 10:30
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            Validasi
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          Kategori A
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          Grade 2
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          Lanjutkan perawatan standar
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          2024-01-14 14:20
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                            Revisi
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          Kategori B
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          Grade 1
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          Perlu evaluasi ulang
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          2024-01-13 09:15
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            Submit
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          Kategori A
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          Grade 1
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          Tindakan awal sesuai protokol
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium">
                          Tanggal
                        </span>
                        <span className="text-sm text-gray-800 font-medium">
                          2024-01-15 10:30
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-xs text-gray-500 font-medium">
                            Aksi
                          </span>
                          <div className="mt-1">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                              Validasi
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 font-medium">
                            Kategori
                          </span>
                          <p className="text-sm text-gray-800 mt-1">
                            Kategori A
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 font-medium">
                            Grading
                          </span>
                          <p className="text-sm text-gray-800 mt-1">Grade 2</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 font-medium">
                            Rekomendasi
                          </span>
                          <p className="text-sm text-gray-800 mt-1">
                            Lanjutkan perawatan standar
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium">
                          Tanggal
                        </span>
                        <span className="text-sm text-gray-800 font-medium">
                          2024-01-14 14:20
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-xs text-gray-500 font-medium">
                            Aksi
                          </span>
                          <div className="mt-1">
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                              Revisi
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 font-medium">
                            Kategori
                          </span>
                          <p className="text-sm text-gray-800 mt-1">
                            Kategori B
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 font-medium">
                            Grading
                          </span>
                          <p className="text-sm text-gray-800 mt-1">Grade 1</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 font-medium">
                            Rekomendasi
                          </span>
                          <p className="text-sm text-gray-800 mt-1">
                            Perlu evaluasi ulang
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium">
                          Tanggal
                        </span>
                        <span className="text-sm text-gray-800 font-medium">
                          2024-01-13 09:15
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-xs text-gray-500 font-medium">
                            Aksi
                          </span>
                          <div className="mt-1">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              Submit
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 font-medium">
                            Kategori
                          </span>
                          <p className="text-sm text-gray-800 mt-1">
                            Kategori A
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 font-medium">
                            Grading
                          </span>
                          <p className="text-sm text-gray-800 mt-1">Grade 1</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 font-medium">
                            Rekomendasi
                          </span>
                          <p className="text-sm text-gray-800 mt-1">
                            Tindakan awal sesuai protokol
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
