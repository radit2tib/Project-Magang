import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Pastikan URL ini sesuai dengan port backend kamu
const API_URL = 'http://localhost:8000'; 

// --- KOMPONEN ITEM TUGAS (CARD) ---
const TugasItem = ({ taskNumber, existingData, isLocked, refreshData }) => {
    // State untuk Form
    const [judul, setJudul] = useState('');
    const [fileLaporan, setFileLaporan] = useState(null);
    const [filePresentasi, setFilePresentasi] = useState(null);
    
    // State untuk UI Interaction
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    // --- LOGIKA STATUS ---
    const isSubmitted = !!existingData; 
    const isGraded = existingData?.nilai !== null && existingData?.nilai !== undefined;

    // --- EFFECT: ISI FORM OTOMATIS ---
    useEffect(() => {
        if (existingData) {
            setJudul(existingData.judulTugas || '');
        } else {
            setJudul('');
        }
    }, [existingData]);

    // --- HANDLERS ---
    const handleLaporanChange = (e) => {
        if (e.target.files && e.target.files[0]) setFileLaporan(e.target.files[0]);
    };

    const handlePresentasiChange = (e) => {
        if (e.target.files && e.target.files[0]) setFilePresentasi(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!judul || !fileLaporan) {
            setMessage('Judul tugas dan File Laporan wajib diisi.');
            setMessageType('error');
            return;
        }

        setIsLoading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('taskNumber', taskNumber);
        formData.append('judulTugas', judul);
        formData.append('fileLaporan', fileLaporan);
        if (filePresentasi) formData.append('filePresentasi', filePresentasi);

        const token = localStorage.getItem('mahasiswaAuthToken');

        try {
            const response = await axios.post(`${API_URL}/mahasiswa/tugas`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage(response.data.message || 'Berhasil diupload! Menunggu penilaian.');
            setMessageType('success');
            
            refreshData(); 
            
        } catch (err) {
            console.error('Gagal upload tugas:', err);
            const errorMsg = err.response?.data?.message || 'Gagal upload. Cek koneksi server.';
            setMessage(errorMsg);
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    // ============================================================
    // RENDER TAMPILAN BERDASARKAN STATUS
    // ============================================================

    // KONDISI 1: TERKUNCI (LOCKED)
    // Karena tugas sebelumnya BELUM DINILAI (meskipun sudah upload)
    if (isLocked) {
        return (
            <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 relative h-full flex flex-col items-center justify-center text-center opacity-80 select-none">
                {/* Ikon Gembok */}
                <div className="mb-3 p-3 bg-slate-200 rounded-full">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h4 className="text-lg font-bold text-slate-500 mb-1">Tugas {taskNumber} Terkunci</h4>
                <p className="text-xs text-slate-500 px-4 leading-relaxed">
                    Tugas sebelumnya harus <b>dinilai (Verified)</b> oleh Admin terlebih dahulu untuk membuka tugas ini.
                </p>
            </div>
        );
    }

    // KONDISI 2: SUDAH DINILAI ADMIN (VERIFIED)
    if (isGraded) {
        return (
            <div className="p-6 bg-green-50 rounded-2xl border border-green-200 shadow-sm h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0">
                    <div className="bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-sm tracking-wider">
                        VERIFIED
                    </div>
                </div>

                <div className="flex items-center mb-4">
                    <div className="p-2 bg-green-100 rounded-full mr-3">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h4 className="text-lg font-bold text-green-800">Tugas {taskNumber}</h4>
                </div>

                <div className="bg-white p-4 rounded-lg border border-green-100 flex-grow flex flex-col justify-center">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Judul Tugas</p>
                    <p className="text-slate-800 font-medium mb-3 line-clamp-2">{judul}</p>
                    
                    <div className="pt-3 border-t border-slate-100">
                        <p className="text-sm text-green-600 flex items-center font-medium">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Tugas Selesai & Dinilai
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            Tugas selanjutnya telah terbuka.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // KONDISI 3: NORMAL (BISA UPLOAD / EDIT)
    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col h-full transition-all hover:shadow-xl">
            <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-bold text-slate-800">Tugas {taskNumber}</h4>
                {isSubmitted && (
                    <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                        Menunggu Penilaian
                    </span>
                )}
            </div>

            <div className="space-y-4 flex-grow">
                {/* Input Judul */}
                <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Judul Tugas</label>
                    <input
                        type="text"
                        value={judul}
                        onChange={(e) => setJudul(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder={`Contoh: Laporan Minggu ${taskNumber}`}
                        disabled={isLoading}
                    />
                </div>

                {/* Input File Laporan */}
                <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">File Laporan (PDF/DOCX)</label>
                    <div className="relative">
                        <input
                            type="file"
                            onChange={handleLaporanChange}
                            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            disabled={isLoading}
                            accept=".pdf,.doc,.docx"
                        />
                        {existingData?.fileLaporan && (
                            <div className="mt-1 flex items-center text-xs text-green-600">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                File tersimpan di server
                            </div>
                        )}
                    </div>
                </div>

                {/* Input File PPT */}
                <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">File PPT (Opsional)</label>
                    <input
                        type="file"
                        onChange={handlePresentasiChange}
                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                        disabled={isLoading}
                        accept=".pptx,.pdf"
                    />
                    {existingData?.filePresentasi && (
                        <div className="mt-1 flex items-center text-xs text-green-600">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            File tersimpan di server
                        </div>
                    )}
                </div>
            </div>

            {/* Tombol Submit */}
            <div className="pt-6 mt-auto">
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`w-full px-5 py-2.5 text-sm font-bold rounded-lg shadow-md transition-all 
                        ${isSubmitted 
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'     
                        } disabled:bg-slate-300 disabled:cursor-not-allowed`}
                >
                    {isLoading ? 'Menyimpan...' : (isSubmitted ? 'Update Tugas' : 'Upload Tugas')}
                </button>
                
                {message && (
                    <p className={`text-center text-xs mt-3 font-semibold ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}
            </div>
        </form>
    );
};

// --- KOMPONEN UTAMA: MAHASISWA TUGAS ---
const MahasiswaTugas = () => {
    const [tugasData, setTugasData] = useState([]); 
    const [loadingData, setLoadingData] = useState(true);
    const taskList = ['I', 'II', 'III', 'IV', 'V', 'VI'];

    const fetchData = async () => {
        const token = localStorage.getItem('mahasiswaAuthToken');
        if (!token) return;

        try {
            const response = await axios.get(`${API_URL}/mahasiswa/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setTugasData(response.data.daftarTugas || []);
        } catch (err) {
            console.error("Gagal ambil data tugas:", err);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loadingData) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 animate-pulse">
                <svg className="w-10 h-10 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                <p>Memuat status tugas...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Header Info */}
            <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start">
                <div className="p-2 bg-blue-100 rounded-full mr-3 flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                    <h3 className="font-bold text-blue-800 text-sm">Petunjuk Pengumpulan</h3>
                    <div className="text-xs text-blue-600 mt-1 leading-relaxed space-y-1">
                        <p>1. Tugas dikerjakan secara berurutan. <b>Tugas II</b> baru terbuka setelah <b>Tugas I</b> mendapat nilai.</p>
                        <p>2. Status <span className="font-bold text-green-600 bg-green-100 px-1 rounded">VERIFIED</span> artinya tugas sudah dinilai dan Anda bisa lanjut ke tugas berikutnya.</p>
                        <p>3. Jika status masih "Menunggu Penilaian", mohon tunggu Admin memeriksa tugas Anda.</p>
                    </div>
                </div>
            </div>

            {/* Grid Tugas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {taskList.map((number, index) => {
                    
                    const currentTaskData = tugasData.find(t => t.taskNumber === number);
                    
                    // --- LOGIKA KUNCI BARU (GRADE BASED) ---
                    let isLocked = false;
                    
                    if (index > 0) {
                        // Cek tugas sebelumnya
                        const prevTaskNum = taskList[index - 1];
                        const prevTaskData = tugasData.find(t => t.taskNumber === prevTaskNum);
                        
                        // KUNCI JIKA:
                        // 1. Tugas sebelumnya belum ada (belum upload)
                        // 2. ATAU Tugas sebelumnya nilai-nya masih null/undefined (belum dinilai)
                        const isPrevGraded = prevTaskData && prevTaskData.nilai !== null && prevTaskData.nilai !== undefined;

                        if (!isPrevGraded) {
                            isLocked = true; 
                        }
                    }

                    return (
                        <TugasItem 
                            key={number} 
                            taskNumber={number} 
                            existingData={currentTaskData}
                            isLocked={isLocked}
                            refreshData={fetchData} 
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default MahasiswaTugas;