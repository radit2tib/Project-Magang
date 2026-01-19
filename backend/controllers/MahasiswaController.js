import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import fs from 'fs'; 

const prisma = new PrismaClient();

// =======================================================
// A. FUNGSI UPLOAD (KP, TA, TUGAS) - Tetap Ada
// =======================================================

// --- 1. UPLOAD PROYEK AKHIR (KP & TA) ---
export const uploadProyekFiles = async (req, res) => {
    const nim = req.user.nim;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: "Tidak ada file yang diupload." });
    }

    const dataToUpdate = {};
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
        res.status(200).json({ message: "File proyek berhasil diupload." });
    } catch (error) {
        console.error(">>> [ERROR] Upload Proyek:", error);
        res.status(500).json({ message: "Gagal menyimpan path file ke database." });
    }
};

// --- 2. UPLOAD TUGAS MINGGUAN ---
export const uploadTugasFile = async (req, res) => {
    const nim = req.user.nim;
    const { taskNumber, judulTugas } = req.body;

    if (!taskNumber || !judulTugas) {
        if (req.files?.fileLaporan) fs.unlinkSync(req.files['fileLaporan'][0].path);
        if (req.files?.filePresentasi) fs.unlinkSync(req.files['filePresentasi'][0].path);
        return res.status(400).json({ message: "Nomor tugas dan Judul wajib diisi." });
    }

    if (!req.files || !req.files['fileLaporan']) {
         if (req.files?.filePresentasi) fs.unlinkSync(req.files['filePresentasi'][0].path);
         return res.status(400).json({ message: "File Laporan (PDF/Doc) wajib diupload." });
    }

    const pathLaporan = req.files['fileLaporan'][0].path.replace(/\\/g, "/");
    let pathPresentasi = null;
    if (req.files['filePresentasi']) {
        pathPresentasi = req.files['filePresentasi'][0].path.replace(/\\/g, "/");
    }

    try {
        await prisma.tugas.upsert({
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
        res.status(200).json({ message: `Tugas ${taskNumber} berhasil diupload.` });
    } catch (error) {
         console.error(">>> [ERROR] Prisma Upsert Gagal:", error);
         if (fs.existsSync(pathLaporan)) fs.unlinkSync(pathLaporan);
         if (pathPresentasi && fs.existsSync(pathPresentasi)) fs.unlinkSync(pathPresentasi);
         res.status(500).json({ message: "Gagal menyimpan tugas ke database." });
    }
};

// =======================================================
// B. FUNGSI KHUSUS ADMIN
// =======================================================

export const getAllPenugasan = async (req, res) => {
    try {
        const data = await prisma.mahasiswa.findMany({
            orderBy: { nama: 'asc' },
            include: {
                daftarTugas: { orderBy: { taskNumber: 'asc' } }
            }
        });
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

export const gradeTugas = async (req, res) => {
    const { nim, taskNumber, nilai } = req.body;
    if (!nim || !taskNumber || nilai === undefined) {
        return res.status(400).json({ message: "Data penilaian tidak lengkap." });
    }
    try {
        const updatedTugas = await prisma.tugas.update({
            where: {
                nim_mahasiswa_taskNumber: { nim_mahasiswa: nim, taskNumber: taskNumber }
            },
            data: { nilai: parseInt(nilai, 10) }
        });
        res.status(200).json({ message: "Nilai berhasil disimpan.", data: updatedTugas });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ message: "Tugas belum diupload." });
        res.status(500).json({ message: "Gagal menyimpan nilai." });
    }
};

export const updatePenilaianAkhir = async (req, res) => {
    const { nim, type, nilaiMentor, nilaiPenguji, nilaiAkhir, komen } = req.body;
    if (!nim || !type) return res.status(400).json({ message: "NIM dan Tipe Penilaian wajib ada." });

    let dataToUpdate = {};
    if (type === 'KP') {
        dataToUpdate = {
            nilaiKpMentor: parseFloat(nilaiMentor),
            nilaiKpPenguji: parseFloat(nilaiPenguji),
            nilaiKpAkhir: parseFloat(nilaiAkhir),
            komenKp: komen
        };
    } else if (type === 'TA') {
        dataToUpdate = {
            nilaiTaMentor: parseFloat(nilaiMentor),
            nilaiTaPenguji: parseFloat(nilaiPenguji),
            nilaiTaAkhir: parseFloat(nilaiAkhir),
            komenTa: komen
        };
    } else {
        return res.status(400).json({ message: "Tipe penilaian harus 'KP' atau 'TA'." });
    }

    try {
        await prisma.mahasiswa.update({ where: { nim: nim }, data: dataToUpdate });
        res.status(200).json({ message: `Penilaian ${type} berhasil disimpan.` });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ message: "Mahasiswa tidak ditemukan." });
        res.status(500).json({ message: "Gagal menyimpan penilaian." });
    }
};

