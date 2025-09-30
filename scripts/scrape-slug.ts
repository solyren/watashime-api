import { config } from 'dotenv';
config();

import { scrapeAllSlugs } from '../src/scrapers/slug-scraper';
import { addToSlugQueue } from '../src/services/queue-service';

// -- Main Function --
async function main() {
  try {
    console.log('Memulai proses scraping slug anime dari Samehadaku...');

    const slugs = await scrapeAllSlugs(10);

    if (slugs.length === 0) {
      console.log('Tidak ada slug yang ditemukan');
      return;
    }

    console.log(
      `Ditemukan ${slugs.length} slug, mulai menambahkan ke queue...`
    );

    // Tambahkan semua slug ke queue
    let addedCount = 0;
    for (const { title, slug } of slugs) {
      const success = await addToSlugQueue({ title, slug });
      if (success) {
        addedCount++;
      }
    }

    console.log(`Berhasil menambahkan ${addedCount} slug ke queue`);

    if (addedCount < slugs.length) {
      console.log(
        `Gagal menambahkan ${slugs.length - addedCount} slug ke queue`
      );
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
