const sql = require("./db.js");

// constructor
const AtmModel = function(atm) {
  this.MemberNo = atm.MemberNo;
  this.AtmReferenceCode = atm.AtmReferenceCode;
};

AtmModel.create = (newAtmUnit, result) => {
  sql.query("INSERT INTO atmunits SET ?", newAtmUnit, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created atm unit: ", { id: res.insertId, ...newAtmUnit });
    result(null, { id: res.insertId, ...newAtmUnit });
  });
};

AtmModel.getAll = (AtmReferenceCode, result) => {
  let query = "SELECT * FROM atmunits";
  if (AtmReferenceCode) {
    query += ` WHERE AtmReferenceCode LIKE '%${AtmReferenceCode}%'`;
  }
  sql.query(query, (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(null, err);
      return;
    }
    console.log("ATM Units: ", res);
    result(null, res);
  });
};

AtmModel.removeAll = result => {
  sql.query("DELETE FROM atmunits", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log(`deleted ${res.affectedRows} atm's`);
    result(null, res);
  });
};

module.exports = AtmModel;