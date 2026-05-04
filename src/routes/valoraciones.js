const express = require('express')
const router = express.Router()
const valoracionController = require('../controllers/valoracionController')
const { requerirLogin } = require('../middlewares/auth')

router.post('/imagenes/:id/valorar', requerirLogin, valoracionController.valorar)

module.exports = router