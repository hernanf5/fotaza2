# Fotaza 2

Plataforma web de fotografía para compartir, descubrir y coleccionar imágenes. Desarrollada como Trabajo Práctico Integrador para la materia **Programación Web II** — TUDS, UNLP.

---

## Tecnologías

- **Backend:** Node.js + Express
- **Vistas:** Pug (SSR)
- **Base de datos:** MySQL
- **CSS:** Tailwind CSS
- **Autenticación:** express-session + bcryptjs
- **Upload de imágenes:** Multer + Sharp (marca de agua)

---

## Requisitos previos

- Node.js v18 o superior
- MySQL 8.0 o superior (o XAMPP)
- npm

---

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/hernanf5/fotaza2.git
cd fotaza2
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiá el archivo de ejemplo y completá los valores:

```bash
cp .env.example .env
```

Editá `.env` con tus datos:

```
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=fotaza2

SESSION_SECRET=una_clave_secreta_larga
JWT_SECRET=otra_clave_secreta_larga
```

### 4. Inicializar la base de datos

Asegurate de tener MySQL corriendo y ejecutá:

```bash
npm run db:init
```

Esto crea la base de datos, las tablas, los triggers y los datos iniciales.

### 5. Ejecutar la aplicación

```bash
npm start
```

La aplicación quedará disponible en: **http://localhost:3000**

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor en producción |
| `npm run dev` | Inicia el servidor con nodemon (desarrollo) |
| `npm run db:init` | Crea e inicializa la base de datos |

---

## Usuarios de prueba

### Usuario estándar 1
- **Email:** usuario1@fotaza.com
- **Contraseña:** password123
- **Username:** usuario1

### Usuario estándar 2
- **Email:** usuario2@fotaza.com
- **Contraseña:** password123
- **Username:** usuario2

### Validador
- **Email:** validador@fotaza.com
- **Contraseña:** probando123
- **Rol:** Validador de contenidos


---

## Problemas encontrados y soluciones

### 1. `.gitignore` en UTF-16
Al crear el `.gitignore` desde el Explorador de Windows, el archivo se guardó en UTF-16 y Git no lo leía correctamente. **Solución:** recrearlo con PowerShell usando `[System.IO.File]::WriteAllText()` con encoding UTF-8 explícito.

### 2. Archivos ya trackeados por Git
`node_modules` y `.env` fueron commiteados antes de agregar el `.gitignore`. **Solución:** `git rm -r --cached` para quitar los archivos del tracking sin borrarlos localmente.

### 3. DELIMITER en scripts SQL con Node
El cliente MySQL de Node no entiende `DELIMITER $$` (es propio de la consola de MySQL). **Solución:** usar `multipleStatements: true` en la conexión y reemplazar los delimiters con regex antes de ejecutar el script.

### 4. Marca de agua con Sharp
Sharp requiere `memoryStorage` en Multer para procesar la imagen en memoria antes de guardarla. Con `diskStorage` el buffer no está disponible. **Solución:** cambiar a `memoryStorage` y guardar manualmente el archivo procesado.

### 5. Requires antes del middleware
Los modelos `Notificacion` y `Mensaje` se requerían después del middleware que los usaba, causando que fueran `undefined`. **Solución:** mover todos los `require` al inicio del `app.js`.
### 6. Errores de tipeo
En algunas ocasiones se dio el escenario de que las cosas no funcionaban como debia ser debido a errores de tipeo. **Solución:** ir debugeando con console log.

---

## Base de datos

El archivo `fotaza2.sql` en la raíz del proyecto contiene el esquema completo con tablas, triggers, constraints y datos iniciales necesarios para probar el sistema.

Se puede restaurar ejecutando `npm run db:init` o importando el archivo directamente en phpMyAdmin.