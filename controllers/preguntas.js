require("dotenv").config();

// Acceder a las variables de entorno
const suscriptionkey = process.env.RECONGNITION_API_FOUNDRY;
const endpoint = process.env.FOUNDRY_ENPOINT;

const url = `${endpoint}/language/:query-text?api-version=2021-10-01`;

exports.responderPregunta = async (req, res) => {
    const { texto, pregunta } = req.body;

    // En caso de no enviarse el texto o la pregunta
    if (!texto || !pregunta) {
        return res.status(400).json({ error: "El texto y la pregunta son requeridos" });
    }

    // Preparamos el cuerpo de la solicitud para la API de AZURE
    const cuerpoPeticion = {
        question: pregunta,
        records: [{
            id: "doc_01",
            text: texto
        }]
    };

    try {
        // Realizamos la solicitud a la API de AZURE
        const response = await fetch(url, {
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

        const data = await response.json();

        // Devolvemos las respuestas encontradas por AZURE
        return res.status(200).json({
            mensaje: "Pregunta respondida correctamente",
            respuestas: data.answers
        });

    } catch (error) {
        return res.status(500).json({ error: "Error al responder la pregunta" });
    }
};
