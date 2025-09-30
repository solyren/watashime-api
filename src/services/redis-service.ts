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
    'Konfigurasi Redis tidak ditemukan. Operasi Redis akan dilewati.'
  );
}

// -- Save Slugs to Redis --
export async function saveSlugsToRedis(
  slugs: { title: string; slug: string }[]
): Promise<number> {
  if (!redis) {
    console.warn('Redis tidak dikonfigurasi. Melewati penyimpanan ke Redis.');
    return 0;
  }

  try {
    console.log(`Menyimpan ${slugs.length} slug ke Redis...`);

    const hashData: Record<string, string> = {};

    for (const { title, slug } of slugs) {
      hashData[slug] = title;
    }

    await redis.hset('slugs:samehadaku', hashData);

    console.log(
      `Berhasil menyimpan ${slugs.length} slug ke Redis dengan key 'slugs:samehadaku'`
    );
    return slugs.length;
  } catch (error) {
    console.error('Error saat menyimpan slug ke Redis:', error);
    return 0;
  }
}

// -- Get All Slugs from Redis --
export async function getAllSlugsFromRedis(): Promise<
  { title: string; slug: string }[]
> {
  if (!redis) {
    console.warn('Redis tidak dikonfigurasi. Mengembalikan array kosong.');
    return [];
  }

  try {
    console.log('Mengambil semua slug dari Redis...');

    const hashData = await redis.hgetall('slugs:samehadaku');

    if (!hashData) {
      console.log('Tidak ada slug yang ditemukan di Redis');
      return [];
    }

    const slugs = Object.entries(hashData).map(([slug, title]) => ({
      slug,
      title: title as string,
    }));

    console.log(`Berhasil mengambil ${slugs.length} slug dari Redis`);
    return slugs;
  } catch (error) {
    console.error('Error saat mengambil slug dari Redis:', error);
    return [];
  }
}

// -- Clear All Slugs from Redis --
export async function clearAllSlugsFromRedis(): Promise<boolean> {
  if (!redis) {
    console.warn('Redis tidak dikonfigurasi. Tidak ada yang dihapus.');
    return false;
  }

  try {
    console.log('Menghapus semua slug dari Redis...');

    await redis.del('slugs:samehadaku');

    console.log('Berhasil menghapus semua slug dari Redis');
    return true;
  } catch (error) {
    console.error('Error saat menghapus slug dari Redis:', error);
    return false;
  }
}
