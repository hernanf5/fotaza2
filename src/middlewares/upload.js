const multer = require('multer')
const path = require('path')
const fs = require('fs')

const destino = path.join(__dirname, '..', 'public', 'uploads')

// Crear carpeta si no existe
if (!fs.existsSync(destino)) {
  fs.mkdirSync(destino, { recursive: true })
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, destino)
  },
  filename(req, file, cb) {
    const ext       = path.extname(file.originalname)
    const nombre    = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext
    cb(null, nombre)
  },
})

const fileFilter = (req, file, cb) => {
  const permitidos = /jpeg|jpg|png|gif|webp/
  const esValido   = permitidos.test(path.extname(file.originalname).toLowerCase())
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB por archivo
})

module.exports = upload