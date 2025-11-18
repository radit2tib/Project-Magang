import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import fs from 'fs'; // Diperlukan untuk menghapus file

const prisma = new PrismaClient();

// =======================================================
// FUNGSI BARU UNTUK UPLOAD FILE
// =======================================================

// --- [FUNGSI BARU] UNTUK MENANGANI UPLOAD FILE PROYEK ---
export const uploadProyekFiles = async (req, res) => {
    const nim = req.user.nim;

    // 1. Cek apakah ada file yang diupload
    if (!req.files) {
        return res.status(400).json({ message: "Tidak ada file yang diupload." });
    }

    // --- [DEBUG 1] Tampilkan file yang diterima Multer ---
    console.log("===== DEBUG UPLOAD PROYEK =====");
    console.log("NIM:", nim);
    console.log("req.files:", JSON.stringify(req.files, null, 2));

    // 2. Siapkan data untuk diupdate ke DB
    const dataToUpdate = {};
    if (req.files['fileLaporanKP']) {
        // 'req.files.fileLaporanKP[0].path' berisi "uploads/laporan_kp/NIM.pdf"
        // Perbaikan: Ganti backslash Windows dengan forward slash
        dataToUpdate.fileLaporanKp = req.files['fileLaporanKP'][0].path.replace(/\\/g, "/");
    }
    if (req.files['fileLaporanTA']) {
        // Perbaikan: Ganti backslash Windows dengan forward slash
        dataToUpdate.fileLaporanTa = req.files['fileLaporanTA'][0].path.replace(/\\/g, "/");
    }

    // --- [DEBUG 2] Tampilkan data yang akan dikirim ke Prisma ---
    console.log("dataToUpdate (akan disimpan ke DB):", JSON.stringify(dataToUpdate, null, 2));

    // 3. Jika tidak ada file yang relevan
    if (Object.keys(dataToUpdate).length === 0) {
        return res.status(400).json({ message: "Nama field file tidak sesuai." });
    }

    // 4. Update path file ke database
    try {
        await prisma.mahasiswa.update({
            where: { nim: nim },
            data: dataToUpdate
        });

        // --- [DEBUG 3] Konfirmasi sukses ---
        console.log("Prisma update SUKSES.");

        res.status(200).json({ message: "File laporan berhasil diupload." });
    } catch (error) {
        console.error("Error saat update path file proyek:", error);
        res.status(500).json({ message: "Gagal menyimpan path file ke database." });
    }
};

// --- [FUNGSI BARU] UNTUK MENANGANI UPLOAD FILE TUGAS ---
export const uploadTugasFile = async (req, res) => {
    const nim = req.user.nim;
    const { taskNumber, judulTugas } = req.body;

    // 1. Validasi dasar
    if (!taskNumber || !judulTugas) {
        return res.status(400).json({ message: "Nomor tugas dan Judul wajib diisi." });
    }
    if (!req.files || !req.files['fileLaporan']) {
         return res.status(400).json({ message: "File Laporan wajib diisi." });
    }

    // --- [DEBUG 1] Tampilkan file yang diterima Multer ---
    console.log("===== DEBUG UPLOAD TUGAS =====");
    console.log("NIM:", nim);
    console.log("req.body:", JSON.stringify(req.body, null, 2));
    console.log("req.files:", JSON.stringify(req.files, null, 2));

    // 2. Dapatkan path file
    // Perbaikan: Ganti backslash Windows dengan forward slash
    const pathLaporan = req.files['fileLaporan'][0].path.replace(/\\/g, "/");
    const pathPresentasi = req.files['filePresentasi'] ? req.files['filePresentasi'][0].path.replace(/\\/g, "/") : null;

    // 3. Siapkan data untuk DB
    const dataTugas = {
        nim_mahasiswa: nim,
        taskNumber: taskNumber,
        judulTugas: judulTugas,
        fileLaporan: pathLaporan,
        filePresentasi: pathPresentasi
    };

    // --- [DEBUG 2] Tampilkan data yang akan dikirim ke Prisma ---
    console.log("dataTugas (akan disimpan ke DB):", JSON.stringify(dataTugas, null, 2));

    // 4. Gunakan 'upsert' untuk INSERT TUGAS BARU atau UPDATE TUGAS LAMA
    try {
        await prisma.tugas.upsert({
            where: {
                // Ini membutuhkan UNIQUE CONSTRAINT di DB: @@unique([nim_mahasiswa, taskNumber])
                nim_mahasiswa_taskNumber: {
                    nim_mahasiswa: nim,
                    taskNumber: taskNumber
                }
            },
            update: dataTugas, // Data jika di-update
            create: dataTugas  // Data jika di-create
        });

        // --- [DEBUG 3] Konfirmasi sukses ---
        console.log("Prisma upsert SUKSES.");

        res.status(200).json({ message: "Tugas " + taskNumber + " berhasil diupload." });

    } catch (error) {
         console.error("Error saat upsert tugas:", error);
         if(error.code === 'P2002') {
             // Ini seharusnya tidak terjadi jika 'upsert' disetup dengan benar
             return res.status(409).json({ message: "Terjadi duplikasi data." });
         }
         res.status(500).json({ message: "Gagal menyimpan tugas ke database." });
    }
};


