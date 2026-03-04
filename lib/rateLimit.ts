// lib/rateLimit.ts
// Simple in-memory sliding-window rate limiter for Next.js API routes.
// Suitable for single-server deployments; swap with Redis for multi-instance.

import { NextApiRequest, NextApiResponse } from 'next';

interface RateLimitOptions {
    maxRequests: number;   // max requests allowed in the window
    windowMs: number;      // window size in milliseconds
}

// Map: key (IP + endpoint) → array of request timestamps
const store = new Map<string, number[]>();

function getIp(req: NextApiRequest): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
    return req.socket?.remoteAddress ?? 'unknown';
}

/**
 * Returns 429 if the caller exceeds the rate limit.
 * Returns null if the request is allowed to proceed.
 */
export function checkRateLimit(
    req: NextApiRequest,
    res: NextApiResponse,
    key: string,
    options: RateLimitOptions
): boolean {
    const ip = getIp(req);
    const storeKey = `${key}:${ip}`;
    const now = Date.now();
    const windowStart = now - options.windowMs;

    // Get existing timestamps and prune old ones
    const timestamps = (store.get(storeKey) ?? []).filter(t => t > windowStart);

    if (timestamps.length >= options.maxRequests) {
        const retryAfterSec = Math.ceil(options.windowMs / 1000);
        res.setHeader('Retry-After', String(retryAfterSec));
        res.setHeader('X-RateLimit-Limit', String(options.maxRequests));
        res.setHeader('X-RateLimit-Remaining', '0');
        res.status(429).json({
            error: 'Too many requests. Please try again later.',
        });
        return false; // blocked
    }

    timestamps.push(now);
    store.set(storeKey, timestamps);

    res.setHeader('X-RateLimit-Limit', String(options.maxRequests));
    res.setHeader('X-RateLimit-Remaining', String(options.maxRequests - timestamps.length));
    return true; // allowed
}

// Preset configs for common use-cases
export const LOGIN_RATE_LIMIT: RateLimitOptions = {
    maxRequests: 10,
    windowMs: 15 * 60 * 1000, // 15 minutes
};

export const CONTACT_RATE_LIMIT: RateLimitOptions = {
    maxRequests: 5,
    windowMs: 10 * 60 * 1000, // 10 minutes
};
