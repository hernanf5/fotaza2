const multer = require('multer')
const path = require('path')
const fs = require('fs')
const sharp = require('sharp')
const Jimp = require('jimp')

const destino = path.join(__dirname, '..', 'public', 'uploads')

if (!fs.existsSync(destino)) {
  fs.mkdirSync(destino, { recursive: true })
}

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const permitidos = /jpeg|jpg|png|gif|webp/
  const esValido = permitidos.test(path.extname(file.originalname).toLowerCase())
                  && permitidos.test(file.mimetype)
  if (esValido) {
    cb(null, true)
  } else {
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})

async function procesarImagenes(req, res, next) {
  if (!req.files || req.files.length === 0) return next()

  const licencia = req.body.licencia
  const marcaAguaTexto = req.body.marca_agua_texto

  try {
    const archivosProcessados = []

    for (const file of req.files) {
      const nombre = Date.now() + '-' + Math.round(Math.random() * 1e9) + '.jpg'
      const rutaSalida = path.join(destino, nombre)

      if (licencia === 'copyright' && marcaAguaTexto && marcaAguaTexto.trim()) {
        // Usar Jimp para la marca de agua — compatible con cualquier OS
        const imagen = await Jimp.read(file.buffer)
        const ancho = imagen.bitmap.width
        const alto = imagen.bitmap.height

        const fontSize = ancho > 1000 ? Jimp.FONT_SANS_64_WHITE : Jimp.FONT_SANS_32_WHITE
        const font = await Jimp.loadFont(fontSize)

        // Calcular posición centrada
        const textoAncho = Jimp.measureText(font, marcaAguaTexto.trim())
        const textoAlto  = Jimp.measureTextHeight(font, marcaAguaTexto.trim(), ancho)

        const x = (ancho - textoAncho) / 2
        const y = (alto - textoAlto) / 2

        imagen.print(font, x, y, marcaAguaTexto.trim())
        imagen.opacity(0.6)

        const buffer = await imagen.getBufferAsync(Jimp.MIME_JPEG)
        fs.writeFileSync(rutaSalida, buffer)

      } else {
        await sharp(file.buffer).jpeg({ quality: 85 }).toFile(rutaSalida)
      }

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

module.exports = { upload, procesarImagenes }