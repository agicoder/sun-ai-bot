const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const api = "AIzaSyC6PmNlQSpLaT3x_TuKV4Cueidv1HwAGNU";
var googleTranslate = require('google-translate')(api);

app.get('/', function(req, res) {
    res.render('index.ejs');
});

io.sockets.on('connection', function(socket) {
   
    socket.on('chat_message', function(message) {
        io.emit('chat_message_me', message)
        googleTranslate.translate(message, 'vi', function(err, translation) {
        io.emit('chat_message_bot', translation.translatedText);})
    });

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

const server = http.listen(port, function() {
    console.log('listening on *:'+port);
});


