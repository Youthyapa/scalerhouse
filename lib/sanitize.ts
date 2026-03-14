// lib/sanitize.ts
// Lightweight input sanitization helpers – no external dependencies.
// Strips HTML/script tags and trims whitespace from user-supplied strings.

/**
 * Sanitize a single string value.
 * Removes HTML tags, script injection patterns, and trims whitespace.
 */
export function sanitizeString(value: unknown): string {
    if (typeof value !== 'string') return '';
    return value
        .trim()
        // Remove all HTML tags (including script, iframe, etc.)
        .replace(/<[^>]*>/g, '')
        // Remove javascript: URIs
        .replace(/javascript:/gi, '')
        // Remove on* event handlers (onerror=, onclick=, etc.)
        .replace(/\bon\w+\s*=/gi, '')
        // Collapse excessive whitespace
        .replace(/\s{2,}/g, ' ');
}

/**
 * Recursively sanitize all string fields in an object (shallow or nested).
 * Non-string values (numbers, booleans, arrays) are left untouched.
 */
export function sanitizeBody<T extends Record<string, unknown>>(obj: T): T {
    const result: Record<string, unknown> = {};
    for (const key in obj) {
        const val = obj[key];
        if (typeof val === 'string') {
            result[key] = sanitizeString(val);
        } else if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
            result[key] = sanitizeBody(val as Record<string, unknown>);
        } else {
            result[key] = val;
        }
    }
    return result as T;
}
