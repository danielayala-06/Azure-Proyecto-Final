// Rutas para las API's
const host = "http://localhost";
const port = "3000";
const URL = `${host}:${port}/api/deteccion`;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-text"); // Obtenemos el formulario
  const btnEnviar = document.getElementById("btnEnviar"); // Obtenemos el boton para enviar el form

  const containerResults = document.querySelector(".container-results");

  // Detenemos el envio del formulario
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const inputUrl = document.getElementById("text-input").value; // Obtenemos la URL enviada por el form

    console.log(inputUrl);
    if (!inputUrl) return alert("Ingrese una URL porfavor");

    // Enviamos la imagen al endpoint
    const data = await sendURL(inputUrl);
    console.log(data.data);
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
});
