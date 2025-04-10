const DoctorRepository = require('../repositories/DoctorRepository');
const { getFileUrl } = require('../utils/fileUtils');
const supabase = require('../utils/supabaseClient');

class PatientController {
  static async getAll(req, res) {
    try {
      const doctors = await DoctorRepository.getAll(req, res);
      res.json(doctors);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async getDoctorById(req, res) {
    try {
      const doctor = await DoctorRepository.getDoctorById(req.params.id);
      res.json(doctor);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async createDoctor(req, res) {
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
      const doctor = await DoctorRepository.createDoctor(req.body);
      const result = {
        ...doctor.toJSON(),
        fotoUrl: fotoUrl,
      };
      res.status(201).json(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async updateDoctor(req, res) {
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
      const updated = await DoctorRepository.updateDoctor(req.params.id, req.body);
      const result = {
        ...updated.toJSON(),
        ...(fotoUrl && { fotoUrl })
      };
      res.json(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async deleteDoctor(req, res) {
    try {
      const response = await DoctorRepository.deleteDoctor(req.params.id);
      res.json({ response, message: 'Doctor deleted successfully' });
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
      const updated = await DoctorRepository.updateDoctor(req.params.id, {
        foto: fotoUrl,
      });
      const result = {
        ...updated.toJSON(),
        fotoUrl: fotoUrl,
      };
      res.json(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = PatientController;
