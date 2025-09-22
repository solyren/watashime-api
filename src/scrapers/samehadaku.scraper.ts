import * as cheerio from 'cheerio';
import { HomeResponse } from '../types/home.type';

export class SamehadakuScraper {
  static async scrapeHome(page: number = 1): Promise<HomeResponse> {
    const baseUrl = process.env.SAMEHADAKU_BASE_URL || 'https://v1.samehadaku.how';
    const url = page === 1 
      ? `${baseUrl}/anime-terbaru/` 
      : `${baseUrl}/anime-terbaru/page/${page}/`;
      
    console.log(`[SamehadakuScraper] Scraping page: ${url}`);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch page ${page}. Status: ${response.status}`);
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const animeList: HomeResponse['data'] = [];
      
      $('div.post-show ul li').each((index, element) => {
        const linkElement = $(element).find('a');
        const rawSlug = linkElement.attr('href') || '';
        const title = $(element).find('h2.entry-title').text().trim();
        const coverImage = $(element).find('img').attr('src') || '';
        
        // Extract slug from URL
        const slug = rawSlug.replace(/\/$/, '').split('/').pop() || '';
        
        // Extract last episode
        let lastEpisode: number | null = null;
        const episodeText = $(element).find('div.dtla span').first().text().trim();
        if (episodeText) {
          const match = episodeText.match(/Episode\s*(\d+)/i);
          if (match) {
            lastEpisode = parseInt(match[1], 10);
          }
        }
        
        animeList.push({
          title,
          coverImage,
          slug,
          lastEpisode
        });
      });
      
      console.log(`[SamehadakuScraper] Successfully scraped ${animeList.length} items from page ${page}`);
      return {
        data: animeList,
        currentPage: page,
        hasNextPage: $('div.pagination a.next').length > 0
      };
    } catch (error) {
      console.error(`[SamehadakuScraper] Error scraping page ${page}:`, error);
      throw error;
    }
  }
}