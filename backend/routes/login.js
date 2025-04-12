const bcrypt = require('bcrypt');
const console = require('console');
const crypto = require('crypto');

module.exports = (app, db) => {
    app.post('/login', async (req, res) => {
        const { email, password } = req.body;


        if (!email || !password) {
          res.status(404).send('Undefined email or password');
          return;
        }

        await new Promise((resolve, reject) => {
          db.query("SELECT * FROM `users` WHERE `email`=?;", email, function(err, result) {
            if (err) throw err;
            resolve(result);
          });
        })
        .then(result => {
          if (result.length === 0) {
            res.status(404).send('Undefined email or password');
            return;
          }

          dothing(result[0], password, db, req, res);
        })
    });
  };

  async function dothing(user, password, db, req, res) {
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch == true) {
      const sessionToken = generateSessionId();
      console.log("session token is " + sessionToken);
      await db.query('UPDATE users SET session_token = ? WHERE id = ?', [sessionToken, user.id]);

      //res.cookie('sessionToken', sessionToken, { httpOnly: true });
      console.log("session oken is now" + sessionToken);
      req.session.token = sessionToken; // Store token
      console.log("debug " + req.session.token);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for 1000 milliseconds
      res.status(200).send("Logged in!");
    } else {
      res.status(401).send('Invalid email or password');
    }
  }

  function generateSessionId() {
    return crypto.randomBytes(32).toString('hex');
  }