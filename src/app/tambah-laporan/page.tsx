"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  judulInsiden: string;
  kronologi: string;
  tindakanSegera: string;
  tindakanOleh: string;
  dampakInsiden: string;
  frekuensiKejadian: string;
}

export default function TambahLaporanPage() {
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
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedIncidentDate, setSelectedIncidentDate] = useState("");

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
      `4. Judul Insiden : ${data.judulInsiden}\n` +
      `5. Kronologi : ${data.kronologi}\n` +
      `6. Tindakan Segera : ${data.tindakanSegera}\n` +
      `7. Tindakan Oleh : ${data.tindakanOleh}\n` +
      `8. Dampak Insiden : ${data.dampakInsiden}\n` +
      `9. Frekuensi Kejadian : ${data.frekuensiKejadian}`
    );
  };

  const processUserResponse = (response: string) => {
    setIsProcessingResponse(true);
    setTimeout(() => {
      const updatedData = { ...reportData };

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
                  body: JSON.stringify({ chronology: response }),
                }
              );

              const data = await res.json();

              if (data.is_lengkap) {
                // Kalau lengkap → lanjut ke step berikutnya
                addMessage(
                  "bot",
                  "Tindakan yang dilakukan segera setelah kejadian & apa hasilnya?"
                );
                setCurrentStep("tindakanSegera");
              } else {
                // Kalau tidak lengkap → kasih evaluasi
                addMessage(
                  "bot",
                  `Kronologi belum lengkap. Evaluasi:\n\n${data.evaluasi}`
                );
                addMessage(
                  "bot",
                  "Silakan masukkan kronologi ulang dengan lebih lengkap."
                );
                setCurrentStep("kronologi"); // tetap di step kronologi
              }
            } catch (error) {
              console.error("Error validate chronology:", error);
              addMessage(
                "bot",
                "Terjadi kesalahan saat validasi kronologi. Coba lagi ya."
              );
              setCurrentStep("kronologi"); // tetap di step kronologi
            }
          };

          validateChronology();
          break;

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

          const cleanAndGenerateSummary = async () => {
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

                // Simpan kategori ke reportData
                const updatedWithKategori = {
                  ...updatedData,
                  kategori: clean.kategori,
                };
                setReportData(updatedWithKategori);
                saveToLocalStorage(updatedWithKategori);

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
                  `4. Judul Insiden : ${clean.judul_insiden}\n` +
                  `5. Kronologi : ${clean.kronologi}\n` +
                  `6. Tindakan Segera : ${clean.tindakan_awal}\n` +
                  `7. Tindakan Oleh : ${clean.tindakan_oleh}\n` +
                  `8. Dampak Insiden : ${clean.dampak}\n` +
                  `9. Frekuensi Kejadian : ${clean.probabilitas}\n`

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
            }
          };

          cleanAndGenerateSummary();
          break;

        case "konfirmasi":
          if (
            response.toLowerCase().includes("sesuai") &&
            !response.toLowerCase().includes("belum") &&
            !response.toLowerCase().includes("tidak")
          ) {
            // Kirim laporan ke backend
            const submitLaporan = async () => {
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

                console.log(result)

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
              }
            };

            submitLaporan();
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
                setCurrentStep("editNamaPasien");
                break;
              case 2:
                addMessage("bot", "Berikan jawaban barunya:");
                setCurrentStep("editNoRM");
                break;
              case 3:
                addMessage("bot", "Berikan jawaban barunya:");
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
          if (nomorRincian >= 1 && nomorRincian <= 9) {
            switch (nomorRincian) {
              case 1:
                addMessage("bot", "Berikan jawaban barunya:");
                setCurrentStep("editUnitPelapor");
                break;
              case 2:
                addMessage("bot", "Berikan jawaban barunya:");
                setCurrentStep("editLokasiInsiden");
                break;
              case 3:
                addMessage("bot", "Berikan jawaban barunya:");
                setCurrentStep("editTglKejadian");
                break;
              case 4:
                addMessage("bot", "Berikan jawaban barunya:");
                setCurrentStep("editJudulInsiden");
                break;
              case 5:
                addMessage("bot", "Berikan jawaban barunya:");
                setCurrentStep("editKronologi");
                break;
              case 6:
                addMessage("bot", "Berikan jawaban barunya:");
                setCurrentStep("editTindakanSegera");
                break;
              case 7:
                addMessage("bot", "Berikan jawaban barunya:");
                setCurrentStep("editTindakanOleh");
                break;
              case 8:
                addMessage("bot", "Berikan jawaban barunya:");
                setCurrentStep("editDampakInsiden");
                break;
              case 9:
                addMessage("bot", "Berikan jawaban barunya:");
                setCurrentStep("editFrekuensiKejadian");
                break;
            }
          } else {
            addMessage("bot", "Mohon masukkan nomor yang valid (1-9).");
          }
          break;

        // Edit cases for Data Pasien
        case "editNamaPasien":
          updatedData.namaPasien = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          const summaryAfterEditNama = generateReportSummary(updatedData);
          addMessage("bot", summaryAfterEditNama);
          setTimeout(() => {
            addMessage("bot", "Apakah laporan sudah sesuai?");
            setCurrentStep("konfirmasi");
          }, 2000);
          break;

        case "editNoRM":
          updatedData.noRM = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          const summaryAfterEditNoRM = generateReportSummary(updatedData);
          addMessage("bot", summaryAfterEditNoRM);
          setTimeout(() => {
            addMessage("bot", "Apakah laporan sudah sesuai?");
            setCurrentStep("konfirmasi");
          }, 2000);
          break;

        case "editUmur":
          updatedData.umur = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          const summaryAfterEditUmur = generateReportSummary(updatedData);
          addMessage("bot", summaryAfterEditUmur);
          setTimeout(() => {
            addMessage("bot", "Apakah laporan sudah sesuai?");
            setCurrentStep("konfirmasi");
          }, 2000);
          break;

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
          const summaryAfterEditUnit = generateReportSummary(updatedData);
          addMessage("bot", summaryAfterEditUnit);
          setTimeout(() => {
            addMessage("bot", "Apakah laporan sudah sesuai?");
            setCurrentStep("konfirmasi");
          }, 2000);
          break;

        case "editLokasiInsiden":
          updatedData.lokasiInsiden = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          const summaryAfterEditLokasi = generateReportSummary(updatedData);
          addMessage("bot", summaryAfterEditLokasi);
          setTimeout(() => {
            addMessage("bot", "Apakah laporan sudah sesuai?");
            setCurrentStep("konfirmasi");
          }, 2000);
          break;

        case "editTglKejadian":
          // Tidak langsung memproses response, karena akan menggunakan sistem kalender dan jam
          // Response akan diproses melalui tombol konfirmasi di UI
          break;

        case "editJudulInsiden":
          updatedData.judulInsiden = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          const summaryAfterEditJudul = generateReportSummary(updatedData);
          addMessage("bot", summaryAfterEditJudul);
          setTimeout(() => {
            addMessage("bot", "Apakah laporan sudah sesuai?");
            setCurrentStep("konfirmasi");
          }, 2000);
          break;

        case "editKronologi":
          updatedData.kronologi = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          const summaryAfterEditKronologi = generateReportSummary(updatedData);
          addMessage("bot", summaryAfterEditKronologi);
          setTimeout(() => {
            addMessage("bot", "Apakah laporan sudah sesuai?");
            setCurrentStep("konfirmasi");
          }, 2000);
          break;

        case "editTindakanSegera":
          updatedData.tindakanSegera = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          const summaryAfterEditTindakanSegera =
            generateReportSummary(updatedData);
          addMessage("bot", summaryAfterEditTindakanSegera);
          setTimeout(() => {
            addMessage("bot", "Apakah laporan sudah sesuai?");
            setCurrentStep("konfirmasi");
          }, 2000);
          break;

        case "editTindakanOleh":
          updatedData.tindakanOleh = response;
          setReportData(updatedData);
          saveToLocalStorage(updatedData);
          const summaryAfterEditTindakanOleh =
            generateReportSummary(updatedData);
          addMessage("bot", summaryAfterEditTindakanOleh);
          setTimeout(() => {
            addMessage("bot", "Apakah laporan sudah sesuai?");
            setCurrentStep("konfirmasi");
          }, 2000);
          break;

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

  const startVoiceRecognition = () => {
    if (isListening) {
      // Stop recording if currently listening
      setIsListening(false);
      return;
    }

    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = "id-ID";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        // Only populate input field, don't auto-send
        setInputValue(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Browser Anda tidak mendukung speech recognition");
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
            4. Judul Insiden
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
            5. Kronologi
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
            6. Tindakan Segera
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
            7. Tindakan Oleh
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
            8. Dampak Insiden
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
            9. Frekuensi Kejadian
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
                        selectedDateTime.toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
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
                        selectedDateTime.toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        });

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
            onClick={() =>
              handleQuickResponse("cidera berat")
            }
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
            onClick={() =>
              handleQuickResponse("cidera sedang")
            }
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
              }, 2000);
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
              }, 2000);
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
              }, 2000);
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
              }, 2000);
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
              }, 2000);
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
          <h1 className="text-white text-xl font-bold">
            Safe
            <span className="font-bold text-[#0B7A95]">Nurse</span>
          </h1>

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
              className="flex flex-col items-center text-white hover:text-[#0B7A95] transition-colors"
              onClick={() => (window.location.href = "/notifications-perawat")}
            >
              <i className="fas fa-bell text-lg mb-1"></i>
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
                className="flex items-center text-white hover:text-[#0B7A95] transition-colors py-2"
                onClick={() =>
                  (window.location.href = "/notifications-perawat")
                }
              >
                <i className="fas fa-bell text-lg mr-3"></i>
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
                currentStep !== "editJenisKelamin" &&
                currentStep !== "editDampakInsiden" &&
                currentStep !== "editFrekuensiKejadian" &&
                currentStep !== "editTglMasukRS" &&
                currentStep !== "editTglKejadian" && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleSendMessage()
                          }
                          placeholder="Ketik pesan Anda..."
                          disabled={isProcessingResponse}
                          className={`w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0B7A95] focus:border-transparent text-black ${
                            isProcessingResponse
                              ? "bg-gray-100 cursor-not-allowed"
                              : ""
                          }`}
                        />
                      </div>

                      <button
                        onClick={startVoiceRecognition}
                        className={`p-2 rounded-full transition-all duration-200 ${
                          isListening
                            ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300 hover:shadow-md"
                        }`}
                        title={
                          isListening
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
                        disabled={isProcessingResponse}
                        className={`p-2 rounded-full transition-colors ${
                          isProcessingResponse
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#0B7A95] text-white hover:bg-[#0a6b85]"
                        }`}
                        title="Kirim Pesan"
                      >
                        <i className="fas fa-paper-plane"></i>
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
    </div>
  );
}
