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

    static async obtenerComentariosDenunciadosDePublicacion(publicacion_id) {
        // Primero obtenemos los comentarios denunciados
        const [comentarios] = await pool.query(
            `SELECT c.id as comentario_id, c.contenido, c.created_at as comentario_fecha,
                    u.username as autor_comentario, u.id as autor_id,
                    COUNT(dc.id) as total_denuncias
            FROM comentario c
            JOIN usuario u ON u.id = c.usuario_id
            JOIN denuncia_comentario dc ON dc.comentario_id = c.id
            WHERE c.publicacion_id = ? AND c.activo = 1
            GROUP BY c.id
            ORDER BY total_denuncias DESC`,
            [publicacion_id]
        )

        // Para cada comentario obtenemos sus denuncias
        for (const comentario of comentarios) {
            const [denuncias] = await pool.query(
            `SELECT m.descripcion as motivo, dc.descripcion, u.username as usuario
            FROM denuncia_comentario dc
            JOIN motivo_denuncia m ON m.id = dc.motivo_id
            JOIN usuario u ON u.id = dc.usuario_id
            WHERE dc.comentario_id = ?`,
            [comentario.comentario_id]
            )
            comentario.denuncias = denuncias
        }
        console.log('publicacion_id buscado:', publicacion_id)
        console.log('comentarios encontrados:', comentarios)
        return comentarios
    }

}

module.exports = Denuncia