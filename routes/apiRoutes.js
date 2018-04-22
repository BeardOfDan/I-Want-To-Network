const requireLogin = require('./../middleware/requireLogIn');

const mongoose = require('mongoose');
const User = mongoose.model('user');

module.exports = (app) => {
  app.post('/api/newUser', (req, res, next) => {
    res.send('You are a new user, who should sign up!');
  });

  app.get('/api/userCount', requireLogin, async (req, res, next) => {
    const userCount = await User.find({}).length;

    res.json({ userCount });
  });

  app.get('/api/people', requireLogin, async (req, res, next) => {
    const users = await User.find({});

    res.json(users);
  });

  app.post('/api/updateProfile', requireLogin, async (req, res, next) => {
    const { linkedin, state, city } = req.body;

    // TODO: check if the variables have a value
    const values = {};

    if ((linkedin) && (typeof linkedin === 'string')) {
      values.linkedin = linkedin;
    }

    if ((state) && (typeof state === 'string')) {
      values.state = state;

      // don't have a city without a state
      if ((city) && (typeof city === 'string')) {
        values.city = city;
      }
    }

    // TODO: update valid variables
    const updatedUser = await mongoose.findOneAndUpdate({ '_id': user.id }, { '$set': values })
      .catch((e) => {
        res.send({ 'error': `Could not update user with id ${user.id}` });
      });

    if ((updatedUser !== undefined) && (updatedUser !== null)) {
      res.user = updatedUser;

      res.json({ 'message': 'You updated your profile!', updatedUser });
    } else {
      // error message was already sent
    }

  }); // end of post '/api/updateProfile'

  // TODO: Make route to get userCount for specific state, with optional parameter of city

};
