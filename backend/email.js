import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendWelcomeEmail = async (to, name) => {
  sgMail.send({
    to,
    from: "support@cneapee.com",
    subject: "Welcome to CNEAPEE 🚀",
    text: `Welcome ${name}, thanks for joining CNEAPEE.`,
  }).catch(console.error);
};

export const sendWelcomeBackEmail = async (to, name) => {
  sgMail.send({
    to,
    from: "support@cneapee.com",
    subject: "Welcome back 👋",
    text: `Welcome back ${name}`,
  }).catch(console.error);
};