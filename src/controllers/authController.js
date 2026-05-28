const Usuario = require('../models/Usuario')

const authController = {

    // GET /register
    mostrarRegistro(req, res) {
        res.render('auth/register', { titulo: 'Registrarse' })
    },

    // POST /register
    async registrar(req, res) {
        const { nombre, apellido, email, password, confirmar_password, username, telefono, fecha_nacimiento } = req.body

        // Validaciones
        if (!nombre || !apellido || !email || !password || !username) {
            req.flash('error', 'Todos los campos obligatorios deben completarse')
            return res.redirect('/register')
        }

        if (password !== confirmar_password) {
            req.flash('error', 'Las contraseñas no coinciden')
            return res.redirect('/register')
        }

        if (password.length < 6) {
            req.flash('error', 'La contraseña debe tener al menos 6 caracteres')
            return res.redirect('/register')
        }

        try {
            const emailEnUso = await Usuario.emailExiste(email)
            if (emailEnUso) {
                req.flash('error', 'El email ya está registrado')
                return res.redirect('/register')
            }

            const usernameEnUso = await Usuario.usernameExiste(username)
            if (usernameEnUso) {
                req.flash('error', 'El nombre de usuario ya está en uso')
                return res.redirect('/register')
            }

            await Usuario.crear({ nombre, apellido, email, password, username, telefono, fecha_nacimiento })

            req.flash('success', 'Cuenta creada correctamente. Ya podés iniciar sesión')
            res.redirect('/login')

        } catch (error) {
            console.error(error)
            req.flash('error', 'Ocurrió un error al registrar el usuario')
            res.redirect('/register')
        }
    },

    // GET /login
    mostrarLogin(req, res) {
        res.render('auth/login', { titulo: 'Iniciar sesión' })
    },

    // POST /login
    async login(req, res) {
        const { email, password } = req.body

        if (!email || !password) {
            req.flash('error', 'Completá todos los campos')
            return res.redirect('/login')
        }

        try {
            let usuario = await Usuario.buscarPorEmail(email)
            let esValidador = false

            if(!usuario) {
                usuario =  await Usuario.buscarValidadorPorEmail(email)
                esValidador = true
            }


            if (!usuario) {
                req.flash('error', 'Email o contraseña incorrectos')
                return res.redirect('/login')
            }

            if (!esValidador && usuario.estado === 'inactivo') {
                req.flash('error', 'Tu cuenta está inactiva')
                return res.redirect('/login')
            }

            const passwordOk = await Usuario.verificarPassword(password, usuario.password_hash)

            if (!passwordOk) {
                req.flash('error', 'Email o contraseña incorrectos')
                return res.redirect('/login')
            }

            // Guardo sesion de usuario o validador

            if (esValidador) {
                req.session.usuario = {
                    id:          usuario.id,
                    nombre:      usuario.nombre,
                    apellido:    usuario.apellido,
                    email:       usuario.email,
                    rol:         'validador',
                }
                return res.redirect('/validador')
            }

            req.session.usuario = {
                id:        usuario.id,
                username:  usuario.username,
                nombre:    usuario.nombre,
                apellido:  usuario.apellido,
                email:     usuario.email,
                avatar_url: usuario.avatar_url,
                rol:       'usuario',
            }

            res.redirect('/')

        } catch (error) {
            console.error(error)
            req.flash('error', 'Ocurrió un error al iniciar sesión')
            res.redirect('/login')
        }
    },

    // POST /logout
    logout(req, res) {
        req.session.destroy(() => {
        res.redirect('/login')
        })
    },

}

module.exports = authController