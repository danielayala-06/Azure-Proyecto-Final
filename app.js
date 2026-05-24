require("dotenv").config();

const express = require("express"); // Cargamos express
const path = require("path"); // Rutaas de archivos para servir al FRONT

const router = require("./router.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// Usar el router para manejar las rutas
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views", "index.html"));
});

/**
 *    VISTAS PARA EL ACCESO A LOS MODULOS
 **/

// Redirijimos a la vista de extraccion
app.get("/extraccion", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/modules", "extraccion.html"));
});

// Redirijimos a la vista de deteccion
app.get("/deteccion", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/modules", "deteccion.html"));
});

// Redirijimos a la vista de analisis
app.get("/analisis", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/modules", "analisis.html"));
});

//Comunicación se realizará JSON
app.use(express.json());

// RUTAS PARA LA COMUNICACION ENTRE LA LOGICA Y LOS DATOS ENVIADOS DEL FRONT
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server corriendo en: http://localhost:${PORT}`);
});
