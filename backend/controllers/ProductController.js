import { PrismaClient } from "@prisma/client";
// Import bcrypt untuk hashing password, jangan lupa install!
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// 1. Mengambil semua data admin
export const getAdmins = async (req, res) => {
    try {
        // Menggunakan prisma.admins, bukan prisma.product
        // 'select' digunakan agar password_hash tidak ikut terkirim ke client
        const response = await prisma.admins.findMany({
            select: {
                id: true,
                nama_lengkap: true,
                username: true,
                created_at: true
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// 2. Mengambil admin berdasarkan ID
export const getAdminById = async (req, res) => {
    try {
        const response = await prisma.admins.findUnique({
            where: {
                id: Number(req.params.id),
            },
            select: {
                id: true,
                nama_lengkap: true,
                username: true,
                created_at: true
            }
        });
        if (!response) return res.status(404).json({ msg: "Admin not found" });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// 3. Membuat admin baru
export const createAdmin = async (req, res) => {
    // Mengambil data sesuai kolom di tabel 'admins'
    const { nama_lengkap, username, password } = req.body;

    // Lakukan hashing pada password sebelum disimpan
    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(password, salt);

    try {
        const admin = await prisma.admins.create({
            data: {
                nama_lengkap: nama_lengkap,
                username: username,
                password_hash: password_hash, // Simpan password yang sudah di-hash
            },
        });
        res.status(201).json(admin);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// 4. Memperbarui data admin
export const updateAdmin = async (req, res) => {
    const { nama_lengkap, username, password } = req.body;

    let password_hash;
    if(password){
        const salt = await bcrypt.genSalt();
        password_hash = await bcrypt.hash(password, salt);
    }

    try {
        const admin = await prisma.admins.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                nama_lengkap: nama_lengkap,
                username: username,
                // Hanya update password jika password baru diberikan
                ...(password_hash && { password_hash: password_hash }) 
            },
        });
        res.status(200).json(admin);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// 5. Menghapus admin
export const deleteAdmin = async (req, res) => {
    try {
        await prisma.admins.delete({
            where: {
                id: Number(req.params.id),
            },
        });
        // Memberi respons pesan sukses, bukan data yang dihapus
        res.status(200).json({ msg: "Admin deleted successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};