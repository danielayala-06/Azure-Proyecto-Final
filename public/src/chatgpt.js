// Rutas para las API's
const host = "https://azure-proyecto-final.onrender.com"
const URL = `${host}/api/chatgpt`;


document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-text"); // Formulario del chat
    const btnEnviar = document.getElementById("btnEnviar"); // Boton de envio
    const btnNuevo = document.getElementById("btnNuevo"); // Boton de nueva conversacion
    const containerChat = document.getElementById("container-chat"); // Area de mensajes
    const containerTokens = document.querySelector(".container-tokens"); // Contador de tokens
    const containerMensajes = document.querySelector(".container-mensajes"); // Contador de mensajes

    // Estado de la conversacion
    let historial = []; // Historial de mensajes para AZURE
    let totalTokens = 0; // Tokens acumulados en la sesion
    let totalMensajes = 0; // Mensajes enviados en la sesion
    let activo = true; // para el boton de enviar

    form.addEventListener("submit", async (event) => {
        // Evitamos el envio del formulario
        event.preventDefault();

        // Obtenemos el texto del input
        const inputText = document.getElementById("text-input").value.trim();

        // En caso de no haber escrito nada
        if (!inputText) return;

        // Desactivamos el boton de enviar
        toogleButtonEnviar();

        // Limpiamos el input
        document.getElementById("text-input").value = "";

        // Renderizamos la burbuja del usuario
        agregarBurbuja(inputText, "usuario");

        // Mostramos el indicador de escritura del asistente
        const indicador = agregarIndicadorEscritura();

        // Enviamos la pregunta y el historial al endpoint
        const data = await enviarPregunta(inputText, historial);

        // Eliminamos el indicador de escritura
        indicador.remove();

        if (!data) {
            agregarBurbujaError("Error al conectar con el servidor. Intenta nuevamente.");
            toogleButtonEnviar();
            return;
        }

        // Renderizamos la burbuja del asistente con la respuesta
        agregarBurbuja(data.respuesta, "asistente");

        // Actualizamos el historial con la respuesta del asistente
        historial = data.nuevo_historial;

        // Actualizamos las estadisticas del aside
        totalTokens += data.tokens_usados;
        totalMensajes += 1;
        containerTokens.textContent = totalTokens;
        containerMensajes.textContent = totalMensajes;

        // Volvemos a activar el boton
        toogleButtonEnviar();

        console.log(`==== Respuesta obtenida. Tokens usados: ${data.tokens_usados} ====`);
    });

    // Boton para iniciar una nueva conversacion
    btnNuevo.addEventListener("click", () => {
        // Limpiamos el area de chat y reiniciamos el estado
        containerChat.innerHTML = "";
        historial = [];
        totalTokens = 0;
        totalMensajes = 0;
        containerTokens.textContent = "0";
        containerMensajes.textContent = "0";
        document.getElementById("text-input").value = "";

        console.log("==== Nueva conversacion iniciada ====");
    });

    // Permitir enviar con Enter (sin Shift)
    document.getElementById("text-input").addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            form.requestSubmit();
        }
    });

    /**
     * Envia la pregunta y el historial al endpoint y devuelve la respuesta
     * @param {string} pregunta - Pregunta del usuario
     * @param {array} historial - Historial de la conversacion
     * @returns {object|null} data obtenida del endpoint
     */
    async function enviarPregunta(pregunta, historial) {
        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pregunta: pregunta, historial: historial }),
            });

            if (response.status !== 200) {
                return null;
            }

            // Devolvemos los datos al front
            const res = await response.json();
            return res;
        } catch (error) {
            // Devolvemos null en caso de error de red
            return null;
        }
    }

    /**
     * Agrega una burbuja de mensaje al area de chat
     * @param {string} texto - Contenido del mensaje
     * @param {"usuario"|"asistente"} tipo - Quien envia el mensaje
     */
    function agregarBurbuja(texto, tipo) {
        const esUsuario = tipo === "usuario";

        // Contenedor de la fila del mensaje
        const fila = document.createElement("div");
        fila.classList.add("d-flex", esUsuario ? "justify-content-end" : "justify-content-start");

        // Burbuja con el texto
        const burbuja = document.createElement("div");
        burbuja.classList.add("burbuja", esUsuario ? "burbuja-usuario" : "burbuja-asistente");
        burbuja.textContent = texto;

        fila.appendChild(burbuja);
        containerChat.appendChild(fila);

        // Scroll automatico al ultimo mensaje
        containerChat.scrollTop = containerChat.scrollHeight;
    }

    /**
     * Agrega una burbuja de error en caso de fallo del servidor
     * @param {string} mensaje - Mensaje de error a mostrar
     */
    function agregarBurbujaError(mensaje) {
        const fila = document.createElement("div");
        fila.classList.add("d-flex", "justify-content-start");

        const burbuja = document.createElement("div");
        burbuja.classList.add("burbuja", "burbuja-asistente", "text-danger");
        burbuja.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${mensaje}`;

        fila.appendChild(burbuja);
        containerChat.appendChild(fila);
        containerChat.scrollTop = containerChat.scrollHeight;
    }

    /**
     * Muestra el indicador de escritura animado del asistente mientras espera la respuesta
     * @returns {HTMLElement} elemento del indicador (para poder eliminarlo luego)
     */
    function agregarIndicadorEscritura() {
        const fila = document.createElement("div");
        fila.classList.add("d-flex", "justify-content-start");

        const burbuja = document.createElement("div");
        burbuja.classList.add("burbuja", "burbuja-asistente", "d-flex", "align-items-center", "gap-1");

        // Tres puntos animados
        burbuja.innerHTML = `
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>`;

        fila.appendChild(burbuja);
        containerChat.appendChild(fila);
        containerChat.scrollTop = containerChat.scrollHeight;

        return fila; // Devolvemos la fila para poder eliminarla luego
    }

    /**
     * Desactiva o activa el boton para enviar el formulario
     */
    function toogleButtonEnviar() {
        activo = !activo; // Cambia de estado

        btnEnviar.innerHTML = ""; //Limpiamos el boton enviar

        if (!activo) {
            btnEnviar.setAttribute("disabled", "");
            btnEnviar.innerHTML = `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>`;
        } else {
            btnEnviar.removeAttribute("disabled");
            btnEnviar.innerHTML = `<i class="bi bi-send-fill"></i>`;
        }

        btnEnviar.disable = !activo;
    }
});
