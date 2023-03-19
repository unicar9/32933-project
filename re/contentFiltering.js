const natural = require('natural');
const TfIdf = natural.TfIdf;
const fs = require('fs');
const stringSimilarity = require('string-similarity');

const jobsData = fs.readFileSync('../jobsWithDetails.json', 'utf8');
const jobs = JSON.parse(jobsData);

const users = require('./mockUsers');

// Function to filter jobs based on title similarity
function filterJobsByTitle(user, jobs, titleSimilarityThreshold = 0.5) {
  return jobs.filter((job) => {
    const similarity = stringSimilarity.compareTwoStrings(
      user.title,
      job.title
    );
    return similarity >= titleSimilarityThreshold;
  });
}

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

// Function to tokenize and stem a given text
// which is description from the user profile and the job
function processText(text) {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text);
  const stemmer = natural.PorterStemmer;
  return tokens.map((token) => stemmer.stem(token.toLowerCase()));
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

// Function to calculate job scores based on user profile
function calculateJobScores(userProfile, jobs) {
  const tfidf = new TfIdf();

  // Add user description to the tfidf object
  tfidf.addDocument(processText(userProfile.description));

  // Add job descriptions to the tfidf object
  jobs.forEach((job) => {
    tfidf.addDocument(processText(job.description));
  });

  // Calculate scores based on cosine similarity
  const jobScores = jobs.map((job, index) => {
    const vecA = extractTfidfVector(tfidf, 0);
    const vecB = extractTfidfVector(tfidf, index + 1);
    const similarity = cosineSimilarity(vecA, vecB);
    return {
      job,
      score: similarity,
    };
  });

  return jobScores;
}

// Function to recommend jobs based on user profile
function recommendJobs(user, jobs, topN = 10) {
  // Filter jobs based on title similarity
  const filteredJobs = filterJobsByTitle(user, jobs);

  const jobScores = calculateJobScores(user, filteredJobs);

  // Adjust job scores based on user feedback and location
  jobScores.forEach((jobScore) => {
    if (compareLocation(user.location, jobScore.job.location)) {
      jobScore.score *= 1.1; // Increase the score by 10% for jobs with matching locations
    }
  });

  // Sort job scores in descending order
  jobScores.sort((a, b) => b.score - a.score);

  // Return the top N jobs
  return jobScores.slice(0, topN).map((jobScore) => jobScore.job);
}

// Example usage
const recommendedJobsForUser1 = recommendJobs(users.user1, jobs);
console.log('recommendedJobsForUser1: ', recommendedJobsForUser1);
const recommendedJobsForUser2 = recommendJobs(users.user2, jobs);
console.log('recommendedJobsForUser2: ', recommendedJobsForUser2);
const recommendedJobsForUser3 = recommendJobs(users.user3, jobs);
console.log('recommendedJobsForUser3: ', recommendedJobsForUser3);
