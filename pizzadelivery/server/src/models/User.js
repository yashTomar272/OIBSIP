const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user','admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    
    resetToken: String,
    resetTokenExp: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
