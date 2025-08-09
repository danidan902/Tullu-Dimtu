const Admission = require('../models/Admission');
const fs = require('fs');
const path = require('path');

// @desc    Submit admission form
// @route   POST /api/admissions
// @access  Public
exports.submitAdmission = async (req, res) => {
  try {
    // Validate required files were uploaded
    if (!req.files) {
      return res.status(400).json({ success: false, message: 'Files are required' });
    }

    const requiredFiles = ['photo', 'birthCertificate', 'transcript', 'paymentReceipt'];
    for (const file of requiredFiles) {
      if (!req.files[file]) {
        return res.status(400).json({ 
          success: false, 
          message: `${file.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required` 
        });
      }
    }

    const {
      firstName, lastName, gender, dob, nationality, religion,
      applyingGrade, lastSchool, lastGrade, gradeAverage,
      parentName, relationship, parentPhone, parentEmail, parentOccupation, address,
      
    } = req.body;

    // Validate merchant ID
    // if (!['150120', '250230'].includes(merchantId)) {
    //   return res.status(400).json({ 
    //     success: false, 
    //     message: 'Invalid merchant ID. Use 150120 for Telebirr or 250230 for CBE Birr' 
    //   });
    // }

    const admission = new Admission({
      firstName,
      lastName,
      gender,
      dob,
      nationality,
      religion,
      photo: req.files.photo[0].filename,
      applyingGrade,
      lastSchool,
      lastGrade,
      gradeAverage,
      parentName,
      relationship,
      parentPhone,
      parentEmail,
      parentOccupation,
      address,
      birthCertificate: req.files.birthCertificate[0].filename,
      transcript: req.files.transcript[0].filename,
      transferCertificate: req.files.transferCertificate ? req.files.transferCertificate[0].filename : null,
      paymentReceipt: req.files.paymentReceipt[0].filename,
      // merchantId
    });

    await admission.save();

    res.status(201).json({
      success: true,
      data: admission
    });

  } catch (err) {
    console.error(err);
    
    // Clean up uploaded files if error occurs
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          const filePath = path.join(__dirname, '../uploads', file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      });
    }

    res.status(500).json({ 
      success: false, 
      message: err.message || 'Server error' 
    });
  }
};

// @desc    Get all admissions
// @route   GET /api/admissions
// @access  Private (Admin)
exports.getAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true, 
      count: admissions.length, 
      data: admissions 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get single admission
// @route   GET /api/admissions/:id
// @access  Private (Admin)
exports.getAdmission = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    
    if (!admission) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admission not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: admission 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Verify payment
// @route   PUT /api/admissions/:id/verify-payment
// @access  Private (Admin)
exports.verifyPayment = async (req, res) => {
  try {
    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      { 
        paymentVerified: true,
        verifiedBy: req.user.id,
        verifiedAt: Date.now()
      },
      { new: true }
    );
    
    if (!admission) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admission not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: admission 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Update admission status
// @route   PUT /api/admissions/:id/status
// @access  Private (Admin)
exports.updateAdmissionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status value' 
      });
    }
    
    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!admission) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admission not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: admission 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};