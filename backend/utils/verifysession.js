module.exports = verifySessionId;

async function verifySessionId(sessionId, db) {
    try {
      const result = await new Promise((resolve, reject) => {
        db.query("SELECT * FROM `users` WHERE `session_token`=?;", sessionId, (err, result) => {
          if (err) {
            return reject(err); // Reject the Promise with the error
          }
          resolve(result);
        });
      });
  
      if (result.length === 0) {
        console.log("No matching user found");
        return false;
      } else {
        return {
          id: result[0].id,
          username: result[0].username,
          email: result[0].email,
          balance: result[0].balance
        };
      }
    } catch (error) {
      console.error("Error verifying session:", error);
      // Consider handling errors appropriately (e.g., return specific error response)
      return false; // Or handle error differently based on your requirements
    }
  }