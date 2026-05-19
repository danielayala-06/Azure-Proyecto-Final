require('dotenv').config()

// Acceder a las variables
const suscriptionkey = process.env.SUB_KEY
const endpoint = process.env.ENDPOINT

const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Objects`
//const imageURL = `https://img.magnific.com/foto-gratis/bodegon-escritorio-oficina-desordenado_52683-107200.jpg`
const imageURL = `https://img.magnific.com/foto-gratis/vista-aerea-despertador-anteojos-camara-taza-cafe-suministros-oficina-sobre-fondo-blanco_23-2147979096.jpg`

async function detectarObjetos(){
	try{
		console.log("Iniciando la deteccion de objetos...")
		
		const response = await fetch(url, {
			method: 'POST',
			headers: {
                "Ocp-Apim-Subscription-Key": suscriptionkey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({url: imageURL})
		})

		if(!response.ok){
			const errorData = await response.json()
			throw new Error(errorData.error.message)
		}

		// Tuvimos exito
		const data = await response.json()

		//console.log(data)
		data.objects.forEach(obj => {
			const confianza = (obj.confidence *100).toFixed(2)
			console.log(`Objeto identificado: ${obj.object} - Confianza: ${confianza}%`)

			// Ubicacion del objeto
			const rect = obj.rectangle
			console.log(`\tCoordenadas del rectangulo: `)
			console.log(`\tInicio(superior, izquierdo):${rect.x}, ${rect.y} `)
			console.log(`\tDimensiones(px):${rect.w} ancho, ${rect.h} alto `)
		});

	}catch(error){
		console.log(`Error en el servicio: ${error}`)
	}
}
detectarObjetos()
