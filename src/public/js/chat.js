const socket = io()

// Unirse a la sala personal
socket.emit('join', USUARIO_ID)

const container = document.getElementById('mensajes-container')
const form = document.getElementById('form-mensaje')
const input = document.getElementById('input-mensaje')
const sinMensajes = document.getElementById('sin-mensajes')

// Scroll al final
function scrollAbajo() {
    container.scrollTop = container.scrollHeight
}
scrollAbajo()

// Crear burbuja de mensaje
function crearBurbuja(msg) {
    const esMio = msg.remitente_id === USUARIO_ID

    const wrapper = document.createElement('div')
    wrapper.className = 'flex ' + (esMio ? 'justify-end' : 'justify-start')
    wrapper.dataset.mensajeId = msg.id

    const hora = new Date(msg.created_at).toLocaleTimeString('es-AR', {
        hour: '2-digit', minute: '2-digit'
    })

    wrapper.innerHTML = `
        <div class="max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${esMio ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'}">
        <p class="text-sm">${msg.contenido}</p>
        <p class="text-xs mt-1 ${esMio ? 'text-on-primary/70' : 'text-on-surface-variant'}">${hora}</p>
        </div>
    `
    return wrapper
}

// Recibir mensaje nuevo
socket.on('mensaje_nuevo', (msg) => {
    if (sinMensajes) sinMensajes.remove()

    // Evitar duplicados
    if (document.querySelector(`[data-mensaje-id="${msg.id}"]`)) return

    container.appendChild(crearBurbuja(msg))
    scrollAbajo()
})

// Enviar mensaje
form.addEventListener('submit', (e) => {
    e.preventDefault()
    const contenido = input.value.trim()
    if (!contenido) return

    socket.emit('mensaje', {
        remitente_id:       USUARIO_ID,
        destinatario_id:    OTRO_USUARIO_ID,
        contenido,
        remitente_username: USERNAME,
    })

    input.value = ''
})