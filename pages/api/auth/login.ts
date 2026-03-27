// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { connectDB } from '../../../lib/db';
import { EmployeeModel, ClientModel, AffiliateModel, RoleModel } from '../../../lib/models';
import { signToken, buildAuthCookie } from '../../../lib/apiAuth';
import { checkRateLimit, LOGIN_RATE_LIMIT } from '../../../lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // Rate limiting — max 10 attempts per IP per 15 minutes
    if (!checkRateLimit(req, res, 'auth:login', LOGIN_RATE_LIMIT)) return;

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        await connectDB();
        const emailLower = (email as string).toLowerCase().trim();

        // Try Employee (includes Admin)
        const emp = await EmployeeModel.findOne({ email: emailLower });
        if (emp) {
            const valid = await bcrypt.compare(password, emp.passwordHash || '');
            if (!valid) return res.status(401).json({ error: 'Invalid password' });
            
            // Fetch Role
            let roleDoc = null;
            if (emp.role) {
                roleDoc = await RoleModel.findById(emp.role).lean() || await RoleModel.findOne({ name: emp.role }).lean();
            }
            const isAdmin = roleDoc ? (roleDoc.isProtected && roleDoc.name === 'Admin') : (emp.role === 'Admin');

            const token = signToken({
                userId: emp._id,
                email: emp.email,
                role: isAdmin ? 'admin' : 'employee',
                roleName: roleDoc ? roleDoc.name : (emp.role || 'Employee'),
                permissions: roleDoc ? roleDoc.permissions : [],
                entityId: emp._id,
                name: emp.name,
            });
            res.setHeader('Set-Cookie', buildAuthCookie(token));
            return res.status(200).json({
                token,
                user: { 
                    email: emp.email, 
                    role: isAdmin ? 'admin' : 'employee', 
                    roleName: roleDoc ? roleDoc.name : (emp.role || 'Employee'),
                    permissions: roleDoc ? roleDoc.permissions : [],
                    entityId: emp._id, 
                    name: emp.name 
                },
            });
        }

        // Try Client
        const client = await ClientModel.findOne({ email: emailLower });
        if (client) {
            const valid = await bcrypt.compare(password, client.passwordHash || '');
            if (!valid) return res.status(401).json({ error: 'Invalid password' });
            const token = signToken({
                userId: client._id,
                email: client.email,
                role: 'client',
                entityId: client._id,
                name: client.name,
            });
            res.setHeader('Set-Cookie', buildAuthCookie(token));
            return res.status(200).json({
                token,
                user: { email: client.email, role: 'client', entityId: client._id, name: client.name },
            });
        }

        // Try Affiliate
        const aff = await AffiliateModel.findOne({ email: emailLower });
        if (aff) {
            const valid = await bcrypt.compare(password, aff.passwordHash || '');
            if (!valid) return res.status(401).json({ error: 'Invalid password' });
            const token = signToken({
                userId: aff._id,
                email: aff.email,
                role: 'affiliate',
                entityId: aff._id,
                name: aff.name,
            });
            res.setHeader('Set-Cookie', buildAuthCookie(token));
            return res.status(200).json({
                token,
                user: { email: aff.email, role: 'affiliate', entityId: aff._id, name: aff.name },
            });
        }

        return res.status(401).json({ error: 'Account not found' });
    } catch (err: any) {
        console.error('[login] error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
