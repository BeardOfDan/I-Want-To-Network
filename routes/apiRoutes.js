const requireLogin = require('./../middleware/requireLogIn');

const mongoose = require('mongoose');
const User = mongoose.model('user');

const _ = require('lodash');

module.exports = (app) => {
  app.post('/api/newUser', (req, res, next) => {
    res.send('You are a new user, who should sign up!');
  });

  app.get('/api/people', requireLogin, async (req, res, next) => {
    const users = await User.find({});

    res.json(users);
  });

  app.post('/api/updateProfile', requireLogin, async (req, res, next) => {
    const user = req.user;

    const { linkedIn, state, city } = req.body;
    const values = {};

    if (typeof linkedIn === 'string') {
      values.linkedin = linkedIn;
    }

    if (typeof state === 'string') {
      values.state = state;

      // don't have a city without a state
      if (typeof city === 'string') {
        values.city = city;
      }
    }

    console.log('\nvalues:\n' + JSON.stringify(values, undefined, 2));

    const updatedUser = await User.findOneAndUpdate({ '_id': user.id }, { '$set': values }, { 'new': true })
      .catch((e) => {
        res.json({ 'error': `Could not update user with id ${user.id}` });
      });

    console.log('\nupdatedUser:\n' + JSON.stringify(updatedUser, undefined, 2));

    if ((updatedUser !== undefined) && (updatedUser !== null)) {
      res.user = updatedUser;

      res.json({ 'message': 'You updated your profile!', updatedUser });
    } else {
      // error message was already sent in catch
    }

  }); // end of post '/api/updateProfile'

  // NOTE: User does NOT need to be logged in to see this
  app.get('/api/userCount', async (req, res, next) => {
    const userCount = (await User.find({})).length;

    res.json(userCount);
  });

  app.get('/api/userCountFiltered/:state', requireLogin, async (req, res, next) => {
    const { state } = req.params;
    const city = req.query.city;

    const userCount = city ? (await User.find({ state, city })).length : (await User.find({ state })).length;
    const location = city ? `${city}, ${state}` : state;

    return res.json({ userCount, location });
  });

};
