require("dotenv").config();

// Acceder a las variables de entorno
const suscriptionkey = process.env.RECONGNITION_API_FOUNDRY;
const endpoint = process.env.FOUNDRY_ENPOINT;

const URL_RESUMEN = `${endpoint}/language/analyze-text/jobs?api-version=2023-04-01`;

exports.resumirTexto = async (req, res) => {
    const { texto } = req.body;

    // En caso de no enviarse el texto
    if (!texto) {
        return res.status(400).json({ error: "El texto es requerido" });
    }

    // Preparamos el cuerpo de la solicitud para la API de AZURE
    const cuerpoPeticion = {
        displayName: "Resumen_documento",
        analysisInput: {
            documents: [{
                id: "1",
                language: "es",
                text: texto
            }]
        },
        tasks: [{
            kind: "ExtractiveSummarization",
            taskName: "Resumen_tarea",
            parameters: { sentenceCount: 3 }
        }]
    };

    try {
        // Paso 1 - Enviamos el texto a AZURE para iniciar el trabajo
        const response = await fetch(URL_RESUMEN, {
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": suscriptionkey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cuerpoPeticion)
        });

        // En caso de que la respuesta no sea exitosa
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(500).json({
                mensaje: "Error en el servidor de AZURE",
                errores: errorData
            });
        }

        // Paso 2 - AZURE devuelve una URL de seguimiento en el Header
        // El resumen no se genera de inmediato, hay que esperar el procesamiento
        const URLSeguimiento = response.headers.get("operation-location");
        console.log("Trabajo aceptado en el servidor, procesando...");

        // Paso 3 - Consultamos cada 2 segundos hasta obtener el resultado
        let resultadoFinal = null;
        while (true) {
            const respuestaSeguimiento = await fetch(URLSeguimiento, {
                headers: { "Ocp-Apim-Subscription-Key": suscriptionkey }
            });

            resultadoFinal = await respuestaSeguimiento.json();

            if (resultadoFinal.status === "succeeded") break;
            if (resultadoFinal.status === "failed") throw new Error("El servidor no pudo procesar el texto");

            // Esperamos 2 segundos antes de volver a consultar
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Paso 4 - Extraemos las frases del resumen
        const tareaFinalizada = resultadoFinal.tasks.items[0];
        const frases = tareaFinalizada.results.documents[0].sentences;

        // Devolvemos las frases del resumen generado
        return res.status(200).json({
            mensaje: "Texto resumido correctamente",
            frases: frases
        });

    } catch (error) {
        return res.status(500).json({ error: "Error al resumir el texto" });
    }
};
