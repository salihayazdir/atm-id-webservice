const express = require('express');
const app = express();
const router = express.Router();

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

router.get('/', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.json( results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  });
  
module.exports = router