import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import fs from 'fs'; // Wajib ada untuk hapus file jika error

const prisma = new PrismaClient();

// =======================================================
// A. FUNGSI UPLOAD (DENGAN DEBUG LOG)
// =======================================================

// --- 1. UPLOAD PROYEK AKHIR (KP & TA) ---
export const uploadProyekFiles = async (req, res) => {
    console.log("\n>>> [DEBUG] Masuk ke uploadProyekFiles");
    const nim = req.user.nim;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: "Tidak ada file yang diupload." });
    }

    const dataToUpdate = {};
    
    // Normalisasi Path (Ganti backslash Windows '\' jadi '/')
    if (req.files['fileLaporanKP']) {
        dataToUpdate.fileLaporanKp = req.files['fileLaporanKP'][0].path.replace(/\\/g, "/");
    }
    if (req.files['fileLaporanTA']) {
        dataToUpdate.fileLaporanTa = req.files['fileLaporanTA'][0].path.replace(/\\/g, "/");
    }

    try {
        await prisma.mahasiswa.update({
            where: { nim: nim },
            data: dataToUpdate
        });
        console.log(">>> [SUCCESS] Proyek Berhasil Diupload");
        res.status(200).json({ message: "File proyek berhasil diupload." });
    } catch (error) {
        console.error(">>> [ERROR] Upload Proyek:", error);
        res.status(500).json({ message: "Gagal menyimpan path file ke database." });
    }
};

// --- 2. UPLOAD TUGAS MINGGUAN ---
export const uploadTugasFile = async (req, res) => {
    console.log("\n============================================");
    console.log(">>> [DEBUG] START uploadTugasFile");
    
    const nim = req.user.nim;
    const { taskNumber, judulTugas } = req.body;

    // Log Debug
    console.log("User:", nim);
    console.log("Body:", req.body);

    // 1. VALIDASI INPUT TEKS
    if (!taskNumber || !judulTugas) {
        // Hapus file jika terlanjur upload tapi data teks salah
        if (req.files?.fileLaporan) fs.unlinkSync(req.files['fileLaporan'][0].path);
        if (req.files?.filePresentasi) fs.unlinkSync(req.files['filePresentasi'][0].path);
        return res.status(400).json({ message: "Nomor tugas dan Judul wajib diisi." });
    }

    // 2. VALIDASI FILE WAJIB
    if (!req.files || !req.files['fileLaporan']) {
         if (req.files?.filePresentasi) fs.unlinkSync(req.files['filePresentasi'][0].path);
         return res.status(400).json({ message: "File Laporan (PDF/Doc) wajib diupload." });
    }

    // 3. SIAPKAN PATH FILE
    const pathLaporan = req.files['fileLaporan'][0].path.replace(/\\/g, "/");
    let pathPresentasi = null;
    if (req.files['filePresentasi']) {
        pathPresentasi = req.files['filePresentasi'][0].path.replace(/\\/g, "/");
    }

    // 4. SIMPAN KE DATABASE (UPSERT)
    try {
        const result = await prisma.tugas.upsert({
            where: {
                nim_mahasiswa_taskNumber: {
                    nim_mahasiswa: nim,
                    taskNumber: taskNumber
                }
            },
            update: {
                judulTugas: judulTugas,
                fileLaporan: pathLaporan,
                filePresentasi: pathPresentasi,
                updatedAt: new Date()
            },
            create: {
                nim_mahasiswa: nim,
                taskNumber: taskNumber,
                judulTugas: judulTugas,
                fileLaporan: pathLaporan,
                filePresentasi: pathPresentasi
            }
        });

        console.log(">>> [SUCCESS] Data Tersimpan:", result);
        res.status(200).json({ message: `Tugas ${taskNumber} berhasil diupload.` });

    } catch (error) {
         console.error(">>> [ERROR] Prisma Upsert Gagal:", error);
         // Bersihkan file sampah
         if (fs.existsSync(pathLaporan)) fs.unlinkSync(pathLaporan);
         if (pathPresentasi && fs.existsSync(pathPresentasi)) fs.unlinkSync(pathPresentasi);
         res.status(500).json({ message: "Gagal menyimpan tugas ke database." });
    }
};


// =======================================================
// B. FUNGSI KHUSUS ADMIN (PENILAIAN)
// =======================================================

// --- 1. AMBIL DATA UTUH (Mahasiswa + Tugas) ---
export const getAllPenugasan = async (req, res) => {
    try {
        const data = await prisma.mahasiswa.findMany({
            orderBy: { nama: 'asc' },
            include: {
                // PENTING: Sertakan data tugas agar Admin bisa lihat
                daftarTugas: {
                    orderBy: { taskNumber: 'asc' }
                }
            }
        });

        // Hapus password sebelum dikirim
        const safeData = data.map(mhs => {
            const { password, ...rest } = mhs;
            return rest;
        });

        res.status(200).json(safeData);
    } catch (error) {
        console.error("Error getAllPenugasan:", error);
        res.status(500).json({ message: "Gagal mengambil data penugasan." });
    }
};

