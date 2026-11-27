import connection from "@/lib/queue/redis";

export async function rateLimit(identifier: string, limit: number = 10, window: number = 60) {
    const key = `rate_limit:${identifier}`;
    const current = await connection.incr(key);

    if (current === 1) {
        await connection.expire(key, window);
    }

    if (current > limit) {
        return { success: false, remaining: 0 };
    }

    return { success: true, remaining: limit - current };
}