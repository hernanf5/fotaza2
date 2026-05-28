const pool = require('../database/connection')
const bcrypt = require('bcryptjs')

class Usuario {

    static async crear({ nombre, apellido, email, password, username, telefono, fecha_nacimiento }) {
        const conn = await pool.getConnection()
        try {
            //transacción para asegurar que ambas inserciones (persona y usuario) se realicen correctamente
            await conn.beginTransaction()

            const hash = await bcrypt.hash(password, 10)

            const [personaResult] = await conn.query(
                `INSERT INTO persona (nombre, apellido, email, password_hash, telefono, fecha_nacimiento)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [nombre, apellido, email, hash, telefono || null, fecha_nacimiento || null]
            )

            const personaId = personaResult.insertId

            const [usuarioResult] = await conn.query(
                `INSERT INTO usuario (persona_id, username) VALUES (?, ?)`,
                [personaId, username]
            )

            await conn.commit()
            return usuarioResult.insertId

        } catch (error) {
            await conn.rollback()
            throw error
        } finally {
            conn.release()
        }
    }

    static async buscarPorEmail(email) {
        const [rows] = await pool.query(
        `SELECT u.id, u.username, u.estado, u.persona_id,
                p.nombre, p.apellido, p.email, p.password_hash, p.avatar_url
        FROM usuario u
        JOIN persona p ON p.id = u.persona_id
        WHERE p.email = ?`,
        [email]
        )
        return rows[0] || null
    }

    static async buscarPorId(id) {
        const [rows] = await pool.query(
        `SELECT u.id, u.username, u.estado, u.persona_id,
                p.nombre, p.apellido, p.email, p.avatar_url
        FROM usuario u
        JOIN persona p ON p.id = u.persona_id
        WHERE u.id = ?`,
        [id]
        )
        return rows[0] || null
    }

    static async emailExiste(email) {
        const [rows] = await pool.query(
        `SELECT id FROM persona WHERE email = ?`,
        [email]
        )
        return rows.length > 0
    }

    static async usernameExiste(username) {
        const [rows] = await pool.query(
        `SELECT id FROM usuario WHERE username = ?`,
        [username]
        )
        return rows.length > 0
    }

    static async verificarPassword(passwordPlano, passwordHash) {
        return bcrypt.compare(passwordPlano, passwordHash)
    }


    // Validador 
    static async buscarValidadorPorEmail(email) {
        const [rows] = await pool.query(
            `SELECT v.id, v.persona_id,
                    p.nombre, p.apellido, p.email, p.password_hash
            FROM validador v
            JOIN persona p ON p.id = v.persona_id
            WHERE p.email = ?`,
            [email]
        )
        return rows[0] || null
    }
}

module.exports = Usuario