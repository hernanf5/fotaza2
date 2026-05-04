const express = require('express')
const router = express.Router()
const comentarioController = require('../controllers/comentarioController')
const { requerirLogin } = require('../middlewares/auth')

router.post('/publicaciones/:id/comentarios', requerirLogin, comentarioController.crear)
router.post('/publicaciones/:id/comentarios/toggle', requerirLogin, comentarioController.toggleComentarios)
router.post('/publicaciones/:id/comentarios/:comentarioId/eliminar', requerirLogin, comentarioController.eliminar)

module.exports = router