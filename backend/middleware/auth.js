module.exports = (req, res, next) => {
  const apiKey = req.headers['api-key'];
  const validApiKey = process.env.API_KEY;

  if (validApiKey && apiKey !== validApiKey) {
    res.status(401).send('Unauthorized');
  }
  
    const sessionToken = req.headers['session-token'];
  
    if (sessionToken) {
      db.query('SELECT * FROM users WHERE session_token = ?', [sessionToken], (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).send('Server error');
        } else if (results.length > 0) {
          req.user = results[0];
          next();
        } else {
          res.status(401).send('Unauthorized');
        }
      });
    } else {
      next();
    }
  };