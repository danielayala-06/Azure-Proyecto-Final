# Azure IA — Plataforma de servicios de inteligencia artificial

Plataforma web que conecta distintos servicios de IA de Azure con unvanillaa interfaz de usuario sencilla. Cada modulo expone un servicio diferente: desde análisis de imágenes hasta conversación con modelos de lenguaje(chatbots).

---

## Módulos disponibles

| Módulo | Servicio Azure | Descripción |
|---|---|---|
| Detección | Computer Vision | Detecta objetos en una imagen y los marca con rectángulos |
| Análisis | Computer Vision | Analiza el contenido de una imagen (tags, objetos, descripción) |
| OCR | Computer Vision Read | Extrae texto escrito de imágenes o PDFs |
| Extracción | Azure AI Language | Extrae entidades clave de un texto (persona, lugar, fecha, etc.) |
| Anonimación | Azure AI Language | Detecta y enmascara datos personales (PII) en texto |
| Resumen | Azure AI Language | Resume textos largos en frases clave |
| Preguntas | Azure AI Language | Responde preguntas basándose en un contexto de texto |
| Chat GPT | Azure OpenAI | Chat conversacional multi-turno con GPT |
| Chat Phi-4 | Azure AI Foundry | Pregunta simple al modelo Phi-4 de Microsoft |

---

## Tecnologías

- **Backend:** Node.js + Express
- **Frontend:** HTML, Bootstrap 5, JavaScript
- **IA:** Microsoft Azure (Computer Vision, AI Language, OpenAI, AI Foundry)
- **Variables de entorno:** dotenv

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd azure-ia
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Renombra el archivo `.env` (o créalo en la raíz) y completa tus credenciales de Azure:

```env
# Azure Computer Vision
SUB_KEY = "tu_subscription_key"
ENDPOINT = "https://tu-recurso.cognitiveservices.azure.com/"

# Azure AI Language (Foundry)
RECONGNITION_API_FOUNDRY = "tu_api_key"
FOUNDRY_ENPOINT = "https://tu-recurso.services.ai.azure.com/"

# Azure OpenAI (ChatGPT)
CHATGPT_ENDPOINT = "https://tu-recurso.openai.azure.com/"
CHATGPT_DEPLOYMENT = "nombre-de-tu-deployment"
TOKEN_FOUNDRY = "tu_api_key"

# Azure AI Foundry (Phi-4)
MODEL_IA_ENDPOINT = "https://tu-endpoint-phi4/chat/completions"

PORT = 3000
```

### 4. Ejecutar el servidor

```bash
node app.js
```

### 5. Abrir en el navegador

```
http://localhost:3000
```

---

## Estructura del proyecto

```
azure-ia/
├── app.js                  # Servidor Express + rutas de vistas
├── router.js               # Rutas de la API (/api/*)
├── controllers/            # Lógica de cada módulo (llamadas a Azure)
│   ├── deteccion.js
│   ├── analisis.js
│   ├── extraccion.js
│   ├── anonimacion.js
│   ├── ocr.js
│   ├── resumen.js
│   ├── preguntas.js
│   ├── chatgpt.js
│   └── chat.js
└── public/
    ├── views/modules/      # Páginas HTML de cada módulo
    └── src/                # JavaScript del frontend
```
