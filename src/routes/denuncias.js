const express = require('express')
const router = express.Router()
const denunciaController = require('../controllers/denunciaController')
const { requerirLogin } = require('../middlewares/auth')

router.get('/publicaciones/:id/denunciar', requerirLogin, denunciaController.mostrarFormularioPublicacion)
router.post('/publicaciones/:id/denunciar', requerirLogin, denunciaController.denunciarPublicacion)

router.get('/publicaciones/:id/comentarios/:comentarioId/denunciar', requerirLogin, denunciaController.mostrarFormularioComentario)
router.post('/publicaciones/:id/comentarios/:comentarioId/denunciar', requerirLogin, denunciaController.denunciarComentario)

module.exports = router