const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const expressSession = require('express-session')
const cors = require("cors");
const PORT = 3000;

const userRoutes = require('./routes/users'),
      tripRoutes = require('./routes/trips'),
      locationRoutes = require('./routes/locations')
      

mongoose.connect(config.DB_URI).then(() => {
    // if (process.env.NODE_ENV !== 'production') {
      //const fakeDb = new FakeDb();
      // fakeDb.seedDb();
    // }
    console.log("Database Connected")
  });


const app = express();

app.use(bodyParser.json());
app.use(cors())
app.use(
  expressSession({
      secret: "asda2$3w3213askhlkjkldalkl1o8@#",
      saveUninitialized: false,
      resave: false,
    })
  );

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/trips', tripRoutes);
app.use('/api/v1/locations', locationRoutes);


app.listen(PORT , function() {
    console.log('App is running! at port', PORT);
  });

  module.exports = app;