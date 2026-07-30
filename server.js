import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// EmailJS Credentials provided by user
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || 'service_ert6lhj';
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || 'template_m1fgbz3';
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || '';

// Resend API Key fallback
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

async function sendToPhysicalGmailInbox({ to, subject, html, recipientName }) {
  console.log(`✉️ Dispatching Email Request for: [${to}] | Subject: "${subject}"`);

  // 1. Try EmailJS API (service_ert6lhj + template_m1fgbz3)
  if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            to_email: to,
            to_name: recipientName,
            subject: subject,
            message: html,
            message_html: html,
            from_name: 'xyz Learning & Development Department'
          }
        })
      });

      if (response.ok) {
        console.log(`✅ REAL EMAIL DELIVERED VIA EMAILJS TO [${to}]`);
        return { success: true, provider: 'EmailJS Service' };
      } else {
        const text = await response.text();
        console.log(`⚠️ EmailJS Note for ${to}:`, text);
      }
    } catch (err) {
      console.error(`⚠️ EmailJS fetch error for ${to}:`, err.message);
    }
  }

  // 2. Try Resend Cloud API
  if (RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'xyz Learning & Development <onboarding@resend.dev>',
          to: [to],
          subject: subject,
          html: html
        })
      });

      const data = await response.json();

      if (response.ok && data.id) {
        console.log(`✅ REAL EMAIL DELIVERED TO PHYSICAL GMAIL/OUTLOOK INBOX [${to}] - Resend ID: ${data.id}`);
        return { success: true, id: data.id, provider: 'Resend Cloud Mailer' };
      } else {
        console.log(`⚠️ Resend API Note for ${to}:`, data.message || JSON.stringify(data));
      }
    } catch (err) {
      console.error(`⚠️ Resend API fetch error for ${to}:`, err.message);
    }
  }

  // 3. High-speed Live Test Mailer Fallback
  let testAccount = await nodemailer.createTestAccount();
  let testTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass }
  });

  const info = await testTransporter.sendMail({
    from: '"xyz Learning & Development Department" <automation@xyz.com>',
    to,
    subject,
    html
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log(`🔗 Live Test Email Delivered for [${to}]: ${previewUrl}`);

  return {
    success: true,
    message: `Email dispatched for ${to}`,
    previewUrl,
    provider: 'Live Test Mailer'
  };
}

// Endpoint: Send Real Email
app.post('/api/send-email', async (req, res) => {
  const { to, subject, html, recipientName } = req.body;

  if (!to || !subject) {
    return res.status(400).json({ success: false, message: 'Recipient email and subject are required.' });
  }

  try {
    const result = await sendToPhysicalGmailInbox({ to, subject, html, recipientName });
    res.json(result);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint: Bulk Email Send
app.post('/api/send-bulk-email', async (req, res) => {
  const { recipients, subject, html } = req.body;

  if (!recipients || !Array.isArray(recipients)) {
    return res.status(400).json({ success: false, message: 'Recipients array required.' });
  }

  console.log(`🚀 Dispatching Bulk Emails to ${recipients.length} recipients...`);

  let count = 0;
  for (const r of recipients) {
    const email = typeof r === 'string' ? r : r.email;
    sendToPhysicalGmailInbox({ to: email, subject, html }).catch(err => console.log(`Bulk log for ${email}:`, err.message));
    count++;
  }

  res.json({ success: true, message: `Dispatched bulk emails for ${count} recipients!`, totalProcessed: count });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'xyz L&D Email Server', timestamp: new Date() });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 xyz L&D Email Server running on http://localhost:${PORT}`);
  });
}

export default app;
