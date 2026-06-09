const Denuncia = require('../models/Denuncia')
const Publicacion = require('../models/Publicacion')
const Comentario = require('../models/Comentario')

const denunciaController = {

    // GET /publicaciones/:id/denunciar
    async mostrarFormularioPublicacion(req, res) {
        try {
        const publicacion = await Publicacion.buscarPorId(req.params.id)

        if (!publicacion) {
            req.flash('error', 'Publicación no encontrada')
            return res.redirect('/')
        }

        if (publicacion.usuario_id === req.session.usuario.id) {
            req.flash('error', 'No podés denunciar tu propia publicación')
            return res.redirect('/publicaciones/' + req.params.id)
        }

        const yaDeunncio = await Denuncia.usuarioYaDenuncioPublicacion(req.params.id, req.session.usuario.id)
        if (yaDeunncio) {
            req.flash('error', 'Ya denunciaste esta publicación')
            return res.redirect('/publicaciones/' + req.params.id)
        }

        const motivos = await Denuncia.obtenerMotivos()

        res.render('denuncias/publicacion', {
            titulo:      'Denunciar publicación',
            publicacion,
            motivos,
        })

        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error')
        res.redirect('/')
        }
    },

    // POST /publicaciones/:id/denunciar
    async denunciarPublicacion(req, res) {
        const { motivo_id, descripcion } = req.body
        const publicacion_id = req.params.id

        if (!motivo_id || !descripcion || !descripcion.trim()) {
        req.flash('error', 'Completá todos los campos')
        return res.redirect('/publicaciones/' + publicacion_id + '/denunciar')
        }

        try {
        const yaDeunncio = await Denuncia.usuarioYaDenuncioPublicacion(publicacion_id, req.session.usuario.id)
        if (yaDeunncio) {
            req.flash('error', 'Ya denunciaste esta publicación')
            return res.redirect('/publicaciones/' + publicacion_id)
        }

        await Denuncia.denunciarPublicacion({
            publicacion_id,
            usuario_id:  req.session.usuario.id,
            motivo_id,
            descripcion: descripcion.trim(),
        })

        req.flash('success', 'Denuncia enviada correctamente')
        res.redirect('/publicaciones/' + publicacion_id)

        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error al enviar la denuncia')
        res.redirect('/publicaciones/' + publicacion_id)
        }
    },

    // GET /publicaciones/:id/comentarios/:comentarioId/denunciar
    async mostrarFormularioComentario(req, res) {
        try {
        const comentario = await Comentario.buscarPorId(req.params.comentarioId)

        if (!comentario) {
            req.flash('error', 'Comentario no encontrado')
            return res.redirect('/')
        }

        if (comentario.usuario_id === req.session.usuario.id) {
            req.flash('error', 'No podés denunciar tu propio comentario')
            return res.redirect('/publicaciones/' + req.params.id)
        }

        const yaDenuncio = await Denuncia.usuarioYaDenuncioComentario(req.params.comentarioId, req.session.usuario.id)
        if (yaDenuncio) {
            req.flash('error', 'Ya denunciaste este comentario')
            return res.redirect('/publicaciones/' + req.params.id)
        }

        const motivos = await Denuncia.obtenerMotivos()

        res.render('denuncias/comentario', {
            titulo:      'Denunciar comentario',
            comentario,
            motivos,
            publicacion_id: req.params.id,
        })

        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error')
        res.redirect('/')
        }
    },

    // POST /publicaciones/:id/comentarios/:comentarioId/denunciar
    async denunciarComentario(req, res) {
        const { motivo_id, descripcion } = req.body
        const { id: publicacion_id, comentarioId: comentario_id } = req.params

        if (!motivo_id || !descripcion || !descripcion.trim()) {
        req.flash('error', 'Completá todos los campos')
        return res.redirect('/publicaciones/' + publicacion_id + '/comentarios/' + comentario_id + '/denunciar')
        }

        try {
        await Denuncia.denunciarComentario({
            comentario_id,
            usuario_id:  req.session.usuario.id,
            motivo_id,
            descripcion: descripcion.trim(),
        })

        req.flash('success', 'Denuncia enviada correctamente')
        res.redirect('/publicaciones/' + publicacion_id)

        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error al enviar la denuncia')
        res.redirect('/publicaciones/' + publicacion_id)
        }
    },

    // GET /publicaciones/:id/denuncias-comentarios
    async verDenunciasComentarios(req, res) {
        const publicacion_id = req.params.id

        try {
            const publicacion = await Publicacion.buscarPorId(publicacion_id)

            if (!publicacion) {
                req.flash('error', 'Publicación no encontrada')
                return res.redirect('/')
            }

            if (publicacion.usuario_id !== req.session.usuario.id) {
                req.flash('error', 'No tenés permiso para ver esto')
                return res.redirect('/publicaciones/' + publicacion_id)
            }

            const comentarios = await Denuncia.obtenerComentariosDenunciadosDePublicacion(publicacion_id)

            res.render('denuncias/comentarios_denunciados', {
                titulo:      'Denuncias de comentarios',
                publicacion,
                comentarios,
            })

        } catch (error) {
            console.error(error)
            req.flash('error', 'Ocurrió un error')
            res.redirect('/publicaciones/' + publicacion_id)
        }
    },

}

module.exports = denunciaController