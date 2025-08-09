const mongoose = require('mongoose');

const AdmissionSchema = new mongoose.Schema({
  // Personal Details
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  nationality: { type: String, default: 'Ethiopian' },
  religion: { type: String },
  photo: { type: String, required: true },
  
  // Academic Information
  applyingGrade: { type: String, required: true },
  lastSchool: { type: String, required: true },
  lastGrade: { type: String, required: true },
  gradeAverage: { type: String },
  
  // Parent/Guardian Information
  parentName: { type: String, required: true },
  relationship: { type: String, required: true },
  parentPhone: { type: String, required: true },
  parentEmail: { type: String, required: true },
  parentOccupation: { type: String },
  address: { type: String, required: true },
  
  // Documents
  birthCertificate: { type: String, required: true },
  transcript: { type: String, required: true },
  transferCertificate: { type: String },
  
  // Payment Information (Simplified)
  paymentReceipt: { type: String, required: true },
  // merchantId: { type: String, required: true, enum: ['150120', '250230'] }, // Telebirr or CBE Birr
  paymentVerified: { type: Boolean, default: false },
  
  // Status
  status: { type: String, default: 'pending', enum: ['pending', 'reviewed', 'accepted', 'rejected'] },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admission', AdmissionSchema);