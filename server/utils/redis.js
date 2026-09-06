import "dotenv/config";
import { createClient } from "redis";

const configuredUrl = process.env.REDIS_URL?.trim();
const isUrl = configuredUrl && /^[a-z][a-z\d+.-]*:\/\//i.test(configuredUrl);
const redisOptions = isUrl
    ? { url: configuredUrl }
    : {
        username: process.env.RedisUserName,
        password: process.env.RedisPassword,
        socket: {
            host: process.env.RedisSocket || configuredUrl,
            port: Number(process.env.RedisPort || 14781),
            // Enable TLS only when the Redis provider explicitly requires it.
            tls: process.env.RedisTLS === "true"
        }
    };

export const redis = configuredUrl ? createClient(redisOptions) : null;
let connectionPromise;

if (redis) {
    redis.on("error", (error) => console.error("Redis client error:", error.message));
    connectionPromise = redis.connect().catch((error) => {
        console.error("Redis connection failed:", error.message);
        return null;
    });
    connectionPromise.then(() => {
        if (redis.isReady) console.log("✅ Redis connected");
    });
}
 


const keyForId = (id) => `user:${id}`;
const keyForEmail = (email) => `user:email:${email.toLowerCase()}`;
const keyForConversation = (firstUserId, secondUserId) => {
    const ids = [String(firstUserId), String(secondUserId)].sort();
    return `messages:${ids[0]}:${ids[1]}`;
};

export const publicUser = (user) => {
    if (!user) return null;
    const value = typeof user.toObject === "function" ? user.toObject() : { ...user };
    delete value.password;
    if (value.connections instanceof Map) {
        value.connections = Object.fromEntries(value.connections);
    }
    return value;
};

export async function getCachedUser({ id, email } = {}) {
    if (connectionPromise) await connectionPromise;
    if (!redis?.isReady) return null;
    try {
        const value = await redis.get(id ? keyForId(id) : keyForEmail(email));
        return value ? JSON.parse(value) : null;
    } catch { return null; }
}

export async function cacheUser(user) {
    if (connectionPromise) await connectionPromise;
    if (!redis?.isReady || !user) return;
    const value = publicUser(user);
    const serialized = JSON.stringify(value);
    try { await Promise.all([
        redis.set(keyForId(value._id), serialized, { EX: 300 }),
        value.email && redis.set(keyForEmail(value.email), serialized, { EX: 300 })
    ]); } catch { /* Redis is an optional performance layer. */ }
}

export async function invalidateUser(user) {
    if (connectionPromise) await connectionPromise;
    if (!redis?.isReady || !user) return;
    const value = publicUser(user);
    try { await redis.del(keyForId(value._id), ...(value.email ? [keyForEmail(value.email)] : [])); } catch { }
}

export async function getCachedConversation(firstUserId, secondUserId) {
    if (connectionPromise) await connectionPromise;
    if (!redis?.isReady) return null;
    try {
        const value = await redis.get(keyForConversation(firstUserId, secondUserId));
        return value ? JSON.parse(value) : null;
    } catch { return null; }
}

export async function cacheConversation(firstUserId, secondUserId, messages) {
    if (connectionPromise) await connectionPromise;
    if (!redis?.isReady) return;
    try {
        // Conversations are short-lived because read status can change frequently.
        await redis.set(keyForConversation(firstUserId, secondUserId), JSON.stringify(messages), { EX: 60 });
    } catch { /* Redis is an optional performance layer. */ }
}

export async function invalidateConversation(firstUserId, secondUserId) {
    if (connectionPromise) await connectionPromise;
    if (!redis?.isReady) return;
    try { await redis.del(keyForConversation(firstUserId, secondUserId)); } catch { }
}
