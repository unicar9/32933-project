const fs = require('fs');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const MAX_RETRIES = 3;

const saveJobDetailsToFile = (site, jobsWithDetails) => {
  fs.writeFile(`${site}.json`, JSON.stringify(jobsWithDetails), (err) => {
    if (err) throw err;
    console.log(
      `${jobsWithDetails.length} ${site} Jobs data has been written to ${site}.json`
    );
  });
};

const getJobDetails = async (page, site) => {
  const html = await page.content();
  const $ = cheerio.load(html);

  let description = '';
  let elements;

  switch (site) {
    case 'LinkedIn':
      description = $('.description__text--rich').text().trim();
      elements = $('.description__text--rich li');
      break;
    case 'Indeed':
      description = $('.jobsearch-jobDescriptionText').text().trim();
      elements = $('.jobsearch-jobDescriptionText li');
      break;
    case 'Seek':
      description = $("div[data-automation='jobAdDetails']").text().trim();
      elements = $("div[data-automation='jobAdDetails'] li");
      break;
  }

  const list = elements.map((i, el) => $(el).text().trim()).get();

  return { description, list };
};

const navigateWithRetries = async (page, job, retries = 0) => {
  try {
    await page.goto(job.link, { waitUntil: 'networkidle2' });
  } catch (err) {
    if (retries < MAX_RETRIES) {
      console.warn(`Retrying ${job.link}... (${retries + 1})`);
      await navigateWithRetries(page, job, retries + 1);
    } else {
      console.error(`Failed to load ${job.link} after ${MAX_RETRIES} retries.`);
      return null;
    }
  }
};

const retryFailedJobs = async (failedJobs, page) => {
  const remainingFailedJobs = [];

  for (const job of failedJobs) {
    console.log(`Retrying failed job ${job.title} on ${job.site}...`);

    const success = await navigateWithRetries(page, job);

    if (success === null) {
      console.warn(`Skipping ${job.title} on ${job.site} again...`);
      remainingFailedJobs.push(job);
      continue;
    }

    const { description, list } = await getJobDetails(page, job.site);

    const jobWithDetails = { ...job, description, list };
    jobsWithDetails.push(jobWithDetails);

    saveJobDetailsToFile(job.site, jobsWithDetails);

    // Introduce a 1.5 second delay between processing each job
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  return remainingFailedJobs;
};

const addDetails = async () => {
  console.time('scrape job details========');

  const jobsWithDetails = [];
  const failedJobs = [];

  try {
    const jobsData = await fs.promises.readFile('jobs-2023-04-21.json', 'utf8');
    const jobs = JSON.parse(jobsData);

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    for (const job of jobs) {
      console.log(
        `Fetching job description for ${job.title} on ${job.site}...`
      );

      const success = await navigateWithRetries(page, job);

      if (success === null) {
        console.warn(`Skipping ${job.title} on ${job.site}...`);
        failedJobs.push(job);
        continue;
      }

      const { description, list } = await getJobDetails(page, job.site);

      const jobWithDetails = { ...job, description, list };
      jobsWithDetails.push(jobWithDetails);

      saveJobDetailsToFile(job.site, jobsWithDetails);

      // Introduce a 1.5 second delay between processing each job
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    console.log(`Retrying ${failedJobs.length} failed jobs...`);
    const remainingFailedJobs = await retryFailedJobs(failedJobs, page);

    if (remainingFailedJobs.length > 0) {
      console.warn(
        `Still failed to fetch ${remainingFailedJobs.length} jobs after retrying.`
      );
    } else {
      console.log('All failed jobs have been successfully retried.');
    }

    fs.writeFile(
      'jobsWithDetails.json',
      JSON.stringify(jobsWithDetails),
      (err) => {
        if (err) throw err;
        console.log(
          `${jobsWithDetails.length} Jobs data has been written to jobsWithDetails.json`
        );
      }
    );

    await browser.close();

    console.timeEnd('scrape job details========');
  } catch (err) {
    console.error(err);
  }
};

addDetails();

// const addDetails = async () => {
//   console.time('scrape job details');

//   const jobsWithDetails = [];

//   try {
//     const jobsData = await fs.promises.readFile('jobs-2023-04-21.json', 'utf8');
//     const jobs = JSON.parse(jobsData);

//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();

//     for (const job of jobs) {
//       console.log(
//         `Fetching job description for ${job.title} on ${job.site}...`
//       );

//       await page.goto(job.link, { waitUntil: 'networkidle2' });
//       const html = await page.content();
//       const $ = cheerio.load(html);

//       let description = '';

//       switch (job.site) {
//         case 'LinkedIn':
//           description = $('.description__text--rich').text().trim();

//           const elements = $('.description__text--rich li');
//           const list = elements.map((i, el) => $(el).text().trim()).get();

//           jobsWithDetails.push({
//             ...job,
//             description,
//             list,
//           });

//           fs.writeFile(
//             'LinkedIn.json',
//             JSON.stringify(jobsWithDetails),
//             (err) => {
//               if (err) throw err;
//               console.log(
//                 `${jobsWithDetails.length} LinkedIn Jobs data has been written to LinkedIn.json`
//               );
//               return;
//             }
//           );

//           break;
//         case 'Indeed':
//           description = $('.jobsearch-jobDescriptionText').text().trim();

//           const indeedElements = $('.jobsearch-jobDescriptionText li');
//           const indeedList = indeedElements
//             .map((i, el) => $(el).text().trim())
//             .get();

//           jobsWithDetails.push({
//             ...job,
//             description,
//             list: indeedList,
//           });

//           fs.writeFile(
//             'Indeed.json',
//             JSON.stringify(jobsWithDetails),
//             (err) => {
//               if (err) throw err;
//               console.log(
//                 `${jobsWithDetails.length} Indeed Jobs data has been written to Indeed.json`
//               );
//               return;
//             }
//           );

//           break;
//         case 'Seek':
//           description = $("div[data-automation='jobAdDetails']").text().trim();

//           const seekElements = $("div[data-automation='jobAdDetails'] li");
//           const seekList = seekElements
//             .map((i, el) => $(el).text().trim())
//             .get();

//           jobsWithDetails.push({
//             ...job,
//             description,
//             list: seekList,
//           });

//           fs.writeFile('Seek.json', JSON.stringify(jobsWithDetails), (err) => {
//             if (err) throw err;
//             console.log(
//               `${jobsWithDetails.length} Seek Jobs data has been written to Seek.json`
//             );
//             return;
//           });

//           break;
//       }

//       // Introduce a 1 second delay between processing each job
//       await new Promise((resolve) => setTimeout(resolve, 1500));
//     }

//     fs.writeFile(
//       'jobsWithDetails.json',
//       JSON.stringify(jobsWithDetails),
//       (err) => {
//         if (err) throw err;
//         console.log(
//           `${jobsWithDetails.length} Jobs data has been written to jobsWithDetails.json`
//         );
//         return;
//       }
//     );

//     await browser.close();

//     console.timeEnd('scrape job details');
//   } catch (err) {
//     console.error(err);
//   }
// };

// addDetails();
