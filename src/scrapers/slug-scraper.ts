import * as cheerio from 'cheerio';

// -- Interfaces --
interface ScrapedSlug {
  title: string;
  slug: string;
}

interface PageResult {
  slugs: ScrapedSlug[];
  isEmpty: boolean;
}

// -- Scrape Single Page --
export async function scrapePage(
  page: number,
  maxRetries: number = 3
): Promise<PageResult> {
  let retries = 0;

  while (retries <= maxRetries) {
    try {
      const baseUrl =
        process.env.SAMEHADAKU_BASE_URL || 'https://v1.samehadaku.how';
      const url =
        page === 1
          ? `${baseUrl}/daftar-anime-2/`
          : `${baseUrl}/daftar-anime-2/page/${page}/`;

      console.log(
        `Mengambil data dari: ${url} (Percobaan ${retries + 1}/${maxRetries + 1})`
      );

      const response = await fetch(url);

      if (response.status === 404) {
        console.log(`Halaman ${page} tidak ditemukan (404)`);
        return { slugs: [], isEmpty: true };
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      const slugs: ScrapedSlug[] = [];

      $('.relat .animpost').each((index, element) => {
        const title = $(element).find('.data .title h2').text().trim();
        const animeUrl = $(element).find('.animposx a').attr('href');

        if (animeUrl) {
          const urlParts = animeUrl.split('/');
          const slug = urlParts[urlParts.length - 2];

          if (slug) {
            slugs.push({ title, slug });
          }
        }
      });

      const isEmpty = slugs.length === 0;
      console.log(
        `Halaman ${page}: Ditemukan ${slugs.length} slug, isEmpty: ${isEmpty}`
      );

      return { slugs, isEmpty };
    } catch (error) {
      console.error(
        `Error saat scraping halaman ${page} (Percobaan ${retries + 1}):`,
        error
      );

      if (retries === maxRetries) {
        console.log(
          `Gagal scraping halaman ${page} setelah ${maxRetries + 1} percobaan`
        );
        return { slugs: [], isEmpty: true };
      }

      await new Promise((resolve) => setTimeout(resolve, 1000 * (retries + 1)));
      retries++;
    }
  }

  return { slugs: [], isEmpty: true };
}

// -- Process Batch Results --
function processBatchResults(
  results: PageResult[],
  pageBatch: number[],
  uniqueSlugs: Set<string>,
  slugMap: Map<string, ScrapedSlug>
): { hasValidContent: boolean; consecutiveEmptyPages: number } {
  let hasValidContent = false;
  let currentConsecutiveEmptyPages = 0;

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const pageNum = pageBatch[i];

    if (result.isEmpty) {
      currentConsecutiveEmptyPages++;
      console.log(
        `Halaman ${pageNum} kosong. Total halaman kosong berturut-turut: ${currentConsecutiveEmptyPages}`
      );
    } else {
      currentConsecutiveEmptyPages = 0;
      hasValidContent = true;

      for (const slug of result.slugs) {
        if (!uniqueSlugs.has(slug.slug)) {
          uniqueSlugs.add(slug.slug);
          slugMap.set(slug.slug, slug);
        }
      }

      console.log(`Halaman ${pageNum} memiliki ${result.slugs.length} slug`);
    }
  }

  return {
    hasValidContent,
    consecutiveEmptyPages: currentConsecutiveEmptyPages,
  };
}

// -- Scrape All Slugs --
export async function scrapeAllSlugs(
  concurrentLimit: number = 10,
  maxRetries: number = 3
): Promise<ScrapedSlug[]> {
  try {
    console.log('Memulai proses scraping semua slug...');

    const uniqueSlugs = new Set<string>();
    const slugMap = new Map<string, ScrapedSlug>();
    const currentPage = 1;
    let consecutiveEmptyPages = 0;
    const maxConsecutiveEmptyPages = 5;

    while (consecutiveEmptyPages < maxConsecutiveEmptyPages) {
      const pageBatch = createPageBatch(
        currentPage,
        concurrentLimit,
        consecutiveEmptyPages,
        maxConsecutiveEmptyPages
      );

      if (pageBatch.length === 0) break;

      console.log(`Memproses halaman: ${pageBatch.join(', ')}`);

      const results = await processPageBatch(pageBatch, maxRetries);

      const {
        hasValidContent,
        consecutiveEmptyPages: newConsecutiveEmptyPages,
      } = processBatchResults(results, pageBatch, uniqueSlugs, slugMap);

      consecutiveEmptyPages = newConsecutiveEmptyPages;

      if (!hasValidContent) {
        console.log(
          `Tidak ada konten valid dalam batch halaman ${pageBatch.join(', ')}`
        );
      }
    }

    const allSlugs = Array.from(slugMap.values());
    console.log(
      `Proses scraping selesai. Total slug unik yang ditemukan: ${allSlugs.length}`
    );

    return allSlugs;
  } catch (error) {
    console.error('Error saat scraping semua slug:', error);
    return [];
  }
}

// -- Create Page Batch --
function createPageBatch(
  currentPage: number,
  concurrentLimit: number,
  consecutiveEmptyPages: number,
  maxConsecutiveEmptyPages: number
): number[] {
  const pageBatch = [];
  let pageCounter = currentPage;

  for (
    let i = 0;
    i < concurrentLimit && consecutiveEmptyPages < maxConsecutiveEmptyPages;
    i++
  ) {
    pageBatch.push(pageCounter);
    pageCounter++;
  }

  return pageBatch;
}

// -- Process Page Batch --
async function processPageBatch(
  pageBatch: number[],
  maxRetries: number
): Promise<PageResult[]> {
  const pagePromises = pageBatch.map((page) => scrapePage(page, maxRetries));
  return await Promise.all(pagePromises);
}
