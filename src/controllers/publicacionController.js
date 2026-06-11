const Publicacion = require('../models/Publicacion')
const Imagen = require('../models/Imagen')
const Comentario = require('../models/Comentario')
const path = require('path')
const fs = require('fs')
const pool = require('../database/connection')

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
        const comentarios = await Comentario.obtenerDePublicacion(publicacion.id)

        imagenes.forEach(img => {
            img.valoracion_promedio = parseFloat(img.valoracion_promedio) || 0
            img.total_valoraciones  = parseInt(img.total_valoraciones)    || 0
        })

        // Verificar si el usuario ya valoró cada imagen
        if (req.session.usuario) {
        for (const img of imagenes) {
            const valoracion = await Imagen.obtenerValoracionDeUsuario(img.id, req.session.usuario.id)
            img.valoracion_usuario = valoracion ? valoracion.puntuacion : null
        }
}

        res.render('publicaciones/ver', {
            titulo: publicacion.titulo,
            publicacion,
            imagenes,
            etiquetas,
            comentarios,
        })

        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error al cargar la publicación')
        res.redirect('/')
        }
    },

    // GET /publicaciones/:id/editar
    async mostrarEdicion(req, res) {
        try {
            const publicacion = await Publicacion.buscarPorId(req.params.id)

            if (!publicacion) {
                req.flash('error', 'Publicación no encontrada')
                return res.redirect('/')
            }

            if (publicacion.usuario_id !== req.session.usuario.id) {
                req.flash('error', 'No tenés permiso para editar esta publicación')
                return res.redirect('/publicaciones/' + req.params.id)
            }

            const tieneDenuncias = await Publicacion.tieneDenuncias(req.params.id)
            if (tieneDenuncias) {
                req.flash('error', 'No podés editar una publicación que tiene denuncias')
                return res.redirect('/publicaciones/' + req.params.id)
            }

            const etiquetas = await Publicacion.obtenerEtiquetas(req.params.id)

            res.render('publicaciones/editar', {
                titulo: 'Editar publicación',
                publicacion,
                etiquetas,
            })

        } catch (error) {
            console.error(error)
            req.flash('error', 'Ocurrió un error')
            res.redirect('/')
        }
    },

// POST /publicaciones/:id/editar
    async editar(req, res) {
    const { titulo, descripcion, etiquetas } = req.body
    const id = req.params.id

    if (!titulo) {
        req.flash('error', 'El título es obligatorio')
        return res.redirect('/publicaciones/' + id + '/editar')
    }

    try {
        const publicacion = await Publicacion.buscarPorId(id)

        if (!publicacion || publicacion.usuario_id !== req.session.usuario.id) {
            req.flash('error', 'No tenés permiso para editar esta publicación')
            return res.redirect('/')
        }

        const tieneDenuncias = await Publicacion.tieneDenuncias(id)
        if (tieneDenuncias) {
            req.flash('error', 'No podés editar una publicación que tiene denuncias')
            return res.redirect('/publicaciones/' + id)
        }

        await Publicacion.actualizar({ id, titulo, descripcion })

        // Actualizar etiquetas
        if (etiquetas) {
            await pool.query(`DELETE FROM publicacion_etiqueta WHERE publicacion_id = ?`, [id])
            const lista = etiquetas.split(',').filter(e => e.trim())
            await Publicacion.agregarEtiquetas(id, lista)
        }

        req.flash('success', 'Publicación actualizada correctamente')
        res.redirect('/publicaciones/' + id)

    } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error al editar la publicación')
        res.redirect('/publicaciones/' + id)
    }
    },

    // POST /publicaciones/:id/eliminar
    async eliminar(req, res) {
    try {
        const publicacion = await Publicacion.buscarPorId(req.params.id)

        if (!publicacion || publicacion.usuario_id !== req.session.usuario.id) {
            req.flash('error', 'No tenés permiso para eliminar esta publicación')
            return res.redirect('/')
        }

        await Publicacion.eliminar(req.params.id)
        req.flash('success', 'Publicación eliminada correctamente')
        res.redirect('/')

        } catch (error) {
            console.error(error)
            req.flash('error', 'Ocurrió un error al eliminar la publicación')
            res.redirect('/')
        }
    },
}

module.exports = publicacionController