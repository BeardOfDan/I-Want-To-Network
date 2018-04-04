const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const KEYS = require('./../config/keys');

const mongoose = require('mongoose');
const User = mongoose.model('user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userID, done) => {
  done(null, await User.findById(userID));
});

passport.use(new GitHubStrategy({
  clientID: KEYS.githubClientID,
  clientSecret: KEYS.githubClientSecret,
  callbackURL: 'http://localhost:5000/auth/github/callback'
},
  async (accessToken, refreshToken, profile, done) => {
    const user = await User.findOne({ 'email': profile.emails[0].value });

    if (user === null) { // new user
      const newUser = await new User({
        'email': profile.emails[0].value,
        'username': profile.username,
        'githubURL': profile.profileUrl,
        'photoURL': profile.photos[0].value
      });

      done(null, (await newUser.save()));
    } else { // existing user
      done(null, user);
    }
  })
);
