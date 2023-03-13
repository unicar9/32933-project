const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const sites = ['Indeed', 'LinkedIn', 'Seek'];

const test = async () => {
  try {
    const jobsData = await fs.promises.readFile('data/jobs.json', 'utf8');
    const jobs = JSON.parse(jobsData);

    const filtered = (site) => jobs.filter((job) => job.site === site);

    const [indeedJobsOriginal, linkedInJobsOriginal, seekJobsOriginal] =
      sites.map((site) => filtered(site));

    console.log('indeedJobsOriginal: ', indeedJobsOriginal.length);
    console.log('linkedInJobsOriginal: ', linkedInJobsOriginal.length);
    console.log('seekJobsOriginal: ', seekJobsOriginal.length);

    const indeedJobsData = await fs.promises.readFile(
      'data/Indeed.json',
      'utf8'
    );
    const indeedJobs = JSON.parse(indeedJobsData);
    console.log('indeedJobs: ', indeedJobs.length);

    const linkedInJobsData = await fs.promises.readFile(
      'data/LinkedIn.json',
      'utf8'
    );
    const linkedInJobs = JSON.parse(linkedInJobsData);
    console.log('linkedInJobs: ', linkedInJobs.length);

    const seekJobsData = await fs.promises.readFile('data/Seek.json', 'utf8');
    const seekJobs = JSON.parse(seekJobsData);
    console.log('seekJobs: ', seekJobs.length);

    const jobsWithDetails = [...indeedJobs, ...linkedInJobs, ...seekJobs];

    // fs.writeFile(
    //   'jobsWithDetails.json',
    //   JSON.stringify(jobsWithDetails),
    //   (err) => {
    //     if (err) throw err;
    //     console.log(
    //       `${jobsWithDetails.length} Jobs data has been written to jobsWithDetails.json`
    //     );
    //     return;
    //   }
    // );

    const csvWriter = createCsvWriter({
      path: 'jobsWithDetails.csv',
      header: [
        { id: 'site', title: 'Site' },
        { id: 'title', title: 'Job Title' },
        { id: 'company', title: 'Company' },
        { id: 'location', title: 'Location' },
        { id: 'link', title: 'Link' },
        { id: 'description', title: 'Description' },
      ],
    });

    csvWriter.writeRecords(jobsWithDetails).then(() => {
      console.log('Jobs data has been written to jobsWithDetails.csv');
    });
  } catch (err) {
    console.error(err);
  }
};

test();
