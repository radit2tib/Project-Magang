import express from "express";
// Import fungsi-fungsi baru untuk admin
import {
    getAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin
} from "../controllers/ProductController.js";

const router = express.Router();

// Ganti rute dari '/products' menjadi '/admins' dan gunakan fungsi yang sesuai
router.get('/admins', getAdmins);
router.get('/admins/:id', getAdminById);
router.post('/admins', createAdmin);
router.patch('/admins/:id', updateAdmin);
router.delete('/admins/:id', deleteAdmin);

export default router;