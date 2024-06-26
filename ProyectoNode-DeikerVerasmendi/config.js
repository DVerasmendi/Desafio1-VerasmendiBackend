// config.js

require('dotenv').config();

module.exports = {
mongoURI: process.env.MONGODB_CONNECTION_STRING,
githubClientID: process.env.GITHUB_CLIENT_ID,
githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
githubCallbackURL: process.env.GITHUB_CALLBACK_URL
};
