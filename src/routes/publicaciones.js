const express = require('express')
const router = express.Router()
const publicacionController = require('../controllers/publicacionController')
const { requerirLogin } = require('../middlewares/auth')
const upload = require('../middlewares/upload')

router.get('/publicaciones/nueva', requerirLogin, publicacionController.mostrarFormulario)
router.post('/publicaciones', requerirLogin, upload.array('imagenes', 10), publicacionController.crear)
router.get('/publicaciones/:id', publicacionController.ver)

module.exports = router