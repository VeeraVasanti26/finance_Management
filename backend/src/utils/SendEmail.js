import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Create reusable transporter object using the default SMTP transport
  // Note: For production, use real SMTP credentials in .env
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'Finance Dashboard'} <${process.env.FROM_EMAIL || 'noreply@financedash.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // In development/preview, log the email content
  console.log('--- EMAIL SENT ---');
  console.log(`To: ${options.email}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`Message: ${options.message}`);
  console.log('------------------');

  // Only attempt to send if credentials are provided
  if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
  } else {
    console.log('Email not sent via SMTP (missing credentials). Check console for reset link.');
  }
};

export default sendEmail;
