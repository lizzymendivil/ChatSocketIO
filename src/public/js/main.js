$(function () {
    //conexion de socket del cliente

    const socket = io(); //mantiene la conexion bidireccional en tiempo real con el servidor
    //obteniendo los elementos del DOM
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    //obtaining DOM elements from the nicknameForm
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickname= $('#nickname');
    const $users= $('#usernames');

    $nickForm.submit(e => {
        e.preventDefault();
        socket.emit('new user', $nickname.val(), data => {
            if(data) {
                $('#nickWrap').hide();
                $('#contentWrap').show();
            } else {
                $nickError.html(`
                    <div class="alert alert-danger">
                        That username already exist.
                    </div>
                `);
            }
            $nickname.val('');
        });
    });

    //eventos
    $messageForm.submit( e => {
        e.preventDefault(); //paar que la pagina no se refresque
        console.log('sending data');
        // $messageBox.val(); //este es el dato que voy a enviar al servidor y el servidor
        //se encargara de retrasnmitirlo a los demas usuarios
        socket.emit('send:message', $messageBox.val());
        $messageBox.val('');
    });

    socket.on('new message', function(data){
        $chat.append('<b>' + data.nick + '</b>:' + data.msg + '<br/>');
    });

    socket.on('usernames', data => {
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`
        }
        $users.html(html);
    });
})



//codigo de javascript que permite utilizar la conexion de websocket del lado del cliente


