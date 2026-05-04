const Usuario = require('../models/Usuario')
const Follower = require('../models/Follower')
const Publicacion = require('../models/Publicacion')

const usuarioController = {

    async verPerfil(req, res) {
        try {
        const usuario = await Usuario.buscarPorId(req.params.id)

        if (!usuario) {
            req.flash('error', 'Usuario no encontrado')
            return res.redirect('/')
        }

        const seguidores     = await Follower.contarSeguidores(usuario.id)
        const seguidos       = await Follower.contarSeguidos(usuario.id)
        const publicaciones  = await Publicacion.listarDeUsuario(usuario.id)

        let estaSiguiendo = false
        if (req.session.usuario) {
            estaSiguiendo = await Follower.estaSiguiendo(req.session.usuario.id, usuario.id)
        }

        res.render('usuarios/perfil', {
            titulo:       usuario.username,
            perfil:       usuario,
            seguidores,
            seguidos,
            publicaciones,
            estaSiguiendo,
        })

        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error')
        res.redirect('/')
        }
    },

}

module.exports = usuarioController