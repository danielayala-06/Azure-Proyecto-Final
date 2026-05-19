require('dotenv').config()

// Acceder a las variables
const suscriptionkey = process.env.SUB_KEY
const endpoint = process.env.ENDPOINT

const url =  `${endpoint}/vision/v3.2/analyze?visualFeatures=Description,Tags,Objects`
const imageURL = 'https://img.magnific.com/foto-gratis/feliz-joven-compania-amigos-sonrientes-sentados-parque-sobre-cesped-patinete-electrico-hombre-mujer-divirtiendose-juntos_285396-8855.jpg'


async function analizarContenido(){
    try {
       console.log("Analizando imagen...")
       const response = await fetch(url,{
        method: 'POST',
        headers: {
            "Ocp-Apim-Subscription-Key": suscriptionkey,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({url: imageURL})
       })
       //console.log(response)

       if(!response.ok){
        const dataError = await response.error
        throw new Error(dataError.error.message)
       }
       
       const data = await response.json()
       // console.log(data) >>>    GUARDARLOOO COMO MANUAL PES PAPETO LENDO

       // Mostrar la descripcion de la imagen
       const  descripcion = data.description.captions[0].text
       const  confianza = (data.description.captions[0].confidence*100).toFixed(2)
       console.log(`Resumen: ${descripcion} \nConfianza: ${confianza}%`)
       
       // Etiquetas
       const listaEtiquetas = data.tags.map(e=> `${e.name} - ${(e.confidence *100).toFixed(2)}%\n`);
       
       console.log(`Etiquetas detectadas: \n${listaEtiquetas.join('')}`)

       // Ubicacion de objetos
       console.log("Ubicacion de Objetos")
       data.objects.forEach(element => {
        // element.rectangle.h (alto), element.rectangle.w (ancho)
        console.log(`\t${element.object} - (x:${element.rectangle.x} y:${element.rectangle.y})`)
       });

    } catch (error) {
        console.error(error.message)
    }
        
}

analizarContenido();