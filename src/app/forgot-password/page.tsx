'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/forgot_password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // ambil dari state email
      }
    );

    const data = await res.json();
    console.log("Forgot password response:", data);

    if (!res.ok) {
      alert(data.message || "Gagal mengirim email reset password!");
      return;
    }

    alert("Token reset password sudah dikirim ke email Anda!");
    // kalau mau redirect ke halaman reset password:
    window.location.href = "/reset-password";
  } catch (err) {
    console.error("Error forgot password:", err);
    alert("Terjadi kesalahan. Coba lagi nanti.");
  }
};


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
          className="bg-[#0B7A95] text-white px-6 py-2 rounded-lg hover:bg-[#095a6b] transition-all duration-300 hover:scale-105 font-medium"
          onClick={() => window.location.href = '/login'}
        >
          Login
        </button>
      </header>

      {/* Main content */}
      <main className={`flex justify-between items-center px-6 py-10 transition-all duration-1200 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <section
          className="relative flex w-full rounded-lg overflow-hidden"
          style={{ minHeight: '520px', height: '520px' }}
        >
          {/* Left side with gradient and background icons */}
          <div className={`w-full md:w-1/2 p-8 flex flex-col justify-center transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ background: 'linear-gradient(180deg, #b9dce3 0%, #0a7a9a 100%)' }}>
            {/* Background icons behind content */}
            <Image
              alt="Background medical icons with microphone, clipboard, and sound waves in light blue shades"
              className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none select-none"
              src="/backgroundlogin.png"
              fill
              style={{ zIndex: 0 }}
            />
            <div className="flex flex-col justify-center items-center h-full">
              <div className="relative z-10 max-w-xs">
                <div className={`transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <h1 className="text-white text-center text-5xl font-bold mb-1">
                    Safe
                    <span className="font-extrabold text-[#09839C]"> Nurse </span>
                  </h1>
                </div>
                <h2 className={`text-white text-center text-3xl font-extrabold mb-8 transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  Reset <span className="text-[#09839C]">Password</span>
                </h2>
                <div className={`transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <p className="text-white text-sm">
                    The verification email will be sent to your mailbox.
                  </p>
                  <p className="text-[#0E364A] font-bold text-sm mb-4">
                    Please check it.
                  </p>
                </div>
                <form className={`space-y-6 transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} onSubmit={handleSubmit}>
                  <div>
                    <label
                      className="block text-white font-semibold text-lg mb-1"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <div className="flex items-center border-b border-[#0E364A]">
                      <input
                        className="bg-transparent text-black placeholder-[#a0cbd9] text-sm font-normal focus:outline-none w-full py-1 focus:scale-105 transition-transform duration-300"
                        id="email"
                        placeholder="perawat@gmail.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <i className="fas fa-envelope text-[#0E364A] text-lg hover:scale-110 transition-transform duration-200"></i>
                    </div>
                  </div>
                  
                  {/* Spacer div to maintain consistent height */}
                  <div className="h-16"></div>

                  <button
                    className="mt-6 bg-[#0E364A] text-white font-semibold text-lg rounded-lg py-2 w-full hover:brightness-110 hover:scale-105 transition-all duration-300"
                    type="submit"
                  >
                    Send
                  </button>
                </form>
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

      <style jsx>{`
        @media (max-width: 768px) {
          #right-side {
            display: none;
          }
          #left-side {
            width: 100%;
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
}