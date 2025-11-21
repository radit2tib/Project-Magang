import express from "express";
import { 
    // --- Fungsi CRUD Lama ---
    getAllMahasiswa,
    createMahasiswa,
    updateMahasiswa,
    deleteMahasiswa,
    getMahasiswaProfile, 
    updateMahasiswaProfile,
    
    // --- Fungsi Upload ---
    uploadProyekFiles,
    uploadTugasFile,
    
    // --- [BARU] Fungsi Penilaian Admin ---
    getAllPenugasan,
    gradeTugas
} from "../controllers/MahasiswaController.js";

import { verifyToken } from "../middleware/AuthMiddleware.js";

// Pastikan nama file fisik sesuai (UploadMiddleware.js)
import { uploadProyek, uploadTugas } from "../middleware/UploadMiddleware.js"; 

const router = express.Router();

// =======================================================
// 1. RUTE UMUM & PROFIL
// =======================================================
router.get('/test', (req, res) => {
    res.send('SERVER BERHASIL MELOAD FILE BARU');
});

// Rute Profil Mahasiswa (Membutuhkan Token)
router.get('/profile', verifyToken, getMahasiswaProfile);
router.patch('/profile', verifyToken, updateMahasiswaProfile);


// =======================================================
// 2. RUTE UPLOAD FILE (MAHASISWA)
// =======================================================

// Upload Proyek Akhir (KP & TA)
router.patch(
    '/upload-proyek', 
    verifyToken, 
    uploadProyek, // Middleware Multer (sudah config fields)
    uploadProyekFiles
);

// Upload Tugas Mingguan
router.post(
    '/tugas', 
    verifyToken, 
    uploadTugas, // Middleware Multer (sudah config fields)
    uploadTugasFile
);


// =======================================================
// 3. RUTE KHUSUS ADMIN (MANAJEMEN TUGAS & NILAI) [BARU]
// =======================================================

// Ambil semua data mahasiswa beserta daftar tugasnya
// Endpoint ini dipanggil oleh halaman "AdminManajemenTugas.jsx"
router.get('/admin/penugasan', getAllPenugasan);

// Simpan Nilai Tugas
// Endpoint ini dipanggil saat tombol "Simpan" ditekan admin
router.post('/admin/grade', gradeTugas);


// =======================================================
// 4. RUTE CRUD ADMIN (DATA MASTER MAHASISWA)
// =======================================================

router.get('/', getAllMahasiswa);       // Ambil semua mahasiswa
router.post('/', createMahasiswa);      // Tambah mahasiswa
router.put('/:nim', updateMahasiswa);   // Edit mahasiswa
router.delete('/:nim', deleteMahasiswa);// Hapus mahasiswa

export default router;