const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

function signToken(id) {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES || "7d",
    }
  );
}


// =========================
// REGISTER
// =========================

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const {
      name,
      email,
      address,
      password,
      role,
    } = req.body;

    // Check existing user
    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      address,
      password: hash,
      role: role || "user",
    });

    // Create verification token
    const verifyToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const link =
      `https://pizzadelivery-ashy.vercel.app/Verify?token=${verifyToken}`;


    // Send verification email
    try {
      await sendEmail({
        to: email,

        subject: "Verify your Pizza App email",

        text: `Hi ${name},

Thanks for registering with Pizza App.

Please verify your email address using the link below:

${link}

This verification link will expire in 24 hours.

If you did not create a Pizza App account, you can safely ignore this email.

Thanks,
Pizza App`,

        html: `
          <!DOCTYPE html>
          <html>
            <body style="
              margin:0;
              padding:0;
              background:#f5f5f5;
              font-family:Arial,sans-serif;
            ">

              <div style="
                max-width:600px;
                margin:40px auto;
                background:#ffffff;
                padding:30px;
                border-radius:10px;
              ">

                <h2>Welcome to Pizza App 🍕</h2>

                <p>Hi ${name},</p>

                <p>
                  Thanks for registering with Pizza App.
                  Please verify your email address to activate your account.
                </p>

                <div style="
                  text-align:center;
                  margin:30px 0;
                ">

                  <a
                    href="${link}"
                    style="
                      display:inline-block;
                      padding:12px 24px;
                      background:#e63946;
                      color:#ffffff;
                      text-decoration:none;
                      border-radius:6px;
                      font-weight:bold;
                    "
                  >
                    Verify My Email
                  </a>

                </div>

                <p>
                  This verification link will expire in
                  <strong>24 hours</strong>.
                </p>

                <p>
                  If you did not create a Pizza App account,
                  you can safely ignore this email.
                </p>

                <p>
                  Thanks,<br>
                  <strong>Pizza App</strong>
                </p>

              </div>

            </body>
          </html>
        `,
      });

    } catch (emailError) {

      // Email send failed, remove newly created user
      await User.findByIdAndDelete(user._id);

      console.error(
        "❌ Verification email failed:",
        emailError.message
      );

      return res.status(500).json({
        message: "Unable to send verification email",
      });
    }


    return res.status(201).json({
  message: "Registration successful! Check email. If not found, check Spam/Junk.",
});

  } catch (err) {

    console.error("❌ Register error:", err);

    return res.status(500).json({
      message: "Server error during registration",
    });
  }
};


// =========================
// VERIFY EMAIL
// =========================

exports.verifyEmail = async (req, res) => {
  try {

    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        message: "Verification token is required",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findByIdAndUpdate(
      decoded.id,
      {
        isVerified: true,
      },
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    return res.json({
      message: "Email verified",
    });

  } catch (err) {

    return res.status(400).json({
      message: "Invalid/Expired token",
    });
  }
};


// =========================
// LOGIN
// =========================

exports.login = async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const ok = await bcrypt.compare(
      password,
      user.password
    );

    if (!ok) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Verify your email first",
      });
    }

    const token = signToken(user._id);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {

    console.error("❌ Login error:", err);

    return res.status(500).json({
      message: "Server error during login",
    });
  }
};


// =========================
// FORGOT PASSWORD
// =========================

exports.forgot = async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    // Don't reveal whether email exists
    if (!user) {
      return res.json({
        message: "If email exists, reset mail sent",
      });
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    user.resetToken = resetToken;

    user.resetTokenExp = new Date(
      Date.now() + 60 * 60 * 1000
    );

    await user.save();

    const link =
      `https://pizzadelivery-ashy.vercel.app/ResetPassword?token=${resetToken}`;


    await sendEmail({

      to: email,

      subject: "Reset your Pizza App password",

      text: `Hi ${user.name},

We received a request to reset your Pizza App password.

Reset your password using the link below:

${link}

This link will expire in 1 hour.

If you did not request a password reset, you can safely ignore this email.

Thanks,
Pizza App`,

      html: `
        <h2>Reset your Pizza App password</h2>

        <p>Hi ${user.name},</p>

        <p>
          We received a request to reset your Pizza App password.
        </p>

        <p>
          Click the button below to reset your password:
        </p>

        <p>
          <a
            href="${link}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#e63946;
              color:white;
              text-decoration:none;
              border-radius:6px;
              font-weight:bold;
            "
          >
            Reset Password
          </a>
        </p>

        <p>
          This link will expire in
          <strong>1 hour</strong>.
        </p>

        <p>
          If you did not request a password reset,
          you can safely ignore this email.
        </p>

        <p>
          Thanks,<br>
          <strong>Pizza App</strong>
        </p>
      `,
    });

    return res.json({
      message: "Reset link sent if email exists",
    });

  } catch (err) {

    console.error("❌ Forgot password error:", err);

    return res.status(500).json({
      message: "Unable to send reset email",
    });
  }
};


// =========================
// RESET PASSWORD
// =========================

exports.reset = async (req, res) => {
  try {

    const {
      token,
      password,
    } = req.body;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);

    if (
      !user ||
      user.resetToken !== token ||
      user.resetTokenExp < new Date()
    ) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    user.password = await bcrypt.hash(
      password,
      10
    );

    user.resetToken = undefined;
    user.resetTokenExp = undefined;

    await user.save();

    return res.json({
      message: "Password reset successful",
    });

  } catch (err) {

    return res.status(400).json({
      message: "Invalid/Expired token",
    });
  }
};


// =========================
// ME
// =========================

exports.me = async (req, res) => {

  res.json({
    user: req.user,
  });

};