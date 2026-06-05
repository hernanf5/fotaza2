const pool = require('../database/connection')

class Publicacion {

    static async cambiarEstado(id, estado) {
        await pool.query(
            `UPDATE publicacion SET estado = ? WHERE id = ?`,
            [estado, id]
        )
    }

    static async crear({ usuario_id, titulo, descripcion }) {
        const [result] = await pool.query(
            `INSERT INTO publicacion (usuario_id, titulo, descripcion)
            VALUES (?, ?, ?)`,
            [usuario_id, titulo, descripcion || null]
        )
        return result.insertId
    }

    static async agregarEtiquetas(publicacion_id, etiquetas) {
        for (const nombre of etiquetas) {
            const nombreLimpio = nombre.trim().toLowerCase()
        if (!nombreLimpio) continue

        // Insertar etiqueta si no existe
        const [result] = await pool.query(
            `INSERT INTO etiqueta (nombre)
            VALUES (?)
            ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
            [nombreLimpio]
        )

        await pool.query(
            `INSERT IGNORE INTO publicacion_etiqueta (publicacion_id, etiqueta_id)
            VALUES (?, ?)`,
            [publicacion_id, result.insertId]
        )
        }
    }

    static async buscarPorId(id) {
        const [rows] = await pool.query(
        `SELECT p.*, u.username, u.id as usuario_id,
                pe.nombre as avatar_url
        FROM publicacion p
        JOIN usuario u ON u.id = p.usuario_id
        JOIN persona pe ON pe.id = u.persona_id
        WHERE p.id = ? AND p.estado != 2`,
        [id]
        )
        return rows[0] || null
    }

    static async obtenerImagenes(publicacion_id) {
        const [rows] = await pool.query(
        `SELECT * FROM imagen WHERE publicacion_id = ?`,
        [publicacion_id]
        )
        return rows
    }

    static async obtenerEtiquetas(publicacion_id) {
        const [rows] = await pool.query(
        `SELECT e.* FROM etiqueta e
        JOIN publicacion_etiqueta pe ON pe.etiqueta_id = e.id
        WHERE pe.publicacion_id = ?`,
        [publicacion_id]
        )
        return rows
    }

    static async listarRecientes({ limite = 20, offset = 0, soloPublicas = false } = {}) {
        const filtroLicencia = soloPublicas
            ? `AND NOT EXISTS (SELECT 1 FROM imagen WHERE publicacion_id = p.id AND licencia = 'copyright')`
            : ''

        const [rows] = await pool.query(
            `SELECT p.*, u.username,
                    pe.avatar_url,
                    (SELECT url FROM imagen WHERE publicacion_id = p.id LIMIT 1) as imagen_portada,
                    (SELECT COUNT(*) FROM comentario WHERE publicacion_id = p.id AND activo = 1) as total_comentarios
            FROM publicacion p
            JOIN usuario u ON u.id = p.usuario_id
            JOIN persona pe ON pe.id = u.persona_id
            WHERE p.estado = 0 ${filtroLicencia}
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?`,
            [limite, offset]
        )
        return rows
    }

    static async listarDestacadas({ limite = 6, soloPublicas = false } = {}) {
        const filtroLicencia = soloPublicas ? `AND NOT EXISTS (SELECT 1 FROM imagen WHERE publicacion_id = p.id AND licencia = 'copyright')` : ''
        const [rows] = await pool.query(
        `SELECT p.*, u.username,
                pe.avatar_url,
                i.url as imagen_portada,
                i.valoracion_promedio,
                i.total_valoraciones
        FROM publicacion p
        JOIN usuario u ON u.id = p.usuario_id
        JOIN persona pe ON pe.id = u.persona_id
        JOIN imagen i ON i.publicacion_id = p.id
        WHERE p.estado = 0
            AND i.total_valoraciones >= 3
            AND i.valoracion_promedio >= 3.5
            ${filtroLicencia}
        ORDER BY i.valoracion_promedio DESC, i.total_valoraciones DESC
        LIMIT ?`,
        [limite]
        )
        return rows
    }

    static async listarDeUsuario(usuario_id) {
        const [rows] = await pool.query(
        `SELECT p.*,
                (SELECT url FROM imagen WHERE publicacion_id = p.id LIMIT 1) as imagen_portada,
                (SELECT COUNT(*) FROM imagen WHERE publicacion_id = p.id) as total_imagenes
        FROM publicacion p
        WHERE p.usuario_id = ? AND p.estado != 2
        ORDER BY p.created_at DESC`,
        [usuario_id]
        )
        return rows
    }

    static async perteneceAUsuario(id, usuario_id) {
        const [rows] = await pool.query(
        `SELECT id FROM publicacion WHERE id = ? AND usuario_id = ?`,
        [id, usuario_id]
        )
        return rows.length > 0
    }

    static async toggleComentarios(id) {
        await pool.query(
        `UPDATE publicacion
        SET comentarios_abiertos = NOT comentarios_abiertos
        WHERE id = ?`,
        [id]
        )
    }

    static async listarDeSeguidos(usuario_id, { limite = 20, offset = 0 } = {}) {
        const [rows] = await pool.query(
            `SELECT p.*, u.username, u.id as usuario_id,
                    pe.avatar_url,
                    (SELECT url FROM imagen WHERE publicacion_id = p.id LIMIT 1) as imagen_portada,
                    (SELECT COUNT(*) FROM comentario WHERE publicacion_id = p.id AND activo = 1) as total_comentarios
            FROM publicacion p
            JOIN usuario u ON u.id = p.usuario_id
            JOIN persona pe ON pe.id = u.persona_id
            JOIN follower f ON f.seguido_id = p.usuario_id
            WHERE f.seguidor_id = ? AND p.estado = 0
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?`,
            [usuario_id, limite, offset]
        )
        return rows
    }

}

module.exports = Publicacion