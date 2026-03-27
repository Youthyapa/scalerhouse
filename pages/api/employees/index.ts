// pages/api/employees/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { connectDB } from '../../../lib/db';
import { EmployeeModel, RoleModel } from '../../../lib/models';
import { withApiAuth, AuthPayload } from '../../../lib/apiAuth';
import { sendMail } from '../../../lib/mailer';
import { employeeWelcomeTemplate } from '../../../lib/emailTemplates/employeeWelcome';

function generateSecurePassword() {
    return `SH-${crypto.randomBytes(4).toString('hex').toUpperCase()}@${new Date().getFullYear()}`;
}

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthPayload) {
    try {
        // Only admin can manage employees
        if (user.role !== 'admin') return res.status(403).json({ error: 'Access Denied: Admin only' });

        await connectDB();

        if (req.method === 'GET') {
            const employees = await EmployeeModel.find().select('-passwordHash').lean().exec();

            // Populate role names for the UI
            const roles = await RoleModel.find().lean().exec();
            const roleMap = (roles as any[]).reduce((acc: Record<string, string>, r: any) => ({
                ...acc, [r._id]: r.name,
            }), {});

            const empsWithRoleNames = (employees as any[]).map((emp: any) => ({
                ...emp,
                roleName: roleMap[emp.role] || emp.role,
            }));

            return res.status(200).json(empsWithRoleNames);
        }

        if (req.method === 'POST') {
            const { id, password, ...data } = req.body;
            if (!data.name || !data.email) {
                return res.status(400).json({ error: 'Name and email are required' });
            }
            const _id = id || `emp_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
            const plainPassword = password || generateSecurePassword();
            const passwordHash = await bcrypt.hash(plainPassword, 12);

            const employee = await EmployeeModel.create({ _id, passwordHash, ...data });

            // Send automated welcome email with Employee Portal URL & credentials
            try {
                const html = employeeWelcomeTemplate(employee.name, employee.email, plainPassword);
                await sendMail({
                    to: employee.email,
                    subject: 'Welcome to the ScalerHouse Team – Your Employee Portal Access',
                    html,
                });
            } catch (emailErr: any) {
                console.error('[employees:index] Failed to send welcome email:', emailErr.message);
                // Do not fail the request; log and move on
            }

            const obj = employee.toObject();
            const { passwordHash: _ph, ...safe } = obj;
            // Return plainPassword once so admin can see it if email fails
            return res.status(201).json({ ...safe, plainPassword });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err: any) {
        console.error('[employees:index] error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Only admin can create / list employees
export default withApiAuth(handler, ['admin']);
