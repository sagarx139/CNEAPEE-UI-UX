import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Email setup (Render Production Fix: Port 587)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // 587 ke liye hamesha false rakhein
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Security certificate bypass for timeout fix
    minVersion: 'TLSv1.2'
  },
  connectionTimeout: 20000, // 20 seconds wait time
  greetingTimeout: 20000
});

// 1. Welcome Email (New User Registration)
export const sendWelcomeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: `"CNEAPEE AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to CNEAPEE - Registration Successful!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4CAF50;">Welcome to CNEAPEE, ${name}! 🎉</h2>
          <p>Thanks for registering. Your account is ready at CNEAPEE AI Intelligence.</p>
          <p>Explore our platform and start your AI journey today.</p>
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
      from: `"CNEAPEE AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome Back to CNEAPEE!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2196F3;">Welcome Back, ${name}! 👋</h2>
          <p>We noticed a new login to your account at CNEAPEE AI Intelligence.</p>
          <p>Happy to see you again!</p>
          <br>
          <p>If this wasn't you, please secure your account.</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome Back email sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending welcome back email:', error);
  }
};

// Default export for safety
export default { sendWelcomeEmail, sendWelcomeBackEmail };