const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var usernames = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        socket.broadcast.emit('remove', socket.id);
        
         // remove the username from global usernames list if connected
        if(socket.username){
            usernames.splice(usernames.indexOf(socket.username), 1);
        }
    });

    socket.on('login', (data) => {
        if (usernames.includes(data.username)) {
            socket.emit('login', {success: false, message: 'Username already taken'});
        } else {
            usernames.push(data.username);
            socket.username = data.username;
            socket.color = data.color;
            socket.emit('login', {success: true, message: 'Logged in'});
        }
    });

    socket.on('move', (position) => {
        let data = {
            ...position,
            username: socket.username,
            color: socket.color,
            socket_id: socket.id,
        };
        socket.broadcast.emit('move', data);
    });
});

server.listen(3000, () => {
    console.log('listening on localhost:3000');
});