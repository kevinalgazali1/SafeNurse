'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function VideoTutorialPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [videos] = useState([
    {
      id: 1,
      title: 'Pengenalan SAFENurse',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
      id: 2,
      title: 'Pengenalan SAFENurse',
      thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=9bZkp7q19f0'
    },
    {
      id: 3,
      title: 'Pengenalan SAFENurse',
      thumbnail: 'https://img.youtube.com/vi/L_jWHffIx5E/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=L_jWHffIx5E'
    },
    {
      id: 4,
      title: 'Pengenalan SAFENurse',
      thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk'
    },
    {
      id: 5,
      title: 'Pengenalan SAFENurse',
      thumbnail: 'https://img.youtube.com/vi/ZZ5LpwO-An4/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=ZZ5LpwO-An4'
    },
    {
      id: 6,
      title: 'Pengenalan SAFENurse',
      thumbnail: 'https://img.youtube.com/vi/astISOttCQ0/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=astISOttCQ0'
    },
    {
      id: 7,
      title: 'Pengenalan SAFENurse',
      thumbnail: 'https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=M7lc1UVf-VE'
    },
    {
      id: 8,
      title: 'Pengenalan SAFENurse',
      thumbnail: 'https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ'
    },
    {
      id: 9,
      title: 'Pengenalan SAFENurse',
      thumbnail: 'https://img.youtube.com/vi/Ct6BUPvE2sM/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=Ct6BUPvE2sM'
    },
    {
      id: 10,
      title: 'Pengenalan SAFENurse',
      thumbnail: 'https://img.youtube.com/vi/oHg5SJYRHA0/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=oHg5SJYRHA0'
    }
  ]);

  // Simulate loading data from backend
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  const handleVideoClick = (url: string) => {
    window.open(url, '_blank');
  };

  // Loading Screen
  if (isLoading) {
    return (
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
              Memuat Video Tutorial...
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
    );
  }

  return (
    <div className="bg-[#d9f0f6] min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <header className="flex justify-between items-center bg-[#B9D9DD] rounded-xl px-6 py-3 mx-6 mt-6">
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
          
          {/* Video Tutorial - Active */}
          <button className="flex flex-col items-center text-[#0B7A95] transition-colors">
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
          className="bg-white rounded-lg p-8 h-full relative overflow-hidden"
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
            {/* Title Section */}
            <div className="mb-8">
              <h1 className="text-white text-4xl font-bold mb-2">
                Video Edukasi
              </h1>
              <h2 className="text-white text-4xl font-bold mb-4">
                Tutorial  Penggunaan
              </h2>
              <h4 className="text-white text-6xl font-bold">
                SAFE<span className="text-[#09839C]">Nurse</span>
              </h4>
            </div>

            {/* Video Grid - Horizontal Scrollable */}
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-6" style={{ width: 'max-content' }}>
                {videos.map((video) => (
                  <div 
                    key={video.id}
                    className="flex-shrink-0 w-80 bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => handleVideoClick(video.url)}
                  >
                    {/* Video Thumbnail */}
                    <div className="relative h-48 bg-gray-200">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        width={320}
                        height={180}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNDQgNzJMMTc2IDkwTDE0NCAxMDhWNzJaIiBmaWxsPSIjOUI5QjlCIi8+Cjwvc3ZnPgo=';
                        }}
                      />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all">
                        <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                          <i className="fas fa-play text-2xl text-gray-700 ml-1"></i>
                        </div>
                      </div>
                    </div>
                    
                    {/* Video Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {video.title}
                      </h3>
                      <p className="text-sm text-[#0B7A95] font-medium">
                        SAFE<span className="text-[#09839C]">Nurse</span>
                      </p>
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