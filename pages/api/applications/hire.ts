// pages/api/applications/hire.ts
// POST: Hire a candidate – generates employee credentials and sends welcome email

import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { connectDB } from '../../../lib/db';
import { ApplicationModel, EmployeeModel } from '../../../lib/models';
import { withApiAuth } from '../../../lib/apiAuth';
import { sendMail } from '../../../lib/mailer';
import { hireWelcomeEmail } from '../../../lib/emailTemplates/hireWelcome';

function generateUserId(name: string): string {
    const clean = name.trim().toLowerCase().replace(/\s+/g, '.');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `sh.${clean}.${rand}`;
}

function generateTempPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#';
    return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    await connectDB();

    const protectedHandler = withApiAuth(async (req, res) => {
        const { applicationId, joiningDate, role, department } = req.body;
        if (!applicationId) return res.status(400).json({ error: 'applicationId is required' });

        const application = await ApplicationModel.findById(applicationId).lean() as any;
        if (!application) return res.status(404).json({ error: 'Application not found' });

        const userId = generateUserId(application.name);
        const tempPassword = generateTempPassword();
        const passwordHash = await bcrypt.hash(tempPassword, 10);

        // Create employee record
        const employeeId = `EMP${Date.now()}`;
        await EmployeeModel.create({
            _id: employeeId,
            name: application.name,
            email: application.email,
            phone: application.phone || '',
            passwordHash,
            role: role || 'Sales Executive',
            department: department || application.jobTitle,
            status: 'Active',
            joinedAt: joiningDate || new Date().toISOString().slice(0, 10),
            assignedLeads: [],
            assignedClients: [],
            tasks: [],
            performanceScore: 0,
        });

        // Update application status
        await ApplicationModel.findByIdAndUpdate(applicationId, {
            status: 'Selected',
            updatedAt: new Date(),
            notes: `Hired on ${new Date().toLocaleDateString('en-IN')}. EmployeeId: ${employeeId}`,
        });

        // Send hire welcome email
        sendMail({
            to: application.email,
            subject: `🎉 Congratulations! You're Hired at ScalerHouse – ${application.jobTitle}`,
            html: hireWelcomeEmail({
                name: application.name,
                jobTitle: application.jobTitle,
                userId,
                tempPassword,
                joiningDate,
            }),
        }).catch((e) => console.error('Hire email failed:', e));

        return res.status(200).json({
            success: true,
            employeeId,
            userId,
            tempPassword,
            message: `${application.name} hired successfully. Credentials sent to ${application.email}.`,
        });
    }, ['admin']);

    return protectedHandler(req, res);
}
