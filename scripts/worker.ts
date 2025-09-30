import { config } from 'dotenv';
config();

import { SamehadakuScraper } from '../src/scrapers/samehadaku.scraper';
import { saveHomeDataToCache } from '../src/services/cache-service';

// -- Scrape Home Pages and Save to Cache --
async function scrapeAndCacheHomePages() {
  try {
    console.log(
      `[${new Date().toISOString()}] Mulai proses scraping halaman home...`
    );

    // Scraping halaman 1-3 dari /anime-terbaru
    for (let page = 1; page <= 3; page++) {
      console.log(`[${new Date().toISOString()}] Scraping halaman ${page}...`);

      try {
        const data = await SamehadakuScraper.scrapeHome(page);

        // Simpan hasil scraping ke cache
        await saveHomeDataToCache(page, data.data, data.hasNextPage);
        console.log(
          `[${new Date().toISOString()}] Berhasil menyimpan halaman ${page} ke cache`
        );
      } catch (error) {
        console.error(
          `[${new Date().toISOString()}] Error saat scraping halaman ${page}:`,
          error
        );
      }
    }

    console.log(
      `[${new Date().toISOString()}] Selesai scraping dan menyimpan halaman home`
    );
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error dalam proses scraping dan cache:`,
      error
    );
  }
}

// -- Main Worker Function --
async function startWorker() {
  console.log(`[${new Date().toISOString()}] Worker dimulai...`);

  // Jalankan scraping home pertama kali
  await scrapeAndCacheHomePages();

  // Setiap 30 menit (1800000 ms) - untuk scraping halaman home
  setInterval(scrapeAndCacheHomePages, 1800000);

  console.log(
    `[${new Date().toISOString()}] Scheduled scraping home dimulai, menunggu 30 menit untuk eksekusi berikutnya...`
  );
}

// -- Start Worker --
startWorker()
  .then(() => {
    console.log(`[${new Date().toISOString()}] Worker telah dimulai...`);
  })
  .catch((error) => {
    console.error(
      `[${new Date().toISOString()}] Error saat memulai worker:`,
      error
    );
  });
