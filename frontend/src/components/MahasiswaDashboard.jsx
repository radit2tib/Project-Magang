import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import aprilLogo from '../assets/icons/april.png'; // Path ini menyebabkan error, diganti placeholder

// --- [PENTING] Tentukan API_URL di sini ---
// Gunakan URL tunnel publik port 8000 Anda
const API_URL = 'https://q576mhww-8000.asse.devtunnels.ms'; 
// (Pastikan URL ini sama dengan yang ada di VS Code "PORTS" Anda)


// --- Komponen Ikon SVG ---
const Icon = ({ path, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 shrink-0 ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

// --- Komponen Sidebar (Tombol Dashboard Ditambahkan) ---
const Sidebar = ({ activeMenu, setActiveMenu, user, handleLogout }) => (
    <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-20 border-b border-slate-200 p-4">
            {/* Ganti dengan URL placeholder karena file lokal tidak ditemukan */}
            <img 
                src={aprilLogo} // Baris 20: Dikembalikan ke placeholder
                alt="Logo APRIL" 
                className="h-9" 
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x50?text=Logo"; }}
            />
        </div>
        <div className="flex flex-col flex-grow p-4">
            <nav className="flex-grow space-y-2">
                {/* --- TOMBOL DASHBOARD BARU --- */}
                <button onClick={() => setActiveMenu('dashboard')} className={`flex items-center w-full px-4 py-2.5 rounded-lg transition-all duration-200 text-sm text-left ${activeMenu === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}`}>
                    <Icon path="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25A2.25 2.25 0 018.25 10.5H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6A2.25 2.25 0 0115.75 3.75h2.25A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75A2.25 2.25 0 0115.75 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" className="mr-3" />
                    <span className="font-semibold">Dashboard</span>
                </button>
                {/* --- AKHIR TOMBOL DASHBOARD --- */}
                
                <button onClick={() => setActiveMenu('profil')} className={`flex items-center w-full px-4 py-2.5 rounded-lg transition-all duration-200 text-sm text-left ${activeMenu === 'profil' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}`}>
                    <Icon path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" className="mr-3" />
                    <span className="font-semibold">Profil Saya</span>
                </button>
                <button onClick={() => setActiveMenu('proyek')} className={`flex items-center w-full px-4 py-2.5 rounded-lg transition-all duration-200 text-sm text-left ${activeMenu === 'proyek' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}`}>
                    <Icon path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" className="mr-3" />
                    <span className="font-semibold">Proyek Akhir</span>
                </button>
                <button onClick={() => setActiveMenu('tugas')} className={`flex items-center w-full px-4 py-2.5 rounded-lg transition-all duration-200 text-sm text-left ${activeMenu === 'tugas' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}`}>
                    <Icon path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" className="mr-3" />
                    <span className="font-semibold">Tugas</span>
                </button>
            </nav>
            <div className="mt-6 border-t border-slate-200 pt-4">
                 <button onClick={handleLogout} className="flex items-center w-full px-4 py-2.5 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 text-sm text-left">
                    <Icon path="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3 0l3-3m0 0l-3-3m3 3H9" className="mr-3" />
                    <span className="font-semibold">Logout</span>
                </button>
            </div>
        </div>
    </aside>
);

// --- Tampilan untuk Halaman Dashboard (BARU) ---
const DashboardView = ({ user, setActiveMenu }) => (
    <div className="animate-fade-in">
        {/* Kartu Selamat Datang */}
        <div className="mb-6 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-800">Selamat datang, {user?.nama?.split(' ')[0]}!</h2>
            <p className="text-slate-500 mt-2">Ini adalah ringkasan progres magang dan tugas-tugas Anda.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm">
                <div>
                    <span className="font-semibold text-slate-600 block">NIM</span>
                    <span className="text-slate-800">{user?.nim}</span>
                </div>
                <div>
                    <span className="font-semibold text-slate-600 block">Departemen</span>
                    <span className="text-slate-800">{user?.dept}</span>
                </div>
                <div>
                    <span className="font-semibold text-slate-600 block">Angkatan</span>
                    <span className="text-slate-800">{user?.angkatan}</span>
                </div>
            </div>
            <button 
                onClick={() => setActiveMenu('profil')} 
                className="mt-6 px-5 py-2.5 text-sm bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:scale-105"
            >
                Lihat Profil Lengkap
            </button>
        </div>

        {/* Grid untuk Ringkasan */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Kolom Kiri: Proyek Akhir */}
            <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Ringkasan Proyek Akhir</h3>
                    <button onClick={() => setActiveMenu('proyek')} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                        Lihat Detail
                    </button>
                </div>
                <div className="space-y-6">
                    <div>
                        <h4 className="font-bold text-slate-700 mb-2">Judul Kerja Praktik (KP)</h4>
                        <p className="text-slate-600 text-sm p-4 bg-slate-50 rounded-md min-h-[50px] line-clamp-2">
                            {user?.judulKp || 'Belum diisi'}
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-700 mb-2">Judul Tugas Akhir (TA)</h4>
                        <p className="text-slate-600 text-sm p-4 bg-slate-50 rounded-md min-h-[50px] line-clamp-2">
                            {user?.judulTa || 'Belum diisi'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Kolom Kanan: Tugas */}
            <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Tugas</h3>
                    <button onClick={() => setActiveMenu('tugas')} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                        Semua
                    </button>
                </div>
                <div className="space-y-4">
                    {/* Placeholder jika tidak ada tugas */}
                    <div className="text-center text-slate-500 p-4">
                        <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-12 h-12 mx-auto text-green-500" />
                        <p className="mt-2 font-semibold">Tidak ada tugas.</p>
                        <p className="text-xs">Semua tugas sudah selesai dikerjakan.</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
);


// --- Tampilan untuk Halaman Profil ---
const ProfilView = ({ user, navigate }) => (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in">
        <div className="border-b border-slate-200 pb-4 mb-6">
            <h2 className="text-xl font-bold text-slate-800">Profil Mahasiswa</h2>
            <p className="text-slate-500 mt-1">Ini adalah detail informasi pribadi dan tambahan Anda.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div>
                <h3 className="font-bold text-lg text-slate-700 mb-3">Informasi Pribadi</h3>
                <div className="space-y-3 text-sm">
                    <p><span className="font-semibold text-slate-600 w-28 inline-block">Nama Lengkap</span>: {user?.nama || '...'}</p>
                    <p><span className="font-semibold text-slate-600 w-28 inline-block">NIM</span>: {user?.nim || '...'}</p>
                    <p><span className="font-semibold text-slate-600 w-28 inline-block">Angkatan</span>: {user?.angkatan || '...'}</p>
                    <p><span className="font-semibold text-slate-600 w-28 inline-block">Business Unit</span>: {user?.bu || '...'}</p>
                    <p><span className="font-semibold text-slate-600 w-28 inline-block">Departemen</span>: {user?.dept || '...'}</p>
                </div>
            </div>
            <div>
                <h3 className="font-bold text-lg text-slate-700 mb-3">Informasi Tambahan</h3>
                <div className="space-y-3 text-sm">
                    <p><span className="font-semibold text-slate-600 w-28 inline-block">Kacamata</span>: {user?.pakaiKacamata ? 'Ya' : 'Tidak'}</p>
                    <p><span className="font-semibold text-slate-600 w-28 inline-block">Riwayat Penyakit</span>: {user?.riwayatPenyakit || 'Tidak ada'}</p>
                    <p><span className="font-semibold text-slate-600 w-28 inline-block">Scholar</span>: {user?.scholar || 'Non-scholar'}</p>
                    <p><span className="font-semibold text-slate-600 w-28 inline-block">English</span>: {user?.english || '-'}</p>
                </div>
            </div>
        </div>
        <div className="mt-8 text-center">
            <button onClick={() => navigate('/mahasiswa/lengkapi-profil')} className="px-5 py-2.5 text-sm bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:scale-105">
                Edit Profil
            </button>
        </div>
    </div>
);

// --- Tampilan untuk Halaman Proyek Akhir (DIROMBAK) ---
const ProyekAkhirView = ({ user, navigate, allTitles }) => {
    // State untuk search bar
    const [searchTerm, setSearchTerm] = useState('');

    // Logika untuk memfilter judul berdasarkan searchTerm
    const filteredTitles = allTitles.filter(item => {
        const nim = item.nim?.toLowerCase() || '';
        const nama = item.nama?.toLowerCase() || '';
        const judulKp = item.judulKp?.toLowerCase() || '';
        const judulTa = item.judulTa?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        return (
            nim.includes(search) ||
            nama.includes(search) ||
            judulKp.includes(search) ||
            judulTa.includes(search)
        );
    });

    return (
     <div className="animate-fade-in space-y-6">
        {/* --- KARTU 1: JUDUL ANDA SAAT INI --- */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
            <div className="border-b border-slate-200 pb-4 mb-6">
                <h2 className="text-xl font-bold text-slate-800">Proyek Akhir Anda</h2>
                <p className="text-slate-500 mt-1">Informasi mengenai judul Kerja Praktik dan Tugas Akhir Anda.</p>
            </div>
            <div className="space-y-6">
                <div>
                    <h3 className="font-bold text-lg text-slate-700 mb-2">Judul Kerja Praktik (KP)</h3>
                    <p className="text-slate-600 p-4 bg-slate-50 rounded-md min-h-[50px]">{user?.judulKp || 'Belum diisi'}</p>
                </div>
                <div>
                    <h3 className="font-bold text-lg text-slate-700 mb-2">Judul Tugas Akhir (TA)</h3>
                    <p className="text-slate-600 p-4 bg-slate-50 rounded-md min-h-[50px]">{user?.judulTa || 'Belum diisi'}</p>
                </div>
            </div>
            <div className="mt-8 text-center">
                <button onClick={() => navigate('/mahasiswa/lengkapi-profil')} className="px-5 py-2.5 text-sm bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:scale-105">
                    Perbarui Judul KP/TA
                </button>
            </div>
        </div>

        {/* --- KARTU 2: DATABASE JUDUL (FITUR BARU) --- */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
            <div className="border-b border-slate-200 pb-4 mb-6">
                <h2 className="text-xl font-bold text-slate-800">Database Judul KP & TA</h2>
                <p className="text-slate-500 mt-1">Gunakan fitur pencarian untuk memastikan orisinalitas judul Anda.</p>
            </div>
            
            {/* Search Bar */}
            <div className="mb-4">
                <label htmlFor="searchJudul" className="sr-only">Cari Judul</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                        type="search"
                        id="searchJudul"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Cari berdasarkan NIM, Nama, atau Judul..."
                    />
                </div>
            </div>

            {/* Tabel Data Judul */}
            <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">NIM</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Nama Mahasiswa</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Judul Kerja Praktik (KP)</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Judul Tugas Akhir (TA)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {filteredTitles.length > 0 ? (
                            filteredTitles.map((item) => (
                                <tr key={item.nim} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{item.nim}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.nama}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{item.judulKp || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{item.judulTa || '-'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-slate-500">
                                    Tidak ada data yang cocok dengan pencarian Anda.
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

// --- KOMPONEN BARU UNTUK SATU ITEM TUGAS ---
// Komponen ini menangani state dan logika upload untuk satu tugas
const TugasItem = ({ taskNumber }) => {
    const [judul, setJudul] = useState('');
    const [fileLaporan, setFileLaporan] = useState(null); // Diubah dari 'file'
    const [filePresentasi, setFilePresentasi] = useState(null); // FILE BARU
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success'); // 'success' atau 'error'

    // Handler untuk file laporan
    const handleLaporanChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFileLaporan(e.target.files[0]);
        } else {
            setFileLaporan(null);
        }
    };

    // Handler BARU untuk file presentasi
    const handlePresentasiChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFilePresentasi(e.target.files[0]);
        } else {
            setFilePresentasi(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validasi diubah: Judul dan Laporan wajib, Presentasi opsional
        if (!judul || !fileLaporan) {
            setMessage('Judul tugas dan File Laporan wajib diisi.');
            setMessageType('error');
            return;
        }

        setIsLoading(true);
        setMessage('');

        // Kita gunakan FormData karena ada file upload
        const formData = new FormData();
        formData.append('taskNumber', taskNumber);
        formData.append('judulTugas', judul);
        formData.append('fileLaporan', fileLaporan);
        
        // Hanya tambahkan file presentasi jika ada
        if (filePresentasi) {
            formData.append('filePresentasi', filePresentasi);
        }

        const token = localStorage.getItem('mahasiswaAuthToken');

        try {
            // --- SIMULASI UPLOAD ---
            console.log('Simulasi upload data:', { 
                taskNumber, 
                judul, 
                laporan: fileLaporan.name, 
                presentasi: filePresentasi ? filePresentasi.name : 'Tidak ada' 
            });
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulasi delay API
            // --- AKHIR SIMULASI ---

            /* // --- CONTOH API CALL SUNGGUHAN (Ganti URL-nya nanti) ---
            await axios.post(`${API_URL}/mahasiswa/tugas`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' // Penting untuk file upload
                }
            });
            */

            // Jika berhasil
            setMessage('Tugas ' + taskNumber + ' berhasil diupload!');
            setMessageType('success');

        } catch (err) {
            // Jika gagal
            console.error('Gagal upload tugas:', err);
            setMessage('Gagal upload. Silakan coba lagi.');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Setiap tugas adalah form terpisah di dalam card-nya sendiri
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
            <h4 className="text-lg font-bold text-slate-800 mb-4">Tugas {taskNumber}</h4>
            <div className="space-y-4">
                {/* Input Judul Tugas */}
                <div>
                    <label htmlFor={`judul-${taskNumber}`} className="block text-sm font-semibold text-slate-600 mb-1">Judul Tugas</label>
                    <input
                        type="text"
                        id={`judul-${taskNumber}`}
                        value={judul}
                        onChange={(e) => setJudul(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Contoh: Laporan Mingguan I"
                        disabled={isLoading}
                    />
                </div>
                {/* Input File Laporan (Diperbarui) */}
                <div>
                    <label htmlFor={`file-laporan-${taskNumber}`} className="block text-sm font-semibold text-slate-600 mb-1">Upload File Laporan (PDF, DOCX)</label>
                    <input
                        type="file"
                        id={`file-laporan-${taskNumber}`}
                        onChange={handleLaporanChange}
                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                        disabled={isLoading}
                        accept=".pdf,.doc,.docx"
                    />
                    {fileLaporan && <span className="text-xs text-slate-500 mt-1 block">File terpilih: {fileLaporan.name}</span>}
                </div>
                {/* Input File Presentasi (BARU) */}
                <div>
                    <label htmlFor={`file-presentasi-${taskNumber}`} className="block text-sm font-semibold text-slate-600 mb-1">Upload File Presentasi (PPTX, PDF)</label>
                    <input
                        type="file"
                        id={`file-presentasi-${taskNumber}`}
                        onChange={handlePresentasiChange}
                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 disabled:opacity-50"
                        disabled={isLoading}
                        accept=".pptx,.pdf"
                    />
                    {filePresentasi && <span className="text-xs text-slate-500 mt-1 block">File terpilih: {filePresentasi.name}</span>}
                </div>
                {/* Tombol Submit & Pesan Status */}
                <div className="flex items-center justify-between pt-2">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="px-5 py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all disabled:bg-slate-400"
                    >
                        {isLoading ? 'Mengupload...' : 'Upload Tugas'}
                    </button>
                    {message && (
                        <span className={`text-sm font-semibold ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {message}
                        </span>
                    )}
                </div>
            </div>
        </form>
    );
};


// --- Tampilan untuk Halaman Tugas (DIROMBAK) ---
const TugasView = ({ user, navigate }) => {
    // Daftar tugas dengan angka Romawi
    const taskList = ['I', 'II', 'III', 'IV', 'V', 'VI'];

    return (
        <div className="animate-fade-in">
            {/* Catatan: Header (judul "Tugas" dan deskripsi) 
             sekarang ada di komponen header utama, 
             jadi di sini kita langsung tampilkan daftar tugasnya.
            */}
            
            {/* Kita buat grid agar rapi di layar besar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Loop/map semua tugas dan render komponen TugasItem untuk masing-masing */}
                {taskList.map(number => (
                    <TugasItem key={number} taskNumber={number} />
                ))}
            </div>
        </div>
    );
};


// --- Komponen Dashboard Utama ---
const MahasiswaDashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeMenu, setActiveMenu] = useState('dashboard'); // <-- Default diubah ke 'dashboard'
    const [allTitles, setAllTitles] = useState([]); // <-- STATE BARU UNTUK MENAMPUNG SEMUA JUDUL
    const navigate = useNavigate();

    // Objek untuk judul header dinamis
    const menuTitles = {
        dashboard: 'Dashboard',
        profil: 'Profil Saya',
        proyek: 'Proyek Akhir',
        tugas: 'Tugas'
    };

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('mahasiswaAuthToken');
            if (!token) {
                navigate('/mahasiswa/login');
                return;
            }
            try {
                // --- [PERBAIKAN] Menggunakan API_URL ---
                const response = await axios.get(`${API_URL}/mahasiswa/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (err) {
                setError('Gagal memuat data profil. Silakan coba login kembali.');
                console.error(err);
                localStorage.removeItem('mahasiswaAuthToken');
                navigate('/mahasiswa/login');
            } finally {
                setLoading(false);
            }
        };

        // --- FETCH BARU UNTUK SEMUA JUDUL (MENGGUNAKAN MOCK DATA) ---
        const fetchAllTitles = () => {
            // Nanti, Anda akan mengganti ini dengan API call sungguhan ke backend
            // const response = await axios.get(`${API_URL}/mahasiswa/all-titles`, { ... });
            // setAllTitles(response.data);

            // Mock data untuk sekarang:
            const mockAllTitles = [
                { nim: '2255301001', nama: 'Budi Santoso', judulKp: 'Analisis Sistem Informasi Persediaan Barang di PT. ABC', judulTa: 'Rancang Bangun Aplikasi E-Commerce Berbasis Web' },
                { nim: '2255301002', nama: 'Ani Yudhoyono', judulKp: 'Implementasi Jaringan Komputer LAN di Kantor XYZ', judulTa: 'Sistem Pendukung Keputusan Pemilihan Karyawan Terbaik' },
                { nim: '2255301003', nama: 'Citra Lestari', judulKp: 'Pembuatan Website Profil Perusahaan CV. Maju Jaya', judulTa: 'Analisis Keamanan Jaringan Menggunakan Metode Penetration Testing' },
                { nim: '2255301004', nama: 'Dewi Persik', judulKp: 'Sistem Informasi Absensi Karyawan Berbasis Fingerprint', judulTa: '' },
                { nim: '2255301005', nama: 'Eko Patrio', judulKp: 'Perawatan dan Perbaikan Komputer di Lab Sekolah', judulTa: 'Pengembangan Aplikasi Mobile Learning untuk Mata Pelajaran Matematika' },
            ];
            setAllTitles(mockAllTitles);
        };

        fetchProfile();
        fetchAllTitles(); // Panggil fungsi fetch baru
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('mahasiswaAuthToken');
        navigate('/mahasiswa/login');
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-slate-50"><p className="text-lg font-semibold animate-pulse">Memuat data...</p></div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen bg-red-50"><p className="text-lg text-red-600 font-semibold">{error}</p></div>;
    }

    return (
        <div className="flex h-screen bg-slate-100 text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} user={user} handleLogout={handleLogout} />
            <main className="flex-1 flex flex-col overflow-y-auto">
                 <header className="flex items-center h-20 p-6 border-b border-slate-200 bg-white sticky top-0 z-10">
                     <div className="flex-1">
                         {/* Header dinamis berdasarkan menu aktif */}
                         <h1 className="text-2xl font-bold text-slate-800">{menuTitles[activeMenu]}</h1>
                     </div>
                     <div className="flex items-center">
                         <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                             {user?.nama?.charAt(0)}
                         </div>
                         <div className="ml-3 text-left">
                             <p className="font-semibold text-slate-700 text-sm truncate max-w-[150px]">{user?.nama}</p>
                             <p className="text-xs text-slate-500">{user?.nim}</p>
                         </div>
                     </div>
                 </header>
                 {/* Latar belakang main content diubah agar lebih kontras dengan kartu */}
                 <div className="p-6 md:p-8 bg-slate-100"> 
                     {/* Konten dinamis berdasarkan menu aktif */}
                     {activeMenu === 'dashboard' && <DashboardView user={user} setActiveMenu={setActiveMenu} />}
                     {activeMenu === 'profil' && <ProfilView user={user} navigate={navigate} />}
                     {/* Berikan prop allTitles ke ProyekAkhirView */}
                     {activeMenu === 'proyek' && <ProyekAkhirView user={user} navigate={navigate} allTitles={allTitles} />}
                     {activeMenu === 'tugas' && <TugasView user={user} navigate={navigate} />}
                 </div>
            </main>
        </div>
    );
};

export default MahasiswaDashboard;