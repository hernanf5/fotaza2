const Publicacion = require('../models/Publicacion')
const Imagen = require('../models/Imagen')
const path = require('path')
const fs = require('fs')

const publicacionController = {

      // GET /publicaciones/nueva
    mostrarFormulario(req, res) {
        res.render('publicaciones/nueva', { titulo: 'Nueva publicación' })
    },


    async crear(req, res) {
        const { titulo, descripcion, licencia, marca_agua_texto, etiquetas } = req.body
        const archivos = req.files

        if (!titulo) {
        req.flash('error', 'El título es obligatorio')
        return res.redirect('/publicaciones/nueva')
        }

        if (!archivos || archivos.length === 0) {
        req.flash('error', 'Debes subir al menos una imagen')
        return res.redirect('/publicaciones/nueva')
        }

        try {
        const publicacion_id = await Publicacion.crear({
            usuario_id:  req.session.usuario.id,
            titulo,
            descripcion,
        })

        // Guardamos cada imagen
        for (const archivo of archivos) {
            const url = '/uploads/' + archivo.filename
            await Imagen.crear({
            publicacion_id,
            url,
            licencia:          licencia || 'libre',
            marca_agua_texto:  licencia === 'copyright' ? marca_agua_texto : null,
            })
        }

        // Procesamos etiquetas
        if (etiquetas) {
            const lista = etiquetas.split(',').filter(e => e.trim())
            await Publicacion.agregarEtiquetas(publicacion_id, lista)
        }

        req.flash('success', 'Publicación creada correctamente')
        res.redirect('/publicaciones/' + publicacion_id)

        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error al crear la publicación')
        res.redirect('/publicaciones/nueva')
        }
    },


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

        imagenes.forEach(img => {
            img.valoracion_promedio = parseFloat(img.valoracion_promedio) || 0
            img.total_valoraciones  = parseInt(img.total_valoraciones)    || 0
        })

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