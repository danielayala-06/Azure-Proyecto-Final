require('dotenv').config()

// Acceder a las variables
const suscriptionkey = process.env.SUB_KEY
const endpoint = process.env.ENDPOINT

const URL_ENDPOINT =  `${endpoint}/vision/v3.2/analyze?visualFeatures=Description,Tags,Objects`
const imageURL = 'https://img.magnific.com/foto-gratis/feliz-joven-compania-amigos-sonrientes-sentados-parque-sobre-cesped-patinete-electrico-hombre-mujer-divirtiendose-juntos_285396-8855.jpg'


exports.analizarContenido = async (req, res)=>{
    // Obtenemos la URL de la imagen desde el cuerpo de la solicitud
    const { url } = req.body;
    
    // En caso de no enviarse la URL
    if(!url){
        return res.status(400).json({ error: 'La URL de la imagen es requerida' });
    }

    // Preparamos el cuerpo de la solicitud para la API de AZURE
    const body = {
        url: url
    }

    try {
       // Realizamos la solicitud a la API de AZURE
       const response = await fetch(URL_ENDPOINT,{
        method: 'POST',
        headers: {
            "Ocp-Apim-Subscription-Key": suscriptionkey,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
       })

       // En caso de que la respues no sea exitosa
       if(!response.ok){
        const dataError = await response.error
        return res.status(500).json({
            mensaje: 'Error en el servidor de AZURE', 
            error: dataError.error.message
        });
       }
       
       const data = await response.json()

       // Devolvemos la respuesta de AZURE 
       return res.status(200).json({
        mensaje: 'Imagen analizada correctamente',
        data: data
       })

    } catch (error) {
        return res.status(500).json({ error: 'Error al analizar la imagen' });
    }
        
}
