const verifySessionId = require('../utils/verifysession');

module.exports = (app, db) => {
  app.get('/logout', async (req, res) => {
    res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false, // Set secure only in production
      });

      res.status(200).send('Logged out');
  });
};