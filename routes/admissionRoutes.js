const express = require('express');
const router = express.Router();
const { 
  submitAdmission, 
  getAdmissions, 
  getAdmission, 
  verifyPayment,
  updateAdmissionStatus 
} = require('../controllers/admissionController');
const upload = require('../middleware/upload');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.post('/', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'birthCertificate', maxCount: 1 },
  { name: 'transcript', maxCount: 1 },
  { name: 'transferCertificate', maxCount: 1 },
  { name: 'paymentReceipt', maxCount: 1 }
]), submitAdmission);

// Protected admin routes
router.get('/', protect, admin, getAdmissions);
router.get('/:id', protect, admin, getAdmission);
router.put('/:id/verify-payment', protect, admin, verifyPayment);
router.put('/:id/status', protect, admin, updateAdmissionStatus);

module.exports = router;