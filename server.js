require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer"); s
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const sanitizeHtml = require('sanitize-html');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

app.use(limiter);

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

app.post("/send-email", async (req, res) => {
  try {
    const { email, image } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).send("Invalid email address");
    }

    const sanitizedEmail = sanitizeHtml(email);
    const sanitizedImage = sanitizeHtml(image);

    if (!sanitizedImage.includes('base64,')) {
      return res.status(400).send("Image should be in base64 format");
    }

    let transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "resend",
        pass: process.env.RESEND_PASSWORD,
      },
    });

    const base64Data = sanitizedImage.split("base64,")[1];

    let mailOptions = {
      from: "test@resend.dev",
      to: sanitizedEmail,
      subject: "Your Chart Image",
      text: "Please find your chart image attached.",
      attachments: [
        {
          filename: "chart.png",
          content: base64Data,
          encoding: "base64",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email. Please try again later.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});