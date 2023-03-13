const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

async function scrapeJobs() {
  const jobs = [];
  const baseUrl = 'https://au.indeed.com';
  const positions = [
    'Frontend Developer',
    'Backend Developer',
    'DevOps',
    'Product Manager',
    'UI Designer',
    'UX Designer',
  ];

  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    for (const position of positions) {
      const searchUrl = `${baseUrl}/jobs?q=${position}&l=Australia`;
      console.log('searchUrl: ', searchUrl);

      await page.goto(searchUrl, { waitUntil: 'networkidle2' });
      const html = await page.content();
      const $ = cheerio.load(html);

      $('.resultContent').each(async (i, element) => {
        const title = $(element).find('.jobTitle > a').text().trim();
        console.log('title: ', title);
        const company = $(element).find('.companyName').text().trim();
        const location = $(element).find('.companyLocation').text().trim();
        const link = `${baseUrl}${$(element).find('a').attr('href')}`;

        jobs.push({
          position,
          title,
          company,
          location,
          link,
        });
      });
    }

    await browser.close();
  } catch (error) {
    console.error(error);
  }
}

scrapeJobs();
