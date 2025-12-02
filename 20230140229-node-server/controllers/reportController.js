const { Presensi, User } = require("../models");
const { Op } = require("sequelize");
const timeZone = "Asia/Jakarta";

const getDailyReport = async (req, res) => {
  try {
    const { tanggalMulai, tanggalSelesai, nama } = req.query;
    let whereClause = {};
    let userWhereClause = {};

    if (nama) {
      userWhereClause.nama = {
        [Op.like]: `%${nama}%`
      };
    }

    if (tanggalMulai && tanggalSelesai) {
      const dateStart = new Date(tanggalMulai);
      const dateEnd = new Date(tanggalSelesai);
         
      dateStart.setHours(0, 0, 0, 0); 
    
      dateEnd.setHours(23, 59, 59, 999); 

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
      include: [{
        model: User,
        as: 'user',
        where: userWhereClause,
        attributes: ['id', 'nama', 'email', 'role']
      }],
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