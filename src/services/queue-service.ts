import { Redis } from '@upstash/redis';
import { redisConfig } from '../config/redis';

// -- Initialize Redis Client --
let redis: Redis | null = null;

if (redisConfig.url && redisConfig.token) {
  redis = new Redis({
    url: redisConfig.url,
    token: redisConfig.token,
  });
} else {
  console.warn(
    'Konfigurasi Redis tidak ditemukan. Operasi Queue akan dilewati.'
  );
}

// -- Add Slug to Queue --
export async function addToSlugQueue(slugItem: {
  title: string;
  slug: string;
}): Promise<boolean> {
  if (!redis) {
    console.warn('Redis tidak dikonfigurasi. Melewati penambahan ke queue.');
    return false;
  }

  try {
    const queueKey = 'slugs:queue';

    // Cek apakah slug sudah ada di queue
    const queueSize = await redis.llen(queueKey);
    for (let i = 0; i < queueSize; i++) {
      const item = await redis.lindex(queueKey, i);
      if (item && typeof item === 'string') {
        const parsedItem = JSON.parse(item);
        if (parsedItem.slug === slugItem.slug) {
          console.log(`Slug ${slugItem.slug} sudah ada di queue, dilewati`);
          return false;
        }
      }
    }

    // Tambahkan slug ke queue
    await redis.rpush(queueKey, JSON.stringify(slugItem));
    console.log(
      `Berhasil menambahkan slug "${slugItem.title}" (${slugItem.slug}) ke queue`
    );
    return true;
  } catch (error) {
    console.error('Error saat menambahkan slug ke queue:', error);
    return false;
  }
}

// -- Get Next Slug from Queue --
export async function getNextSlugFromQueue(): Promise<{
  title: string;
  slug: string;
} | null> {
  if (!redis) {
    console.warn('Redis tidak dikonfigurasi. Mengembalikan null.');
    return null;
  }

  try {
    const queueKey = 'slugs:queue';
    const slugItem = await redis.lpop(queueKey);

    if (slugItem && typeof slugItem === 'string') {
      console.log('Mengambil item dari queue:', slugItem);
      return JSON.parse(slugItem);
    }

    return null;
  } catch (error) {
    console.error('Error saat mengambil slug dari queue:', error);
    return null;
  }
}

// -- Get Queue Length --
export async function getQueueLength(): Promise<number> {
  if (!redis) {
    console.warn('Redis tidak dikonfigurasi. Mengembalikan 0.');
    return 0;
  }

  try {
    const queueKey = 'slugs:queue';
    return await redis.llen(queueKey);
  } catch (error) {
    console.error('Error saat menghitung panjang queue:', error);
    return 0;
  }
}

// -- Get All Slugs in Queue --
export async function getAllSlugsInQueue(): Promise<
  { title: string; slug: string }[]
> {
  if (!redis) {
    console.warn('Redis tidak dikonfigurasi. Mengembalikan array kosong.');
    return [];
  }

  try {
    const queueKey = 'slugs:queue';
    const items = await redis.lrange(queueKey, 0, -1);
    return items.map((item) => JSON.parse(item));
  } catch (error) {
    console.error('Error saat mengambil semua slug dari queue:', error);
    return [];
  }
}
