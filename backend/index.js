import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Impor semua file rute yang dibutuhkan
import ProductRoute from "./routes/ProductRoute.js";
import AuthRoute from "./routes/AuthRoutes.js";
import MahasiswaRoute from "./routes/MahasiswaRoute.js";

dotenv.config();

const app = express();

// --- [PERBAIKAN] KONFIGURASI CORS ---

// 1. Buat daftar semua alamat frontend yang diizinkan
const allowedOrigins = [
  'http://localhost:5173', // Alamat dev lokal Anda
]

// 2. Ubah 'origin' dari string menjadi fungsi dinamis
const corsOptions = {
  origin: function (origin, callback) {
    // Izinkan jika:
    // 1. Origin ada di dalam 'allowedOrigins'
    // 2. Tidak ada origin (misal: Postman atau server-to-server)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Alamat ini tidak diizinkan oleh CORS'));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200 
};
// --- Akhir Perbaikan ---

app.use(cors(corsOptions));
app.use(express.json());

// Daftarkan semua rute ke aplikasi Express
app.use(ProductRoute);
app.use(AuthRoute);
app.use('/mahasiswa', MahasiswaRoute);

app.listen(process.env.APP_PORT, ()=>{
    console.log(`Server up and running on port ${process.env.APP_PORT}...`);
});

export default app;