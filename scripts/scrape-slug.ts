import { config } from 'dotenv';
config();

import { scrapeAllSlugs } from '../src/scrapers/slug-scraper';
import { saveSlugsToRedis } from '../src/services/redis-service';

// -- Main Function --
async function main() {
  try {
    console.log('Memulai proses scraping slug anime dari Samehadaku...');

    const slugs = await scrapeAllSlugs(10);

    if (slugs.length === 0) {
      console.log('Tidak ada slug yang ditemukan');
      return;
    }

    console.log(`Ditemukan ${slugs.length} slug`);

    const savedCount = await saveSlugsToRedis(slugs);

    console.log(`Berhasil menyimpan ${savedCount} slug ke Redis`);

    if (savedCount < slugs.length) {
      console.log(`Gagal menyimpan ${slugs.length - savedCount} slug`);
    }

    console.log('\nBeberapa slug yang ditemukan:');
    slugs.slice(0, 10).forEach((slug, index) => {
      console.log(`${index + 1}. ${slug.title} -> ${slug.slug}`);
    });
  } catch (error) {
    console.error('Error dalam proses utama:', error);
  }
}

// -- Run Main Function --
main();
