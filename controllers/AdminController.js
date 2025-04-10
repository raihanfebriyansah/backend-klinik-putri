const AdminRepository = require('../repositories/AdminRepository');
const bcrypt = require('bcryptjs');
const { getFileUrl } = require('../utils/fileUtils');
const supabase = require('../utils/supabaseClient');

class AdminController {
  static async getAllAdmin(req, res) {
    try {
      const admins = await AdminRepository.getAllAdmin(req, res);
      res.json(admins);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async getAdminById(req, res) {
    try {
      const admin = await AdminRepository.getAdminById(req.params.id);
      res.json(admin);
    } catch (error) {
      res.status(404).send(error.message);
    }
  }

  static async createAdmin(req, res) {
    try {
      const admin = await AdminRepository.createAdmin(req.body);
      res.status(201).json(admin);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  static async updateAdmin(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).send('Invalid ID provided.');
      }

      const fileBuffer = req.file?.buffer;
      const fileName = req.file ? `${Date.now()}-${req.file.originalname}` : null;

      let fotoUrl = null;
      if (fileBuffer && fileName) {
        const { data, error } = await supabase.storage
          .from(process.env.SUPABASE_BUCKET)
          .upload(fileName, fileBuffer);

        if (error) {
          throw new Error(error.message);
        }

        fotoUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;
      }

      const updateData = { ...req.body };
      if (fotoUrl) {
        updateData.foto = fotoUrl;
      }

      if (req.body.password) {
        updateData.password = await bcrypt.hash(req.body.password, 10);
      }

      const admin = await AdminRepository.updateAdmin(id, updateData);

      res.json({
        ...admin.toJSON(),
        fotoUrl: admin.foto,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
}

module.exports = AdminController;
