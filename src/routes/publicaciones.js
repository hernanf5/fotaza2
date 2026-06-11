const express = require('express')
const router = express.Router()
const publicacionController = require('../controllers/publicacionController')
const { requerirLogin } = require('../middlewares/auth')
const {upload, procesarImagenes} = require('../middlewares/upload')

function handleUpload(req, res, next) {
    upload.array('imagenes', 10)(req, res, (err) => {
        if (err) {
        req.flash('error', err.message)
        return res.redirect('/publicaciones/nueva')
        }
        next()
    })
}

router.get('/publicaciones/nueva', requerirLogin, publicacionController.mostrarFormulario)
router.post('/publicaciones', requerirLogin, handleUpload, procesarImagenes, publicacionController.crear)
router.get('/publicaciones/:id', publicacionController.ver)
router.get('/publicaciones/:id/editar', requerirLogin, publicacionController.mostrarEdicion)
router.post('/publicaciones/:id/editar', requerirLogin, publicacionController.editar)
router.post('/publicaciones/:id/eliminar', requerirLogin, publicacionController.eliminar)

module.exports = router