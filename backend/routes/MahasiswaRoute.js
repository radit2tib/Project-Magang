import express from "express";
import multer from "multer"; // <--- TAMBAHKAN IMPORT INI

import { 
    getAllMahasiswa, 
    createMahasiswa, 
    updateMahasiswa, 
    deleteMahasiswa,
    getMahasiswaProfile, 
    updateMahasiswaProfile, // Controller yang sudah kita perbaiki tadi
    uploadProyekFiles, 
    uploadTugasFile,
    getAllPenugasan, 
    gradeTugas,
    updatePenilaianAkhir
} from "../controllers/MahasiswaController.js";

import { verifyToken } from "../middleware/AuthMiddleware.js";
import { uploadProyek, uploadTugas } from "../middleware/UploadMiddleware.js"; 

const router = express.Router();

// --- BIKIN MIDDLEWARE UPLOAD SEDERHANA ---
// Ini penting agar Express bisa baca req.body dari FormData
const uploadGeneral = multer(); 

// =======================================================
// 1. RUTE UMUM & TESTING
// =======================================================
router.get('/test', (req, res) => {
    res.send('SERVER BERHASIL MELOAD FILE BARU');
});

// =======================================================
// 2. RUTE MAHASISWA (BUTUH TOKEN)
// =======================================================

// Profil (Get & Update)
router.get('/profile', verifyToken, getMahasiswaProfile);

// [FIXED] Ganti PATCH jadi PUT & Tambah uploadGeneral.single('image')
// 'image' harus sama dengan nama field yang dikirim Frontend
router.put(
    '/profile', 
    verifyToken, 
    uploadGeneral.single('image'), 
    updateMahasiswaProfile
);

// Upload File Proyek Akhir (KP & TA)
router.patch(
    '/upload-proyek', 
    verifyToken, 
    uploadProyek, 
    uploadProyekFiles
);

// Upload Tugas Mingguan
router.post(
    '/tugas', 
    verifyToken, 
    uploadTugas, 
    uploadTugasFile
);

// =======================================================
// 3. RUTE KHUSUS ADMIN (MANAJEMEN TUGAS & NILAI)
// =======================================================
router.get('/admin/penugasan', getAllPenugasan);
router.post('/admin/grade', gradeTugas);
router.post('/admin/penilaian-akhir', updatePenilaianAkhir);

// =======================================================
// 4. RUTE CRUD ADMIN (DATA MASTER MAHASISWA)
// =======================================================
router.get('/', getAllMahasiswa);       
router.post('/', createMahasiswa);      
router.put('/:nim', updateMahasiswa);   
router.delete('/:nim', deleteMahasiswa);

export default router;