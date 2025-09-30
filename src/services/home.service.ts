import { SamehadakuScraper } from '../scrapers/samehadaku.scraper';
import { HomeResponse } from '../types/home.type';
import { getHomeDataFromCache, saveHomeDataToCache } from './cache-service';

export class HomeService {
  static async getHomeData(page: number = 1): Promise<HomeResponse> {
    try {
      console.log(`[HomeService] Fetching home data for page ${page}`);

      // Coba ambil dari cache dulu
      const cachedData = await getHomeDataFromCache(page);

      if (cachedData) {
        console.log(
          `[HomeService] Menggunakan data dari cache untuk halaman ${page}`
        );
        return {
          data: cachedData.data,
          currentPage: page,
          hasNextPage: cachedData.hasNextPage,
        };
      }

      // Jika tidak ada di cache, lakukan scraping
      const scrapedData = await SamehadakuScraper.scrapeHome(page);

      // Simpan hasil scraping ke cache
      await saveHomeDataToCache(
        page,
        scrapedData.data,
        scrapedData.hasNextPage
      );

      console.log(
        `[HomeService] Berhasil mengambil dan menyimpan data untuk halaman ${page}`
      );
      return scrapedData;
    } catch (error) {
      console.error(
        `[HomeService] Error fetching home data for page ${page}:`,
        error
      );
      throw error;
    }
  }
}
