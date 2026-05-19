/* 
    Este servicio permite identificar datos (informacion) clave en un documento Telefonos, nombres, edad, direccion, etc. 
*/

require('dotenv').config()

// Acceder a las variables
const suscriptionkey = process.env.RECONGNITION_API_FOUNDRY
const endpoint = process.env.FOUNDRY_ENPOINT

const url = `${endpoint}/language/:analyze-text?api-version=2023-04-01`

async function extraerDatos(){
    try {
        // Paso 1 - Documento que se desea analizar
        const texto = `El ingeniero Carlos Mendoza del equipo de TI coordino la compra de 15 servidores marca DELL por un valor de 45000 dolares para la sucursal de Autos Nova en Lima el pasado 12 de Mayo de 2026`
        
        const documentoProcesar = {
            kind: 'EntityRecognition',
            analysisInput: {
                documents: [
                    {
                        id: '1',
                        language: 'es',
                        text: texto 
                    }
                ]
            }
        }

        // paso 2 - Enviar documento
        console.log('Enviando texto a Azure para extraccion . . .')
        const response = await fetch(url, {
            method: 'POST',
            headers:{
                "Ocp-Apim-Subscription-Key": suscriptionkey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(documentoProcesar)
        })

        if(!response.ok){
            const errorData = await response.json()
			throw new Error(errorData.error.message)
		}

        // Paso 3 - Recibir respuesta
        const data = await response.json()

        if(data.results.errors.length > 0)
        {
            console.log(data.erros); return;
        }
        
        // Extraer todoso los datos clave de cada DOCUMENTO
        // ... Es tambien el unico documento que enviamos
        const primerDocumento = data.results.documents[0]
        
        // La empresa para la que desarrolla, solo quiere obtener las fechas de esta conversacion.

        // Visualizamos solo los datos clave que sean Fecha y Hora
        primerDocumento.entities.forEach(doc=>{
            (doc.category ==='DateTime')?  console.log(doc) : null
        })

    } catch (error) {
        console.error(error.message)
    }
}
extraerDatos();