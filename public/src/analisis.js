// Rutas para las API's
const host = "http://localhost";
const port = "3000";
const URL = `${host}:${port}/api/analisis`;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-text"); // Obtenemos el formulario
  const btnEnviar = document.getElementById("btnEnviar"); // Obtenemos el boton para enviar el form

  // URL  de la imagen
  let inputUrl = null;

  // Para renderizar las imagenes
  const containerResults = document.querySelector(".container-results");
  const containerImg = document.querySelector(".container-img");

  let activo = true; // para el boton de enviar datos

  form.addEventListener("submit", async (event) => {
    // Evitamos el envio del formulario
    event.preventDefault();

    // Obtenemos la URL de la imagen enviada por el fomulario
    inputUrl = document.getElementById("text-input").value;

    // En caso de no haber enviado la URL
    if (!inputUrl)
      return alert(
        "Ingrese una URL de la imagen antes de enviar el formulario",
      );
    // Desactivamos el boton de enviar
    toogleButtonEnviar(); 


    // Limpiamos los contenedores de las imagenes
    containerResults.innerHTML = "";
    containerImg.innerHTML = "";

    //Renderizamos la imagen original
    const img = document.createElement("img");
    img.src = inputUrl;
    img.classList.add("img", "img-fluid");
    containerImg.appendChild(img);

    // Enviamos la imagen al endpoint y guardamos la respuesta en data
    const data = await sendURL(inputUrl);

    if(!data){
      toogleButtonEnviar(); // Volvemos a activar el boton
      return alert('Error en el servidor')
    }

    // Renderizamos la salida de la imagen:
    console.log("==== Comenzando la renderizacion de datos... ====");
    const objetos = data.data.objects;
    renderResults(objetos);

    // Volvemos a activar el boton 
    toogleButtonEnviar();
  });

  /**
   * Envia la URL de la imagen y devuelve los datos obtenidos del endpoint
   * @param {string} urlImagen 
   * @returns {object} data obtenida del endpoint
   */
  async function sendURL(urlImagen) {
    // Validamos la URL
    if (!urlImagen || !urlImagen.trim()) {
      toogleButtonEnviar(); // Volvemos a activar el boton
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
      toogleButtonEnviar(); // Volvemos a activar el boton en caso de un error
      // Devolvemo en caso de error
      return error;
    }
  }

  /**
   * Renderiza un canvas con los objetos detectados en la imagen
   * @param {array} results 
   */
  function renderResults(results) {
    // Creamos el canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Creamos una imagen con la URL del input
    const img = document.createElement("img");
    img.src = inputUrl;
    img.classList.add("img", "img-fluid");

    img.onload = () => {
      // Le damos el tamanio de la imagen al canvas
      canvas.width = img.width;
      canvas.height = img.height;

      // Dibujamos la imagen en el canvas
      ctx.drawImage(img, 0, 0);

      // Canvas que renderizaremos
      let finalCanvas = canvas;

      // Iteramos por cada resultado => objeto identificado por AZURE
      results.forEach((result) => {
        finalCanvas = renderRectangule(
          finalCanvas,
          result.rectangle,
          result.object,
          result.confidence,
        );
      });

      // Para que la imagen sea responsive
      finalCanvas.classList.add("img-fluid");

      // Cargamos el canvas en el container de resultados
      containerResults.appendChild(finalCanvas);

      console.log("==== Listo! ====");
    };
  }

  /**
   * Renderiza un cuadrado en el canvas y devuelve un canvas con el cuadrado generado
   * @param {*} oldCanvas 
   * @param {*} param1 
   * @param {*} nombreObjeto 
   * @param {*} confianza 
   * @returns 
   */
  function renderRectangule(
    canvas,
    { x, y, w, h },
    nombreObjeto,
    confianza,
  ) {
    // Obtenemo sel contexto de la imagen
    const ctx = canvas.getContext("2d");

    //Dibujamos el rectangulo
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillRect(x, y, w, h);

    // Dibujamos el borde del rectangulo
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // Renderizamos el nombre del objeto detectado con la confianza
    ctx.font = "20px Arial";
    ctx.fillStyle = "blue";

    ctx.fillText(`Objeto: ${nombreObjeto}`, x, y + 15);

    // Renderizamos la confianza
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";

    // Formateamos a un formato adecuado
    confianza = (confianza * 100).toFixed(2);
    ctx.fillText(`Confianza: ${confianza}`, x, y + 32);

    return canvas;
  }

  /**
   * Desactiva o activa el boton para enviar el formulario
   */
  function toogleButtonEnviar() {
      activo = !activo; // Cambia de estado

      btnEnviar.innerHTML = ""; //Limpiamos el boton enviar

      if (!activo) {
          btnEnviar.setAttribute("disabled", "");
          btnEnviar.innerHTML = `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                  <span role="status">Cargando...</span>`;
      } else {
          btnEnviar.removeAttribute("disabled");
          btnEnviar.innerHTML = "Enviar";
      }

      btnEnviar.disable = !activo;
  }
});
