// lib/apiAuth.ts
// JWT sign/verify helpers + withApiAuth middleware for Next.js API routes

import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

// Hard-fail if JWT_SECRET is not set — never fall back to a weak default in production
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error(
        '❌ JWT_SECRET is not defined. Please add it to your .env.local file.'
    );
}

// Token claims — prevents token confusion / replay attacks across different apps
const JWT_ISSUER = 'scalerhouse';
const JWT_AUDIENCE = 'scalerhouse-app';
// Short-lived tokens (1 day) — reduces exposure window if a token is leaked
const JWT_EXPIRY = '1d';

const IS_PROD = process.env.NODE_ENV === 'production';

export interface AuthPayload {
    userId: string;
    email: string;
    role: 'admin' | 'employee' | 'client' | 'affiliate';
    roleName?: string;
    permissions?: any[];
    entityId: string;
    name: string;
}

export function verifyToken(req: NextApiRequest): AuthPayload | null {
    try {
        const authHeader = req.headers.authorization;
        const cookieToken = req.cookies?.sh_token;

        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.slice(7)
            : cookieToken;

        if (!token) return null;
        return jwt.verify(token, JWT_SECRET as string, {
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE,
        }) as AuthPayload;
    } catch {
        return null;
    }
}

export function signToken(payload: AuthPayload): string {
    return jwt.sign(payload, JWT_SECRET as string, {
        expiresIn: JWT_EXPIRY,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
    });
}

/**
 * Build the Set-Cookie header value for the auth token.
 * Sets Secure + SameSite=Strict in production (stronger than Lax).
 * Cookie lifetime mirrors JWT expiry (1 day).
 */
export function buildAuthCookie(token: string): string {
    const maxAge = 1 * 24 * 3600; // 1 day — matches JWT_EXPIRY
    const secure = IS_PROD ? '; Secure' : '';
    const sameSite = IS_PROD ? 'Strict' : 'Lax';
    return `sh_token=${token}; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=${maxAge}${secure}`;
}

/**
 * Build the Set-Cookie header value to clear the auth token.
 */
export function buildClearCookie(): string {
    const secure = IS_PROD ? '; Secure' : '';
    const sameSite = IS_PROD ? 'Strict' : 'Lax';
    return `sh_token=; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=0${secure}`;
}

/** Middleware wrapper — protects an API handler */
export function withApiAuth(
    handler: (req: NextApiRequest, res: NextApiResponse, user: AuthPayload) => Promise<void>,
    allowedRoles?: AuthPayload['role'][]
) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const user = verifyToken(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: Please log in.' });
        }
        if (allowedRoles && !allowedRoles.includes(user.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions.' });
        }
        return handler(req, res, user);
    };
}
