const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    // console.log('a user connected');

    console.log("Connection", socket.id);

    socket.on('disconnect', () => {
        console.log("Disconnect", socket.id);
        socket.broadcast.emit('remove', socket.id);
    });

    socket.on('move', (data) => {
        data.socket_id = socket.id;
        socket.broadcast.emit('move', data);
    });

});

server.listen(3000, () => {
    console.log('listening on localhost:3000');
});