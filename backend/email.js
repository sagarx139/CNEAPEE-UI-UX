import brevo from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();

const apiInstance = new brevo.TransactionalEmailsApi();
const apiKey = apiInstance.authentications['apiKey'];
// Ensure API key environment variable se aaye
apiKey.apiKey = process.env.BREVO_API_KEY; 

// 1. WELCOME EMAIL (Registration)
export const sendWelcomeEmail = async (email, name) => {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "Welcome to CNEAPEE 🚀";
    sendSmtpEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #4F46E5;">Welcome to CNEAPEE, ${name}!</h2>
            <p>Thanks for joining us. We are excited to have you on board.</p>
            <p>Explore our AI tools and create something amazing today!</p>
            <br>
            <p>Best Regards,<br>Team CNEAPEE</p>
        </div>
    `;
    sendSmtpEmail.sender = { "name": "CNEAPEE Support", "email": process.env.EMAIL_FROM };
    sendSmtpEmail.to = [{ "email": email, "name": name }];

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`✅ Welcome Email sent to ${email}`);
    } catch (error) {
        console.error('❌ Error sending Welcome Email:', error);
    }
};

// 2. LOGIN EMAIL (Happy to see you again)
export const sendLoginEmail = async (email, name) => {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "Happy to see you again! 👋";
    sendSmtpEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #059669;">Hello ${name},</h2>
            <p>We noticed a new login to your CNEAPEE account.</p>
            <p><b>Happy to see you again!</b> Let's continue building.</p>
            <br>
            <p>Stay Creative,<br>Team CNEAPEE</p>
        </div>
    `;
    sendSmtpEmail.sender = { "name": "CNEAPEE Security", "email": process.env.EMAIL_FROM };
    sendSmtpEmail.to = [{ "email": email, "name": name }];

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`✅ Login Email sent to ${email}`);
    } catch (error) {
        console.error('❌ Error sending Login Email:', error);
    }
};