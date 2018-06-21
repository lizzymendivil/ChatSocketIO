const http = require('http'); //utilizar el modulo http para crear un servidor a traves de su createserver
const path = require('path');

const express = require('express');
const socketio = require('socket.io'); //modulo que permite hacer conexion en tiempo real
//este modulo funciona encima de un servidor
//primero ya tiene que haber un servidor


const app = express(); //ejecutamos express y devuelve un objeto con opciones de funciones de express

const server = http.createServer(app);
const io = socketio.listen(server); //devuelve una conexion socket

//settings
app.set('port', process.env.PORT || 3000);

require('./sockets')(io);
//static files
app.use(express.static(path.join(__dirname, 'public')));


//starting the server
server.listen(app.get('port'), () => { //ya no app.listen
    console.log('server on port ', app.get('port'));
}); //ejecuta un servidor que escucha en un puerto del computador

