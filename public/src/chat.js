// Rutas para las API's
const host = "http://localhost";
const port = "3000";
const URL = `${host}:${port}/api/chat`;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-text"); // Obtenemos el formulario
    const btnEnviar = document.getElementById("btnEnviar"); // Obtenemos el boton para enviar el form

    // Containers del DOM
    const containerResults = document.querySelector(".container-results");
    const containerTokens = document.querySelector(".container-tokens");

    let activo = true; // para el boton de enviar datos

    form.addEventListener("submit", async (event) => {
        // Evitamos el envio del formulario
        event.preventDefault();

        // Obtenemos la pregunta enviada por el formulario
        const inputText = document.getElementById("text-input").value;

        // En caso de no haber enviado la pregunta
        if (!inputText.trim())
            return alert("Ingrese una pregunta antes de enviar el formulario");

        // Desactivamos el boton de enviar
        toogleButtonEnviar();

        // Limpiamos el container de resultados anteriores
        containerResults.innerHTML = "";
        containerTokens.textContent = "-";

        // Enviamos la pregunta al endpoint y guardamos la respuesta en data
        const data = await enviarPregunta(inputText);

        if (!data) {
            toogleButtonEnviar(); // Volvemos a activar el boton
            return alert("Error en el servidor");
        }

        // Renderizamos la respuesta obtenida
        console.log("==== Comenzando la renderizacion de datos... ====");
        renderRespuesta(data);

        // Volvemos a activar el boton
        toogleButtonEnviar();

        console.log("==== Listo! ====");
    });

    /**
     * Envia la pregunta al endpoint y devuelve los datos obtenidos
     * @param {string} pregunta
     * @returns {object|null} data obtenida del endpoint
     */
    async function enviarPregunta(pregunta) {
        // Validamos la pregunta
        if (!pregunta || !pregunta.trim()) {
            toogleButtonEnviar(); // Volvemos a activar el boton
            return alert("La pregunta no puede estar vacia");
        }

        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pregunta: pregunta }),
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
     * Renderiza la respuesta del modelo Phi-4 como card
     * @param {object} data - Datos devueltos por el endpoint
     */
    function renderRespuesta(data) {
        const div = document.createElement("div");

        div.classList.add("card", "border-primary");

        div.innerHTML = `<div class="card-body">
                             <h5 class="card-title fs-6 text-primary fw-light">
                                 <i class="bi bi-robot"></i> Respuesta de Phi-4
                             </h5>
                             <p class="card-text" style="white-space: pre-wrap;">${data.respuesta}</p>
                         </div>`;

        containerResults.appendChild(div);

        // Actualizamos el contador de tokens en el aside
        if (data.tokens_usados !== null) {
            containerTokens.textContent = data.tokens_usados;
        }
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
