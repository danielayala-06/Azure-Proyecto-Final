// Rutas para las API's
const host = "http://localhost";
const port = "3000";
const URL = `${host}:${port}/api/anonimacion`;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-text"); // Obtenemos el formulario
    const btnEnviar = document.getElementById("btnEnviar"); // Obtenemos el boton para enviar el form

    // Containers del DOM
    const containerResults = document.querySelector(".container-results");
    const containerOriginal = document.querySelector(".container-original");
    const containerAnonimizado = document.querySelector(".container-anonimizado");
    const containerCount = document.querySelector(".container-count");

    let activo = true; // para el boton de enviar datos

    form.addEventListener("submit", async (event) => {
        // Evitamos el envio del formulario
        event.preventDefault();

        // Obtenemos el texto enviado por el formulario
        const inputText = document.getElementById("text-input").value;

        // En caso de no haber enviado texto
        if (!inputText.trim())
            return alert("Ingrese un texto antes de enviar el formulario");

        // Desactivamos el boton de enviar
        toogleButtonEnviar();

        // Limpiamos los containers de resultados anteriores
        containerResults.innerHTML = "";
        containerOriginal.innerHTML = "";
        containerAnonimizado.innerHTML = "";
        containerCount.textContent = "0";

        // Mostramos el texto original en el container
        containerOriginal.textContent = inputText;

        // Enviamos el texto al endpoint y guardamos la respuesta en data
        const data = await enviarTexto(inputText);

        if (!data) {
            toogleButtonEnviar(); // Volvemos a activar el boton
            return alert("Error en el servidor");
        }

        // Renderizamos el texto anonimizado
        console.log("==== Comenzando la renderizacion de datos... ====");
        containerAnonimizado.textContent = data.textoAnonimizado;

        // Renderizamos las entidades detectadas como cards
        data.entidades.forEach((entidad) => {
            containerResults.appendChild(crearCard(entidad));
        });

        // Actualizamos el contador del aside
        containerCount.textContent = data.entidades.length;

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
     * Crea un card con la informacion de la entidad detectada
     * @param {object} entidad - Entidad detectada por AZURE
     * @returns {HTMLElement} card creado
     */
    function crearCard(entidad) {
        const div = document.createElement("div");

        div.classList.add("card", "border-primary");
        div.style.width = "13rem";

        const confianza = (entidad.confidenceScore * 100).toFixed(2);

        div.innerHTML = `<div class="card-body">
                             <h5 class="card-title fs-5 text-primary">${entidad.category}</h5>
                             <p class="card-text">${entidad.text}</p>
                         </div>
                         <ul class="list-group list-group-flush">
                             <li class="list-group-item text-primary">Confidence: ${confianza}%</li>
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
