const Chat = require('./models/chat');

//conexion de socket del servidor
module.exports = function(io) {
    //utilizando la memoria de nuestro servidor en vez de una BD
    let users = {};

    io.on('connection', async socket => {
        console.log('new user connected');

        let messages = await Chat.find({}).limit(8);
        socket.emit('load old msgs', messages);

        socket.on('new user', (data, cb) => {
            console.log('new user!', data);
            if (data in users) {
                cb(false);
            } else {
                cb(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                //users.push(socket.nickname);
                // io.sockets.emit('usernames', nicknames);
                updateNicknames();
            }
        });

        socket.on('send:message', async (data, callback) => {
            //hay que retrasnmitir el dato a todos los usuarios que estan
            //conectados a la app
            var msg = data.trim();
            if (msg.substr(0,3) === '/w ') {
                msg = msg.substr(3);
                const index = msg.indexOf(' ');
                if (index !== -1) {
                    var name = msg.substring(0, index);
                    var msg = msg.substring(index + 1);
                    if (name in users) {
                        users[name].emit('whisper', {
                            msg,
                            nick: socket.nickname
                        }); //emitiendo un evento  de socket desde el servidor a ese usuario para un mensaje privado
                    } else {
                        callback('Error! Please enter a valid user.');
                    }
                } else {
                    callback('Error! Please enter your message.');
                }
            } else {
                var newMsg = new Chat({
                    msg,
                    nick: socket.nickname
                });
                await newMsg.save(); //metodo asincrono que toma tiempo

                io.sockets.emit('new message', {
                    msg: data,
                    nick: socket.nickname
                });
            }
        });

        socket.on('disconnect', data => {
            if(!socket.nickname) return;
            // nicknames.splice(nicknames.indexOf(socket.nickname), 1);
            delete users[socket.nickname];
            //io.sockets.emit('usernames', nicknames);
            updateNicknames();
        });

        function updateNicknames() {
            console.log('hhhh');
            io.sockets.emit('usernames', Object.keys(users));
        }
    });
}
