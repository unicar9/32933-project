const cheerio = require('cheerio');
const fs = require('fs');
const puppeteer = require('puppeteer');

const scrapeJobs = async () => {
  console.time('scrapeJobs');

  const jobSites = [
    { name: 'Indeed', baseUrl: 'https://au.indeed.com' },
    {
      name: 'LinkedIn',
      baseUrl:
        'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search',
    },
    { name: 'Seek', baseUrl: 'https://www.seek.com.au' },
  ];

  const jobTypes = [
    { name: 'Frontend Developer', query: 'frontend+developer' },
    { name: 'Backend Developer', query: 'backend+developer' },
    { name: 'Software Engineer', query: 'software+engineer' },
    { name: 'DevOps', query: 'devops' },
    { name: 'Product Manager', query: 'product+manager' },
    { name: 'UI/UX Designer', query: 'ui+ux+designer' },
  ];

  const jobs = [];

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Scrape job postings for each job site and job type
  for (const site of jobSites) {
    for (const jobType of jobTypes) {
      console.log(`Searching for ${jobType.name} jobs on ${site.name}...`);

      let url = '';

      switch (site.name) {
        case 'LinkedIn':
          url = `${site.baseUrl}/?keywords=${jobType.query}&location=Australia`;
          break;
        case 'Indeed':
          url = `${site.baseUrl}/jobs?q=${jobType.query}&l=Australia`;
          console.log('url: ', url);
          break;
        case 'Seek':
          url = `${site.baseUrl}/${jobType.query}-jobs/in-All-Australia`;
          break;
      }

      await page.goto(url, { waitUntil: 'networkidle2' });
      const html = await page.content();
      const $ = cheerio.load(html);

      switch (site.name) {
        case 'Indeed':
          console.log('Indeed: ');
          $('.resultContent').each((i, element) => {
            console.log('element: ', element);
            console.log('resultContent: ');
            const title = $(element).find('.jobTitle > a').text().trim();
            console.log('title: ', title);
            const company = $(element).find('.companyName').text().trim();
            const location = $(element).find('.companyLocation').text().trim();
            const link = `${site.baseUrl}${$(element).find('a').attr('href')}`;

            jobs.push({
              site: site.name,
              title,
              company,
              location,
              link,
            });
          });

          break;
        case 'LinkedIn':
          console.log('LinkedIn: ');

          $('.job-search-card').each((i, element) => {
            const title = $(element)
              .find('.base-search-card__title')
              .text()
              .trim();
            console.log('title: ', title);

            const company = $(element)
              .find('.base-search-card__subtitle')
              .text()
              .trim();

            const location = $(element)
              .find('.job-search-card__location')
              .first()
              .text()
              .trim();

            const link = $(element).find('a').attr('href');

            jobs.push({
              site: site.name,
              title,
              company,
              location,
              link,
            });
          });
          break;
        case 'Seek':
          $("article[data-card-type='JobCard']").each((i, element) => {
            const title = $(element).attr('aria-label');
            const company = $(element)
              .find("a[data-automation='jobCompany']")
              .text()
              .trim();
            const location = $(element)
              .find("a[data-automation='jobLocation']")
              .text()
              .trim();
            const link = `${site.baseUrl}${$(element).find('a').attr('href')}`;

            jobs.push({
              site: site.name,
              title,
              company,
              location,
              link,
            });
          });
          break;
      }
    }
  }

  fs.writeFile('jobs.json', JSON.stringify(jobs), (err) => {
    if (err) throw err;
    console.log(`${jobs.length} Jobs data has been written to jobs.json`);
    return;
  });

  await browser.close();
  console.timeEnd('scrapeJobs');
};

scrapeJobs();
