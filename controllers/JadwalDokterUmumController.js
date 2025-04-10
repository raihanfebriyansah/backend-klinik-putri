const JadwalDokterUmumRepository = require('../repositories/JadwalDokterUmumRepository');

class JadwalDokterUmumController {
  static async getAll(req, res) {
    try {
      const jadwalDokterUmum = await JadwalDokterUmumRepository.getAll(req, res);
      res.json(jadwalDokterUmum);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async getJadwalDokterUmumById(req, res) {
    try {
      const jadwalDokterUmum = await JadwalDokterUmumRepository.getJadwalDokterUmumById(req.params.id);
      res.json(jadwalDokterUmum);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async createJadwalDokterUmum(req, res) {
    try {
      const jadwalDokterUmum = await JadwalDokterUmumRepository.create(req.body);
      res.status(201).json(jadwalDokterUmum);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async updateJadwalDokterUmum(req, res) {
    try {
      const jadwalDokterUmum = await JadwalDokterUmumRepository.update(req.params.id, req.body);
      res.json(jadwalDokterUmum);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async deleteJadwalDokterUmum(req, res) {
    try {
      const jadwalDokterUmum = await JadwalDokterUmumRepository.delete(req.params.id);
      res.json(jadwalDokterUmum);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = JadwalDokterUmumController;
