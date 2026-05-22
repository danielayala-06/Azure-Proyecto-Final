const express = require("express");
const router = express.Router(); //Enrutador

//
const extraccionController = require("./controllers/extraccion");
const deteccionController = require("./controllers/deteccion");

// Rutas para la logica de nuestro proyecto
router.post("/extraccion", extraccionController.extraerDatos); //
router.post("/deteccion", deteccionController.detectarObjetos); //
module.exports = router;
