const { body, validationResult } = require('express-validator');

// Middleware untuk memproses hasil validasi
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  // HTTP 422 Unprocessable Entity
  return res.status(422).json({
    message: "Validasi input gagal.",
    errors: extractedErrors,
  });
};

// Aturan validasi untuk PUT /api/presensi/:id
const updatePresensiValidation = [
    // checkIn dan checkOut bersifat opsional (.optional()), tetapi jika ada, harus format ISO 8601
    body('checkIn')
        .optional()
        .isISO8601()
        .withMessage('Format checkIn harus berupa tanggal dan waktu ISO 8601 yang valid (misalnya 2024-01-01T08:00:00Z).'),

    body('checkOut')
        .optional()
        .isISO8601()
        .withMessage('Format checkOut harus berupa tanggal dan waktu ISO 8601 yang valid.'),

    // Periksa apakah ada salah satu field yang dikirim sebelum menjalankan validasi
    body().custom((value, { req }) => {
      const { checkIn, checkOut, nama } = req.body;
      if (checkIn === undefined && checkOut === undefined && nama === undefined) {
        throw new Error('Request body harus berisi data yang valid untuk diupdate (checkIn, checkOut, atau nama).');
      }
      return true;
    }),

    validate
];

module.exports = {
    updatePresensiValidation
};