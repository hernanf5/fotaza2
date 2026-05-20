const pool = require('../database/connection')

class Notificacion {

    static async crear({ usuario_id, origen_usuario_id, tipo, referencia_id }) {
        // No crear notificación si el usuario se notifica a sí mismo
        if (usuario_id === origen_usuario_id) return

        await pool.query(
        `INSERT INTO notificacion (usuario_id, origen_usuario_id, tipo, referencia_id)
        VALUES (?, ?, ?, ?)`,
        [usuario_id, origen_usuario_id, tipo, referencia_id || null]
        )
    }

    static async obtenerDeUsuario(usuario_id) {
        const [rows] = await pool.query(
        `SELECT n.*, u.username as origen_username
        FROM notificacion n
        JOIN usuario u ON u.id = n.origen_usuario_id
        WHERE n.usuario_id = ?
        ORDER BY n.created_at DESC
        LIMIT 50`,
        [usuario_id]
        )
        return rows
    }

    static async contarNoLeidas(usuario_id) {
        const [rows] = await pool.query(
        `SELECT COUNT(*) as total FROM notificacion
        WHERE usuario_id = ? AND leida = 0`,
        [usuario_id]
        ) 
        return parseInt(rows[0].total)
    }

    static async marcarComoLeida(id, usuario_id) {
        await pool.query(
        `UPDATE notificacion SET leida = 1
        WHERE id = ? AND usuario_id = ?`,
        [id, usuario_id]
        )
    }

    static async marcarTodasComoLeidas(usuario_id) {
        await pool.query(
        `UPDATE notificacion SET leida = 1 WHERE usuario_id = ?`,
        [usuario_id]
        )
    }

}

module.exports = Notificacion