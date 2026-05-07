const pool = require('../database/connection')

class Coleccion {

    static async crear({ usuario_id, nombre }) {
        const [result] = await pool.query(
        `INSERT INTO coleccion (usuario_id, nombre) VALUES (?, ?)`,
        [usuario_id, nombre]
        )
        return result.insertId
    }

    static async obtenerDeUsuario(usuario_id) {
        const [rows] = await pool.query(
            `SELECT c.*,
                    COUNT(cp.publicacion_id) as total_publicaciones
            FROM coleccion c
            LEFT JOIN coleccion_publicacion cp ON cp.coleccion_id = c.id
            WHERE c.usuario_id = ?
            GROUP BY c.id
            ORDER BY c.created_at DESC`,
            [usuario_id]
        )

        // Obtener imagen portada de cada colección por separado
        for (const col of rows) {
            const [imgs] = await pool.query(
            `SELECT i.url FROM imagen i
            JOIN coleccion_publicacion cp ON cp.publicacion_id = i.publicacion_id
            WHERE cp.coleccion_id = ?
            LIMIT 1`,
            [col.id]
            )
            col.imagen_portada = imgs[0] ? imgs[0].url : null
        }

        return rows
    }

    static async buscarPorId(id) {
        const [rows] = await pool.query(
        `SELECT * FROM coleccion WHERE id = ?`,
        [id]
        )
        return rows[0] || null
    }

    static async obtenerPublicaciones(coleccion_id) {
        const [rows] = await pool.query(
        `SELECT p.*, u.username,
                (SELECT url FROM imagen WHERE publicacion_id = p.id LIMIT 1) as imagen_portada
        FROM coleccion_publicacion cp
        JOIN publicacion p ON p.id = cp.publicacion_id
        JOIN usuario u ON u.id = p.usuario_id
        WHERE cp.coleccion_id = ?
        ORDER BY cp.created_at DESC`,
        [coleccion_id]
        )
        return rows
    }

    static async agregarPublicacion({ coleccion_id, publicacion_id }) {
        await pool.query(
        `INSERT IGNORE INTO coleccion_publicacion (coleccion_id, publicacion_id)
        VALUES (?, ?)`,
        [coleccion_id, publicacion_id]
        )
    }

    static async quitarPublicacion({ coleccion_id, publicacion_id }) {
        await pool.query(
        `DELETE FROM coleccion_publicacion
        WHERE coleccion_id = ? AND publicacion_id = ?`,
        [coleccion_id, publicacion_id]
        )
    }

    static async perteneceAUsuario(id, usuario_id) {
        const [rows] = await pool.query(
        `SELECT id FROM coleccion WHERE id = ? AND usuario_id = ?`,
        [id, usuario_id]
        )
        return rows.length > 0
    }

    static async publicacionEstaEnColeccion(coleccion_id, publicacion_id) {
        const [rows] = await pool.query(
        `SELECT 1 FROM coleccion_publicacion
        WHERE coleccion_id = ? AND publicacion_id = ?`,
        [coleccion_id, publicacion_id]
        )
        return rows.length > 0
    }

}

module.exports = Coleccion