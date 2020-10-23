const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const peopleRouter = require('./controllers/people');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');
const morgan = require('morgan');

logger.info(`Server running on port ${config.PORT}`);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((err) => {
    logger.error('Error connecting to MongoDB', err.message);
  });

mongoose.set('useFindAndModify', false);
app.use(cors());
app.use(express.static('build'));
app.use(express.json());

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});
app.use(morgan(':method :url :response-time :body'));

app.use('/api/people/', peopleRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
