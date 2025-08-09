
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose')
const admissionRoutes = require('./routes/admissionRoutes');
const PORT = process.env.PORT || 5001
const app = express();
dotenv.config();
// Middleware
app.use(cors(
  app.use(cors(
  origin: 'https://tulludimturegistration.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
));
  
app.use(express.json());
app.use(morgan('dev'));



mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('COnnected'))
.catch((err) => console.error('failed', err))


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/admissions', admissionRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server runing on port:${PORT}`)
})
