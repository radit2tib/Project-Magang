import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; // Pastikan bcrypt diimpor

const prisma = new PrismaClient();

// =======================================================
// FUNGSI YANG SUDAH ANDA BUAT (Rute Admin & Profil)
// =======================================================

// --- FUNGSI UNTUK MENGAMBIL SEMUA DATA MAHASISWA ---
// Dipakai oleh: GET /
// --- FUNGSI UNTUK MENGAMBIL SEMUA DATA MAHASISWA ---
export const getAllMahasiswa = async (req, res) => {
  try {
    const allMahasiswa = await prisma.mahasiswa.findMany({
      orderBy: { nama: 'asc' },
      select: {
        nim: true,
        nama: true,
        angkatan: true,
        bu: true,
        dept: true,
        judulKp: true,
        judulTa: true,

        // 🔹 Tambahkan kolom tambahan agar muncul di frontend
        scholar: true,
        english: true,
        pakaiKacamata: true,
        riwayatPenyakit: true,
        jenisKelamin: true,
        isProfileComplete: true,
      },
    });

    // Opsional: ubah null jadi "-" supaya tampilan tidak kosong
    const formattedData = allMahasiswa.map((mhs) => ({
      nim: mhs.nim,
      nama: mhs.nama,
      angkatan: mhs.angkatan,
      bu: mhs.bu || "-",
      dept: mhs.dept || "-",
      scholar: mhs.scholar || "-",
      english: mhs.english || "-",
      pakaiKacamata: mhs.pakaiKacamata === true ? "Ya" : mhs.pakaiKacamata === false ? "Tidak" : "-",
      riwayatPenyakit: mhs.riwayatPenyakit || "-",
      judulKp: mhs.judulKp || "-",
      judulTa: mhs.judulTa || "-",
      jenisKelamin: mhs.jenisKelamin || "-",
      isProfileComplete: mhs.isProfileComplete ? "Lengkap" : "Belum Lengkap",
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error saat mengambil data semua mahasiswa:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};



// --- FUNGSI UNTUK MENGAMBIL PROFIL MAHASISWA (DIRI SENDIRI) ---
// Dipakai oleh: GET /profile (Butuh verifyToken)
export const getMahasiswaProfile = async (req, res) => {
    try {
        // 1. Ambil NIM dari token (didapat dari middleware verifyToken)
        const nimDariToken = req.user.nim;

        // 2. Cari HANYA SATU mahasiswa berdasarkan NIM tersebut
        const mahasiswa = await prisma.mahasiswa.findUnique({
            where: {
                nim: nimDariToken
            },
            // 3. Pilih data apa saja yang ingin dikirim ke frontend
            select: {
                nim: true,
                nama: true,
                angkatan: true,
                bu: true,
                dept: true,
                judulKp: true,
                judulTa: true,
                
                // Field tambahan untuk halaman profil
                pakaiKacamata: true,
                riwayatPenyakit: true,
                scholar: true,
                english: true,
                isProfileComplete: true,
                jenisKelamin: true 
                // Pastikan tidak ada 'password' di sini
            }
        });

        // 4. Jika mahasiswa dengan NIM dari token tidak ada
        if (!mahasiswa) {
            return res.status(404).json({ message: "Mahasiswa tidak ditemukan." });
        }

        // 5. Kirim data SATU mahasiswa tersebut sebagai objek
        res.status(200).json(mahasiswa);

    } catch (error) {
        console.error("Error saat mengambil profil mahasiswa:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};
// --- FUNGSI UNTUK MEMPERBARUI PROFIL MAHASISWA (DIRI SENDIRI) ---
// Dipakai oleh: PUT /profile (Butuh verifyToken)
export const updateMahasiswaProfile = async (req, res) => {
    const nim = req.user.nim;
    const dataToUpdate = req.body;

    // Hapus password dari data update jika ada, untuk mencegah update password
    // (Sebaiknya ada rute terpisah untuk "ganti password")
    delete dataToUpdate.password; 

    try {
        await prisma.mahasiswa.update({
            where: { nim: nim },
            data: {
                ...dataToUpdate,
                isProfileComplete: true // Tandai profil sebagai lengkap setelah diisi
            }
        });
        res.status(200).json({ message: "Profil berhasil diperbarui." });

    } catch (error) {
        console.error("Error saat memperbarui profil:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};


// =======================================================
// FUNGSI BARU YANG HILANG (Rute Admin)
// =======================================================

// --- FUNGSI UNTUK MEMBUAT MAHASISWA BARU ---
// Dipakai oleh: POST /
export const createMahasiswa = async (req, res) => {
    const { nim, nama, password, angkatan, bu, dept } = req.body;

    // Validasi dasar
    if (!nim || !nama || !password) {
        return res.status(400).json({ message: "NIM, Nama, dan Password wajib diisi." });
    }

    try {
        // HASH PASSWORD sebelum disimpan ke database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newMahasiswa = await prisma.mahasiswa.create({
            data: {
                nim: nim,
                nama: nama,
                password: hashedPassword, // Simpan password yang sudah di-hash
                angkatan: angkatan,
                bu: bu,
                dept: dept,
                // Anda bisa set default value lain di sini jika perlu
                isProfileComplete: false 
            }
        });

        // Jangan kirim balik password hash di response
        delete newMahasiswa.password;
        res.status(201).json({ message: "Mahasiswa berhasil dibuat", data: newMahasiswa });

    } catch (error) {
         // Tangani error jika NIM sudah ada (unique constraint)
        if (error.code === 'P2002') {
            return res.status(409).json({ message: "NIM sudah terdaftar." });
        }
        console.error("Error saat membuat mahasiswa:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

// --- FUNGSI UNTUK MEMPERBARUI MAHASISWA (OLEH ADMIN) ---
// Dipakai oleh: PUT /:nim
export const updateMahasiswa = async (req, res) => {
    const { nim } = req.params; // NIM dari URL
    const dataToUpdate = req.body;

    // Jika admin ingin me-reset password, hash password baru
    if (dataToUpdate.password) {
        try {
            const salt = await bcrypt.genSalt(10);
            dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, salt);
        } catch (hashError) {
            return res.status(500).json({ message: "Gagal hashing password." });
        }
    }

    try {
        const updatedMahasiswa = await prisma.mahasiswa.update({
            where: { nim: nim }, 
            data: dataToUpdate
        });

        delete updatedMahasiswa.password; // Jangan kirim balik password
        res.status(200).json({ message: "Data mahasiswa berhasil diperbarui", data: updatedMahasiswa });

    } catch (error) {
        // Tangani error jika mahasiswa tidak ditemukan
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Mahasiswa dengan NIM tersebut tidak ditemukan." });
        }
        console.error("Error saat memperbarui mahasiswa:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

// --- FUNGSI UNTUK MENGHAPUS MAHASISWA (OLEH ADMIN) ---
// Dipakai oleh: DELETE /:nim
export const deleteMahasiswa = async (req, res) => {
    const { nim } = req.params; // NIM dari URL

    try {
        await prisma.mahasiswa.delete({
            where: { nim: nim }
        });
        res.status(200).json({ message: "Data mahasiswa berhasil dihapus." });

    } catch (error) {
         // Tangani error jika mahasiswa tidak ditemukan
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Mahasiswa dengan NIM tersebut tidak ditemukan." });
        }
        console.error("Error saat menghapus mahasiswa:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};