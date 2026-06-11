# Fotaza 2

Fotaza 2 es una plataforma web que permite publicar y adquirir imágenes, con un sistema de colecciones personales y seguimiento de usuarios, lo que la convierte en una comunidad completa para fotógrafos y amantes de la fotografía.

Desarrollado como Trabajo Práctico Integrador para la materia **Programación Web II** — Tecnicatura en Desarrollo de Software, Universidad de La Punta.

### Tecnologías utilizadas

- **Backend:** Node.js + Express
- **Vistas:** Pug (Server Side Rendering)
- **Base de datos:** MySQL
- **CSS:** Tailwind CSS
- **Autenticación:** express-session + bcryptjs
- **Chat en tiempo real:** Socket.io
- **Upload y procesamiento de imágenes:** Multer + Sharp



## Instalación y ejecución local

### Requisitos previos

- Node.js v18 o superior
- MySQL 8.0 o superior (o XAMPP)
- npm

### Pasos

**1. Clonar el repositorio**
```bash
git clone https://github.com/hernanf5/fotaza2
cd fotaza2
```

**2. Instalar dependencias**
```bash
npm install
```

**3. Configurar variables de entorno**

Copiá el archivo `.env.example` y renombralo a `.env`, luego completá los valores con tu configuración local.

Los valores usados en mi caso son:
SESSION_SECRET=qwreh324xx1
JWT_SECRET=jrksncxi2211

> Los valores de `SESSION_SECRET` y `JWT_SECRET` pueden ser cualquier cadena de texto. Los de base de datos dependen de tu configuración local.

**4. Inicializar la base de datos**

Asegurate de tener MySQL corriendo y ejecutá:
```bash
npm run db:init
```

Esto crea la base de datos, las tablas, los triggers y carga los datos iniciales necesarios para probar el sistema.

**5. Ejecutar la aplicación**
```bash
npm start
```

La aplicación queda disponible en **http://localhost:3000**




## Usuarios de prueba

### Usuarios estándar

| Usuario | Email | Contraseña |
|---|---|---|
| usuario1 | usuario1@fotaza.com | password123 |
| usuario2 | usuario2@fotaza.com | password123 |
| usuario4 | usuario4@fotaza.com | password123 |
| usuario5 | usuario5@fotaza.com | password123 |
| usuario6 | usuario6@fotaza.com | password123 |
| usuario7 | usuario7@fotaza.com | password123 |

### Validador

| Usuario | Email | Contraseña |
|---|---|---|
| validador | validador@fotaza.com | password123 |

## Demo en producción

🌐 [https://fotaza2-production-51ef.up.railway.app](https://fotaza2-production-51ef.up.railway.app)




## Problemas encontrados y soluciones

**1. `.gitignore` en UTF-16**
Al crear el `.gitignore` desde el Explorador de Windows, el archivo se guardó en UTF-16 y Git no lo interpretaba correctamente, por lo que ignoraba el archivo. Lo resolví recreándolo desde PowerShell usando `[System.IO.File]::WriteAllText()` con encoding UTF-8 explícito.

**2. `node_modules` y `.env` ya trackeados por Git**
Antes de que el `.gitignore` funcionara correctamente, Git ya había trackeado esas carpetas y archivos. Lo resolví con `git rm -r --cached` para quitarlos del tracking sin borrarlos localmente.

**3. `DELIMITER $$` en el script SQL**
El cliente MySQL de Node no entiende `DELIMITER $$` porque es propio de la consola de MySQL. Lo resolví usando `multipleStatements: true` en la conexión y reemplazando los delimiters con regex antes de ejecutar el script.

**4. `Assignment to constant variable` en el init de la BD**
La variable `sql` estaba declarada con `const` y luego se intentaba reasignar. Lo resolví cambiándola a `let`.

**5. `res.redirect('back')` con URL incorrecta**
En el controller de valoraciones, `res.redirect('back')` fallaba cuando no había header `Referer`. Lo resolví construyendo la URL de redirección manualmente usando el `publicacion_id` obtenido de la imagen.

**6. Sharp requiere `memoryStorage` en Multer**
Al intentar procesar imágenes con Sharp, el buffer no estaba disponible porque Multer usaba `diskStorage`. Lo resolví cambiando a `memoryStorage` y guardando el archivo procesado manualmente después.

**7. Requires de modelos después del middleware**
Los modelos `Notificacion` y `Mensaje` se requerían después del middleware que los usaba, causando que fueran `undefined` en tiempo de ejecución. Lo resolví moviendo todos los `require` al inicio del `app.js`.

**8. Socket.io no servía su cliente**
`http.createServer()` se llamaba sin pasarle `app` como argumento, por lo que Express no estaba vinculado al servidor HTTP y Socket.io no podía servir su archivo cliente. Lo resolví pasando `app` correctamente: `http.createServer(app)`.

**9. Triggers de valoración rompían al hacer inserts masivos**
Al intentar insertar valoraciones de prueba en masa, MySQL tiraba el error `Can't update table 'imagen' in stored function/trigger`. Lo resolví dropeando temporalmente los triggers, insertando los datos, actualizando los promedios manualmente con `COALESCE` y recreando los triggers.

**10. Indentación mezclada tabs/espacios en Pug**
Pug es muy sensible a la indentación y mezclar tabs con espacios al copiar código rompía las vistas sin mostrar errores claros. Lo resolví estandarizando el uso de tabs en todos los archivos `.pug` y usando la opción "Convert Indentation to Tabs" de VS Code.

**11. Variables de entorno no cargando en producción**
Al deployar en Railway, las variables de entorno del `.env` local no se transferían automáticamente. Lo resolví configurando cada variable manualmente desde el panel de Railway en la sección Variables del servicio.

