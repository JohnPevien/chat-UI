// Shared guard for the paid-LLM API route: same-origin check, per-IP rate
// limit, and message validation. Buckets live in memory (per instance).
const RATE_LIMIT_MAX_REQUESTS = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_BUCKETS_BEFORE_SWEEP = 10_000;

const MAX_MESSAGES = 50;
const MAX_MESSAGE_CHARS = 8000;
const MAX_TOTAL_CHARS = 32000;

const ALLOWED_ROLES: Record<ValidatedMessage['role'], true> = {
  user: true,
  assistant: true,
  system: true,
};

const buckets = new Map<string, { count: number; resetAt: number }>();

export class ValidationError extends Error {}

export interface ValidatedMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

function clientIp(req: Request): string {
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) {
        const first = forwarded.split(',')[0]?.trim();
        if (first) return first;
    }
    return req.headers.get('x-real-ip')?.trim() || 'unknown';
}

function headerHost(value: string | null): string | null {
    if (!value) return null;
    try {
        return new URL(value).host;
    } catch {
        return '';
    }
}

/** 403 response for cross-origin browser calls; headerless clients pass. */
export function checkSameOrigin(req: Request): Response | null {
    const host = new URL(req.url).host;
    const originHost = headerHost(req.headers.get('origin'));
    if (originHost !== null) {
        return originHost === host
            ? null
            : new Response('Forbidden', { status: 403 });
    }
    const refererHost = headerHost(req.headers.get('referer'));
    if (refererHost !== null && refererHost !== host) {
        return new Response('Forbidden', { status: 403 });
    }
    return null;
}

/** 429 response when the caller IP is over budget, else null. */
export function checkRateLimit(req: Request): Response | null {
    const now = Date.now();
    const ip = clientIp(req);
    if (buckets.size > MAX_BUCKETS_BEFORE_SWEEP) {
        buckets.forEach((bucket, key) => {
            if (now >= bucket.resetAt) buckets.delete(key);
        });
    }
    const bucket = buckets.get(ip);
    if (!bucket || now >= bucket.resetAt) {
        buckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return null;
    }
    bucket.count += 1;
    if (bucket.count > RATE_LIMIT_MAX_REQUESTS) {
        const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
        return new Response('Too many requests, please try again later', {
            status: 429,
            headers: { 'Retry-After': String(retryAfter) },
        });
    }
    return null;
}

/** Throw ValidationError unless messages is a bounded array of role/content pairs. */
export function assertMessages(messages: unknown): ValidatedMessage[] {
    if (!Array.isArray(messages) || messages.length === 0) {
        throw new ValidationError('Messages array is required and cannot be empty');
    }
    if (messages.length > MAX_MESSAGES) {
        throw new ValidationError(`At most ${MAX_MESSAGES} messages are allowed`);
    }
    let total = 0;
    const validated: ValidatedMessage[] = messages.map((message) => {
        if (!message || typeof message !== 'object') {
            throw new ValidationError('Each message must be an object');
        }
        const { role, content } = message as { role?: unknown; content?: unknown };
        if (typeof role !== 'string' || ALLOWED_ROLES[role as ValidatedMessage['role']] !== true) {
            throw new ValidationError('Each message role must be user, assistant, or system');
        }
        if (typeof content !== 'string' || !content.trim()) {
            throw new ValidationError('Each message must have non-empty string content');
        }
        if (content.length > MAX_MESSAGE_CHARS) {
            throw new ValidationError(`Each message must be at most ${MAX_MESSAGE_CHARS} characters`);
        }
        total += content.length;
        return { role: role as ValidatedMessage['role'], content };
    });
    if (total > MAX_TOTAL_CHARS) {
        throw new ValidationError('Messages exceed the total size limit');
    }
    return validated;
}

/**
 * Map a caught route error to a safe client response: 400 for client
 * mistakes, generic 500 for upstream failures (logged server-side).
 */
export function toErrorResponse(error: unknown, logPrefix: string): Response {
    if (error instanceof ValidationError) {
        return new Response(error.message, { status: 400 });
    }
    if (error instanceof SyntaxError) {
        return new Response('Invalid request body', { status: 400 });
    }
    console.error(logPrefix, error);
    return new Response('Internal server error', { status: 500 });
}
