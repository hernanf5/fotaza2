const pool = require('../database/connection')

class Comentario {

    static async crear({ publicacion_id, usuario_id, contenido }) {
        const [result] = await pool.query(
        `INSERT INTO comentario (publicacion_id, usuario_id, contenido)
        VALUES (?, ?, ?)`,
        [publicacion_id, usuario_id, contenido]
        )
        return result.insertId
    }

    static async obtenerDePublicacion(publicacion_id) {
        const [rows] = await pool.query(
        `SELECT c.id, c.contenido, c.created_at, c.activo,
                u.username, u.id as usuario_id,
                pe.avatar_url
        FROM comentario c
        JOIN usuario u ON u.id = c.usuario_id
        JOIN persona pe ON pe.id = u.persona_id
        WHERE c.publicacion_id = ? AND c.activo = 1
        ORDER BY c.created_at ASC`,
        [publicacion_id]
        )
        return rows
    }

    static async buscarPorId(id) {
        const [rows] = await pool.query(
        `SELECT c.*, p.usuario_id as autor_publicacion_id
        FROM comentario c
        JOIN publicacion p ON p.id = c.publicacion_id
        WHERE c.id = ?`,
        [id]
        )
        return rows[0] || null
    }

    static async eliminar(id) {
        await pool.query(
        `UPDATE comentario SET activo = 0 WHERE id = ?`,
        [id]
        )
    }

}

module.exports = Comentario