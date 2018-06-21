$(function () {
    //conexion de socket del cliente

    const socket = io(); //mantiene la conexion bidireccional en tiempo real con el servidor
    //obteniendo los elementos del DOM
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

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
        $chat.append(data + '<br/>');
    });
})



//codigo de javascript que permite utilizar la conexion de websocket del lado del cliente


