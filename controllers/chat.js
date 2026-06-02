require("dotenv").config();

/**
 * Utiliza el modelo Phi-4 de Microsoft desplegado en Azure AI Foundry
 * Autenticacion via Bearer token (diferente a los servicios cognitivos)
 */

// Datos de acceso al endpoint de inferencia de Azure AI Foundry
const endPointURL = process.env.MODEL_IA_ENDPOINT;
const token = process.env.TOKEN_FOUNDRY;

exports.preguntarPhi = async (req, res) => {
    const { pregunta } = req.body;

    // En caso de no enviarse la pregunta
    if (!pregunta) {
        return res.status(400).json({ error: "La pregunta es requerida" });
    }

    // Preparamos el cuerpo de la solicitud para el modelo Phi-4
    const configuracion = {
        model: "Phi-4",
        messages: [
            { role: "user", content: pregunta }
        ]
    };

    try {
        // Realizamos la solicitud al endpoint de inferencia de Azure AI Foundry
        // Phi-4 usa autenticacion Bearer en lugar de Ocp-Apim-Subscription-Key
        const response = await fetch(endPointURL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(configuracion)
        });

        // En caso de que la respuesta no sea exitosa
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(500).json({
                mensaje: "Error en el servidor de Azure AI Foundry",
                errores: errorData
            });
        }

        const data = await response.json();

        // Verificamos que haya contenido en la respuesta
        if (!data.choices || data.choices.length === 0) {
            return res.status(500).json({ error: "No se encontro contenido en la respuesta" });
        }

        // Devolvemos la respuesta del modelo Phi-4
        return res.status(200).json({
            mensaje: "Respuesta obtenida correctamente",
            respuesta: data.choices[0].message.content,
            tokens_usados: data.usage ? data.usage.total_tokens : null
        });

    } catch (error) {
        return res.status(500).json({ error: "Error al conectar con Azure AI Foundry" });
    }
};
