// Rutas para las API's
const host = "http://localhost";
const port = "3000";
const URL = `${host}:${port}/api/ocr`;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-text"); // Obtenemos el formulario
    const btnEnviar = document.getElementById("btnEnviar"); // Obtenemos el boton para enviar el form

    // URL de la imagen
    let inputUrl = null;

    // Containers del DOM
    const containerResults = document.querySelector(".container-results");
    const containerImg = document.querySelector(".container-img");
    const containerCount = document.querySelector(".container-count");

    let activo = true; // para el boton de enviar datos

    form.addEventListener("submit", async (event) => {
        // Evitamos el envio del formulario
        event.preventDefault();

        // Obtenemos la URL de la imagen enviada por el formulario
        inputUrl = document.getElementById("text-input").value;

        // En caso de no haber enviado la URL
        if (!inputUrl)
            return alert("Ingrese una URL de la imagen antes de enviar el formulario");

        // Desactivamos el boton de enviar
        toogleButtonEnviar();

        // Limpiamos los containers de resultados anteriores
        containerResults.innerHTML = "";
        containerImg.innerHTML = "";
        containerCount.textContent = "0";

        // Renderizamos la imagen original en el aside
        const img = document.createElement("img");
        img.src = inputUrl;
        img.classList.add("img", "img-fluid");
        containerImg.appendChild(img);

        // Enviamos la imagen al endpoint y guardamos la respuesta en data
        const data = await enviarURL(inputUrl);

        if (!data) {
            toogleButtonEnviar(); // Volvemos a activar el boton
            return alert("Error en el servidor");
        }

        // Renderizamos las lineas de texto extraidas
        console.log("==== Comenzando la renderizacion de datos... ====");
        renderLineas(data.lineas);

        // Actualizamos el contador del aside
        containerCount.textContent = data.lineas.length;

        // Volvemos a activar el boton
        toogleButtonEnviar();

        console.log("==== Listo! ====");
    });

    /**
     * Envia la URL de la imagen y devuelve los datos obtenidos del endpoint
     * @param {string} urlImagen
     * @returns {object} data obtenida del endpoint
     */
    async function enviarURL(urlImagen) {
        // Validamos la URL
        if (!urlImagen || !urlImagen.trim()) {
            toogleButtonEnviar(); // Volvemos a activar el boton
            return alert("URL de la imagen no encontrada");
        }

        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: urlImagen }),
            });

            if (response.status !== 200) {
                return null;
            }

            // Obtenemos los datos obtenidos del endpoint
            const res = await response.json();

            // Devolvemos los datos al front
            return res;
        } catch (error) {
            toogleButtonEnviar(); // Volvemos a activar el boton en caso de un error
            // Devolvemos null en caso de error
            return null;
        }
    }

    /**
     * Renderiza las lineas de texto extraidas como lista
     * @param {string[]} lineas - Lineas de texto detectadas por AZURE OCR
     */
    function renderLineas(lineas) {
        // En caso de no encontrar texto
        if (!lineas || lineas.length === 0) {
            const aviso = document.createElement("p");
            aviso.classList.add("text-muted");
            aviso.textContent = "No se detecto texto en la imagen.";
            containerResults.appendChild(aviso);
            return;
        }

        // Creamos la lista de lineas detectadas
        const lista = document.createElement("ol");
        lista.classList.add("list-group", "list-group-numbered");

        lineas.forEach((linea) => {
            const item = document.createElement("li");
            item.classList.add("list-group-item");
            item.textContent = linea;
            lista.appendChild(item);
        });

        containerResults.appendChild(lista);
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
