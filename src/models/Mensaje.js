const pool = require('../database/connection')

class Mensaje {

    static async crear({ remitente_id, destinatario_id, imagen_id, contenido }) {
        const [result] = await pool.query(
        `INSERT INTO mensaje (remitente_id, destinatario_id, imagen_id, contenido)
        VALUES (?, ?, ?, ?)`,
        [remitente_id, destinatario_id, imagen_id || null, contenido]
        )
        return result.insertId
    }

    static async obtenerConversacion(usuario1_id, usuario2_id) {
        const [rows] = await pool.query(
        `SELECT m.*, 
                u.username as remitente_username,
                pe.avatar_url as remitente_avatar
        FROM mensaje m
        JOIN usuario u ON u.id = m.remitente_id
        JOIN persona pe ON pe.id = u.persona_id
        WHERE (m.remitente_id = ? AND m.destinatario_id = ?)
            OR (m.remitente_id = ? AND m.destinatario_id = ?)
        ORDER BY m.created_at ASC`,
        [usuario1_id, usuario2_id, usuario2_id, usuario1_id]
        )
        return rows
    }

    static async obtenerConversaciones(usuario_id) {
        const [rows] = await pool.query(
        `SELECT DISTINCT
                IF(m.remitente_id = ?, m.destinatario_id, m.remitente_id) as otro_usuario_id,
                u.username as otro_username,
                pe.avatar_url as otro_avatar,
                (SELECT contenido FROM mensaje m2
                WHERE (m2.remitente_id = ? AND m2.destinatario_id = otro_usuario_id)
                    OR (m2.remitente_id = otro_usuario_id AND m2.destinatario_id = ?)
                ORDER BY m2.created_at DESC LIMIT 1) as ultimo_mensaje,
                (SELECT created_at FROM mensaje m2
                WHERE (m2.remitente_id = ? AND m2.destinatario_id = otro_usuario_id)
                    OR (m2.remitente_id = otro_usuario_id AND m2.destinatario_id = ?)
                ORDER BY m2.created_at DESC LIMIT 1) as ultimo_mensaje_fecha,
                (SELECT COUNT(*) FROM mensaje m2
                WHERE m2.remitente_id = otro_usuario_id
                    AND m2.destinatario_id = ?
                    AND m2.leido = 0) as no_leidos
        FROM mensaje m
        JOIN usuario u ON u.id = IF(m.remitente_id = ?, m.destinatario_id, m.remitente_id)
        JOIN persona pe ON pe.id = u.persona_id
        WHERE m.remitente_id = ? OR m.destinatario_id = ?
        ORDER BY ultimo_mensaje_fecha DESC`,
        [usuario_id, usuario_id, usuario_id, usuario_id, usuario_id, usuario_id, usuario_id, usuario_id, usuario_id]
        )
        return rows
    }

    static async marcarComoLeidos(remitente_id, destinatario_id) {
        await pool.query(
        `UPDATE mensaje SET leido = 1
        WHERE remitente_id = ? AND destinatario_id = ? AND leido = 0`,
        [remitente_id, destinatario_id]
        )
    }

    static async contarNoLeidos(usuario_id) {
        const [rows] = await pool.query(
        `SELECT COUNT(*) as total FROM mensaje
        WHERE destinatario_id = ? AND leido = 0`,
        [usuario_id]
        )
        return rows[0].total
    }

}

module.exports = Mensaje