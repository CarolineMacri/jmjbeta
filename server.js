// UTILS
const logger = require('./utils/logger');

// Installed node modules
const mongoose = require('mongoose');
mongoose.set('debug', true);
const dotenv = require('dotenv').config({ path: './config.env' });

shutDownOnUncaughtException();
const app = require('./app');
connectToDatabase();
const server = startListeningWith(app);
shutDownOnUnhandledPromise();

function shutDownOnUncaughtException() {
  process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTIONG! 🔥 Shutting down......');
    console.log(err.name, ' ', err.message);
    logger.log('UNCAUGHT EXCEPTIONG! 🔥 Shutting down......');
    logger.log(err.name, ' ', err.message);
  });
}

function connectToDatabase() {
  const env = process.env.NODE_ENV;
  let DB = '';

  if (env == 'production') {
    DB = process.env.PROD_DATABASE.replace(
      '<PASSWORD>',
      process.env.PROD_DATABASE_PASSWORD
    );
  } else if (env == 'development') {
    DB = process.env.DEV_DATABASE.replace(
      '<PASSWORD>',
      process.env.DEV_DATABASE_PASSWORD
    );
  }
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
      dbName: 'JMJ',
    })
    .then(() => {
      console.log(`DB Connection Successful - ${env}`);
      logger.log(`DB Connection Successful`);
    });
}

function startListeningWith(app) {
  const port = process.env.PORT;
  const server = app.listen(port, () => {
    console.log(`App running on ${port}...`);
    logger.log(`App running on ${port}...`);
  });
  return server;
}

function shutDownOnUnhandledPromise() {
  // final safety net for unhandled promises, shut down gracefully
  process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION');
    console.log(`${err.name}: ${err.message}`); 
    logger.log('UNHANDLED REJECTION');
    logger.log(`${err.name}: ${err.message}`); 

    server.close(() => {
      process.exit(1);
    });
  });
}
