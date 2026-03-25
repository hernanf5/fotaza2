const express    = require('express')
const router     = express.Router()
const authController = require('../controllers/authController')
const { redirigirSiLogueado } = require('../middlewares/auth')

router.get('/register', redirigirSiLogueado, authController.mostrarRegistro)
router.post('/register', authController.registrar)

router.get('/login', redirigirSiLogueado, authController.mostrarLogin)
router.post('/login', authController.login)

router.post('/logout', authController.logout)

module.exports = router