const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });
}

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email,address, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, address, password: hash, role: role || 'user' });

  // email verify token
  const verifyToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  const link = `${process.env.CLIENT_URL}/Verify?token=${verifyToken}`;
  await sendEmail({
    to: email,
    subject: 'Verify your email',
    html: `<p>Hi ${name}, verify your email by clicking <a href="${link}">here</a>. This link expires in 24 hours.</p>`
  });

  res.json({ message: 'Registered. Check your email to verify.' });
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;   // ✅ token frontend se milega
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // ✅ token decode hoga
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { isVerified: true },
      { new: true }
    );

    if (!user) return res.status(400).json({ message: 'Invalid token' });

    res.json({ message: 'Email verified' });
  } catch (e) {
    res.status(400).json({ message: 'Invalid/Expired token' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log("username=>",user);

  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
  if (!user.isVerified) return res.status(403).json({ message: 'Verify your email first' });

  const token = signToken(user._id);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

exports.forgot = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ message: 'If email exists, reset mail sent' });

  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  user.resetToken = resetToken;
  user.resetTokenExp = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  const link = `${process.env.CLIENT_URL}/ResetPassword?token=${resetToken}`;
  await sendEmail({ to: email, subject: 'Reset your password', html: `<p> Reset your password this is your Reset link: <a href="${link}">Reset</a></p>` });
  res.json({ message: 'Reset link sent if email exists' });
};

exports.reset = async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.resetToken !== token || user.resetTokenExp < new Date()) {
      return res.status(400).json({ message: 'Invalid token' });
    }
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined; user.resetTokenExp = undefined;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (e) {
    res.status(400).json({ message: 'Invalid/Expired token' });
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};
