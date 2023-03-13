const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

async function scrapeJobs() {
  const jobs = [];
  const baseUrl = 'https://www.seek.com.au';
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
      const searchUrl = `${baseUrl}/${position}-jobs/in-All-Australia`;
      console.log('searchUrl: ', searchUrl);

      await page.goto(searchUrl, { waitUntil: 'networkidle2' });
      const html = await page.content();
      const $ = cheerio.load(html);

      $("article[data-card-type='JobCard']").each(async (i, element) => {
        // const title = $(element).find('h3 > a').text().trim();
        const title = $(element).attr('aria-label');
        console.log('title: ', title);
        const company = $(element)
          .find("a[data-automation='jobCompany']")
          .text()
          .trim();
        console.log('company: ', company);
        const location = $(element)
          .find("a[data-automation='jobLocation']")
          .text()
          .trim();
        console.log('location: ', location);
        const link = `${baseUrl}${$(element).find('a').attr('href')}`;
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
