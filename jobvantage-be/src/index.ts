import express from 'express';
import { register, login } from './routes';
import {
  createUserProfileRoute,
  getUserProfileByIdRoute,
  getUserProfileByUsernameRoute,
  updateUserProfileRoute,
  deleteUserProfileRoute,
  getAllUserProfileByUserIdRoute,
} from './routes/userProfileRoutes';
import {
  createJobRecommendationsRoute,
  updateJobRecommendationsRoute
} from './routes/jobRecommendationsRoutes';
import { authenticateJWT } from './middleware/authenticateJWT';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.post('/register', register);
app.post('/login', login);

app.post('/user-profile', authenticateJWT, createUserProfileRoute);
app.get('/user-profile', authenticateJWT, getAllUserProfileByUserIdRoute);
app.get('/user-profile/:id', authenticateJWT, getUserProfileByIdRoute);
app.get(
  '/user-profile/username/:username',
  authenticateJWT,
  getUserProfileByUsernameRoute
);
app.put('/user-profile', authenticateJWT, updateUserProfileRoute);
app.delete('/user-profile/:id', authenticateJWT, deleteUserProfileRoute);

app.post('/recommendations', authenticateJWT, createJobRecommendationsRoute);
app.post('/feedback', authenticateJWT, updateJobRecommendationsRoute);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
