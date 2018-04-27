const requireLogin = require('./../middleware/requireLogIn');

const mongoose = require('mongoose');
const User = mongoose.model('user');

module.exports = (app) => {
  app.post('/api/newUser', (req, res, next) => {
    res.send('You are a new user, who should sign up!');
  });

  app.get('/api/people', requireLogin, async (req, res, next) => {
    const users = await User.find({});

    res.json(users);
  });

  app.post('/api/updateProfile', requireLogin, async (req, res, next) => {
    const { linkedin, state, city } = req.body;

    // TODO: check if the variables have a value
    const values = {};

    if (typeof linkedin === 'string') {
      values.linkedin = linkedin;
    }

    if (typeof state === 'string') {
      values.state = state;

      // don't have a city without a state
      if (typeof city === 'string') {
        values.city = city;
      }
    }

    // TODO: update valid variables
    const updatedUser = await User.findOneAndUpdate({ '_id': user.id }, { '$set': values })
      .catch((e) => {
        res.json({ 'error': `Could not update user with id ${user.id}` });
      });

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

  app.get('/api/userCountbyState:state', async (req, res, next) => {
    const { state } = req.params;

    if (typeof state === 'string') {
      const users = (await User.find({ state }));

      if (users) {
        return res.json(users.length);
      }

      return res.json(0); // None
    }

    res.json({ 'error': 'A valid state is required' });
  });

  //  NOTE: the state is required, otherwise, it won't necessarily be the correct city
  app.get('/api/userCount:state&:city', async (req, res, next) => {
    const { state, city } = req.params;

    console.log(Date.now());
    console.log(`\nstate: ${state}   |   city: ${city}\n`);

    if ((typeof state === 'string') && (typeof city === 'string')) {
      const userCount = (await User.find({ state, city })).length;

      if (userCount) {
        return res.json({ userCount });
      }

      return res.json(0); // None
    }

    res.json({ 'error': 'Both a valid state AND a valid city are required' });
  });
};
