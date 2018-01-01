var express = require('express');
var socket = require('socket.io');
var app = express();

app.use(express.static('public'));

var server = app.listen(4000, function() {
  console.log("listening at 4000");
});

var io = socket(server);

io.on('connection', function(socket){
  console.log('socket connection made');

  socket.on('chat', function(data){
    io.sockets.emit('chat', data);
  });

  socket.on('typing', function(data){
    socket.broadcast.emit('typing', data);
  });
});
