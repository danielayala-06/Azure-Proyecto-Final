require("dotenv").config();

// Acceder a las variables
const suscriptionkey = process.env.SUB_KEY;
const endpoint = process.env.ENDPOINT;

const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Objects`;
//const imageURL = `https://img.magnific.com/foto-gratis/bodegon-escritorio-oficina-desordenado_52683-107200.jpg`
const imageURL = `https://img.magnific.com/foto-gratis/vista-aerea-despertador-anteojos-camara-taza-cafe-suministros-oficina-sobre-fondo-blanco_23-2147979096.jpg`;

exports.detectarObjetos = async (req, res) => {
	const body = req.body;

	if (!body || !body.url) {
		return res.status(400).json({
			error: "No se enviaron datos a procesar!",
		});
	}

	try {
		// Obtenemos la URL de la imagen a procesar
		const urlImagen = body.url;

		console.log("Iniciando la deteccion de objetos...");

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Ocp-Apim-Subscription-Key": suscriptionkey,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ url: urlImagen }),
		});

		if (!response.ok) {
			const errorData = await response.json();
			return res.status(500).json({ errores: errorData.error.message });
		}

		// Tuvimos exito
		const data = await response.json();

		// Enviamos los datos
		return res.status(200).json({
			mensaje: "Datos procesados exitosamente!",
			data: data,
		});
		//console.log(data)
		data.objects.forEach((obj) => {
			const confianza = (obj.confidence * 100).toFixed(2);
			console.log(
				`Objeto identificado: ${obj.object} - Confianza: ${confianza}%`,
			);

			// Ubicacion del objeto
			const rect = obj.rectangle;
			console.log(`\tCoordenadas del rectangulo: `);
			console.log(`\tInicio(superior, izquierdo):${rect.x}, ${rect.y} `);
			console.log(`\tDimensiones(px):${rect.w} ancho, ${rect.h} alto `);
		});
	} catch (error) {
		return res.status(500).json({
			mensaje: "Ha ocurrido un error enviando los datos a AZURE!",
			error: error,
		});
		console.log(`Error en el servicio: ${error}`);
	}
};
