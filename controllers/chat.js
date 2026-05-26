/**
 * Utiliza el LLM Phi-4 de Microsoft 
 * Require la activacion de Microsoft.Web (Suscripcion> Configuracion> Proveedores de recursos)
 */
require('dotenv').config()

// Datos de acceso

const endPointURL = process.env.MODEL_IA_ENDPOINT
const token = process.env.TOKEN_FOUNDRY

async function enviarPregunta (pregunta = ``){
    pregunta += ', dame una respuesta corta.'
    // Preparamos la data para enviar al endpoint
    const configuracion = {
        model: 'Phi-4',
        messages: [
            {role: 'user', content: pregunta}
        ]
    }
    
    // Hacemos el fetch al endpoint de AZURE
    const response = await fetch(endPointURL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': `application/json`
        },
        body: JSON.stringify(configuracion)
    })

    if(!response.ok){
        console.error('No se pudo acceder al servicio')
        return
    }
    
    // Obtenemos la respuesta
    const data = await response.json();
    
    if(data.choices&& data.choices.length > 0){
        console.log(`Respuesta corta: ${data.choices[0].message.content}`)
    }else{
        console.log('No se encontro contenido para la respuesta')
    }
}
enviarPregunta('Cuentame un chiste!')

/* 
//Consulta
fetch(endPointURL, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': `application/json`
    },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => {
    console.log(`Respuesta completa: ${data}`)
    if(data.choices&& data.choices.length > 0){
        console.log(`Respuesta corta: ${data.choices[0].message.content}`)
    }else{
        console.log('No se encontro contenido para la respuesta')
    }
})
.catch(e=> {console.error(e)}) */