/**
 * Web scraper - Extract data from web sources
 */

import { logger } from '@axxiom/shared';
import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Scrape data from URL
 */
export async function scrapeUrl(params: any): Promise<any> {
  logger.info({ url: params.url, type: params.scrapeType }, 'Scraping URL');

  try {
    // Fetch the page
    const response = await axios.get(params.url, {
      headers: {
        'User-Agent': 'Axxiom Data Ingestion Bot/1.0',
      },
      timeout: 30000,
    });

    const $ = cheerio.load(response.data);

    // Extract data based on scrape type
    let extractedData: any = {};

    if (params.scrapeType === 'listing') {
      extractedData = {
        title: $('h1').first().text().trim(),
        price: extractPrice($),
        description: $('p.description, div.description').text().trim(),
        features: extractList($, 'ul.features li, div.features li'),
        images: extractImages($),
      };
    } else if (params.scrapeType === 'rental_data') {
      extractedData = {
        averageRent: extractPrice($),
        listings: extractListings($),
      };
    } else if (params.custom && params.selectors) {
      // Custom scraping with user-provided selectors
      for (const [key, selector] of Object.entries(params.selectors)) {
        extractedData[key] = $(selector as string).text().trim();
      }
    }

    logger.info({ url: params.url }, 'Web scraping completed');

    return {
      url: params.url,
      scrapedAt: new Date(),
      data: extractedData,
    };
  } catch (err) {
    logger.error({ err, url: params.url }, 'Web scraping failed');
    throw err;
  }
}

/**
 * Helper: Extract price from page
 */
function extractPrice($: cheerio.CheerioAPI): number | null {
  const priceText = $('.price, span.price, div.price').first().text();
  const match = priceText.match(/[\d,]+/);
  return match ? parseInt(match[0].replace(/,/g, '')) : null;
}

/**
 * Helper: Extract list items
 */
function extractList($: cheerio.CheerioAPI, selector: string): string[] {
  const items: string[] = [];
  $(selector).each((i, el) => {
    items.push($(el).text().trim());
  });
  return items;
}

/**
 * Helper: Extract images
 */
function extractImages($: cheerio.CheerioAPI): string[] {
  const images: string[] = [];
  $('img[src]').each((i, el) => {
    const src = $(el).attr('src');
    if (src && !src.startsWith('data:')) {
      images.push(src);
    }
  });
  return images;
}

/**
 * Helper: Extract rental listings
 */
function extractListings($: cheerio.CheerioAPI): any[] {
  const listings: any[] = [];
  $('.listing, div.listing, article.listing').each((i, el) => {
    const $listing = $(el);
    listings.push({
      address: $listing.find('.address').text().trim(),
      rent: extractPrice($listing),
      sqft: parseInt($listing.find('.sqft').text().replace(/[^\d]/g, '') || '0'),
    });
  });
  return listings;
}
