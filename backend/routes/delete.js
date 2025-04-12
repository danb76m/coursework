const verifySessionId = require('../utils/verifysession');

module.exports = (app, db) => {
  app.post('/delete-campaign/:id', async (req, res) => {
    const id = req.params.id;

    // Authentication and authorization
    if (!req.session || !req.session.token) {
      return res.status(401).send('Unauthorized: Missing session token');
    }

    const sesh = await verifySessionId(req.session.token, db);

    if (sesh === false) {
      return res.status(401).send('Unauthorized: Invalid token');
    }

    // Campaign existence check
    try {
      const result = await db.query("SELECT * FROM `ad_campaigns` WHERE `campaign_id`=? AND `id`=?;", [id, sesh.id]);

      if (result.length === 0) {
        return res.status(404).send('No campaign.');
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send('Internal server error');
    }

    try {
      await db.query("DELETE FROM `ad_campaigns` WHERE `id`=? AND `campaign_id`=?;", 
        [sesh.id, id]);

      return res.status(200).send('Deleted campaign');
    } catch (err) {
      console.error(err);
      return res.status(500).send('Internal server error');
    }
  });
};
