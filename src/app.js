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

require('dotenv').config()

const app = express()

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
    const destacadas = await Publicacion.listarDestacadas({ limite: 4 })
    const recientes  = await Publicacion.listarRecientes({ limite: 8 })

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
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

module.exports = app