// Rutas para las API's
const host = "http://localhost";
const port = "3000";
const URL = `${host}:${port}/api/resumen`;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-text"); // Obtenemos el formulario
    const btnEnviar = document.getElementById("btnEnviar"); // Obtenemos el boton para enviar el form

    // Containers del DOM
    const containerResults = document.querySelector(".container-results");
    const containerPalabrasOriginal = document.querySelector(".container-palabras-original");
    const containerPalabrasResumen = document.querySelector(".container-palabras-resumen");
    const containerFrases = document.querySelector(".container-frases");

    let activo = true; // para el boton de enviar datos

    form.addEventListener("submit", async (event) => {
        // Evitamos el envio del formulario
        event.preventDefault();

        // Obtenemos el texto enviado por el formulario
        const inputText = document.getElementById("text-input").value;

        // En caso de no haber enviado el texto
        if (!inputText.trim())
            return alert("Ingrese un texto antes de enviar el formulario");

        // Desactivamos el boton de enviar
        toogleButtonEnviar();

        // Limpiamos los containers de resultados anteriores
        containerResults.innerHTML = "";
        containerPalabrasOriginal.textContent = "0";
        containerPalabrasResumen.textContent = "0";
        containerFrases.textContent = "0";

        // Calculamos las palabras del texto original para el aside
        const palabrasOriginal = inputText.trim().split(/\s+/).length;
        containerPalabrasOriginal.textContent = palabrasOriginal;

        // Enviamos el texto al endpoint y guardamos la respuesta en data
        const data = await enviarTexto(inputText);

        if (!data) {
            toogleButtonEnviar(); // Volvemos a activar el boton
            return alert("Error en el servidor");
        }

        // Renderizamos las frases del resumen
        console.log("==== Comenzando la renderizacion de datos... ====");
        renderFrases(data.frases);

        // Actualizamos las estadisticas del aside
        const palabrasResumen = data.frases
            .map((f) => f.text.trim().split(/\s+/).length)
            .reduce((acc, n) => acc + n, 0);

        containerPalabrasResumen.textContent = palabrasResumen;
        containerFrases.textContent = data.frases.length;

        // Volvemos a activar el boton
        toogleButtonEnviar();

        console.log("==== Listo! ====");
    });

    /**
     * Envia el texto al endpoint y devuelve los datos obtenidos
     * @param {string} texto
     * @returns {object} data obtenida del endpoint
     */
    async function enviarTexto(texto) {
        // Validamos el texto
        if (!texto || !texto.trim()) {
            toogleButtonEnviar(); // Volvemos a activar el boton
            return alert("El texto no puede estar vacio");
        }

        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ texto: texto }),
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
     * Renderiza las frases del resumen como cards numeradas
     * @param {array} frases - Frases del resumen devueltas por AZURE
     */
    function renderFrases(frases) {
        // En caso de no encontrar frases
        if (!frases || frases.length === 0) {
            const aviso = document.createElement("p");
            aviso.classList.add("text-muted");
            aviso.textContent = "No se pudo generar un resumen del texto.";
            containerResults.appendChild(aviso);
            return;
        }

        // Iteramos por cada frase del resumen y creamos su card
        frases.forEach((frase, indice) => {
            containerResults.appendChild(crearCard(frase, indice));
        });
    }

    /**
     * Crea un card con la informacion de la frase del resumen
     * @param {object} frase - Frase devuelta por AZURE
     * @param {number} indice - Indice de la frase
     * @returns {HTMLElement} card creado
     */
    function crearCard(frase, indice) {
        const div = document.createElement("div");

        div.classList.add("card", "border-primary");

        div.innerHTML = `<div class="card-body">
                             <h5 class="card-title fs-6 text-primary fw-light">Frase ${indice + 1}</h5>
                             <p class="card-text">${frase.text}</p>
                         </div>
                         <ul class="list-group list-group-flush">
                             <li class="list-group-item text-primary">Rank: ${frase.rankScore.toFixed(4)}</li>
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
