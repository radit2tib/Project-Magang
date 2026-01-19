import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; // [BARU] Import useNavigate
import aprilLogo from '../assets/icons/april.png';

// --- IMPORT HALAMAN FITUR (MODULAR) ---
import KptaPage from './Kpta'; 
import DataPage from './Datapage'; 
import AdminManajemenTugas from './AdminManajemenTugas'; 
import AdminPenilaian from './AdminPenilaian'; 

// Konfigurasi API
const API_URL = 'http://localhost:8000';

// --- KOMPONEN PENDUKUNG (HELPER) ---

const Icon = ({ path, className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path}></path>
    </svg>
);

const PageContent = ({ id, activeMenu, children }) => (
    <div className={activeMenu === id ? 'block animate-fade-in' : 'hidden'}>
        {children}
    </div>
);

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
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
            <div className={`p-3 rounded-full inline-block ${iconClass}`}>
                <Icon path={iconPath} className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-500 font-semibold mt-4 mb-1 uppercase tracking-wider">{title}</p>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
    );
};

// --- TAMPILAN HALAMAN UTAMA (HOME DASHBOARD) ---
const AdminDashboardView = ({ setActiveMenu }) => {
    const [stats, setStats] = useState({
        laporanPending: 0,
        totalMahasiswa: 0,
        tugasAktif: 0,
        perluPenilaian: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_URL}/mahasiswa/admin/penugasan`);
                const students = response.data;

                const totalMhs = students.length;

                let pendingCount = 0;
                students.forEach(mhs => {
                    if (mhs.fileLaporanKp && !mhs.nilaiKpAkhir) pendingCount++;
                    if (mhs.fileLaporanTa && !mhs.nilaiTaAkhir) pendingCount++;
                });

                let totalTugasDikumpulkan = 0; 
                let totalBelumDinilai = 0;    

                students.forEach(mhs => {
                    if (mhs.daftarTugas && mhs.daftarTugas.length > 0) {
                        mhs.daftarTugas.forEach(tugas => {
                            if (tugas.fileLaporan) {
                                totalTugasDikumpulkan++;
                                if (tugas.nilai === null || tugas.nilai === undefined) {
                                    totalBelumDinilai++;
                                }
                            }
                        });
                    }
                });

                setStats({
                    laporanPending: pendingCount,
                    totalMahasiswa: totalMhs,
                    tugasAktif: totalTugasDikumpulkan,
                    perluPenilaian: totalBelumDinilai
                });

            } catch (error) {
                console.error("Gagal memuat statistik dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Selamat datang, Admin!</h2>
                <p className="text-slate-500 mt-2 text-sm md:text-base">Berikut adalah ringkasan aktivitas sistem manajemen magang hari ini (Real-time Data).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Laporan Pending"
                    value={stats.laporanPending}
                    iconPath="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    iconClass="bg-orange-100 text-orange-600"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Total Mahasiswa"
                    value={stats.totalMahasiswa}
                    iconPath="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    iconClass="bg-blue-100 text-blue-600"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Penugasan Aktif"
                    value={stats.tugasAktif}
                    iconPath="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    iconClass="bg-indigo-100 text-indigo-600"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Perlu Penilaian"
                    value={stats.perluPenilaian}
                    iconPath="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    iconClass="bg-green-100 text-green-600"
                    isLoading={isLoading}
                />
            </div>

            <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Pintasan Cepat</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => setActiveMenu('data')}>
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                                <Icon path="M4 6h16M4 12h16m-7 6h7" className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Manajemen Data</h3>
                        </div>
                        <p className="text-slate-600 mt-4 mb-6 text-sm">Kelola data master mahasiswa dan dosen.</p>
                        <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center">Buka Data <span className="ml-1 text-lg">&rarr;</span></button>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => setActiveMenu('penugasan')}>
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors">
                                <Icon path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Penugasan</h3>
                        </div>
                        <p className="text-slate-600 mt-4 mb-6 text-sm">Periksa tugas mahasiswa dan beri nilai.</p>
                        <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center">Buka Penugasan <span className="ml-1 text-lg">&rarr;</span></button>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => setActiveMenu('kpta')}>
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                                <Icon path="M12 6.253v11.494m-5.747-8.994l11.494 0M12 21.747A9.75 9.75 0 1112 2.253a9.75 9.75 0 010 19.494z" className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Laporan KP/TA</h3>
                        </div>
                        <p className="text-slate-600 mt-4 mb-6 text-sm">Validasi laporan akhir mahasiswa.</p>
                        <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center">Buka Laporan <span className="ml-1 text-lg">&rarr;</span></button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- KOMPONEN UTAMA: DASHBOARD ---
const Dashboard = () => {
    // [BARU] Inisialisasi hook navigate
    const navigate = useNavigate();

    // STATE UNTUK MOBILE SIDEBAR
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const [activeMenu, setActiveMenu] = useState(() => {
        return localStorage.getItem('adminActiveMenu') || 'dashboard';
    });

    useEffect(() => {
        localStorage.setItem('adminActiveMenu', activeMenu);
    }, [activeMenu]);

    const menuTitles = {
        dashboard: 'Dashboard',
        data: 'Manajemen Data',
        penugasan: 'Manajemen Penugasan',
        kpta: 'Manajemen Laporan',
        penilaian: 'Manajemen Penilaian'
    };

    const getMenuClasses = (menuName) => {
        const base = 'flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-in-out font-semibold border-l-4 cursor-pointer';
        if (activeMenu === menuName) {
            return `${base} bg-blue-100 text-blue-600 border-blue-600`;
        }
        return `${base} text-slate-600 border-transparent hover:bg-blue-50 hover:text-blue-600`;
    };

    const handleMenuClick = (menuName) => {
        setActiveMenu(menuName);
        setIsMobileSidebarOpen(false); // Tutup sidebar saat menu diklik di mobile
    };

    // [PERBAIKAN] Fungsi Logout menggunakan useNavigate
    const handleLogout = () => {
        // Hapus token dan role
        localStorage.removeItem('token');
        localStorage.removeItem('role'); 
        
        // Bersihkan state menu agar saat login lagi kembali ke dashboard
        localStorage.removeItem('adminActiveMenu');

        // Navigasi ke halaman login admin dengan mulus
        navigate('/admin/login');
    };

    return (
        <div className="flex h-screen bg-slate-100 text-slate-800 font-sans overflow-hidden">
            
            {/* --- OVERLAY MOBILE --- */}
            {isMobileSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
                    onClick={() => setIsMobileSidebarOpen(false)}
                ></div>
            )}

            {/* --- SIDEBAR RESPONSIVE --- */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 
                transform transition-transform duration-300 ease-in-out
                md:static md:translate-x-0
                ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex items-center justify-between h-20 border-b border-slate-200 p-4">
                    <div className="flex justify-center w-full">
                        <img 
                            src={aprilLogo} 
                            alt="Logo APRIL" 
                            className="h-9" 
                            onError={(e) => e.target.src = "https://placehold.co/150x50/0033A0/FFFFFF?text=APRIL"} 
                        />
                    </div>
                    {/* Tombol Close Sidebar (Hanya Mobile) */}
                    <button 
                        onClick={() => setIsMobileSidebarOpen(false)} 
                        className="md:hidden text-slate-500 hover:text-red-500 p-1"
                    >
                        <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex flex-col flex-grow p-4 overflow-y-auto">
                    <nav className="flex-grow space-y-2">
                        <div onClick={() => handleMenuClick('dashboard')} className={getMenuClasses('dashboard')}>
                            <Icon path="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25A2.25 2.25 0 018.25 10.5H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6A2.25 2.25 0 0115.75 3.75h2.25A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75A2.25 2.25 0 0115.75 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                            <span className="ml-4">Dashboard</span>
                        </div>
                        
                        <div onClick={() => handleMenuClick('data')} className={getMenuClasses('data')}>
                            <Icon path="M4 6h16M4 12h16m-7 6h7" />
                            <span className="ml-4">Data</span>
                        </div>

                        <div onClick={() => handleMenuClick('penugasan')} className={getMenuClasses('penugasan')}>
                            <Icon path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            <span className="ml-4">Penugasan</span>
                        </div>

                        <div onClick={() => handleMenuClick('kpta')} className={getMenuClasses('kpta')}>
                            <Icon path="M12 6.253v11.494m-5.747-8.994l11.494 0M12 21.747A9.75 9.75 0 1112 2.253a9.75 9.75 0 010 19.494z" />
                            <span className="ml-4">Laporan</span>
                        </div>

                        <div onClick={() => handleMenuClick('penilaian')} className={getMenuClasses('penilaian')}>
                            <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <span className="ml-4">Penilaian</span>
                        </div>
                    </nav>
                    
                    <div className="border-t border-slate-200 pt-4">
                        <div 
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 mt-4 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg cursor-pointer transition-colors"
                        >
                            <Icon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            <span className="ml-4 font-semibold">Logout</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex flex-col flex-1 h-screen overflow-hidden">
                
                {/* Header Sticky */}
                <header className="flex items-center justify-between h-20 p-4 md:p-8 border-b border-slate-200 bg-white sticky top-0 z-20 shadow-sm md:shadow-none">
                    <div className="flex items-center">
                        {/* TOMBOL HAMBURGER (MOBILE ONLY) */}
                        <button 
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="mr-4 p-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden focus:outline-none"
                        >
                            <Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" className="w-7 h-7" />
                        </button>

                        <h1 className="text-xl md:text-2xl font-bold text-slate-800 truncate">{menuTitles[activeMenu]}</h1>
                    </div>
                    
                    <div className="flex items-center">
                        <img className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover border border-slate-200" src="https://placehold.co/100x100/E2E8F0/4A5568?text=RH" alt="Admin Avatar" />
                        <div className="ml-3 text-left hidden md:block">
                            <p className="font-semibold text-slate-700 text-sm">Raditya Habibie</p>
                            <p className="text-xs text-slate-500">Administrator</p>
                        </div>
                    </div>
                </header>

                {/* Content Container (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-100">
                
                    {/* 1. Halaman Dashboard Home */}
                    <PageContent id="dashboard" activeMenu={activeMenu}>
                        <AdminDashboardView setActiveMenu={setActiveMenu} />
                    </PageContent>
                
                    {/* 2. Halaman Laporan KP/TA */}
                    <PageContent id="kpta" activeMenu={activeMenu}>
                        <KptaPage />
                    </PageContent>
                    
                    {/* 3. Halaman Data Master */}
                    <PageContent id="data" activeMenu={activeMenu}>
                        <DataPage />
                    </PageContent>

                    {/* 4. Halaman Manajemen Tugas */}
                    <PageContent id="penugasan" activeMenu={activeMenu}>
                        <AdminManajemenTugas />
                    </PageContent>

                    {/* 5. Halaman Penilaian */}
                    <PageContent id="penilaian" activeMenu={activeMenu}>
                        <AdminPenilaian /> 
                    </PageContent>

                </div>
            </main>
            
        </div>
    );
};

export default Dashboard;