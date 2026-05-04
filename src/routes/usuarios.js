const express = require('express')
const router = express.Router()
const followerController = require('../controllers/followerController')
const { requerirLogin } = require('../middlewares/auth')
const usuarioController = require('../controllers/usuarioController')

router.post('/usuarios/:id/seguir', requerirLogin, followerController.seguir)
router.post('/usuarios/:id/dejar-de-seguir', requerirLogin, followerController.dejarDeSeguir)
router.get('/usuarios/:id', usuarioController.verPerfil)

module.exports = router