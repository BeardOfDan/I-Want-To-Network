const express = require('express');
const app = express();

const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');

const PORT = process.env.PORT || 5000;
const KEYS = require('./config/keys');

express.json();

mongoose.connect(KEYS.mongoURI);

app.use(
  cookieSession({
    'maxAge': 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    'keys': [KEYS.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Model(s)
require('./models/User');

require('./services/passport');

// Routes
require('./routes/authRoutes')(app);
require('./routes/apiRoutes')(app);

app.get('/', (req, res, next) => {
  res.send('Do you want to network?');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