// --- 2. UPDATE NILAI TUGAS ---
export const gradeTugas = async (req, res) => {
    const { nim, taskNumber, nilai } = req.body;

    if (!nim || !taskNumber || nilai === undefined) {
        return res.status(400).json({ message: "Data penilaian tidak lengkap." });
    }

    try {
        const updatedTugas = await prisma.tugas.update({
            where: {
                nim_mahasiswa_taskNumber: {
                    nim_mahasiswa: nim,
                    taskNumber: taskNumber
                }
            },
            data: {
                nilai: parseInt(nilai, 10) // Pastikan Integer
            }
        });

        res.status(200).json({ message: "Nilai berhasil disimpan.", data: updatedTugas });

    } catch (error) {
        console.error("Error gradeTugas:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Tugas belum diupload, tidak bisa dinilai." });
        }
        res.status(500).json({ message: "Gagal menyimpan nilai." });
    }
};


// =======================================================
// C. FUNGSI CRUD STANDAR & PROFIL
// =======================================================

// --- GET PROFILE (PENTING: INCLUDE TUGAS UNTUK FRONTEND) ---
export const getMahasiswaProfile = async (req, res) => {
    try {
        const nimDariToken = req.user.nim;
        const mahasiswa = await prisma.mahasiswa.findUnique({
            where: { nim: nimDariToken },
            select: {
                // Pilih field manual untuk kontrol penuh
                nim: true, nama: true, angkatan: true, bu: true, dept: true,
                judulKp: true, judulTa: true, 
                fileLaporanKp: true, fileLaporanTa: true,
                pakaiKacamata: true, riwayatPenyakit: true, scholar: true,
                english: true, isProfileComplete: true, jenisKelamin: true,
                
                // [CRITICAL] Sertakan Tugas agar Frontend bisa cek status Lock/Verified
                daftarTugas: {
                    orderBy: { taskNumber: 'asc' },
                    select: {
                        taskNumber: true,
                        judulTugas: true,
                        fileLaporan: true,
                        filePresentasi: true,
                        nilai: true // Frontend butuh ini untuk cek "isGraded"
                    }
                }
            }
        });

        if (!mahasiswa) return res.status(404).json({ message: "Mahasiswa tidak ditemukan." });
        res.status(200).json(mahasiswa);
    } catch (error) {
        console.error("Error getMahasiswaProfile:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// --- UPDATE PROFILE ---
export const updateMahasiswaProfile = async (req, res) => {
    const nim = req.user.nim;
    let dataToUpdate = req.body; 
    delete dataToUpdate.password; 
    delete dataToUpdate.fileLaporanKp;
    delete dataToUpdate.fileLaporanTa;

    if (dataToUpdate.pakaiKacamata !== undefined) dataToUpdate.pakaiKacamata = (String(dataToUpdate.pakaiKacamata) === 'true');
    
    try {
        await prisma.mahasiswa.update({
            where: { nim: nim },
            data: { ...dataToUpdate, isProfileComplete: true }
        });
        res.status(200).json({ message: "Profil diperbarui." });
    } catch (error) {
        console.error("Error update profile:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// --- CRUD ADMIN (GET ALL, CREATE, UPDATE, DELETE) ---
export const getAllMahasiswa = async (req, res) => {
  try {
    const allMahasiswa = await prisma.mahasiswa.findMany({ orderBy: { nama: 'asc' } });
    const safeData = allMahasiswa.map(mhs => { delete mhs.password; return mhs; });
    res.status(200).json(safeData);
  } catch (error) { res.status(500).json({ message: "Server error." }); }
};

export const createMahasiswa = async (req, res) => {
    const { nim, nama, password, angkatan, bu, dept } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newMahasiswa = await prisma.mahasiswa.create({
            data: { nim, nama, password: hashedPassword, angkatan: parseInt(angkatan), bu, dept }
        });
        res.status(201).json({ message: "Mahasiswa dibuat." });
    } catch (error) {
       if (error.code === 'P2002') return res.status(409).json({ message: "NIM sudah terdaftar." });
       res.status(500).json({ message: "Server error." });
    }
};

export const updateMahasiswa = async (req, res) => {
    const { nim } = req.params; 
    let dataToUpdate = req.body; 
    try {
        if (dataToUpdate.password) {
            const salt = await bcrypt.genSalt(10);
            dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, salt);
        } else { delete dataToUpdate.password; }
        
        if (dataToUpdate.angkatan) dataToUpdate.angkatan = parseInt(dataToUpdate.angkatan);

        await prisma.mahasiswa.update({ where: { nim: nim }, data: dataToUpdate });
        res.status(200).json({ message: "Data diperbarui." });
    } catch (error) { res.status(500).json({ message: "Server error." }); }
};

export const deleteMahasiswa = async (req, res) => {
    const { nim } = req.params; 
    try {
        await prisma.mahasiswa.delete({ where: { nim: nim } });
        res.status(200).json({ message: "Data dihapus." });
    } catch (error) { res.status(500).json({ message: "Server error." }); }
};