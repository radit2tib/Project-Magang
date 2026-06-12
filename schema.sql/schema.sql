-- KODE UNTUK MEMBUAT STRUKTUR TABEL (DDL)

CREATE TABLE admins (
    id_admin SERIAL PRIMARY KEY,
    nama_lengkap VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE mahasiswa (
    nim VARCHAR(20) PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    angkatan INTEGER,
    jenis_kelamin VARCHAR(20),
    departemen VARCHAR(100),
    unit_bisnis VARCHAR(100),
    is_scholar BOOLEAN DEFAULT FALSE,
    english_proficiency VARCHAR(50),
    riwayat_penyakit TEXT,
    is_kacamata BOOLEAN DEFAULT FALSE,
    judul_kp TEXT,
    judul_ta TEXT,
    nama_mentor VARCHAR(100),
    nama_co_mentor VARCHAR(100),
    file_kp TEXT,
    file_ta TEXT,
    nilai_mentor REAL,
    nilai_penguji REAL,
    nilai_akhir REAL,
    komentar_revisi TEXT,
    final_graded_by INTEGER REFERENCES admins(id_admin),
    waktu_penilaian_akhir TIMESTAMP WITH TIME ZONE
);

CREATE TABLE tugas (
    id_tugas SERIAL PRIMARY KEY,
    nim_mahasiswa VARCHAR(20) REFERENCES mahasiswa(nim) ON DELETE CASCADE,
    nomor_tugas INTEGER NOT NULL,
    judul_tugas VARCHAR(255) NOT NULL,
    file_laporan TEXT,
    nilai_tugas REAL,
    status_approval VARCHAR(20) DEFAULT 'Pending',
    admin_id_penilai INTEGER REFERENCES admins(id_admin),
    waktu_approval TIMESTAMP WITH TIME ZONE,
    komentar_admin TEXT
);