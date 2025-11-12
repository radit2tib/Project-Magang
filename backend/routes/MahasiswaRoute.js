import express from "express";
import { 
    getAllMahasiswa,
    createMahasiswa,     // <-- Sekarang akan kita buat di controller
    updateMahasiswa,     // <-- Sekarang akan kita buat di controller
    deleteMahasiswa,     // <-- Sekarang akan kita buat di controller
    getMahasiswaProfile, // <-- Sudah ada di controller
    updateMahasiswaProfile // <-- Sudah ada di controller
} from "../controllers/MahasiswaController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js"; // Diaktifkan lagi


const router = express.Router();

// =======================================================
// RUTE ADMIN (CRUD untuk SEMUA Mahasiswa)
// =======================================================
// Catatan: Rute ini idealnya juga harus dilindungi oleh verifyToken 
// dan mungkin pengecekan admin (isAdmin)

// Rute untuk mendapatkan semua data mahasiswa
router.get('/', getAllMahasiswa);

// Rute untuk membuat data mahasiswa baru
router.post('/', createMahasiswa);

// Rute untuk memperbarui data mahasiswa berdasarkan NIM
router.put('/:nim', updateMahasiswa);

// Rute untuk menghapus data mahasiswa berdasarkan NIM
router.delete('/:nim', deleteMahasiswa);


// =======================================================
// RUTE PROFIL (Untuk Mahasiswa yang Login)
// =======================================================
// Rute ini WAJIB menggunakan verifyToken untuk mendapatkan req.user.nim

router.get('/test', (req, res) => {
    res.send('SERVER BERHASIL MELOAD FILE BARU');
});

// Rute untuk mendapatkan profil mahasiswa yang sedang login
router.get('/profile', verifyToken, getMahasiswaProfile);

// Rute untuk memperbarui profil mahasiswa yang sedang login
router.put('/profile', verifyToken, updateMahasiswaProfile);


export default router;