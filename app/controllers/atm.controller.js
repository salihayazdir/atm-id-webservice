const Atm = require("../models/atm.model.js");

// Create and Save a new Tutorial
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty."
      });
    }
    // Create an ATM
    const atm = new Atm({
        MemberNo: req.body.MemberNo,
        AtmReferenceCode: req.body.AtmReferenceCode,
    });
    // Save ATM in the database
    Atm.create(atm, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the ATM."
        });
      else res.send(data);
    });
  };

// Retrieve all Atm's from the database (with condition).
exports.findAll = (req, res) => {
    const AtmReferenceCode = req.query.AtmReferenceCode;
    Atm.getAll(AtmReferenceCode, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Atm's."
        });
      else res.send(data);
    });
  };
  exports.findAllPublished = (req, res) => {
    Atm.getAllPublished((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Atm's."
        });
      else res.send(data);
    });
  };

// Delete all Atm's from the database.
exports.deleteAll = (req, res) => {
    Atm.removeAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
          err.message || "Some error occurred while removing all tutorials."
        });
        else res.send({ message: `All Atm's were deleted successfully!` });
    });
  };
// // Find a single Tutorial with a id
// exports.findOne = (req, res) => {
  
// };
// // find all published Tutorials
// exports.findAllPublished = (req, res) => {
  
// };
// // Update a Tutorial identified by the id in the request
// exports.update = (req, res) => {
  
// };
// // Delete a Tutorial with the specified id in the request
// exports.delete = (req, res) => {
  
// };