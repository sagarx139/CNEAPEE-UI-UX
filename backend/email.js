// backend/email.js
import brevo from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();

const apiInstance = new brevo.TransactionalEmailsApi();
const apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY; 

export const sendWelcomeEmail = async (email, name) => {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "Welcome to CNEAPEE 🚀";
    sendSmtpEmail.htmlContent = `<h1>Welcome ${name}!</h1><p>Thanks for joining CNEAPEE.</p>`;
    sendSmtpEmail.sender = { "name": "CNEAPEE", "email": process.env.EMAIL_FROM };
    sendSmtpEmail.to = [{ "email": email, "name": name }];

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('✅ Email sent');
    } catch (error) {
        console.error('❌ Email Error:', error);
    }
};