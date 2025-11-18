import express from "express";
import { 
    // Fungsi CRUD Lama
    getAllMahasiswa,
    createMahasiswa,
    updateMahasiswa,
    deleteMahasiswa,
    getMahasiswaProfile, 
    updateMahasiswaProfile,
    // Fungsi Upload Baru
    uploadProyekFiles,
    uploadTugasFile
} from "../controllers/MahasiswaController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";
// Perbaikan Casing: pastikan nama file adalah 'uploadMiddleware.js' (u kecil)
import { uploadProyek, uploadTugas } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// =======================================================
// RUTE PROFIL (TARUH PALING ATAS!)
// =======================================================
router.get('/test', (req, res) => {
    res.send('SERVER BERHASIL MELOAD FILE BARU');
});

// Rute untuk mendapatkan profil mahasiswa yang sedang login
router.get('/profile', verifyToken, getMahasiswaProfile);

// Rute untuk memperbarui profil mahasiswa yang sedang login
router.put('/profile', verifyToken, updateMahasiswaProfile);


// =======================================================
// RUTE UPLOAD BARU
// =======================================================
router.post(
    '/proyek/upload', 
    verifyToken, 
    uploadProyek.fields([ // 'fields' untuk multiple form fields
        { name: 'fileLaporanKP', maxCount: 1 },
        { name: 'fileLaporanTA', maxCount: 1 }
    ]), 
    uploadProyekFiles
);

router.post(
    '/tugas', 
    verifyToken, 
    uploadTugas.fields([ // 'fields' untuk multiple form fields
        { name: 'fileLaporan', maxCount: 1 },
        { name: 'filePresentasi', maxCount: 1 }
    ]), 
    uploadTugasFile
);


// =======================================================
// RUTE ADMIN / UMUM
// =======================================================

// Rute untuk mendapatkan semua data mahasiswa
router.get('/', getAllMahasiswa);

// Rute untuk membuat data mahasiswa baru
router.post('/', createMahasiswa);

// Rute dinamis (menggunakan parameter :nim) harus di bawah rute statis
// Rute untuk memperbarui data mahasiswa berdasarkan NIM
router.put('/:nim', updateMahasiswa);

// Rute untuk menghapus data mahasiswa berdasarkan NIM
router.delete('/:nim', deleteMahasiswa);


// Perbaikan: Tambahkan 'export default' agar index.js bisa mengimpornya
export default router;