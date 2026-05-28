const Denuncia    = require('../models/Denuncia')
const Publicacion = require('../models/Publicacion')

const validadorController = {

  // GET /validador
    async panel(req, res) {
        try {
        const publicaciones = await Denuncia.obtenerPublicacionesEnRevision()
        res.render('validador/panel', {
            titulo: 'Panel de Validador',
            publicaciones,
        })
        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error')
        res.redirect('/')
        }
    },

    // GET /validador/publicaciones/:id
    async verDenuncias(req, res) {
        try {
        const publicacion = await Publicacion.buscarPorId(req.params.id)

        if (!publicacion) {
            req.flash('error', 'Publicación no encontrada')
            return res.redirect('/validador')
        }

        const denuncias = await Denuncia.obtenerDenunciasPublicacion(req.params.id)
        const imagenes  = await Publicacion.obtenerImagenes(req.params.id)

        res.render('validador/denuncias', {
            titulo:      'Denuncias - ' + publicacion.titulo,
            publicacion,
            denuncias,
            imagenes,
        })

        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error')
        res.redirect('/validador')
        }
    },

    // POST /validador/publicaciones/:id/dar-de-baja
    async darDeBaja(req, res) {
        try {
        await Publicacion.cambiarEstado(req.params.id, 2)
        req.flash('success', 'Publicación dada de baja correctamente')
        res.redirect('/validador')
        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error')
        res.redirect('/validador')
        }
    },

    // POST /validador/publicaciones/:id/desestimar
    async desestimar(req, res) {
        try {
        await Publicacion.cambiarEstado(req.params.id, 0)
        req.flash('success', 'Denuncias desestimadas correctamente')
        res.redirect('/validador')
        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error')
        res.redirect('/validador')
        }
    },

}

module.exports = validadorController