const { text } = require('express')

require('dotenv').config()

// Acceder a las variables
const suscriptionkey = process.env.RECONGNITION_API_FOUNDRY
const endpoint = process.env.FOUNDRY_ENPOINT

const url = `${endpoint}/language/:query-text?api-version=2021-10-01`
/* const url = `${endpoint}/language/:query-knowledgebases?projectName=PruebaQA&api-version=2021-10-01` */

async function responderPreguntas(){
    try {
        const contextoAnalizar = `PHP se considera uno de los lenguajes más efectivos para el desarrollo web debido a su arquitectura eficiente, su facilidad de aprendizaje y su dominio del mercado.  Su modelo de ejecución server-side (lado del servidor) permite alojar cientos de sitios web en un solo servidor con bajo consumo de recursos, algo que otros lenguajes como Node.js o Python no logran con la misma eficiencia en entornos de bajo tráfico debido a la necesidad de procesos persistentes.`

        const pregunta= `¿Por que PHP se considera uno de los lenguajes más efectivos para el desarrollo web?`

        /* const cuerpoPeticion = {
            kind: 'Conversation',
            analysisInput: {
                conversationItem: {
                    id: '1',
                    participantId: 'usuario-final',
                    text: pregunta
                }
            },
            parameters: {
                projectName: 'PruebaQA',
                deploymentName: 'production',
                stringIndexType: 'Utf16CodeUnit',
                records: [
                    {
                        id: 'contexto_01',
                        text: contextoAnalizar
                    }
                ]
            }
        }
 */
        
        // Version compacta de la peticion a los servicios de AZURE
        const cuerpoPeticion = {
            question: pregunta,
            records: [{
                id:'doc_01',
                text: contextoAnalizar
            }]
        }
        console.log('Buscando respuesta en el documento . . .')

        const response = await fetch(url, {
            method: 'POST',
            headers:{
                "Ocp-Apim-Subscription-Key": suscriptionkey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cuerpoPeticion)
        })

        if(!response.ok){
            const errorData = await response.json()
			throw new Error(errorData.error.message)
		}
        const data = await response.json()

        const respuesta = data.answers[0].answer
        const confianza = (data.answers[0].confidenceScore * 100).toFixed(2)

        console.log(`Respuesta: ${respuesta} | Confianza: ${confianza}% `)
        //const data = await response.json()


    } catch (error) {
        console.error(error.messages)
    }
}
responderPreguntas()