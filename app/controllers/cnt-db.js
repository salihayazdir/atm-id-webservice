const db = require('../db')

const checkdb = async (req, res) => {
    try {
      const client = await db.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.json( results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  }

module.exports = checkdb