const Imagen = require('../models/Imagen')

const valoracionController = {

    async valorar(req, res) {
        const imagen_id  = req.params.id
        const usuario_id = req.session.usuario.id
        const puntuacion = parseInt(req.body.puntuacion)

        try {
        const imagen = await Imagen.buscarPorId(imagen_id)

        if (!imagen) {
            req.flash('error', 'Imagen no encontrada')
            return res.redirect('/')
        }

        const redirigir = '/publicaciones/' + imagen.publicacion_id

        if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
            req.flash('error', 'La puntuación debe ser entre 1 y 5')
            return res.redirect(redirigir)
        }

        if (imagen.usuario_id === usuario_id) {
            req.flash('error', 'No podés valorar tu propia imagen')
            return res.redirect(redirigir)
        }

        const yaValoro = await Imagen.obtenerValoracionDeUsuario(imagen_id, usuario_id)
        if (yaValoro) {
            req.flash('error', 'Ya valoraste esta imagen')
            return res.redirect(redirigir)
        }

        await Imagen.valorar({ imagen_id, usuario_id, puntuacion })
        req.flash('success', 'Valoración registrada')
        res.redirect(redirigir)

        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error al valorar la imagen')
        res.redirect('/')
        }
    },

}

module.exports = valoracionController