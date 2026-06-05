const Buscador = require('../models/Buscador')

const buscadorController = {

  // GET /buscar
    async buscar(req, res) {
        const { q, etiqueta, licencia, valoracion_min, orden, pagina } = req.query

        const limite  = 12
        const paginaActual = parseInt(pagina) || 1
        const offset  = (paginaActual - 1) * limite

        const filtros = { q, etiqueta, licencia, valoracion_min, orden, limite, offset, soloPublicas: !req.session.usuario }

        try {
        const [publicaciones, total] = await Promise.all([
            Buscador.buscar(filtros),
            Buscador.contarResultados(filtros),
        ])

        const totalPaginas = Math.ceil(total / limite)

        res.render('buscar/index', {
            titulo:        'Buscar',
            publicaciones,
            total,
            totalPaginas,
            paginaActual,
            filtros: { q, etiqueta, licencia, valoracion_min, orden },
        })

        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error al buscar')
        res.redirect('/')
        }
    },

}

module.exports = buscadorController