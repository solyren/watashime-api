import * as cheerio from 'cheerio';
import { HomeResponse, HomeAnime } from '../types/home.type';

export class SamehadakuScraper {
  static async scrapeHome(page: number = 1): Promise<HomeResponse> {
    const baseUrl =
      process.env.SAMEHADAKU_BASE_URL || 'https://v1.samehadaku.how';
    const url =
      page === 1
        ? `${baseUrl}/anime-terbaru/`
        : `${baseUrl}/anime-terbaru/page/${page}/`;

    console.log(`[SamehadakuScraper] Scraping page: ${url}`);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch page ${page}. Status: ${response.status}`
        );
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      const animeList: HomeResponse['data'] = [];

      $('div.post-show ul li').each((index, element) => {
        const linkElement = $(element).find('a');
        const rawSlug = linkElement.attr('href') || '';
        const title = $(element).find('h2.entry-title').text().trim();
        const coverImage = $(element).find('img').attr('src') || '';

        const slug = rawSlug.replace(/\/$/, '').split('/').pop() || '';

        let lastEpisode: number | null = null;
        const episodeText = $(element)
          .find('div.dtla span')
          .first()
          .text()
          .trim();
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
          lastEpisode,
        });
      });

      console.log(
        `[SamehadakuScraper] Successfully scraped ${animeList.length} items from page ${page}`
      );
      return {
        data: animeList,
        currentPage: page,
        hasNextPage: $('div.pagination a.next').length > 0,
      };
    } catch (error) {
      console.error(`[SamehadakuScraper] Error scraping page ${page}:`, error);
      throw error;
    }
  }

  // -- Scrape Anime Detail by Slug --
  static async scrapeAnimeBySlug(slug: string): Promise<HomeAnime | null> {
    const baseUrl =
      process.env.SAMEHADAKU_BASE_URL || 'https://v1.samehadaku.how';
    const url = `${baseUrl}/anime/${slug}/`;

    console.log(`[SamehadakuScraper] Scraping anime detail: ${url}`);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          console.log(
            `[SamehadakuScraper] Anime dengan slug ${slug} tidak ditemukan (404)`
          );
          return null;
        }
        throw new Error(
          `Failed to fetch anime with slug ${slug}. Status: ${response.status}`
        );
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      const title =
        $('div.infoanime h1').text().trim() ||
        $('.entry-title').text().trim() ||
        slug;

      const coverImage =
        $('div.infoanime div.thumb img').attr('src') ||
        $('.thumb img').attr('src') ||
        '';

      let lastEpisode: number | null = null;
      $('div.episodelist ul li').each((index, element) => {
        if (index === 0) {
          const episodeText = $(element).find('a').text().trim();
          const match = episodeText.match(/Episode\\s*(\\d+)/i);
          if (match) {
            lastEpisode = parseInt(match[1], 10);
          }
        }
      });

      const animeDetail: HomeAnime = {
        title,
        coverImage,
        slug,
        lastEpisode,
      };

      console.log(
        `[SamehadakuScraper] Successfully scraped anime detail for ${slug}`
      );
      return animeDetail;
    } catch (error) {
      console.error(
        `[SamehadakuScraper] Error scraping anime with slug ${slug}:`,
        error
      );
      throw error;
    }
  }
}
