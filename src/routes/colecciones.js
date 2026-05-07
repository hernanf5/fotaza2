const express = require('express')
const router = express.Router()
const coleccionController = require('../controllers/coleccionController')
const { requerirLogin } = require('../middlewares/auth')

router.get('/colecciones', requerirLogin, coleccionController.listar)
router.get('/colecciones/:id', requerirLogin, coleccionController.ver)
router.post('/colecciones', requerirLogin, coleccionController.crear)
router.post('/colecciones/:id/agregar', requerirLogin, coleccionController.agregarPublicacion)
router.post('/colecciones/:id/quitar', requerirLogin, coleccionController.quitarPublicacion)

module.exports = router