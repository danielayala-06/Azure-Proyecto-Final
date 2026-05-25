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


      // Iteramos por cada resultado => objeto identificado por AZURE
      results.forEach((result) => {
        let newCanvas = renderRectangule(
          canvas,
          result.rectangle,
          result.object,
          result.confidence,
        );
        // Lo pintamos en el container
        newCanvas.classList.add("img-fluid");
        renderCard(newCanvas, result.object, result.confidence);
        containerResults.appendChild(newCanvas);
      });

      // Para que la imagen sea responsive
      canvas.classList.add("img-fluid");

      // Cargamos el canvas en el container de resultados
      //containerResults.appendChild(finalCanvas);

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

  // Nuevo canvas SOLO del tamaño del objeto
  const newCanvas = document.createElement("canvas");

  newCanvas.width = w;
  newCanvas.height = h;

  const ctx = newCanvas.getContext("2d");

  // RECORTAR SOLO EL OBJETO
  ctx.drawImage(
    canvas, // imagen origen
    x, y,   // desde dónde cortar
    w, h,   // tamaño del recorte
    0, 0,   // dónde pegarlo
    w, h    // tamaño final
  );

  // Borde opcional
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, w, h);

  // Texto
  ctx.font = "18px Arial";
  ctx.fillStyle = "white";

  confianza = (confianza * 100).toFixed(2);

  ctx.fillText(nombreObjeto, 10, 20);
  ctx.fillText(`${confianza}%`, 10, 40);

  return newCanvas;
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
