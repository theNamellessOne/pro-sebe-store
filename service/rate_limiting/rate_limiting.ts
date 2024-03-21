
const rateLimiter = async (
    client: Redis,
    ip: string,
    limit: number,
    duration: number
): Promise&lt;Result&gt; =&gt; {
    const key = `rate_limit:${ip}`;
    let currentCount = await client.get(key);
    let count = parseInt(currentCount as string, 10) || 0;
    if (count &gt;= limit) {
        return { limit, remaining: limit - count, success: false };
    }
    client.incr(key);
    client.expire(key, duration);
    return { limit, remaining: limit - (count + 1), success: true };
};
