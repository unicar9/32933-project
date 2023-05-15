const natural = require('natural');
const TfIdf = natural.TfIdf;
const fs = require('fs');

const jobsData = fs.readFileSync('jobsWithDetails.json', 'utf8');
const jobs = JSON.parse(jobsData);

const users = require('./mockUsers');
const JaroWinklerDistance = natural.JaroWinklerDistance;

const tokenizer = new natural.WordTokenizer();
const stopwords = new Set(natural.stopwords);

const processTextForTfidf = (text) => {
  const tokens = tokenizer
    .tokenize(text.toLowerCase())
    .filter((word) => !stopwords.has(word))
    .map((word) => natural.PorterStemmer.stem(word));

  return tokens;
};

function createAbbreviations(locationPart) {
  const words = locationPart.split(' ');
  const abbreviation = words.map((word) => word.charAt(0)).join('');
  const fullWords = words.join('');

  return [abbreviation, fullWords];
}

function compareLocation(userLocation, jobLocation) {
  // Split locations into parts
  const userLocationParts = userLocation
    .split(',')
    .flatMap(createAbbreviations);

  const jobLocationParts = jobLocation.split(',').flatMap(createAbbreviations);

  // Check if any of the location parts match
  for (const userPart of userLocationParts) {
    for (const jobPart of jobLocationParts) {
      if (userPart.toLowerCase() === jobPart.toLowerCase()) {
        return true;
      }
    }
  }

  return false;
}

// Function to calculate cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce(
    (acc, value, index) => acc + value * vecB[index],
    0
  );
  const magnitudeA = Math.sqrt(
    vecA.reduce((acc, value) => acc + value * value, 0)
  );
  const magnitudeB = Math.sqrt(
    vecB.reduce((acc, value) => acc + value * value, 0)
  );

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

// Function to extract tf-idf vector from a document
function extractTfidfVector(tfidf, documentIndex) {
  const vector = [];
  const terms = tfidf.listTerms(documentIndex);
  for (const term of terms) {
    vector.push(term.tfidf);
  }
  return vector;
}

const calculateJobScores = (userProfile, jobs) => {
  const userDescriptionProcessed = processTextForTfidf(userProfile.description);
  const jobDescriptionsProcessed = jobs.map((job) =>
    processTextForTfidf(job.description)
  );

  const allDocuments = [userDescriptionProcessed].concat(
    jobDescriptionsProcessed
  );

  const tfidf = new TfIdf();

  allDocuments.forEach((doc) => {
    tfidf.addDocument(doc);
  });

  const userVector = extractTfidfVector(tfidf, 0);

  const jobScores = jobs.map((job, index) => {
    const jobVector = extractTfidfVector(tfidf, index + 1);
    const similarity = cosineSimilarity(userVector, jobVector);
    return {
      job,
      score: similarity,
    };
  });

  return jobScores;
};

// Function to recommend jobs based on user profile
function recommendJobs(
  user,
  jobs,
  titleThreshold = 0.8,
  topN = 50,
  likedJobs = [],
  dislikedJobs = []
) {
  // Filter jobs based on title similarity
  const filteredJobs = jobs.filter((job) => {
    const jobTitle = job.title.toLowerCase();
    const userTitle = user.title.toLowerCase();
    const titleSimilarity = JaroWinklerDistance(userTitle, jobTitle, {});
    return titleSimilarity >= titleThreshold;
  });

  // const jobScores = calculateJobScores(user, jobs);
  const jobScores = calculateJobScores(user, filteredJobs);

  // Adjust job scores based on user feedback and location
  jobScores.forEach((jobScore) => {
    if (compareLocation(user.location, jobScore.job.location)) {
      jobScore.score *= 1.01; // Increase the score by 1% for jobs with matching locations
    }

    if (likedJobs.some((likedJob) => likedJob.index === jobScore.job.index)) {
      jobScore.score *= 1.2;
    }

    if (
      dislikedJobs.some(
        (dislikedJob) => dislikedJob.index === jobScore.job.index
      )
    ) {
      jobScore.score *= 0.6;
    }
  });

  // Sort job scores in descending order
  jobScores.sort((a, b) => b.score - a.score);

  // Return the top N jobs
  return jobScores.slice(0, topN).map((jobScore) => jobScore.job);
}

// Example usage
const recommendedJobsForUser3 = recommendJobs(users.user3, jobs);
console.log(
  'recommendedJobsForUser3: ',
  recommendedJobsForUser3
    .map((job) => job.jobType)
    .filter((x) => x === 'DevOps').length
);
