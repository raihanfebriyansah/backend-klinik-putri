const express = require('express');
const AdminController = require('../controllers/AdminController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const authenticateToken = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: 'uploads/profil',
  filename: (req, file, cb) => {
    const baseName = Date.now() + '-' + file.originalname;
    const fullPath = path.join('uploads/profil', baseName);

    if (fs.existsSync(fullPath)) {
      return cb(new Error('File already exists'), null);
    }

    cb(null, baseName);
  }
});
const upload = multer({ storage });

const router = express.Router();
router.use(authenticateToken);


router.get('/list', AdminController.getAllAdmin);
router.post('/create', AdminController.createAdmin);
router.post('/update/:id', upload.single('foto'), AdminController.updateAdmin);

module.exports = router;