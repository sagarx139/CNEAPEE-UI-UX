import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import User from './models/user.js'; // Sahi path

dotenv.config();

// Email setup (Nodemailer)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1. Welcome Email (New User)
export const sendWelcomeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to CNEAPEE - Registration Successful!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #4CAF50;">Welcome to CNEAPEE, ${name}! 🎉</h2>
          <p>Thanks for registering. Your account is ready.</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
  }
};

// 2. Welcome Back Email (Existing User Login) - Ye missing tha
export const sendWelcomeBackEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome Back to CNEAPEE!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2196F3;">Welcome Back, ${name}! 👋</h2>
          <p>We noticed a new login to your account.</p>
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

// Default export ki zarurat nahi hai agar named exports use kar rahe ho, 
// par safety ke liye main object export kar deta hu.
export default { sendWelcomeEmail, sendWelcomeBackEmail };