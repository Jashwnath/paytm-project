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
  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to,

    subject: "Payment OTP Verification",

    html: `
      <div style="font-family: Arial">
        <h2>OTP Verification</h2>

        <p>Your OTP is:</p>

        <h1>${otp}</h1>

        <p>Valid for 5 minutes.</p>
      </div>
    `,
  });
};
