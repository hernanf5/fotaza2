const express = require('express')
const router = express.Router()
const mensajeController = require('../controllers/mensajeController')
const { requerirLogin } = require('../middlewares/auth')

router.get('/mensajes', requerirLogin, mensajeController.listarConversaciones)
router.get('/mensajes/:usuario_id', requerirLogin, mensajeController.verConversacion)
router.post('/mensajes/:usuario_id', requerirLogin, mensajeController.enviar)
router.post('/imagenes/:id/me-interesa', requerirLogin, mensajeController.meInteresa)

module.exports = router