// lib/tokenBucket.js

// This script runs atomically inside Redis — no other request can interleave
// between the "check tokens" and "consume a token" steps.
const REFILL_AND_CONSUME_SCRIPT = `
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local refillIntervalMs = tonumber(ARGV[3])
local now = tonumber(ARGV[4])
local cost = tonumber(ARGV[5])

local bucket = redis.call('HMGET', key, 'tokens', 'lastRefill')
local tokens = tonumber(bucket[1])
local lastRefill = tonumber(bucket[2])

if tokens == nil then
  -- First time we've seen this key — start with a full bucket.
  tokens = capacity
  lastRefill = now
end

-- How much time has passed, and how many tokens should that have earned back?
local elapsed = now - lastRefill
local refillCount = math.floor(elapsed / refillIntervalMs) * refillRate
if refillCount > 0 then
  tokens = math.min(capacity, tokens + refillCount)
  lastRefill = lastRefill + (math.floor(elapsed / refillIntervalMs) * refillIntervalMs)
end

local allowed = 0
if tokens >= cost then
  tokens = tokens - cost
  allowed = 1
end

redis.call('HMSET', key, 'tokens', tokens, 'lastRefill', lastRefill)
redis.call('EXPIRE', key, 3600) -- cleanup: drop idle buckets after an hour

return { allowed, tokens }
`;

class TokenBucket {
  constructor({ redisClient, capacity, refillRate, refillInterval }) {
    this.redisClient = redisClient;
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.refillIntervalMs = refillInterval * 1000;
  }

  async allow(key, cost = 1) {
    const now = Date.now();

    const [allowed, remaining] = await this.redisClient.eval(REFILL_AND_CONSUME_SCRIPT, {
      keys: [key],
      arguments: [
        String(this.capacity),
        String(this.refillRate),
        String(this.refillIntervalMs),
        String(now),
        String(cost),
      ],
    });

    return { allowed: allowed === 1, remaining };
  }
}

module.exports = { TokenBucket };