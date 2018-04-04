const requireLogin = require('./../middleware/requireLogIn');

module.exports = (app) => {
  app.post('/newUser', (req, res, next) => {
    res.send('You are a new user, who should sign up!');
  });

  app.get('/others', requireLogin, (req, res, next) => {
    res.send('Here is a list of the other users');

    // Add ability to filter by existing fields
  });

  app.get('/othersCloseBy', requireLogin, (req, res, next) => {
    res.send('Here are the users near you');

    // have option to filter by state or by city/state
  });
};
