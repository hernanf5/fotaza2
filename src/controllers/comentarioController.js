const Comentario = require('../models/Comentario')
const Publicacion = require('../models/Publicacion')

const comentarioController = {

  // POST /publicaciones/:id/comentarios
    async crear(req, res) {
        const { contenido } = req.body
        const publicacion_id = req.params.id

        if (!contenido || !contenido.trim()) {
        req.flash('error', 'El comentario no puede estar vacío')
        return res.redirect('/publicaciones/' + publicacion_id)
        }

        try {
        const publicacion = await Publicacion.buscarPorId(publicacion_id)

        if (!publicacion) {
            req.flash('error', 'Publicación no encontrada')
            return res.redirect('/')
        }

        if (!publicacion.comentarios_abiertos) {
            req.flash('error', 'Los comentarios están cerrados')
            return res.redirect('/publicaciones/' + publicacion_id)
        }

        await Comentario.crear({
            publicacion_id,
            usuario_id: req.session.usuario.id,
            contenido:  contenido.trim(),
        })

        res.redirect('/publicaciones/' + publicacion_id)

        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error al publicar el comentario')
        res.redirect('/publicaciones/' + publicacion_id)
        }
    },

    // POST /publicaciones/:id/comentarios/toggle
    async toggleComentarios(req, res) {
        const publicacion_id = req.params.id

        try {
        const publicacion = await Publicacion.buscarPorId(publicacion_id)

        if (!publicacion) {
            req.flash('error', 'Publicación no encontrada')
            return res.redirect('/')
        }

        if (publicacion.usuario_id !== req.session.usuario.id) {
            req.flash('error', 'No tenés permiso para hacer esto')
            return res.redirect('/publicaciones/' + publicacion_id)
        }

        await Publicacion.toggleComentarios(publicacion_id)
        res.redirect('/publicaciones/' + publicacion_id)

        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error')
        res.redirect('/publicaciones/' + publicacion_id)
        }
    },

}

module.exports = comentarioController