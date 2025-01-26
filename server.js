const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
const roomRoutes = require('./src/routes/roomRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');

// Main Routes
app.use('/v1', roomRoutes);
app.use('/v1', reviewRoutes);
app.use('/v1', bookingRoutes);

app.get('/', (req, res) => {
  res.send('Fairview server running');
});

app.listen(port, () => {
  console.log(`Fairview server is running on port ${port}`);
});
