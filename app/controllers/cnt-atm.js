const db = require('../db')

const atmAddNew = async (req, res) => {
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty."
      });
    }
    
    const newAtm = {
        MemberNo: req.body.MemberNo,
        AtmReferenceCode: req.body.AtmReferenceCode,
    }

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

module.exports = {
    atmAddNew,
}


  // const atmAddNew = async (req, res) => {
  //     try {
  //       const client = await pool.connect();
  //       const result = await client.query('SELECT * FROM test_table');
  //       const results = { 'results': (result) ? result.rows : null};
  //       res.json( results );
  //       client.release();
  //     } catch (err) {
  //       console.error(err);
  //       res.send("Error " + err);
  //     }
  //   }