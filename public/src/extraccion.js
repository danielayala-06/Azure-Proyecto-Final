// Rutas para las API's
const host = "http://localhost";
const port = "3000";
const URL = `${host}:${port}/api/extraccion`;

console.log(URL);
// Obtenemos los datos del front-end
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-text");

    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Evitamos el envio del formulario(recargar la pagina)

        const inputText = document.getElementById("text-input").value;
        enviarTextoExtraccion(inputText);
    });

    async function enviarTextoExtraccion(text) {
        if (!text) {
            throw new Error("El texto enviado esta vacio!");
        }

        const data = { texto: text };

        try {
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
            console.log(res);
        } catch (error) {
            console.error(error.message);
        }
    }
});
