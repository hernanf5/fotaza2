const Notificacion = require('../models/Notificacion')

const notificacionController = {

  // GET /notificaciones
    async listar(req, res) {
        try {
        const notificaciones = await Notificacion.obtenerDeUsuario(req.session.usuario.id)

        res.render('notificaciones/index', {
            titulo: 'Notificaciones',
            notificaciones,
        })

        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error al cargar las notificaciones')
        res.redirect('/')
        }
    },

    // POST /notificaciones/:id/leer
    async marcarLeida(req, res) {
        try {
        await Notificacion.marcarComoLeida(req.params.id, req.session.usuario.id)
        res.redirect('/notificaciones')
        } catch (error) {
        console.error(error)
        res.redirect('/notificaciones')
        }
    },

    // POST /notificaciones/leer-todas
    async marcarTodasLeidas(req, res) {
        try {
        await Notificacion.marcarTodasComoLeidas(req.session.usuario.id)
        res.redirect('/notificaciones')
        } catch (error) {
        console.error(error)
        res.redirect('/notificaciones')
        }
    },

}

module.exports = notificacionController