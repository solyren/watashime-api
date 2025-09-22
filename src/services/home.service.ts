import { SamehadakuScraper } from '../scrapers/samehadaku.scraper';
import { HomeResponse } from '../types/home.type';

export class HomeService {
  static async getHomeData(page: number = 1): Promise<HomeResponse> {
    try {
      console.log(`[HomeService] Fetching home data for page ${page}`);
      const data = await SamehadakuScraper.scrapeHome(page);
      console.log(`[HomeService] Successfully fetched data for page ${page}`);
      return data;
    } catch (error) {
      console.error(
        `[HomeService] Error fetching home data for page ${page}:`,
        error
      );
      throw error;
    }
  }
}
