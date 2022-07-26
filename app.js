const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const router = require('./routes');

const { PORT = 3000 } = process.env;
const DB_URL = 'mongodb://localhost:27017/mestodb';
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json());
app.use(helmet());
app.use(limiter);

mongoose.connect(DB_URL);

app.use((req, res, next) => {
  req.user = {
    _id: '62dd2b56203eef6e6e6c0559',
  };
  next();
});
app.use('/', router);
app.listen(PORT);
