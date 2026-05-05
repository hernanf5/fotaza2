const Comentario = require('../models/Comentario')
const Publicacion = require('../models/Publicacion')
const Notificacion = require('../models/Notificacion')

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

        await Notificacion.crear({
            usuario_id:        publicacion.usuario_id,
            origen_usuario_id: req.session.usuario.id,
            tipo:              'comentario',
            referencia_id:     publicacion_id,
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

    // POST /publicaciones/:id/comentarios/:comentarioId/eliminar
    async eliminar(req, res) {
    const publicacion_id = req.params.id
    const comentario_id  = req.params.comentarioId

    try {
        const comentario = await Comentario.buscarPorId(comentario_id)

        if (!comentario) {
        req.flash('error', 'Comentario no encontrado')
        return res.redirect('/publicaciones/' + publicacion_id)
        }

        // Solo el autor de la publicación puede borrar comentarios
        if (comentario.autor_publicacion_id !== req.session.usuario.id) {
        req.flash('error', 'No tenés permiso para hacer esto')
        return res.redirect('/publicaciones/' + publicacion_id)
        }

        await Comentario.eliminar(comentario_id)
        res.redirect('/publicaciones/' + publicacion_id)

    } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error al eliminar el comentario')
        res.redirect('/publicaciones/' + publicacion_id)
    }
    },

}

module.exports = comentarioController