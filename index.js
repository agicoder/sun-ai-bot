const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const api = "AIzaSyC6PmNlQSpLaT3x_TuKV4Cueidv1HwAGNU";
var googleTranslate = require('google-translate')(api);
// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');

app.get('/', function(req, res) {
    res.render('index.ejs');
});

io.sockets.on('connection', function(socket) {
   
    socket.on('chat_message', function(message) {
        io.emit('chat_message_me', message)
        create_mp3(message)
        

        googleTranslate.translate(message, 'vi', function(err, translation) {
            io.emit('chat_message_bot', translation.translatedText);})
    });

});

async function create_mp3(message) {

  // Creates a client
  const client = new textToSpeech.TextToSpeechClient();

  // The text to synthesize
  const text = message;

  // Construct the request
  const request = {
    input: {text: text},
    // Select the language and SSML Voice Gender (optional)
    voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
    // Select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };
  // Performs the Text-to-Speech request
  const [response] = await client.synthesizeSpeech(request);''
  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  await writeFile('output.mp3', 'response'.audioContent, 'binary');
  console.log('Audio content written to file: output.mp3');
}
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

const server = http.listen(port, function() {
    console.log('listening on *:'+port);
});


