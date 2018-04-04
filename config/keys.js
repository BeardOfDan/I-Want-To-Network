if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

module.exports = {
  'githubClientID': process.env.GITHUB_CLIENT_ID,
  'githubClientSecret': process.env.GITHUB_CLIENT_SECRET,
  'mongoURI': `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`,
  'cookieKey': process.env.COOKIE_KEY
};
