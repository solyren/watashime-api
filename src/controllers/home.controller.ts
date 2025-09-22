import { HomeService } from '../services/home.service';

export class HomeController {
  static async getHome(c: any) {
    try {
      const page = parseInt(c.req.query('page') || '1', 10);
      console.log(`[HomeController] Request received for page ${page}`);
      const data = await HomeService.getHomeData(page);
      console.log(`[HomeController] Successfully served data for page ${page}`);
      return c.json(data);
    } catch (error) {
      console.error(`[HomeController] Error serving data for page:`, error);
      return c.json({ error: 'Failed to fetch data' }, 500);
    }
  }
}