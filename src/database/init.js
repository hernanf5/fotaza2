const mysql = require('mysql2/promise')
const fs    = require('fs')
const path  = require('path')
require('dotenv').config()

async function init() {
  let connection

  try {
    // Primero conectamos sin especificar la BD para poder crearla
    connection = await mysql.createConnection({
      host:     process.env.DB_HOST,
      port:     process.env.DB_PORT,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    })

    console.log('Conectado a MySQL')

    // Creamos la base de datos si no existe
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    )
    console.log(`Base de datos '${process.env.DB_NAME}' lista`)

    await connection.query(`USE \`${process.env.DB_NAME}\``)

    // Leemos y ejecutamos el SQL del esquema
    const sqlPath = path.join(__dirname, '..', '..', 'fotaza2.sql')
    const sql     = fs.readFileSync(sqlPath, 'utf8')

    // Separamos por punto y coma para ejecutar cada sentencia
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('DELIMITER'))

    for (const statement of statements) {
      await connection.query(statement)
    }

    console.log('Esquema creado correctamente')
    console.log('Base de datos inicializada. Ya podés correr npm start')

  } catch (error) {
    console.error('Error al inicializar la base de datos:', error.message)
    process.exit(1)
  } finally {
    if (connection) await connection.end()
  }
}

init()