const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const publicacionRoutes = require('./routes/publicaciones')
const comentarioRoutes = require('./routes/comentarios')
const valoracionRoutes = require('./routes/valoraciones')
const usuarioRoutes = require('./routes/usuarios')
const notificacionRoutes = require('./routes/notificaciones')
const coleccionRoutes = require('./routes/colecciones')
const mensajeRoutes = require('./routes/mensajes')
const Notificacion = require('./models/Notificacion')
const Mensaje = require('./models/Mensaje')
const buscarRoutes = require('./routes/buscar')
const denunciaRoutes = require('./routes/denuncias')
const Publicacion = require('./models/Publicacion')
const validadorRoutes = require('./routes/validador')
const siguiendoRoutes = require('./routes/siguiendo')
const http = require('http')
const { Server } = require('socket.io')



require('dotenv').config()

const app = express()

const server = http.createServer(app)
const io = new Server(server)

// Socket.IO para chat en tiempo real
io.on('connection', (socket) => {

  // El usuario se une a su sala privada
  socket.on('join', (usuario_id) => {
    socket.join('usuario_' + usuario_id)
  })

  // Cuando alguien envía un mensaje
  socket.on('mensaje', async (data) => {
    const { remitente_id, destinatario_id, contenido, imagen_id } = data

    try {
      const nuevoMensaje = await Mensaje.crear({
        remitente_id,
        destinatario_id,
        imagen_id: imagen_id || null,
        contenido,
      })

      await Notificacion.crear({
        usuario_id:        destinatario_id,
        origen_usuario_id: remitente_id,
        tipo:              'mensaje',
        referencia_id:     destinatario_id,
      })

      const mensajeCompleto = {
        id:                  nuevoMensaje,
        remitente_id,
        destinatario_id,
        contenido,
        created_at:          new Date(),
        remitente_username:  data.remitente_username,
      }

      // Enviar el mensaje a ambos usuarios
      io.to('usuario_' + remitente_id).emit('mensaje_nuevo', mensajeCompleto)
      io.to('usuario_' + destinatario_id).emit('mensaje_nuevo', mensajeCompleto)

    } catch (error) {
      console.error('Error al guardar mensaje:', error)
    }
  })

})

// Motor de vistas
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// Archivos estáticos (css, js, imágenes)
app.use(express.static(path.join(__dirname, 'public')))

// Parseo de formularios
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Sesiones
app.use(session({
  secret:            process.env.SESSION_SECRET,
  resave:            false,
  saveUninitialized: false,
  cookie: { secure: false } // cambiar a true con HTTPS
}))

// Flash messages
app.use(flash())

// Variables globales para vistas
app.use(async (req, res, next) => {
  res.locals.usuario    = req.session.usuario || null
  res.locals.success    = req.flash('success')
  res.locals.error      = req.flash('error')

  // contadores del navbar
  if (req.session.usuario){
    try {
      res.locals.notificaciones_no_leidas = await Notificacion.contarNoLeidas(req.session.usuario.id)
      res.locals.mensajes_no_leidos = await Mensaje.contarNoLeidos(req.session.usuario.id)
    } catch (e) {
      res.locals.notificaciones_no_leidas = 0
      res.locals.mensajes_no_leidos = 0
    }
  } else {
    res.locals.notificaciones_no_leidas = 0
    res.locals.mensajes_no_leidos = 0
  }
  next()
})

// Rutas
const authRoutes = require('./routes/auth')
app.use('/', authRoutes)
app.get('/', async (req, res) => {
  try {
    const soloPublicas = !req.session.usuario
    const destacadas = await Publicacion.listarDestacadas({ limite: 4, soloPublicas })
    const recientes  = await Publicacion.listarRecientes({ limite: 8, soloPublicas })

    res.render('index', {
      titulo: 'Inicio',
      destacadas,
      recientes,
    })
  } catch (error) {
    console.error(error)
    res.render('index', {
      titulo:     'Inicio',
      destacadas: [],
      recientes:  [],
    })
  }
})
app.use('/', publicacionRoutes)
app.use('/', comentarioRoutes)
app.use('/', valoracionRoutes)
app.use('/', usuarioRoutes)
app.use('/', notificacionRoutes)
app.use('/', coleccionRoutes)
app.use('/', mensajeRoutes)
app.use('/', buscarRoutes)
app.use('/', denunciaRoutes)
app.use('/', validadorRoutes)
app.use('/', siguiendoRoutes)

// Puerto
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

module.exports = app