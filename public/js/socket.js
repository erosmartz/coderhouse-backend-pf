const socket = io()

socket.on('connection', () => {
	console.log('Cliente conectado')

	// Enviar mensaje al servidor
	socket.emit('mensaje', 'nuevo cliente conectado')
})

// Escuchar evento desde el servidor
socket.on('mensaje', (message) => {
	const messageList = document.getElementById('message-list')
	const messageItem = document.createElement('li')
	messageItem.textContent = message
	messageList.appendChild(messageItem)
})

const input = document.getElementById('message-input')
const buttonSocket = document.getElementById('send-button')

// Enviar mensaje al servidor al hacer clic botón 'Enviar'
buttonSocket.addEventListener('click', () => {
	const message = input.value
	if (message) {
		socket.emit('mensaje', message) // Enviar mensaje al servidor
		input.value = ''
	}
})
