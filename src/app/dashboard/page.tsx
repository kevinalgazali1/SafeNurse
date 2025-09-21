'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [reports] = useState([
    {
      id: 1,
      tanggal: '01 / 01 / 2025',
      kategori: '',
      status: '',
      grading: '',
      catatan: '',
      kode: ''
    },
    {
      id: 2,
      tanggal: '01 / 01 / 2025',
      kategori: '',
      status: '',
      grading: '',
      catatan: '',
      kode: ''
    },
    {
      id: 3,
      tanggal: '01 / 01 / 2025',
      kategori: '',
      status: '',
      grading: '',
      catatan: '',
      kode: ''
    },
    {
      id: 4,
      tanggal: '01 / 01 / 2025',
      kategori: '',
      status: '',
      grading: '',
      catatan: '',
      kode: ''
    },
    {
      id: 5,
      tanggal: '01 / 01 / 2025',
      kategori: '',
      status: '',
      grading: '',
      catatan: '',
      kode: ''
    },
    {
      id: 6,
      tanggal: '01 / 01 / 2025',
      kategori: '',
      status: '',
      grading: '',
      catatan: '',
      kode: ''
    },
    {
      id: 7,
      tanggal: '01 / 01 / 2025',
      kategori: '',
      status: '',
      grading: '',
      catatan: '',
      kode: ''
    }
  ]);

  const handleAddReport = () => {
    // Handle add report logic here
    console.log('Add new report');
  };

  return (
    <div className="bg-[#d9f0f6] min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <header className="flex justify-between items-center bg-[#B9D9DD] rounded-xl px-6 py-3 mx-6 mt-6">
        <h1 className="text-white text-xl font-bold">
          Safe
          <span className="font-bold text-[#0B7A95]">Nurse</span>
        </h1>
        
        {/* Navigation Items */}
        <div className="flex items-center space-x-6">
          {/* Riwayat Laporan - Active */}
          <button className="flex flex-col items-center text-[#0B7A95] transition-colors">
            <i className="fas fa-clipboard-list text-lg mb-1"></i>
            <span className="text-xs">Riwayat</span>
          </button>
          
          {/* Notifikasi */}
          <button className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors" onClick={() => window.location.href = '/notifications'}>
            <i className="fas fa-bell text-lg mb-1"></i>
            <span className="text-xs">Notifikasi</span>
          </button>
          
          {/* Video Tutorial */}
          <button className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors" onClick={() => window.location.href = '/video-tutorial'}>
            <i className="fas fa-play-circle text-lg mb-1"></i>
            <span className="text-xs">Tutorial</span>
          </button>
          
          {/* Manage Profil */}
          <button className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors" onClick={() => window.location.href = '/profile'}>
            <i className="fas fa-user-cog text-lg mb-1"></i>
            <span className="text-xs">Profil</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-6 py-6">
        <div 
          className="bg-white rounded-lg p-6 h-full relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #b9dce3 0%, #0a7a9a 100%)'
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
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <button 
                  className="bg-[#0E364A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:brightness-110 transition"
                  onClick={() => console.log('Pilih Bulan clicked')}
                >
                  Pilih Bulan
                </button>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B7A95]"
                />
              </div>
              
              <button 
                className="bg-[#0B7A95] text-white px-6 py-2 rounded-lg text-sm font-medium hover:brightness-110 transition flex items-center space-x-2"
                onClick={handleAddReport}
              >
                <i className="fas fa-plus"></i>
                <span>Tambah Laporan</span>
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              {/* Table Header */}
              <div className="bg-[#0B7A95] text-white">
                <div className="grid grid-cols-6 gap-4 px-4 py-3 text-sm font-medium">
                  <div className="text-center">Tanggal Laporan</div>
                  <div className="text-center">Kategori Insiden</div>
                  <div className="text-center">Status Laporan</div>
                  <div className="text-center">Grading</div>
                  <div className="text-center">Catatan</div>
                  <div className="text-center">Kode Laporan</div>
                </div>
              </div>
              
              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {reports.map((report, index) => (
                  <div 
                    key={report.id} 
                    className={`grid grid-cols-6 gap-4 px-4 py-3 text-sm ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-blue-50 transition-colors`}
                  >
                    <div className="bg-[#0E364A] text-white px-3 py-1 rounded text-center text-xs font-medium">
                      {report.tanggal}
                    </div>
                    <div className="text-gray-600">{report.kategori}</div>
                    <div className="text-gray-600">{report.status}</div>
                    <div className="text-gray-600">{report.grading}</div>
                    <div className="text-gray-600">{report.catatan}</div>
                    <div className="text-gray-600">{report.kode}</div>
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