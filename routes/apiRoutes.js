const requireLogin = require('./../middleware/requireLogIn');

const mongoose = require('mongoose');
const User = mongoose.model('user');

const getMatchingUsers = async (criteria, user) => {
  const { state, city } = user;

  switch (criteria) {
    case 'state':
      return await User.find({ state });

    case 'city':
      return await User.find({ state, city });

    case 'distance':

      break;

    default:
  }
};

module.exports = (app) => {
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

    const updatedUser = await User.findOneAndUpdate({ '_id': user.id }, { '$set': values }, { 'new': true })
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

  app.post('/api/userCountFiltered/:state', requireLogin, async (req, res, next) => {
    const { state } = req.params;
    const { criteria, city, distance } = req.body;

    const matches = await getMatchingUsers(criteria, req.user);

    const userCount = matches.length;
    const location = city ? `${city}, ${state}` : state;

    return res.json({ matches, userCount, location });
  });

}; // end of module.exports
