'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Laporan Anda mengenai pasien A/N Budi Santoso telah berhasil dikirim dan sedang menunggu verifikasi dari supervisor.",
      time: "2 jam yang lalu",
      isRead: false
    },
    {
      id: 2,
      title: "Laporan Anda mengenai pasien A/N Budi Santoso telah berhasil dikirim dan sedang menunggu verifikasi dari supervisor.",
      time: "4 jam yang lalu",
      isRead: false
    },
    {
      id: 3,
      title: "Laporan Anda mengenai pasien A/N Budi Santoso telah berhasil dikirim dan sedang menunggu verifikasi dari supervisor.",
      time: "6 jam yang lalu",
      isRead: false
    },
    {
      id: 4,
      title: "Laporan Anda mengenai pasien A/N Budi Santoso telah berhasil dikirim dan sedang menunggu verifikasi dari supervisor.",
      time: "1 hari yang lalu",
      isRead: false
    },
    {
      id: 5,
      title: "Laporan Anda mengenai pasien A/N Budi Santoso telah berhasil dikirim dan sedang menunggu verifikasi dari supervisor.",
      time: "2 hari yang lalu",
      isRead: false
    }
  ]);

  // State untuk modal delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<number | null>(null);

  // Fungsi untuk handle delete single notification
  const handleDeleteNotification = () => {
    if (selectedNotificationId) {
      setNotifications(prev => prev.filter(notif => notif.id !== selectedNotificationId));
      closeDeleteModal();
    }
  };

  // Fungsi untuk handle delete all notifications
  const handleDeleteAllNotifications = () => {
    setNotifications([]);
    setShowDeleteAllModal(false);
  };

  // Fungsi untuk membuka modal delete
  const openDeleteModal = (id: number) => {
    setSelectedNotificationId(id);
    setShowDeleteModal(true);
  };

  // Fungsi untuk menutup modal delete
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedNotificationId(null);
  };

  return (
    <div className="bg-[#d9f0f6] min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <header className="flex justify-between items-center bg-[#B9D9DD] rounded-xl px-6 py-3 mx-6 mt-6">
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
        
        {/* Navigation Items */}
        <div className="flex items-center space-x-6">
          {/* Riwayat Laporan */}
          <button className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors" onClick={() => window.location.href = '/dashboard-perawat'}>
            <i className="fas fa-clipboard-list text-lg mb-1"></i>
            <span className="text-xs">Riwayat</span>
          </button>
          
          {/* Notifikasi - Active */}
          <button className="flex flex-col items-center text-[#0B7A95] transition-colors">
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
            <i className="fas fa-user text-lg mb-1"></i>
            <span className="text-xs">Profil</span>
          </button>

          {/* User Info */}
          <div className="flex items-center space-x-2 text-white">
            <i className="fas fa-user-circle text-2xl"></i>
            <span className="text-sm font-medium">Perawat</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
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
          
          {/* Content Container */}
          <div className="relative z-10">
            {/* Page Title */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-[#0B7A95] mb-2">Notifikasi</h2>
                <p className="text-gray-600">Daftar notifikasi terbaru untuk Anda</p>
              </div>
              
              {/* Delete All Button */}
              {notifications.length > 0 && (
                <button
                  onClick={() => setShowDeleteAllModal(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                >
                  <i className="fas fa-trash text-sm"></i>
                  <span className="sm:hidden">Delete</span>
                  <span className="hidden sm:inline">Delete All</span>
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    {/* Notification Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-[#7BB3C7] rounded-full flex items-center justify-center">
                        <i className="fas fa-bell text-white text-sm"></i>
                      </div>
                    </div>
                    
                    {/* Notification Content */}
                    <div className="flex-1">
                      <p className="text-gray-800 text-sm leading-relaxed mb-2">
                        {notification.title}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {notification.time}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* Unread Indicator */}
                      {!notification.isRead && (
                        <div className="w-3 h-3 bg-[#0B7A95] rounded-full"></div>
                      )}
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => openDeleteModal(notification.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 group"
                        title="Hapus notifikasi"
                      >
                        <i className="fas fa-trash text-sm group-hover:scale-110 transition-transform"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State (if no notifications) */}
            {notifications.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-bell-slash text-gray-400 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada notifikasi</h3>
                <p className="text-gray-500">Semua notifikasi akan muncul di sini</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Single Notification Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-trash text-red-500 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Hapus Notifikasi
              </h3>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin menghapus notifikasi ini? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteNotification}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Notifications Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-trash text-red-500 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Hapus Semua Notifikasi
              </h3>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin menghapus semua notifikasi? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteAllModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteAllNotifications}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Hapus Semua
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}