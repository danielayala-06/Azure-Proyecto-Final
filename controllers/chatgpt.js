require("dotenv").config();

// Datos de acceso al servicio de Azure OpenAI
const AZURE_ENDPOINT = process.env.CHATGPT_ENDPOINT;
const DEPLOYMENT_NAME = process.env.CHATGPT_DEPLOYMENT || "gpt-5.4-mini";
const API_KEY = process.env.TOKEN_FOUNDRY;
const API_VERSION = "2025-04-01-preview";

exports.preguntarGPT = async (req, res) => {
    const { pregunta, historial = [] } = req.body;

    // En caso de no enviarse la pregunta
    if (!pregunta) {
        return res.status(400).json({ error: "La pregunta es requerida" });
    }

    // Construimos el endpoint con el deployment y la version de la API
    const url = `${AZURE_ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}`;

    // Preparamos el historial de mensajes incluyendo la nueva pregunta
    const body = {
        messages: [
            { role: "system", content: "Eres un asistente util" },
            ...historial,
            { role: "user", content: pregunta }
        ],
        max_completion_tokens: 800,
        temperature: 0.7
    };

    try {
        // Realizamos la solicitud a la API de Azure OpenAI
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": API_KEY
            },
            body: JSON.stringify(body)
        });

        // En caso de que la respuesta no sea exitosa
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(500).json({
                mensaje: "Error en el servidor de Azure OpenAI",
                errores: errorData
            });
        }

        const data = await response.json();

        // Extraemos el mensaje de la respuesta
        const mensajeRespuesta = data.choices[0].message;

        // Devolvemos la respuesta, los tokens usados y el historial actualizado
        return res.status(200).json({
            mensaje: "Respuesta obtenida correctamente",
            respuesta: mensajeRespuesta.content,
            tokens_usados: data.usage.total_tokens,
            nuevo_historial: [
                ...historial,
                { role: "user", content: pregunta },
                mensajeRespuesta
            ]
        });

    } catch (error) {
        return res.status(500).json({ error: "Error al conectar con Azure OpenAI" });
    }
};
