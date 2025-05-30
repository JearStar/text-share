import {
  createClient,
  RedisClientType,
  RedisDefaultModules,
  RedisFunctions,
  RedisScripts,
} from 'redis';

const redisOptions = {
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
};

export const pubClient: RedisClientType<RedisDefaultModules, RedisFunctions, RedisScripts> =
  createClient(redisOptions);
export const subClient: RedisClientType<RedisDefaultModules, RedisFunctions, RedisScripts> =
  pubClient.duplicate();

pubClient.on('error', (err) => console.error('Redis Pub Client Error:', err));
subClient.on('error', (err) => console.error('Redis Sub Client Error:', err));

export async function connectRedis() {
  if (!pubClient.isOpen) {
    await pubClient.connect();
    console.log('Connected to Redis Pub Client');
  }
  if (!subClient.isOpen) {
    await subClient.connect();
    console.log('Connected to Redis Sub Client');
  }
}
