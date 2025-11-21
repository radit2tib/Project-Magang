import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// Komponen Ikon SVG
const Icon = ({ path, className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path}></path>
    </svg>
);

// --- Komponen Tombol Download File ---
const FileDownloadButton = ({ filePath, apiUrl }) => {
    // Jika tidak ada file, tampilkan strip
    if (!filePath || filePath === '-') {
        return <span className="text-slate-500">-</span>;
    }

    // Menggabungkan URL server dengan path file
    // Hati-hati dengan tanda slash (/) ganda
    const cleanApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    const cleanFilePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    const downloadUrl = `${cleanApiUrl}/${cleanFilePath}`;

    return (
        <a
            href={downloadUrl}
            target="_blank" // Buka di tab baru
            rel="noopener noreferrer" // Keamanan
            title={`Lihat File`}
            className="
                inline-flex items-center justify-center p-2 
                text-blue-600 hover:bg-blue-100 rounded-full 
                transition-colors duration-150
            "
        >
            {/* Ikon File/Dokumen */}
            <Icon path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" className="w-5 h-5" />
        </a>
    );
};


// Komponen Header Konten Utama
const DashboardHeader = ({ onAddDocument }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-slate-200 pb-6">
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Laporan KP & TA Mahasiswa</h1>
            <p className="mt-1 text-sm text-slate-500">Kelola dan lihat dokumen kerja praktik dan tugas akhir.</p>
        </div>
        <button
            onClick={onAddDocument}
            className="
                mt-4 sm:mt-0 w-full sm:w-auto flex items-center justify-center
                px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg
                shadow-md hover:shadow-xl hover:bg-blue-700
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600
                transition-all duration-300 ease-in-out
                transform hover:-translate-y-0.5">
            <Icon path="M12 6v6m0 0v6m0-6h6m-6 0H6" className="w-5 h-5 mr-2" />
            <span>Tambah Dokumen</span>
        </button>
    </div>
);

