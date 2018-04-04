const passport = require('passport');

module.exports = (app) => {
  app.get('/auth/github',
    passport.authenticate('github',
      { scope: ['user:email'] })
  );

  app.get('/auth/github/callback',
    passport.authenticate('github'),
    (req, res, next) => {
      res.redirect('http://localhost:3000/');
    });

  app.get('/auth/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/auth/currentUser', (req, res, next) => {
    if (req.user) {
      return res.send(req.user);
    }
    return res.send(false);
  });
};
