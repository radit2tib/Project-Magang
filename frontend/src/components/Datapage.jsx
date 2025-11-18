import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// --- Komponen Ikon ---
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path}></path>
  </svg>
);

// --- Helper Form (dipindah ke luar) ---
const FormInput = ({ label, name, value, onChange, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-slate-700">{label}</label>
    <input 
      id={name} 
      name={name} 
      value={value || ''} 
      onChange={onChange}
      className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      {...props} 
    />
  </div>
);

const FormTextArea = ({ label, name, value, onChange, ...props }) => (
  <div> 
    <label htmlFor={name} className="block text-sm font-medium text-slate-700">{label}</label>
    <textarea 
      id={name} 
      name={name} 
      value={value || ''} 
      onChange={onChange}
      className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      rows="2"
      {...props} 
    />
  </div>
);

const FormSelect = ({ label, name, value, onChange, children, ...props }) => (
   <div>
    <label htmlFor={name} className="block text-sm font-medium text-slate-700">{label}</label>
    <select
      id={name} 
      name={name} 
      value={value === null || value === undefined ? '' : value}
      onChange={onChange}
      className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      {...props} 
    >
      {children}
    </select>
  </div>
);

// --- Komponen Header ---
const DataHeader = ({ onAddData, onDownloadData }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-slate-200 pb-6">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
        Manajemen Data Mahasiswa
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Tambah, filter, dan unduh data mahasiswa.
      </p>
    </div>

    <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
      <button
        onClick={onDownloadData}
        className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all"
      >
        <Icon
          path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          className="w-5 h-5 mr-2"
        />
        <span>Download Data</span>
      </button>

      <button
        onClick={onAddData}
        className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
      >
        <Icon
          path="M12 6v6m0 0v6m0-6h6m-6 0H6"
          className="w-5 h-5 mr-2"
        />
        <span>Tambah Mahasiswa</span>
      </button>
    </div>
  </div>
);

// --- Komponen Tabel Data (Dengan Tombol Info) ---
const DataTable = ({ documents, onInfo, onEdit, onDelete }) => (
  <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
    <table className="min-w-full divide-y divide-slate-200">
      <thead className="bg-slate-50">
        <tr>
          {[
            "NIM",
            "Nama",
            "Angkatan",
            "BU",
            "Scholar",
            "Jenis Kelamin",
            "English",
            "Pakai Kacamata",
            "Riwayat Penyakit",
          ].map((head) => (
            <th
              key={head}
              className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase"
            >
              {head}
            </th>
          ))}
          <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
        {documents.length > 0 ? (
          documents.map((doc) => (
            <tr key={doc.nim} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 text-sm text-slate-600 font-mono">{doc.nim}</td>
              <td className="px-4 py-3 text-sm font-semibold text-slate-800">{doc.nama}</td>
              <td className="px-4 py-3 text-sm text-slate-500">{doc.angkatan}</td>
              <td className="px-4 py-3 text-sm text-slate-500">{doc.bu || "-"}</td>
              <td className="px-4 py-3 text-sm text-slate-500">{doc.scholar || "-"}</td>
              <td className="px-4 py-3 text-sm text-slate-500">{doc.jenisKelamin || "-"}</td>
              <td className="px-4 py-3 text-sm text-slate-500">{doc.english || "-"}</td>
              <td className="px-4 py-3 text-sm text-slate-500">{doc.pakaiKacamata ? 'Ya' : 'Tidak' }</td>
              <td className="px-4 py-3 text-sm text-slate-500">{doc.riwayatPenyakit || "-"}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => onInfo(doc)}
                    className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-colors duration-150"
                    title="Lihat Detail"
                  >
                    <Icon
                      path="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      className="w-5 h-5"
                    />
                  </button>
                  <button
                    onClick={() => onEdit(doc)}
                    className="p-2 text-yellow-500 hover:bg-yellow-100 rounded-full transition-colors duration-150"
                    title="Edit"
                  >
                    <Icon
                      path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      className="w-5 h-5"
                    />
                  </button>
                  <button
                    onClick={() => onDelete(doc)}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors duration-150"
                    title="Hapus"
                  >
                    <Icon
                      path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      className="w-5 h-5"
                    />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="10" className="text-center py-10 text-slate-500">
              Tidak ada data ditemukan.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

// --- Komponen Kontrol Tabel ---
const TableControls = ({
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

    <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
      <select
        value={selectedBu}
        onChange={(e) => setSelectedBu(e.target.value)}
        className="w-full sm:w-auto border border-slate-300 rounded-md px-3 py-2 text-sm"
      >
        <option value="">Semua BU</option>
        {buOptions.map((bu) => (
          <option key={bu} value={bu}>{bu}</option>
        ))}
      </select>

      <select
        value={selectedAngkatan}
        onChange={(e) => setSelectedAngkatan(e.target.value)}
        className="w-full sm:w-auto border border-slate-300 rounded-md px-3 py-2 text-sm"
      >
        <option value="">Semua Angkatan</option>
        {angkatanOptions.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      <div className="relative w-full sm:w-auto">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon
            path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            className="w-5 h-5 text-slate-400"
          />
        </span>
        <input
          type="text"
          placeholder="Cari nama atau NIM..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-slate-300 rounded-md w-full sm:w-56 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </div>
  </div>
);


// --- Komponen Info Modal ---
const InfoModal = ({ isOpen, onClose, mahasiswa }) => {
  if (!isOpen || !mahasiswa) {
    return null;
  }
  const renderField = (label, value) => {
    const displayValue = value || "-";
    return (
      <div className="grid grid-cols-3 gap-2 py-2.5 border-b border-slate-100">
        <dt className="text-sm font-medium text-slate-500">{label}</dt>
        <dd className="text-sm text-slate-900 col-span-2">{displayValue}</dd>
      </div>
    );
  };
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 sticky top-0 bg-white">
          <h3 className="text-xl font-semibold text-slate-800">
            Detail Informasi Mahasiswa
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
          >
            <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <dl>
            {renderField("Nama Lengkap", mahasiswa.nama)}
            {renderField("NIM", mahasiswa.nim)}
            {renderField("Password", mahasiswa.password)} 
            {renderField("Angkatan", mahasiswa.angkatan)}
            {renderField("Business Unit (BU)", mahasiswa.bu)}
            {renderField("Departemen", mahasiswa.dept)}
            {renderField("Jenis Kelamin", mahasiswa.jenisKelamin)}
            {renderField("Scholar", mahasiswa.scholar)}
            {renderField("English", mahasiswa.english)}
            {renderField("Mentor", mahasiswa.mentor)}
            {renderField("Co-Mentor", mahasiswa.co_mentor)}
            {renderField("Judul KP", mahasiswa.judulKp)}
            {renderField("Judul TA", mahasiswa.judulTa)}
            {renderField("Pakai Kacamata", mahasiswa.pakaiKacamata ? 'Ya' : 'Tidak')}
            {renderField("Riwayat Penyakit", mahasiswa.riwayatPenyakit)}
            {renderField("Profil Lengkap", mahasiswa.isProfileComplete ? 'Ya' : 'Belum')}
          </dl>
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN EDIT MODAL ---
const EditModal = ({ isOpen, onClose, onSave, mahasiswa }) => {
  const [formData, setFormData] = useState(null);
  
  // --- [BARU] State untuk tombol mata ---
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (mahasiswa) {
      setFormData({
        ...mahasiswa,
        newPassword: "" 
      });
      // Reset state mata setiap modal dibuka
      setShowPassword(false); 
    } else {
      setFormData(null);
    }
  }, [mahasiswa, isOpen]); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
       setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === "select-one") {
      const boolValue = value === "true" ? true : (value === "false" ? false : value);
      setFormData(prev => ({ ...prev, [name]: boolValue }));
    } else {
       setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  // --- [BARU] Fungsi untuk toggle mata ---
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  if (!isOpen || !formData) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800">
            Edit Mahasiswa: {mahasiswa.nama}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
            <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5" />
          </button>
        </div>
        
        {/* Form Body dengan Fieldset */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          
          <fieldset className="mb-6">
            <legend className="text-base font-semibold text-slate-900 mb-3 border-b border-slate-200 pb-2 w-full">Informasi Utama</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <FormInput 
                label="NIM" 
                name="nim" 
                value={formData.nim} 
                onChange={handleChange} 
                disabled 
                className="bg-slate-100" 
              />
              <FormInput 
                label="Nama Lengkap" 
                name="nama" 
                value={formData.nama} 
                onChange={handleChange} 
                required 
              />
              <FormInput 
                label="Angkatan" 
                name="angkatan" 
                type="number" 
                value={formData.angkatan} 
                onChange={handleChange} 
                required 
              />
              <FormSelect 
                label="Jenis Kelamin" 
                name="jenisKelamin" 
                value={formData.jenisKelamin} 
                onChange={handleChange}
              >
                <option value="">Pilih...</option>
                <option value="laki-laki">Laki-laki</option>
                <option value="perempuan">Perempuan</option>
              </FormSelect>
            </div>
          </fieldset>

          <fieldset className="mb-6">
            <legend className="text-base font-semibold text-slate-900 mb-3 border-b border-slate-200 pb-2 w-full">Informasi Perusahaan</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <FormInput label="Business Unit (BU)" name="bu" value={formData.bu} onChange={handleChange} />
              <FormInput label="Departemen" name="dept" value={formData.dept} onChange={handleChange} />
              <FormInput label="Mentor" name="mentor" value={formData.mentor} onChange={handleChange} />
              <FormInput label="Co-Mentor" name="co_mentor" value={formData.co_mentor} onChange={handleChange} />
            </div>
          </fieldset>
          
          <fieldset className="mb-6">
            <legend className="text-base font-semibold text-slate-900 mb-3 border-b border-slate-200 pb-2 w-full">Informasi Tambahan</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <FormInput label="Scholar" name="scholar" value={formData.scholar} onChange={handleChange} />
              <FormInput label="English" name="english" value={formData.english} onChange={handleChange} />
              <FormSelect label="Pakai Kacamata" name="pakaiKacamata" value={formData.pakaiKacamata} onChange={handleChange}>
                <option value="">Pilih...</option>
                <option value={true}>Ya</option>
                <option value={false}>Tidak</option>
              </FormSelect>
              <FormInput label="Riwayat Penyakit" name="riwayatPenyakit" value={formData.riwayatPenyakit} onChange={handleChange} />
              <FormSelect label="Profil Lengkap" name="isProfileComplete" value={formData.isProfileComplete} onChange={handleChange}>
                <option value="">Pilih...</option>
                <option value={true}>Ya</option>
                <option value={false}>Belum</option>
              </FormSelect>
            </div>
          </fieldset>

          <fieldset className="mb-6">
            <legend className="text-base font-semibold text-slate-900 mb-3 border-b border-slate-200 pb-2 w-full">Proyek Akhir</legend>
            <div className="grid grid-cols-1 gap-y-4">
              <FormTextArea label="Judul KP" name="judulKp" value={formData.judulKp} onChange={handleChange} />
              <FormTextArea label="Judul TA" name="judulTa" value={formData.judulTa} onChange={handleChange} />
            </div>
          </fieldset>
          
          <fieldset>
            <legend className="text-base font-semibold text-slate-900 mb-3 border-b border-slate-200 pb-2 w-full">Keamanan</legend>
            <p className="text-sm text-slate-500 mb-2">Isi hanya jika Anda ingin mengubah password mahasiswa ini.</p>
            
            {/* --- [MODIFIKASI] Mengganti FormInput dengan JSX Khusus --- */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">
                Password Baru
              </label>
              <div className="relative mt-1">
                <input 
                  id="newPassword" 
                  name="newPassword" 
                  type={showPassword ? "text" : "password"} // Dinamis
                  value={formData.newPassword || ''} 
                  onChange={handleChange}
                  className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10" // Tambah pr-10
                  placeholder="Biarkan kosong jika tidak berubah"
                />
                <button 
                  type="button" 
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700"
                  title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {/* Ikon berubah berdasarkan state */}
                  {showPassword ? (
                    <Icon path="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-1.29-1.29m-2.755 0l-1.29 1.29M6 12s2.239-2.33 4.5-2.33m2.33 0c.343 0 .68.025 1.013.07M17.25 12a9.97 9.97 0 00-1.563-3.029m-1.75 2.122l1.29-1.29" className="w-5 h-5" />
                  ) : (
                    <Icon path="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            {/* --- Akhir Modifikasi --- */}

          </fieldset>
          
          {/* Footer Tombol */}
          <div className="mt-8 flex justify-end space-x-4 border-t pt-6">
            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200">
              Batal
            </button>
            <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- KOMPONEN MODAL KONFIRMASI HAPUS ---
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, mahasiswa }) => {
  if (!isOpen || !mahasiswa) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0">
              <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg leading-6 font-bold text-slate-900">
                Hapus Mahasiswa
              </h3>
              <div className="mt-2">
                <p className="text-sm text-slate-600">
                  Apakah Anda yakin ingin menghapus data
                  <strong className="text-slate-800"> {mahasiswa.nama}</strong>
                  <span className="font-mono text-slate-500"> ({mahasiswa.nim})</span>?
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 px-6 py-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white text-slate-700 font-medium rounded-md border border-slate-300 hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white font-medium rounded-md shadow-sm hover:bg-red-700"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Komponen Utama Halaman ---
const DataPage = () => {
  const [dataMahasiswa, setDataMahasiswa] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBu, setSelectedBu] = useState("");
  const [selectedAngkatan, setSelectedAngkatan] = useState("");

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMahasiswa, setEditingMahasiswa] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingMahasiswa, setDeletingMahasiswa] = useState(null);
  
  const API_URL = "http://localhost:8000";
  

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("adminAuthToken");
      const response = await axios.get(`${API_URL}/mahasiswa`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDataMahasiswa(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = dataMahasiswa.filter((doc) => {
    const searchMatch =
      doc.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.nim?.toLowerCase().includes(searchTerm.toLowerCase());
    const buMatch = selectedBu ? doc.bu === selectedBu : true;
    const angkatanMatch = selectedAngkatan
      ? doc.angkatan.toString() === selectedAngkatan
      : true;
    return searchMatch && buMatch && angkatanMatch;
  });

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const uniqueBuOptions = useMemo(() => {
    const bus = new Set(dataMahasiswa.map((m) => m.bu).filter(Boolean));
    return [...bus].sort();
  }, [dataMahasiswa]);

  const uniqueAngkatanOptions = useMemo(() => {
    const angkatans = new Set(
      dataMahasiswa.map((m) => m.angkatan).filter(Boolean)
    );
    return [...angkatans].sort((a, b) => b - a);
  }, [dataMahasiswa]);

  const handleDownloadData = () => {
    if (filteredData.length === 0) {
      alert("Tidak ada data untuk diunduh berdasarkan filter saat ini.");
      return;
    }
    const buLabel = selectedBu ? selectedBu.toUpperCase() : "SEMUA_BU";
    const angkatanLabel = selectedAngkatan || "SEMUA_TAHUN";
    const fileTitle = `Data Mahasiswa ${buLabel} ${angkatanLabel}`;
    const fileName = `Data_Mahasiswa_${buLabel}_${angkatanLabel}.xlsx`;
    const wsData = [
      [fileTitle],
      [],
      [ "NIM", "Nama", "Angkatan", "BU", "Scholar", "Jenis Kelamin", "English", "Pakai Kacamata", "Riwayat Penyakit", ],
      ...filteredData.map((doc) => [ doc.nim || "", doc.nama || "", doc.angkatan || "", doc.bu || "", doc.scholar || "", doc.jenisKelamin || "", doc.english || "", doc.pakaiKacamata || "", doc.riwayatPenyakit || "", ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const colWidths = wsData[2].map(
      (_, i) => ({ wch: Math.max(...wsData.map((row) => (row[i] ? row[i].toString().length : 10))) + 2 })
    );
    ws["!cols"] = colWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Mahasiswa");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), fileName);
  };

  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // --- Handler Modal Info ---
  const handleOpenInfoModal = (mahasiswa) => {
    setSelectedMahasiswa(mahasiswa);
    setIsInfoModalOpen(true);
  };
  const handleCloseInfoModal = () => {
    setIsInfoModalOpen(false);
    setSelectedMahasiswa(null);
  };

  // --- Handler Modal Edit ---
  const handleOpenEditModal = (mahasiswa) => {
    setEditingMahasiswa(mahasiswa);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingMahasiswa(null);
  };
  const handleSaveEdit = async (formData) => {
    try {
      const token = localStorage.getItem("adminAuthToken");
      const updateData = { ...formData };
      
      if (updateData.newPassword && updateData.newPassword.trim() !== "") {
        updateData.password = updateData.newPassword;
      }
      
      delete updateData.newPassword;

      await axios.put(`${API_URL}/mahasiswa/${updateData.nim}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      handleCloseEditModal();
      fetchData(); 
    } catch (err) {
      console.error("Gagal mengupdate data:", err);
      alert("Gagal mengupdate data. Cek konsol untuk detail.");
    }
  };

  // --- Handler Modal Delete ---
  const handleOpenDeleteModal = (mahasiswa) => {
    setDeletingMahasiswa(mahasiswa);
    setIsDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingMahasiswa(null);
  };
  const handleConfirmDelete = async () => {
    if (!deletingMahasiswa) return;
    try {
      const token = localStorage.getItem("adminAuthToken");
      await axios.delete(`${API_URL}/mahasiswa/${deletingMahasiswa.nim}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      handleCloseDeleteModal();
      fetchData(); 
    } catch (err) {
      console.error("Gagal menghapus data:", err);
      alert("Gagal menghapus data. Cek konsol untuk detail.");
    }
  };


  return (
    <div className="animate-fade-in">
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={handleCloseInfoModal}
        mahasiswa={selectedMahasiswa}
      />

      <EditModal
        key={editingMahasiswa?.nim} 
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
        mahasiswa={editingMahasiswa}
      />
      
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        mahasiswa={deletingMahasiswa}
      />

      <DataHeader onAddData={() => alert("Fitur 'Tambah Mahasiswa' belum diimplementasikan.")} onDownloadData={handleDownloadData} />
      
      <div className="bg-white rounded-lg shadow-sm p-4">
        <TableControls
          entriesPerPage={entriesPerPage}
          setEntriesPerPage={setEntriesPerPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          totalEntries={dataMahasiswa.length}
          selectedBu={selectedBu}
          setSelectedBu={setSelectedBu}
          buOptions={uniqueBuOptions}
          selectedAngkatan={selectedAngkatan}
          setSelectedAngkatan={setSelectedAngkatan}
          angkatanOptions={uniqueAngkatanOptions}
        />

        <DataTable
          documents={paginatedData}
          onInfo={handleOpenInfoModal} 
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
        />

        <div className="flex justify-between items-center mt-4 text-sm text-slate-600">
          <span>
            Menampilkan {paginatedData.length} dari {filteredData.length} data
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md border ${
                currentPage === 1
                  ? "bg-slate-100 text-slate-400"
                  : "bg-white hover:bg-slate-50"
              }`}
            >
              Sebelumnya
            </button>
            <span>
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md border ${
                currentPage === totalPages
                  ? "bg-slate-100 text-slate-400"
                  : "bg-white hover:bg-slate-50"
              }`}
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPage;