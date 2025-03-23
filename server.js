const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(bodyParser.json({ limit: "10mb" })); // Increase limit for large images
app.use(cors());

app.post("/send-email", async (req, res) => {
  try {
    // Validate request body exists
    if (!req.body) {
      return res.status(400).send("No request body received");
    }

    const { email, image } = req.body;
    console.log("SEND EMAIL REQUEST", {
      email: email ? "email provided" : "email missing",
      imageProvided: image ? true : false
    });

    // Validate email and image
    if (!email) {
      return res.status(400).send("Email address is required");
    }

    if (!image) {
      return res.status(400).send("Image data is required");
    }

    // Validate image format
    if (!image.includes('base64,')) {
      return res.status(400).send("Image should be in base64 format");
    }

    // Create a transporter object using SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "resend",
        pass: process.env.RESEND_PASSWORD,
      },
    });

    // Extract base64 content from the image data URL
    const base64Data = image.split("base64,")[1];

    // Email options
    let mailOptions = {
      from: "test@resend.dev",
      to: email,
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

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email: " + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});