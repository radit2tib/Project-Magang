import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

const DataTable = ({ documents, onEdit, onDelete }) => (
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
              <td className="px-4 py-3 text-sm text-slate-500">{doc.pakaiKacamata || "-"}</td>
              <td className="px-4 py-3 text-sm text-slate-500">{doc.riwayatPenyakit || "-"}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center space-x-2">
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
                    onClick={() => onDelete(doc.nim)}
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

const DataPage = () => {
  const [dataMahasiswa, setDataMahasiswa] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBu, setSelectedBu] = useState("");
  const [selectedAngkatan, setSelectedAngkatan] = useState("");

  const API_URL = "http://localhost:8000";

  useEffect(() => {
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
      [
        "NIM",
        "Nama",
        "Angkatan",
        "BU",
        "Scholar",
        "Jenis Kelamin",
        "English",
        "Pakai Kacamata",
        "Riwayat Penyakit",
      ],
      ...filteredData.map((doc) => [
        doc.nim || "",
        doc.nama || "",
        doc.angkatan || "",
        doc.bu || "",
        doc.scholar || "",
        doc.jenisKelamin || "",
        doc.english || "",
        doc.pakaiKacamata || "",
        doc.riwayatPenyakit || "",
      ]),
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

  return (
    <div className="animate-fade-in">
      <DataHeader onAddData={() => {}} onDownloadData={handleDownloadData} />
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
          onEdit={(doc) => alert(`Edit data ${doc.nama}`)}
          onDelete={(nim) => alert(`Hapus data dengan NIM: ${nim}`)}
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
