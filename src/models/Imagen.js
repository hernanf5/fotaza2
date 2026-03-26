const pool = require('../database/connection')

class Imagen {

    static async crear({ publicacion_id, url, licencia, marca_agua_texto }) {
        const [result] = await pool.query(
        `INSERT INTO imagen (publicacion_id, url, licencia, marca_agua_texto)
        VALUES (?, ?, ?, ?)`,
        [publicacion_id, url, licencia || 'libre', marca_agua_texto || null]
        )
        return result.insertId
    }

    static async buscarPorId(id) {
        const [rows] = await pool.query(
        `SELECT i.*, p.usuario_id
        FROM imagen i
        JOIN publicacion p ON p.id = i.publicacion_id
        WHERE i.id = ?`,
        [id]
        )
        return rows[0] || null
    }

    static async obtenerValoracionDeUsuario(imagen_id, usuario_id) {
        const [rows] = await pool.query(
        `SELECT puntuacion FROM valoracion
        WHERE imagen_id = ? AND usuario_id = ?`,
        [imagen_id, usuario_id]
        )
        return rows[0] || null
    }

    static async valorar({ imagen_id, usuario_id, puntuacion }) {
        await pool.query(
        `INSERT INTO valoracion (imagen_id, usuario_id, puntuacion)
        VALUES (?, ?, ?)`,
        [imagen_id, usuario_id, puntuacion]
        )
    }

    static async marcarMeInteresa({ imagen_id, usuario_id }) {
        await pool.query(
        `INSERT IGNORE INTO me_interesa (imagen_id, usuario_id)
        VALUES (?, ?)`,
        [imagen_id, usuario_id]
        )
    }

    static async yaMarcaMeInteresa(imagen_id, usuario_id) {
        const [rows] = await pool.query(
        `SELECT id FROM me_interesa
        WHERE imagen_id = ? AND usuario_id = ?`,
        [imagen_id, usuario_id]
        )
        return rows.length > 0
    }

}

module.exports = Imagen