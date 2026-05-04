const Follower = require('../models/Follower')

const followerController = {

  // POST /usuarios/:id/seguir
    async seguir(req, res) {
        const seguido_id  = parseInt(req.params.id)
        const seguidor_id = req.session.usuario.id

        if (seguidor_id === seguido_id) {
        req.flash('error', 'No podés seguirte a vos mismo')
        return res.redirect('/usuarios/' + seguido_id)
        }

        try {
        await Follower.seguir({ seguidor_id, seguido_id })
        res.redirect('/usuarios/' + seguido_id)
        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error')
        res.redirect('/usuarios/' + seguido_id)
        }
    },

    // POST /usuarios/:id/dejar-de-seguir
    async dejarDeSeguir(req, res) {
        const seguido_id  = parseInt(req.params.id)
        const seguidor_id = req.session.usuario.id

        try {
        await Follower.dejarDeSeguir({ seguidor_id, seguido_id })
        res.redirect('/usuarios/' + seguido_id)
        } catch (error) {
        console.error(error)
        req.flash('error', 'Ocurrió un error')
        res.redirect('/usuarios/' + seguido_id)
        }
    },

}

module.exports = followerController