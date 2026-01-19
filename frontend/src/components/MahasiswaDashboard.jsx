import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import aprilLogo from '../assets/icons/april.png'; 

// --- IMPOR KOMPONEN EKSTERNAL ---
import ProyekAkhirView from '../components/ProyekAkhir.jsx'; 
import MahasiswaTugas from "./MahasiswaTugas.jsx";

// --- KONFIGURASI ---
const API_URL = 'http://localhost:8000'; 

// --- Komponen Ikon SVG ---
const Icon = ({ path, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 shrink-0 ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

// --- Komponen Sidebar (RESPONSIF) ---
const Sidebar = ({ activeMenu, setActiveMenu, user, handleLogout, isOpen, closeSidebar }) => {
    // Fungsi pembantu: saat menu diklik di HP, sidebar otomatis tertutup
    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
        closeSidebar();
    };

    return (
        <>
            {/* Class logic: 
                - Mobile: fixed position, hidden secara default (-translate-x-full), muncul jika isOpen (translate-x-0)
                - Desktop (md): static position, selalu muncul (md:translate-x-0) 
            */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
                md:translate-x-0 md:static md:shadow-lg flex flex-col
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex items-center justify-between h-20 border-b border-slate-200 p-4">
                    <div className="flex justify-center w-full">
                         <img 
                            src={aprilLogo} 
                            alt="Logo APRIL" 
                            className="h-8 md:h-9" 
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x50?text=Logo"; }}
                        />
                    </div>
                    {/* Tombol Close (X) hanya di Mobile */}
                    <button onClick={closeSidebar} className="md:hidden text-slate-500 hover:text-red-500">
                        <Icon path="M6 18L18 6M6 6l12 12" />
                    </button>
                </div>

                <div className="flex flex-col flex-grow p-4 overflow-y-auto">
                    <nav className="flex-grow space-y-2">
                        <button onClick={() => handleMenuClick('dashboard')} className={`flex items-center w-full px-4 py-2.5 rounded-lg transition-all duration-200 text-sm text-left ${activeMenu === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}`}>
                            <Icon path="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25A2.25 2.25 0 018.25 10.5H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6A2.25 2.25 0 0115.75 3.75h2.25A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75A2.25 2.25 0 0115.75 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" className="mr-3" />
                            <span className="font-semibold">Dashboard</span>
                        </button>
                        
                        <button onClick={() => handleMenuClick('profil')} className={`flex items-center w-full px-4 py-2.5 rounded-lg transition-all duration-200 text-sm text-left ${activeMenu === 'profil' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}`}>
                            <Icon path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" className="mr-3" />
                            <span className="font-semibold">Profil Saya</span>
                        </button>
                        <button onClick={() => handleMenuClick('proyek')} className={`flex items-center w-full px-4 py-2.5 rounded-lg transition-all duration-200 text-sm text-left ${activeMenu === 'proyek' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}`}>
                            <Icon path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" className="mr-3" />
                            <span className="font-semibold">Proyek Akhir</span>
                        </button>
                        <button onClick={() => handleMenuClick('tugas')} className={`flex items-center w-full px-4 py-2.5 rounded-lg transition-all duration-200 text-sm text-left ${activeMenu === 'tugas' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}`}>
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
            
            {/* OVERLAY (Background Gelap saat menu mobile terbuka) */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={closeSidebar}
                ></div>
            )}
        </>
    );
};

// --- Tampilan Dashboard View (Tidak Berubah Banyak, hanya responsivitas grid) ---
const DashboardView = ({ user, setActiveMenu }) => (
    <div className="animate-fade-in">
        <div className="mb-6 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Selamat datang, {user?.nama?.split(' ')[0]}!</h2>
            <p className="text-slate-500 mt-2 text-sm md:text-base">Ini adalah ringkasan progres magang dan tugas-tugas Anda.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm">
                <div className="bg-slate-50 p-3 rounded-lg md:bg-transparent md:p-0">
                    <span className="font-semibold text-slate-600 block">NIM</span>
                    <span className="text-slate-800 break-all">{user?.nim}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg md:bg-transparent md:p-0">
                    <span className="font-semibold text-slate-600 block">Departemen</span>
                    <span className="text-slate-800">{user?.dept}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg md:bg-transparent md:p-0">
                    <span className="font-semibold text-slate-600 block">Angkatan</span>
                    <span className="text-slate-800">{user?.angkatan}</span>
                </div>
            </div>
            <button 
                onClick={() => setActiveMenu('profil')} 
                className="mt-6 px-5 py-2.5 w-full md:w-auto text-sm bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:scale-105"
            >
                Lihat Profil Lengkap
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-slate-800">Ringkasan Proyek Akhir</h3>
                    <button onClick={() => setActiveMenu('proyek')} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                        Lihat Detail
                    </button>
                </div>
                <div className="space-y-6">
                    <div>
                        <h4 className="font-bold text-slate-700 mb-2 text-sm md:text-base">Judul Kerja Praktik (KP)</h4>
                        <p className="text-slate-600 text-sm p-4 bg-slate-50 rounded-md min-h-[50px]">
                            {user?.judulKp || 'Belum diisi'}
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-700 mb-2 text-sm md:text-base">Judul Tugas Akhir (TA)</h4>
                        <p className="text-slate-600 text-sm p-4 bg-slate-50 rounded-md min-h-[50px]">
                            {user?.judulTa || 'Belum diisi'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-slate-800">Tugas</h3>
                    <button onClick={() => setActiveMenu('tugas')} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                        Semua
                    </button>
                </div>
                <div className="space-y-4">
                    <div className="text-center text-slate-500 p-4 flex flex-col items-center">
                        <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-12 h-12 text-green-500 mb-2" />
                        <p className="mt-2 font-semibold">Status Tugas</p>
                        <p className="text-xs">Cek menu Tugas untuk melihat progres.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- Tampilan Profil View ---
const ProfilView = ({ user, navigate }) => (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in border border-slate-200">
        <div className="border-b border-slate-200 pb-4 mb-6">
            <h2 className="text-xl font-bold text-slate-800">Profil Mahasiswa</h2>
            <p className="text-slate-500 mt-1 text-sm">Detail informasi pribadi dan tambahan Anda.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div>
                <h3 className="font-bold text-lg text-slate-700 mb-3">Informasi Pribadi</h3>
                <div className="space-y-3 text-sm">
                    <p className="flex flex-col md:flex-row"><span className="font-semibold text-slate-600 w-28">Nama Lengkap</span> <span className="hidden md:inline">: </span>{user?.nama || '...'}</p>
                    <p className="flex flex-col md:flex-row"><span className="font-semibold text-slate-600 w-28">NIM</span> <span className="hidden md:inline">: </span>{user?.nim || '...'}</p>
                    <p className="flex flex-col md:flex-row"><span className="font-semibold text-slate-600 w-28">Angkatan</span> <span className="hidden md:inline">: </span>{user?.angkatan || '...'}</p>
                    <p className="flex flex-col md:flex-row"><span className="font-semibold text-slate-600 w-28">Business Unit</span> <span className="hidden md:inline">: </span>{user?.bu || '...'}</p>
                    <p className="flex flex-col md:flex-row"><span className="font-semibold text-slate-600 w-28">Departemen</span> <span className="hidden md:inline">: </span>{user?.dept || '...'}</p>
                </div>
            </div>
            <div>
                <h3 className="font-bold text-lg text-slate-700 mb-3">Informasi Tambahan</h3>
                <div className="space-y-3 text-sm">
                    <p className="flex flex-col md:flex-row"><span className="font-semibold text-slate-600 w-28">Kacamata</span> <span className="hidden md:inline">: </span>{user?.pakaiKacamata ? 'Ya' : 'Tidak'}</p>
                    <p className="flex flex-col md:flex-row"><span className="font-semibold text-slate-600 w-28">Riwayat Penyakit</span> <span className="hidden md:inline">: </span>{user?.riwayatPenyakit || 'Tidak ada'}</p>
                    <p className="flex flex-col md:flex-row"><span className="font-semibold text-slate-600 w-28">Scholar</span> <span className="hidden md:inline">: </span>{user?.scholar || 'Non-scholar'}</p>
                    <p className="flex flex-col md:flex-row"><span className="font-semibold text-slate-600 w-28">English</span> <span className="hidden md:inline">: </span>{user?.english || '-'}</p>
                </div>
            </div>
        </div>
        <div className="mt-8 text-center">
            <button onClick={() => navigate('/mahasiswa/lengkapi-profil')} className="w-full md:w-auto px-5 py-2.5 text-sm bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:scale-105">
                Edit Profil
            </button>
        </div>
    </div>
);

// --- Komponen Dashboard Utama ---
const MahasiswaDashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [allTitles, setAllTitles] = useState([]); 
    
    // STATE UNTUK MOBILE SIDEBAR
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const navigate = useNavigate();

    const [activeMenu, setActiveMenu] = useState(() => {
        return sessionStorage.getItem('mahasiswaActiveMenu') || 'dashboard';
    });

    useEffect(() => {
        sessionStorage.setItem('mahasiswaActiveMenu', activeMenu);
    }, [activeMenu]);

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

        const fetchAllTitles = () => {
            const mockAllTitles = [
                { nim: '2255301001', nama: 'Budi Santoso', judulKp: 'Analisis Sistem Informasi Persediaan Barang di PT. ABC', judulTa: 'Rancang Bangun Aplikasi E-Commerce Berbasis Web' },
                { nim: '2255301002', nama: 'Ani Yudhoyono', judulKp: 'Implementasi Jaringan Komputer LAN di Kantor XYZ', judulTa: 'Sistem Pendukung Keputusan Pemilihan Karyawan Terbaik' },
            ];
            setAllTitles(mockAllTitles);
        };

        fetchProfile();
        fetchAllTitles(); 
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem('mahasiswaActiveMenu'); 
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
        <div className="flex h-screen bg-slate-100 text-slate-800 font-sans overflow-hidden">
            {/* Sidebar dengan Props Tambahan untuk Mobile */}
            <Sidebar 
                activeMenu={activeMenu} 
                setActiveMenu={setActiveMenu} 
                user={user} 
                handleLogout={handleLogout} 
                isOpen={isMobileSidebarOpen}
                closeSidebar={() => setIsMobileSidebarOpen(false)}
            />

            {/* Konten Utama */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                 <header className="flex items-center justify-between h-20 px-6 border-b border-slate-200 bg-white sticky top-0 z-10 shadow-sm md:shadow-none">
                      <div className="flex items-center">
                          {/* TOMBOL HAMBURGER (Hanya muncul di Mobile) */}
                          <button 
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="mr-4 p-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden"
                          >
                             {/* Icon Garis Tiga (Hamburger) */}
                             <Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                          </button>

                          <h1 className="text-xl md:text-2xl font-bold text-slate-800 truncate">
                              {menuTitles[activeMenu]}
                          </h1>
                      </div>

                      <div className="flex items-center">
                           <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm md:text-lg">
                                {user?.nama?.charAt(0)}
                           </div>
                           <div className="ml-3 text-left hidden md:block">
                                <p className="font-semibold text-slate-700 text-sm truncate max-w-[150px]">{user?.nama}</p>
                                <p className="text-xs text-slate-500">{user?.nim}</p>
                           </div>
                      </div>
                 </header>
                 
                 {/* Area Konten Scrollable */}
                 <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-100"> 
                      {activeMenu === 'dashboard' && <DashboardView user={user} setActiveMenu={setActiveMenu} />}
                      {activeMenu === 'profil' && <ProfilView user={user} navigate={navigate} />}
                      {activeMenu === 'proyek' && <ProyekAkhirView user={user} navigate={navigate} allTitles={allTitles} />}
                      {activeMenu === 'tugas' && <MahasiswaTugas user={user} navigate={navigate} />}
                 </div>
            </main>
        </div>
    );
};

export default MahasiswaDashboard;