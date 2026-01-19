import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Import xlsx
import { saveAs } from 'file-saver'; // Import file-saver

// URL Backend (Sesuaikan jika port beda)
const API_URL = 'http://localhost:8000';

const AdminPenilaian = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null); 
    const [activeTab, setActiveTab] = useState('KP'); 
    const [isLoading, setIsLoading] = useState(true);

    // --- STATE UNTUK PAGINATION ---
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10); 

    // --- 1. FETCH DATA DARI BACKEND ---
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Pastikan endpoint ini benar dan mengembalikan data yang sesuai
            const response = await axios.get(`${API_URL}/mahasiswa/admin/penugasan`);
            
            // MAPPING DATA
            const formattedData = response.data.map(mhs => ({
                ...mhs,
                nilaiKp: { 
                    mentor: mhs.nilaiKpMentor || 0, 
                    penguji: mhs.nilaiKpPenguji || 0, 
                    akhir: mhs.nilaiKpAkhir || 0, 
                    komen: mhs.komenKp || '' 
                },
                nilaiTa: { 
                    mentor: mhs.nilaiTaMentor || 0, 
                    penguji: mhs.nilaiTaPenguji || 0, 
                    akhir: mhs.nilaiTaAkhir || 0, 
                    komen: mhs.komenTa || '' 
                }
            }));

            setStudents(formattedData);
        } catch (error) {
            console.error("Gagal ambil data:", error);
            // alert("Gagal memuat data mahasiswa."); // Opsional: alert error
        } finally {
            setIsLoading(false);
        }
    };

    // --- FUNGSI DOWNLOAD DATA KE EXCEL ---
    const handleDownload = () => {
        if (students.length === 0) {
            alert("Tidak ada data untuk diunduh.");
            return;
        }

        // 1. Siapkan data untuk Excel
        const excelData = students.map((mhs, index) => ({
            No: index + 1,
            NIM: mhs.nim,
            Nama: mhs.nama,
            // Data KP
            'Nilai Mentor KP': mhs.nilaiKp.mentor,
            'Nilai Penguji KP': mhs.nilaiKp.penguji,
            'Nilai Akhir KP': mhs.nilaiKp.akhir,
            'Komentar KP': mhs.nilaiKp.komen,
            // Data TA
            'Nilai Mentor TA': mhs.nilaiTa.mentor,
            'Nilai Penguji TA': mhs.nilaiTa.penguji,
            'Nilai Akhir TA': mhs.nilaiTa.akhir,
            'Komentar TA': mhs.nilaiTa.komen,
        }));

        // 2. Buat Worksheet dan Workbook
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data Penilaian");

        // 3. Atur lebar kolom (opsional)
        const wscols = [
            { wch: 5 }, { wch: 15 }, { wch: 30 },
            { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 30 },
            { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 30 },
        ];
        worksheet['!cols'] = wscols;

        // 4. Tulis File dan Download
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, `Rekap_Penilaian_Mahasiswa_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    // --- 2. HANDLE INPUT PERUBAHAN NILAI ---
    const handleInputChange = (type, field, value) => {
        setSelectedStudent(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: value
            }
        }));
    };

    // --- 3. SIMPAN NILAI KE BACKEND ---
    const handleSave = async () => {
        if (!selectedStudent) return;

        const dataToSend = activeTab === 'KP' ? selectedStudent.nilaiKp : selectedStudent.nilaiTa;

        const payload = {
            nim: selectedStudent.nim,
            type: activeTab,
            nilaiMentor: dataToSend.mentor,
            nilaiPenguji: dataToSend.penguji,
            nilaiAkhir: dataToSend.akhir,
            komen: dataToSend.komen
        };

        try {
            await axios.post(`${API_URL}/mahasiswa/admin/penilaian-akhir`, payload);
            
            alert(`Nilai ${activeTab} untuk ${selectedStudent.nama} berhasil disimpan!`);
            
            const updatedStudents = students.map(s => 
                s.nim === selectedStudent.nim ? selectedStudent : s
            );
            setStudents(updatedStudents);
            setSelectedStudent(null); 

        } catch (error) {
            console.error("Gagal simpan nilai:", error);
            alert("Gagal menyimpan nilai. Periksa koneksi server.");
        }
    };

    // --- LOGIKA FILTER & PAGINATION ---
    const filteredStudents = students.filter(s => 
        s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.nim.includes(searchTerm)
    );

    const indexOfLastStudent = currentPage * entriesPerPage;
    const indexOfFirstStudent = indexOfLastStudent - entriesPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(filteredStudents.length / entriesPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, entriesPerPage]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="animate-fade-in">
             {/* HEADER HALAMAN DENGAN TOMBOL DOWNLOAD */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Manajemen Penilaian KP & TA</h2>
                    <p className="text-slate-500">Input dan kelola nilai Seminar KP dan Sidang TA mahasiswa.</p>
                </div>
                
                <button 
                    onClick={handleDownload}
                    className="flex items-center justify-center px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all transform hover:scale-105 w-full sm:w-auto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l-3.75-3.75M12 12.75l3.75-3.75M12 12.75V3" />
                    </svg>
                    Download Data
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-10 text-slate-500">Memuat data penilaian...</div>
            ) : (
                /* --- TABEL UTAMA --- */
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    
                    {/* HEADER TABEL (SEARCH & ENTRIES) */}
                    <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center text-sm text-slate-600">
                            <span className="mr-2">Tampilkan</span>
                            <select
                                value={entriesPerPage}
                                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                                className="border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="ml-2">entri</span>
                        </div>

                        <div className="relative w-full sm:w-64">
                            <input 
                                type="text" 
                                placeholder="Cari Nama / NIM..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase">
                                <tr>
                                    <th className="px-6 py-3">No</th>
                                    <th className="px-6 py-3">Mahasiswa</th>
                                    <th className="px-6 py-3">Judul KP</th>
                                    <th className="px-6 py-3">Judul TA</th>
                                    <th className="px-6 py-3 text-center">Status Nilai</th>
                                    <th className="px-6 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {currentStudents.map((mhs, index) => {
                                    const isKpGraded = mhs.nilaiKp?.akhir > 0;
                                    const isTaGraded = mhs.nilaiTa?.akhir > 0;
                                    const globalIndex = indexOfFirstStudent + index + 1;

                                    return (
                                        <tr key={mhs.nim} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 w-12 text-center text-slate-400 font-medium">{globalIndex}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800">{mhs.nama}</div>
                                                <div className="text-xs text-slate-500">{mhs.nim}</div>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs truncate" title={mhs.judulKp}>
                                                {mhs.judulKp || <span className="text-slate-400 italic">-</span>}
                                            </td>
                                            <td className="px-6 py-4 max-w-xs truncate" title={mhs.judulTa}>
                                                {mhs.judulTa || <span className="text-slate-400 italic">-</span>}
                                            </td>
                                            <td className="px-6 py-4 text-center space-y-1">
                                                <span className={`block text-[10px] font-bold px-2 py-0.5 rounded ${isKpGraded ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                    KP: {isKpGraded ? mhs.nilaiKp.akhir : 'Belum'}
                                                </span>
                                                <span className={`block text-[10px] font-bold px-2 py-0.5 rounded ${isTaGraded ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                                    TA: {isTaGraded ? mhs.nilaiTa.akhir : 'Belum'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button 
                                                    onClick={() => setSelectedStudent(mhs)}
                                                    className="text-white bg-blue-600 hover:bg-blue-700 font-medium px-4 py-2 rounded-lg text-xs transition-colors shadow-sm"
                                                >
                                                    Input Nilai
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* FOOTER PAGINATION */}
                    {filteredStudents.length > 0 ? (
                        <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <span className="text-sm text-slate-500">
                                Menampilkan {indexOfFirstStudent + 1} sampai {Math.min(indexOfLastStudent, filteredStudents.length)} dari {filteredStudents.length} data
                            </span>
                            <div className="flex space-x-1">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border rounded hover:bg-slate-100 disabled:opacity-50 text-slate-600 text-sm"
                                >
                                    &laquo;
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => paginate(i + 1)}
                                        className={`px-3 py-1 border rounded text-sm ${currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-slate-100 text-slate-600'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border rounded hover:bg-slate-100 disabled:opacity-50 text-slate-600 text-sm"
                                >
                                    &raquo;
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-500">Data tidak ditemukan.</div>
                    )}
                </div>
            )}

            {/* --- MODAL FORM INPUT NILAI (DENGAN BACKGROUND TRANSPARAN) --- */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100">
                        
                        {/* Header Modal */}
                        <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Input Penilaian</h3>
                                <p className="text-sm text-slate-500">{selectedStudent.nama} ({selectedStudent.nim})</p>
                            </div>
                            <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Tabs KP / TA */}
                        <div className="flex border-b border-slate-200">
                            <button 
                                onClick={() => setActiveTab('KP')}
                                className={`flex-1 py-3 text-sm font-bold text-center transition-colors ${activeTab === 'KP' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Kerja Praktik (KP)
                            </button>
                            <button 
                                onClick={() => setActiveTab('TA')}
                                className={`flex-1 py-3 text-sm font-bold text-center transition-colors ${activeTab === 'TA' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Tugas Akhir (TA)
                            </button>
                        </div>

                        {/* Form Content */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            
                            {activeTab === 'KP' ? (
                                <div className="space-y-4">
                                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 mb-4">
                                        <p className="text-xs text-orange-800 font-bold uppercase">Judul KP</p>
                                        <p className="text-sm text-slate-700 italic">{selectedStudent.judulKp || 'Judul KP belum diinput mahasiswa'}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Nilai Mentor</label>
                                            <input type="number" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" 
                                                value={selectedStudent.nilaiKp?.mentor || ''}
                                                onChange={(e) => handleInputChange('nilaiKp', 'mentor', e.target.value)}
                                                placeholder="0-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Nilai Penguji</label>
                                            <input type="number" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" 
                                                value={selectedStudent.nilaiKp?.penguji || ''}
                                                onChange={(e) => handleInputChange('nilaiKp', 'penguji', e.target.value)}
                                                placeholder="0-100"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-semibold text-blue-700 mb-1">Nilai Akhir</label>
                                        <input type="number" className="w-full border-2 border-blue-200 bg-blue-50 p-2 rounded font-bold text-lg text-blue-800 focus:ring-2 focus:ring-blue-500" 
                                            value={selectedStudent.nilaiKp?.akhir || ''}
                                            onChange={(e) => handleInputChange('nilaiKp', 'akhir', e.target.value)}
                                            placeholder="0-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Komentar / Catatan</label>
                                        <textarea rows="3" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                                            value={selectedStudent.nilaiKp?.komen || ''}
                                            onChange={(e) => handleInputChange('nilaiKp', 'komen', e.target.value)}
                                            placeholder="Masukan catatan untuk mahasiswa..."
                                        ></textarea>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
                                        <p className="text-xs text-blue-800 font-bold uppercase">Judul TA</p>
                                        <p className="text-sm text-slate-700 italic">{selectedStudent.judulTa || 'Judul TA belum diinput mahasiswa'}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Nilai Mentor</label>
                                            <input type="number" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" 
                                                value={selectedStudent.nilaiTa?.mentor || ''}
                                                onChange={(e) => handleInputChange('nilaiTa', 'mentor', e.target.value)}
                                                placeholder="0-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Nilai Penguji</label>
                                            <input type="number" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" 
                                                value={selectedStudent.nilaiTa?.penguji || ''}
                                                onChange={(e) => handleInputChange('nilaiTa', 'penguji', e.target.value)}
                                                placeholder="0-100"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-semibold text-blue-700 mb-1">Nilai Akhir</label>
                                        <input type="number" className="w-full border-2 border-blue-200 bg-blue-50 p-2 rounded font-bold text-lg text-blue-800 focus:ring-2 focus:ring-blue-500" 
                                            value={selectedStudent.nilaiTa?.akhir || ''}
                                            onChange={(e) => handleInputChange('nilaiTa', 'akhir', e.target.value)}
                                            placeholder="0-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Komentar / Catatan</label>
                                        <textarea rows="3" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                                            value={selectedStudent.nilaiTa?.komen || ''}
                                            onChange={(e) => handleInputChange('nilaiTa', 'komen', e.target.value)}
                                            placeholder="Masukan catatan untuk mahasiswa..."
                                        ></textarea>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Footer Modal */}
                        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
                            <button 
                                onClick={() => setSelectedStudent(null)}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleSave}
                                className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-transform transform hover:scale-105"
                            >
                                Simpan Penilaian
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPenilaian;