const express = require("express");
const cors = require("cors");
const app = express();

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// var corsOptions = {
//   origin: "http://localhost:8081"
// };

// app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

// const mysql = require("mysql2");

// const dbConfig = {
//   HOST: "localhost",
//   USER: "root",
//   PASSWORD: "123321abC!",
//   DB: "ATM_DB"
// };

// // Create a connection to the database
// const sql = mysql.createConnection({
//   host: dbConfig.HOST,
//   user: dbConfig.USER,
//   password: dbConfig.PASSWORD,
//   database: dbConfig.DB,
// });

// // open the MySQL connection
// sql.connect(error => {
//   if (error) throw error;
//   console.log("Successfully connected to the database.");
// });


// // constructor
// const AtmModel = function(atm) {
//   this.MemberNo = atm.MemberNo;
//   this.AtmReferenceCode = atm.AtmReferenceCode;
// };

// AtmModel.create = (newAtmUnit, result) => {
//   sql.query("INSERT INTO atmunits SET ?", newAtmUnit, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }
//     console.log("created atm unit: ", { id: res.insertId, ...newAtmUnit });
//     result(null, { id: res.insertId, ...newAtmUnit });
//   });
// };

// AtmModel.getAll = (AtmReferenceCode, result) => {
//   let query = "SELECT * FROM atmunits";
//   if (AtmReferenceCode) {
//     query += ` WHERE AtmReferenceCode LIKE '%${AtmReferenceCode}%'`;
//   }
//   sql.query(query, (err, res) => {
//     if (err) {
//       console.log("Error: ", err);
//       result(null, err);
//       return;
//     }
//     console.log("ATM Units: ", res);
//     result(null, res);
//   });
// };

// AtmModel.removeAll = result => {
//   sql.query("DELETE FROM atmunits", (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }
//     console.log(`deleted ${res.affectedRows} atm's`);
//     result(null, res);
//   });
// };


// create = (req, res) => {
//     // Validate request
//     if (!req.body) {
//       res.status(400).send({
//         message: "Content can not be empty."
//       });
//     }
//     // Create an ATM
//     const atm = new AtmModel({
//         MemberNo: req.body.MemberNo,
//         AtmReferenceCode: req.body.AtmReferenceCode,
//     });
//     // Save ATM in the database
//     AtmModel.create(atm, (err, data) => {
//       if (err)
//         res.status(500).send({
//           message:
//             err.message || "Some error occurred while creating the ATM."
//         });
//       else res.send(data);
//     });
//   };


// findAll = (req, res) => {
//     const AtmReferenceCode = req.query.AtmReferenceCode;
//     AtmModel.getAll(AtmReferenceCode, (err, data) => {
//       if (err)
//         res.status(500).send({
//           message:
//             err.message || "Some error occurred while retrieving Atm's."
//         });
//       else res.send(data);
//     });
//   };
//   findAllPublished = (req, res) => {
//     AtmModel.getAllPublished((err, data) => {
//       if (err)
//         res.status(500).send({
//           message:
//             err.message || "Some error occurred while retrieving Atm's."
//         });
//       else res.send(data);
//     });
//   };

// deleteAll = (req, res) => {
//     AtmModel.removeAll((err, data) => {
//       if (err)
//         res.status(500).send({
//           message:
//           err.message || "Some error occurred while removing all tutorials."
//         });
//         else res.send({ message: `All Atm's were deleted successfully!` });
//     });
//   };  

  var router = require("express").Router();
//   app.use('/api/atms', router);

//   router.post("/", create);
//   router.get("/", findAll);
//   router.delete("/", deleteAll);

  router.get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  });
  
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});