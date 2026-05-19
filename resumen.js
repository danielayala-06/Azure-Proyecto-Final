require('dotenv').config()

// Acceder a las variables
const suscriptionkey = process.env.RECONGNITION_API_FOUNDRY
const endpoint = process.env.FOUNDRY_ENPOINT

const URL = `${endpoint}/language/analyze-text/jobs?api-version=2023-04-01`

async function resumirTexto(){
    // Texto largo que debera ser resumido

    const documentoLargo = "La campaña contra los Países Bajos y Francia duró menos de seis semanas. Alemania atacó el Oeste el 10 de mayo de 1940. Inicialmente, los comandantes británicos y franceses habían pensado que las fuerzas alemanas atacarían a través del centro de Bélgica como lo habían hecho en la Primera Guerra Mundial y enviaron fuerzas rápidamente a la frontera franco-belga para detener el ataque alemán."

    //Parametrizar el documento
    const cuerpoPeticion ={
        displayName: "La invasion de Europa Occidental",
        analysisInput:{
            documents:[{
                id: "1", 
                language: "es", 
                text: documentoLargo
            }]
        },
        tasks:[{
            kind: "ExtractiveSummarization",
            taskName: "Resumen_invasion",
            parameters:{ sentenceCount: 2}
        }]
    }

    try {
        const response = await fetch(URL, {
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

        // Hasta este punto, la mitad del trabajo esta resuelto
        const URLSeguimiento = response.headers.get('operation-location')
        console.log("Trabajo aceptado en el servidor, procesando . . .")

        // BUcle que varifique cada 2 segundos si tiene la respuesta lista
        let resultadoFinal = null

        while(true){
            const respuestaSeguimiento = await fetch(URLSeguimiento, {
                headers: {"Ocp-Apim-Subscription-Key": suscriptionkey}
            })

            resultadoFinal = await respuestaSeguimiento.json()

            if(resultadoFinal.status === 'succeeded')break;
            if(resultadoFinal.status === 'failed')throw new Error('El servidor no lo pudo procesar');

            await new Promise(resolve => setTimeout(resolve,2000))
        } // fin del while 

        // Finalmente, tenemos la respuesta
        console.log("Resumen generado por la IA")
        const tareaFinalizada = resultadoFinal.tasks.items[0]
        const frasesResumen = tareaFinalizada.results.documents[0].sentences

        console.log(`Tarea finalizada: ${tareaFinalizada}`)
        frasesResumen.forEach((frase, indice) => {
            console.log(`${indice} - ${frase.text}`)
        });

    } catch (error) {
        console.error(error.message)
    }
    
    
}
resumirTexto()