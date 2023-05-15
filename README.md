# 32933 Project - Job Recommendations System

This project is a job recommendations system built using React and Node.js. It provides job recommendations to users based on their profiles and allows users to provide feedback on the recommended jobs.

## Overview

This project uses job posting data scraped from LinkedIn, Seek, and Indeed. All job positions are within the IT industry. The purpose of this project is for research and educational use only.

The recommendation algorithm used in this project is primarily content-filtering with the use of Term Frequency-Inverse Document Frequency (TF-IDF) calculations. It calculates the similarity between a user's profile and job descriptions to generate personalized job recommendations.

### Frontend

The frontend of the project is built using React and Chakra UI. It includes pages for user registration, login, job recommendations, and feedback submission.

- `Register` and `Login`: Users can register and login to the system.
- `Job Recommendations`: Once logged in, users are provided with job recommendations based on their profile.
- `Feedback`: Users can give feedback on the recommended jobs by clicking "Like" or "Dislike". This feedback is used to update the job recommendations.

### Backend

The backend of the project is built using Node.js and Express. It includes routes for user registration, login, job recommendation creation, and feedback submission.

- `Registration` and `Login`: Routes for user registration and login.
- `Job Recommendations`: Route for creating job recommendations based on user profile and feedback.
- `Feedback`: Route for submitting feedback on recommended jobs.

Feedback data is stored in a JSON file, `feedback.json`, with each user's feedback saved under their user profile ID.

## Installation

To install the project, clone the repository and install the dependencies:

```sh
git clone https://github.com/unicar9/32933-project.git

cd jobvantage-fe
npm install

cd jobvantage-be
npm install
```

## Running the Project

To start the frontend and backend servers, use the following commands:

```sh
# Start the frontend server
npm run start

# Start the backend server
npm run start
```

## Usage

1. Register or login to the system.
2. View the job recommendations provided based on your profile.
3. Give feedback on the recommended jobs by clicking "Like" or "Dislike".
4. Submit your feedback to update the job recommendations.
