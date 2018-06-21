//conexion de socket del servidor
module.exports = function(io) {
    io.on('connection', socket => {
        console.log('new user connected');
        socket.on('send:message', function(data){
            //hay que retrasnmitir el dato a todos los usuarios que estan
            //conectados a la app
            io.sockets.emit('new message', data);
        });
    });
}
