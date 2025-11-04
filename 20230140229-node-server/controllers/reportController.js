const { Presensi } = require("../models"); // Pastikan path model benar
const { Op } = require("sequelize"); 
const timeZone = "Asia/Jakarta"; // Asumsi timeZone

const getDailyReport = async (req, res) => {
  try {
    const { tanggalMulai, tanggalSelesai } = req.query;
    let whereClause = {};

    if (tanggalMulai && tanggalSelesai) {
      const dateStart = new Date(tanggalMulai);
      const dateEnd = new Date(tanggalSelesai);
      
      // Atur tanggalMulai ke awal hari (00:00:00.000)
      dateStart.setHours(0, 0, 0, 0); 

      // Atur tanggalSelesai ke akhir hari (23:59:59.999)
      dateEnd.setHours(23, 59, 59, 999); 

      // Gunakan Op.between pada kolom checkIn
      whereClause.checkIn = {
        [Op.between]: [dateStart, dateEnd],
      };
    } else if (tanggalMulai || tanggalSelesai) {
        return res.status(400).json({ 
            message: "Harap berikan kedua tanggalMulai dan tanggalSelesai, atau tidak sama sekali." 
        });
    }

    const dailyReport = await Presensi.findAll({
      where: whereClause,
      order: [['checkIn', 'ASC']],
    });

    res.json({
      message: "Laporan presensi berhasil diambil.",
      totalRecords: dailyReport.length,
      data: dailyReport,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
        message: "Terjadi kesalahan pada server", 
        error: error.message 
    });
  }
};

module.exports = {
  getDailyReport,
};