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

// ── Memory Leak Prevention ──────────────────────────────────────────────────
// Automatically purge entries whose timestamps are all expired.
// Runs every 5 minutes. This prevents unbounded memory growth under traffic.
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
const MAX_WINDOW_MS = 60 * 60 * 1000; // keep 1h as the maximum possible window

function runCleanup() {
    const cutoff = Date.now() - MAX_WINDOW_MS;
    Array.from(store.entries()).forEach(([key, timestamps]) => {
        const alive = timestamps.filter(t => t > cutoff);
        if (alive.length === 0) {
            store.delete(key);
        } else {
            store.set(key, alive);
        }
    });
}

// Only set interval in Node.js server context (not during build)
if (typeof setInterval !== 'undefined' && typeof window === 'undefined') {
    setInterval(runCleanup, CLEANUP_INTERVAL_MS).unref?.(); // unref() avoids keeping Node alive
}
// ────────────────────────────────────────────────────────────────────────────

function getIp(req: NextApiRequest): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
    return req.socket?.remoteAddress ?? 'unknown';
}

/**
 * Returns false (and sends 429) if the caller exceeds the rate limit.
 * Returns true if the request is allowed to proceed.
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

// ── Preset Configs ──────────────────────────────────────────────────────────

/** Authentication endpoints — strict limit to mitigate brute force */
export const LOGIN_RATE_LIMIT: RateLimitOptions = {
    maxRequests: 10,
    windowMs: 15 * 60 * 1000, // 15 minutes
};

/** Public contact / audit form submissions */
export const CONTACT_RATE_LIMIT: RateLimitOptions = {
    maxRequests: 5,
    windowMs: 10 * 60 * 1000, // 10 minutes
};

/** General public API endpoints */
export const GENERAL_RATE_LIMIT: RateLimitOptions = {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
};
