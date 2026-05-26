require('dotenv').config()

// Datos de acceso

const AZURE_ENDPOINT = process.env.CHATGPT_ENDPOINT
const DEPLOYMENT_NAME = 'gpt-5.4-mini'
const API_KEY = process.env.TOKEN_FOUNDRY
const API_VERSION = '2025-04-01-preview'

async function preguntarAzure(pregunta = '', historial = []){
    // Endpoint Final
    const url = `${AZURE_ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}`


    // Objeto conteniendo informacion BODY
    const body = {
        messages: [
            {role: "system", content: "Eres un asistente util"},
            ...historial,
            {role: "user", content: pregunta}
        ],
        max_completion_tokens: 800,
        temperature: 0.7
    }

    const response = await fetch(url, {
        method: 'POST', 
        headers: {
            "Content-Type": "application/json",
            "api-key": API_KEY
        },
        body: JSON.stringify(body)
    })

    if(!response.ok){
        console.error('NO se accedio al servicio')
        return;
    }

    const data = await response.json()
    const mensaje = data.choices[0].message

    // Esta funcion devovera un objeto
    return {
        respuesta: mensaje.content,
        tokens_usados: data.usage.total_tokens,
        nuevo_historial: [...historial, {role: 'user', content: pregunta}, mensaje]
    }
}

// Prepara un BATCH(lote) de preguntas que estaran relacionadas
async function test(){
    let historial = []
    // P1 - ¿qUIEN ES GOKu
    console.log('-- Pregunta 1 --')

    let r1 = await preguntarAzure('¿Que sabes de Perukistan? dame una respuesta corta', historial)
    console.log(r1.respuesta)
    historial = r1.nuevo_historial

    // P1 - ¿qUIEN ES GOKu
    console.log('-- Pregunta 2 --')
    let r2 = await preguntarAzure('¿Que tan corrupto es ese Pais?', historial)
    console.log(r2.respuesta)
    historial = r2.nuevo_historial 
    // P1 - ¿qUIEN ES GOKu
    console.log('-- Pregunta 3 --')
    let r3 = await preguntarAzure('¿Quienes son esos politicos?', historial)
    console.log(r3.respuesta)
    historial = r3.nuevo_historial

    // Fin...
    console.log(`--- Tokens utilizados --`)
}
test()