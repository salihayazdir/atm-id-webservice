module.exports = app => {
    const atms = require("../controllers/atm.controller.js");
    var router = require("express").Router();

    // Create a new Atm
    router.post("/", atms.create);

    // Retrieve all Atm's
    router.get("/", atms.findAll);

    // Delete all Atm's
    router.delete("/", atms.deleteAll);

    app.use('/api/atms', router);

    // Retrieve all published Tutorials
    // router.get("/published", atms.findAllPublished);

    // Retrieve a single Tutorial with id
    // router.get("/:id", atms.findOne);

    // Update a Tutorial with id
    // router.put("/:id", atms.update);

    // Delete a Tutorial with id
    // router.delete("/:id", atms.delete);

  };