const pool = require('../database/connection')

class Buscador {

    static async buscar({ q, etiqueta, licencia, valoracion_min, orden, limite = 20, offset = 0, soloPublicas = false }) {
        let conditions = ['p.estado = 0']
        let params     = []

        //nuevo filtro para solo mostrar publicaciones con imágenes libres para usuarios no registrados
        if (soloPublicas) {
            conditions.push(`NOT EXISTS (SELECT 1 FROM imagen WHERE publicacion_id = p.id AND licencia = 'copyright')`)
        }
        // Búsqueda por texto en título o descripción
        if (q && q.trim()) {
            conditions.push('(p.titulo LIKE ? OR p.descripcion LIKE ?)')
            params.push(`%${q.trim()}%`, `%${q.trim()}%`)
        }

        // Filtro por etiqueta
        if (etiqueta && etiqueta.trim()) {
            conditions.push(`p.id IN (
                SELECT pe.publicacion_id FROM publicacion_etiqueta pe
                JOIN etiqueta e ON e.id = pe.etiqueta_id
                WHERE e.nombre = ?
            )`)
            params.push(etiqueta.trim().toLowerCase())
        }

        // Filtro por licencia
        if (licencia && ['copyright', 'libre'].includes(licencia)) {
            conditions.push('EXISTS (SELECT 1 FROM imagen i WHERE i.publicacion_id = p.id AND i.licencia = ?)')
            params.push(licencia)
        }

        // Filtro por valoración mínima
        if (valoracion_min && !isNaN(valoracion_min)) {
            conditions.push('EXISTS (SELECT 1 FROM imagen i WHERE i.publicacion_id = p.id AND i.valoracion_promedio >= ?)')
            params.push(parseFloat(valoracion_min))
        }

        const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''

        // Orden
        let orderBy = 'p.created_at DESC'
        if (orden === 'valoracion') {
            orderBy = '(SELECT MAX(i.valoracion_promedio) FROM imagen i WHERE i.publicacion_id = p.id) DESC'
        } else if (orden === 'votos') {
            orderBy = '(SELECT MAX(i.total_valoraciones) FROM imagen i WHERE i.publicacion_id = p.id) DESC'
        }

        const sql = `
        SELECT p.*, u.username,
                pe.avatar_url,
                (SELECT url FROM imagen WHERE publicacion_id = p.id LIMIT 1) as imagen_portada,
                (SELECT COUNT(*) FROM comentario WHERE publicacion_id = p.id AND activo = 1) as total_comentarios,
                (SELECT MAX(valoracion_promedio) FROM imagen WHERE publicacion_id = p.id) as mejor_valoracion
        FROM publicacion p
        JOIN usuario u ON u.id = p.usuario_id
        JOIN persona pe ON pe.id = u.persona_id
        ${where}
        ORDER BY ${orderBy}
        LIMIT ? OFFSET ?
        `

        params.push(limite, offset)
        const [rows] = await pool.query(sql, params)
        return rows
    }

    static async contarResultados({ q, etiqueta, licencia, valoracion_min, soloPublicas = false }) {
        let conditions = ['p.estado = 0']
        let params     = []

        if (soloPublicas) {
            conditions.push(`NOT EXISTS (SELECT 1 FROM imagen WHERE publicacion_id = p.id AND licencia = 'copyright')`)
        }

        if (q && q.trim()) {
            conditions.push('(p.titulo LIKE ? OR p.descripcion LIKE ?)')
            params.push(`%${q.trim()}%`, `%${q.trim()}%`)
        }

        if (etiqueta && etiqueta.trim()) {
            conditions.push(`p.id IN (
                SELECT pe.publicacion_id FROM publicacion_etiqueta pe
                JOIN etiqueta e ON e.id = pe.etiqueta_id
                WHERE e.nombre = ?
            )`)
            params.push(etiqueta.trim().toLowerCase())
        }

        if (licencia && ['copyright', 'libre'].includes(licencia)) {
            conditions.push('EXISTS (SELECT 1 FROM imagen i WHERE i.publicacion_id = p.id AND i.licencia = ?)')
            params.push(licencia)
        }

        if (valoracion_min && !isNaN(valoracion_min)) {
            conditions.push('EXISTS (SELECT 1 FROM imagen i WHERE i.publicacion_id = p.id AND i.valoracion_promedio >= ?)')
            params.push(parseFloat(valoracion_min))
        }

        const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''

        const [rows] = await pool.query(
        `SELECT COUNT(*) as total FROM publicacion p ${where}`,
        params
        )
        return parseInt(rows[0].total)
    }

}

module.exports = Buscador