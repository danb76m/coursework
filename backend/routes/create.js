const verifySessionId = require('../utils/verifysession');

module.exports = (app, db) => {
  app.post('/create-campaign', async (req, res) => {
    if (!req.session || !req.session.token) {
      return res.status(401).send('Unauthorized: Missing session token');
    }

    const sesh = await verifySessionId(req.session.token, db);

    if (sesh === false) {
      return res.status(401).send('Unauthorised: Invalid token');
    }

    await db.query("INSERT INTO `ad_campaigns` (`id`, `name`, `start_date`, `end_date`, `has_end_date`, `budget_per_day`) VALUES (?, ?, ?, ?, ?, ?)", [
      sesh.id,
      sesh.username + "'s Ad Campaign",
      new Date().toISOString().slice(0, 10),
      new Date().toISOString().slice(0, 10),
      false,
      0.00
    ], )
    res.status(200).send('Created new campaign'); // Send the array of campaigns
  });
};