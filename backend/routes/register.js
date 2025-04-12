const bcrypt = require('bcrypt');
const crypto = require('crypto');
const hcaptcha = require('express-hcaptcha');

// https://github.com/vastus/express-hcaptcha/tree/master
module.exports = (app, db) => {
  app.post('/register', hcaptcha.middleware.validate("ES_d442dcb62a094664923afdc20665c18d"),
   async (req, res) => {
    const { email, password, username }
     = req.body;

    // Input validation
    if (!email || !password || !username) {
      return res.status(400).send('Missing required fields: email, password, username');
    }

    await new Promise((resolve, reject) => {
      db.query("SELECT * FROM `users` WHERE `email`=?;", email, function(err, result) {
        if (err) throw err;
        resolve(result);
      });
    })
    .then(result => {
      if (result.length > 0) {
        res.status(404).send('Email is already in use!');
        return;
      }
    });

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    await db.query('INSERT INTO users (`email`, `password`, `username`, `session_token`) VALUES (?, ?, ?, ?)',
     [email, hashedPassword, username, crypto.randomBytes(32).toString('hex')]);
    return res.status(201).send('Account created successfully!');
  });
};
