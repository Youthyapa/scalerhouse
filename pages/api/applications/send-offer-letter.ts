// pages/api/applications/send-offer-letter.ts
// POST: Send branded offer letter email with PDF attached

import { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuth } from '../../../lib/apiAuth';
import { sendMail } from '../../../lib/mailer';
import { offerLetterEmail } from '../../../lib/emailTemplates/offerLetter';

// Increase body size limit to 10mb to handle the base64 PDF
export const config = {
    api: { bodyParser: { sizeLimit: '10mb' } },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const {
        candidateName, candidateEmail, jobTitle, department,
        joiningDate, fixedCTC, variableCTC, probation,
        reportingManager, workingHours, location,
        pdfBase64,   // <-- base64 PDF from client
    } = req.body;

    if (!candidateEmail || !candidateName || !jobTitle) {
        return res.status(400).json({ error: 'candidateName, candidateEmail and jobTitle are required' });
    }

    try {
        const attachments = pdfBase64
            ? [{
                filename: `OfferLetter_${(candidateName || 'Candidate').replace(/\s+/g, '_')}.pdf`,
                content: Buffer.from(pdfBase64, 'base64'),
                contentType: 'application/pdf',
            }]
            : [];

        await sendMail({
            to: candidateEmail,
            subject: `📄 Your Offer Letter from ScalerHouse – ${jobTitle}`,
            html: offerLetterEmail({
                candidateName, jobTitle, department: department || 'Digital Marketing',
                joiningDate: joiningDate || 'To be confirmed',
                fixedCTC: fixedCTC || '0',
                variableCTC: variableCTC || '0',
                probation: probation || '3 months',
                reportingManager: reportingManager || 'Shashank Singh (Founder & CEO)',
                workingHours: workingHours || '9:30 AM – 6:30 PM, Monday to Friday',
                location: location || 'Remote / Kanpur, Uttar Pradesh',
            }),
            attachments,
        });

        return res.status(200).json({ success: true, message: `Offer letter + PDF sent to ${candidateEmail}` });
    } catch (err: any) {
        console.error('[send-offer-letter] email error:', err.message);
        return res.status(500).json({ error: 'Failed to send offer letter email: ' + err.message });
    }
}

export default withApiAuth(handler, ['admin']);
