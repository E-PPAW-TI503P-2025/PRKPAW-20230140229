// routes/presensi.js
const express = require('express');
const router = express.Router(); // <--- Variabel 'router' didefinisikan di sini
const presensiController = require('../controllers/presensiController');
const { updatePresensiValidation } = require('../middleware/validationMiddleware'); // Asumsi path

// Asumsi middleware lainnya
const { addUserData } = require('../middleware/permissionMiddleware'); 
router.use(addUserData);

// Semua definisi router HARUS ada di sini:
router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);
router.put('/:id', updatePresensiValidation, presensiController.updatePresensi); // <--- Baris yang menyebabkan error
router.delete('/:id', presensiController.deletePresensi);

module.exports = router;