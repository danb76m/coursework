const verifySessionId = require('../utils/verifysession');

module.exports = (app, db) => {
  app.get('/protected', async (req, res) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for 1000 milliseconds
    console.log(req.session)
    if (!req.session || !req.session.token) {
      return res.status(401).send('Unauthorized: Missing session token');
    }

    const sesh = await verifySessionId(req.session.token, db);
    console.log(sesh);
  
    if (sesh === false) {
      return res.status(401).send('Unauthorised: Invalid token');
    }
  
    res.status(200).send(sesh);
  });
};