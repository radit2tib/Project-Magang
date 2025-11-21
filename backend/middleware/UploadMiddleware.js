import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Fungsi untuk memastikan direktori ada
const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// --- 1. PENYIMPANAN UNTUK PROYEK AKHIR (KP & TA) ---
const proyekStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = '';
        if (file.fieldname === 'fileLaporanKP') {
            uploadPath = 'uploads/laporan_kp/';
        } else if (file.fieldname === 'fileLaporanTA') {
            uploadPath = 'uploads/laporan_ta/';
        }
        ensureDir(uploadPath); 
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // [REVISI] Gunakan NIM, jangan Nama. Nama bisa mengandung spasi/karakter aneh.
        const nim = req.user.nama; 
        const extension = path.extname(file.originalname);
        // Nama file: NIM.pdf (Contoh: 2255301001.pdf)
        cb(null, nim + extension);
    }
});

// --- 2. PENYIMPANAN UNTUK TUGAS MINGGUAN ---
const tugasStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = '';
        // Cek fieldname sesuai dengan yang dikirim Frontend (MahasiswaTugas.jsx)
        if (file.fieldname === 'fileLaporan') {
            uploadPath = 'uploads/tugas_laporan/';
        } else if (file.fieldname === 'filePresentasi') {
            uploadPath = 'uploads/tugas_presentasi/';
        }
        ensureDir(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const nim = req.user.nim;
        // req.body.taskNumber didapat dari Frontend.
        // PENTING: Di Frontend, append 'taskNumber' DULUAN sebelum append 'file'.
        const taskNumber = req.body.taskNumber || 'UNKNOWN'; 
        const fieldName = file.fieldname; 
        const extension = path.extname(file.originalname);
        
        // Nama file: NIM-Tugas-I-fileLaporan.pdf
        cb(null, `${nim}-Tugas-${taskNumber}-${fieldName}${extension}`);
    }
});

// --- 3. EKSPOR MIDDLEWARE ---
// Kita langsung definisikan .fields() di sini agar Controller terima beres

export const uploadProyek = multer({ storage: proyekStorage }).fields([
    { name: 'fileLaporanKP', maxCount: 1 },
    { name: 'fileLaporanTA', maxCount: 1 }
]);

export const uploadTugas = multer({ storage: tugasStorage }).fields([
    { name: 'fileLaporan', maxCount: 1 },     // Wajib di Frontend
    { name: 'filePresentasi', maxCount: 1 }   // Opsional
]);