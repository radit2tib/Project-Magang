import React, { useState, useEffect } from 'react';
import axios from 'axios';

// URL Backend (Sesuaikan dengan port kamu)
const API_URL = 'http://localhost:8000';

const AdminManajemenTugas = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // --- STATE BARU UNTUK PAGINATION ---
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10); // Default 10 entri

    // --- 1. FETCH DATA ---
    useEffect(() => {
        fetchPenugasan();
    }, []);

    const fetchPenugasan = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/mahasiswa/admin/penugasan`);
            setStudents(response.data);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
            alert("Gagal memuat data mahasiswa.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- 2. LOGIKA FILTER & PAGINATION ---
    
    // Filter data berdasarkan pencarian
    const filteredStudents = students.filter(s => 
        s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.nim.includes(searchTerm)
    );

    // Hitung index data untuk halaman saat ini
    const indexOfLastStudent = currentPage * entriesPerPage;
    const indexOfFirstStudent = indexOfLastStudent - entriesPerPage;
    
    // Data yang akan ditampilkan di tabel (sudah dipotong)
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

    // Reset ke halaman 1 jika melakukan pencarian atau mengubah jumlah entri
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, entriesPerPage]);

    // Fungsi ganti halaman
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredStudents.length / entriesPerPage);

    // --- 3. LOGIKA GRADING (SAMA SEPERTI SEBELUMNYA) ---
    const handleGradeChange = (studentNim, taskNumber, newScore) => {
        const updatedStudents = students.map(s => {
            if (s.nim === studentNim) {
                const updatedTugas = s.daftarTugas.map(t => {
                    if (t.taskNumber === taskNumber) {
                        return { ...t, nilai: newScore };
                    }
                    return t;
                });
                const updatedStudentData = { ...s, daftarTugas: updatedTugas };
                if (selectedStudent && selectedStudent.nim === studentNim) {
                    setSelectedStudent(updatedStudentData);
                }
                return updatedStudentData;
            }
            return s;
        });
        setStudents(updatedStudents);
    };

    const handleSaveGrade = async (taskNumber) => {
        const task = selectedStudent.daftarTugas.find(t => t.taskNumber === taskNumber);
        if (!task) return;

        try {
            await axios.post(`${API_URL}/mahasiswa/admin/grade`, {
                nim: selectedStudent.nim,
                taskNumber: taskNumber,
                nilai: task.nilai
            });
            alert(`Nilai Tugas ${taskNumber} berhasil disimpan!`);
        } catch (error) {
            console.error("Gagal menyimpan nilai:", error);
            alert("Gagal menyimpan nilai.");
        }
    };

    const openFile = (path) => {
        if (!path) return;
        window.open(`${API_URL}/${path}`, '_blank');
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Manajemen Penugasan & Penilaian</h2>
                <p className="text-slate-500">Pantau pengumpulan tugas dan berikan nilai kepada mahasiswa.</p>
            </div>

            {isLoading ? (
                <div className="text-center py-10 text-slate-500">Memuat data penugasan...</div>
            ) : !selectedStudent ? (
                
                /* --- TAMPILAN TABEL UTAMA --- */
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    
                    {/* HEADER TABEL: FILTER ENTRI & PENCARIAN */}
                    <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                        
                        {/* FITUR BARU: DROPDOWN ENTRI */}
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

                        {/* INPUT PENCARIAN */}
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
                                    <th className="px-6 py-3">No</th> {/* Tambah Kolom No */}
                                    <th className="px-6 py-3">Mahasiswa</th>
                                    <th className="px-6 py-3">Departemen</th>
                                    <th className="px-6 py-3 text-center">Tugas Masuk</th>
                                    <th className="px-6 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {currentStudents.map((mhs, index) => {
                                    const submittedCount = mhs.daftarTugas ? mhs.daftarTugas.filter(t => t.fileLaporan).length : 0;
                                    // Hitung nomor urut global
                                    const globalIndex = indexOfFirstStudent + index + 1;
                                    
                                    return (
                                        <tr key={mhs.nim} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 w-12 text-center text-slate-400 font-medium">{globalIndex}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800">{mhs.nama}</div>
                                                <div className="text-xs text-slate-500">{mhs.nim}</div>
                                            </td>
                                            <td className="px-6 py-4">{mhs.dept || '-'}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${submittedCount > 0 ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                                    {submittedCount} Item
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button 
                                                    onClick={() => setSelectedStudent(mhs)}
                                                    className="text-blue-600 hover:text-blue-900 font-medium bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                                                >
                                                    Periksa
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* FOOTER TABEL: NAVIGASI PAGINATION */}
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
            ) : (
                /* --- TAMPILAN DETAIL (TIDAK BERUBAH) --- */
                <div className="animate-fade-in-up">
                    <button 
                        onClick={() => setSelectedStudent(null)}
                        className="mb-4 flex items-center text-slate-500 hover:text-slate-800 font-medium transition-colors"
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Kembali ke Daftar
                    </button>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">{selectedStudent.nama}</h3>
                            <p className="text-slate-500">{selectedStudent.nim} • {selectedStudent.dept}</p>
                        </div>
                        <div className="text-right">
                            <span className="block text-sm text-slate-500">Total Tugas</span>
                            <span className="text-2xl font-bold text-blue-600">{selectedStudent.daftarTugas ? selectedStudent.daftarTugas.length : 0}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {(!selectedStudent.daftarTugas || selectedStudent.daftarTugas.length === 0) && (
                            <div className="col-span-2 text-center py-10 bg-slate-50 rounded-xl text-slate-500 italic">
                                Mahasiswa ini belum mengupload tugas apapun.
                            </div>
                        )}

                        {selectedStudent.daftarTugas && selectedStudent.daftarTugas.map((tugas, index) => (
                            <div key={index} className={`p-6 rounded-xl border shadow-sm ${tugas.fileLaporan ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-75'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-lg font-bold text-slate-800">Tugas {tugas.taskNumber}</h4>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded ${tugas.fileLaporan ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {tugas.fileLaporan ? 'Sudah Dikumpulkan' : 'Belum Dikumpulkan'}
                                    </span>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase">Judul</p>
                                        <p className="text-slate-800">{tugas.judulTugas || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">File</p>
                                        {tugas.fileLaporan ? (
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => openFile(tugas.fileLaporan)}
                                                    className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center"
                                                >
                                                    📄 Lihat Laporan
                                                </button>
                                                {tugas.filePresentasi && (
                                                    <button 
                                                        onClick={() => openFile(tugas.filePresentasi)}
                                                        className="px-3 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-100 flex items-center"
                                                    >
                                                        📊 Lihat PPT
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-400 italic">Tidak ada file.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nilai (0-100)</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="number" 
                                            min="0" max="100"
                                            disabled={!tugas.fileLaporan}
                                            value={tugas.nilai !== null ? tugas.nilai : ''} 
                                            onChange={(e) => handleGradeChange(selectedStudent.nim, tugas.taskNumber, e.target.value)}
                                            placeholder="-"
                                            className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-center font-bold disabled:bg-slate-100"
                                        />
                                        <button 
                                            disabled={!tugas.fileLaporan}
                                            onClick={() => handleSaveGrade(tugas.taskNumber)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
                                        >
                                            Simpan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManajemenTugas;