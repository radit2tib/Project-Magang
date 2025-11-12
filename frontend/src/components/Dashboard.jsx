// File: src/components/Dashboard.jsx (Informasi Dashboard Diperbarui)

import React, { useState, useEffect } from 'react'; // <--- Tambahkan useEffect

import aprilLogo from '../assets/icons/april.png';

// IMPORT HALAMAN YANG ADA
import KptaPage from './Kpta'; // Halaman Laporan KP/TA
import DataPage from './Datapage'; // Halaman Manajemen Data

// --- Komponen Ikon SVG (Tetap) ---
const Icon = ({ path, className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path}></path>
    </svg>
);

// --- Komponen Pembungkus Halaman (Tetap) ---
const PageContent = ({ id, activeMenu, children }) => (
    <div className={activeMenu === id ? 'block animate-fade-in' : 'hidden'}>
        {children}
    </div>
);


// --- [BARU] Komponen Kartu Statistik ---
const StatCard = ({ title, value, iconPath, iconClass, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 animate-pulse">
                <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
                <div className="h-8 bg-slate-200 rounded w-1/2"></div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
            <div className={`p-3 rounded-full inline-block ${iconClass}`}>
                <Icon path={iconPath} className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-500 font-semibold mt-4 mb-1 uppercase tracking-wider">{title}</p>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
    );
};

// --- [MODIFIKASI] Komponen View untuk Dashboard Admin ---
const AdminDashboardView = ({ setActiveMenu }) => {
    // State untuk menampung data statistik dan status loading
    const [stats, setStats] = useState({
        laporanPending: 0,
        totalMahasiswa: 0,
        tugasAktif: 0,
        perluPenilaian: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    // Simulasi pengambilan data dari API saat komponen dimuat
    useEffect(() => {
        // Set loading true saat mulai
        setIsLoading(true);

        // Simulasi delay API 1.5 detik
        const timer = setTimeout(() => {
            // Data dummy (ganti ini dengan API call sungguhan)
            setStats({
                laporanPending: 12,
                totalMahasiswa: 245,
                tugasAktif: 4,
                perluPenilaian: 8
            });
            // Set loading false setelah data "diterima"
            setIsLoading(false);
        }, 1500);

        // Cleanup timeout jika komponen unmount
        return () => clearTimeout(timer);
    }, []); // Array dependensi kosong, berarti hanya berjalan sekali saat mount

    return (
        <div className="space-y-8">
            {/* Kartu Selamat Datang (Tetap) */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200">
                <h2 className="text-3xl font-bold text-slate-800">Selamat datang, Raditya!</h2>
                <p className="text-slate-500 mt-2">Ini adalah ringkasan sistem manajemen KP/TA. Lihat status terbaru di bawah ini.</p>
            </div>

            {/* [BARU] Grid Statistik */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Laporan Pending"
                    value={stats.laporanPending}
                    iconPath="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    iconClass="bg-orange-100 text-orange-600"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Total Mahasiswa"
                    value={stats.totalMahasiswa}
                    iconPath="M15 19.128a9.38 9.38 0 002.625.372m-1.04-4.33c-.092.613.242 1.142.868 1.142.626 0 .96-.53.868-1.142a1.8 1.8 0 00-1.736-1.736zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z"
                    iconClass="bg-blue-100 text-blue-600"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Penugasan Aktif"
                    value={stats.tugasAktif}
                    iconPath="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                    iconClass="bg-indigo-100 text-indigo-600"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Perlu Penilaian"
                    value={stats.perluPenilaian}
                    iconPath="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    iconClass="bg-green-100 text-green-600"
                    isLoading={isLoading}
                />
            </div>

            {/* Grid Pintasan (Layout diubah sedikit) */}
            <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Pintasan Cepat</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Pintasan 1: Manajemen Data */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Icon path="M4 6h16M4 12h16m-7 6h7" className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Manajemen Data</h3>
                        </div>
                        <p className="text-slate-600 mt-4 mb-6 text-sm">
                            Kelola data master mahasiswa, dosen, dan informasi penting lainnya.
                        </p>
                        <button 
                            onClick={() => setActiveMenu('data')} 
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                        >
                            Pergi ke Halaman Data &rarr;
                        </button>
                    </div>

                    {/* Pintasan 2: Manajemen Laporan */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-green-100 rounded-full">
                                <Icon path="M12 6.253v11.494m-5.747-8.994l11.494 0M12 21.747A9.75 9.75 0 1112 2.253a9.75 9.75 0 010 19.494z" className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Manajemen Laporan</h3>
                        </div>
                        <p className="text-slate-600 mt-4 mb-6 text-sm">
                            Lihat, validasi, dan kelola semua laporan KP dan TA yang di-submit mahasiswa.
                        </p>
                        <button 
                            onClick={() => setActiveMenu('kpta')} 
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                        >
                            Pergi ke Halaman Laporan &rarr;
                        </button>
                    </div>

                    {/* Pintasan 3: Manajemen Penugasan */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-indigo-100 rounded-full">
                                <Icon path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Manajemen Penugasan</h3>
                        </div>
                        <p className="text-slate-600 mt-4 mb-6 text-sm">
                            Buat, edit, dan pantau progres tugas-tugas yang diberikan kepada mahasiswa.
                        </p>
                        <button 
                            onClick={() => setActiveMenu('penugasan')} 
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                        >
                            Pergi ke Halaman Penugasan &rarr;
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};


// --- Komponen Utama Dashboard (MODIFIKASI) ---
const Dashboard = () => {
    const [activeMenu, setActiveMenu] = useState('dashboard'); 

    const menuTitles = {
        dashboard: 'Dashboard',
        data: 'Manajemen Data',
        penugasan: 'Manajemen Penugasan',
        kpta: 'Manajemen Laporan',
        penilaian: 'Manajemen Penilaian'
    };

    const getMenuClasses = (menuName) => {
        const base = 'flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-in-out font-semibold border-l-4';
        if (activeMenu === menuName) {
            return `${base} bg-blue-100 text-blue-600 border-blue-600`;
        }
        return `${base} text-slate-600 border-transparent hover:bg-blue-50 hover:text-blue-600`;
    };
    
    return (
        <div className="flex h-screen bg-slate-100 text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>
            
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
                <div className="flex items-center justify-center h-20 border-b border-slate-200 p-4">
                    <img src={aprilLogo} alt="Logo APRIL" className="h-10" onError={(e) => e.target.src = "https://placehold.co/150x50/0033A0/FFFFFF?text=APRIL&font=inter"} />
                </div>
                <div className="flex flex-col flex-grow p-4">
                    <nav className="flex-grow space-y-2">
                        
                        <a href="#" onClick={() => setActiveMenu('dashboard')} className={getMenuClasses('dashboard')}>
                            <Icon path="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25A2.25 2.25 0 018.25 10.5H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6A2.25 2.25 0 0115.75 3.75h2.25A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75A2.25 2.25 0 0115.75 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                            <span className="ml-4">Dashboard</span>
                        </a>
                        
                        <a href="#" onClick={() => setActiveMenu('data')} className={getMenuClasses('data')}>
                            <Icon path="M4 6h16M4 12h16m-7 6h7" />
                            <span className="ml-4">Data</span>
                        </a>
                        <a href="#" onClick={() => setActiveMenu('penugasan')} className={getMenuClasses('penugasan')}>
                            <Icon path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            <span className="ml-4">Penugasan</span>
                        </a>
                        <a href="#" onClick={() => setActiveMenu('kpta')} className={getMenuClasses('kpta')}>
                            <Icon path="M12 6.253v11.494m-5.747-8.994l11.494 0M12 21.747A9.75 9.75 0 1112 2.253a9.75 9.75 0 010 19.494z" />
                            <span className="ml-4">Laporan</span>
                        </a>
                        <a href="#" onClick={() => setActiveMenu('penilaian')} className={getMenuClasses('penilaian')}>
                            <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <span className="ml-4">Penilaian</span>
                        </a>
                    </nav>
                    
                    <div className="border-t border-slate-200 pt-4">
                        <a href="#" className="flex items-center w-full px-4 py-3 mt-4 text-slate-600 hover:bg-slate-100 rounded-lg">
                            <Icon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            <span className="ml-4 font-semibold">Logout</span>
                        </a>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex flex-col flex-1 overflow-y-auto">
                
                <header className="flex items-center justify-between h-20 p-6 sm:p-8 border-b border-slate-200 bg-white sticky top-0 z-10">
                    <h1 className="text-2xl font-bold text-slate-800">{menuTitles[activeMenu]}</h1>
                    
                    <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full object-cover" src="https://placehold.co/100x100/E2E8F0/4A5568?text=RH" alt="Admin Avatar" />
                        <div className="ml-3 text-left">
                            <p className="font-semibold text-slate-700 text-sm">Raditya Habibie</p>
                            <p className="text-xs text-slate-500">Admin</p>
                        </div>
                    </div>
                </header>

                <div className="p-6 sm:p-8">
                
                    <PageContent id="dashboard" activeMenu={activeMenu}>
                        <AdminDashboardView setActiveMenu={setActiveMenu} />
                    </PageContent>
                
                    <PageContent id="kpta" activeMenu={activeMenu}>
                        <KptaPage />
                    </PageContent>
                    
                    <PageContent id="data" activeMenu={activeMenu}>
                        <DataPage />
                    </PageContent>

                    <PageContent id="penugasan" activeMenu={activeMenu}>
                        <h1 className="text-3xl font-bold">Halaman Manajemen Penugasan</h1>
                        <p className="text-slate-600 mt-2">Konten untuk manajemen penugasan akan tampil di sini.</p>
                    </PageContent>
                    <PageContent id="penilaian" activeMenu={activeMenu}>
                        <h1 className="text-3xl font-bold">Halaman Manajemen Penilaian</h1>
                        <p className="text-slate-600 mt-2">Konten untuk manajemen penilaian akan tampil di sini.</p>
                    </PageContent>

                </div>
            </main>
            
        </div>
    );
};

export default Dashboard;