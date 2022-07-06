module.exports = app => {
    const atmController = require("../controllers/atm.controller.js");
    var router = require("express").Router();

    // Create a new Atm
    router.post("/", atmController.create);

    // Retrieve all Atm's
    router.get("/", atmController.findAll);

    // Delete all Atm's
    router.delete("/", atmController.deleteAll);

    app.use('/api/atmController', router);

    // Retrieve all published Tutorials
    // router.get("/published", atmController.findAllPublished);

    // Retrieve a single Tutorial with id
    // router.get("/:id", atmController.findOne);

    // Update a Tutorial with id
    // router.put("/:id", atmController.update);

    // Delete a Tutorial with id
    // router.delete("/:id", atmController.delete);

  };