const express = require('express'); // Cargamos express

const path = require('path');// Rutaas de archivos para servir al FRONT

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Usar el router para manejar las rutas
app.get('/', (req, res)=>{
  res.sendFile(path.join(__dirname, 'public/views', 'index.html'))
});

// Redirijimos a la vista de extraccion
app.get('/extraccion', (req, res)=>{
  res.sendFile(path.join(__dirname, 'public/views/modules', 'extraccion.html'))
});


app.listen(PORT, () => {
  console.log(`Server corriendo en: http://localhost:${PORT}`);
});