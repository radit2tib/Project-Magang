import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- FUNGSI LOGIN UNTUK ADMIN ---
export const loginAdmin = (req, res) => {
    const { email, password } = req.body;
    // Kredensial diubah sesuai permintaan Anda
    const ADMIN_EMAIL = "ibunani@april.com";
    const ADMIN_PASSWORD = "1"; // PERINGATAN: Sangat tidak aman untuk produksi

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const payload = { email: email, role: 'admin' };
        
        // Pastikan Anda menambahkan JWT_SECRET di file .env Anda!
        const secret = process.env.JWT_SECRET || "RAHASIA_INI_HARUS_DIGANTI_DI_ENV";
        
        const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
        });
        return res.status(200).json({ message: "Login berhasil", token: token });
    } else {
        return res.status(401).json({ message: "Email atau password admin salah." });
    }
};


// --- FUNGSI LOGIN UNTUK MAHASISWA ---
export const loginMahasiswa = async (req, res) => {
    const { nim, password } = req.body;

    if (!nim || !password) {
        return res.status(400).json({ message: "NIM dan Password wajib diisi." });
    }

    try {
        // 1. Cari mahasiswa berdasarkan NIM di database
        const mahasiswa = await prisma.mahasiswa.findUnique({
            where: { nim: nim }
        });

        // 2. Jika mahasiswa tidak ditemukan, kirim error
        if (!mahasiswa) {
            return res.status(404).json({ message: "NIM tidak terdaftar." });
        }

        // 3. Bandingkan password yang dimasukkan dengan hash di database
        const isPasswordMatch = await bcrypt.compare(password, mahasiswa.password);

        // 4. Jika password tidak cocok, kirim error
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Password salah." });
        }

        // 5. Jika password cocok, buat token JWT
        const payload = { nim: mahasiswa.nim, role: 'mahasiswa',nama: mahasiswa.nama  };
        
        // Pastikan Anda menambahkan JWT_SECRET di file .env Anda!
        const secret = process.env.JWT_SECRET || "RAHASIA_INI_HARUS_DIGANTI_DI_ENV";

        const token = jwt.sign(payload, secret, {
            expiresIn: '8h' // Token berlaku 8 jam
        });

        // 6. Kirim respons berhasil beserta token dan status profil
        res.status(200).json({
            message: "Login berhasil",
            token: token,
            isProfileComplete: mahasiswa.isProfileComplete
        });

    } catch (error) {
        console.error("Error saat login mahasiswa:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

// --- FUNGSI REGISTRASI UNTUK MAHASISWA ---
export const registerMahasiswa = async (req, res) => {
    const { nim, nama, angkatan, password } = req.body;

    // 1. Validasi input dasar
    if (!nim || !nama || !angkatan || !password) {
        return res.status(400).json({ message: "Semua field wajib diisi." });
    }

    try {
        // 2. Cek apakah NIM sudah ada di database untuk mencegah duplikat
        const existingMahasiswa = await prisma.mahasiswa.findUnique({
            where: { nim: nim }
        });

        if (existingMahasiswa) {
            return res.status(409).json({ message: "NIM sudah terdaftar." });
        }

        // 3. Enkripsi password menggunakan bcrypt sebelum disimpan
        const hashedPassword = await bcrypt.hash(password, 10); // Angka 10 adalah standar 'salt rounds'

        // 4. Buat mahasiswa baru di dalam database
        await prisma.mahasiswa.create({
            data: {
                nim: nim,
                nama: nama,
                angkatan: parseInt(angkatan, 10), // Pastikan Angka
                password: hashedPassword,
                // isProfileComplete akan otomatis `false` sesuai skema
            }
        });

        // 5. Kirim respons bahwa registrasi berhasil
        res.status(201).json({ message: "Registrasi mahasiswa berhasil." });

    } catch (error) {
        console.error("Error saat registrasi mahasiswa:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};