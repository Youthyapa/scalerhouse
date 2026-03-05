// pages/api/applications/[id].ts
// PATCH: Update application status/notes (admin) + send status-change email to candidate
// DELETE: Remove application (admin)

import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/db';
import { ApplicationModel } from '../../../lib/models';
import { withApiAuth } from '../../../lib/apiAuth';
import { sendMail } from '../../../lib/mailer';
import { statusUpdateEmail } from '../../../lib/emailTemplates/statusUpdate';

const EMAIL_STATUSES = ['Shortlisted', 'On Hold', 'Interview Scheduled', 'Rejected', 'Selected'] as const;
type EmailableStatus = typeof EMAIL_STATUSES[number];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();
    const { id } = req.query as { id: string };

    const protectedHandler = withApiAuth(async (req, res) => {
        if (req.method === 'PATCH') {
            const { status, notes, interviewDate, interviewTime, interviewLink, adminNotes } = req.body;
            const update: Record<string, any> = { updatedAt: new Date() };
            if (status !== undefined) update.status = status;
            if (notes !== undefined) update.notes = notes;

            const doc = await (ApplicationModel as any).findByIdAndUpdate(id, update, { new: true }).lean() as any;
            if (!doc) return res.status(404).json({ error: 'Application not found' });

            // 🔔 Send status-change email if the status is meaningful and has changed
            if (status && (EMAIL_STATUSES as readonly string[]).includes(status)) {
                try {
                    await sendMail({
                        to: doc.email,
                        subject: getEmailSubject(status as EmailableStatus, doc.jobTitle),
                        html: statusUpdateEmail({
                            name: doc.name,
                            jobTitle: doc.jobTitle,
                            status: status as EmailableStatus,
                            interviewDate,
                            interviewTime,
                            interviewLink,
                            adminNotes,
                        }),
                    });
                } catch (e) {
                    console.error(`Status email failed (${status}):`, e);
                }
            }

            return res.status(200).json(doc);
        }

        if (req.method === 'DELETE') {
            await (ApplicationModel as any).findByIdAndDelete(id);
            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    }, ['admin']);

    return protectedHandler(req, res);
}

function getEmailSubject(status: EmailableStatus, jobTitle: string): string {
    switch (status) {
        case 'Shortlisted':
            return `🌟 You've Been Shortlisted – ${jobTitle} | ScalerHouse`;
        case 'Interview Scheduled':
            return `📅 Interview Invitation – ${jobTitle} | ScalerHouse`;
        case 'On Hold':
            return `⏳ Application Update – ${jobTitle} | ScalerHouse`;
        case 'Rejected':
            return `ScalerHouse – Application Update for ${jobTitle}`;
        case 'Selected':
            return `🎉 Congratulations! You're Selected – ${jobTitle} | ScalerHouse`;
        default:
            return `Application Update – ScalerHouse`;
    }
}
