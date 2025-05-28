import { createClient } from 'redis';

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

client.on('error', (err) => console.error('Redis error:', err));

export async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
    console.log('Connected to Redis');
  }
}

export default client;
