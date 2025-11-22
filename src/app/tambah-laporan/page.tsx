"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { toast, Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface JwtPayload {
  role: string;
  exp?: number;
  iat?: number;
}

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface ReportData {
  namaPasien: string;
  noRM: string;
  umur: string;
  jenisKelamin: string;
  tglMasukRS: string;
  unitPelapor: string;
  lokasiInsiden: string;
  tglKejadian: string;
  yangDilaporkan: string;
  judulInsiden: string;
  kronologi: string;
  tindakanSegera: string;
  tindakanOleh: string;
  dampakInsiden: string;
  frekuensiKejadian: string;
}

export default function TambahLaporanPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Halo, apakah Anda ingin melaporkan insiden?",
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const checkTokenValidity = () => {
    const token = Cookies.get("token");
    if (!token) {
      logoutUser();
      return;
    }

    try {
      const decoded: JwtPayload = jwtDecode(token);
      if (!decoded.exp) return;

      const now = Date.now() / 1000; // dalam detik
      const timeLeft = decoded.exp - now;

      if (timeLeft <= 0) {
        logoutUser();
      }
    } catch (err) {
      console.error("Token invalid:", err);
      logoutUser();
    }
  };

  // === 🚪 Fungsi Logout ===
  const logoutUser = () => {
    Cookies.remove("token");
    Cookies.set("session_expired", "1", { path: "/" });
    router.push("/login");
  };

  useEffect(() => {
    checkTokenValidity(); // cek pertama kali
    const interval = setInterval(() => {
      checkTokenValidity();
    }, 3000); // tiap 5 detik

    return () => clearInterval(interval);
  }, []);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px"; // max 3 baris
    }
  });

  const [currentStep, setCurrentStep] = useState("greeting");
  const [inputValue, setInputValue] = useState("");
  const [reportData, setReportData] = useState({
    namaPasien: "",
    noRM: "",
    umur: "",
    jenisKelamin: "",
    tglMasukRS: "",
    unitPelapor: "",
    lokasiInsiden: "",
    tglKejadian: "",
    yangDilaporkan: "",
    judulInsiden: "",
    kronologi: "",
    tindakanSegera: "",
    tindakanOleh: "",
    dampakInsiden: "",
    frekuensiKejadian: "",
    kategori: "",
  });
  // Ambil token dari cookies
  const token = Cookies.get("token");
  const [isListening, setIsListening] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProcessingResponse, setIsProcessingResponse] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedIncidentDate, setSelectedIncidentDate] = useState("");
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    const token = Cookies.get("token");
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/notifikasi/new`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Gagal mengambil notifikasi baru");

      const resData = await res.json();
      console.log("Data notifikasi baru:", resData);

      // Hitung jumlah data notifikasi yang dikembalikan
      const countBaru = resData?.data?.length || 0;
      setNewNotificationCount(countBaru);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (sender: string, text: string) => {
    const newMessage = {
      id: messages.length + 1,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    if (isProcessingResponse) return;

    addMessage("user", inputValue);
    processUserResponse(inputValue);
    setInputValue("");
  };

  const saveToLocalStorage = (data: ReportData) => {
    localStorage.setItem("reportData", JSON.stringify(data));
  };

  const generateReportSummary = (data: ReportData) => {
    return (
      `**Ringkasan Laporan Insiden**\n\n` +
      `**Data Pasien**\n` +
      `1. Nama Pasien : ${data.namaPasien}\n` +
      `2. No. RM : ${data.noRM}\n` +
      `3. Umur : ${data.umur}\n` +
      `4. Jenis Kelamin : ${data.jenisKelamin}\n` +
      `5. Tanggal Masuk RS : ${data.tglMasukRS}\n\n` +
      `**Rincian Kejadian**\n` +
      `1. Unit Pelapor : ${data.unitPelapor}\n` +
      `2. Lokasi Insiden : ${data.lokasiInsiden}\n` +
      `3. Tanggal/Jam Kejadian : ${data.tglKejadian}\n` +
      `4. Yang Dilaporkan : ${data.yangDilaporkan}\n` +
      `5. Judul Insiden : ${data.judulInsiden}\n` +
      `6. Kronologi : ${data.kronologi}\n` +
      `7. Tindakan Segera : ${data.tindakanSegera}\n` +
      `8. Tindakan Oleh : ${data.tindakanOleh}\n` +
      `9. Dampak Insiden : ${data.dampakInsiden}\n` +
      `10. Frekuensi Kejadian : ${data.frekuensiKejadian}`
    );
  };

  const processUserResponse = (response: string) => {
    setIsProcessingResponse(true);
    setTimeout(() => {
      const updatedData = { ...reportData };
      // Helper reusable
      const cleanAndGenerateSummary = async (updatedData: any) => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API}/laporan/clean`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                nama_pasien: updatedData.namaPasien,
                no_rm: updatedData.noRM,
                umur: updatedData.umur,
                jenis_kelamin: updatedData.jenisKelamin,
                tgl_msk_rs: updatedData.tglMasukRS,
                unit_yang_melaporkan: updatedData.unitPelapor,
                lokasi_insiden: updatedData.lokasiInsiden,
                tgl_insiden: updatedData.tglKejadian,
                yang_dilaporkan: updatedData.yangDilaporkan,
                judul_insiden: updatedData.judulInsiden,
                kronologi: updatedData.kronologi,
                tindakan_awal: updatedData.tindakanSegera,
                tindakan_oleh: updatedData.tindakanOleh,
                dampak: updatedData.dampakInsiden,
                probabilitas: updatedData.frekuensiKejadian,
              }),
            }
          );

          const result = await res.json();

          if (res.ok && result.data) {
            const clean = result.data;

            // update state reportData dengan hasil clean
            const updatedWithClean = {
              namaPasien: clean.nama_pasien,
              noRM: clean.no_rm,
              umur: clean.umur,
              jenisKelamin: clean.jenis_kelamin,
              tglMasukRS: clean.tgl_msk_rs,
              unitPelapor: clean.unit_yang_melaporkan,
              lokasiInsiden: clean.lokasi_insiden,
              tglKejadian: clean.tgl_insiden,
              yangDilaporkan: clean.yang_dilaporkan,
              judulInsiden: clean.judul_insiden,
              kronologi: clean.kronologi,
              tindakanSegera: clean.tindakan_awal,
              tindakanOleh: clean.tindakan_oleh,
              dampakInsiden: clean.dampak,
              frekuensiKejadian: clean.probabilitas,
              kategori: clean.kategori,
            };

            setReportData(updatedWithClean);
            saveToLocalStorage(updatedWithClean);

            // tetap generate summary untuk user
            const summary =
              `**Ringkasan Laporan Insiden (Versi Bersih)**\n\n` +
              `**Data Pasien**\n` +
              `1. Nama Pasien : ${clean.nama_pasien}\n` +
              `2. No. RM : ${clean.no_rm}\n` +
              `3. Umur : ${clean.umur}\n` +
              `4. Jenis Kelamin : ${clean.jenis_kelamin}\n` +
              `5. Tanggal Masuk RS : ${clean.tgl_msk_rs}\n\n` +
              `**Rincian Kejadian**\n` +
              `1. Unit Pelapor : ${clean.unit_yang_melaporkan}\n` +
              `2. Lokasi Insiden : ${clean.lokasi_insiden}\n` +
              `3. Tanggal/Jam Kejadian : ${clean.tgl_insiden}\n` +
              `4. Yang Dilaporkan : ${clean.yang_dilaporkan}\n` +
              `5. Judul Insiden : ${clean.judul_insiden}\n` +
              `6. Kronologi : ${clean.kronologi}\n` +
              `7. Tindakan Segera : ${clean.tindakan_awal}\n` +
              `8. Tindakan Oleh : ${clean.tindakan_oleh}\n` +
              `9. Dampak Insiden : ${clean.dampak}\n` +
              `10. Frekuensi Kejadian : ${clean.probabilitas}\n`;

            addMessage("bot", summary);

            setTimeout(() => {
              addMessage("bot", "Apakah laporan sudah sesuai?");
              setCurrentStep("konfirmasi");
            }, 2000);
          } else {
            addMessage(
              "bot",
              result.message || "Gagal membersihkan data laporan."
            );
          }
        } catch (err) {
          console.error("Error generate summary:", err);
          addMessage(
            "bot",
            "Terjadi kesalahan saat generate ringkasan laporan."
          );
        } finally {
          setIsProcessingResponse(false);
        }
      };

      switch (currentStep) {
        case "greeting":
          if (
            response.toLowerCase().includes("ya") ||
            response.toLowerCase().includes("iya")
          ) {
            addMessage("bot", "Nama pasien?");
            setCurrentStep("namaPasien");
          } else {
            addMessage(
              "bot",
              "Terima kasih. Jika suatu saat Anda ingin melaporkan insiden, silakan buka kembali aplikasi ini."
            );
            setCurrentStep("end");
          }
          break;

        case "namaPasien":
          updatedData.namaPasien = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          addMessage("bot", "No.RM?");
          setCurrentStep("noRM");
          break;

        case "noRM":
          updatedData.noRM = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          addMessage("bot", "Umur?");
          setCurrentStep("umur");
          break;

        case "umur":
          updatedData.umur = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          addMessage("bot", "Jenis Kelamin?");
          setCurrentStep("jenisKelamin");
          break;

        case "jenisKelamin":
          updatedData.jenisKelamin = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          addMessage("bot", "Tanggal masuk RS?");
          setCurrentStep("tglMasukRS");
          break;

        case "tglMasukRS":
          updatedData.tglMasukRS = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          addMessage("bot", "Unit yang melaporkan?");
          setCurrentStep("unitPelapor");
          break;

        case "unitPelapor":
          updatedData.unitPelapor = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          addMessage("bot", "Lokasi insiden?");
          setCurrentStep("lokasiInsiden");
          break;

        case "lokasiInsiden":
          updatedData.lokasiInsiden = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          addMessage("bot", "Tgl/bulan/tahun/jam terjadinya insiden?");
          setCurrentStep("tglKejadian");
          break;

        case "tglKejadian":
          updatedData.tglKejadian = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          addMessage("bot", "Yang Dilaporkan?");
          setCurrentStep("yangDilaporkan");
          break;

        case "yangDilaporkan":
          updatedData.yangDilaporkan = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          addMessage("bot", "Judul Insiden?");
          setCurrentStep("judulInsiden");
          break;

        case "judulInsiden":
          updatedData.judulInsiden = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          addMessage(
            "bot",
            "Jelaskan kronologi insiden secara detail dan berurutan. Untuk memastikan laporan Anda lengkap, mohon sertakan informasi berikut:\n\nSiapa: Nama pasien dan staf yang terlibat atau merespons pertama kali.\n\nKapan & Di Mana: Tanggal, jam, dan lokasi spesifik kejadian.\n\nApa & Bagaimana: Apa insiden yang terjadi dan bagaimana urutan kejadiannya dari awal hingga akhir.\n\nMengapa: Dugaan penyebab atau faktor yang berkontribusi pada insiden. (Jika teridentifikasi)"
          );
          setCurrentStep("kronologi");
          break;

        case "kronologi":
          // Simpan sementara dulu kronologi yang diinput user
          updatedData.kronologi = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);

          const validateChronology = async () => {
            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API}/laporan/validateChronology`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    chronology: response,
                    judul_insiden: response,
                  }),
                }
              );

              const data = await res.json();

              if (data.is_lengkap) {
                // Kronologi sudah lengkap: langsung lanjut ke pertanyaan berikutnya
                addMessage(
                  "bot",
                  "Tindakan yang dilakukan segera setelah kejadian & apa hasilnya?"
                );
                setCurrentStep("tindakanSegera");
              } else {
                // Kronologi belum lengkap: tampilkan ulang kronologi, evaluasi, dan minta konfirmasi/revisi
                addMessage(
                  "bot",
                  `Berikut kronologi yang Anda sampaikan:\n\n${updatedData.kronologi}`
                );
                addMessage(
                  "bot",
                  `Kronologi belum lengkap. Evaluasi:\n\n${data.evaluasi}`
                );
                addMessage("bot", "Apakah kronologi sudah sesuai?");
                setCurrentStep("konfirmasiKronologi");
              }
            } catch (error) {
              console.error("Error validate chronology:", error);
              addMessage(
                "bot",
                "Terjadi kesalahan saat validasi kronologi. Coba lagi ya."
              );
              setCurrentStep("kronologi");
            } finally {
              setIsProcessingResponse(false);
            }
          };

          validateChronology();
          // Jangan set false di sini karena API masih berjalan
          return; // Return early untuk skip setIsProcessingResponse(false) di bawah

        case "tindakanSegera":
          updatedData.tindakanSegera = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          addMessage("bot", "Tindakan diberikan oleh?");
          setCurrentStep("tindakanOleh");
          break;

        case "tindakanOleh":
          updatedData.tindakanOleh = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          addMessage("bot", "Dampak insiden terhadap pasien:");
          setCurrentStep("dampakInsiden");
          break;

        case "dampakInsiden":
          updatedData.dampakInsiden = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          addMessage(
            "bot",
            "Seberapa sering kejadian yang sama terjadi di unit tempat anda bekerja?"
          );
          setCurrentStep("frekuensiKejadian");
          break;

        case "frekuensiKejadian":
          updatedData.frekuensiKejadian = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);

          // Ubah currentStep terlebih dahulu agar tombol hilang
          setCurrentStep("processing");

          cleanAndGenerateSummary(updatedData);

          return; // Return early untuk skip setIsProcessingResponse(false) di bawah

        case "konfirmasiKronologi":
          if (
            response.toLowerCase().includes("konfirmasi") ||
            response.toLowerCase().includes("lanjut") ||
            response.toLowerCase().includes("sesuai")
          ) {
            addMessage(
              "bot",
              "Tindakan yang dilakukan segera setelah kejadian & apa hasilnya?"
            );
            setCurrentStep("tindakanSegera");
          } else if (
            response.toLowerCase().includes("revisi") ||
            response.toLowerCase().includes("ubah") ||
            response.toLowerCase().includes("tidak sesuai")
          ) {
            addMessage(
              "bot",
              "Silakan masukkan kronologi ulang dengan lebih lengkap."
            );
            setInputValue(updatedData.kronologi || "");
            setCurrentStep("kronologi");
          } else {
            addMessage(
              "bot",
              'Mohon pilih "Konfirmasi & Lanjut" atau "Revisi Kronologi".'
            );
          }
          break;

        case "konfirmasiKronologiEdit":
          if (
            response.toLowerCase().includes("konfirmasi") ||
            response.toLowerCase().includes("lanjut") ||
            response.toLowerCase().includes("sesuai")
          ) {
            // Lanjut: generate ringkasan baru dan kembali ke konfirmasi
            setCurrentStep("processing");
            cleanAndGenerateSummary(updatedData);
            return; // Skip setIsProcessingResponse(false) di bawah
          } else if (
            response.toLowerCase().includes("revisi") ||
            response.toLowerCase().includes("ubah") ||
            response.toLowerCase().includes("tidak sesuai")
          ) {
            addMessage(
              "bot",
              "Silakan masukkan kronologi ulang dengan lebih lengkap."
            );
            setInputValue(updatedData.kronologi || "");
            setCurrentStep("editKronologi");
          } else {
            addMessage(
              "bot",
              'Mohon pilih "Konfirmasi & Lanjut" atau "Revisi Kronologi".'
            );
          }
          break;

        case "konfirmasi":
          if (
            response.toLowerCase().includes("sesuai") &&
            !response.toLowerCase().includes("belum") &&
            !response.toLowerCase().includes("tidak")
          ) {
            // Kirim laporan ke backend
            const submitLaporan = async () => {
              setIsSubmittingReport(true);
              addMessage(
                "bot",
                "Sedang memproses laporan Anda, mohon tunggu..."
              );

              try {
                const res = await fetch(
                  `${process.env.NEXT_PUBLIC_BACKEND_API}/laporan/generate`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      nama_pasien: reportData.namaPasien,
                      no_rm: reportData.noRM,
                      umur: reportData.umur,
                      jenis_kelamin: reportData.jenisKelamin,
                      tgl_msk_rs: reportData.tglMasukRS,
                      unit_yang_melaporkan: reportData.unitPelapor,
                      lokasi_insiden: reportData.lokasiInsiden,
                      tgl_insiden: reportData.tglKejadian,
                      yang_dilaporkan: reportData.yangDilaporkan,
                      judul_insiden: reportData.judulInsiden,
                      kronologi: reportData.kronologi,
                      tindakan_awal: reportData.tindakanSegera,
                      tindakan_oleh: reportData.tindakanOleh,
                      dampak: reportData.dampakInsiden,
                      probabilitas: reportData.frekuensiKejadian,
                      kategori: reportData.kategori,
                    }),
                  }
                );

                const result = await res.json();

                console.log(result);

                if (res.ok) {
                  addMessage(
                    "bot",
                    "Terima kasih, laporan berhasil dikirimkan dan tersimpan. Jaga kesehatan dan tetap semangat!"
                  );
                  setCurrentStep("end");
                } else {
                  addMessage(
                    "bot",
                    result.message ||
                      "Gagal mengirim laporan. Silakan coba lagi."
                  );
                }
              } catch (err) {
                console.error("Error submit laporan:", err);
                addMessage(
                  "bot",
                  "Terjadi kesalahan saat mengirim laporan. Silakan coba lagi."
                );
              } finally {
                setIsSubmittingReport(false);
                // Pastikan loading dihilangkan setelah API selesai
                setIsProcessingResponse(false);
              }
            };

            submitLaporan();
            // Jangan set false di sini karena API masih berjalan
            return; // Return early untuk skip setIsProcessingResponse(false) di bawah
          } else if (
            response.toLowerCase().includes("belum") ||
            response.toLowerCase().includes("tidak") ||
            response.toLowerCase().includes("ubah")
          ) {
            addMessage("bot", "Bagian mana yang mau diubah?");
            setCurrentStep("pilihKategori");
          } else {
            addMessage("bot", "Mohon pilih 'Sesuai' atau 'Belum sesuai'.");
          }
          break;

        case "pilihKategori":
          if (
            response === "1" ||
            response.toLowerCase().includes("data pasien")
          ) {
            addMessage("bot", "Bagian mana yang mau diubah?");
            setCurrentStep("pilihDataPasien");
          } else if (
            response === "2" ||
            response.toLowerCase().includes("rincian kejadian")
          ) {
            addMessage("bot", "Bagian mana yang mau diubah?");
            setCurrentStep("pilihRincianKejadian");
          } else {
            addMessage("bot", "Mohon pilih salah satu opsi yang tersedia.");
          }
          break;

        case "pilihDataPasien":
          const nomorDataPasien = parseInt(response.trim());
          if (nomorDataPasien >= 1 && nomorDataPasien <= 5) {
            switch (nomorDataPasien) {
              case 1:
                addMessage("bot", "Berikan jawaban barunya:");
                setInputValue(reportData.namaPasien || "");
                setCurrentStep("editNamaPasien");
                break;
              case 2:
                addMessage("bot", "Berikan jawaban barunya:");
                setInputValue(reportData.noRM || "");
                setCurrentStep("editNoRM");
                break;
              case 3:
                addMessage("bot", "Berikan jawaban barunya:");
                setInputValue(reportData.umur || "");
                setCurrentStep("editUmur");
                break;
              case 4:
                addMessage("bot", "Berikan jawaban barunya:");
                setCurrentStep("editJenisKelamin");
                break;
              case 5:
                addMessage("bot", "Berikan jawaban barunya:");
                setCurrentStep("editTglMasukRS");
                break;
            }
          } else {
            addMessage("bot", "Mohon masukkan nomor yang valid (1-5).");
          }
          break;

        case "pilihRincianKejadian":
          const nomorRincian = parseInt(response.trim());
          if (nomorRincian >= 1 && nomorRincian <= 10) {
            switch (nomorRincian) {
              case 1:
                addMessage("bot", "Berikan jawaban barunya:");
                setInputValue(reportData.unitPelapor || "");
                setCurrentStep("editUnitPelapor");
                break;
              case 2:
                addMessage("bot", "Berikan jawaban barunya:");
                setInputValue(reportData.lokasiInsiden || "");
                setCurrentStep("editLokasiInsiden");
                break;
              case 3:
                addMessage("bot", "Berikan jawaban barunya:");
                setCurrentStep("editTglKejadian");
                break;
              case 4:
                addMessage("bot", "Berikan jawaban barunya:");
                setInputValue(reportData.yangDilaporkan || "");
                setCurrentStep("editYangDilaporkan");
                break;
              case 5:
                addMessage("bot", "Berikan jawaban barunya:");
                setInputValue(reportData.judulInsiden || "");
                setCurrentStep("editJudulInsiden");
                break;
              case 6:
                addMessage("bot", "Berikan jawaban barunya:");
                setInputValue(reportData.kronologi || "");
                setCurrentStep("editKronologi");
                break;
              case 7:
                addMessage("bot", "Berikan jawaban barunya:");
                setInputValue(reportData.tindakanSegera || "");
                setCurrentStep("editTindakanSegera");
                break;
              case 8:
                addMessage("bot", "Berikan jawaban barunya:");
                setInputValue(reportData.tindakanOleh || "");
                setCurrentStep("editTindakanOleh");
                break;
              case 9:
                addMessage("bot", "Berikan jawaban barunya:");
                setCurrentStep("editDampakInsiden");
                break;
              case 10:
                addMessage("bot", "Berikan jawaban barunya:");
                setCurrentStep("editFrekuensiKejadian");
                break;
            }
          } else {
            addMessage("bot", "Mohon masukkan nomor yang valid (1-10).");
          }
          break;

        // Edit cases for Data Pasien
        case "editNamaPasien":
          updatedData.namaPasien = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          cleanAndGenerateSummary(updatedData);
          return;

        case "editNoRM":
          updatedData.noRM = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          cleanAndGenerateSummary(updatedData);
          return;

        case "editUmur":
          updatedData.umur = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          cleanAndGenerateSummary(updatedData);
          return;

        case "editJenisKelamin":
          // Tidak langsung memproses response, karena akan menggunakan sistem tombol opsi
          // Response akan diproses melalui tombol pilihan di UI
          break;

        case "editTglMasukRS":
          // Tidak langsung memproses response, karena akan menggunakan sistem kalender
          // Response akan diproses melalui tombol konfirmasi di UI
          break;

        // Edit cases for Rincian Kejadian
        case "editUnitPelapor":
          updatedData.unitPelapor = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          cleanAndGenerateSummary(updatedData);
          return;

        case "editLokasiInsiden":
          updatedData.lokasiInsiden = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          cleanAndGenerateSummary(updatedData);
          return;

        case "editYangDilaporkan":
          updatedData.yangDilaporkan = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          cleanAndGenerateSummary(updatedData);
          return;

        case "editJudulInsiden":
          updatedData.judulInsiden = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          cleanAndGenerateSummary(updatedData);
          return;

        case "editKronologi":
          updatedData.kronologi = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);

          const validateEditedChronology = async () => {
            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API}/laporan/validateChronology`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    chronology: response,
                    judul_insiden: response,
                  }),
                }
              );

              const data = await res.json();

              if (data.is_lengkap) {
                // Kronologi edit dinyatakan lengkap: tampilkan kronologi baru untuk konfirmasi
                addMessage(
                  "bot",
                  `Berikut kronologi yang Anda sampaikan:\n\n${updatedData.kronologi}`
                );
                addMessage("bot", "Apakah kronologi sudah sesuai?");
                setCurrentStep("konfirmasiKronologiEdit");
                setIsProcessingResponse(false);
              } else {
                // Kronologi edit belum lengkap: tampilkan kronologi baru, evaluasi, dan minta konfirmasi/revisi
                addMessage(
                  "bot",
                  `Berikut kronologi yang Anda sampaikan:\n\n${updatedData.kronologi}`
                );
                addMessage(
                  "bot",
                  `Kronologi edit belum lengkap. Evaluasi:\n\n${data.evaluasi}`
                );
                addMessage("bot", "Apakah kronologi sudah sesuai?");
                setCurrentStep("konfirmasiKronologiEdit");
                setIsProcessingResponse(false);
              }
            } catch (error) {
              console.error("Error validate edited chronology:", error);
              addMessage(
                "bot",
                "Terjadi kesalahan saat validasi kronologi edit. Coba lagi ya."
              );
              setInputValue(updatedData.kronologi || "");
              setCurrentStep("editKronologi");
              setIsProcessingResponse(false);
            }
          };

          validateEditedChronology();
          return;

        case "editTindakanSegera":
          updatedData.tindakanSegera = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          cleanAndGenerateSummary(updatedData);
          return;

        case "editTindakanOleh":
          updatedData.tindakanOleh = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          cleanAndGenerateSummary(updatedData);
          return;

        case "editDampakInsiden":
          // Tidak langsung memproses response, karena akan menggunakan sistem tombol opsi
          // Response akan diproses melalui tombol pilihan di UI
          break;

        case "editFrekuensiKejadian":
          // Response akan diproses melalui tombol opsi pilihan di UI
          break;

        default:
          break;
      }
      setIsProcessingResponse(false);
    }, 1000);
  };

  const handleQuickResponse = (response: string) => {
    if (isProcessingResponse) return; // Prevent multiple submissions during processing
    addMessage("user", response);
    processUserResponse(response);
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isFirefox = /firefox/i.test(navigator.userAgent);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const startVoiceRecognition = async () => {
    if (isListening) {
      // ✅ Kalau lagi merekam → stop manual
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      setIsListening(false);
      return;
    }

    const supportsSpeechRecognition =
      "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

    if (supportsSpeechRecognition && !isIOS && !isSafari && !isFirefox) {
      // ✅ Browser support SpeechRecognition (Chrome/Edge)
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = "id-ID";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue((prevValue) =>
          prevValue ? `${prevValue} ${transcript}` : transcript
        );
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } else {
      // 🚀 Fallback Safari / iOS / Firefox
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaStreamRef.current = stream;

        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/mp4";

        const mediaRecorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = mediaRecorder;

        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(chunks, { type: "audio/webm" });
          const formData = new FormData();
          formData.append("file", audioBlob, "recording.webm");

          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_API}/transcribe`,
              {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
              }
            );
            if (!res.ok) throw new Error("Transkripsi gagal");

            const data = await res.json();
            if (data.text) {
              setInputValue((prev) =>
                prev ? `${prev} ${data.text}` : data.text
              );
            }
          } catch {
            toast.error("Gagal transkripsi audio");
          }

          // 🔥 Pastikan stream benar-benar stop
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            mediaStreamRef.current = null;
          }

          setIsListening(false);
        };

        setIsListening(true);
        mediaRecorder.start();

        // Auto stop setelah 5 menit (jika user tidak klik stop)
        setTimeout(() => {
          if (mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
          }
        }, 300000);
      } catch {
        toast.error("Izin mikrofon ditolak atau tidak tersedia");
        setIsListening(false);
      }
    }
  };

  const renderQuickButtons = () => {
    if (currentStep === "greeting") {
      return (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleQuickResponse("Ya")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            Ya
          </button>
          <button
            onClick={() => handleQuickResponse("Tidak")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-gray-500 text-white hover:bg-gray-600"
            }`}
          >
            Tidak
          </button>
        </div>
      );
    }

    if (currentStep === "konfirmasiKronologi") {
      return (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleQuickResponse("Konfirmasi & Lanjut")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            Konfirmasi & Lanjut
          </button>
          <button
            onClick={() => handleQuickResponse("Revisi Kronologi")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-gray-500 text-white hover:bg-gray-600"
            }`}
          >
            Revisi Kronologi
          </button>
        </div>
      );
    }

    if (currentStep === "konfirmasiKronologiEdit") {
      return (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleQuickResponse("Konfirmasi & Lanjut")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            Konfirmasi & Lanjut
          </button>
          <button
            onClick={() => handleQuickResponse("Revisi Kronologi")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-gray-500 text-white hover:bg-gray-600"
            }`}
          >
            Revisi Kronologi
          </button>
        </div>
      );
    }

    if (currentStep === "tglMasukRS") {
      return (
        <div className="mb-4">
          <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Tanggal Masuk RS:
            </label>
            <input
              type="date"
              value={selectedDate}
              disabled={isProcessingResponse}
              onChange={(e) => {
                setSelectedDate(e.target.value);
              }}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7A95] focus:border-transparent text-black ${
                isProcessingResponse ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
            {selectedDate && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    if (!isProcessingResponse) {
                      const formattedDate = new Date(
                        selectedDate
                      ).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      });
                      handleQuickResponse(formattedDate);
                      setSelectedDate("");
                    }
                  }}
                  disabled={isProcessingResponse}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    isProcessingResponse
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
                  }`}
                >
                  Konfirmasi Tanggal
                </button>
                <button
                  onClick={() => setSelectedDate("")}
                  disabled={isProcessingResponse}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    isProcessingResponse
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-gray-500 text-white hover:bg-gray-600"
                  }`}
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (currentStep === "jenisKelamin") {
      return (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleQuickResponse("Laki-laki")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            Laki-laki
          </button>
          <button
            onClick={() => handleQuickResponse("Perempuan")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            Perempuan
          </button>
        </div>
      );
    }

    if (currentStep === "editJenisKelamin") {
      return (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              if (!isProcessingResponse) {
                // Langsung set processing untuk mencegah spam
                setIsProcessingResponse(true);
                setCurrentStep("processing");

                // Update data
                const updatedData = { ...reportData };
                updatedData.jenisKelamin = "Laki-laki";
                setReportData(updatedData);
                saveToLocalStorage(updatedData);

                // Generate summary and return to confirmation
                const summaryAfterEditJenisKelamin =
                  generateReportSummary(updatedData);
                addMessage("bot", summaryAfterEditJenisKelamin);
                setTimeout(() => {
                  addMessage("bot", "Apakah laporan sudah sesuai?");
                  setCurrentStep("konfirmasi");
                  setIsProcessingResponse(false);
                }, 2000);
              }
            }}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            Laki-laki
          </button>
          <button
            onClick={() => {
              if (!isProcessingResponse) {
                // Langsung set processing untuk mencegah spam
                setIsProcessingResponse(true);
                setCurrentStep("processing");

                // Update data
                const updatedData = { ...reportData };
                updatedData.jenisKelamin = "Perempuan";
                setReportData(updatedData);
                saveToLocalStorage(updatedData);

                // Generate summary and return to confirmation
                const summaryAfterEditJenisKelamin =
                  generateReportSummary(updatedData);
                addMessage("bot", summaryAfterEditJenisKelamin);
                setTimeout(() => {
                  addMessage("bot", "Apakah laporan sudah sesuai?");
                  setCurrentStep("konfirmasi");
                  setIsProcessingResponse(false);
                }, 2000);
              }
            }}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            Perempuan
          </button>
        </div>
      );
    }

    if (currentStep === "konfirmasi") {
      return (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleQuickResponse("Sesuai")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            Sesuai
          </button>
          <button
            onClick={() => handleQuickResponse("Belum sesuai")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-gray-500 text-white hover:bg-gray-600"
            }`}
          >
            Belum sesuai
          </button>
        </div>
      );
    }

    if (currentStep === "pilihKategori") {
      return (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleQuickResponse("1")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            1. Data Pasien
          </button>
          <button
            onClick={() => handleQuickResponse("2")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            2. Rincian Kejadian
          </button>
        </div>
      );
    }

    if (currentStep === "pilihDataPasien") {
      return (
        <div className="flex flex-col items-start gap-2 mb-4">
          <button
            onClick={() => handleQuickResponse("1")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors inline-block ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            1. Nama Pasien
          </button>
          <button
            onClick={() => handleQuickResponse("2")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors inline-block ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            2. No. RM
          </button>
          <button
            onClick={() => handleQuickResponse("3")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors inline-block ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            3. Umur
          </button>
          <button
            onClick={() => handleQuickResponse("4")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors inline-block ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            4. Jenis Kelamin
          </button>
          <button
            onClick={() => handleQuickResponse("5")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors inline-block ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            5. Tanggal Masuk RS
          </button>
        </div>
      );
    }

    if (currentStep === "pilihRincianKejadian") {
      return (
        <div className="flex flex-col items-start gap-2 mb-4">
          <button
            onClick={() => handleQuickResponse("1")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors inline-block ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            1. Unit Pelapor
          </button>
          <button
            onClick={() => handleQuickResponse("2")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors inline-block ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            2. Lokasi Kejadian
          </button>
          <button
            onClick={() => handleQuickResponse("3")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors inline-block ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            3. Tanggal/Jam Kejadian
          </button>
          <button
            onClick={() => handleQuickResponse("4")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors inline-block ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            4. Yang Dilaporkan
          </button>
          <button
            onClick={() => handleQuickResponse("5")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors inline-block ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            5. Judul Insiden
          </button>
          <button
            onClick={() => handleQuickResponse("6")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors inline-block ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            6. Kronologi
          </button>
          <button
            onClick={() => handleQuickResponse("7")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors inline-block ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            7. Tindakan Segera
          </button>
          <button
            onClick={() => handleQuickResponse("8")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors inline-block ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            8. Tindakan Oleh
          </button>
          <button
            onClick={() => handleQuickResponse("9")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors inline-block ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            9. Dampak Insiden
          </button>
          <button
            onClick={() => handleQuickResponse("10")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors inline-block ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            10. Frekuensi Kejadian
          </button>
        </div>
      );
    }

    if (currentStep === "tglKejadian") {
      return (
        <div className="mb-4">
          <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Tanggal/Jam Kejadian Insiden:
            </label>
            <input
              type="datetime-local"
              value={selectedIncidentDate}
              disabled={isProcessingResponse}
              onChange={(e) => {
                setSelectedIncidentDate(e.target.value);
              }}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7A95] focus:border-transparent text-black ${
                isProcessingResponse ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
            {selectedIncidentDate && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    if (!isProcessingResponse) {
                      const selectedDateTime = new Date(selectedIncidentDate);
                      const formattedDateTime =
                        selectedDateTime.toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }) +
                        " " +
                        selectedDateTime
                          .toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false, // supaya format 24 jam
                          })
                          .replace(/\./g, ":"); // ganti titik jadi :;
                      handleQuickResponse(formattedDateTime);
                      setSelectedIncidentDate("");
                    }
                  }}
                  disabled={isProcessingResponse}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    isProcessingResponse
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
                  }`}
                >
                  Konfirmasi Tanggal & Jam
                </button>
                <button
                  onClick={() => setSelectedIncidentDate("")}
                  disabled={isProcessingResponse}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    isProcessingResponse
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-gray-500 text-white hover:bg-gray-600"
                  }`}
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (currentStep === "editTglMasukRS") {
      return (
        <div className="mb-4">
          <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Tanggal Masuk RS Baru:
            </label>
            <input
              type="date"
              value={selectedDate}
              disabled={isProcessingResponse}
              onChange={(e) => {
                setSelectedDate(e.target.value);
              }}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7A95] focus:border-transparent text-black ${
                isProcessingResponse ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
            {selectedDate && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    if (!isProcessingResponse) {
                      const selectedDateObj = new Date(selectedDate);
                      const formattedDate = selectedDateObj.toLocaleDateString(
                        "id-ID",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      );

                      // Update data
                      const updatedData = { ...reportData };
                      updatedData.tglMasukRS = formattedDate;
                      setReportData(updatedData);
                      saveToLocalStorage(updatedData);

                      // Generate summary and return to confirmation
                      const summaryAfterEditTglMasuk =
                        generateReportSummary(updatedData);
                      addMessage("bot", summaryAfterEditTglMasuk);
                      setTimeout(() => {
                        addMessage("bot", "Apakah laporan sudah sesuai?");
                        setCurrentStep("konfirmasi");
                      }, 2000);

                      setSelectedDate("");
                    }
                  }}
                  disabled={isProcessingResponse}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    isProcessingResponse
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
                  }`}
                >
                  Konfirmasi Tanggal
                </button>
                <button
                  onClick={() => setSelectedDate("")}
                  disabled={isProcessingResponse}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    isProcessingResponse
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-gray-500 text-white hover:bg-gray-600"
                  }`}
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (currentStep === "editTglKejadian") {
      return (
        <div className="mb-4">
          <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Tanggal/Jam Kejadian Baru:
            </label>
            <input
              type="datetime-local"
              value={selectedIncidentDate}
              disabled={isProcessingResponse}
              onChange={(e) => {
                setSelectedIncidentDate(e.target.value);
              }}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7A95] focus:border-transparent text-black ${
                isProcessingResponse ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
            {selectedIncidentDate && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    if (!isProcessingResponse) {
                      const selectedDateTime = new Date(selectedIncidentDate);
                      const formattedDateTime =
                        selectedDateTime.toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }) +
                        " " +
                        selectedDateTime
                          .toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false, // supaya format 24 jam
                          })
                          .replace(/\./g, ":"); // ganti titik jadi :;

                      // Update data
                      const updatedData = { ...reportData };
                      updatedData.tglKejadian = formattedDateTime;
                      setReportData(updatedData);
                      saveToLocalStorage(updatedData);

                      // Generate summary and return to confirmation
                      const summaryAfterEditTglKejadian =
                        generateReportSummary(updatedData);
                      addMessage("bot", summaryAfterEditTglKejadian);
                      setTimeout(() => {
                        addMessage("bot", "Apakah laporan sudah sesuai?");
                        setCurrentStep("konfirmasi");
                      }, 2000);

                      setSelectedIncidentDate("");
                    }
                  }}
                  disabled={isProcessingResponse}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    isProcessingResponse
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
                  }`}
                >
                  Konfirmasi Tanggal & Jam
                </button>
                <button
                  onClick={() => setSelectedIncidentDate("")}
                  disabled={isProcessingResponse}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    isProcessingResponse
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-gray-500 text-white hover:bg-gray-600"
                  }`}
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (currentStep === "editDampakInsiden") {
      return (
        <div className="flex flex-col gap-2 mb-4 items-start">
          <button
            onClick={() => {
              if (!isProcessingResponse) {
                // Langsung set processing untuk mencegah spam
                setIsProcessingResponse(true);
                setCurrentStep("processing");

                // Update data
                const updatedData = { ...reportData };
                updatedData.dampakInsiden = "kematian";
                setReportData(updatedData);
                saveToLocalStorage(updatedData);

                // Generate summary and return to confirmation
                const summaryAfterEditDampak =
                  generateReportSummary(updatedData);
                addMessage("bot", summaryAfterEditDampak);
                setTimeout(() => {
                  addMessage("bot", "Apakah laporan sudah sesuai?");
                  setCurrentStep("konfirmasi");
                  setIsProcessingResponse(false);
                }, 2000);
              }
            }}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors text-left w-auto inline-block ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            kematian
          </button>
          <button
            onClick={() => {
              if (!isProcessingResponse) {
                // Langsung set processing untuk mencegah spam
                setIsProcessingResponse(true);
                setCurrentStep("processing");

                // Update data
                const updatedData = { ...reportData };
                updatedData.dampakInsiden = "cidera berat";
                setReportData(updatedData);
                saveToLocalStorage(updatedData);

                // Generate summary and return to confirmation
                const summaryAfterEditDampak =
                  generateReportSummary(updatedData);
                addMessage("bot", summaryAfterEditDampak);
                setTimeout(() => {
                  addMessage("bot", "Apakah laporan sudah sesuai?");
                  setCurrentStep("konfirmasi");
                  setIsProcessingResponse(false);
                }, 2000);
              }
            }}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors text-left w-auto inline-block ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            Cidera irreversible/ cidera berat
          </button>
          <button
            onClick={() => {
              if (!isProcessingResponse) {
                // Langsung set processing untuk mencegah spam
                setIsProcessingResponse(true);
                setCurrentStep("processing");

                // Update data
                const updatedData = { ...reportData };
                updatedData.dampakInsiden = "cidera sedang";
                setReportData(updatedData);
                saveToLocalStorage(updatedData);

                // Generate summary and return to confirmation
                const summaryAfterEditDampak =
                  generateReportSummary(updatedData);
                addMessage("bot", summaryAfterEditDampak);
                setTimeout(() => {
                  addMessage("bot", "Apakah laporan sudah sesuai?");
                  setCurrentStep("konfirmasi");
                  setIsProcessingResponse(false);
                }, 2000);
              }
            }}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors text-left w-auto inline-block ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            Cidera reversible/ cidera sedang
          </button>
          <button
            onClick={() => {
              if (!isProcessingResponse) {
                // Langsung set processing untuk mencegah spam
                setIsProcessingResponse(true);
                setCurrentStep("processing");

                // Update data
                const updatedData = { ...reportData };
                updatedData.dampakInsiden = "cidera ringan";
                setReportData(updatedData);
                saveToLocalStorage(updatedData);

                // Generate summary and return to confirmation
                const summaryAfterEditDampak =
                  generateReportSummary(updatedData);
                addMessage("bot", summaryAfterEditDampak);
                setTimeout(() => {
                  addMessage("bot", "Apakah laporan sudah sesuai?");
                  setCurrentStep("konfirmasi");
                  setIsProcessingResponse(false);
                }, 2000);
              }
            }}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors text-left w-auto inline-block ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            cidera ringan
          </button>
          <button
            onClick={() => {
              if (!isProcessingResponse) {
                // Langsung set processing untuk mencegah spam
                setIsProcessingResponse(true);
                setCurrentStep("processing");

                // Update data
                const updatedData = { ...reportData };
                updatedData.dampakInsiden = "tidak ada cidera";
                setReportData(updatedData);
                saveToLocalStorage(updatedData);

                // Generate summary and return to confirmation
                const summaryAfterEditDampak =
                  generateReportSummary(updatedData);
                addMessage("bot", summaryAfterEditDampak);
                setTimeout(() => {
                  addMessage("bot", "Apakah laporan sudah sesuai?");
                  setCurrentStep("konfirmasi");
                  setIsProcessingResponse(false);
                }, 2000);
              }
            }}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors text-left w-auto inline-block ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            tidak ada cidera
          </button>
        </div>
      );
    }

    if (currentStep === "dampakInsiden") {
      return (
        <div className="flex flex-col gap-2 mb-4 items-start">
          <button
            onClick={() => handleQuickResponse("kematian")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors text-left w-auto ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            kematian
          </button>
          <button
            onClick={() => handleQuickResponse("cidera berat")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors text-left w-auto ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            Cidera irreversible/ cidera berat
          </button>
          <button
            onClick={() => handleQuickResponse("cidera sedang")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors text-left w-auto ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            Cidera reversible/ cidera sedang
          </button>
          <button
            onClick={() => handleQuickResponse("cidera ringan")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors text-left w-auto ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            cidera ringan
          </button>
          <button
            onClick={() => handleQuickResponse("tidak ada cidera")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors text-left w-auto ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            tidak ada cidera
          </button>
        </div>
      );
    }

    if (currentStep === "editFrekuensiKejadian") {
      return (
        <div className="flex flex-col gap-2 mb-4 items-start">
          <button
            onClick={() => {
              if (!isProcessingResponse) {
                // Langsung set processing untuk mencegah spam
                setIsProcessingResponse(true);
                setCurrentStep("processing");

                const updatedData = { ...reportData };
                updatedData.frekuensiKejadian = "5 tahun sekali";
                setReportData(updatedData);
                saveToLocalStorage(updatedData);
                const summaryAfterEditFrekuensi =
                  generateReportSummary(updatedData);
                addMessage("bot", summaryAfterEditFrekuensi);
                setTimeout(() => {
                  addMessage("bot", "Apakah laporan sudah sesuai?");
                  setCurrentStep("konfirmasi");
                  setIsProcessingResponse(false);
                }, 2000);
              }
            }}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors text-left w-auto ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            5 tahun sekali
          </button>
          <button
            onClick={() => {
              if (!isProcessingResponse) {
                // Langsung set processing untuk mencegah spam
                setIsProcessingResponse(true);
                setCurrentStep("processing");

                const updatedData = { ...reportData };
                updatedData.frekuensiKejadian = "2–5 tahun sekali";
                setReportData(updatedData);
                saveToLocalStorage(updatedData);
                const summaryAfterEditFrekuensi =
                  generateReportSummary(updatedData);
                addMessage("bot", summaryAfterEditFrekuensi);
                setTimeout(() => {
                  addMessage("bot", "Apakah laporan sudah sesuai?");
                  setCurrentStep("konfirmasi");
                  setIsProcessingResponse(false);
                }, 2000);
              }
            }}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors text-left w-auto ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            2–5 tahun sekali
          </button>
          <button
            onClick={() => {
              if (!isProcessingResponse) {
                // Langsung set processing untuk mencegah spam
                setIsProcessingResponse(true);
                setCurrentStep("processing");

                const updatedData = { ...reportData };
                updatedData.frekuensiKejadian = "1–2 tahun sekali";
                setReportData(updatedData);
                saveToLocalStorage(updatedData);
                const summaryAfterEditFrekuensi =
                  generateReportSummary(updatedData);
                addMessage("bot", summaryAfterEditFrekuensi);
                setTimeout(() => {
                  addMessage("bot", "Apakah laporan sudah sesuai?");
                  setCurrentStep("konfirmasi");
                  setIsProcessingResponse(false);
                }, 2000);
              }
            }}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors text-left w-auto ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            1–2 tahun sekali
          </button>
          <button
            onClick={() => {
              if (!isProcessingResponse) {
                // Langsung set processing untuk mencegah spam
                setIsProcessingResponse(true);
                setCurrentStep("processing");

                const updatedData = { ...reportData };
                updatedData.frekuensiKejadian = "Beberapa kali per tahun";
                setReportData(updatedData);
                saveToLocalStorage(updatedData);
                const summaryAfterEditFrekuensi =
                  generateReportSummary(updatedData);
                addMessage("bot", summaryAfterEditFrekuensi);
                setTimeout(() => {
                  addMessage("bot", "Apakah laporan sudah sesuai?");
                  setCurrentStep("konfirmasi");
                  setIsProcessingResponse(false);
                }, 2000);
              }
            }}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors text-left w-auto ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            Beberapa kali per tahun
          </button>
          <button
            onClick={() => {
              if (!isProcessingResponse) {
                // Langsung set processing untuk mencegah spam
                setIsProcessingResponse(true);
                setCurrentStep("processing");

                const updatedData = { ...reportData };
                updatedData.frekuensiKejadian = "Setiap bulan/minggu";
                setReportData(updatedData);
                saveToLocalStorage(updatedData);
                const summaryAfterEditFrekuensi =
                  generateReportSummary(updatedData);
                addMessage("bot", summaryAfterEditFrekuensi);
                setTimeout(() => {
                  addMessage("bot", "Apakah laporan sudah sesuai?");
                  setCurrentStep("konfirmasi");
                  setIsProcessingResponse(false);
                }, 2000);
              }
            }}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors text-left w-auto ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            Setiap bulan/minggu
          </button>
        </div>
      );
    }

    if (currentStep === "frekuensiKejadian") {
      return (
        <div className="flex flex-col gap-2 mb-4 items-start">
          <button
            onClick={() => handleQuickResponse("5 tahun sekali")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors text-left w-auto ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            5 tahun sekali
          </button>
          <button
            onClick={() => handleQuickResponse("2–5 tahun sekali")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors text-left w-auto ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            2–5 tahun sekali
          </button>
          <button
            onClick={() => handleQuickResponse("1–2 tahun sekali")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors text-left w-auto ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            1–2 tahun sekali
          </button>
          <button
            onClick={() => handleQuickResponse("Beberapa kali per tahun")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors text-left w-auto ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            Beberapa kali per tahun
          </button>
          <button
            onClick={() => handleQuickResponse("Setiap bulan/minggu")}
            disabled={isProcessingResponse}
            className={`px-4 py-2 rounded-full text-sm transition-colors text-left w-auto ${
              isProcessingResponse
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
            }`}
          >
            Setiap bulan/minggu
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-[#d9f0f6] min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <header className="bg-[#B9D9DD] rounded-xl px-6 py-3 mx-6 mt-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 animate-fadeInLeft animate-delay-100">
            {/* Back Button */}
            <button
              className="flex items-center bg-red-600 text-white hover:bg-red-700 px-3 py-2 rounded-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => (window.location.href = "/dashboard-perawat")}
              title="Kembali ke Dashboard"
            >
              {/* Icon selalu tampil */}
              <i className="fas fa-arrow-left text-lg text-white"></i>

              {/* Teks hanya tampil di layar ≥ sm */}
              <span className="hidden sm:inline ml-2 text-sm font-medium">
                Batal
              </span>
            </button>

            <div className="flex items-center space-x-1">
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
                width={30}
                height={30}
                className="object-contain"
              />

              <h1 className="text-white text-xl font-bold">
                Safe
                <span className="font-bold text-[#0B7A95]">Nurse</span>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Riwayat */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() => (window.location.href = "/dashboard-perawat")}
            >
              <i className="fas fa-clipboard-list text-lg mb-1"></i>
              <span className="text-xs">Riwayat</span>
            </button>

            {/* Notifikasi */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors relative"
              onClick={() => (window.location.href = "/notifications-perawat")}
            >
              <div className="relative">
                <i className="fas fa-bell text-lg mb-1"></i>
                {/* Notification Count Badge */}
                {newNotificationCount > 0 && (
                  <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {newNotificationCount}
                  </span>
                )}
              </div>
              <span className="text-xs">Notifikasi</span>
            </button>
            {/* Tutorial */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() => (window.location.href = "/video-tutorial-perawat")}
            >
              <i className="fas fa-play-circle text-lg mb-1"></i>
              <span className="text-xs">Tutorial</span>
            </button>

            {/* Profil */}
            <button
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() => (window.location.href = "/profile-perawat")}
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
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors py-2"
                onClick={() => (window.location.href = "/dashboard-perawat")}
              >
                <i className="fas fa-clipboard-list text-lg mr-3"></i>
                <span>Riwayat</span>
              </button>

              {/* Notifikasi */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors p-2 rounded relative"
                onClick={() =>
                  (window.location.href = "/notifications-perawat")
                }
              >
                <div className="relative">
                  <i className="fas fa-bell text-lg mr-3"></i>
                  {/* Notification Count Badge */}
                  {newNotificationCount > 0 && (
                    <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {newNotificationCount}
                    </span>
                  )}
                </div>
                <span>Notifikasi</span>
              </button>

              {/* Tutorial */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors py-2"
                onClick={() =>
                  (window.location.href = "/video-tutorial-perawat")
                }
              >
                <i className="fas fa-play-circle text-lg mr-3"></i>
                <span>Tutorial</span>
              </button>

              {/* Profil */}
              <button
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors py-2"
                onClick={() => (window.location.href = "/profile-perawat")}
              >
                <i className="fas fa-user text-lg mr-3"></i>
                <span>Profil</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Chat Container */}
      <main className="flex-1 px-6 py-6">
        <div
          className="bg-white rounded-lg p-6 h-full relative overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #b9dce3 0%, #0a7a9a 100%)",
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
          <div className="relative z-10 h-full flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-lg h-full flex flex-col max-w-2xl w-full">
              {/* Chat Header */}
              <div className="bg-[#0B7A95] text-white p-4 rounded-t-xl flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <i className="fas fa-robot text-[#0B7A95] text-lg"></i>
                </div>
                <div>
                  <h3 className="font-semibold">SafeNurse Assistant</h3>
                  <p className="text-sm opacity-90">
                    Asisten Pelaporan Insiden
                  </p>
                </div>
              </div>

              {/* Messages Container */}
              <div
                className="flex-1 p-4 overflow-y-auto space-y-4"
                style={{ maxHeight: "calc(100vh - 300px)" }}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start items-start"
                    }`}
                  >
                    {message.sender === "bot" && (
                      <div className="w-8 h-8 bg-[#0B7A95] rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                        <i className="fas fa-robot text-white text-sm"></i>
                      </div>
                    )}
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === "user"
                          ? "bg-[#0B7A95] text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">
                        {message.text}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "user"
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Loading indicator when bot is processing */}
                {isProcessingResponse && (
                  <div className="flex justify-start items-start">
                    <div className="w-8 h-8 bg-[#0B7A95] rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                      <i className="fas fa-robot text-white text-sm"></i>
                    </div>
                    <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-100 text-gray-800">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">
                          Bot sedang mengetik...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Response Buttons */}
              <div className="px-4">{renderQuickButtons()}</div>

              {/* Input Area */}
              {currentStep !== "end" &&
                currentStep !== "jenisKelamin" &&
                currentStep !== "dampakInsiden" &&
                currentStep !== "frekuensiKejadian" &&
                currentStep !== "tglMasukRS" &&
                currentStep !== "tglKejadian" &&
                currentStep !== "konfirmasi" &&
                currentStep !== "konfirmasiKronologi" &&
                currentStep !== "konfirmasiKronologiEdit" &&
                currentStep !== "editJenisKelamin" &&
                currentStep !== "editDampakInsiden" &&
                currentStep !== "editFrekuensiKejadian" &&
                currentStep !== "editTglMasukRS" &&
                currentStep !== "editTglKejadian" && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 relative">
                        <textarea
                          ref={textareaRef}
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          placeholder={
                            currentStep === "greeting"
                              ? "pilih Ya atau Tidak"
                              : "Ketik pesan Anda..."
                          }
                          disabled={
                            isProcessingResponse ||
                            isSubmittingReport ||
                            currentStep === "greeting"
                          }
                          rows={1}
                          style={{
                            resize: "none",
                            maxHeight: "120px",
                            scrollbarWidth: "none" /* Firefox */,
                            msOverflowStyle: "none" /* IE and Edge */,
                          }}
                          className={`w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0B7A95] focus:border-transparent text-black overflow-y-auto [&::-webkit-scrollbar]:hidden ${
                            isProcessingResponse ||
                            isSubmittingReport ||
                            currentStep === "greeting"
                              ? "bg-gray-100 cursor-not-allowed"
                              : ""
                          }`}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = "auto";
                            target.style.height =
                              Math.min(target.scrollHeight, 120) + "px";
                          }}
                        />
                      </div>

                      <button
                        onClick={startVoiceRecognition}
                        disabled={
                          currentStep === "greeting" || isSubmittingReport
                        }
                        className={`p-2 rounded-full transition-all duration-200 ${
                          currentStep === "greeting" || isSubmittingReport
                            ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                            : isListening
                            ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300 hover:shadow-md"
                        }`}
                        title={
                          currentStep === "greeting"
                            ? "Silakan pilih Ya atau Tidak"
                            : isSubmittingReport
                            ? "Sedang memproses laporan..."
                            : isListening
                            ? "Klik untuk berhenti merekam"
                            : "Rekam Suara"
                        }
                      >
                        <i
                          className={`fas ${
                            isListening ? "fa-stop" : "fa-microphone"
                          } ${isListening ? "animate-pulse" : ""}`}
                        ></i>
                      </button>

                      <button
                        onClick={handleSendMessage}
                        disabled={
                          isProcessingResponse ||
                          isSubmittingReport ||
                          currentStep === "greeting"
                        }
                        className={`p-2 rounded-full transition-colors ${
                          isProcessingResponse ||
                          isSubmittingReport ||
                          currentStep === "greeting"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
                        }`}
                        title={
                          currentStep === "greeting"
                            ? "Silakan pilih Ya atau Tidak"
                            : isSubmittingReport
                            ? "Sedang memproses laporan..."
                            : "Kirim Pesan"
                        }
                      >
                        {isSubmittingReport ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          <i className="fas fa-paper-plane"></i>
                        )}
                      </button>
                    </div>
                  </div>
                )}

              {/* Back to Dashboard Button - Only show when conversation ends */}
              {currentStep === "end" && (
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={() =>
                      (window.location.href = "/dashboard-perawat")
                    }
                    className="w-full px-4 py-3 bg-[#0B7A95] text-white rounded-lg hover:bg-[#0a6b85] transition-colors font-medium"
                  >
                    Kembali ke Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="mt-auto bg-[#0B7A95] text-white py-4 px-6">
        <div className="text-center space-y-1">
          <p className="text-sm font-medium">
            Copyright 2025 © SafeNurse All Rights reserved.
          </p>
          <p className="text-xs text-white/80">Universitas Hasanuddin</p>
        </div>
      </footer>
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
