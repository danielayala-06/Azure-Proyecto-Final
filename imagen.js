require('dotenv').config()

// Acceder a las variables
const suscriptionkey = process.env.SUB_KEY
const endpoint = process.env.ENDPOINT

//  La URL describe las funcionalidad que deseamos aprovechar
const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Categories,Description,Color`
const imageURL = `https://static.vecteezy.com/system/resources/thumbnails/052/264/273/small/three-women-smiling-together-in-a-group-free-video.jpg`

// ESta funcionalidad require ejecutarse como promesa
async function analizarImagen(){
    try {
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
            throw new Error(`Error en: ${errorData.error.message}`) // Enviamos una 
        }

        // Logramos recibir un resultado favorable
        const data = await response.json()
        const confianza = (data.description.captions[0].confidence *100).toFixed(2)

        console.log("Descripcion: ", data.description.captions[0].text)
        console.log(`Confianza: ${confianza}%`)
        // join método itera y concatena valores de un array
        console.log("Etiquetas: " + data.description.tags.join(", "))

    } catch (error) {
        console.error(`Error analizando la imagen: ${error.message}`)
    }
}
analizarImagen()