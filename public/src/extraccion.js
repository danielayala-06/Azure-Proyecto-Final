// Rutas para las API's
const host = "http://localhost";
const port = "3000";
const URL = `${host}:${port}/api/extraccion`;

console.log(URL);
// Obtenemos los datos del front-end
document.addEventListener("DOMContentLoaded", () => {
    // Referencia a los elementos de la vista
    const form = document.getElementById("form-text");
    const btnEnviar = document.getElementById("btnEnviar");
    let activo = true; // para el boton

    const containterRes = document.querySelector(".container-results");
    const radioOptions = document.querySelectorAll(".form-check-input");

    // Detenemos el envio del formulario y enviamos los datos a AZURE
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Evitamos el envio del formulario(recargar la pagina)

        toogleButtonEnviar(); // Desactivamos el boton de enviar

        // Obtenemos el valor del input en el formulario
        const inputText = document.getElementById("text-input").value;

        // Limpiamos el container de los resultados anteriores
        containterRes.innerHTML = "";

        // Enviamos los datos al backend espereando la respuesta
        const results = await enviarTextoExtraccion(inputText);

        // Obtenemos los filtros
        let filtros = obtenerFiltros();

        // Procesamos los datos (FILTROS)
        const resultadosFiltrados = filtrarResultados(filtros, results.respuesta);

        // Renderizamos los datos
        resultadosFiltrados.forEach((result) => {
            containterRes.appendChild(crearCard(result));
        });

        toogleButtonEnviar(); // Activamos el boton envair
    });

    // Funcion para enviar un texto a la API del backend y esperamos su respuesta
    async function enviarTextoExtraccion(text) {
        // En caso el texto sea nullo
        if (!text) {
            throw new Error("El texto enviado esta vacio!");
        }

        // Preparamos el texto para enviarlo al backend
        const data = { texto: text };

        try {
            // Enviamos el texto al back
            const response = await fetch(URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            // En caso de que la respuesta no sea ok
            if (response.status !== 200) {
                throw new Error("Error en la API");
            }

            // Obtenemos la respuesta:
            const res = await response.json();

            return res;
        } catch (error) {
            console.error(error.message);
            throw new Error("Error al enviar los datos al backend");
        }
    }

    // Funcion para crear un card que contendra(UI) los resultados de AZURE
    function crearCard(data) {
        // Creamos el elemento div con ayuda del DOM
        let div = document.createElement("div");

        // Agregamos atributos al div
        div.classList.add("card");
        div.classList.add("border-primary");
        div.style.width = "13 rem;";

        // Agregamos el cuerpo del card
        div.innerHTML = ` <div class="card-body">
                             <h5 class="card-title fs-5 text-primary">${data.category}</h5>
                             <p class="card-text">${data.text}</p>
                          </div>
                          <ul class="list-group list-group-flush">
                             <li class="list-group-item text-primary">Confidence: ${(data.confidenceScore * 100).toFixed(2)}</li>
                          </ul>`;
        // Devolvemos el elemento previamente creado
        return div;
    }

    // Funcion para obtener los filtros a aplicar
    function obtenerFiltros() {
        let optionsSelected = [];

        radioOptions.forEach((option) => {
            if (option.checked) optionsSelected.push(option.value);
        });

        return optionsSelected;
    }

    // Filtramos los resultados obtenidos
    function filtrarResultados(filtros, res) {
        let resultadosFiltrados = [];
        // En caso de que no haya filtros
        if (filtros.length === 0) return res;

        res.forEach((result) => {
            if (filtros.includes(result.category)) {
                resultadosFiltrados.push(result);
            }
        });
        return resultadosFiltrados;
    }

    // Funcion para activar y desactivar el boton de enviar
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
