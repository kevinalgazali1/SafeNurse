"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { toast, Toaster } from "react-hot-toast";

interface JwtPayload {
  role: string;
  exp?: number;
  iat?: number;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Login gagal!");
        return;
      }

      // Simpan token ke cookie (15 menit)
      const expiryDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      Cookies.set("token", data.token, { expires: expiryDate });

      // Decode role
      const decoded: JwtPayload = jwtDecode(data.token);

      // Redirect awal (sementara, middleware nanti akan handle juga)
      if (decoded.role === "super_admin") {
        window.location.href = "/dashboard-superadmin";
      } else if (decoded.role === "perawat") {
        window.location.href = "/dashboard-perawat";
      } else if (decoded.role === "kepala_ruangan") {
        window.location.href = "/dashboard-kepala-ruangan";
      } else if (decoded.role === "chief_nursing") {
        window.location.href = "/dashboard-chiefnursing";
      } else if (decoded.role === "verifikator") {
        window.location.href = "/dashboard-verifikator";
      } else {
        toast.error("Role tidak dikenali!");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Terjadi kesalahan server.");
    }
  };

  useEffect(() => {
    const expired = Cookies.get("session_expired");
    if (expired === "1") {
      toast.error("Sesi anda sudah habis, mohon login kembali.");
      Cookies.remove("session_expired"); // hapus supaya tidak muncul terus
    }
  }, []);

  return (
    <div className="bg-[#d9f0f6] min-h-screen flex flex-col">
      {/* Header */}
      <header
        className={`flex justify-between items-center bg-[#B9D9DD] rounded-xl px-6 py-3 mx-6 mt-6 transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
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

      </header>

      {/* Main content */}
      <main
        className={`flex justify-between items-center px-6 py-10 h-full transition-all duration-1200 delay-300 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <section
          className="relative flex w-full rounded-lg overflow-hidden"
          style={{ minHeight: "520px", height: "520px" }}
        >
          {/* Left side with gradient and background icons */}
          <div
            className={`w-full md:w-1/2 p-8 flex flex-col justify-center transition-all duration-1000 delay-500 ${
              isLoaded
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
            style={{
              background: "linear-gradient(180deg, #b9dce3 0%, #0a7a9a 100%)",
            }}
          >
            {/* Background icons behind content */}
            <Image
              alt="Background medical icons with microphone, clipboard, and sound waves in light blue shades"
              className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none select-none"
              src="/bgperawat.png"
              fill
              style={{ zIndex: 0 }}
            />
            <div className="flex flex-col justify-center items-center h-full">
              <div className="relative z-10 max-w-xs">
                <div
                  className={`transition-all duration-1000 delay-700 ${
                    isLoaded
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  <h1 className="text-white text-center text-5xl font-bold mb-1">
                    Safe
                    <span className="font-extrabold text-[#09839C]">
                      {" "}
                      Nurse{" "}
                    </span>
                  </h1>
                </div>
                <h2
                  className={`text-white text-center text-5xl font-extrabold mb-8 transition-all duration-1000 delay-800 ${
                    isLoaded
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  Log<span className="text-[#09839C]">in</span>
                </h2>
                <form
                  className={`space-y-6 transition-all duration-1000 delay-1000 ${
                    isLoaded
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  onSubmit={handleSubmit}
                >
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
                      <i className="fas fa-envelope text-[#0E364A] text-lg"></i>
                    </div>
                  </div>
                  <div>
                    <label
                      className="block text-white font-semibold text-lg mb-1"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <div className="flex items-center border-b border-[#0E364A]">
                      <input
                        className="bg-transparent text-black placeholder-[#a0cbd9] text-sm font-normal focus:outline-none w-full py-1 focus:scale-105 transition-transform duration-300"
                        id="password"
                        placeholder="***************"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <i
                        className={`fas ${
                          showPassword ? "fa-eye-slash" : "fa-eye"
                        } text-[#0E364A] text-lg cursor-pointer hover:scale-110 transition-transform duration-200`}
                        onClick={() => setShowPassword(!showPassword)}
                      ></i>
                    </div>
                  </div>
                  <div className="text-[#0E364A] text-lg underline text-right cursor-pointer hover:scale-105 transition-transform duration-200">
                    <a href="/forgot-password">Lupa kata sandi?</a>
                  </div>
                  <button
                    className="mt-6 bg-[#0E364A] text-white font-semibold text-lg rounded-lg py-2 w-full hover:brightness-110 hover:scale-105 transition-all duration-300"
                    type="submit"
                  >
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right side image with angled shapes */}
          <div
            id="right-side"
            className={`hidden md:flex md:w-1/2 relative items-center justify-center overflow-hidden transition-all duration-1000 delay-600 ${
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
            style={{
              background: "linear-gradient(180deg, #b9dce3 0%, #0a7a9a 100%)",
            }}
          >
            <Image
              alt="Background medical icons with microphone, clipboard, and sound waves in light blue shades"
              className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none select-none"
              src="/bgperawat.png"
              fill
              style={{ zIndex: 0 }}
            />
            <Image
              alt="Photo of a doctor and nurse pointing at a clipboard with medical documents"
              className="absolute inset-0 w-full h-full object-cover z-10 hover:scale-105 transition-transform duration-500"
              src="/dokterkanan.png"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </section>
      </main>

      {/* Sticky Footer */}
      <footer className="mt-auto bg-[#0B7A95] text-white py-4 px-6">
        <div className="text-center space-y-1">
          <p className="text-sm font-medium">
            Copyright 2025 © SAFE-Nurse Universitas Hasanuddin.
          </p>
          <p className="text-xs text-white/80">Penelitian Tesis Magister Kemdiktisaintek</p>
        </div>
      </footer>

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
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            style: {
              background: "#10B981",
            },
          },
          error: {
            style: {
              background: "#EF4444",
            },
          },
        }}
      />
    </div>
  );
}
