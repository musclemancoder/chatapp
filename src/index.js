const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage,generateLocation } = require('./utils/messages');
require('./utils/messages')

const app = express();
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 5000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

let count = 0;
io.on('connection', (socket) => {
    console.log('New Websocket connection')

    socket.emit('Message', generateMessage('Welcome'))
    socket.broadcast.emit('Message', generateMessage('A new user has joined!')) // broadcast to all expect himself

    //Recieved from Client
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not Allowed!');
        }
        io.emit('Message', generateMessage(message))
        callback('Delivered!');
     })

    //For Count
    socket.emit('countUpdated', count)
    socket.on('increment', () => {
        count++;
        socket.emit('countUpdated', count)  // emit to specific connection with emit
        io.emit('countUpdated', count)  // emit to all  connections with io
    })

    //For Disconnection
    socket.on('disconnect', () => {
        io.emit('Message', generateMessage('User Has Left'))
    })

    //For Location Send
    socket.on('sendLocation', (coords, callback) => {
        io.emit('sendLocationMessage', generateLocation(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
})



server.listen(port, () => {
    console.log(`server is up on Port ${port} !`)
})