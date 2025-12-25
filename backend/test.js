// --- YE LINE SABSE IMPORTANT HAI (Antivirus Error Hatane ke liye) ---
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; 

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log("--- EMAIL TEST WITH SECURITY BYPASS ---");
console.log("1. Checking Credentials...");
console.log("   User:", process.env.EMAIL_USER);
console.log("   Pass:", process.env.EMAIL_PASS ? "✅ Present" : "❌ MISSING");

const testEmail = async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("2. Sending Email...");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, 
      subject: 'CNEAPEE Server Test 🚀',
      text: 'SUCCESS! Agar ye mail aaya hai to backend fix ho gaya hai.',
      html: '<h1>It Works! 🎉</h1><p>Email sent successfully ignoring SSL errors.</p>'
    });

    console.log("✅ SUCCESS! Email Sent.");
    console.log("   Message ID:", info.messageId);

  } catch (error) {
    console.log("\n❌ FAILED! Error Details:");
    console.error(error);
  }
};

testEmail();