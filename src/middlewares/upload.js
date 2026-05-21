const multer = require('multer')
const path = require('path')
const fs = require('fs')
const sharp = require('sharp')

const destino = path.join(__dirname, '..', 'public', 'uploads')

// Crear carpeta si no existe
if (!fs.existsSync(destino)) {
  fs.mkdirSync(destino, { recursive: true })
}

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const permitidos = /jpeg|jpg|png|gif|webp/
  const esValido   = permitidos.test(path.extname(file.originalname).toLowerCase()) && permitidos.test(file.mimetype)
  if (esValido) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'))
  }
}



// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, destino)
//   },
//   filename(req, file, cb) {
//     const ext       = path.extname(file.originalname)
//     const nombre    = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext
//     cb(null, nombre)
//   },
// })


const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, //5MB por archivo MAX
})

// procesado 
async function procesarImagenes(req, res, next) {
  if (!req.files || req.files.length === 0) return next()

  const licencia        = req.body.licencia
  const marcaAguaTexto  = req.body.marca_agua_texto

  try {
    const archivosProcessados = []

    for (const file of req.files) {
      const nombre   = Date.now() + '-' + Math.round(Math.random() * 1e9) + '.jpg'
      const rutaSalida = path.join(destino, nombre)

      let imagen = sharp(file.buffer).jpeg({ quality: 85 })

      // Si tiene copyright y texto de marca de agua, la aplicamos
      if (licencia === 'copyright' && marcaAguaTexto && marcaAguaTexto.trim()) {
        const metadata = await sharp(file.buffer).metadata()
        const ancho    = metadata.width  || 800
        const alto     = metadata.height || 600

        const fontSize = Math.max(16, Math.round(ancho / 25))

        // SVG con el texto de marca de agua
        const svg = Buffer.from(`
          <svg width="${ancho}" height="${alto}">
            <style>
              text {
                font-family: Arial, sans-serif;
                font-size: ${fontSize}px;
                font-weight: bold;
                fill: rgba(255, 255, 255, 0.6);
              }
            </style>
            <text
              x="50%"
              y="50%"
              text-anchor="middle"
              dominant-baseline="middle"
              transform="rotate(-30, ${ancho/2}, ${alto/2})"
            >${marcaAguaTexto.trim()}</text>
          </svg>
        `)

        imagen = sharp(file.buffer)
          .composite([{ input: svg, blend: 'over' }])
          .jpeg({ quality: 85 })
      }

      await imagen.toFile(rutaSalida)

      archivosProcessados.push({
        filename: nombre,
        originalname: file.originalname,
      })
    }

    req.files = archivosProcessados
    next()

  } catch (error) {
    console.error('Error al procesar imagen:', error)
    next(error)
  }
}

module.exports = { upload, procesarImagenes}