const express                  = require('express')
const router                   = express.Router()
const notificacionController   = require('../controllers/notificacionController')
const { requerirLogin }        = require('../middlewares/auth')

router.get('/notificaciones', requerirLogin, notificacionController.listar)
router.post('/notificaciones/:id/leer', requerirLogin, notificacionController.marcarLeida)
router.post('/notificaciones/leer-todas', requerirLogin, notificacionController.marcarTodasLeidas)

module.exports = router