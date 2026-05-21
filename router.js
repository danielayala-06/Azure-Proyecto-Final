const express = require("express");
const router = express.Router(); //Enrutador

//
const extraccionController = require("./controllers/extraccion");

router.post("/", extraccionController.extraerDatos); //

module.exports = router;
