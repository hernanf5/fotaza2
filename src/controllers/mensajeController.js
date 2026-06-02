const Mensaje = require('../models/Mensaje')
const Imagen = require('../models/Imagen')
const Usuario = require('../models/Usuario')
const Notificacion = require('../models/Notificacion')
const Publicacion = require('../models/Publicacion')

const mensajeController = {

  // GET /mensajes
    async listarConversaciones(req, res) {
        try {
        const conversaciones = await Mensaje.obtenerConversaciones(req.session.usuario.id)
        res.render('mensajes/index', {
            titulo: 'Mensajes',
            conversaciones,
        })
        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error al cargar los mensajes')
        res.redirect('/')
        }
    },

    // GET /mensajes/:usuario_id
    async verConversacion(req, res) {
        try {
        const otro_usuario = await Usuario.buscarPorId(req.params.usuario_id)

        if (!otro_usuario) {
            req.flash('error', 'Usuario no encontrado')
            return res.redirect('/mensajes')
        }

        const mensajes = await Mensaje.obtenerConversacion(
            req.session.usuario.id,
            otro_usuario.id
        )

        // Marcar mensajes como leídos
        await Mensaje.marcarComoLeidos(otro_usuario.id, req.session.usuario.id)

        res.render('mensajes/conversacion', {
            titulo: 'Conversación con @' + otro_usuario.username,
            otro_usuario,
            mensajes,
        })

        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error')
        res.redirect('/mensajes')
        }
    },

    // POST /mensajes/:usuario_id
    async enviar(req, res) {
        const { contenido, imagen_id } = req.body
        const destinatario_id = req.params.usuario_id

        if (!contenido || !contenido.trim()) {
        req.flash('error', 'El mensaje no puede estar vacío')
        return res.redirect('/mensajes/' + destinatario_id)
        }

        try {
        await Mensaje.crear({
            remitente_id: req.session.usuario.id,
            destinatario_id,
            imagen_id: imagen_id || null,
            contenido: contenido.trim(),
        })
        // Notificar al destinatario
        await Notificacion.crear({
            usuario_id: parseInt(destinatario_id),
            origen_usuario_id: req.session.usuario.id,
            tipo: 'mensaje',
            referencia_id: parseInt(destinatario_id),
        })

        res.redirect('/mensajes/' + destinatario_id)

        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error al enviar el mensaje')
        res.redirect('/mensajes/' + destinatario_id)
        }
    },

    // POST /imagenes/:id/me-interesa
    async meInteresa(req, res) {
        const imagen_id  = req.params.id
        const usuario_id = req.session.usuario.id

        try {
        const imagen = await Imagen.buscarPorId(imagen_id)

        if (!imagen) {
            req.flash('error', 'Imagen no encontrada')
            return res.redirect('/')
        }

        if (imagen.usuario_id === usuario_id) {
            req.flash('error', 'No podés marcar tu propia imagen')
            return res.redirect('/publicaciones/' + imagen.publicacion_id)
        }

        const yaMarcó = await Imagen.yaMarcaMeInteresa(imagen_id, usuario_id)
        if (yaMarcó) {
            req.flash('error', 'Ya marcaste esta imagen como "me interesa"')
            return res.redirect('/publicaciones/' + imagen.publicacion_id)
        }

        await Imagen.marcarMeInteresa({ imagen_id, usuario_id })

        const publicacion = await Publicacion.buscarPorId(imagen.publicacion_id)
        const titulo = publicacion ? publicacion.titulo : 'tu imagen'

        await Mensaje.crear({    
            remitente_id: usuario_id,
            destinatario_id: imagen.usuario_id,
            imagen_id: imagen_id,
            contenido: `Hola, me interesa adquirir tu imagen "${titulo}". ¿Podemos hablar?`,
        })

        // Notificar al autor
        await Notificacion.crear({
            usuario_id: imagen.usuario_id,
            origen_usuario_id: usuario_id,
            tipo: 'me_interesa',
            referencia_id: imagen_id,
        })

        // Redirigir a la conversación con el autor
        res.redirect('/mensajes/' + imagen.usuario_id)

        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error')
        res.redirect('/')
        }
    },

}

module.exports = mensajeController