const pool = require('../database/connection')

class Follower {

    static async seguir({ seguidor_id, seguido_id }) {
        await pool.query(
        `INSERT IGNORE INTO follower (seguidor_id, seguido_id)
        VALUES (?, ?)`,
        [seguidor_id, seguido_id]
        )
    }

    static async dejarDeSeguir({ seguidor_id, seguido_id }) {
        await pool.query(
        `DELETE FROM follower WHERE seguidor_id = ? AND seguido_id = ?`,
        [seguidor_id, seguido_id]
        )
    }

    static async estaSiguiendo(seguidor_id, seguido_id) {
        const [rows] = await pool.query(
        `SELECT 1 FROM follower WHERE seguidor_id = ? AND seguido_id = ?`,
        [seguidor_id, seguido_id]
        )
        return rows.length > 0
    }

    static async obtenerSeguidores(usuario_id) {
        const [rows] = await pool.query(
        `SELECT u.id, u.username, pe.nombre, pe.apellido, pe.avatar_url
        FROM follower f
        JOIN usuario u ON u.id = f.seguidor_id
        JOIN persona pe ON pe.id = u.persona_id
        WHERE f.seguido_id = ?`,
        [usuario_id]
        )
        return rows
    }

    static async obtenerSeguidos(usuario_id) {
        const [rows] = await pool.query(
        `SELECT u.id, u.username, pe.nombre, pe.apellido, pe.avatar_url
        FROM follower f
        JOIN usuario u ON u.id = f.seguido_id
        JOIN persona pe ON pe.id = u.persona_id
        WHERE f.seguidor_id = ?`,
        [usuario_id]
        )
        return rows
    }

    static async contarSeguidores(usuario_id) {
        const [rows] = await pool.query(
        `SELECT COUNT(*) as total FROM follower WHERE seguido_id = ?`,
        [usuario_id]
        )
        return rows[0].total
    }

    static async contarSeguidos(usuario_id) {
        const [rows] = await pool.query(
        `SELECT COUNT(*) as total FROM follower WHERE seguidor_id = ?`,
        [usuario_id]
        )
        return rows[0].total
    }

}

module.exports = Follower