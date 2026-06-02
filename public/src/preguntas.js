// Rutas para las API's
const host = "https://azure-proyecto-final.onrender.com"
const URL = `${host}/api/preguntas`;


document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-text"); // Obtenemos el formulario
    const btnEnviar = document.getElementById("btnEnviar"); // Obtenemos el boton para enviar el form

    // Containers del DOM
    const containerResults = document.querySelector(".container-results");
    const containerConfianza = document.querySelector(".container-confianza");

    let activo = true; // para el boton de enviar datos

    form.addEventListener("submit", async (event) => {
        // Evitamos el envio del formulario
        event.preventDefault();

        // Obtenemos el contexto y la pregunta enviados por el formulario
        const inputTexto = document.getElementById("text-input").value;
        const inputPregunta = document.getElementById("pregunta-input").value;

        // En caso de no haber enviado el texto o la pregunta
        if (!inputTexto.trim() || !inputPregunta.trim())
            return alert("Ingrese el contexto y la pregunta antes de enviar el formulario");

        // Desactivamos el boton de enviar
        toogleButtonEnviar();

        // Limpiamos los containers de resultados anteriores
        containerResults.innerHTML = "";
        containerConfianza.textContent = "-";

        // Enviamos los datos al endpoint y guardamos la respuesta en data
        const data = await enviarPregunta(inputTexto, inputPregunta);

        if (!data) {
            toogleButtonEnviar(); // Volvemos a activar el boton
            return alert("Error en el servidor");
        }

        // Renderizamos las respuestas obtenidas
        console.log("==== Comenzando la renderizacion de datos... ====");
        renderRespuestas(data.respuestas);

        // Volvemos a activar el boton
        toogleButtonEnviar();

        console.log("==== Listo! ====");
    });

    /**
     * Envia el contexto y la pregunta al endpoint y devuelve los datos obtenidos
     * @param {string} texto - Contexto de referencia
     * @param {string} pregunta - Pregunta a responder
     * @returns {object} data obtenida del endpoint
     */
    async function enviarPregunta(texto, pregunta) {
        // Validamos los datos
        if (!texto || !pregunta) {
            toogleButtonEnviar(); // Volvemos a activar el boton
            return alert("El texto y la pregunta no pueden estar vacios");
        }

        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ texto: texto, pregunta: pregunta }),
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
     * Renderiza las respuestas obtenidas de AZURE como cards
     * @param {array} respuestas - Respuestas devueltas por AZURE
     */
    function renderRespuestas(respuestas) {
        // En caso de no encontrar respuestas
        if (!respuestas || respuestas.length === 0) {
            const aviso = document.createElement("p");
            aviso.classList.add("text-muted");
            aviso.textContent = "No se encontraron respuestas para la pregunta.";
            containerResults.appendChild(aviso);
            return;
        }

        // Actualizamos la mejor confianza en el aside
        const mejorConfianza = (respuestas[0].confidenceScore * 100).toFixed(2);
        containerConfianza.textContent = `${mejorConfianza}%`;

        // Iteramos por cada respuesta y creamos su card
        respuestas.forEach((respuesta, indice) => {
            containerResults.appendChild(crearCard(respuesta, indice));
        });
    }

    /**
     * Crea un card con la informacion de la respuesta obtenida
     * @param {object} respuesta - Respuesta devuelta por AZURE
     * @param {number} indice - Indice de la respuesta
     * @returns {HTMLElement} card creado
     */
    function crearCard(respuesta, indice) {
        const div = document.createElement("div");

        // La primera respuesta es la de mayor confianza, la resaltamos
        const esPrincipal = indice === 0;
        div.classList.add("card");
        if (esPrincipal) div.classList.add("border-primary");

        const confianza = (respuesta.confidenceScore * 100).toFixed(2);

        div.innerHTML = `<div class="card-body">
                             <h5 class="card-title fs-6 ${esPrincipal ? "text-primary" : "text-muted"} fw-light">
                                 Respuesta ${indice + 1}
                             </h5>
                             <p class="card-text">${respuesta.answer}</p>
                         </div>
                         <ul class="list-group list-group-flush">
                             <li class="list-group-item ${esPrincipal ? "text-primary" : ""}">
                                 Confidence: ${confianza}%
                             </li>
                         </ul>`;

        return div;
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
