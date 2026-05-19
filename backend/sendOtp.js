import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to,

      subject: "OTP Verification",

      html: `
        <h2>Your OTP</h2>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes</p>
      `,
    });

    console.log("EMAIL SENT SUCCESSFULLY");
  } catch (err) {
    console.log("NODEMAILER ERROR:");
    console.log(err);

    throw err;
  }
};
