import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

// --- 1. KOMPONEN KARTU SUKSES (BESAR & LEGA) ---
const CompletionCard = ({ type, data }) => (
    <div className="h-full min-h-[400px] bg-gradient-to-b from-emerald-50/80 to-white/40 backdrop-blur-md border border-emerald-100 rounded-[32px] p-10 flex flex-col items-center text-center shadow-2xl shadow-emerald-100/50 transition-transform hover:scale-[1.01]">
        
        {/* Icon Glow Besar */}
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg ring-4 ring-emerald-50">
                <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
        </div>

        <h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">
            {type} <span className="text-emerald-600">Selesai</span>
        </h3>
        <p className="text-slate-500 text-base mb-10 max-w-md leading-relaxed font-medium">
            Selamat! Laporan Anda telah diverifikasi, disetujui, dan dinilai oleh tim penguji.
        </p>
        
        {/* Kartu Detail Data */}
        <div className="w-full bg-white rounded-2xl border border-slate-100 p-8 shadow-sm text-left mt-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            
            <div className="space-y-6">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Judul Laporan</p>
                    <p className="text-xl font-bold text-slate-800 leading-snug">{data.judul}</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Nilai Akhir</p>
                        <p className="text-5xl font-black text-emerald-600 tracking-tighter">{data.nilai}</p>
                    </div>
                    <div className="text-right">
                        <span className="inline-block px-4 py-2 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
                            Verified
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- 2. KOMPONEN FORM UPLOAD (BESAR & JELAS) ---
const UploadCard = ({ type, judul, setJudul, file, setFile, isLoading }) => (
    <div className="h-full min-h-[400px] bg-white/80 backdrop-blur-xl border border-white/50 rounded-[32px] p-10 shadow-xl shadow-blue-500/5 flex flex-col relative overflow-hidden group">
        
        {/* Header Card */}
        <div className="flex justify-between items-start mb-8">
            <div>
                <span className="text-blue-500 font-bold tracking-widest text-xs uppercase mb-2 block">Formulir Pengajuan</span>
                <h3 className="text-3xl font-black text-slate-800">{type}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xl">
                {type === 'Kerja Praktik' ? '01' : '02'}
            </div>
        </div>

        <div className="space-y-8 flex-grow">
            {/* Input Judul Besar */}
            <div className="group/input">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 transition-colors group-focus-within/input:text-blue-600">
                    Judul Laporan
                </label>
                <input 
                    type="text" 
                    value={judul} 
                    onChange={(e) => setJudul(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg font-semibold text-slate-700 placeholder-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    placeholder="Ketik judul laporan di sini..."
                    disabled={isLoading}
                />
            </div>

            {/* Upload Area Besar */}
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Dokumen (PDF)
                </label>
                <label className={`flex flex-col items-center justify-center w-full h-40 border-3 border-dashed rounded-2xl cursor-pointer transition-all duration-300 group/upload ${file ? 'border-blue-400 bg-blue-50/50' : 'border-slate-200 hover:border-blue-400 hover:bg-white'}`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                        {file ? (
                            <>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 text-blue-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <p className="text-base font-bold text-blue-700 truncate w-full">{file.name}</p>
                                <p className="text-xs text-blue-500 mt-1 font-medium">Siap untuk diupload</p>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400 group-hover/upload:bg-blue-100 group-hover/upload:text-blue-600 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                </div>
                                <p className="text-base font-medium text-slate-500 group-hover/upload:text-blue-600 transition-colors">Klik untuk pilih file laporan</p>
                                <p className="text-xs text-slate-400 mt-1">Maksimum ukuran 10MB</p>
                            </>
                        )}
                    </div>
                    <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => { if(e.target.files[0]) setFile(e.target.files[0]); }}
                        disabled={isLoading}
                    />
                </label>
            </div>
        </div>
    </div>
);

// --- 3. KOMPONEN BANK JUDUL (FULL WIDTH TABLE) ---
const BankJudulSection = ({ allTitles }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('KP'); 

    const filteredTitles = allTitles.filter(item => {
        const titleToCheck = category === 'KP' ? item.judulKp : item.judulTa;
        if (!titleToCheck) return false;
        const searchLower = searchTerm.toLowerCase();
        return (
            titleToCheck.toLowerCase().includes(searchLower) ||
            item.nama.toLowerCase().includes(searchLower) ||
            item.nim.includes(searchLower)
        );
    });

    return (
        <div className="mt-20">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
                <div>
                    <h3 className="text-3xl font-black text-slate-800">Bank Judul Referensi</h3>
                    <p className="text-slate-500 mt-2 text-lg">Cari inspirasi dari arsip judul mahasiswa terdahulu.</p>
                </div>
                
                <div className="flex gap-3 bg-white p-1.5 rounded-xl shadow-sm border border-slate-100">
                    <button 
                        onClick={() => setCategory('KP')}
                        className={`px-6 py-3 text-sm font-bold rounded-lg transition-all ${category === 'KP' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Kerja Praktik
                    </button>
                    <button 
                        onClick={() => setCategory('TA')}
                        className={`px-6 py-3 text-sm font-bold rounded-lg transition-all ${category === 'TA' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Tugas Akhir
                    </button>
                </div>
            </div>

            {/* Search Big Bar */}
            <div className="relative mb-8 group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <svg className="w-6 h-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input 
                    type="text" 
                    placeholder="Ketik kata kunci judul, nama mahasiswa, atau NIM..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 bg-white border-2 border-slate-100 rounded-2xl text-lg shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder-slate-400"
                />
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest w-1/3">Mahasiswa</th>
                                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Judul Project</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredTitles.length > 0 ? (
                                filteredTitles.map((item, index) => (
                                    <tr key={index} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-8 py-6 align-top">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                    {item.nama.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-base">{item.nama}</p>
                                                    <p className="text-xs text-slate-400 font-mono mt-1">{item.nim}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 align-middle">
                                            <p className="text-base text-slate-600 font-medium leading-relaxed group-hover:text-slate-900 transition-colors">
                                                {category === 'KP' ? item.judulKp : item.judulTa}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="p-16 text-center text-slate-400">
                                        <p className="text-lg font-medium">Tidak ada data ditemukan.</p>
                                        <p className="text-sm">Coba kata kunci lain.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


// --- KOMPONEN UTAMA (LAYOUT FULL PAGE) ---
const ProyekAkhirView = ({ user, navigate, allTitles = [] }) => {
    const [judulKp, setJudulKp] = useState('');
    const [judulTa, setJudulTa] = useState('');
    const [fileKP, setFileKP] = useState(null);
    const [fileTA, setFileTA] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setJudulKp(user.judulKp || '');
            setJudulTa(user.judulTa || '');
        }
    }, [user]);

    const isKpComplete = user?.nilaiKpAkhir > 0;
    const isTaComplete = user?.nilaiTaAkhir > 0;

    const existingFileKp = user?.fileLaporanKp ? { name: user.fileLaporanKp.split('/').pop() } : null;
    const existingFileTa = user?.fileLaporanTa ? { name: user.fileLaporanTa.split('/').pop() } : null;

    const handleUpdateJudul = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('mahasiswaAuthToken');
            await axios.patch(`${API_URL}/mahasiswa/profile`, 
                { judulKp, judulTa }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Judul berhasil diperbarui!");
        } catch (error) {
            console.error("Gagal update:", error);
        } finally { setIsLoading(false); }
    };

    const handleUpload = async () => {
        if (!fileKP && !fileTA) {
            alert("Pilih file untuk diupload.");
            return;
        }
        setIsLoading(true);
        const formData = new FormData();
        if (fileKP) formData.append('fileLaporanKP', fileKP);
        if (fileTA) formData.append('fileLaporanTA', fileTA);

        try {
            const token = localStorage.getItem('mahasiswaAuthToken');
            await axios.patch(`${API_URL}/mahasiswa/upload-proyek`, formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            setMessage("Upload berhasil!");
             setTimeout(() => window.location.reload(), 1000); 
        } catch (error) {
            console.error("Gagal upload:", error);
            setMessage("Gagal upload.");
        } finally { setIsLoading(false); }
    };

    return (
        // CONTAINER UTAMA FULL WIDTH
        <div className="min-h-screen bg-[#F8FAFC] pb-32 pt-10 px-6 sm:px-12 font-sans text-slate-800">
            
            <div className="max-w-[1600px] mx-auto">
                
                {/* HEADER PAGE (BIG TYPOGRAPHY) */}
                <div className="mb-16">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
                        Proyek Akhir
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
                        Kelola seluruh dokumen Kerja Praktik dan Tugas Akhir Anda dalam satu tempat yang terintegrasi dan transparan.
                    </p>
                </div>

                {/* GRID LAYOUT (FULL WIDTH) */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                    
                    {/* --- BAGIAN 1: KERJA PRAKTIK --- */}
                    <section className="flex flex-col h-full">
                        {isKpComplete ? (
                            <CompletionCard type="Kerja Praktik" data={{ judul: user.judulKp, nilai: user.nilaiKpAkhir, komen: user.komenKp }} />
                        ) : (
                            <UploadCard 
                                type="Kerja Praktik"
                                judul={judulKp} 
                                setJudul={setJudulKp} 
                                file={fileKP || existingFileKp} 
                                setFile={setFileKP}
                                isLoading={isLoading}
                            />
                        )}
                    </section>

                    {/* --- BAGIAN 2: TUGAS AKHIR --- */}
                    <section className="flex flex-col h-full">
                        {isTaComplete ? (
                            <CompletionCard type="Tugas Akhir" data={{ judul: user.judulTa, nilai: user.nilaiTaAkhir, komen: user.komenTa }} />
                        ) : (
                            <UploadCard 
                                type="Tugas Akhir"
                                judul={judulTa} 
                                setJudul={setJudulTa} 
                                file={fileTA || existingFileTa} 
                                setFile={setFileTA}
                                isLoading={isLoading}
                            />
                        )}
                    </section>
                </div>

                {/* FLOATING ACTION BAR (BIGGER & CLEANER) */}
                {(!isKpComplete || !isTaComplete) && (
                    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl">
                        <div className="bg-white/90 backdrop-blur-xl border border-slate-200 p-3 rounded-3xl shadow-2xl shadow-slate-300/50 flex gap-4">
                            <button 
                                onClick={handleUpdateJudul}
                                disabled={isLoading}
                                className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all text-sm uppercase tracking-wider"
                            >
                                Simpan Judul
                            </button>
                            <button 
                                onClick={handleUpload}
                                disabled={isLoading || (!fileKP && !fileTA)}
                                className="flex-1 py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl shadow-lg shadow-slate-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider flex justify-center items-center gap-3"
                            >
                                {isLoading ? (
                                    <span className="animate-pulse">Memproses...</span>
                                ) : (
                                    <>
                                        Upload Dokumen
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* NOTIFICATION TOAST */}
                {message && (
                    <div className="fixed top-10 right-10 z-50 px-8 py-5 bg-white border-l-4 border-emerald-500 shadow-2xl rounded-xl font-bold text-slate-800 animate-fade-in-left flex items-center gap-4 text-lg">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                        {message}
                    </div>
                )}

                {/* --- BANK JUDUL --- */}
                <BankJudulSection allTitles={allTitles} />
            </div>
        </div>
    );
};

export default ProyekAkhirView;