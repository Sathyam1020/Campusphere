// lib/rateLimit.ts

// Lightweight in-memory rate limiter used for dev / single-instance deployments.
// This avoids requiring a Prisma model for rate limits. For production you may
// want to replace this with a DB-backed implementation.

interface RateLimitResult {
  allowed: boolean;
  lockoutMinutes?: number;
  remaining?: number;
}

type RateLimitRecord = {
  attempts: number;
  resetTime: Date;
  lockoutUntil?: Date | null;
};

const store = new Map<string, RateLimitRecord>();

export async function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMinutes: number = 15,
  lockoutMinutes: number = 30
): Promise<RateLimitResult> {
  const now = new Date();

  try {
    const record = store.get(identifier);

    // Check if locked out
    if (record?.lockoutUntil && record.lockoutUntil > now) {
      const remainingMinutes = Math.ceil(
        (record.lockoutUntil.getTime() - now.getTime()) / 60000
      );
      return { allowed: false, lockoutMinutes: remainingMinutes };
    }

    // Reset if window expired
    if (!record || !record.resetTime || record.resetTime < now) {
      store.set(identifier, {
        attempts: 1,
        resetTime: new Date(now.getTime() + windowMinutes * 60000),
        lockoutUntil: null,
      });
      return { allowed: true, remaining: maxAttempts - 1 };
    }

    // Check if limit exceeded
    if (record.attempts >= maxAttempts) {
      const until = new Date(now.getTime() + lockoutMinutes * 60000);
      store.set(identifier, {
        attempts: record.attempts + 1,
        resetTime: record.resetTime,
        lockoutUntil: until,
      });
      return { allowed: false, lockoutMinutes };
    }

    // Increment attempts
    store.set(identifier, {
      attempts: record.attempts + 1,
      resetTime: record.resetTime,
      lockoutUntil: record.lockoutUntil ?? null,
    });

    return {
      allowed: true,
      remaining: maxAttempts - record.attempts - 1,
    };
  } catch (error) {
    console.error("Rate limit error:", error);
    // Fail open in case of unexpected issues
    return { allowed: true };
  }
}

export async function resetRateLimit(identifier: string): Promise<void> {
  try {
    store.delete(identifier);
  } catch (error) {
    console.error("Rate limit reset error:", error);
  }
}

export async function cleanupExpiredRateLimits(): Promise<void> {
  try {
    const now = new Date();
    for (const [key, value] of store.entries()) {
      if (value.resetTime < now || (value.lockoutUntil && value.lockoutUntil < now)) {
        store.delete(key);
      }
    }
  } catch (error) {
    console.error("Cleanup error:", error);
  }
}