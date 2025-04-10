const SpesialisasiRepository = require('../repositories/SpesialisasiRepository');
const { getFileUrl } = require('../utils/fileUtils');
const supabase = require('../utils/supabaseClient');

class SpesialisasiController {
  static async getAll(req, res) {
    try {
      const spesialisasi = await SpesialisasiRepository.getAll(req, res);
      res.json(spesialisasi);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async getSpesialisasiById(req, res) {
    try {
      const spesialisasi = await SpesialisasiRepository.getSpesialisasiById(req.params.id);
      res.json(spesialisasi);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async createSpesialisasi(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const fileBuffer = req.file.buffer;
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const { data, error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(fileName, fileBuffer);

      if (error) {
        throw new Error(error.message);
      }

      const fotoUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;
      req.body.foto = fotoUrl;
      const spesialisasi = await SpesialisasiRepository.createSpesialisasi(req.body);
      const result = {
        ...spesialisasi.toJSON(),
        fotoUrl: fotoUrl,
      };
      res.status(201).json(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async uploadFoto(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      const fileBuffer = req.file.buffer;
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const { data, error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(fileName, fileBuffer);

      if (error) {
        throw new Error(error.message);
      }

      const fotoUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;
      req.body.foto = fotoUrl;
      const updated = await SpesialisasiRepository.updateSpesialisasi(req.params.id, {
        foto: fotoUrl,
      });
      const result = {
        ...updated.toJSON(),
        fotoUrl: fotoUrl
      };
      res.json(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async updateSpesialisasi(req, res) {
    try {
      let fotoUrl;

      if (req.file) {
        const fileBuffer = req.file.buffer;
        const fileName = `${Date.now()}-${req.file.originalname}`;
        const { data, error } = await supabase.storage
          .from(process.env.SUPABASE_BUCKET)
          .upload(fileName, fileBuffer);

        if (error) {
          throw new Error(error.message);
        }
        fotoUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;
        req.body.foto = fotoUrl;
      }

      const updated = await SpesialisasiRepository.updateSpesialisasi(req.params.id, req.body);
      const result = {
        ...updated.toJSON(),
        ...(fotoUrl && { fotoUrl })
      };
      res.json(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async deleteSpesialisasi(req, res) {
    try {
      const response = await SpesialisasiRepository.deleteSpesialisasi(req.params.id);
      res.json({ response, message: 'Spesialisasi deleted successfully' });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = SpesialisasiController;
