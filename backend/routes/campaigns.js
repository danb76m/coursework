const verifySessionId = require('../utils/verifysession');

module.exports = (app, db) => {
  app.get('/campaigns', async (req, res) => {
    if (!req.session || !req.session.token) {
      return res.status(401).send('Unauthorized: Missing session token');
    }

    const sesh = await verifySessionId(req.session.token, db);

    if (sesh === false) {
      return res.status(401).send('Unauthorised: Invalid token');
    }

    const results = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM `ad_campaigns` WHERE `id` =?",
        sesh.id,
        (err, result) => {
          if (err) {
            res.status(500).send('System Error');
            return reject(err);
          }

          resolve(result);
        }
      );
    });



    res.status(200).send(results); // Send the array of campaigns
  });
};
