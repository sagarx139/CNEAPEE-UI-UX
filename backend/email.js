import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Email setup (Nodemailer) - Updated for Render Production
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Port 465 ke liye true zaroori hai
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Timeout fix karne ke liye
  },
  connectionTimeout: 15000 // 15 seconds timeout badha diya hai
});

// 1. Welcome Email (New User)
export const sendWelcomeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to CNEAPEE - Registration Successful!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4CAF50;">Welcome to CNEAPEE, ${name}! 🎉</h2>
          <p>Thanks for registering. Your account is ready.</p>
          <p>Start exploring CNEAPEE AI Intelligence now.</p>
          <br>
          <p>Best Regards,<br>Team CNEAPEE</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
  }
};

// 2. Welcome Back Email (Existing User Login)
export const sendWelcomeBackEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome Back to CNEAPEE!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2196F3;">Welcome Back, ${name}! 👋</h2>
          <p>We noticed a new login to your account at CNEAPEE AI Intelligence.</p>
          <p>If this wasn't you, please secure your account.</p>
          <br>
          <p>Happy to see you again!</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome Back email sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending welcome back email:', error);
  }
};

export default { sendWelcomeEmail, sendWelcomeBackEmail };