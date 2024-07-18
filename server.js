const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let messages = []; // Almacenar mensajes aquí

io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado');

  socket.on('join chat', (professionalId) => {
    socket.join(professionalId); // Unir al socket a la sala del profesional

    // Enviar mensajes anteriores al nuevo usuario
    const previousMessages = messages.filter(msg => msg.professionalId === professionalId);
    socket.emit('previous messages', previousMessages);
  });

  socket.on('chat message', ({ msg, professionalId }) => {
    console.log('Mensaje recibido:', msg);
    const messageData = { msg, professionalId };
    messages.push(messageData); // Almacenar el mensaje con el ID del profesional
    io.to(professionalId).emit('chat message', messageData); // Emitir solo a los sockets en la sala
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor Socket.IO escuchando en el puerto ${PORT}`);
});
