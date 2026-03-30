const Publicacion = require('../models/Publicacion')
const Imagen      = require('../models/Imagen')
const path        = require('path')

const publicacionController = {

    // GET /publicaciones/:id
    async ver(req, res) {
        try {
        const publicacion = await Publicacion.buscarPorId(req.params.id)

        if (!publicacion) {
            req.flash('error', 'Publicación no encontrada')
            return res.redirect('/')
        }

        const imagenes  = await Publicacion.obtenerImagenes(publicacion.id)
        const etiquetas = await Publicacion.obtenerEtiquetas(publicacion.id)

        res.render('publicaciones/ver', {
            titulo: publicacion.titulo,
            publicacion,
            imagenes,
            etiquetas,
        })

        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error al cargar la publicación')
        res.redirect('/')
        }
    },

}

module.exports = publicacionController