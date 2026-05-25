const express = require("express");
const router = express.Router(); //Enrutador

//
const extraccionController = require("./controllers/extraccion");
const deteccionController = require("./controllers/deteccion");
const analisisController = require("./controllers/analisis");
const anonimacionController = require("./controllers/anonimacion");
const ocrController = require("./controllers/ocr");
const preguntasController = require("./controllers/preguntas");
const resumenController = require("./controllers/resumen");

// Rutas para la logica de nuestro proyecto
router.post("/extraccion", extraccionController.extraerDatos); //
router.post("/deteccion", deteccionController.detectarObjetos); //
router.post("/analisis", analisisController.analizarContenido); //
router.post("/anonimacion", anonimacionController.anonimizarDatos); //
router.post("/ocr", ocrController.leerTexto); //
router.post("/preguntas", preguntasController.responderPregunta); //
router.post("/resumen", resumenController.resumirTexto); //
module.exports = router;
