const fs = require('fs');

const jobsData = fs.readFileSync('jobsWithDetailsAndIndex.json', 'utf8');

const jobs = JSON.parse(jobsData);

const jobsWithFeedback = jobs.map((job) => ({ ...job, feedback: null }));

fs.writeFile('jobsData.json', JSON.stringify(jobsWithFeedback), (err) => {
  if (err) throw err;
  console.log(
    `${jobsWithFeedback.length} Jobs data has been written to jobsData.json`
  );
  return;
});
