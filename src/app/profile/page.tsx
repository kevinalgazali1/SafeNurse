'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProfilePage() {
  // Sample user data from database
  const [userData] = useState({
    nama: 'Nama Lengkap',
    email: 'perawat@gmail.com',
    noStr: '',
    nip: '',
    unitKerja: '',
    jabatan: ''
  });

  // Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChangeAccount = () => {
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditForm({ email: '', password: '', confirmPassword: '' });
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm.password !== editForm.confirmPassword) {
      alert('Password dan konfirmasi password tidak cocok!');
      return;
    }
    // Handle submit logic here
    console.log('Edit account submitted:', editForm);
    handleCloseModal();
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleLogout = () => {
    window.location.href = '/login';
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
          {/* Riwayat Laporan */}
          <button className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors" onClick={() => window.location.href = '/dashboard-perawat'}>
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
          
          {/* Manage Profil - Active */}
          <button className="flex flex-col items-center text-[#0B7A95] transition-colors">
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
            {/* Profile Content Container */}
            <div className="flex justify-center items-center min-h-full">
              <div className="max-w-4xl w-full space-y-6">
                
                {/* Top Section - Profile Info and General Information */}
                <div className="flex flex-col lg:flex-row gap-6">
                  
                  {/* Left Box - Profile Picture, Name, Email */}
                  <div className="bg-white/95 rounded-2xl p-6 shadow-2xl flex flex-col items-center">
                    <div className="w-24 h-24 bg-[#4A9B8E] rounded-full flex items-center justify-center mb-4">
                      <i className="fas fa-user text-3xl text-white"></i>
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 text-center mb-1">Nama Lengkap</h2>
                    <p className="text-gray-600 text-center text-sm">{userData.email}</p>
                  </div>
                  
                  {/* Right Box - General Information */}
                  <div className="flex-1 bg-white/95 rounded-2xl p-6 shadow-2xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">General Information</h3>
                    <div className="space-y-3">
                      <div className="flex">
                        <span className="text-gray-600 w-40">Nama :</span>
                        <span className="text-gray-800">{userData.nama || '-'}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-600 w-40">No STR :</span>
                        <span className="text-gray-800">{userData.noStr || '-'}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-600 w-40">NIP / ID Pegawai :</span>
                        <span className="text-gray-800">{userData.nip || '-'}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-600 w-40">Unit Kerja / Ruangan :</span>
                        <span className="text-gray-800">{userData.unitKerja || '-'}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-600 w-40">Jabatan / Posisi :</span>
                        <span className="text-gray-800">{userData.jabatan || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Box - Security */}
                <div className="bg-white/95 rounded-2xl p-6 shadow-2xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Security</h3>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <p className="text-gray-800">{userData.email}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Password</label>
                        <p className="text-gray-800">••••••••••••</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleChangeAccount}
                      className="bg-[#6B8CAE] text-white px-6 py-2 rounded-lg hover:bg-[#5A7A9A] transition-colors font-medium"
                    >
                      Change Account
                    </button>
                  </div>
                </div>
                
                {/* Logout Button */}
                <div className="flex justify-center">
                  <button 
                    onClick={handleLogout}
                    className="bg-[#2C3E50] text-white px-8 py-3 rounded-lg hover:bg-[#34495E] transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Account Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-[#A8C8D8] rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-2xl">
            {/* Close Button */}
             <button 
               onClick={handleCloseModal}
               className="absolute top-4 right-4 w-8 h-8 bg-[#6B8CAE] rounded-full flex items-center justify-center text-white hover:bg-[#5A7A9A] transition-colors"
             >
               <i className="fas fa-times"></i>
             </button>
             
             {/* Modal Header */}
             <div className="text-center mb-6">
               <div className="w-12 h-12 bg-[#6B8CAE] rounded-full flex items-center justify-center mx-auto mb-3">
                 <i className="fas fa-edit text-white text-xl"></i>
               </div>
               <h2 className="text-xl font-bold text-[#2C3E50]">Edit Account</h2>
             </div>
            
            {/* Form */}
             <form onSubmit={handleSubmitEdit} className="space-y-4">
               {/* Email Field */}
               <div>
                 <label className="block text-[#2C3E50] font-medium mb-2">Email :</label>
                 <input
                   type="email"
                   value={editForm.email}
                   onChange={(e) => handleInputChange('email', e.target.value)}
                   className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#6B8CAE] bg-white text-gray-800"
                   placeholder="Masukkan email baru"
                   required
                 />
               </div>
               
               {/* Password Field */}
               <div>
                 <label className="block text-[#2C3E50] font-medium mb-2">Password :</label>
                 <input
                   type="password"
                   value={editForm.password}
                   onChange={(e) => handleInputChange('password', e.target.value)}
                   className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#6B8CAE] bg-white text-gray-800"
                   placeholder="Masukkan password baru"
                   required
                 />
               </div>
               
               {/* Confirm Password Field */}
               <div>
                 <label className="block text-[#2C3E50] font-medium mb-2">Konfirmasi Password :</label>
                 <input
                   type="password"
                   value={editForm.confirmPassword}
                   onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                   className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#6B8CAE] bg-white text-gray-800"
                   placeholder="Konfirmasi password baru"
                   required
                 />
               </div>
              
              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="bg-[#2C3E50] text-white px-8 py-3 rounded-lg hover:bg-[#34495E] transition-colors font-medium"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}