const express = require('express')
const router = express.Router()
const validadorController = require('../controllers/validadorController')
const { requerirValidador } = require('../middlewares/auth')

router.get('/validador', requerirValidador, validadorController.panel)
router.get('/validador/publicaciones/:id', requerirValidador, validadorController.verDenuncias)
router.post('/validador/publicaciones/:id/dar-de-baja', requerirValidador, validadorController.darDeBaja)
router.post('/validador/publicaciones/:id/desestimar', requerirValidador, validadorController.desestimar)

module.exports = router