// =======================================================
// C. FUNGSI PROFIL & CRUD (BAGIAN YANG DIPERBAIKI)
// =======================================================

// --- GET PROFILE (TANPA FOTO PROFIL) ---
export const getMahasiswaProfile = async (req, res) => {
    try {
        const nimDariToken = req.user.nim;
        const mahasiswa = await prisma.mahasiswa.findUnique({
            where: { nim: nimDariToken },
            select: {
                nim: true, nama: true, angkatan: true, bu: true, dept: true,
                judulKp: true, judulTa: true,
                // fotoProfil: true, <--- SUDAH DIHAPUS
                fileLaporanKp: true, fileLaporanTa: true,
                pakaiKacamata: true, riwayatPenyakit: true, scholar: true,
                english: true, isProfileComplete: true, jenisKelamin: true,
                
                nilaiKpMentor: true, nilaiKpPenguji: true, nilaiKpAkhir: true, komenKp: true,
                nilaiTaMentor: true, nilaiTaPenguji: true, nilaiTaAkhir: true, komenTa: true,

                daftarTugas: {
                    orderBy: { taskNumber: 'asc' },
                    select: {
                        taskNumber: true, judulTugas: true, fileLaporan: true,
                        filePresentasi: true, nilai: true 
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

// --- UPDATE PROFILE (TANPA LOGIKA UPLOAD FOTO) ---
export const updateMahasiswaProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.nim) {
            return res.status(401).json({ message: "Unauthorized: User tidak valid." });
        }
        const nim = req.user.nim;

        // KITA ABAIKAN REQ.FILE DISINI KARENA TIDAK DISIMPAN KE DB

        const { 
            nama, angkatan, bu, dept, 
            pakaiKacamata, riwayatPenyakit, scholar, english, jenisKelamin,
            judulKp, judulTa
        } = req.body;

        const dataToUpdate = {};

        // Masukkan Data Teks Saja
        if (nama) dataToUpdate.nama = nama;
        if (bu) dataToUpdate.bu = bu;
        if (dept) dataToUpdate.dept = dept;
        if (riwayatPenyakit) dataToUpdate.riwayatPenyakit = riwayatPenyakit;
        if (scholar) dataToUpdate.scholar = scholar;
        if (english) dataToUpdate.english = english;
        if (jenisKelamin) dataToUpdate.jenisKelamin = jenisKelamin;
        if (judulKp) dataToUpdate.judulKp = judulKp;
        if (judulTa) dataToUpdate.judulTa = judulTa;

        // Konversi Tipe Data (Wajib karena FormData mengirim String)
        if (angkatan) {
            const parsedAngkatan = parseInt(angkatan, 10);
            if (!isNaN(parsedAngkatan)) dataToUpdate.angkatan = parsedAngkatan;
        }

        if (pakaiKacamata !== undefined) {
            dataToUpdate.pakaiKacamata = (String(pakaiKacamata) === 'true');
        }

        dataToUpdate.isProfileComplete = true;

        console.log(">>> [DEBUG] Update Profile Data (No Foto):", dataToUpdate);

        await prisma.mahasiswa.update({
            where: { nim: nim },
            data: dataToUpdate
        });

        res.status(200).json({ message: "Profil berhasil diperbarui." });

    } catch (error) {
        console.error(">>> [ERROR] Update Profile:", error);
        if (error.code === 'P2002') {
            return res.status(409).json({ message: "Data unik duplikat." });
        }
        res.status(500).json({ message: "Gagal update profil." });
    }
};

// --- CRUD ADMIN ---
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
        await prisma.mahasiswa.create({
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