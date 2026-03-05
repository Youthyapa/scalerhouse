// lib/mailer.ts
// Nodemailer transporter using Gmail SMTP with App Password

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export interface SendMailOptions {
    to: string;
    subject: string;
    html: string;
    attachments?: { filename: string; path?: string; content?: Buffer | string; contentType?: string }[];
}

export async function sendMail({ to, subject, html, attachments }: SendMailOptions) {
    const mailOptions = {
        from: `"ScalerHouse Careers" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html,
        attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return info;
}
