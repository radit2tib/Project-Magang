import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// =======================================================
// FUNGSI YANG DIPERBAIKI
// =======================================================

// --- [PERBAIKAN] FUNGSI UNTUK MENGAMBIL SEMUA DATA MAHASISWA ---
export const getAllMahasiswa = async (req, res) => {
  try {
    // 1. Hapus 'select'. Ambil SEMUA data.
    const allMahasiswa = await prisma.mahasiswa.findMany({
      orderBy: { nama: 'asc' },
    });

    // 2. Hapus password secara manual SETELAH mengambil data
    // Ini memastikan frontend mendapat SEMUA data (seperti mentor, co_mentor, dll)
    // tapi TETAP aman tanpa password.
    const safeData = allMahasiswa.map(mhs => {
      delete mhs.password;
      return mhs;
    });

    // 3. Hapus 'formattedData'. Kirim data mentah.
    // Frontend (React) akan menangani 'null' atau boolean 'false'.
    res.status(200).json(safeData);

  } catch (error) {
    console.error("Error saat mengambil data semua mahasiswa:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

// --- [PERBAIKAN] FUNGSI UNTUK MEMPERBARUI MAHASISWA (OLEH ADMIN) ---
export const updateMahasiswa = async (req, res) => {
    const { nim } = req.params; 
    let dataToUpdate = req.body; // Gunakan 'let' agar bisa diubah

    try {
        // 1. Penanganan Password (Lebih Aman)
        // Cek jika 'password' dikirim DAN tidak kosong
        if (dataToUpdate.password && dataToUpdate.password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, salt);
        } else {
            // Jika password kosong atau tidak dikirim, HAPUS
            // agar tidak mengupdate password jadi string kosong
            delete dataToUpdate.password;
        }

        // 2. Konversi Tipe Data Boolean (INI ADALAH PERBAIKAN ERROR 500)
        // Form React mengirim string "true" atau "false"
        if (dataToUpdate.pakaiKacamata !== undefined) {
            dataToUpdate.pakaiKacamata = (dataToUpdate.pakaiKacamata === 'true' || dataToUpdate.pakaiKacamata === true);
        }
        if (dataToUpdate.isProfileComplete !== undefined) {
            dataToUpdate.isProfileComplete = (dataToUpdate.isProfileComplete === 'true' || dataToUpdate.isProfileComplete === true);
        }

        // 3. Konversi Tipe Data Angka (Opsional tapi lebih aman)
        // Pastikan angkatan disimpan sebagai Angka, bukan string "2023"
        if (dataToUpdate.angkatan) {
            dataToUpdate.angkatan = parseInt(dataToUpdate.angkatan, 10);
        }

        const updatedMahasiswa = await prisma.mahasiswa.update({
            where: { nim: nim }, 
            data: dataToUpdate // dataToUpdate sekarang sudah bersih
        });

        delete updatedMahasiswa.password;
        res.status(200).json({ message: "Data mahasiswa berhasil diperbarui", data: updatedMahasiswa });

    } catch (error) {
        console.error("ERROR BACKEND SAAT UPDATE:", error); // <-- Ini akan log error detail di terminal
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Mahasiswa dengan NIM tersebut tidak ditemukan." });
        }
        // Menangkap error jika konversi tipe data gagal
        if (error.code === 'P2003' || error.name === 'PrismaClientValidationError') {
             return res.status(400).json({ message: "Update gagal. Tipe data tidak valid.", error: error.message });
        }
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};


// =======================================================
// FUNGSI LAINNYA (TETAP SAMA)
// =======================================================

// --- FUNGSI UNTUK MENGAMBIL PROFIL MAHASISWA (DIRI SENDIRI) ---
export const getMahasiswaProfile = async (req, res) => {
    try {
        const nimDariToken = req.user.nim;
        const mahasiswa = await prisma.mahasiswa.findUnique({
            where: {
                nim: nimDariToken
            },
            select: {
                nim: true,
                nama: true,
                angkatan: true,
                bu: true,
                dept: true,
                judulKp: true,
                judulTa: true,
                pakaiKacamata: true,
                riwayatPenyakit: true,
                scholar: true,
                english: true,
                isProfileComplete: true,
                jenisKelamin: true 
            }
        });

        if (!mahasiswa) {
            return res.status(404).json({ message: "Mahasiswa tidak ditemukan." });
        }
        res.status(200).json(mahasiswa);

    } catch (error) {
        console.error("Error saat mengambil profil mahasiswa:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

// --- FUNGSI UNTUK MEMPERBARUI PROFIL MAHASISWA (DIRI SENDIRI) ---
export const updateMahasiswaProfile = async (req, res) => {
    const nim = req.user.nim;
    let dataToUpdate = req.body; // Gunakan 'let'

    delete dataToUpdate.password; 

    // Tambahkan konversi boolean di sini juga untuk halaman profil mahasiswa
    if (dataToUpdate.pakaiKacamata !== undefined) {
        dataToUpdate.pakaiKacamata = (dataToUpdate.pakaiKacamata === 'true' || dataToUpdate.pakaiKacamata === true);
    }
    
    try {
        await prisma.mahasiswa.update({
            where: { nim: nim },
            data: {
                ...dataToUpdate,
                isProfileComplete: true 
            }
        });
        res.status(200).json({ message: "Profil berhasil diperbarui." });

    } catch (error) {
        console.error("Error saat memperbarui profil:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

// --- FUNGSI UNTUK MEMBUAT MAHASISWA BARU ---
export const createMahasiswa = async (req, res) => {
    const { nim, nama, password, angkatan, bu, dept } = req.body;

    if (!nim || !nama || !password) {
        return res.status(400).json({ message: "NIM, Nama, dan Password wajib diisi." });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newMahasiswa = await prisma.mahasiswa.create({
            data: {
                nim: nim,
                nama: nama,
                password: hashedPassword,
                angkatan: parseInt(angkatan, 10), // Pastikan angkatan adalah angka
                bu: bu,
                dept: dept,
                isProfileComplete: false 
            }
        });

        delete newMahasiswa.password;
        res.status(201).json({ message: "Mahasiswa berhasil dibuat", data: newMahasiswa });

    } catch (error) {
       if (error.code === 'P2002') {
           return res.status(409).json({ message: "NIM sudah terdaftar." });
       }
        console.error("Error saat membuat mahasiswa:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

// --- FUNGSI UNTUK MENGHAPUS MAHASISWA (OLEH ADMIN) ---
export const deleteMahasiswa = async (req, res) => {
    const { nim } = req.params; 

    try {
        await prisma.mahasiswa.delete({
            where: { nim: nim }
        });
        res.status(200).json({ message: "Data mahasiswa berhasil dihapus." });

    } catch (error) {
       if (error.code === 'P2025') {
           return res.status(404).json({ message: "Mahasiswa dengan NIM tersebut tidak ditemukan." });
       }
        console.error("Error saat menghapus mahasiswa:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};