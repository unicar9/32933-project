const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

async function scrapeJobs() {
  const jobs = [];
  const baseUrl =
    'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search';
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
      const searchUrl = `${baseUrl}/?keywords=${position}&location=Australia`;
      console.log('searchUrl: ', searchUrl);

      await page.goto(searchUrl, { waitUntil: 'networkidle2' });
      const html = await page.content();
      const $ = cheerio.load(html);

      $('.job-search-card').each(async (i, element) => {
        const title = $(element).find('.base-search-card__title').text().trim();
        console.log('title: ', title);

        const company = $(element)
          .find('.base-search-card__subtitle')
          .text()
          .trim();
        console.log('company: ', company);

        const location = $(element)
          .find('.job-search-card__location')
          .first()
          .text()
          .trim();
        console.log('location: ', location);

        const link = $(element).find('a').attr('href');
        console.log('link: ', link);

        jobs.push({
          position,
          title,
          company,
          location,
          link,
        });

        await new Promise((resolve) => setTimeout(resolve, 5000));
      });
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    console.log('jobs: ', jobs);

    await browser.close();
  } catch (error) {
    console.error(error);
  }
}

scrapeJobs();
