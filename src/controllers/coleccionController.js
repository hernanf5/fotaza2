const Coleccion = require('../models/Coleccion')

const coleccionController = {

  // GET /colecciones
    async listar(req, res) {
        try {
        const colecciones = await Coleccion.obtenerDeUsuario(req.session.usuario.id)
        res.render('colecciones/index', {
            titulo: 'Mis colecciones',
            colecciones,
        })
        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error al cargar las colecciones')
        res.redirect('/')
        }
    },

    // GET /colecciones/:id
    async ver(req, res) {
        try {
        const coleccion = await Coleccion.buscarPorId(req.params.id)

        if (!coleccion) {
            req.flash('error', 'Colección no encontrada')
            return res.redirect('/colecciones')
        }

        if (coleccion.usuario_id !== req.session.usuario.id) {
            req.flash('error', 'No tenés permiso para ver esta colección')
            return res.redirect('/colecciones')
        }

        const publicaciones = await Coleccion.obtenerPublicaciones(coleccion.id)

        res.render('colecciones/ver', {
            titulo:       coleccion.nombre,
            coleccion,
            publicaciones,
        })

        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error')
        res.redirect('/colecciones')
        }
    },

    // POST /colecciones
    async crear(req, res) {
        const { nombre } = req.body

        if (!nombre || !nombre.trim()) {
        req.flash('error', 'El nombre de la colección es obligatorio')
        return res.redirect('/colecciones')
        }

        try {
        await Coleccion.crear({
            usuario_id: req.session.usuario.id,
            nombre:     nombre.trim(),
        })
        req.flash('success', 'Colección creada correctamente')
        res.redirect('/colecciones')
        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error al crear la colección')
        res.redirect('/colecciones')
        }
    },

    // POST /colecciones/:id/agregar
    async agregarPublicacion(req, res) {
        const { publicacion_id } = req.body
        const coleccion_id       = req.params.id

        try {
        const coleccion = await Coleccion.buscarPorId(coleccion_id)

        if (!coleccion || coleccion.usuario_id !== req.session.usuario.id) {
            req.flash('error', 'No tenés permiso para modificar esta colección')
            return res.redirect('/publicaciones/' + publicacion_id)
        }

        await Coleccion.agregarPublicacion({ coleccion_id, publicacion_id })
        req.flash('success', 'Publicación guardada en la colección')
        res.redirect('/publicaciones/' + publicacion_id)

        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error')
        res.redirect('/publicaciones/' + publicacion_id)
        }
    },

    // POST /colecciones/:id/quitar
    async quitarPublicacion(req, res) {
        const { publicacion_id } = req.body
        const coleccion_id       = req.params.id

        try {
        await Coleccion.quitarPublicacion({ coleccion_id, publicacion_id })
        req.flash('success', 'Publicación quitada de la colección')
        res.redirect('/colecciones/' + coleccion_id)

        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error')
        res.redirect('/colecciones/' + coleccion_id)
        }
    },

}

module.exports = coleccionController