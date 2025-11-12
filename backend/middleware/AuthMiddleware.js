import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // 1. Ambil token dari header 'Authorization'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formatnya: "Bearer TOKEN"

    // 2. Jika tidak ada token, kirim error "Unauthorized"
    if (token == null) {
        return res.status(401).json({ message: "Akses ditolak. Token tidak ditemukan." });
    }

    // 3. Verifikasi token menggunakan kunci rahasia (JWT_SECRET)
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // Jika token tidak valid (kadaluwarsa atau salah), kirim error "Forbidden"
        if (err) {
            return res.status(403).json({ message: "Token tidak valid." });
        }
        
        // Jika token valid, simpan informasi pengguna ke dalam request
        // agar bisa digunakan oleh fungsi selanjutnya (misal: getMahasiswaProfile)
        req.user = user;
        
        // Lanjutkan ke fungsi berikutnya
        next();
    });
};

// Middleware untuk mengecek role Admin
export const isAdmin = (req, res, next) => {
    // Dijalankan SETELAH verifyToken
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Akses ditolak. Rute ini hanya untuk Admin." });
    }
    next();
};

// Middleware untuk mengecek role Mahasiswa
export const isMahasiswa = (req, res, next) => {
    // Dijalankan SETELAH verifyToken
    if (req.user.role !== 'mahasiswa') {
        return res.status(403).json({ message: "Akses ditolak. Rute ini hanya untuk Mahasiswa." });
    }
    next();
};

