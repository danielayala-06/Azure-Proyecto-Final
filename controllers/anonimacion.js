require("dotenv").config();

// Acceder a las variables de entorno
const suscriptionkey = process.env.RECONGNITION_API_FOUNDRY;
const endpoint = process.env.FOUNDRY_ENPOINT;

const url = `${endpoint}/language/:analyze-text?api-version=2023-04-01`;

exports.anonimizarDatos = async (req, res) => {
    const body = req.body;

    // En caso de no enviarse el texto
    if (!body || !body.texto) {
        return res.status(400).json({ error: "El texto es requerido" });
    }

    // Preparamos el cuerpo de la solicitud para la API de AZURE
    const documentoAnonimizar = {
        kind: "PiiEntityRecognition",
        analysisInput: {
            documents: [{
                id: "1",
                language: "es",
                text: body.texto
            }]
        },
        parameters: {
            redactionPolicy: {
                policyKind: "CharacterMask",
                redactionCharacter: "*"
            }
        }
    };

    try {
        // Realizamos la solicitud a la API de AZURE
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": suscriptionkey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(documentoAnonimizar)
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

        if (data.results.errors.length > 0) {
            return res.status(500).json({ errores: data.results.errors });
        }

        const primerDocumento = data.results.documents[0];

        // Devolvemos el texto anonimizado y las entidades detectadas
        return res.status(200).json({
            mensaje: "Texto anonimizado correctamente",
            textoAnonimizado: primerDocumento.redactedText,
            entidades: primerDocumento.entities
        });

    } catch (error) {
        return res.status(500).json({ error: "Error al anonimizar el texto" });
    }
};
