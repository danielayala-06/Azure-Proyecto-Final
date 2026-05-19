require('dotenv').config()

// Acceder a las variables
const suscriptionkey = process.env.SUB_KEY
const endpoint = process.env.ENDPOINT

const url = `${endpoint}/vision/v3.2/read/analyze`
//const imageURL = `https://www.mindmeister.com/image/xlarge/1387046227/mind-map-la-sinopsis-el-cuadro-sin-ptico-y-el-mapa-mental.png`
const imageURL = `https://azurejhon.w3spaces.com/peru.pdf`

async function leerTexto(){
    try {
        console.log("Enviando imagen a Azure..")

        const response = await fetch(url,{
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

        // Tratamiento especial...
        // Azure no devuelve el texto inmediatamente, devuelve una URL en el Header 'operation-location'

        const operationLocation= response.headers.get('operation-location')
        console.log('Procesando... esperando resultados')

        // PARTE 2: Consultar URL de la operacion hasta que se encuentre como "succes" 
        let result = null;
        while(true){
            const checkResponse = await fetch(operationLocation,{
                headers: {"Ocp-Apim-Subscription-Key": suscriptionkey}
            })
            
            result = await checkResponse.json();

            if(result.status === 'succeeded')break; // Escapamos el while
            if(result.status === 'failed') throw new Error('Error analizando datos...');
            
            // Esperamos 1 segundo para voler a intentarlo
            await new Promise(resolve => setTimeout(resolve, 1000))
        }

        // PARTE 3: Extraer y mostrar el texto detectado
        console.log("texto detectado")
        result.analyzeResult.readResults.forEach(page => {
            page.lines.forEach(line => {console.log(line.text)})
        });


    } catch (error) {
        console.error(`Error en el servicio: ${error.message}`)
    }
}

leerTexto()
