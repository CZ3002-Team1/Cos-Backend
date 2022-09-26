const express = require("express");
const router = express.Router();
const Otp = require("../model/Otp");
const User = require("../model/User");
require("dotenv").config();
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sendMail = async (subject, text, receiverEmail) => {
  const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PW,
    },
  });

  const mailDetails = {
    from: process.env.GMAIL_USER,
    to: receiverEmail,
    subject: subject,
    html: text,
  };

  try {
    await mailTransporter.sendMail(mailDetails);
  } catch (err) {
    console.log(err);
  }
};

const generateAccessToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "30d" });
};

/**
 * @swagger
 * api/auth/createOtp:
 *   post:
 *     summary: Create OTP and send to email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Otp created Successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Email is already registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 */
router.post("/createOtp", async (req, res) => {
  const email = req.body.Email;

  const isExisting = await User.findOne({
    Email: email,
  });

  if (isExisting) {
    res.json({
      success: false,
      message: "Email already registered and exists",
    });

    return;
  }

  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const subject = "OTP for COS Registration";
  const text = `
      <div
        class="container"
        style="max-width: 90%; margin: auto; padding-top: 20px"
      >
        <h2>Welcome to COS.</h2>
        <h4>You are officially In ✔</h4>
        <p style="margin-bottom: 30px;">Please enter the sign up OTP to get started</p>
        <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp}</h1>
   </div>`;

  await sendMail(subject, text, email);

  await Otp.findOneAndUpdate(
    { Email: email },
    {
      Email: email,
      Otp: otp,
    },
    {
      upsert: true,
    }
  );

  res.json({
    success: true,
    message: "OTP has been sent to your email",
  });
});

/**
 * @swagger
 * api/auth/verifyOtp:
 *   post:
 *     summary: Verify that OTP is correct
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *               Otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Otp verified Successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Otp is wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 */
router.post("/verifyOtp", async (req, res) => {
  const email = req.body.Email;
  const otp = req.body.Otp;

  const verify = await Otp.findOne({
    Email: email,
    Otp: otp,
  });

  if (!verify) {
    res.json({
      success: false,
      message: "Invalid Otp",
    });

    return;
  }

  await Otp.deleteOne({ Email: email });

  res.json({
    success: true,
    message: "Otp verified",
  });
});

/**
 * @swagger
 * api/auth/register:
 *   post:
 *     summary: Register user and return jwt token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *               Name:
 *                 type: string
 *               PhoneNumber:
 *                 type: string
 *               Password:
 *                 type: string
 *     responses:
 *       200:
 *         description: New user registered.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 */
router.post("/register", async (req, res) => {
  const { Email, Password, Name, PhoneNumber } = req.body;

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(Password, saltRounds);

  const user = new User({
    Email: Email,
    Password: hashedPassword,
    Name: Name,
    PhoneNumber: PhoneNumber,
  });

  await user.save();

  const jwtToken = generateAccessToken({
    Email: Email,
    Name: Name,
    PhoneNumber: PhoneNumber,
  });

  res.json({
    success: true,
    message: "User registered succesfully",
    token: jwtToken,
  });
});

/**
 * @swagger
 * api/auth/login:
 *   post:
 *     summary: Login user and return jwt token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *               Password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User login.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Incorrect login details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 */
router.post("/login", async (req, res) => {
  const { Email, Password } = req.body;

  const existingUser = await User.findOne({
    Email: Email,
  });

  if (!existingUser) {
    res.json({
      success: false,
      message: "Invalid Email or Password",
    });

    return;
  }

  const hashedPassword = existingUser.Password;
  const result = await bcrypt.compare(Password, hashedPassword);

  if (!result) {
    res.json({
      success: false,
      message: "Invalid Email or Password",
    });

    return;
  }

  const jwtToken = generateAccessToken({
    Email: Email,
    Name: existingUser.Name,
    PhoneNumber: existingUser.PhoneNumber,
  });

  res.json({
    success: true,
    message: "User login succesfully",
    token: jwtToken,
  });
});

module.exports = router;
