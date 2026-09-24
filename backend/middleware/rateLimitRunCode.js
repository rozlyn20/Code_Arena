// middleware/rateLimitRunCode.js
const { createClient } = require('redis');
const { TokenBucket } = require('../lib/tokenBucket');

const client = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
client.connect();

const runCodeLimiter = new TokenBucket({
  redisClient: client,
  capacity: 2,          // small burst — e.g. run, then immediately re-run after a quick fix
  refillRate: 1,
  refillInterval: 10,   // matches your actual execution time — 1 fresh "slot" every 10s
});
async function rateLimitRunCode(req, res, next) {
  // Key per-user, not per-IP — two users on the same wifi shouldn't share a bucket,
  // and one user switching IPs shouldn't get a fresh bucket for free.
  const key = req.user ? `runcode:user:${req.user.id}` : `runcode:ip:${req.ip}`;

  try {
    const { allowed, remaining } = await runCodeLimiter.allow(key);
    res.set('X-RateLimit-Remaining', remaining);

    if (!allowed) {
      return res.status(429).json({
        message: 'Too many run requests. Slow down a bit and try again shortly.',
      });
    }
    next();
  } catch (err) {
    // If Redis is down, decide: fail open (let requests through) or fail closed (block everything).
    // For a code-execution endpoint that costs real compute, fail closed is safer.
    console.error('Rate limiter error:', err);
    return res.status(503).json({ message: 'Service temporarily unavailable.' });
  }
}

module.exports = rateLimitRunCode;