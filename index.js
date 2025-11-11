const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const tripRouter = require('./routes/tripRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const authRouter = require('./routes/authRoutes.js');

// Load environment variables from .env file
dotenv.config();

// Create an instance of the Express application
const app = express();

// Use middleware to parse JSON data from request bodies
app.use(express.json());


app.use('/api/v1/trips', tripRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);

module.exports = {
  app,
};