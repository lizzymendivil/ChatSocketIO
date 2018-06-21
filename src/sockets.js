//conexion de socket del servidor
module.exports = function(io) {
    //utilizando la memoria de nuestro servidor en vez de una BD
    let nicknames = [];

    io.on('connection', socket => {
        console.log('new user connected');

        socket.on('new user', (data, cb) => {
            console.log(data);
            if (nicknames.indexOf(data) != -1) {
                cb(false);
            } else {
                cb(true);
                socket.nickname = data;
                nicknames.push(socket.nickname);
                // io.sockets.emit('usernames', nicknames);
                updateNicknames();
            }
        });

        socket.on('send:message', data => {
            //hay que retrasnmitir el dato a todos los usuarios que estan
            //conectados a la app
            io.sockets.emit('new message', {
                msg: data,
                nick: socket.nickname
            });

        });

        socket.on('disconnect', data => {
            if(!socket.nickname) return;
            nicknames.splice(nicknames.indexOf(socket.nickname), 1);
            //io.sockets.emit('usernames', nicknames);
            updateNicknames();
        });

        function updateNicknames() {
            io.sockets.emit('usernames', nicknames);
        }
    });
}
