const PatientRepository = require('../repositories/PatientRepository');
const { getFileUrl } = require('../utils/fileUtils');
const supabase = require('../utils/supabaseClient');

class PatientController {
  static async getAll(req, res) {
    try {
      const patients = await PatientRepository.getAll(req, res);
      res.json(patients);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async getPatientById(req, res) {
    try {
      const patient = await PatientRepository.getPatientById(req.params.id);
      if (patient) {
        const result = {
          ...patient.toJSON(),
          fotoUrl: getFileUrl(patient.foto, req, 'patient')
        };
        res.json(result);
      } else {
        res.status(404).json({ message: 'patient not found' });
      }
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
      const updated = await PatientRepository.updatePatient(req.params.id, { foto: fotoUrl });

      res.json({
        ...updated.toJSON(),
        fotoUrl,
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = PatientController;
