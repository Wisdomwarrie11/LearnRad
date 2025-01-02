// controllers/authController.js
import User from "../models/User.js";
import nodemailer from "nodemailer";

export const registerStudent = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    // Create new user
    const newUser = new User({ name, email, password, role: "student", isVerified: false });
    await newUser.save();

    // Send verification email
    const verificationLink = `http://localhost:3000/verify-email/${newUser._id}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Registration successful! Verify your email." });
  } catch (error) {
    console.error("Error registering student:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
