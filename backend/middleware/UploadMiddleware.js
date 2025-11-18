import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Fungsi untuk memastikan direktori ada
const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// --- PENYIMPANAN UNTUK PROYEK AKHIR (KP & TA) ---
const proyekStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = '';
        if (file.fieldname === 'fileLaporanKP') {
            uploadPath = 'uploads/laporan_kp/';
        } else if (file.fieldname === 'fileLaporanTA') {
            uploadPath = 'uploads/laporan_ta/';
        }
        ensureDir(uploadPath); // Pastikan folder ada
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Gunakan NIM dari user yang login (didapat dari verifyToken)
        const nim = req.user.nim;
        const extension = path.extname(file.originalname);
        // Nama file: NIM.pdf (misal: 2255301001.pdf). Ini akan menimpa file lama.
        cb(null, nim + extension);
    }
});

// --- PENYIMPANAN UNTUK TUGAS MINGGUAN ---
const tugasStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = '';
        if (file.fieldname === 'fileLaporan') {
            uploadPath = 'uploads/tugas_laporan/';
        } else if (file.fieldname === 'filePresentasi') {
            uploadPath = 'uploads/tugas_presentasi/';
        }
        ensureDir(uploadPath); // Pastikan folder ada
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Gunakan NIM dan Nomor Tugas (dari form body)
        const nim = req.user.nim;
        const taskNumber = req.body.taskNumber; // "I", "II", dll.
        const fieldName = file.fieldname; // "fileLaporan" atau "filePresentasi"
        const extension = path.extname(file.originalname);
        // Nama file: 2255301001-Tugas-I-fileLaporan.pdf
        cb(null, `${nim}-Tugas-${taskNumber}-${fieldName}${extension}`);
    }
});

// Ekspor middleware multer
export const uploadProyek = multer({ storage: proyekStorage });
export const uploadTugas = multer({ storage: tugasStorage });