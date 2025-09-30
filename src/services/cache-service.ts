import { Redis } from '@upstash/redis';
import { redisConfig } from '../config/redis';
import { HomeAnime } from '../types/home.type';

// -- Initialize Redis Client --
let redis: Redis | null = null;

if (redisConfig.url && redisConfig.token) {
  redis = new Redis({
    url: redisConfig.url,
    token: redisConfig.token,
  });
} else {
  console.warn(
    'Konfigurasi Redis tidak ditemukan. Operasi Cache akan dilewati.'
  );
}

// -- Save Home Data to Cache --
export async function saveHomeDataToCache(
  page: number,
  data: HomeAnime[],
  hasNextPage: boolean
): Promise<boolean> {
  if (!redis) {
    console.warn('Redis tidak dikonfigurasi. Melewati penyimpanan ke cache.');
    return false;
  }

  try {
    const cacheKey = `home:page:${page}`;
    const cacheData = {
      data,
      hasNextPage,
      timestamp: Date.now(),
    };

    // Simpan dengan expiry 30 menit (1800 detik)
    await redis.setex(cacheKey, 1800, JSON.stringify(cacheData));
    console.log(`Berhasil menyimpan halaman ${page} ke cache`);
    return true;
  } catch (error) {
    console.error('Error saat menyimpan data ke cache:', error);
    return false;
  }
}

// -- Get Home Data from Cache --
export async function getHomeDataFromCache(page: number): Promise<{
  data: HomeAnime[];
  hasNextPage: boolean;
  timestamp: number;
} | null> {
  if (!redis) {
    console.warn('Redis tidak dikonfigurasi. Mengembalikan null.');
    return null;
  }

  try {
    const cacheKey = `home:page:${page}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log(`Mengambil data halaman ${page} dari cache`);
      return typeof cachedData === 'string'
        ? JSON.parse(cachedData)
        : cachedData;
    }

    console.log(`Data halaman ${page} tidak ditemukan di cache`);
    return null;
  } catch (error) {
    console.error('Error saat mengambil data dari cache:', error);
    return null;
  }
}

// -- Save Anime Detail to Cache --
export async function saveAnimeDetailToCache(
  slug: string,
  data: HomeAnime
): Promise<boolean> {
  if (!redis) {
    console.warn('Redis tidak dikonfigurasi. Melewati penyimpanan ke cache.');
    return false;
  }

  try {
    const cacheKey = `anime:detail:${slug}`;
    const cacheData = {
      ...data,
      timestamp: Date.now(),
    };

    // Simpan dengan expiry 1 jam (3600 detik)
    await redis.setex(cacheKey, 3600, JSON.stringify(cacheData));
    console.log(`Berhasil menyimpan detail anime ${slug} ke cache`);
    return true;
  } catch (error) {
    console.error('Error saat menyimpan detail anime ke cache:', error);
    return false;
  }
}

// -- Get Anime Detail from Cache --
export async function getAnimeDetailFromCache(
  slug: string
): Promise<HomeAnime | null> {
  if (!redis) {
    console.warn('Redis tidak dikonfigurasi. Mengembalikan null.');
    return null;
  }

  try {
    const cacheKey = `anime:detail:${slug}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log(`Mengambil detail anime ${slug} dari cache`);
      const parsedData =
        typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
      const animeData = { ...parsedData };
      delete animeData.timestamp;
      return animeData;
    }

    console.log(`Detail anime ${slug} tidak ditemukan di cache`);
    return null;
  } catch (error) {
    console.error('Error saat mengambil detail anime dari cache:', error);
    return null;
  }
}

// -- Clear Home Page Cache --
export async function clearHomeCache(): Promise<boolean> {
  if (!redis) {
    console.warn('Redis tidak dikonfigurasi. Melewati penghapusan cache.');
    return false;
  }

  try {
    // Hapus semua cache home page
    const keys = await redis.keys('home:page:*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    console.log('Berhasil membersihkan cache home page');
    return true;
  } catch (error) {
    console.error('Error saat membersihkan cache home page:', error);
    return false;
  }
}
