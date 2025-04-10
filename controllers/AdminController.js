const AdminRepository = require('../repositories/AdminRepository');
const bcrypt = require('bcryptjs');

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
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;

      const admin = await AdminRepository.updateAdmin(req.params.id, req.body);
      res.json(admin);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
}

module.exports = AdminController;
