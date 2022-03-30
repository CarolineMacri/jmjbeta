// UTILS
const mongoose = require('mongoose');
mongoose.set('debug', true);
const dotenv = require('dotenv').config({ path: '../config.env' });
const Food = require('../models/foodModel');
const User = require('../models/userModel');

main().catch((err) => console.log(err));

async function main() {
  await connectToDatabase();
  const user = await User.findOne({ lastName: 'Linaberry' });
  console.log(user);
  
  
}

async function connectToDatabase() {
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
  await mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
      dbName: 'JMJ',
    })
    .then(() => {
      console.log(`Database successfully connected`);
    });
}
