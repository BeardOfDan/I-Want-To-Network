const requireLogin = require('./../middleware/requireLogIn');

const mongoose = require('mongoose');
const User = mongoose.model('user');

const { filterByDist } = require('./../utility/matchByDist');

module.exports = (app) => {
  app.get('/api/people', requireLogin, async (req, res, next) => {
    const users = await User.find({});
    res.json(users);
  });

  app.post('/api/updateProfile', requireLogin, async (req, res, next) => {
    const user = req.user;

    const { linkedIn, state, city, available } = req.body;
    const values = {};

    if (typeof linkedIn === 'string') {
      values.linkedin = linkedIn.trim();
    }

    if (typeof state === 'string') {
      values.state = state.trim();

      // don't have a city without a state
      if (typeof city === 'string') {
        values.city = city.trim();
      }
    }

    if (typeof available === 'boolean') {
      values.available = available;
    }

    const updatedUser = await User.findOneAndUpdate({ '_id': user.id }, { '$set': values }, { 'new': true })
      .catch((e) => {
        res.json({ 'error': `Could not update user with username ${user.username}` });
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
    const { criteria, city } = req.body;

    if (typeof state !== 'string') {
      return res.json({ 'error': 'No state was given!' });
    }

    if ((criteria !== 'state') && (criteria !== 'city')) {
      return res.json({ 'error': 'Invalid search criteria' });
    }

    if ((criteria === 'city') && (typeof city !== 'string')) {
      return res.json({ 'error': 'Cannot search by city without a city' });
    }

    const matches = (criteria === 'city') ? (await User.find({ state, city })) : (await User.find({ state }));

    if (matches.error) {
      return res.json({ 'error': matches.error });
    }

    const userCount = matches.length;
    const location = city ? `${city}, ${state}` : state;

    return res.json({ matches, userCount, location });
  });

  app.post('/api/userCountDistance/:miles', requireLogin, async (req, res, next) => {
    const { miles } = req.params;

    if (typeof miles !== 'number') {
      return res.json({ 'error': 'Must provide distance' });
    }

    const matches = await filterByDist(req.user, (await User.find({})), miles);

    if (matches.error) {
      return res.json({ 'error': matches.error });
    }

    return res.json({ miles, matches });
  });

}; // end of module.exports
