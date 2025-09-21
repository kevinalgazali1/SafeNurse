'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function HomePage() {

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="bg-[#d9f0f6] min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <header className={`flex justify-between items-center bg-[#B9D9DD] rounded-xl px-6 py-3 mx-6 mt-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <h1 className="text-white text-xl font-bold">
          Safe
          <span className="font-bold text-[#0B7A95]">Nurse</span>
        </h1>
        
        {/* Login Button */}
        <button 
          className="bg-[#0B7A95] text-white px-6 py-2 rounded-lg hover:bg-[#095a6b] transition-all duration-300 font-medium hover:scale-105"
          onClick={() => window.location.href = '/login'}
        >
          Login
        </button>
      </header>

      {/* Main content */}
      <main className={`flex justify-between items-center px-6 py-10 h-full transition-all duration-1200 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <section className="relative flex w-full rounded-lg overflow-hidden" style={{ minHeight: '520px', height: '520px' }}>
          {/* Left side - Welcome content */}
        <div className={`w-full md:w-1/2 p-8 flex flex-col justify-center transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ background: 'linear-gradient(180deg, #b9dce3 0%, #0a7a9a 100%)' }}>
            {/* Background icons behind content */}
            <Image
              alt="Background medical icons with microphone, clipboard, and sound waves in light blue shades"
              className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none select-none"
              src="/backgroundlogin.png"
              fill
              style={{ zIndex: 0 }}
            />
            <div className="space-y-6">
              <div className={`transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Safe<span className="text-[#09839C]">Nurse</span>
                </h1>
                <p className="text-lg text-white mb-6">
                  Pelaporan Insiden Keselamatan Pasien
                </p>
              </div>
              
              <div className={`flex gap-6 max-w-md relative z-10 transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="bg-[#C9F1FA] rounded-lg p-6 w-44 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
                  <Image 
                    alt="3D style icon representing voice waves and a microphone in teal and blue colors" 
                    className="mb-3" 
                    height={64} 
                    src="https://storage.googleapis.com/a1aa/image/08e2ff8e-5068-4634-0e16-85a266224f0d.jpg" 
                    width={64}
                  />
                  <p className="text-xs leading-tight text-black">
                    memudahkan
                    <br/>
                    tenaga kesehatan
                    <br/>
                    melapor lewat
                    <br/>
                    <span className="font-bold">
                      voice note
                    </span>
                  </p>
                </div>
                <div className="bg-[#A1D9E5] rounded-lg p-6 w-44 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
                  <Image 
                    alt="3D style icon representing a chatbot with speech bubbles and a document in teal and blue colors" 
                    className="mb-3" 
                    height={64} 
                    src="https://storage.googleapis.com/a1aa/image/abbb7c3f-3d13-4ff1-470c-8c68bd9a565c.jpg" 
                    width={64}
                  />
                  <p className="text-[9px] leading-tight text-black">
                    otomatis dibuatkan
                    <br/>
                    laporan oleh 
                    <span className="font-bold">
                      chatbot
                    </span>
                     dan
                    <br/>
                    dikirim ke validator secara
                    <br/>
                    cepat dan akurat
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side image with angled shapes */}
          <div
            id="right-side"
            className={`hidden md:flex md:w-1/2 relative items-center justify-center overflow-hidden transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
            style={{ background: 'linear-gradient(180deg, #b9dce3 0%, #0a7a9a 100%)' }}
          >
            <Image
              alt="Background medical icons with microphone, clipboard, and sound waves in light blue shades"
              className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none select-none"
              src="/backgroundlogin.png"
              fill
              style={{ zIndex: 0 }}
            />
            <Image
              alt="Photo of a doctor and nurse pointing at a clipboard with medical documents"
              className="absolute inset-0 w-full h-full object-cover z-10 hover:scale-105 transition-transform duration-500"
              src="/dokterkanan.png"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
