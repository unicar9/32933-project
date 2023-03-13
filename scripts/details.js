const fs = require('fs');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const addDetails = async () => {
  console.time('scrape job details');

  const jobsWithDetails = [];

  try {
    const jobsData = await fs.promises.readFile('jobs.json', 'utf8');
    const jobs = JSON.parse(jobsData);

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    for (const job of jobs) {
      console.log(
        `Fetching job description for ${job.title} on ${job.site}...`
      );

      await page.goto(job.link, { waitUntil: 'networkidle2' });
      const html = await page.content();
      const $ = cheerio.load(html);

      let description = '';

      switch (job.site) {
        case 'LinkedIn':
          description = $('.description__text--rich').text().trim();

          jobsWithDetails.push({
            ...job,
            description,
          });

          fs.writeFile(
            'LinkedIn.json',
            JSON.stringify(jobsWithDetails),
            (err) => {
              if (err) throw err;
              console.log(
                `${jobsWithDetails.length} LinkedIn Jobs data has been written to LinkedIn.json`
              );
              return;
            }
          );

          break;
        case 'Indeed':
          description = $('.jobsearch-jobDescriptionText').text().trim();

          jobsWithDetails.push({
            ...job,
            description,
          });

          fs.writeFile(
            'Indeed.json',
            JSON.stringify(jobsWithDetails),
            (err) => {
              if (err) throw err;
              console.log(
                `${jobsWithDetails.length} Indeed Jobs data has been written to Indeed.json`
              );
              return;
            }
          );

          break;
        case 'Seek':
          description = $("div[data-automation='jobAdDetails']").text().trim();

          jobsWithDetails.push({
            ...job,
            description,
          });

          fs.writeFile('Seek.json', JSON.stringify(jobsWithDetails), (err) => {
            if (err) throw err;
            console.log(
              `${jobsWithDetails.length} Seek Jobs data has been written to Seek.json`
            );
            return;
          });

          break;
      }

      // Introduce a 1 second delay between processing each job
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    fs.writeFile(
      'jobsWithDetails.json',
      JSON.stringify(jobsWithDetails),
      (err) => {
        if (err) throw err;
        console.log(
          `${jobsWithDetails.length} Jobs data has been written to jobsWithDetails.json`
        );
        return;
      }
    );

    await browser.close();

    console.timeEnd('scrape job details');
  } catch (err) {
    console.error(err);
  }
};

addDetails();