// --- Komponen Tabel ---
const DocumentsTable = ({ documents, onEdit, onDelete, apiUrl }) => (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">NIM</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nama</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Angkatan</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">BU</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dept</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Judul KP</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Judul TA</th>
                    {/* --- Kolom Header File --- */}
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">File KP</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">File TA</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
                {documents.length > 0 ? documents.map((doc) => (
                    <tr key={doc.nim} className="hover:bg-slate-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">{doc.nim}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">{doc.nama}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{doc.angkatan}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{doc.bu || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{doc.dept || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 truncate max-w-xs">{doc.judulKp || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 truncate max-w-xs">{doc.judulTa || '-'}</td>

                        {/* --- Sel Data File --- */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            <FileDownloadButton filePath={doc.fileLaporanKp} apiUrl={apiUrl} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            <FileDownloadButton filePath={doc.fileLaporanTa} apiUrl={apiUrl} />
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center justify-center space-x-2">
                                <button onClick={() => onEdit(doc)} className="p-2 text-yellow-500 hover:bg-yellow-100 rounded-full transition-colors duration-150" title="Edit">
                                    <Icon path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" className="w-5 h-5" />
                                </button>
                                <button onClick={() => onDelete(doc.nim)} className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors duration-150" title="Hapus">
                                    <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-5 h-5" />
                                </button>
                            </div>
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan="10" className="text-center py-10 text-slate-500">
                            Tidak ada data yang ditemukan.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

// Komponen Form/Modal
const DocumentForm = ({ document, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        nim: '',
        nama: '',
        angkatan: '',
        bu: '',
        dept: '',
        judulKp: '',
        judulTa: ''
    });

    const isEditing = document !== null;

    useEffect(() => {
        if (isEditing) {
            setFormData({
                ...document,
                bu: document.bu || '',
                dept: document.dept || '',
                judulKp: document.judulKp || '',
                judulTa: document.judulTa || ''
            });
        } else {
            setFormData({
                nim: '',
                nama: '',
                angkatan: '',
                bu: '',
                dept: '',
                judulKp: '',
                judulTa: ''
            });
        }
    }, [document, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData, isEditing);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl transform transition-all duration-300 ease-out scale-95">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{isEditing ? 'Edit Dokumen' : 'Tambah Dokumen Baru'}</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full">
                        <Icon path="M6 18L18 6M6 6l12 12" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="sm:col-span-2">
                            <label htmlFor="nama" className="block text-sm font-medium text-slate-600">Nama Lengkap</label>
                            <input type="text" name="nama" id="nama" value={formData.nama || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="nim" className="block text-sm font-medium text-slate-600">NIM</label>
                            <input type="text" name="nim" id="nim" value={formData.nim || ''} onChange={handleChange} required disabled={isEditing} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100" />
                        </div>
                        <div>
                            <label htmlFor="angkatan" className="block text-sm font-medium text-slate-600">Angkatan</label>
                            <input type="number" name="angkatan" id="angkatan" value={formData.angkatan || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="bu" className="block text-sm font-medium text-slate-600">Business Unit (BU)</label>
                            <input type="text" name="bu" id="bu" value={formData.bu || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="dept" className="block text-sm font-medium text-slate-600">Department</label>
                            <input type="text" name="dept" id="dept" value={formData.dept || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="judulKp" className="block text-sm font-medium text-slate-600">Judul Kerja Praktik (KP)</label>
                            <textarea name="judulKp" id="judulKp" value={formData.judulKp || ''} onChange={handleChange} rows="2" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="judulTa" className="block text-sm font-medium text-slate-600">Judul Tugas Akhir (TA)</label>
                            <textarea name="judulTa" id="judulTa" value={formData.judulTa || ''} onChange={handleChange} rows="2" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors">Batal</button>
                        <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl hover:bg-blue-700 transition-all">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Komponen Kontrol Tabel ---
const TableControls = React.memo(({
    entriesPerPage, setEntriesPerPage,
    searchTerm, setSearchTerm,
    totalEntries,
    selectedBu, setSelectedBu, buOptions,
    selectedAngkatan, setSelectedAngkatan, angkatanOptions
}) => (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center space-x-2 text-sm text-slate-600">
            <span>Tampilkan</span>
            <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={totalEntries}>Semua</option>
            </select>
            <span>entri</span>
        </div>

        {/* Bungkus semua filter kanan */}
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">

            <select
                value={selectedBu}
                onChange={(e) => setSelectedBu(e.target.value)}
                className="w-full sm:w-auto border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
                <option value="">Semua BU</option>
                {buOptions.map(bu => (
                    <option key={bu} value={bu}>{bu}</option>
                ))}
            </select>

            <select
                value={selectedAngkatan}
                onChange={(e) => setSelectedAngkatan(e.target.value)}
                className="w-full sm:w-auto border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
                <option value="">Semua Angkatan</option>
                {angkatanOptions.map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>

            <div className="relative w-full sm:w-auto">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-5 h-5 text-slate-400" />
                </span>
                <input
                    type="text"
                    placeholder="Cari nama atau NIM..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-md w-full sm:w-56 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>
        </div>
    </div>
));

// Komponen Pagination
const Pagination = ({ currentPage, totalPages, onPageChange, totalEntries, entriesPerPage, indexOfFirstEntry, indexOfLastEntry }) => {
    if (totalPages <= 1) return null;

    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };
    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <div className="flex justify-between items-center mt-4 text-sm text-slate-600">
            <span>
                Menampilkan {indexOfFirstEntry + 1} sampai {Math.min(indexOfLastEntry, totalEntries)} dari {totalEntries} entri
            </span>
            <div className="flex items-center space-x-2">
                <button onClick={handlePrev} disabled={currentPage === 1} className="px-3 py-1 border rounded-md bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    Sebelumnya
                </button>
                <span className="px-3 py-1">
                    {currentPage} / {totalPages}
                </span>
                <button onClick={handleNext} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-md bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    Berikutnya
                </button>
            </div>
        </div>
    );
};

// Komponen Modal Konfirmasi Hapus
const ConfirmModal = ({ isOpen, onClose, onConfirm, nim }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md transform transition-all duration-300 ease-out scale-95">
                <div className="flex items-start">
                    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4 text-left">
                        <h3 className="text-lg leading-6 font-bold text-slate-800">Hapus Dokumen</h3>
                        <div className="mt-2">
                            <p className="text-sm text-slate-600">
                                Apakah Anda yakin ingin menghapus data mahasiswa dengan NIM <span className="font-bold text-red-700">{nim}</span>?
                            </p>
                            <p className="text-sm text-slate-500 mt-1">Tindakan ini tidak dapat dibatalkan.</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                        Batal
                    </button>
                    <button type="button" onClick={onConfirm} className="px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl hover:bg-red-700 transition-all">
                        Ya, Hapus
                    </button>
                </div>
            </div>
        </div>
    );
};


// Komponen Utama KptaPage
const KptaPage = () => {
    const [documents, setDocuments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDocument, setEditingDocument] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deletingNim, setDeletingNim] = useState(null);
    const [selectedBu, setSelectedBu] = useState('');
    const [selectedAngkatan, setSelectedAngkatan] = useState('');


    const API_URL = 'http://localhost:8000';

    const fetchDocuments = async () => {
        try {
            const token = localStorage.getItem('adminAuthToken');
            if (!token) {
                console.error("Admin tidak terautentikasi.");
                return;
            }
            const response = await axios.get(`${API_URL}/mahasiswa`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // --- Asumsi data dari API ---
            // Pastikan response.data adalah array dan setiap objek 
            // memiliki properti 'fileKp' dan 'fileTa'
            // Contoh: response.data = [ { nim: '123', ..., fileKp: 'uploads/kp/123.pdf', fileTa: null } ]
            setDocuments(response.data);
        } catch (error) {
            console.error("Gagal mengambil data mahasiswa:", error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, entriesPerPage, selectedBu, selectedAngkatan]);

    const uniqueBuOptions = useMemo(() => {
        const bus = new Set(documents.map(m => m.bu).filter(Boolean));
        return [...bus].sort();
    }, [documents]);

    const uniqueAngkatanOptions = useMemo(() => {
        const angkatans = new Set(documents.map(m => m.angkatan).filter(Boolean));
        return [...angkatans].sort((a, b) => b - a);
    }, [documents]);

    const handleAddDocument = () => {
        setEditingDocument(null);
        setIsModalOpen(true);
    };

    const handleEditDocument = (doc) => {
        setEditingDocument(doc);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingDocument(null);
    };

    const handleDeleteDocument = (nim) => {
        setDeletingNim(nim);
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingNim) return;
        try {
            const token = localStorage.getItem('adminAuthToken');
            await axios.delete(`${API_URL}/mahasiswa/${deletingNim}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchDocuments();
        } catch (error) {
            console.error(`Gagal menghapus data mahasiswa NIM ${deletingNim}:`, error.response ? error.response.data : error.message);
        } finally {
            setShowConfirmModal(false);
            setDeletingNim(null);
        }
    };

    const handleSaveDocument = async (formData, isEditing) => {
        try {
            const token = localStorage.getItem('adminAuthToken');
            if (isEditing) {
                await axios.put(`${API_URL}/mahasiswa/${formData.nim}`, formData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_URL}/mahasiswa`, formData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
            handleCloseModal();
            fetchDocuments();
        } catch (error) {
            console.error("Gagal menyimpan data:", error.response ? error.response.data : error.message);
        }
    };

    const filteredDocuments = documents.filter(doc => {
        const searchMatch = (doc.nama?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (doc.nim?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const buMatch = selectedBu ? doc.bu === selectedBu : true;
        const angkatanMatch = selectedAngkatan ? doc.angkatan.toString() === selectedAngkatan : true;
        return searchMatch && buMatch && angkatanMatch;
    });

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentDocuments = filteredDocuments.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(filteredDocuments.length / entriesPerPage);

    return (
        <div className="animate-fade-in">
            <DashboardHeader onAddDocument={handleAddDocument} />
            <div className="bg-white rounded-lg shadow-sm p-4">

                <TableControls
                    entriesPerPage={entriesPerPage}
                    setEntriesPerPage={setEntriesPerPage}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalEntries={documents.length}
                    selectedBu={selectedBu}
                    setSelectedBu={setSelectedBu}
                    buOptions={uniqueBuOptions}
                    selectedAngkatan={selectedAngkatan}
                    setSelectedAngkatan={setSelectedAngkatan}
                    angkatanOptions={uniqueAngkatanOptions}
                />
                
                <DocumentsTable
                    documents={currentDocuments}
                    onEdit={handleEditDocument}
                    onDelete={handleDeleteDocument}
                    apiUrl={API_URL} 
                />
                
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalEntries={filteredDocuments.length}
                    entriesPerPage={entriesPerPage}
                    indexOfFirstEntry={indexOfFirstEntry}
                    indexOfLastEntry={indexOfLastEntry}
                />
            </div>

            {isModalOpen && (
                <DocumentForm
                    document={editingDocument}
                    onClose={handleCloseModal}
                    onSave={handleSaveDocument}
                />
            )}

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => {
                    setShowConfirmModal(false);
                    setDeletingNim(null);
                }}
                onConfirm={handleConfirmDelete}
                nim={deletingNim}
            />
        </div>
    );
};

export default KptaPage;