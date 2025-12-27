import brevo from '@getbrevo/brevo';
import dotenv from 'dotenv';

dotenv.config();

// Brevo Setup
const apiInstance = new brevo.TransactionalEmailsApi();
const apiKey = apiInstance.authentications['apiKey'];

// Google Cloud variable se key uthayega
apiKey.apiKey = process.env.BREVO_API_KEY; 

export const sendWelcomeEmail = async (email, name) => {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "Welcome to CNEAPEE - Registration Successful! 🚀";
    sendSmtpEmail.htmlContent = `
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #4CAF50;">Welcome to CNEAPEE, ${name}!</h2>
                <p>Thanks for registering. We are launching soon!</p>
                <br>
                <p>Best Regards,<br>Team CNEAPEE</p>
            </body>
        </html>
    `;
    
    // Yahan wo email aayega jo tumne Cloud Variables me 'EMAIL_FROM' me dala h
    sendSmtpEmail.sender = { "name": "CNEAPEE Support", "email": process.env.EMAIL_FROM };
    sendSmtpEmail.to = [{ "email": email, "name": name }];

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('✅ Email sent successfully via Brevo. Message ID:', data.messageId);
    } catch (error) {
        console.error('❌ Error sending email via Brevo:', error);
    }
};