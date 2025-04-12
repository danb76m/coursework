const verifySessionId = require('../utils/verifysession');

module.exports = (app, db) => {
  app.post('/update-campaign/:id', async (req, res) => {
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

    // Campaign data extraction
    const { name, image_link, budget_per_day, end_date, has_end_date, category_ids, paused, archived } = req.body;

    console.log(end_date)
    //console.log(new Date(end_date).toISOString().slice(0, 10))

    // Campaign update
    try {
      await db.query(
        "UPDATE `ad_campaigns` SET `name`=?, `image_link`=?, `budget_per_day`=?, `end_date`=?," +
         " `has_end_date`=?, `category_ids`=?, `paused`=?, `archived`=? WHERE `id`=? AND `campaign_id`=?;", 
        [name, image_link, budget_per_day, end_date ? new Date(end_date).toISOString().slice(0, 10) : null, has_end_date, category_ids, paused , archived , sesh.id, id]);

      return res.status(200).send('Updated campaign');
    } catch (err) {
      console.error(err);
      return res.status(500).send('Internal server error');
    }
  });
};
