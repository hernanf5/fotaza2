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
  cookie: { secure: false } // en producción cambiar a true con HTTPS
}))

// Flash messages
app.use(flash())

// Variables globales disponibles en todas las vistas
app.use((req, res, next) => {
  res.locals.usuario    = req.session.usuario || null
  res.locals.success    = req.flash('success')
  res.locals.error      = req.flash('error')
  next()
})

// Rutas
const authRoutes = require('./routes/auth')
app.use('/', authRoutes)
app.get('/', (req, res) => {
  res.render('index', { titulo: 'Inicio' })
})
app.use('/', publicacionRoutes)
app.use('/', comentarioRoutes)
app.use('/', valoracionRoutes)
app.use('/', usuarioRoutes)
app.use('/', notificacionRoutes)
app.use('/', coleccionRoutes)
app.use('/', mensajeRoutes)

// Puerto
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

module.exports = app