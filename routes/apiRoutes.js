const requireLogin = require('./../middleware/requireLogIn');

const mongoose = require('mongoose');
const User = mongoose.model('user');

module.exports = (app) => {
  app.post('/api/newUser', (req, res, next) => {
    res.send('You are a new user, who should sign up!');
  });

  app.get('/api/userCount', async (req, res, next) => {
    const userCount = await User.find({}).length;

    res.json({ userCount });
  });

  app.get('/api/people', async (req, res, next) => {
    const users = await User.find({});

    res.json(users);
  });

  // TODO: Make route to get userCount for specific state, with optional parameter of city
};