// =======================================================
// FUNGSI LAMA (CRUD & PROFIL)
// =======================================================

// --- [PERBAIKAN] FUNGSI UNTUK MENGAMBIL SEMUA DATA MAHASISWA ---
export const getAllMahasiswa = async (req, res) => {
  try {
    // 1. Hapus 'select'. Ambil SEMUA data.
    const allMahasiswa = await prisma.mahasiswa.findMany({
      orderBy: { nama: 'asc' },
    });

    // 2. Hapus password secara manual SETELAH mengambil data
    const safeData = allMahasiswa.map(mhs => {
      delete mhs.password;
      return mhs;
    });

    res.status(200).json(safeData);

  } catch (error) {
    console.error("Error saat mengambil data semua mahasiswa:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

// --- [PERBAIKAN] FUNGSI UNTUK MEMPERBARUI MAHASISWA (OLEH ADMIN) ---
export const updateMahasiswa = async (req, res) => {
    const { nim } = req.params; 
    let dataToUpdate = req.body; 

    try {
        // 1. Penanganan Password (Lebih Aman)
        if (dataToUpdate.password && dataToUpdate.password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, salt);
        } else {
            delete dataToUpdate.password;
        }

        // 2. Konversi Tipe Data Boolean
        if (dataToUpdate.pakaiKacamata !== undefined) {
            dataToUpdate.pakaiKacamata = (dataToUpdate.pakaiKacamata === 'true' || dataToUpdate.pakaiKacamata === true);
        }
        if (dataToUpdate.isProfileComplete !== undefined) {
            dataToUpdate.isProfileComplete = (dataToUpdate.isProfileComplete === 'true' || dataToUpdate.isProfileComplete === true);
        }
  
        // 3. Konversi Tipe Data Angka
        if (dataToUpdate.angkatan) {
            dataToUpdate.angkatan = parseInt(dataToUpdate.angkatan, 10);
        }

        const updatedMahasiswa = await prisma.mahasiswa.update({
            where: { nim: nim }, 
            data: dataToUpdate 
        });

        delete updatedMahasiswa.password;
        res.status(200).json({ message: "Data mahasiswa berhasil diperbarui", data: updatedMahasiswa });

    } catch (error) {
        console.error("ERROR BACKEND SAAT UPDATE:", error); 
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Mahasiswa dengan NIM tersebut tidak ditemukan." });
        }
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
                // TAMBAHAN: Ambil path file yang sudah diupload
                fileLaporanKp: true, 
                fileLaporanTa: true,
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
    let dataToUpdate = req.body; 

    delete dataToUpdate.password; 
    // TAMBAHAN: Hapus field file, karena form ini hanya untuk update teks
    // Upload file ditangani oleh 'uploadProyekFiles'
    delete dataToUpdate.fileLaporanKp;
    delete dataToUpdate.fileLaporanTa;

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
        // Logika untuk menghapus file fisik (opsional tapi disarankan)
        // const mhs = await prisma.mahasiswa.findUnique({ where: { nim } });
        // if (mhs && mhs.fileLaporanKp) fs.unlinkSync(mhs.fileLaporanKp);
        // if (mhs && mhs.fileLaporanTa) fs.unlinkSync(mhs.fileLaporanTa);
        // Anda juga harus menghapus file tugas terkait dari tabel 'Tugas'

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