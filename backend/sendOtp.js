import { Resend } from "resend";

export const sendOtpEmail = async (to, otp) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",

      to,

      subject: "Payment OTP Verification",

      html: `
        <div style="font-family: Arial">
          <h2>Your OTP</h2>

          <h1>${otp}</h1>

          <p>Valid for 5 minutes</p>
        </div>
      `,
    });

    console.log(response);
  } catch (err) {
    console.log(err);

    throw err;
  }
};
