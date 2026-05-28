const authMiddleware = {

  // Verifica que el usuario esté logueado
  requerirLogin(req, res, next) {
    if (!req.session.usuario) {
      req.flash('error', 'Necesitás iniciar sesión para acceder a esta página')
      return res.redirect('/login')
    }
    next()
  },

  // Verifica que el usuario NO esté logueado (para login/register)
  redirigirSiLogueado(req, res, next) {
    if (req.session.usuario) {
      return res.redirect('/')
    }
    next()
  },

  // Verifica que el usuario sea un validador
  requerirValidador(req, res, next) {
  if (!req.session.usuario || req.session.usuario.rol !== 'validador') {
    req.flash('error', 'Acceso restringido')
    return res.redirect('/login')
  }
  next()
},

}

module.exports = authMiddleware