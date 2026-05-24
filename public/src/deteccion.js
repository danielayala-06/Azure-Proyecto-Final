// Rutas para las API's
const host = "http://localhost";
const port = "3000";
const URL = `${host}:${port}/api/deteccion`;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-text"); // Obtenemos el formulario
  const btnEnviar = document.getElementById("btnEnviar"); // Obtenemos el boton para enviar el form
  let inputUrl = null; // La URL
  const containerResults = document.querySelector(".container-results");
  const containerImg = document.querySelector(".container-img");
  // Detenemos el envio del formulario
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    inputUrl = document.getElementById("text-input").value; // Obtenemos la URL enviada por el form

    console.log(inputUrl);
    if (!inputUrl) return alert("Ingrese una URL porfavor");

    //Renderizamos la imagen original
    const img = document.createElement("img");
    img.src = inputUrl;
    img.classList.add("img", "img-fluid");
    containerImg.appendChild(img);

    // Enviamos la imagen al endpoint
    const data = await sendURL(inputUrl);
    console.log(data.data);

    // Renderizamos la salida de la imagen:
    console.log("==== Comenzando la renderizacion de datos... ====");
    const objetos = data.data.objects;
    renderResults(objetos);
  });

  // Funcion para enviar la URL de la imagen al endpoint
  async function sendURL(urlImagen) {
    // Validamos la URL
    if (!urlImagen || !urlImagen.trim()) {
      return alert("URL de la imagen no encontrado");
    }

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlImagen }),
      });

      if (response.status !== 200) {
        return response.errores;
      }

      //Enviamos los datos obtenidos del endpoint
      const res = await response.json();

      // Devolvemos los datos al front
      return res;
    } catch (error) {
      // Devolvemo en caso de error
      return error;
    }
  }

  function renderResults(results = array) {
    console.log("==== Creando el canvas... ====");

    // Creamos el canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = document.createElement("img");
    img.src = inputUrl;
    img.classList.add("img", "img-fluid");

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      let finalCanvas = canvas;
      // Lo volvemos responsive
      finalCanvas.classList.add("img-fluid");

      results.forEach((result) => {
        finalCanvas = renderRectangule(finalCanvas, result.rectangle);
      });

      // 4. Mostrar SOLO el resultado final
      finalCanvas.classList.add("img-fluid");
      containerResults.appendChild(finalCanvas);

      console.log("==== Listo! ====");
    };
  }

  // Renderiza un cuadrado en el canvas y devuelve el canvas con el cuadrado generado
  function renderRectangule(oldCanvas, { x, y, w, h }) {
    const newCanvas = document.createElement("canvas");
    // copiamos el tamanio
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    // Lo volvemos responsive

    // Obtenemos el contexto del nuevo canvas
    const ctx = newCanvas.getContext("2d");
    ctx.drawImage(oldCanvas, 0, 0);

    //Dibujamos el rectangulo
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillRect(x, y, w, h);

    // Dibujamos el borde del rectangulo
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    return newCanvas;
  }
});
