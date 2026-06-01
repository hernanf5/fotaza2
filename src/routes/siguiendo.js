const express = require('express')
const router = express.Router()
const Publicacion = require('../models/Publicacion')
const { requerirLogin } = require('../middlewares/auth')

router.get('/siguiendo', requerirLogin, async (req, res) => {
    try {
        const publicaciones = await Publicacion.listarDeSeguidos(req.session.usuario.id)
        res.render('siguiendo/index', {
        titulo: 'Usuarios que sigo',
        publicaciones,
        })
    } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error')
        res.redirect('/')
    }
})

module.exports = router