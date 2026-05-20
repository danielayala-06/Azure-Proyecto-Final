require("dotenv").config();

// Accedemos a las variables de entorno
const suscriptionkey = process.env.RECONGNITION_API_FOUNDRY;
const endpoint = process.env.FOUNDRY_ENPOINT;

const url = `${endpoint}/language/:analyze-text?api-version=2023-04-01`;

exports.extraerDatos = async (req, res) => {
    const body = req.body; // Obtenemos los datos enviados del frontend

    // En caso de que no se envie datos
    if (!body) {
        return res.status(400).json({
            error: "No se enviaron datos a procesar!",
        });
    }

    try {
        // Paso 1 - Documento que se desea analizar
        const texto = body.texto;

        const documentoProcesar = {
            kind: "EntityRecognition",
            analysisInput: {
                documents: [
                    {
                        id: "1",
                        language: "es",
                        text: texto,
                    },
                ],
            },
        };

        // paso 2 - Enviar documento
        console.log("Enviando texto a Azure para extraccion . . .");
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": suscriptionkey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(documentoProcesar),
        });

        // En caso de que no obtengamos una respuesta positiva
        if (!response.ok) {
            const errorData = await response.json();
            // Devolvemos los errores encontrados
            return res.status(500).json({
                errores: errorData,
            });
        }

        // Paso 3 - Recibir respuesta de AZURE
        const data = await response.json();

        if (data.results.errors.length > 0) {
            return res.status(500).json({
                errores: data.errors,
            });
        }

        // Extraer todos los datos clave de cada DOCUMENTO
        // Es tambien el unico documento que enviamos

        const primerDocumento = data.results.documents[0];

        return res.status(200).json({
            mensaje: "Datos procesados exitosamente!",
            respuesta: primerDocumento.entities,
        });

        // La empresa para la que desarrolla, solo quiere obtener las fechas de esta conversacion.

        // Visualizamos solo los datos clave que sean Fecha y Hora
        primerDocumento.entities.forEach((doc) => {
            doc.category === "DateTime" ? console.log(doc) : null;
        });
    } catch (error) {
        console.error(error.message);
    }
};
exports.fetchTexto = async (req, res) => {
    const data = req.body;

    if (!data) {
        return res.status(400).json({ error: "No se enviaron datos a procesar!" });
        //throw new Error("Se envio un mensaje nulo!");
    }
    try {
        return res.status(200).json({
            mensaje: "Se pudo procesar la informacion",
            data: JSON.stringify(data),
        });
    } catch (error) {
        console.error(error.message);
    }
};
