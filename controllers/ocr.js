require("dotenv").config();

// Acceder a las variables de entorno
const suscriptionkey = process.env.SUB_KEY;
const endpoint = process.env.ENDPOINT;

const url = `${endpoint}/vision/v3.2/read/analyze`;

exports.leerTexto = async (req, res) => {
    const { url: urlImagen } = req.body;

    // En caso de no enviarse la URL
    if (!urlImagen) {
        return res.status(400).json({ error: "La URL de la imagen es requerida" });
    }

    try {
        console.log("Enviando imagen a Azure OCR...");

        // Paso 1 - Enviamos la imagen a AZURE
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": suscriptionkey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: urlImagen })
        });

        // En caso de que la respuesta no sea exitosa
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(500).json({ errores: errorData.error.message });
        }

        // Paso 2 - AZURE devuelve una URL de seguimiento en el Header
        // Azure no devuelve el texto inmediatamente
        const operationLocation = response.headers.get("operation-location");
        console.log("Procesando imagen, esperando resultados...");

        // Paso 3 - Consultamos la URL de seguimiento hasta obtener el resultado
        let result = null;
        while (true) {
            const checkResponse = await fetch(operationLocation, {
                headers: { "Ocp-Apim-Subscription-Key": suscriptionkey }
            });

            result = await checkResponse.json();

            if (result.status === "succeeded") break;
            if (result.status === "failed") throw new Error("Error procesando la imagen");

            // Esperamos 1 segundo antes de volver a consultar
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Paso 4 - Extraemos las lineas de texto detectadas
        const lineas = [];
        result.analyzeResult.readResults.forEach(page => {
            page.lines.forEach(line => {
                lineas.push(line.text);
            });
        });

        // Devolvemos las lineas de texto extraidas
        return res.status(200).json({
            mensaje: "Texto extraido correctamente",
            lineas: lineas
        });

    } catch (error) {
        return res.status(500).json({ error: "Error al procesar la imagen" });
    }
};
