"use client";

import { useState } from "react";
import Image from "next/image";

export default function DashboardVerifikatorPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const [filterUnit, setFilterUnit] = useState("Semua");
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [filterGrading, setFilterGrading] = useState("Semua");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const [insidenData] = useState([
    {
      id: 1,
      tanggal: "01 / 01 / 2025",
      unit: "IGD",
      kategori: "KTD",
      grading: "Merah",
    },
    {
      id: 2,
      tanggal: "01 / 01 / 2025",
      unit: "IGD",
      kategori: "KTD",
      grading: "Merah",
    },
    {
      id: 3,
      tanggal: "01 / 01 / 2025",
      unit: "IGD",
      kategori: "KTD",
      grading: "Merah",
    },
    {
      id: 4,
      tanggal: "01 / 01 / 2025",
      unit: "IGD",
      kategori: "KTD",
      grading: "Merah",
    },
  ]);

  const handleExportPDF = () => {
    console.log("Export PDF");
  };

  const handleExportExcel = () => {
    console.log("Export Excel");
  };

  const handleFilter = () => {
    console.log("Apply filter:", {
      unit: filterUnit,
      kategori: filterKategori,
      grading: filterGrading,
      dateFrom: filterDateFrom,
      dateTo: filterDateTo,
    });
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
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() =>
                (window.location.href = "/notifications-verifikator")
              }
            >
              <i className="fas fa-bell text-lg mb-1"></i>
              <span className="text-xs">Notifikasi</span>
            </button>

            {/* Laporan Masuk */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() =>
                (window.location.href = "/laporan-masuk-verifikator")
              }
            >
              <i className="fas fa-envelope text-lg mb-1"></i>
              <span className="text-xs">Laporan Masuk</span>
            </button>

            {/* Manage Profil */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() => (window.location.href = "/profile-verifikator")}
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
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
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
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                onClick={() =>
                  (window.location.href = "/notifications-verifikator")
                }
              >
                <i className="fas fa-bell text-lg mr-3"></i>
                <span>Notifikasi</span>
              </button>

              {/* Laporan Masuk */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                onClick={() =>
                  (window.location.href = "/laporan-masuk-verifikator")
                }
              >
                <i className="fas fa-envelope text-lg mr-3"></i>
                <span>Laporan Masuk</span>
              </button>

              {/* Manage Profil */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded"
                onClick={() => (window.location.href = "/profile-verifikator")}
              >
                <i className="fas fa-user-cog text-lg mr-3"></i>
                <span>Profil</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 sm:px-6 py-4 sm:py-6">
        <div className="bg-[#A8C8E1] rounded-lg p-4 sm:p-6 h-full relative overflow-hidden">
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
            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#2C3E50] mb-2">
                Dashboard Insiden dan Data
              </h2>
            </div>

            {/* Filter Data Section */}
            <div className="bg-white rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-[#2C3E50] mb-3 sm:mb-4">
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

                {/* Date From */}
                <div>
                  <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                    className="w-full px-3 py-2 bg-[#6B8CAE] text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
                    placeholder="dd/mm/yy"
                  />
                </div>

                {/* To */}
                <div>
                  <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                    To
                  </label>
                  <input
                    type="date"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                    className="w-full px-3 py-2 bg-[#6B8CAE] text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
                    placeholder="dd/mm/yy"
                  />
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* Grafik Tren Insiden */}
              <div className="bg-white rounded-lg p-3 sm:p-4">
                <h4 className="text-base sm:text-lg font-semibold text-[#2C3E50] mb-3 sm:mb-4">
                  Grafik Tren Insiden
                </h4>
                <div className="h-32 sm:h-48 flex items-end justify-center space-x-1 sm:space-x-2">
                  {/* Bar Chart Simulation */}
                  {[65, 45, 80, 60, 90, 70, 85, 55].map((height, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="bg-[#6B8CAE] w-4 sm:w-6 rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className="text-xs text-[#2C3E50] mt-1 hidden sm:block">
                        Week {index + 1}
                      </span>
                      <span className="text-xs text-[#2C3E50] mt-1 sm:hidden">
                        W{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distribusi Berdasarkan Kategori */}
              <div className="bg-white rounded-lg p-3 sm:p-4">
                <h4 className="text-base sm:text-lg font-semibold text-[#2C3E50] mb-3 sm:mb-4">
                  Distribusi Berdasarkan Kategori
                </h4>
                <div className="h-32 sm:h-48 flex items-center justify-center">
                  {/* Pie Chart Simulation */}
                  <div
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full relative"
                    style={{
                      background: `conic-gradient(
                      #3b82f6 0deg 144deg,
                      #ef4444 144deg 216deg,
                      #22c55e 216deg 288deg,
                      #f59e0b 288deg 324deg,
                      #8b5cf6 324deg 360deg
                    )`,
                    }}
                  >
                    <div className="absolute inset-3 sm:inset-4 bg-white rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-[#2C3E50]">
                          Total
                        </span>
                      </div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mt-3 sm:mt-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-[#3b82f6] rounded"></div>
                    <span className="text-xs text-[#2C3E50]">KTD</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-[#ef4444] rounded"></div>
                    <span className="text-xs text-[#2C3E50]">KPC</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-[#22c55e] rounded"></div>
                    <span className="text-xs text-[#2C3E50]">KNC</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-[#f59e0b] rounded"></div>
                    <span className="text-xs text-[#2C3E50]">KTC</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-[#8b5cf6] rounded"></div>
                    <span className="text-xs text-[#2C3E50]">Sentinel</span>
                  </div>
                </div>
              </div>

              {/* Distribusi Berdasarkan Grading */}
              <div className="bg-white rounded-lg p-3 sm:p-4">
                <h4 className="text-base sm:text-lg font-semibold text-[#2C3E50] mb-3 sm:mb-4">
                  Distribusi Berdasarkan Grading
                </h4>
                <div className="h-32 sm:h-48 flex items-center justify-center">
                  {/* Pie Chart Simulation */}
                  <div
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full relative"
                    style={{
                      background: `conic-gradient(
                      #ef4444 0deg 108deg,
                      #f59e0b 108deg 180deg,
                      #22c55e 180deg 252deg,
                      #3b82f6 252deg 360deg
                    )`,
                    }}
                  >
                    <div className="absolute inset-3 sm:inset-4 bg-white rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-[#2C3E50]">
                        Total
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mt-3 sm:mt-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-[#ef4444] rounded"></div>
                    <span className="text-xs sm:text-sm text-[#2C3E50]">High</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-[#f59e0b] rounded"></div>
                    <span className="text-xs sm:text-sm text-[#2C3E50]">Medium</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-[#10b981] rounded"></div>
                    <span className="text-xs sm:text-sm text-[#2C3E50]">Low</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Insiden Table */}
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 border-b space-y-2 sm:space-y-0">
                <h4 className="text-base sm:text-lg font-semibold text-[#2C3E50]">
                  Data Insiden
                </h4>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                  <button
                    onClick={handleExportPDF}
                    className="bg-[#6B8CAE] text-white px-3 sm:px-4 py-2 rounded text-xs sm:text-sm hover:bg-[#5a7a9e] transition-colors flex items-center justify-center space-x-2"
                  >
                    <i className="fas fa-file-pdf"></i>
                    <span>Ekspor PDF</span>
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="bg-[#6B8CAE] text-white px-3 sm:px-4 py-2 rounded text-xs sm:text-sm hover:bg-[#5a7a9e] transition-colors flex items-center justify-center space-x-2"
                  >
                    <i className="fas fa-file-excel"></i>
                    <span>Ekspor Excel</span>
                  </button>
                </div>
              </div>

              {/* Table Header - Hidden on mobile */}
              <div className="bg-[#2C3E50] text-white hidden sm:block">
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
                  <div key={item.id}>
                    {/* Desktop View */}
                    <div
                      className={`hidden sm:grid grid-cols-4 gap-4 px-4 py-3 text-sm ${
                        index % 2 === 0 ? "bg-[#A8C8E1]" : "bg-white"
                      } hover:bg-blue-50 transition-colors`}
                    >
                      <div className="text-center font-medium text-[#2C3E50]">
                        {item.tanggal}
                      </div>
                      <div className="text-center text-[#2C3E50]">
                        {item.unit}
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
                          <span className="text-xs font-medium text-gray-600">Tanggal:</span>
                          <span className="text-sm font-medium text-[#2C3E50]">{item.tanggal}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-gray-600">Unit:</span>
                          <span className="text-sm text-[#2C3E50]">{item.unit}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-gray-600">Kategori:</span>
                          <span className="text-sm text-[#2C3E50]">{item.kategori}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-gray-600">Grading:</span>
                          <span className="text-sm text-[#2C3E50]">{item.grading}</span>
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
    </div>
  );
}
