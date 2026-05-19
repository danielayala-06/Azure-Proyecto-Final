require('dotenv').config()

// Acceder a las variables
const suscriptionkey = process.env.RECONGNITION_API_FOUNDRY
const endpoint = process.env.FOUNDRY_ENPOINT

const url = `${endpoint}/language/:analyze-text?api-version=2023-04-01`

async function anonimizarDatos()
{
    try {
        const texto = `Hola, mi nombre es Juan Carlos Perez con DNI 4545646. Mi numero de telefono es 956123123 y vivo en Av. Miraflores 748, Arequipa. Pueden escribirme a juancarlos@gmail.com`

        const documentoAnonimizar = {
            kind: 'PiiEntityRecognition',
            analysisInput: {
                documents: [{
                    id: '1',
                    language: 'es',
                    text: texto
                }]
            },
            parameters: {
                redactionPolicy: {
                    policyKind: 'CharacterMask',
                    redactionCharacter: '*'
                }
            }
        }

        const response = await fetch(url, {
            method: 'POST',
            headers:{
                "Ocp-Apim-Subscription-Key": suscriptionkey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(documentoAnonimizar)
        })

        if(!response.ok){
            const errorData = await response.json()
			throw new Error(errorData.error.message)
		}

        const data = await response.json()
        
        if(data.results.errors.length > 0){
            console.error(data.results.errors) 
            return
        }
        
        const primerDocumento = data.results.documents[0]

        console.log(primerDocumento.redactedText)

    } catch (error) {
        console.error(error.message)
    }
}
anonimizarDatos()