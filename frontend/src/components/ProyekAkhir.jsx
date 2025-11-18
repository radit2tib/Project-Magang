import React, { useState } from 'react';
import axios from 'axios';

// --- [PENTING] Sesuaikan API_URL jika diperlukan ---
const API_URL = 'http://localhost:8000'; 

// --- Komponen Ikon SVG (disalin dari Dashboard) ---
const Icon = ({ path, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 shrink-0 ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

// --- Komponen Upload Form (Logika Baru) ---
// Komponen kecil ini mengelola state untuk upload file KP & TA
const LaporanUploadForm = ({ user }) => {
    const [fileKP, setFileKP] = useState(null);
    const [fileTA, setFileTA] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success'); // 'success' atau 'error'

    const handleFileKPChange = (e) => {
        setFileKP(e.target.files[0] || null);
    };

    const handleFileTAChange = (e) => {
        setFileTA(e.target.files[0] || null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fileKP && !fileTA) {
            setMessage('Silakan pilih file Laporan KP atau TA untuk diupload.');
            setMessageType('error');
            return;
        }

        setIsLoading(true);
        setMessage('');

        const formData = new FormData();
        if (fileKP) {
            formData.append('fileLaporanKP', fileKP);
        }
        if (fileTA) {
            formData.append('fileLaporanTA', fileTA);
        }
        
        // Tambahkan data lain jika perlu, misal NIM
        // formData.append('nim', user.nim);

        const token = localStorage.getItem('mahasiswaAuthToken');

        try {
                await axios.post(`${API_URL}/mahasiswa/proyek/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage('File laporan berhasil diupload!');
            setMessageType('success');
            setFileKP(null); // Reset form
            setFileTA(null); // Reset form
            // Reset input file di DOM (opsional tapi bagus)
            document.getElementById('file-kp-upload').value = null;
            document.getElementById('file-ta-upload').value = null;

        } catch (err) {
            console.error('Gagal upload file proyek:', err);
            setMessage('Gagal upload. Silakan coba lagi.');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="font-bold text-lg text-slate-700 mb-4">Upload Laporan Proyek Akhir</h3>
            <div className="grid md:grid-cols-2 gap-6">
                {/* Input File Laporan KP */}
                <div>
                    <label htmlFor="file-kp-upload" className="block text-sm font-semibold text-slate-600 mb-1">Upload Laporan KP (PDF, DOCX)</label>
                    <input
                        type="file"
                        id="file-kp-upload"
                        onChange={handleFileKPChange}
                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                        disabled={isLoading}
                        accept=".pdf,.doc,.docx"
                    />
                    {fileKP && <span className="text-xs text-slate-500 mt-1 block">File terpilih: {fileKP.name}</span>}
                </div>
                {/* Input File Laporan TA */}
                <div>
                    <label htmlFor="file-ta-upload" className="block text-sm font-semibold text-slate-600 mb-1">Upload Laporan TA (PDF, DOCX)</label>
                    <input
                        type="file"
                        id="file-ta-upload"
                        onChange={handleFileTAChange}
                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                        disabled={isLoading}
                        accept=".pdf,.doc,.docx"
                    />
                    {fileTA && <span className="text-xs text-slate-500 mt-1 block">File terpilih: {fileTA.name}</span>}
                </div>
            </div>
            {/* Tombol Submit & Pesan Status */}
            <div className="flex items-center justify-between pt-4 mt-4">
                <button 
                    type="submit" 
                    disabled={isLoading || (!fileKP && !fileTA)}
                    className="px-5 py-2.5 text-sm bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all disabled:bg-slate-400"
                >
                    {isLoading ? 'Mengupload...' : 'Upload Laporan'}
                </button>
                {message && (
                    <span className={`text-sm font-semibold ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </span>
                )}
            </div>
        </form>
    );
};


// --- Komponen Utama Halaman Proyek Akhir ---
// (Ini adalah ProyekAkhirView dari file dashboard Anda)
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
          {/* --- KARTU 1: JUDUL & UPLOAD FILE (SUDAH DIMODIFIKASI) --- */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
              <div className="border-b border-slate-200 pb-4 mb-6">
                  <h2 className="text-xl font-bold text-slate-800">Proyek Akhir Anda</h2>
                  <p className="text-slate-500 mt-1">Informasi dan file laporan Kerja Praktik dan Tugas Akhir Anda.</p>
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

              {/* Tombol "Perbarui Judul" (masih ada) */}
              <div className="mt-8 text-center">
                  <button onClick={() => navigate('/mahasiswa/lengkapi-profil')} className="px-5 py-2.5 text-sm bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-all">
                      Perbarui Judul KP/TA
                  </button>
              </div>

              {/* --- BAGIAN UPLOAD FORM BARU --- */}
              <LaporanUploadForm user={user} />
              
          </div>

          {/* --- KARTU 2: DATABASE JUDUL (Sama seperti sebelumnya) --- */}
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

export default ProyekAkhirView;