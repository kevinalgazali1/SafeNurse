"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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

const COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6"];

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
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const [insidenData, setInsidenData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<Insiden[]>([]);
  const [laporanData, setLaporanData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) return;

        const res = await fetch(
          "https://safe-nurse-backend.vercel.app/api/laporan/verifikator",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await res.json();
        setLaporanData(json.data || []);
        if (json?.data) {
          setInsidenData(json.data);
          setFilteredData(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
    if (filterDateFrom) {
      data = data.filter(
        (d) => new Date(d.tgl_insiden) >= new Date(filterDateFrom)
      );
    }
    if (filterDateTo) {
      data = data.filter(
        (d) => new Date(d.tgl_insiden) <= new Date(filterDateTo)
      );
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

  const weeklyCounts = filteredData.reduce<Record<string, number>>((acc, d) => {
    const week = getWeekNumber(new Date(d.tgl_insiden));
    acc[week] = (acc[week] || 0) + 1;
    return acc;
  }, {});

  function getWeekNumber(date: Date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDays = Math.floor(
      (date.getTime() - startOfYear.getTime()) / 86400000
    );
    return "W" + Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
  }

  // urutkan minggu
  const weeklyData = Object.entries(weeklyCounts).map(([week, count]) => ({
    week,
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

  // === Export PDF ===
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Insiden", 14, 10);

    const tableData = laporanData.map((item, index) => [
      index + 1,
      item.kode_laporan,
      item.nama_pasien,
      item.umur,
      item.kategori,
      item.grading,
      item.status,
    ]);

    autoTable(doc, {
      head: [
        ["No", "Kode", "Nama Pasien", "Umur", "Kategori", "Grading", "Status"],
      ],
      body: tableData,
    });

    doc.save("laporan-insiden.pdf");
  };

  // === Export Excel ===
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      laporanData.map((item, index) => ({
        No: index + 1,
        Kode: item.kode_laporan,
        "Nama Pasien": item.nama_pasien,
        Umur: item.umur,
        Kategori: item.kategori,
        Grading: item.grading,
        Status: item.status,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), "laporan-insiden.xlsx");
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
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weeklyData}>
                    <XAxis dataKey="week" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6B8CAE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Distribusi Berdasarkan Kategori */}
              <div className="bg-white rounded-lg p-3 sm:p-4">
                <h4 className="text-base sm:text-lg font-semibold text-[#2C3E50] mb-3 sm:mb-4">
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
                      {kategoriData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Distribusi Berdasarkan Grading */}
              <div className="bg-white rounded-lg p-3 sm:p-4">
                <h4 className="text-base sm:text-lg font-semibold text-[#2C3E50] mb-3 sm:mb-4">
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
                      {gradingData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
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
                        {item.tgl_msk_rs}
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
    </div>
  );
}
