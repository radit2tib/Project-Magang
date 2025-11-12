import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Impor semua file rute yang dibutuhkan
import ProductRoute from "./routes/ProductRoute.js";
import AuthRoute from "./routes/AuthRoutes.js";
import MahasiswaRoute from "./routes/MahasiswaRoute.js";

dotenv.config();

const app = express();

// --- KONFIGURASI CORS EKSPLISIT ---
// Ini memberi tahu server untuk secara spesifik mengizinkan
// permintaan dari alamat frontend Anda.
const corsOptions = {
  origin: 'http://localhost:5173', // Pastikan port ini sesuai dengan port frontend Anda
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200 
};

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