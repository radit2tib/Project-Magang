import express from "express";
import { 
    loginAdmin, 
    loginMahasiswa,
    registerMahasiswa 
} from "../controllers/AuthController.js";
// import { verifyToken, isAdmin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Rute untuk login admin
// URL: POST /login/admin
router.post('/login/admin', loginAdmin);

// Rute untuk login mahasiswa
// URL: POST /login/mahasiswa
router.post('/login/mahasiswa', loginMahasiswa);

// Rute untuk registrasi mahasiswa 
// (Saat ini terbuka, tambahkan middleware jika ingin melindunginya)
// Contoh jika dilindungi: router.post('/register/mahasiswa', verifyToken, isAdmin, registerMahasiswa);
router.post('/register/mahasiswa', registerMahasiswa);

export default router;

