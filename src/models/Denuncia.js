const pool = require('../database/connection')

class Denuncia {

    static async obtenerMotivos() {
        const [rows] = await pool.query(
        `SELECT * FROM motivo_denuncia ORDER BY id`
        )
        return rows
    }

    // Denuncias de publicaciones
    static async denunciarPublicacion({ publicacion_id, usuario_id, motivo_id, descripcion }) {
        await pool.query(
        `INSERT INTO denuncia_publicacion (publicacion_id, usuario_id, motivo_id, descripcion)
        VALUES (?, ?, ?, ?)`,
        [publicacion_id, usuario_id, motivo_id, descripcion]
        )
    }

    static async usuarioYaDenuncioPublicacion(publicacion_id, usuario_id) {
        const [rows] = await pool.query(
        `SELECT id FROM denuncia_publicacion
        WHERE publicacion_id = ? AND usuario_id = ?`,
        [publicacion_id, usuario_id]
        )
        return rows.length > 0
    }

    static async contarDenunciasPublicacion(publicacion_id) {
        const [rows] = await pool.query(
        `SELECT COUNT(DISTINCT usuario_id) as total
        FROM denuncia_publicacion
        WHERE publicacion_id = ?`,
        [publicacion_id]
        )
        return parseInt(rows[0].total)
    }

    static async obtenerDenunciasPublicacion(publicacion_id) {
        const [rows] = await pool.query(
        `SELECT dp.*, u.username, m.descripcion as motivo
        FROM denuncia_publicacion dp
        JOIN usuario u ON u.id = dp.usuario_id
        JOIN motivo_denuncia m ON m.id = dp.motivo_id
        WHERE dp.publicacion_id = ?
        ORDER BY dp.created_at DESC`,
        [publicacion_id]
        )
        return rows
    }

    // Denuncias de comentarios
    static async denunciarComentario({ comentario_id, usuario_id, motivo_id, descripcion }) {
        await pool.query(
        `INSERT INTO denuncia_comentario (comentario_id, usuario_id, motivo_id, descripcion)
        VALUES (?, ?, ?, ?)`,
        [comentario_id, usuario_id, motivo_id, descripcion]
        )
    }

    static async usuarioYaDenuncioComentario(comentario_id, usuario_id) {
        const [rows] = await pool.query(
        `SELECT id FROM denuncia_comentario
        WHERE comentario_id = ? AND usuario_id = ?`,
        [comentario_id, usuario_id]
        )
        return rows.length > 0
    }

    static async obtenerDenunciasComentario(comentario_id) {
        const [rows] = await pool.query(
        `SELECT dc.*, u.username, m.descripcion as motivo
        FROM denuncia_comentario dc
        JOIN usuario u ON u.id = dc.usuario_id
        JOIN motivo_denuncia m ON m.id = dc.motivo_id
        WHERE dc.comentario_id = ?
        ORDER BY dc.created_at DESC`,
        [comentario_id]
        )
        return rows
    }

    // Para el validador
    static async obtenerPublicacionesEnRevision() {
        const [rows] = await pool.query(
        `SELECT p.*, u.username,
                (SELECT url FROM imagen WHERE publicacion_id = p.id LIMIT 1) as imagen_portada,
                COUNT(dp.id) as total_denuncias
        FROM publicacion p
        JOIN usuario u ON u.id = p.usuario_id
        JOIN denuncia_publicacion dp ON dp.publicacion_id = p.id
        WHERE p.estado = 1
        GROUP BY p.id
        ORDER BY total_denuncias DESC`,
        )
        return rows
    }

}

module.exports = Denuncia